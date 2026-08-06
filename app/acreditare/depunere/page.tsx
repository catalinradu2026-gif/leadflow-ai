'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useIsMobile } from '../../hooks/useIsMobile'

// DEPUNERE AUTOEVALUARE (partea Școală/Director) — lanțul calității live.
// La submit → POST /api/unitati → apare instant la ISJ (județ) și la ARACIP (național).

const JUDETE = [
  'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani', 'Brăila', 'Brașov',
  'Buzău', 'Călărași', 'Caraș-Severin', 'Cluj', 'Constanța', 'Covasna', 'Dâmbovița', 'Dolj',
  'Galați', 'Giurgiu', 'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov', 'Maramureș',
  'Mehedinți', 'Mureș', 'Neamț', 'Olt', 'Prahova', 'Sălaj', 'Satu Mare', 'Sibiu', 'Suceava',
  'Teleorman', 'Timiș', 'Tulcea', 'Vâlcea', 'Vaslui', 'Vrancea', 'Municipiul București',
]
const TIPURI = ['Grădiniță', 'Școală', 'Gimnaziu', 'Liceu', 'Colegiu', 'Special', 'Alt tip']
const CALIFICATIVE = ['Nesatisfăcător', 'Satisfăcător', 'Bine', 'Foarte bine', 'Excelent']
const DOMENII = [
  { key: 'A', nume: 'A. Capacitate instituțională' },
  { key: 'B', nume: 'B. Eficacitate educațională' },
  { key: 'C', nume: 'C. Managementul calității' },
]

const inputStyle: React.CSSProperties = {
  width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px',
  padding: '11px 14px', fontSize: '14px', color: '#e2e8f0', outline: 'none', boxSizing: 'border-box',
  fontFamily: 'inherit',
}
const labelStyle: React.CSSProperties = {
  fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600,
}

