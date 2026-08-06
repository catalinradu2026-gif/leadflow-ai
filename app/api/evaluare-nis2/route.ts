import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'
import { getSupabaseServer, hasSupabase } from '@/lib/supabase'
import { sendEmail } from '@/lib/email'

// Evaluare gratuita de conformitate NIS2/ISO 27001 — formular /evaluare-nis2.
// Nu are legatura cu ARACIP. Salveaza in evaluari_nis2 (daca Supabase e configurat)
// si trimite mereu un email catre contact@aicraiova.ro cu raspunsurile brute.

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

function randLabel(v: unknown): string {
  const s = (v || '').toString()
  if (s === 'da') return '🟢 Da'
  if (s === 'partial') return '🟡 Parțial'
  if (s === 'nu') return '🔴 Nu'
  return s || '—'
}

function randuriHtml(b: Record<string, unknown>): string {
  return Object.entries(ETICHETE).map(([cheie, eticheta]) => {
    const nota = (b[`${cheie}_nota`] || '').toString().trim()
    return `<tr>
      <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;font-size:13px">${eticheta}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;font-size:13px;white-space:nowrap">${randLabel(b[cheie])}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b">${nota || '—'}</td>
    </tr>`
  }).join('')
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!rateLimit(`evaluare-nis2:${ip}`, 5, 60_000)) {
      return NextResponse.json({ ok: false, error: 'Prea multe cereri, încercați mai târziu.' }, { status: 429 })
    }

    const b = await req.json().catch(() => ({})) as Record<string, unknown>
    const firma = (b.firma || '').toString().trim().slice(0, 200)
    const contact = (b.contact || '').toString().trim().slice(0, 120)
    const email = (b.email || '').toString().trim().slice(0, 160)
    const cui = (b.cui || '').toString().trim().slice(0, 40) || null

    if (!firma || !contact || !email) {
      return NextResponse.json({ ok: false, error: 'Firma, persoana de contact și emailul sunt obligatorii.' }, { status: 400 })
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'Email invalid.' }, { status: 400 })
    }

    if (hasSupabase()) {
      const sb = getSupabaseServer()
      if (sb) {
        const { error } = await sb.from('evaluari_nis2').insert({ firma, cui, contact, email, raspunsuri: b })
        if (error) console.error('[evaluare-nis2] insert', error.message)
      }
    }

    // Notificare instant catre Catalin — inlocuieste temporar generarea de PDF.
    sendEmail({
      to: 'contact@aicraiova.ro',
      subject: `Evaluare NIS2 nouă — ${firma}`,
      html: `<div style="font-family:Segoe UI,Arial,sans-serif;max-width:640px;margin:0 auto;color:#1e293b">
        <div style="background:#0f172a;color:#fff;padding:18px 22px;border-radius:10px 10px 0 0">
          <div style="font-size:12px;color:#C9A84C;letter-spacing:1px;text-transform:uppercase">AI Craiova · NEWTIME</div>
          <div style="font-size:18px;font-weight:800">Evaluare NIS2/ISO 27001 nouă</div>
        </div>
        <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 10px 10px;padding:20px">
          <p style="font-size:14px"><strong>${firma}</strong>${cui ? ` (CUI ${cui})` : ''}<br/>
          Contact: ${contact} · <a href="mailto:${email}">${email}</a></p>
          <table style="width:100%;border-collapse:collapse;margin-top:10px">${randuriHtml(b)}</table>
          <p style="font-size:12px;color:#94a3b8;margin-top:16px">Trimis automat de pe aicraiova.ro/evaluare-nis2</p>
        </div>
      </div>`,
    }).catch(() => {})

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[evaluare-nis2] POST', e)
    return NextResponse.json({ ok: false, error: 'Eroare server.' }, { status: 500 })
  }
}
