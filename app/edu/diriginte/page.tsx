'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useIsMobile } from '../../hooks/useIsMobile'

type View = 'login' | 'register' | 'dashboard'

const ZILE = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri']
const MODULE = ['BAC Matematică M1', 'BAC Matematică M2', 'BAC Română', 'Capacitate Matematică', 'Capacitate Română', 'Cursuri AI']

export default function DirigintePage() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [view, setView] = useState<View>('login')

  // Login state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginErr, setLoginErr] = useState('')
  const [logging, setLogging] = useState(false)

  // Register state
  const [regNume, setRegNume] = useState('')
  const [regScoala, setRegScoala] = useState('')
  const [regJudet, setRegJudet] = useState('')
  const [regClasa, setRegClasa] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPass, setRegPass] = useState('')
  const [regZi, setRegZi] = useState('')
  const [regOra, setRegOra] = useState('')
  const [regModul, setRegModul] = useState('')
  const [registering, setRegistering] = useState(false)
  const [regDone, setRegDone] = useState(false)

  // Dashboard (demo after login)
  const [codIntro, setCodIntro] = useState('')
  const [codActiv, setCodActiv] = useState(false)
  const [minuteRamase, setMinuteRamase] = useState(60)

  const demoDashboard = {
    nume: 'Prof. Maria Ionescu',
    scoala: 'Colegiul Național "Elena Cuza"',
    judet: 'Dolj',
    clasa: '10B',
    zi: 'Joi',
    ora: '08:00',
    modul: 'BAC Matematică M1',
    cod: 'DRGX-7291',
    status: 'PENDING' as 'PENDING' | 'ACTIVE' | 'EXPIRED',
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { setLoginErr('Completați email și parolă.'); return }
    setLogging(true)
    setLoginErr('')
    await new Promise(r => setTimeout(r, 900))
    setLogging(false)
    setView('dashboard')
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!regNume || !regScoala || !regEmail || !regPass || !regZi || !regOra || !regModul) {
      return
    }
    setRegistering(true)
    await new Promise(r => setTimeout(r, 1200))
    setRegistering(false)
    setRegDone(true)
  }

  function activareCod() {
    if (codIntro.trim().toUpperCase() === demoDashboard.cod) {
      setCodActiv(true)
    }
  }

  const STATUS_COLOR: Record<string, string> = {
    PENDING: '#f59e0b',
    ACTIVE: '#22c55e',
    EXPIRED: '#ef4444',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060b14',
      fontFamily: "'Segoe UI', Arial, sans-serif",
      color: '#f1f5f9',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '20px 16px' : '40px 20px',
    }}>

      {/* Back */}
      <button
        onClick={() => router.push('/demo')}
        style={{
          position: 'fixed', top: 20, left: 20,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '10px',
          padding: '8px 16px',
          color: '#94a3b8',
          cursor: 'pointer',
          fontSize: '13px',
          fontFamily: 'inherit',
        }}
      >
        ← Înapoi
      </button>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '16px',
          background: 'linear-gradient(135deg, #16a34a, #22c55e)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', margin: '0 auto 16px',
          boxShadow: '0 8px 24px rgba(34,197,94,0.35)',
        }}>👨‍🏫</div>
        <div style={{ fontSize: '20px', fontWeight: 800, color: '#f1f5f9' }}>Portal Diriginte</div>
        <div style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>EDU DIGITAL · AIcraiova</div>
      </div>

      {/* ---- LOGIN ---- */}
      {view === 'login' && (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: '20px',
          padding: isMobile ? '28px 20px' : '36px 40px',
          width: '100%',
          maxWidth: '400px',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>Autentificare</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input
              type="email"
              placeholder="Email școlar"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Parolă"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={inputStyle}
            />
            {loginErr && <div style={{ fontSize: '12px', color: '#ef4444', textAlign: 'center' }}>{loginErr}</div>}
            <button type="submit" disabled={logging} style={btnGreen}>
              {logging ? 'Se autentifică...' : 'Intră în cont →'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span style={{ fontSize: '13px', color: '#475569' }}>Nu ai cont? </span>
            <button onClick={() => setView('register')} style={{ background: 'none', border: 'none', color: '#22c55e', cursor: 'pointer', fontSize: '13px', fontWeight: 700, fontFamily: 'inherit' }}>
              Înregistrează-te
            </button>
          </div>
          <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '10px', fontSize: '11px', color: '#4ade80', textAlign: 'center' }}>
            Demo: orice email + parolă funcționează
          </div>
        </div>
      )}

      {/* ---- REGISTER ---- */}
      {view === 'register' && !regDone && (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: '20px',
          padding: isMobile ? '28px 20px' : '36px 40px',
          width: '100%',
          maxWidth: '480px',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px', textAlign: 'center' }}>Înregistrare Diriginte</h2>
          <p style={{ fontSize: '12px', color: '#475569', textAlign: 'center', marginBottom: '24px' }}>
            Contul tău trebuie aprobat de ISJ înainte de activare.
          </p>
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input placeholder="Nume complet" value={regNume} onChange={e => setRegNume(e.target.value)} style={inputStyle} required />
            <input placeholder="Școala (denumire completă)" value={regScoala} onChange={e => setRegScoala(e.target.value)} style={inputStyle} required />
            <input placeholder="Județul" value={regJudet} onChange={e => setRegJudet(e.target.value)} style={inputStyle} required />
            <input placeholder="Clasa dirigată (ex: 10B)" value={regClasa} onChange={e => setRegClasa(e.target.value)} style={inputStyle} required />
            <input type="email" placeholder="Email școlar" value={regEmail} onChange={e => setRegEmail(e.target.value)} style={inputStyle} required />
            <input type="password" placeholder="Parolă" value={regPass} onChange={e => setRegPass(e.target.value)} style={inputStyle} required />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <select value={regZi} onChange={e => setRegZi(e.target.value)} style={selectStyle} required>
                <option value="">Ziua dirigenției</option>
                {ZILE.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
              <input
                type="time"
                value={regOra}
                onChange={e => setRegOra(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <select value={regModul} onChange={e => setRegModul(e.target.value)} style={selectStyle} required>
              <option value="">Modulul dorit</option>
              {MODULE.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            <button type="submit" disabled={registering} style={btnGreen}>
              {registering ? 'Se trimite cererea...' : 'Trimite cerere de înregistrare →'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button onClick={() => setView('login')} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>
              ← Înapoi la login
            </button>
          </div>
        </div>
      )}

      {regDone && view === 'register' && (
        <div style={{
          background: 'rgba(34,197,94,0.06)',
          border: '1px solid rgba(34,197,94,0.25)',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          maxWidth: '400px',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Cerere trimisă!</div>
          <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.7, marginBottom: '24px' }}>
            ISJ-ul tău va aproba contul în maxim 24h. Vei primi un email de confirmare.
          </div>
          <button onClick={() => { setView('login'); setRegDone(false) }} style={btnGreen}>
            Înapoi la login
          </button>
        </div>
      )}

      {/* ---- DASHBOARD ---- */}
      {view === 'dashboard' && (
        <div style={{
          width: '100%',
          maxWidth: '540px',
        }}>
          {/* Welcome */}
          <div style={{
            background: 'rgba(34,197,94,0.06)',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'linear-gradient(135deg, #16a34a, #22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>👨‍🏫</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '15px' }}>{demoDashboard.nume}</div>
                <div style={{ fontSize: '12px', color: '#475569' }}>{demoDashboard.scoala} · {demoDashboard.judet}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
              {[
                { label: 'Clasa', val: demoDashboard.clasa },
                { label: 'Ora de dirigenție', val: `${demoDashboard.zi} · ${demoDashboard.ora}` },
                { label: 'Modul', val: demoDashboard.modul },
              ].map(r => (
                <div key={r.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px 14px' }}>
                  <div style={{ color: '#475569', marginBottom: '2px' }}>{r.label}</div>
                  <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{r.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Codul zilei */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '16px',
          }}>
            <div style={{ fontSize: '13px', color: '#475569', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Codul sesiunii de azi · {demoDashboard.zi}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                fontSize: isMobile ? '24px' : '32px',
                fontWeight: 900,
                letterSpacing: '4px',
                color: codActiv ? '#22c55e' : '#f59e0b',
                fontFamily: 'monospace',
              }}>
                {demoDashboard.cod}
              </div>
              <div style={{
                background: codActiv ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                border: `1px solid ${codActiv ? 'rgba(34,197,94,0.4)' : 'rgba(245,158,11,0.4)'}`,
                borderRadius: '20px',
                padding: '4px 12px',
                fontSize: '11px',
                fontWeight: 700,
                color: codActiv ? '#22c55e' : '#f59e0b',
              }}>
                {codActiv ? '🟢 ACTIV' : '🟡 PENDING'}
              </div>
            </div>

            {codActiv ? (
              <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', color: '#4ade80', fontWeight: 600 }}>⏱ Sesiune activă — {minuteRamase} minute rămase</div>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>20 întrebări disponibile pentru clasa ta</div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '12px', color: '#475569', marginBottom: '10px' }}>
                  Introdu codul pe calculatorul clasei pentru a porni sesiunea (60 min, 20 întrebări):
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    placeholder="Introdu codul pe proiector..."
                    value={codIntro}
                    onChange={e => setCodIntro(e.target.value)}
                    style={{ ...inputStyle, flex: 1, fontFamily: 'monospace', letterSpacing: '2px' }}
                  />
                  <button onClick={activareCod} style={{ ...btnGreen, padding: '0 20px', whiteSpace: 'nowrap' }}>
                    Activează
                  </button>
                </div>
                {codIntro && codIntro.trim().toUpperCase() !== demoDashboard.cod && (
                  <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '6px' }}>Cod incorect. Verificați și reîncercați.</div>
                )}
              </div>
            )}
          </div>

          {/* Card EDU Digital */}
          <button
            onClick={() => router.push('/edu')}
            style={{
              width: '100%',
              background: 'rgba(20,184,166,0.06)',
              border: '1.5px solid rgba(20,184,166,0.25)',
              borderRadius: '20px',
              padding: '24px',
              cursor: 'pointer',
              textAlign: 'left',
              marginBottom: '16px',
              fontFamily: "'Segoe UI', Arial, sans-serif",
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(20,184,166,0.12)'
              e.currentTarget.style.borderColor = '#14b8a6'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(20,184,166,0.06)'
              e.currentTarget.style.borderColor = 'rgba(20,184,166,0.25)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: 48, height: 48, borderRadius: '14px', flexShrink: 0,
                background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px', boxShadow: '0 4px 14px rgba(20,184,166,0.3)',
              }}>🤖</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'inline-block', background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.3)', borderRadius: '20px', padding: '2px 10px', fontSize: '10px', fontWeight: 800, color: '#14b8a6', letterSpacing: '1px', marginBottom: '6px' }}>
                  EDU DIGITAL
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>Educație Digitală</div>
                <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
                  Accesează cursurile AI, pregătirea BAC și Capacitate pentru clasa ta.
                </div>
              </div>
              <div style={{ color: '#14b8a6', fontSize: '20px', flexShrink: 0 }}>→</div>
            </div>
          </button>

          {/* Info */}
          <div style={{ fontSize: '12px', color: '#1e293b', textAlign: 'center', lineHeight: 1.6 }}>
            Codul apare automat la 8:00 în ziua orei tale de dirigenție.<br />
            Expiră la 60 min după activare sau la miezul nopții.
          </div>

          <button
            onClick={() => setView('login')}
            style={{ display: 'block', width: '100%', marginTop: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px', color: '#475569', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}
          >
            Deconectare
          </button>
        </div>
      )}

      <style>{`
        input::placeholder { color: #334155; }
        select option { background: #0d1117; }
      `}</style>
    </div>
  )
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

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
}

const btnGreen: React.CSSProperties = {
  background: 'linear-gradient(135deg, #16a34a, #22c55e)',
  border: 'none',
  borderRadius: '12px',
  padding: '13px 24px',
  fontSize: '14px',
  fontWeight: 700,
  color: '#fff',
  cursor: 'pointer',
  fontFamily: "'Segoe UI', Arial, sans-serif",
  boxShadow: '0 4px 16px rgba(34,197,94,0.3)',
  transition: 'opacity 0.2s',
}
