'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useIsMobile } from '../../hooks/useIsMobile'

type View = 'login' | 'dashboard' | 'weekend-lock'

type ElevData = {
  nr: string; nume: string; user: string; parola: string
  coins: number; nivel: number; streak: number; badges: string[]
  minutePlatforma: number; ultimaConectare: string | null
  riscNivel: string; riscCategorie: string[]
}

type SessionData = {
  gradNr: number
  nrClasa: string
  modulClasa: string[]
  diriginte: string
  elev: ElevData
  activity: {
    weekendStart?: number
    minuteUsedWeekend: number
    modulAccesate: Record<string, number>
    totalMinute: number
    ultimaConectare: string
  } | null
}

const MODULE_ROUTES: Record<string, { route: string; icon: string; color: string; label: string }> = {
  'BAC Matematică M1': { route: '/edu/bac/matematica?profil=M1', icon: '📐', color: '#6366f1', label: 'Matematică M1' },
  'BAC Matematică M2': { route: '/edu/bac/matematica?profil=M2', icon: '📊', color: '#8b5cf6', label: 'Matematică M2' },
  'BAC Română':        { route: '/edu/bac/romana', icon: '📖', color: '#ec4899', label: 'Română' },
  'BAC Biologie':      { route: '/edu/bac/materie?m=biologie', icon: '🧬', color: '#16a34a', label: 'Biologie' },
  'BAC Fizică':        { route: '/edu/bac/materie?m=fizica', icon: '⚡', color: '#4f46e5', label: 'Fizică' },
  'BAC Chimie':        { route: '/edu/bac/materie?m=chimie', icon: '🧪', color: '#db2777', label: 'Chimie' },
  'BAC Informatică':   { route: '/edu/bac/materie?m=informatica', icon: '💻', color: '#0891b2', label: 'Informatică' },
  'BAC Geografie':     { route: '/edu/bac/materie?m=geografie', icon: '🌍', color: '#d97706', label: 'Geografie' },
  'BAC Istorie':       { route: '/edu/bac/materie?m=istorie', icon: '📜', color: '#7c3aed', label: 'Istorie' },
  'EN Matematică':     { route: '/edu/capacitate/matematica', icon: '📐', color: '#22c55e', label: 'Matematică EN' },
  'EN Română':         { route: '/edu/capacitate/romana', icon: '📖', color: '#14b8a6', label: 'Română EN' },
}

const WEEKEND_HOURS = 2
const WEEKEND_MS = WEEKEND_HOURS * 60 * 60 * 1000
const EXPIRE_MS = 48 * 60 * 60 * 1000

function isWeekend() {
  const d = new Date().getDay()
  return d === 0 || d === 6 // 0=Sunday, 6=Saturday
}

function getWeekendCode(user: string): string {
  const sat = new Date()
  sat.setDate(sat.getDate() - (sat.getDay() === 0 ? 1 : sat.getDay() - 6))
  const seed = `${user}-${sat.toDateString()}`
  let h = 0
  for (let i = 0; i < seed.length; i++) { h = ((h << 5) - h + seed.charCodeAt(i)) | 0 }
  return Math.abs(h).toString(36).toUpperCase().padStart(6, '0').slice(0, 6)
}

