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

// Actiune concreta de trimis catre IT-ul clientului, in functie de raspuns.
// q6 (incident in trecut) nu are actiune tehnica — e doar informativ, exclus din plan.
const ACTIUNI: Record<string, { nu: string; partial: string; da: string }> = {
  q1_acces_controlat: {
    nu: 'Implementați control de acces pe bază de roluri pentru datele importante (contracte, date clienți, cod sursă).',
    partial: 'Completați controlul de acces — extindeți-l la toate sistemele/datele importante.',
    da: 'Formalizați în scris politica de control acces deja aplicată.',
  },
  q2_revocare_acces: {
    nu: 'Stabiliți o procedură de revocare imediată a accesului la plecarea unui angajat.',
    partial: 'Eliminați întârzierea din procesul de revocare acces — trebuie să fie imediată.',
    da: 'Formalizați în scris procedura de revocare acces deja aplicată.',
  },
  q3_2fa: {
    nu: 'Activați autentificare cu doi factori (2FA) pe toate conturile importante.',
    partial: 'Extindeți 2FA de la conturile parțiale la toate conturile importante.',
    da: 'Formalizați în scris politica de autentificare deja aplicată.',
  },
  q4_backup: {
    nu: 'Configurați backup automat, regulat, al datelor importante.',
    partial: 'Stabiliți un program regulat de backup, nu ocazional.',
    da: 'Formalizați în scris procedura de backup deja aplicată.',
  },
  q5_test_restaurare: {
    nu: 'Testați procesul de restaurare din backup, ca să confirmați că funcționează.',
    partial: 'Programați testări periodice de restaurare, nu doar una singură.',
    da: 'Formalizați în scris procedura de testare a restaurării.',
  },
  q7_plan_incident: {
    nu: 'Redactați un plan scris de răspuns la incidente de securitate.',
    partial: 'Puneți în scris pașii de răspuns la incidente pe care echipa îi știe informal.',
    da: 'Formalizați/actualizați planul de răspuns la incidente deja existent.',
  },
  q8_politici_scrise: {
    nu: 'Redactați politici scrise de utilizare a echipamentelor și datelor firmei.',
    partial: 'Puneți în scris regulile informale deja aplicate.',
    da: 'Revizuiți politicile scrise existente pentru conformitate NIS2/ISO 27001.',
  },
  q9_furnizori_verificati: {
    nu: 'Identificați furnizorii/terții cu acces la date și evaluați securitatea lor.',
    partial: 'Documentați formal evaluarea furnizorilor deja făcută informal.',
    da: 'Formalizați în scris procesul de verificare a furnizorilor.',
  },
  q10_responsabil: {
    nu: 'Desemnați oficial, în scris, un responsabil cu securitatea informației.',
    partial: 'Formalizați oficial rolul persoanei care se ocupă informal de securitate.',
    da: 'Confirmați în scris responsabilitățile persoanei desemnate.',
  },
}

function planAcțiuneHtml(b: Record<string, unknown>): string {
  const grupuri: Record<'nu' | 'partial' | 'da', string[]> = { nu: [], partial: [], da: [] }
  for (const [cheie, actiuni] of Object.entries(ACTIUNI)) {
    const val = (b[cheie] || '').toString()
    if (val === 'nu' || val === 'partial' || val === 'da') {
      grupuri[val].push(actiuni[val])
    }
  }
  const sectiune = (titlu: string, culoare: string, items: string[]) => {
    if (!items.length) return ''
    return `<div style="margin-top:14px">
      <div style="font-size:12px;font-weight:700;color:${culoare};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">${titlu} (${items.length})</div>
      <ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.6">${items.map((i) => `<li>${i}</li>`).join('')}</ul>
    </div>`
  }
  return sectiune('🔴 De implementat de la zero', '#b0272c', grupuri.nu) +
    sectiune('🟡 De completat', '#a16207', grupuri.partial) +
    sectiune('🟢 De formalizat în scris (există deja în practică)', '#1a7a3c', grupuri.da)
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

    let evaluareId: string | null = null
    if (hasSupabase()) {
      const sb = getSupabaseServer()
      if (sb) {
        const { data, error } = await sb.from('evaluari_nis2').insert({ firma, cui, contact, email, raspunsuri: b }).select('id').single()
        if (error) console.error('[evaluare-nis2] insert', error.message)
        else evaluareId = data?.id || null
      }
    }

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aicraiova.ro'
    const butonGenerare = evaluareId
      ? `<p style="margin:16px 0"><a href="${BASE_URL}/api/evaluare-nis2/genereaza?id=${evaluareId}" style="display:inline-block;background:#C9A84C;color:#0f172a;text-decoration:none;padding:11px 20px;border-radius:8px;font-weight:700;font-size:14px">📄 Generează raportul automat (AI) și trimite-mi-l pe email</a></p>`
      : ''

    // Notificare instant catre Catalin — inlocuieste temporar generarea de PDF.
sendEmail({
      to: 'contact@aicraiova.ro',
      from: 'NEWTIME <noreply@aicraiova.ro>',
      subject: `Evaluare NIS2 nouă — ${firma}`,
      html: `<div style="font-family:Segoe UI,Arial,sans-serif;max-width:640px;margin:0 auto;color:#1e293b">
        <div style="background:#0f172a;color:#fff;padding:18px 22px;border-radius:10px 10px 0 0">
          <div style="font-size:12px;color:#C9A84C;letter-spacing:1px;text-transform:uppercase">AI Craiova · NEWTIME CONCEPT SOLUTIONS SRL</div>
          <div style="font-size:18px;font-weight:800">Evaluare NIS2/ISO 27001 nouă</div>
        </div>
        <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 10px 10px;padding:20px">
          <p style="font-size:14px"><strong>${firma}</strong>${cui ? ` (CUI ${cui})` : ''}<br/>
          Contact: ${contact} · <a href="mailto:${email}">${email}</a></p>

          ${butonGenerare}

          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px 16px;margin:14px 0">
            <div style="font-size:13px;font-weight:700;color:#0f172a;margin-bottom:2px">Plan de acțiune — gata de trimis către IT-ul clientului</div>
            ${planAcțiuneHtml(b)}
          </div>

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