export default function DepunereAutoevaluare() {
  const router = useRouter()
  const isMobile = useIsMobile()

  const [numeUnitate, setNumeUnitate] = useState('')
  const [judet, setJudet] = useState('')
  const [localitate, setLocalitate] = useState('')
  const [tip, setTip] = useState('Școală')
  const [contactEmail, setContactEmail] = useState('')
  const [domenii, setDomenii] = useState<Record<string, string>>({ A: '', B: '', C: '' })
  const [calificativGeneral, setCalificativGeneral] = useState('')
  const [rezumat, setRezumat] = useState('')

  const [consimtamant, setConsimtamant] = useState(false)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    if (!numeUnitate.trim() || !judet) {
      setErr('Completați numele unității și județul.')
      return
    }
    if (!consimtamant) {
      setErr('Bifați acordul privind prelucrarea datelor cu caracter personal.')
      return
    }
    setSending(true)
    try {
      const domCurate: Record<string, string> = {}
      for (const k of ['A', 'B', 'C']) if (domenii[k]) domCurate[k] = domenii[k]
      const res = await fetch('/api/unitati', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nume_unitate: numeUnitate.trim(),
          judet,
          localitate: localitate.trim() || undefined,
          tip_unitate: tip,
          status: 'autoevaluare_depusa',
          calificativ_general: calificativGeneral || undefined,
          calificative_domenii: domCurate,
          rezumat: rezumat.trim() || undefined,
          contact_email: contactEmail.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setErr(data.error === 'rate' ? 'Prea multe depuneri. Reîncercați în câteva secunde.' : 'A apărut o eroare la trimitere.')
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

  function resetForm() {
    setNumeUnitate(''); setJudet(''); setLocalitate(''); setTip('Școală'); setContactEmail('')
    setDomenii({ A: '', B: '', C: '' }); setCalificativGeneral(''); setRezumat(''); setDone(false); setConsimtamant(false)
  }

  if (done) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1a1035 50%, #0f172a 100%)', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '20px', padding: '40px', maxWidth: '520px', textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#22c55e', marginBottom: '12px' }}>Autoevaluare trimisă!</h2>
        <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '8px' }}>
          Depunerea unității <b style={{ color: '#e2e8f0' }}>{numeUnitate}</b> ({judet}) a fost înregistrată și transmisă instant către:
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', margin: '16px 0' }}>
          <span style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.35)', color: '#67e8f9', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', fontWeight: 700 }}>🏛️ ISJ {judet}</span>
          <span style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.35)', color: '#93c5fd', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', fontWeight: 700 }}>🇷🇴 ARACIP Național</span>
        </div>
        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '24px' }}>Apare live în dashboardurile lor la refresh.</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={resetForm} style={{ background: 'linear-gradient(135deg,#6d28d9,#8b5cf6)', border: 'none', borderRadius: '10px', padding: '12px 22px', fontSize: '14px', fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>+ Depune altă unitate</button>
          <button onClick={() => router.push('/acreditare/dashboard')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px 22px', fontSize: '14px', fontWeight: 600, color: '#cbd5e1', cursor: 'pointer', fontFamily: 'inherit' }}>Vezi Dashboard ARACIP →</button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1a1035 50%, #0f172a 100%)', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0', padding: isMobile ? '16px' : '40px 20px' }}>
      <button onClick={() => router.push('/acreditare')} style={{ position: 'fixed', top: 20, left: 20, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '8px 16px', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', zIndex: 10 }}>← Acreditare</button>

      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px', paddingTop: isMobile ? '40px' : '20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '30px', padding: '6px 16px', marginBottom: '16px', fontSize: '12px', color: '#c4b5fd', fontWeight: 600 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px #22c55e' }} />
            Portal Unitate de Învățământ · Depunere Live
          </div>
          <h1 style={{ fontSize: isMobile ? '24px' : '30px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', marginBottom: '10px' }}>Depunere Autoevaluare (RAEI)</h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>
            Completați și trimiteți. Depunerea ajunge instant la <b style={{ color: '#67e8f9' }}>ISJ-ul județului</b> și la <b style={{ color: '#93c5fd' }}>ARACIP național</b> — fără cont, direct în lanțul calității.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '18px', padding: isMobile ? '20px' : '32px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

          <div>
            <label style={labelStyle}>Denumirea unității de învățământ *</label>
            <input value={numeUnitate} onChange={e => setNumeUnitate(e.target.value)} placeholder='ex: Liceul Teoretic „Henri Coandă"' style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Județ *</label>
              <select value={judet} onChange={e => setJudet(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">— Selectați județul —</option>
                {JUDETE.map(j => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Localitate</label>
              <input value={localitate} onChange={e => setLocalitate(e.target.value)} placeholder="ex: Craiova" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Tip unitate</label>
              <select value={tip} onChange={e => setTip(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                {TIPURI.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Email de contact</label>
              <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="secretariat@unitate.ro" style={inputStyle} />
            </div>
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '2px 0' }} />

          <div>
            <label style={{ ...labelStyle, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#c4b5fd' }}>Calificative pe domenii (autoevaluare)</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {DOMENII.map(d => (
                <div key={d.key} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 200px', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#cbd5e1' }}>{d.nume}</span>
                  <select value={domenii[d.key]} onChange={e => setDomenii(prev => ({ ...prev, [d.key]: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">— fără calificativ —</option>
                    {CALIFICATIVE.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Calificativ general (autoapreciere)</label>
            <select value={calificativGeneral} onChange={e => setCalificativGeneral(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">— fără calificativ general —</option>
              {CALIFICATIVE.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Rezumat autoevaluare / puncte tari și de dezvoltare</label>
            <textarea value={rezumat} onChange={e => setRezumat(e.target.value)} rows={4} placeholder="Scurtă descriere a rezultatelor autoevaluării, dovezi, plan de îmbunătățire..." style={{ ...inputStyle, resize: 'vertical', minHeight: '90px' }} />
          </div>

          <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '12.5px', color: '#cbd5e1', cursor: 'pointer', lineHeight: 1.5 }}>
            <input type="checkbox" checked={consimtamant} onChange={e => { setConsimtamant(e.target.checked); setErr('') }} style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: '#8b5cf6', flexShrink: 0 }} />
            <span>Sunt de acord cu prelucrarea datelor cu caracter personal conform <Link href="/confidentialitate" target="_blank" style={{ color: '#a78bfa' }}>Politicii de confidențialitate</Link>.</span>
          </label>

          {err && <div style={{ fontSize: '13px', color: '#fca5a5', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px' }}>{err}</div>}

          <button type="submit" disabled={sending} style={{ background: sending ? '#4c1d95' : 'linear-gradient(135deg,#6d28d9,#8b5cf6)', border: 'none', borderRadius: '12px', padding: '14px 24px', fontSize: '15px', fontWeight: 700, color: '#fff', cursor: sending ? 'default' : 'pointer', fontFamily: 'inherit', boxShadow: '0 6px 20px rgba(139,92,246,0.35)' }}>
            {sending ? 'Se trimite...' : '📤 Trimite către ISJ și ARACIP'}
          </button>
        </form>
      </div>
    </div>
  )
}
