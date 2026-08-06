'use client'
import { useState } from 'react'
import Link from 'next/link'

// Formular „dreptul la ștergere" (art. 17 GDPR). Trimite cererea la /api/cereri-stergere.
// Fallback grațios: dacă Supabase nu e configurat, cererea e confirmată (înregistrată local pe server).

const PAGE_BG = 'linear-gradient(135deg, #0f172a 0%, #1a1035 50%, #0f172a 100%)'

const inputStyle: React.CSSProperties = {
  width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: 8,
  padding: '11px 14px', fontSize: 14, color: '#e2e8f0', outline: 'none', boxSizing: 'border-box',
  fontFamily: 'inherit',
}
const labelStyle: React.CSSProperties = {
  fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 6, fontWeight: 600,
}

export default function CerereStergere() {
  const [email, setEmail] = useState('')
  const [motiv, setMotiv] = useState('')
  const [accept, setAccept] = useState(false)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    if (!emailOk) { setErr('Introduceți o adresă de e-mail validă.'); return }
    if (!accept) { setErr('Confirmați că sunteți titularul datelor.'); return }
    setSending(true)
    try {
      const res = await fetch('/api/cereri-stergere', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), motiv: motiv.trim() || undefined }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setErr(data.error === 'rate' ? 'Prea multe cereri. Reîncercați în câteva minute.' : 'A apărut o eroare la trimitere.')
        setSending(false)
        return
      }
      setSending(false)
      setDone(true)
    } catch {
      setErr('Eroare de rețea. Reîncercați.')
      setSending(false)
    }
  }

  if (done) return (
    <div style={{ minHeight: '100vh', background: PAGE_BG, fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: 40, maxWidth: 520, textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#22c55e', marginBottom: 12 }}>Cerere înregistrată</h2>
        <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, marginBottom: 24 }}>
          Cererea dumneavoastră de ștergere a datelor a fost înregistrată. Vom da curs solicitării în termenul prevăzut de GDPR (cel mult 30 de zile)
          și vă vom contacta la adresa indicată. Pentru orice detaliu suplimentar: <a href="mailto:contact@aicraiova.ro" style={{ color: '#a78bfa' }}>contact@aicraiova.ro</a>.
        </p>
        <Link href="/confidentialitate" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#cbd5e1', textDecoration: 'none', borderRadius: 10, padding: '11px 20px', fontSize: 13.5, fontWeight: 600 }}>← Politica de confidențialitate</Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: PAGE_BG, fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0', padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: 620, margin: '0 auto' }}>
        <Link href="/confidentialitate" style={{ display: 'inline-block', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 16px', color: '#94a3b8', textDecoration: 'none', fontSize: 13, marginBottom: 24 }}>← Politica de confidențialitate</Link>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', marginBottom: 10 }}>Cerere de ștergere a datelor</h1>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>
            Conform art. 17 GDPR („dreptul de a fi uitat"), puteți solicita ștergerea datelor dumneavoastră cu caracter personal.
            Completați adresa de e-mail cu care sunteți înregistrat.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 18, padding: 30, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={labelStyle}>Adresa de e-mail înregistrată *</label>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErr('') }} placeholder="numele@exemplu.ro" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Motivul cererii (opțional)</label>
            <textarea value={motiv} onChange={e => setMotiv(e.target.value)} rows={4} placeholder="Ex: nu mai doresc să particip la program..." style={{ ...inputStyle, resize: 'vertical', minHeight: 90 }} />
          </div>

          <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: '#cbd5e1', cursor: 'pointer', lineHeight: 1.5 }}>
            <input type="checkbox" checked={accept} onChange={e => { setAccept(e.target.checked); setErr('') }} style={{ marginTop: 3, width: 16, height: 16, accentColor: '#8b5cf6', flexShrink: 0 }} />
            <span>Confirm că sunt titularul datelor asociate acestei adrese de e-mail și solicit ștergerea lor conform art. 17 GDPR.</span>
          </label>

          {err && <div style={{ fontSize: 13, color: '#fca5a5', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px' }}>{err}</div>}

          <button type="submit" disabled={sending} style={{ background: sending ? '#4c1d95' : 'linear-gradient(135deg,#6d28d9,#8b5cf6)', border: 'none', borderRadius: 12, padding: '14px 24px', fontSize: 15, fontWeight: 700, color: '#fff', cursor: sending ? 'default' : 'pointer', fontFamily: 'inherit', boxShadow: '0 6px 20px rgba(139,92,246,0.35)' }}>
            {sending ? 'Se trimite...' : 'Trimite cererea de ștergere'}
          </button>
        </form>
      </div>
    </div>
  )
}
