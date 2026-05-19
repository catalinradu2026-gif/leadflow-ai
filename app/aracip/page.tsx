'use client'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '../hooks/useIsMobile'
import { useEffect, useState } from 'react'

export default function AracipHome() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const cards = [
    {
      id: 'isj',
      icon: '🏫',
      tag: 'Portal ISJ',
      title: 'Inspectorate &\nDirectori',
      desc: 'Dashboard centralizat pentru toate unitățile din județ. Raportare, documente și comunicare în timp real.',
      color: '#6366f1',
      colorLight: 'rgba(99,102,241,0.1)',
      colorBorder: 'rgba(99,102,241,0.25)',
      colorHover: 'rgba(99,102,241,0.18)',
      route: '/demo/isj',
    },
    {
      id: 'acreditare',
      icon: '🏅',
      tag: 'Calitate',
      title: 'Autorizare,\nAcreditare & Evaluare',
      desc: 'Dosare digitale, vizite comisii ARACIP și evaluare externă periodică — fără hârtii, 100% online.',
      color: '#a855f7',
      colorLight: 'rgba(168,85,247,0.1)',
      colorBorder: 'rgba(168,85,247,0.25)',
      colorHover: 'rgba(168,85,247,0.18)',
      route: '/acreditare',
    },
    {
      id: 'edu',
      icon: '🤖',
      tag: 'EDU·AI',
      title: 'Cursuri AI,\nBAC & Profesori',
      desc: 'Inteligență artificială în educație — cursuri interactive pentru elevi, pregătire BAC și formare continuă.',
      color: '#14b8a6',
      colorLight: 'rgba(20,184,166,0.1)',
      colorBorder: 'rgba(20,184,166,0.25)',
      colorHover: 'rgba(20,184,166,0.18)',
      route: '/edu',
    },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060b14',
      fontFamily: "'Segoe UI', Arial, sans-serif",
      color: '#f1f5f9',
      overflowX: 'hidden',
      position: 'relative',
    }}>

      {/* Background glow effects */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '600px', background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '500px', height: '500px', background: 'radial-gradient(ellipse, rgba(20,184,166,0.07) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '40%', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <header style={{
          padding: isMobile ? '18px 20px' : '24px 56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(6,11,20,0.8)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: 42, height: 42, borderRadius: '12px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #14b8a6 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', boxShadow: '0 4px 16px rgba(124,58,237,0.35)',
            }}>🏛️</div>
            <div>
              <div style={{ fontSize: '17px', fontWeight: 800, letterSpacing: '-0.3px', color: '#f1f5f9' }}>ARACIP</div>
              <div style={{ fontSize: '10px', color: '#334155', letterSpacing: '0.3px' }}>PLATFORMĂ DIGITALĂ NAȚIONALĂ</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!isMobile && (
              <span style={{ fontSize: '12px', color: '#334155' }}>România · 2026</span>
            )}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: '20px', padding: '6px 14px',
              fontSize: '12px', color: '#22c55e', fontWeight: 600,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e', animation: mounted ? 'pulse 2s infinite' : 'none' }} />
              Sistem Activ
            </div>
          </div>
        </header>

        {/* Hero */}
        <section style={{
          textAlign: 'center',
          padding: isMobile ? '60px 24px 48px' : '100px 40px 80px',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(167,139,250,0.08)',
            border: '1px solid rgba(167,139,250,0.2)',
            borderRadius: '40px',
            padding: '8px 20px',
            fontSize: '12px', color: '#c4b5fd',
            fontWeight: 600, letterSpacing: '0.3px',
            marginBottom: '32px',
          }}>
            🇷🇴 Agenția Română de Asigurare a Calității în Învățământul Preuniversitar
          </div>

          <h1 style={{
            fontSize: isMobile ? '38px' : '72px',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: isMobile ? '-1.5px' : '-3px',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #f1f5f9 30%, #a78bfa 70%, #14b8a6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Educație de calitate<br />în era digitală
          </h1>

          <p style={{
            fontSize: isMobile ? '15px' : '19px',
            color: '#475569',
            maxWidth: '560px',
            lineHeight: 1.75,
            margin: '0 auto 48px',
          }}>
            Platforma națională pentru autorizare, acreditare și evaluare a unităților de învățământ preuniversitar. Zero hârtii, 100% digital.
          </p>

          {/* Quick stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: isMobile ? '20px' : '48px',
            flexWrap: 'wrap',
            marginBottom: isMobile ? '56px' : '80px',
          }}>
            {[
              { val: '11.500', label: 'Unități școlare' },
              { val: '42', label: 'Județe' },
              { val: '100%', label: 'Digital' },
              { val: '24/7', label: 'Disponibil' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 900, color: '#a78bfa', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? '16px' : '20px',
            maxWidth: '980px',
            margin: '0 auto',
          }}>
            {cards.map(card => (
              <button
                key={card.id}
                onClick={() => router.push(card.route)}
                onMouseEnter={() => setHovered(card.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: hovered === card.id ? card.colorHover : card.colorLight,
                  border: `1.5px solid ${hovered === card.id ? card.color : card.colorBorder}`,
                  borderRadius: '24px',
                  padding: isMobile ? '28px 24px' : '36px 32px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transform: hovered === card.id ? 'translateY(-6px)' : 'translateY(0)',
                  transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                  boxShadow: hovered === card.id ? `0 20px 48px ${card.color}22` : '0 4px 20px rgba(0,0,0,0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Glow top-right */}
                <div style={{
                  position: 'absolute', top: '-40px', right: '-40px',
                  width: '120px', height: '120px',
                  background: `radial-gradient(ellipse, ${card.color}22, transparent 70%)`,
                  borderRadius: '50%',
                  transition: 'opacity 0.25s',
                  opacity: hovered === card.id ? 1 : 0.5,
                }} />

                <div style={{ fontSize: '40px', marginBottom: '16px', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}>{card.icon}</div>

                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  background: `${card.color}22`,
                  border: `1px solid ${card.color}44`,
                  borderRadius: '20px', padding: '3px 12px',
                  fontSize: '10px', fontWeight: 800, color: card.color,
                  textTransform: 'uppercase', letterSpacing: '1px',
                  marginBottom: '14px',
                }}>
                  {card.tag}
                </div>

                <div style={{
                  fontSize: isMobile ? '19px' : '21px',
                  fontWeight: 800,
                  color: '#f1f5f9',
                  lineHeight: 1.25,
                  marginBottom: '12px',
                  whiteSpace: 'pre-line',
                }}>
                  {card.title}
                </div>

                <div style={{
                  fontSize: '13px',
                  color: '#475569',
                  lineHeight: 1.65,
                  marginBottom: '24px',
                }}>
                  {card.desc}
                </div>

                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  fontSize: '13px', fontWeight: 700, color: card.color,
                  background: `${card.color}15`,
                  border: `1px solid ${card.color}33`,
                  borderRadius: '10px',
                  padding: '8px 18px',
                  transition: 'all 0.2s',
                }}>
                  Accesează
                  <span style={{
                    display: 'inline-block',
                    transform: hovered === card.id ? 'translateX(4px)' : 'translateX(0)',
                    transition: 'transform 0.2s',
                  }}>→</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Features strip */}
        <section style={{
          borderTop: '1px solid rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          padding: isMobile ? '32px 20px' : '40px 56px',
          background: 'rgba(255,255,255,0.015)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
            gap: isMobile ? '24px' : '32px',
            maxWidth: '960px',
            margin: '0 auto',
            textAlign: 'center',
          }}>
            {[
              { icon: '🔒', title: 'Securizat GDPR', desc: 'Date stocate pe servere europene' },
              { icon: '⚡', title: 'Timp Real', desc: 'Notificări și alerte instant' },
              { icon: '📄', title: 'Zero Hârtii', desc: 'Toate documentele 100% digital' },
              { icon: '🤖', title: 'AI Integrat', desc: 'Asistent inteligent disponibil 24/7' },
            ].map(f => (
              <div key={f.title}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{f.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0', marginBottom: '4px' }}>{f.title}</div>
                <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          padding: isMobile ? '24px 20px' : '28px 56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 24, height: 24, borderRadius: '6px', background: 'linear-gradient(135deg, #7c3aed, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>🏛️</div>
            <span style={{ fontSize: '12px', color: '#334155' }}>ARACIP · Platformă Digitală · România · 2026</span>
          </div>
          <div style={{ fontSize: '12px', color: '#1e293b' }}>
            Powered by <strong style={{ color: '#7c3aed' }}>AIcraiova</strong> · NewTime Concept Solutions S.R.L.
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 8px #22c55e; }
          50% { box-shadow: 0 0 16px #22c55e, 0 0 24px #22c55e44; }
        }
      `}</style>
    </div>
  )
}
