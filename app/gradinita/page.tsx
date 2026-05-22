'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

export default function PortalGradinita() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [hovered, setHovered] = useState<string | null>(null)

  const sectiuni = [
    {
      id: 'director',
      icon: '🏛️',
      tag: 'Conducere',
      title: 'Director',
      desc: 'Documente ISJ, raportări, comunicare cu inspectoratul și statistici unitate în timp real.',
      color: '#3b82f6',
      route: '/demo/director',
    },
    {
      id: 'educatoare',
      icon: '🌸',
      tag: 'Educatoare',
      title: 'Educatoare & Resurse',
      desc: 'Planuri de activitate AI, fișe didactice digitale și resurse pentru grupa ta.',
      color: '#f43f5e',
      route: '/edu/cursuri-profesori',
    },
    {
      id: 'parinti',
      icon: '👨‍👩‍👧',
      tag: 'Părinți',
      title: 'Părinți și Copii',
      desc: 'Vezi activitățile grupei, comunicare cu educatoarea și progresul copilului tău.',
      color: '#64748b',
      route: '',
      inactiv: true,
    },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060b14',
      fontFamily: "'Segoe UI', Arial, sans-serif",
      color: '#f1f5f9',
      padding: isMobile ? '0 0 40px' : '0 0 60px',
    }}>

      {/* Header */}
      <header style={{
        padding: isMobile ? '18px 20px' : '24px 48px',
        display: 'flex', alignItems: 'center', gap: '16px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(6,11,20,0.9)',
        position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: 'blur(12px)',
      }}>
        <button
          onClick={() => router.push('/aracip')}
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '8px 14px', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}
        >← Înapoi</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'linear-gradient(135deg, #be185d, #f43f5e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🌈</div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 800 }}>Portal Grădiniță</div>
            <div style={{ fontSize: '11px', color: '#334155' }}>EDU DIGITAL · AIcraiova</div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: isMobile ? '48px 20px 40px' : '72px 40px 56px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '40px', padding: '7px 18px', fontSize: '12px', color: '#fb7185', fontWeight: 600, marginBottom: '24px' }}>
          🌈 Unitate de Învățământ Preșcolar
        </div>
        <h1 style={{ fontSize: isMobile ? '32px' : '52px', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-2px', marginBottom: '16px', background: 'linear-gradient(135deg, #f1f5f9 30%, #fb7185 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Tot ce are nevoie<br />grădinița ta
        </h1>
        <p style={{ fontSize: '16px', color: '#475569', maxWidth: '480px', margin: '0 auto', lineHeight: 1.75 }}>
          Director, educatoare și părinți — resurse digitale adaptate pentru unitățile preșcolare.
        </p>
      </div>

      {/* Carduri */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: isMobile ? '16px' : '20px',
        maxWidth: '760px',
        margin: '0 auto',
        padding: isMobile ? '0 16px' : '0 24px',
      }}>
        {sectiuni.map(s => (
          <button
            key={s.id}
            onClick={() => !(s as any).inactiv && s.route && router.push(s.route)}
            onMouseEnter={() => !(s as any).inactiv && setHovered(s.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: (s as any).inactiv ? 'rgba(255,255,255,0.02)' : hovered === s.id ? `${s.color}18` : 'rgba(255,255,255,0.03)',
              border: `1.5px solid ${(s as any).inactiv ? 'rgba(255,255,255,0.05)' : hovered === s.id ? s.color : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '20px',
              padding: '28px 24px',
              cursor: (s as any).inactiv ? 'default' : 'pointer',
              textAlign: 'left',
              transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
              transform: hovered === s.id ? 'translateY(-4px)' : 'translateY(0)',
              fontFamily: 'inherit',
              opacity: (s as any).inactiv ? 0.55 : 1,
              position: 'relative' as const,
            }}
          >
            {(s as any).inactiv && (
              <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(100,116,139,0.2)', border: '1px solid rgba(100,116,139,0.4)', borderRadius: '20px', padding: '2px 10px', fontSize: '10px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px' }}>
                🌐 Includere Națională
              </div>
            )}
            <div style={{ fontSize: '36px', marginBottom: '14px', filter: (s as any).inactiv ? 'grayscale(1)' : 'none' }}>{s.icon}</div>
            <div style={{ display: 'inline-flex', background: `${s.color}22`, border: `1px solid ${s.color}44`, borderRadius: '20px', padding: '3px 12px', fontSize: '10px', fontWeight: 800, color: s.color, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>{s.tag}</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: (s as any).inactiv ? '#475569' : '#f1f5f9', marginBottom: '8px' }}>{s.title}</div>
            <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.65, marginBottom: '20px' }}>{s.desc}</div>
            {!(s as any).inactiv ? (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: s.color }}>
                Accesează <span style={{ transform: hovered === s.id ? 'translateX(4px)' : 'translateX(0)', transition: 'transform 0.2s', display: 'inline-block' }}>→</span>
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: '#334155', fontStyle: 'italic' }}>Disponibil la lansarea națională</div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
