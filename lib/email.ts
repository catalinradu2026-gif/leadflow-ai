// Trimitere email prin Resend (https://resend.com) — API HTTP simplu, fără dependențe.
// FALLBACK GRAȚIOS: dacă RESEND_API_KEY nu e setat, funcțiile nu fac nimic (return false),
// astfel platforma funcționează identic, iar pagina „Stadiul cererii” rămâne canalul principal.
//
// Activare: setează în env RESEND_API_KEY și (recomandat) EMAIL_FROM=ARACIP <contact@aicraiova.ro>
// după verificarea domeniului aicraiova.ro în Resend.

export function emailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY
}

const FROM = process.env.EMAIL_FROM || 'ARACIP <onboarding@resend.dev>'

type Attachment = { filename: string; content: string }  // content = base64
type SendArgs = { to: string; subject: string; html: string; from?: string; attachments?: Attachment[] }

export async function sendEmail({ to, subject, html, from, attachments }: SendArgs): Promise<boolean> {
  const key = process.env.RESEND_API_KEY
  if (!key) return false
  if (!to || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) return false
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: from || FROM, to: [to], subject, html, ...(attachments?.length ? { attachments } : {}) }),
    })
    if (!r.ok) { console.error('[email] resend', r.status, await r.text().catch(() => '')); return false }
    return true
  } catch (e) {
    console.error('[email] send', e)
    return false
  }
}

// ---- Șabloane pentru dosarul de autorizare -------------------------------

