import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { getSupabaseServer, hasSupabase } from '@/lib/supabase'
import { sendEmail } from '@/lib/email'
import { Document, Packer, Paragraph, HeadingLevel, TextRun } from 'docx'

// Genereaza automat raportul de evaluare NIS2/ISO 27001 pentru un submission din
// evaluari_nis2 (identificat prin ?id=), folosind Groq pentru continutul text,
// il transforma in DOCX si il trimite pe email catre Catalin. Declansat printr-un
// link/buton din emailul de notificare — zero pasi manuali pentru Catalin.

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const ETICHETE: Record<string, string> = {
  q1_acces_controlat: 'Acces la date controlat',
  q2_revocare_acces: 'Revocare acces la plecarea angajatului',
  q3_2fa: 'Autentificare cu doi factori',
  q4_backup: 'Backup regulat',
  q5_test_restaurare: 'Testare restaurare backup',
  q6_incident_avut: 'Incident de securitate in trecut',
  q7_plan_incident: 'Plan scris pentru incidente',
  q8_politici_scrise: 'Politici scrise de utilizare',
  q9_furnizori_verificati: 'Furnizori/terti verificati',
  q10_responsabil: 'Responsabil desemnat cu securitatea',
}

function raspunsuriText(b: Record<string, unknown>): string {
  return Object.entries(ETICHETE).map(([cheie, eticheta]) => {
    const val = (b[cheie] || '—').toString()
    const nota = (b[`${cheie}_nota`] || '').toString().trim()
    return `- ${eticheta}: ${val}${nota ? ` (detaliu client: ${nota})` : ''}`
  }).join('\n')
}

async function genereazaContinut(firma: string, raspunsuri: Record<string, unknown>): Promise<string> {
  const prompt = `Ești consultant de securitate a informației pentru NEWTIME CONCEPT SOLUTIONS SRL.
Scrie un raport de evaluare gratuită de conformitate NIS2/ISO 27001 pentru firma "${firma}",
pe baza răspunsurilor lor la un chestionar (mai jos). Ton profesionist, direct, în română.

Structurează EXACT așa, cu titluri pe linie proprie care încep cu "## ":

## Rezumat
(2-3 propoziții despre stadiul general al firmei)

## Ce aveți deja bine
(listă cu "- ", doar punctele cu răspuns Da)

## Ce lipsește — prioritizat
(listă cu "- ", punctele cu răspuns Nu sau Parțial, cele mai critice primele: acces/autentificare
și backup sunt cele mai critice, politici scrise și responsabil desemnat sunt importante dar mai puțin urgente)

## Recomandare
(1 paragraf, recomanzi pachetul de conformitate NIS2 de bază, preț estimat 6.000-9.000 lei pentru
firme mici, cu mențiunea că prețul final depinde de câte puncte lipsesc)

Răspunsurile firmei:
${raspunsuriText(raspunsuri)}`

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
    max_tokens: 1200,
  })
  return completion.choices[0]?.message?.content || 'Nu s-a putut genera conținutul.'
}

function textToDocx(firma: string, continut: string): Document {
  const paragrafe: Paragraph[] = [
    new Paragraph({
      text: `Evaluare de conformitate NIS2 / ISO 27001 — ${firma}`,
      heading: HeadingLevel.TITLE,
    }),
    new Paragraph({
      children: [new TextRun({ text: 'NEWTIME CONCEPT SOLUTIONS SRL · document generat automat', italics: true, color: '595959' })],
      spacing: { after: 300 },
    }),
  ]

  for (const linie of continut.split('\n')) {
    const l = linie.trim()
    if (!l) continue
    if (l.startsWith('## ')) {
      paragrafe.push(new Paragraph({ text: l.replace('## ', ''), heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 120 } }))
    } else if (l.startsWith('- ')) {
      paragrafe.push(new Paragraph({ text: l.replace('- ', ''), bullet: { level: 0 } }))
    } else {
      paragrafe.push(new Paragraph({ text: l, spacing: { after: 100 } }))
    }
  }

  return new Document({ sections: [{ children: paragrafe }] })
}

function paginaConfirmare(mesaj: string, ok: boolean): NextResponse {
  const html = `<!DOCTYPE html><html lang="ro"><head><meta charset="utf-8">
  <style>body{font-family:Segoe UI,Arial,sans-serif;background:#0f172a;color:#fff;display:flex;
  align-items:center;justify-content:center;height:100vh;margin:0}
  .box{text-align:center;max-width:420px;padding:24px}
  .ok{color:#4ade80}.err{color:#f87171}</style></head>
  <body><div class="box"><h2 class="${ok ? 'ok' : 'err'}">${ok ? '✓' : '✕'}</h2><p>${mesaj}</p></div></body></html>`
  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}

export async function GET(req: NextRequest) {
  try {
    const id = new URL(req.url).searchParams.get('id')
    if (!id) return paginaConfirmare('Lipsește id-ul evaluării.', false)
    if (!hasSupabase()) return paginaConfirmare('Supabase nu e configurat.', false)

    const sb = getSupabaseServer()
    if (!sb) return paginaConfirmare('Supabase nu e configurat.', false)

    const { data, error } = await sb.from('evaluari_nis2').select('*').eq('id', id).single()
    if (error || !data) return paginaConfirmare('Evaluarea nu a fost găsită.', false)

    const continut = await genereazaContinut(data.firma, data.raspunsuri || {})
    const doc = textToDocx(data.firma, continut)
    const buffer = await Packer.toBuffer(doc)

    const ok = await sendEmail({
      to: 'contact@aicraiova.ro',
      from: 'NEWTIME <noreply@aicraiova.ro>',
      subject: `Raport generat — ${data.firma}`,
      html: `<p>Raportul de evaluare NIS2/ISO 27001 pentru <strong>${data.firma}</strong> a fost generat automat și e atașat aici.</p>`,
      attachments: [{ filename: `Evaluare NIS2 - ${data.firma}.docx`, content: buffer.toString('base64') }],
    })

    if (!ok) return paginaConfirmare('Raportul a fost generat, dar emailul nu a putut fi trimis. Verifică RESEND_API_KEY.', false)
    return paginaConfirmare(`Raport generat și trimis pe email pentru ${data.firma}.`, true)
  } catch (e) {
    console.error('[evaluare-nis2/genereaza]', e)
    return paginaConfirmare('Eroare la generare. Verifică log-urile din Vercel.', false)
  }
}
