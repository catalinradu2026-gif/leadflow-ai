'use client'
import { useState, useEffect, type ReactNode } from 'react'

const STORAGE_KEY = 'bt_demo_unlocked_v1'

/**
 * Gate simplu de parolă pentru demo-ul privat BT. Parola nu e hardcodată în client —
 * se verifică server-side prin /api/demo-bt-auth. Odată deblocat, rămâne deblocat
 * în acest browser (localStorage) ca să nu ceară parola la fiecare pagină.
 */
export default function BTGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState<boolean | null>(null) // null = încă neverificat (evită flash)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    try {
      setUnlocked(localStorage.getItem(STORAGE_KEY) === '1')
    } catch {
      setUnlocked(false)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!password.trim() || checking) return
    setChecking(true)
    setError('')
    try {
      const res = await fetch('/api/demo-bt-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (data.ok) {
        try { localStorage.setItem(STORAGE_KEY, '1') } catch {}
        setUnlocked(true)
      } else {
        setError(data.error || 'Parolă incorectă.')
      }
    } catch {
      setError('Eroare de conexiune. Încercați din nou.')
    }
    setChecking(false)
  }

  if (unlocked === null) {
    return <div style={{ minHeight: '100vh', background: '#0a1a2a' }} />
  }

  if (!unlocked) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1a2a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative' }}>
        <BTWatermark />
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #2ea89d, #1b7a72)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', margin: '0 auto 16px' }}>🔒</div>
          <div style={{ fontSize: '19px', fontWeight: 800 }}>Demo privat — acces restricționat</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', maxWidth: '360px' }}>
            Prototip conceptual, nu e un produs public. Introduceți parola primită pentru a continua.
          </div>
        </div>
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '340px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label htmlFor="bt-gate-password" className="sr-only">Parolă de acces demo</label>
          <input
            id="bt-gate-password"
            type="password"
            placeholder="Parolă"
            aria-label="Parolă de acces demo"
            aria-invalid={!!error}
            aria-describedby={error ? 'bt-gate-error' : undefined}
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
            style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${error ? '#ef4444' : 'rgba(255,255,255,0.12)'}`, borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: '#f1f5f9', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' }}
          />
          {error && <div id="bt-gate-error" role="alert" style={{ fontSize: '12px', color: '#ef4444', textAlign: 'center' }}>{error}</div>}
          <button type="submit" disabled={checking} style={{ background: 'linear-gradient(135deg, #2ea89d, #1b7a72)', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, color: '#04141a', cursor: 'pointer', fontFamily: 'inherit' }}>
            {checking ? 'Se verifică...' : 'Intră →'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <>
      <BTWatermark />
      {children}
    </>
  )
}

// ============================================================================
// Watermark diagonal — protecție legală/marcă. Înlocuiește bannerul separat de
// disclaimer: textul "DEMO — prototip neoficial" e vizibil pe toată pagina, la
// opacitate redusă, ca un preview de stock photo. NU blochează interacțiunea
// (pointer-events: none) și nu afectează lizibilitatea conținutului dedesubt.
// Dezvăluirea AI Act ("sunt Nora, asistent AI, nu om") e SEPARATĂ și rămâne doar
// în widget-ul de chat (header + primul mesaj) — nu se amestecă cu watermark-ul.
// ============================================================================
function BTWatermark() {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='560' height='420'>
    <g transform='rotate(-30 280 210)' font-family='Segoe UI, Arial, sans-serif' font-size='19' font-weight='700' fill='rgba(226,232,240,0.09)'>
      <text x='-120' y='40'>DEMO — prototip neoficial</text>
      <text x='-120' y='150'>DEMO — prototip neoficial</text>
      <text x='-120' y='260'>DEMO — prototip neoficial</text>
      <text x='-120' y='370'>DEMO — prototip neoficial</text>
    </g>
  </svg>`
  const dataUri = `data:image/svg+xml,${encodeURIComponent(svg)}`
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 5000, pointerEvents: 'none',
        backgroundImage: `url("${dataUri}")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '560px 420px',
      }}
    />
  )
}