function layout(titlu: string, corp: string): string {
  return `<div style="font-family:Segoe UI,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
    <div style="background:#0f172a;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0">
      <div style="font-size:18px;font-weight:800">🇷🇴 ARACIP</div>
      <div style="font-size:12px;color:#93c5fd">Agenția Română de Asigurare a Calității în Învățământul Preuniversitar</div>
    </div>
    <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:24px">
      <h2 style="font-size:18px;margin:0 0 12px">${titlu}</h2>
      ${corp}
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0"/>
      <div style="font-size:11px;color:#94a3b8">Mesaj automat — vă rugăm să nu răspundeți. aicraiova.ro</div>
    </div>
  </div>`
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://aicraiova.ro'

export async function emailConfirmareDepunere(to: string, nr: string, denumire: string): Promise<boolean> {
  const link = `${BASE_URL}/acreditare/autorizare/stadiu?nr=${encodeURIComponent(nr)}`
  return sendEmail({
    to,
    subject: `Confirmare depunere dosar autorizare — ${nr}`,
    html: layout('Dosarul dumneavoastră a fost înregistrat', `
      <p style="font-size:14px;line-height:1.6">Dosarul de autorizare de funcționare provizorie pentru <strong>${denumire}</strong> a fost înregistrat cu succes la ARACIP.</p>
      <div style="background:#f1f5f9;border-radius:10px;padding:14px 16px;margin:16px 0">
        <div style="font-size:12px;color:#64748b">Număr de înregistrare</div>
        <div style="font-size:20px;font-weight:800;color:#2563eb;letter-spacing:1px">${nr}</div>
      </div>
      <p style="font-size:14px;line-height:1.6">Veți fi contactat în termen de 30 de zile lucrătoare. Puteți verifica oricând stadiul dosarului cu numărul de mai sus și acest email:</p>
      <p><a href="${link}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:11px 20px;border-radius:8px;font-weight:700;font-size:14px">🔎 Verifică stadiul cererii</a></p>
    `),
  })
}

// ---- Șabloane pentru acreditare / evaluare periodică (depuse de directori) ----

function tipEvalLabel(tip: string): string {
  return tip === 'evaluare_periodica' ? 'evaluare externă periodică' : 'acreditare instituțională'
}

export async function emailConfirmareEvaluare(to: string, nr: string, denumire: string, tip: string): Promise<boolean> {
  const link = `${BASE_URL}/demo/director`
  return sendEmail({
    to,
    subject: `Confirmare solicitare ${tipEvalLabel(tip)} — ${nr}`,
    html: layout('Solicitarea dumneavoastră a fost înregistrată', `
      <p style="font-size:14px;line-height:1.6">Solicitarea de <strong>${tipEvalLabel(tip)}</strong> pentru <strong>${denumire}</strong> a fost înregistrată la ARACIP.</p>
      <div style="background:#f1f5f9;border-radius:10px;padding:14px 16px;margin:16px 0">
        <div style="font-size:12px;color:#64748b">Număr de înregistrare</div>
        <div style="font-size:20px;font-weight:800;color:#7c3aed;letter-spacing:1px">${nr}</div>
      </div>
      <p style="font-size:14px;line-height:1.6">Veți primi un email când ARACIP ia o decizie. Puteți urmări solicitarea și din Portalul Director:</p>
      <p><a href="${link}" style="display:inline-block;background:#7c3aed;color:#fff;text-decoration:none;padding:11px 20px;border-radius:8px;font-weight:700;font-size:14px">Portalul Director</a></p>
    `),
  })
}

export async function emailDecizieEvaluare(to: string, nr: string, denumire: string, tip: string, aprobat: boolean, motiv?: string | null): Promise<boolean> {
  const link = `${BASE_URL}/demo/director`
  const docLabel = tip === 'evaluare_periodica' ? 'Atestatul privind nivelul calității' : 'Decizia de acreditare'
  const corp = aprobat
    ? `<p style="font-size:14px;line-height:1.6">Solicitarea <strong>${nr}</strong> de ${tipEvalLabel(tip)} pentru <strong>${denumire}</strong> a fost <strong style="color:#16a34a">APROBATĂ</strong>.</p>
       <p style="font-size:14px;line-height:1.6">${docLabel} este disponibil(ă) în Portalul Director:</p>
       <p><a href="${link}" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:11px 20px;border-radius:8px;font-weight:700;font-size:14px">Descarcă documentul</a></p>`
    : `<p style="font-size:14px;line-height:1.6">Solicitarea <strong>${nr}</strong> de ${tipEvalLabel(tip)} pentru <strong>${denumire}</strong> a fost <strong style="color:#dc2626">respinsă</strong>.</p>
       ${motiv ? `<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px 14px;margin:12px 0;font-size:13px;color:#991b1b"><strong>Motiv:</strong> ${motiv}</div>` : ''}
       <p style="font-size:14px;line-height:1.6">Detalii în Portalul Director:</p>
       <p><a href="${link}" style="display:inline-block;background:#334155;color:#fff;text-decoration:none;padding:11px 20px;border-radius:8px;font-weight:700;font-size:14px">Portalul Director</a></p>`
  return sendEmail({
    to,
    subject: aprobat ? `Solicitare APROBATĂ — ${nr}` : `Decizie solicitare — ${nr}`,
    html: layout(aprobat ? 'Solicitare aprobată ✓' : 'Decizie ARACIP', corp),
  })
}

export async function emailDecizie(to: string, nr: string, denumire: string, admis: boolean, motiv?: string | null): Promise<boolean> {
  const link = `${BASE_URL}/acreditare/autorizare/stadiu?nr=${encodeURIComponent(nr)}`
  const corp = admis
    ? `<p style="font-size:14px;line-height:1.6">Cu bucurie vă informăm că cererea <strong>${nr}</strong> pentru <strong>${denumire}</strong> a fost <strong style="color:#16a34a">APROBATĂ</strong>.</p>
       <p style="font-size:14px;line-height:1.6">Puteți descărca Autorizația de Funcționare Provizorie din pagina de stadiu:</p>
       <p><a href="${link}" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:11px 20px;border-radius:8px;font-weight:700;font-size:14px">📄 Descarcă autorizația</a></p>`
    : `<p style="font-size:14px;line-height:1.6">Vă informăm că cererea <strong>${nr}</strong> pentru <strong>${denumire}</strong> a fost <strong style="color:#dc2626">respinsă</strong>.</p>
       ${motiv ? `<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px 14px;margin:12px 0;font-size:13px;color:#991b1b"><strong>Motiv:</strong> ${motiv}</div>` : ''}
       <p style="font-size:14px;line-height:1.6">Detalii și pașii următori în pagina de stadiu:</p>
       <p><a href="${link}" style="display:inline-block;background:#334155;color:#fff;text-decoration:none;padding:11px 20px;border-radius:8px;font-weight:700;font-size:14px">🔎 Vezi detalii</a></p>`
  return sendEmail({
    to,
    subject: admis ? `Cerere APROBATĂ — ${nr}` : `Decizie cerere autorizare — ${nr}`,
    html: layout(admis ? 'Cerere aprobată ✓' : 'Decizie ARACIP', corp),
  })
}
