'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { JUDETE } from '../../../../lib/judete'

export default function SolicitariDirector() {
  const router = useRouter()
  const [tip, setTip] = useState<'acreditare' | 'evaluare_periodica'>('acreditare')
  const [denumire, setDenumire] = useState('')
  const [cui, setCui] = useState('')
  const [judet, setJudet] = useState('')
  const [nivel, setNivel] = useState('')
  const [email, setEmail] = useState('')
  const [calificativ, setCalificativ] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [nr, setNr] = useState('')
  const [err, setErr] = useState('')

  async function trimite() {
    if (submitting) return
    if (!denumire.trim()) { setErr('Completați denumirea unității.'); return }
    if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) { setErr('Introduceți un email valid — acolo primiți decizia ARACIP.'); return }
    setSubmitting(true); setErr('')
    try {
      const res = await fetch('/api/evaluari', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tip, denumire, cui, judet, nivel, email, calificativ: tip === 'evaluare_periodica' ? calificativ : undefined }),
      })
      const d = await res.json()
      setNr(d?.nr_inregistrare || '—')
    } catch { setErr('Eroare la trimitere.') } finally { setSubmitting(false) }
  }

  const inputStyle: React.CSSProperties = { width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }

  if (nr) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', Arial, sans-serif", padding: 20 }}>
        <div style={{ textAlign: 'center', maxWidth: 460 }}>
          <div style={{ fontSize: 60, marginBottom: 18 }}>✅</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 10 }}>Solicitare trimisă la ARACIP</h1>
          <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>Cererea de {tip === 'acreditare' ? 'acreditare instituțională' : 'evaluare externă periodică'} pentru <strong style={{ color: '#f1f5f9' }}>{denumire}</strong> a fost înregistrată.</p>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 16, marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Număr de înregistrare</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#a855f7', letterSpacing: 2 }}>{nr}</div>
          </div>
          <p style={{ color: '#64748b', fontSize: 12.5, lineHeight: 1.6, marginBottom: 22 }}>📧 Ați primit confirmarea pe <strong style={{ color: '#cbd5e1' }}>{email}</strong>. Veți fi anunțat pe email când ARACIP ia decizia (aprobat/respins).</p>
          <button onClick={() => router.push('/demo/director')} style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 26px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>← Înapoi la Portal Director</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => router.push('/demo/director')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 13 }}>← Portal Director</button>
        <div style={{ width: 1, height: 20, background: '#334155' }} />
        <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>🏅 Solicitare Acreditare / Evaluare</span>
      </div>

      <div style={{ maxWidth: 620, margin: '0 auto', padding: 24 }}>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 28 }}>
          <label style={labelStyle}>Tip solicitare</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {([['acreditare', '🏅 Acreditare instituțională'], ['evaluare_periodica', '🔄 Evaluare externă periodică']] as const).map(([v, l]) => (
              <button key={v} onClick={() => setTip(v)} style={{ flex: 1, minWidth: 180, background: tip === v ? 'rgba(168,85,247,0.18)' : '#0f172a', border: `1.5px solid ${tip === v ? '#a855f7' : '#334155'}`, color: tip === v ? '#d8b4fe' : '#94a3b8', borderRadius: 8, padding: '10px 12px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>{l}</button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div><label style={labelStyle}>Denumirea unității</label><input style={inputStyle} value={denumire} onChange={e => setDenumire(e.target.value)} placeholder='ex: Școala Gimnazială Nr. 1' /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={labelStyle}>CUI / CIF</label><input style={inputStyle} value={cui} onChange={e => setCui(e.target.value)} /></div>
              <div><label style={labelStyle}>Județ</label><select style={{ ...inputStyle, cursor: 'pointer' }} value={judet} onChange={e => setJudet(e.target.value)}><option value="">— alege —</option>{JUDETE.map(j => <option key={j} value={j}>{j}</option>)}</select></div>
            </div>
            <div><label style={labelStyle}>Nivel de învățământ</label><input style={inputStyle} value={nivel} onChange={e => setNivel(e.target.value)} placeholder='ex: Primar / Gimnazial / Liceal' /></div>
            <div><label style={labelStyle}>Email contact <span style={{ color: '#f87171' }}>*</span></label><input type="email" style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} placeholder='email@scoala.ro' /><div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>Aici primiți confirmarea și decizia ARACIP (aprobat/respins).</div></div>
            {tip === 'evaluare_periodica' && (
              <div>
                <label style={labelStyle}>Calificativ autoevaluare (RAEI)</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={calificativ} onChange={e => setCalificativ(e.target.value)}>
                  <option value="">— alege —</option>
                  {['Nesatisfăcător', 'Satisfăcător', 'Bine', 'Foarte bine', 'Excelent'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}
          </div>

          {err && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', marginTop: 16, fontSize: 13, color: '#f87171' }}>{err}</div>}

          <button onClick={trimite} disabled={submitting} style={{ width: '100%', marginTop: 20, background: submitting ? '#5b21b6' : '#7c3aed', color: '#fff', border: 'none', borderRadius: 10, padding: 14, fontSize: 15, fontWeight: 700, cursor: submitting ? 'wait' : 'pointer' }}>
            {submitting ? 'Se trimite...' : '📤 Trimite solicitarea la ARACIP →'}
          </button>
        </div>
      </div>
    </div>
  )
}