export default function EleviPage() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [view, setView] = useState<View>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [logging, setLogging] = useState(false)
  const [session, setSession] = useState<SessionData | null>(null)
  const [weekendActive, setWeekendActive] = useState(false)
  const [minuteLeft, setMinuteLeft] = useState(WEEKEND_HOURS * 60)
  const [codInput, setCodInput] = useState('')
  const [codErr, setCodErr] = useState('')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Restore session from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('elev_session')
      if (!raw) return
      const s: SessionData = JSON.parse(raw)
      setSession(s)
      // Master demo: modules unlocked permanently
      if (s.elev.user === 'contact@aicraiova.ro') {
        setWeekendActive(true)
        setMinuteLeft(WEEKEND_HOURS * 60)
        setView('dashboard')
        return
      }
      // Check weekend timer
      const timerRaw = localStorage.getItem(`elev_timer_${s.elev.user}`)
      if (timerRaw) {
        const t = JSON.parse(timerRaw)
        const now = Date.now()
        if (t.startTime && now - t.startTime < EXPIRE_MS) {
          const msUsed = t.msUsed || 0
          const msLeft = WEEKEND_MS - msUsed
          if (msLeft > 0) {
            setWeekendActive(true)
            setMinuteLeft(Math.ceil(msLeft / 60000))
          }
        }
      }
      setView('dashboard')
    } catch {}
  }, [])

  // Timer countdown
  useEffect(() => {
    if (!weekendActive || !session) return
    timerRef.current = setInterval(() => {
      const timerRaw = localStorage.getItem(`elev_timer_${session.elev.user}`)
      if (!timerRaw) { setWeekendActive(false); return }
      const t = JSON.parse(timerRaw)
      const now = Date.now()
      const elapsed = now - (t.lastTick || now)
      t.msUsed = (t.msUsed || 0) + elapsed
      t.lastTick = now
      localStorage.setItem(`elev_timer_${session.elev.user}`, JSON.stringify(t))
      const msLeft = WEEKEND_MS - t.msUsed
      if (msLeft <= 0) {
        setWeekendActive(false)
        setMinuteLeft(0)
        clearInterval(timerRef.current!)
      } else {
        setMinuteLeft(Math.ceil(msLeft / 60000))
      }
    }, 60000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [weekendActive, session])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!username || !password) { setErr('Completați utilizatorul și parola.'); return }
    setLogging(true); setErr('')

    // Master credentials bypass
    if (username.trim().toLowerCase() === 'contact@aicraiova.ro' && password.trim() === 'ARACIP') {
      const s: SessionData = {
        gradNr: 12,
        nrClasa: 'XII-A',
        modulClasa: ['BAC Matematică M1','BAC Română','BAC Informatică','BAC Biologie','BAC Istorie'],
        diriginte: 'Prof. Demo',
        elev: { nr: '1', nume: 'Elev Demo', user: 'contact@aicraiova.ro', parola: 'ARACIP', coins: 0, nivel: 1, streak: 0, badges: [], minutePlatforma: 0, ultimaConectare: new Date().toISOString(), riscNivel: 'ok', riscCategorie: [] },
        activity: { minuteUsedWeekend: 0, modulAccesate: {}, totalMinute: 0, ultimaConectare: new Date().toISOString() },
      }
      localStorage.setItem('elev_session', JSON.stringify(s))
      setSession(s)
      setWeekendActive(true)
      setMinuteLeft(WEEKEND_HOURS * 60)
      setLogging(false)
      setView('dashboard')
      return
    }

    try {
      const res = await fetch(`/api/elevi-acasa?user=${encodeURIComponent(username.trim())}&pass=${encodeURIComponent(password.trim())}`)
      const data = await res.json()
      if (!data.ok) {
        setLogging(false)
        setErr('Utilizator sau parolă incorectă.')
        return
      }
      const s: SessionData = {
        gradNr: data.gradNr,
        nrClasa: data.nrClasa,
        modulClasa: data.modulClasa,
        diriginte: data.diriginte,
        elev: data.elev,
        activity: data.activity,
      }
      localStorage.setItem('elev_session', JSON.stringify(s))
      setSession(s)
      // Restore timer if exists
      const timerRaw = localStorage.getItem(`elev_timer_${data.elev.user}`)
      if (timerRaw) {
        const t = JSON.parse(timerRaw)
        const now = Date.now()
        if (t.startTime && now - t.startTime < EXPIRE_MS) {
          const msLeft = WEEKEND_MS - (t.msUsed || 0)
          if (msLeft > 0) { setWeekendActive(true); setMinuteLeft(Math.ceil(msLeft / 60000)) }
        }
      }
      setLogging(false)
      setView('dashboard')
    } catch {
      setLogging(false)
      setErr('Eroare de conectare. Reîncercați.')
    }
  }

  function activateWeekend() {
    if (!session) return
    const expected = getWeekendCode(session.elev.user)
    if (codInput.trim().toUpperCase() !== expected) {
      setCodErr('Cod incorect. Verificați și reîncercați.')
      return
    }
    const timer = { startTime: Date.now(), msUsed: 0, lastTick: Date.now() }
    localStorage.setItem(`elev_timer_${session.elev.user}`, JSON.stringify(timer))
    setWeekendActive(true)
    setMinuteLeft(WEEKEND_HOURS * 60)
    setCodErr('')
    setCodInput('')
  }

  function navigateModule(route: string, modulName: string) {
    if (!session) return
    // Track activity
    try {
      const timerRaw = localStorage.getItem(`elev_timer_${session.elev.user}`)
      if (timerRaw) {
        const t = JSON.parse(timerRaw)
        t.lastTick = Date.now()
        localStorage.setItem(`elev_timer_${session.elev.user}`, JSON.stringify(t))
      }
      fetch('/api/elevi-acasa', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: session.elev.user,
          activity: {
            user: session.elev.user,
            weekendStart: JSON.parse(timerRaw || '{}').startTime,
            minuteUsedWeekend: Math.round(((JSON.parse(timerRaw || '{}').msUsed || 0)) / 60000),
            modulAccesate: { ...(session.activity?.modulAccesate || {}), [modulName]: (session.activity?.modulAccesate?.[modulName] || 0) + 1 },
            totalMinute: (session.activity?.totalMinute || 0),
            ultimaConectare: new Date().toISOString(),
          },
        }),
      }).catch(() => {})
    } catch {}
    router.push(route)
  }

  const weekendCode = session ? getWeekendCode(session.elev.user) : ''

  // LOGIN
  if (view === 'login') return (
    <div style={pageStyle}>
      <button onClick={() => router.push('/aracip')} style={backBtn}>← Înapoi</button>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #4f46e5, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(99,102,241,0.35)' }}>🎓</div>
        <div style={{ fontSize: '20px', fontWeight: 800 }}>Portal Elevi</div>
        <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>EDU DIGITAL · AIcraiova</div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '20px', padding: isMobile ? '28px 20px' : '36px 40px', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Autentificare</h2>
        <p style={{ fontSize: '12px', color: '#475569', textAlign: 'center', marginBottom: '24px' }}>Folosește datele primite de la dirigintele tău</p>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input placeholder="Utilizator (ex: ion.popescu)" value={username} onChange={e => setUsername(e.target.value)} style={inputStyle} autoComplete="username" />
          <input type="password" placeholder="Parolă" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} autoComplete="current-password" />
          {err && <div style={{ fontSize: '12px', color: '#ef4444', textAlign: 'center' }}>{err}</div>}
          <button type="submit" disabled={logging} style={btnIndigo}>{logging ? 'Se verifică...' : 'Intră în cont →'}</button>
        </form>
        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '10px', fontSize: '11px', color: '#818cf8', textAlign: 'center', lineHeight: 1.6 }}>
          Nu ai cont? Cere utilizatorul și parola de la dirigintele clasei tale.
        </div>
      </div>
      <style>{`input::placeholder{color:#334155;}`}</style>
    </div>
  )

  if (!session) return null

  const { gradNr, nrClasa, modulClasa, elev } = session
  const accesWeekend = gradNr === 8 || gradNr === 12
  const moduleFiltrate = modulClasa.filter(m => MODULE_ROUTES[m])

  // DASHBOARD
  return (
    <div style={pageStyle}>
      <button onClick={() => router.push('/aracip')} style={backBtn}>← Înapoi</button>

      <div style={{ width: '100%', maxWidth: '540px' }}>

        {/* Header elev */}
        <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '20px', padding: '20px 24px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: 48, height: 48, borderRadius: '14px', flexShrink: 0, background: 'linear-gradient(135deg, #4f46e5, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}>🎓</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '15px' }}>{elev.nume}</div>
            <div style={{ fontSize: '12px', color: '#6366f1', fontWeight: 600, marginTop: '2px' }}>
              Clasa {nrClasa} · {gradNr === 12 ? 'Bacalaureat 2026' : gradNr === 8 ? 'Evaluare Națională 2026' : 'EDU Digital'}
            </div>
          </div>
          <button onClick={() => { localStorage.removeItem('elev_session'); setSession(null); setView('login') }}
            style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '5px 10px', color: '#475569', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit' }}>
            Ieșire
          </button>
        </div>

        {/* Gamification */}
        <div style={{ background: 'rgba(251,191,36,0.04)', border: '1px solid rgba(251,191,36,0.15)', borderRadius: '16px', padding: '14px 18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '18px' }}>🪙</span>
              <span style={{ fontSize: '20px', fontWeight: 900, color: '#fbbf24' }}>{elev.coins}</span>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>AI Coins</span>
            </div>
            {elev.streak > 0 && <div style={{ fontSize: '11px', color: '#f97316', marginTop: '2px' }}>🔥 {elev.streak} zile streak</div>}
          </div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', flex: 1 }}>
            {elev.badges.slice(0, 3).map(b => (
              <div key={b} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', padding: '3px 8px', fontSize: '10px', color: '#a5b4fc' }}>{b}</div>
            ))}
          </div>
        </div>

        {/* Acces module — numai cls 8 si 12 */}
        {!accesWeekend ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            {/* Statistici activitate */}
            <div style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '16px', padding: '20px 22px' }}>
              <div style={{ fontSize: '11px', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' }}>📊 Activitatea ta pe platformă</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: '#a5b4fc' }}>{elev.minutePlatforma || 0}</div>
                  <div style={{ fontSize: '10px', color: '#475569', marginTop: '2px' }}>minute pe platformă</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: '#818cf8' }}>{elev.nivel || 1}</div>
                  <div style={{ fontSize: '10px', color: '#475569', marginTop: '2px' }}>nivel</div>
                </div>
              </div>
              {elev.ultimaConectare && (
                <div style={{ fontSize: '11px', color: '#334155', marginTop: '12px', textAlign: 'center' }}>
                  Ultima conectare: {new Date(elev.ultimaConectare).toLocaleDateString('ro-RO')}
                </div>
              )}
            </div>
            {/* Mesaj motivational */}
            <div style={{ background: 'rgba(251,191,36,0.04)', border: '1px solid rgba(251,191,36,0.12)', borderRadius: '14px', padding: '18px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>💡</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#fde68a', marginBottom: '6px' }}>Continuă să înveți!</div>
              <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.7 }}>
                Modulele de pregătire intensivă se vor activa<br />
                când ajungi în clasa a VIII-a sau a XII-a.
              </div>
            </div>
          </div>
        ) : weekendActive ? (
          /* SESIUNE ACTIVA */
          <div style={{ marginBottom: '16px' }}>
            <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '16px', padding: '12px 18px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '13px', color: '#4ade80', fontWeight: 700 }}>🟢 Sesiune activă</div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#4ade80' }}>{minuteLeft} min rămase</div>
            </div>
            <div style={{ fontSize: '11px', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
              {gradNr === 12 ? '📚 Module BAC' : '🎯 Module EN'} — alege unde înveți azi
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {moduleFiltrate.map(m => {
                const cfg = MODULE_ROUTES[m]
                return (
                  <button key={m} onClick={() => navigateModule(cfg.route, m)}
                    style={{ width: '100%', background: `${cfg.color}10`, border: `1.5px solid ${cfg.color}44`, borderRadius: '14px', padding: '14px 18px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '14px', fontFamily: 'inherit', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${cfg.color}20`; e.currentTarget.style.borderColor = cfg.color }}
                    onMouseLeave={e => { e.currentTarget.style.background = `${cfg.color}10`; e.currentTarget.style.borderColor = `${cfg.color}44` }}
                  >
                    <span style={{ fontSize: '22px', flexShrink: 0 }}>{cfg.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>{cfg.label}</div>
                      <div style={{ fontSize: '10px', color: '#475569', marginTop: '2px' }}>Profesor AI · click pentru a deschide</div>
                    </div>
                    <div style={{ color: cfg.color, fontSize: '18px' }}>→</div>
                  </button>
                )
              })}
            </div>
          </div>
        ) : isWeekend() ? (
          /* WEEKEND - cod de activare */
          <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '20px', padding: '24px', marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#a5b4fc', marginBottom: '6px' }}>🎯 Sesiune weekend disponibilă</div>
            <div style={{ fontSize: '12px', color: '#475569', marginBottom: '18px', lineHeight: 1.6 }}>
              Ai {WEEKEND_HOURS} ore de studiu pentru acest weekend. Codul tău de acces de azi:
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: '12px', padding: '14px', textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '10px', color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Codul tău de weekend</div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#a5b4fc', letterSpacing: '4px', fontFamily: 'monospace' }}>{weekendCode}</div>
              <div style={{ fontSize: '10px', color: '#334155', marginTop: '6px' }}>valabil 48h · {WEEKEND_HOURS}h utilizare</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                placeholder="Introdu codul..."
                value={codInput}
                onChange={e => setCodInput(e.target.value.toUpperCase())}
                style={{ ...inputStyle, flex: 1, fontFamily: 'monospace', letterSpacing: '2px', padding: '10px 14px' }}
              />
              <button onClick={activateWeekend} style={{ ...btnIndigo, padding: '0 20px', whiteSpace: 'nowrap' }}>Activează →</button>
            </div>
            {codErr && <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '6px' }}>{codErr}</div>}
          </div>
        ) : (
          /* SAPTAMANA - module blocate */
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px', textAlign: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔒</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9', marginBottom: '6px' }}>Module disponibile în weekend</div>
            <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
              Sâmbătă și duminică vei primi un cod personal de acces pentru {WEEKEND_HOURS} ore de studiu.
            </div>
            <div style={{ marginTop: '12px', display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {moduleFiltrate.map(m => (
                <div key={m} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '4px 10px', fontSize: '11px', color: '#334155' }}>
                  {MODULE_ROUTES[m].icon} {MODULE_ROUTES[m].label}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      <style>{`input::placeholder{color:#334155;}`}</style>
    </div>
  )
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#060b14',
  fontFamily: "'Segoe UI', Arial, sans-serif",
  color: '#f1f5f9',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 20px',
}

const backBtn: React.CSSProperties = {
  position: 'fixed', top: 20, left: 20,
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px', padding: '8px 16px',
  color: '#94a3b8', cursor: 'pointer',
  fontSize: '13px', fontFamily: 'inherit',
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '12px 16px',
  fontSize: '14px',
  color: '#f1f5f9',
  outline: 'none',
  fontFamily: "'Segoe UI', Arial, sans-serif",
  width: '100%',
  boxSizing: 'border-box',
}

const btnIndigo: React.CSSProperties = {
  background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
  border: 'none',
  borderRadius: '12px',
  padding: '13px 24px',
  fontSize: '14px',
  fontWeight: 700,
  color: '#fff',
  cursor: 'pointer',
  fontFamily: "'Segoe UI', Arial, sans-serif",
}
