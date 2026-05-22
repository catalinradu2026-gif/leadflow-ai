'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useIsMobile } from '../../hooks/useIsMobile'

type View = 'login' | 'dashboard'
type Clasa = '8' | '12'

export default function EleviPage() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [view, setView] = useState<View>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [logging, setLogging] = useState(false)
  const [clasa, setClasa] = useState<Clasa>('12')
  const [hovered, setHovered] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!username || !password) { setErr('Completați utilizatorul și parola.'); return }
    setLogging(true); setErr('')
    await new Promise(r => setTimeout(r, 800))
    setLogging(false)
    setClasa(username.toLowerCase().includes('8') ? '8' : '12')
    setView('dashboard')
  }

  const materii12 = [
    { id: 'mat-m1', icon: '📐', label: 'Matematică M1', desc: 'Algebră, analiză, geometrie', color: '#6366f1', route: '/edu/bac/matematica' },
    { id: 'mat-m2', icon: '📊', label: 'Matematică M2', desc: 'Profil tehnic & vocațional', color: '#8b5cf6', route: '/edu/bac/matematica' },
    { id: 'romana', icon: '📖', label: 'Limba Română', desc: 'Literatură, eseu, comentariu', color: '#ec4899', route: '/edu/bac/romana' },
    { id: 'ai', icon: '🤖', label: 'Cursuri AI', desc: 'Inteligență artificială pentru elevi', color: '#14b8a6', route: '/edu/cursuri-ai' },
  ]

  const materii8 = [
    { id: 'cap-mat', icon: '📐', label: 'Matematică', desc: 'Pregătire Evaluare Națională', color: '#6366f1', route: '/edu/capacitate/matematica' },
    { id: 'cap-rom', icon: '📖', label: 'Limba Română', desc: 'Pregătire Evaluare Națională', color: '#ec4899', route: '/edu/capacitate/romana' },
    { id: 'ai', icon: '🤖', label: 'Cursuri AI', desc: 'Inteligență artificială pentru elevi', color: '#14b8a6', route: '/edu/cursuri-ai' },
  ]

  const materii = clasa === '12' ? materii12 : materii8
  const titluClasa = clasa === '12' ? 'Bacalaureat · Clasa a 12-a' : 'Evaluare Națională · Clasa a 8-a'

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
      padding: isMobile ? '20px 16px 40px' : '40px 20px',
    }}>

      {/* Back */}
      <button
        onClick={() => router.push('/aracip')}
        style={{
          position: 'fixed', top: 20, left: 20,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '10px', padding: '8px 16px',
          color: '#94a3b8', cursor: 'pointer',
          fontSize: '13px', fontFamily: 'inherit',
        }}
      >← Înapoi</button>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '16px',
          background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', margin: '0 auto 16px',
          boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
        }}>🎓</div>
        <div style={{ fontSize: '20px', fontWeight: 800 }}>Portal Elevi</div>
        <div style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>EDU DIGITAL · AIcraiova</div>
      </div>

      {/* LOGIN */}
      {view === 'login' && (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '20px',
          padding: isMobile ? '28px 20px' : '36px 40px',
          width: '100%', maxWidth: '400px',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Autentificare Elev</h2>
          <p style={{ fontSize: '12px', color: '#475569', textAlign: 'center', marginBottom: '24px' }}>
            Folosește datele primite de la dirigintele tău
          </p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input
              placeholder="Utilizator (ex: ion.popescu.12a)"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={inputStyle}
              autoComplete="username"
            />
            <input
              type="password"
              placeholder="Parolă"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={inputStyle}
              autoComplete="current-password"
            />
            {err && <div style={{ fontSize: '12px', color: '#ef4444', textAlign: 'center' }}>{err}</div>}
            <button type="submit" disabled={logging} style={btnIndigo}>
              {logging ? 'Se verifică...' : 'Intră în cont →'}
            </button>
          </form>
          <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '10px', fontSize: '11px', color: '#818cf8', textAlign: 'center', lineHeight: 1.6 }}>
            Nu ai cont? Cere utilizatorul și parola de la dirigintele clasei tale.
          </div>
          <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', fontSize: '11px', color: '#334155', textAlign: 'center' }}>
            Demo: orice date funcționează · scrie "8" în user pentru clasa a 8-a
          </div>
        </div>
      )}

      {/* DASHBOARD */}
      {view === 'dashboard' && (
        <div style={{ width: '100%', maxWidth: '560px' }}>

          {/* Header student */}
          <div style={{
            background: 'rgba(99,102,241,0.06)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '20px',
            padding: '20px 24px',
            marginBottom: '20px',
            display: 'flex', alignItems: 'center', gap: '14px',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: '14px', flexShrink: 0,
              background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
            }}>🎓</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '15px', textTransform: 'capitalize' }}>{username.replace(/\./g, ' ')}</div>
              <div style={{ fontSize: '12px', color: '#6366f1', fontWeight: 600, marginTop: '2px' }}>{titluClasa}</div>
            </div>
            {/* Toggle clasă */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {([['8', 'Capacitate'], ['12', 'Bacalaureat']] as [Clasa, string][]).map(([c, label]) => (
                <button key={c} onClick={() => setClasa(c)} style={{
                  background: clasa === c ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${clasa === c ? '#6366f1' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '8px', padding: '5px 12px',
                  color: clasa === c ? '#a5b4fc' : '#475569',
                  cursor: 'pointer', fontSize: '12px', fontWeight: 700,
                  fontFamily: 'inherit',
                }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Gamification */}
          {(() => {
            const coins = 127; const nivel = 3; const streak = 7
            const badges = ['🌟 Primul pas','📐 Matematician','🔥 Dedicat','⚡ Rapid']
            const nivelLabel = ['Nou','Începător','Mediu','Avansat','Expert','Master'][nivel]
            const coinsPentruNivel = [0,30,80,150,250,400]
            const progres = Math.round(((coins - coinsPentruNivel[nivel]) / (coinsPentruNivel[nivel+1] - coinsPentruNivel[nivel])) * 100)
            return (
              <div style={{ background: 'rgba(251,191,36,0.04)', border: '1px solid rgba(251,191,36,0.15)', borderRadius: '20px', padding: '18px 20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '20px' }}>🪙</span>
                      <span style={{ fontSize: '22px', fontWeight: 900, color: '#fbbf24' }}>{coins}</span>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>AI Coins</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#6366f1', background: 'rgba(99,102,241,0.15)', borderRadius: '6px', padding: '2px 8px' }}>Nivel {nivel} · {nivelLabel}</span>
                      {streak > 0 && <span style={{ fontSize: '11px', color: '#f97316' }}>🔥 {streak} zile streak</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#475569', marginBottom: '4px' }}>Progres nivel {nivel + 1}</div>
                    <div style={{ width: 80, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${progres}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #fbbf24)', borderRadius: '3px' }} />
                    </div>
                    <div style={{ fontSize: '10px', color: '#475569', marginTop: '3px' }}>{progres}%</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {badges.map(b => (
                    <div key={b} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', padding: '4px 10px', fontSize: '11px', color: '#a5b4fc' }}>{b}</div>
                  ))}
                  <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '4px 10px', fontSize: '11px', color: '#334155' }}>+3 de deblocat</div>
                </div>
              </div>
            )
          })()}

          {/* Materii */}
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px', paddingLeft: '4px' }}>
            Materiile tale
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {materii.map(m => (
              <button
                key={m.id}
                onClick={() => router.push(m.route)}
                onMouseEnter={() => setHovered(m.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: hovered === m.id ? `${m.color}18` : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${hovered === m.id ? m.color : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '16px',
                  padding: '18px 20px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: '16px',
                  transition: 'all 0.2s',
                  transform: hovered === m.id ? 'translateX(4px)' : 'translateX(0)',
                  fontFamily: 'inherit',
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: '12px', flexShrink: 0,
                  background: `${m.color}22`,
                  border: `1px solid ${m.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px',
                }}>
                  {m.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9', marginBottom: '3px' }}>{m.label}</div>
                  <div style={{ fontSize: '12px', color: '#475569' }}>{m.desc}</div>
                </div>
                <div style={{ color: m.color, fontSize: '18px', opacity: hovered === m.id ? 1 : 0.4, transition: 'opacity 0.2s' }}>→</div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setView('login')}
            style={{ display: 'block', width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px', color: '#475569', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}
          >
            Deconectare
          </button>
        </div>
      )}

      <style>{`input::placeholder { color: #334155; }`}</style>
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
  boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
  transition: 'opacity 0.2s',
}
