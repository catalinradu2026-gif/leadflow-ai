'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

export default function EduLanding() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [sectiune, setSectiune] = useState<'scoala' | 'gradinita'>('scoala')

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '16px' : '40px 20px',
      fontFamily: "'Segoe UI', Arial, sans-serif",
    }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '40px',
          padding: '8px 20px',
          marginBottom: '28px',
          fontSize: '13px',
          color: '#a5b4fc',
          letterSpacing: '0.5px',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }} />
          Platformă Educațională AI — România
        </div>

        <h1 style={{
          fontSize: isMobile ? '32px' : '52px',
          fontWeight: 800,
          color: '#fff',
          lineHeight: 1.15,
          marginBottom: '20px',
          letterSpacing: '-1.5px',
        }}>
          Educație cu Inteligență<br />
          <span style={{ color: '#818cf8' }}>Artificială</span>
        </h1>

        <p style={{
          fontSize: '18px',
          color: '#94a3b8',
          maxWidth: '560px',
          lineHeight: 1.7,
          margin: '0 auto',
        }}>
          Instrumente AI interactive pentru elevi și profesori din România.
          Predare modernă, pregătire BAC, învățare adaptivă.
        </p>
      </div>

      {/* Tab selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '6px' }}>
        {[
          { key: 'scoala', label: '🏫 Școală', desc: 'Cls. I–XII' },
          { key: 'gradinita', label: '🧸 Grădiniță', desc: 'În curând' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setSectiune(t.key as 'scoala' | 'gradinita')}
            style={{
              background: sectiune === t.key ? '#6366f1' : 'transparent',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 28px',
              cursor: 'pointer',
              color: sectiune === t.key ? '#fff' : '#64748b',
              fontWeight: 700,
              fontSize: '15px',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            {t.label}
            <span style={{ fontSize: '10px', fontWeight: 400, opacity: 0.7 }}>{t.desc}</span>
          </button>
        ))}
      </div>

      {/* Main Cards */}
      {sectiune === 'gradinita' ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', maxWidth: '500px' }}>
          <div style={{ fontSize: '72px', marginBottom: '24px' }}>🧸</div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>Modul Grădiniță</h2>
          <p style={{ fontSize: '16px', color: '#64748b', lineHeight: 1.7, marginBottom: '32px' }}>
            Conținut educațional AI adaptat pentru copii de 3–6 ani — povești interactive, jocuri de litere și cifre, activități creative. În pregătire.
          </p>
          <div style={{ display: 'inline-block', background: 'rgba(99,102,241,0.15)', border: '1px solid #6366f155', borderRadius: '12px', padding: '10px 24px', fontSize: '13px', color: '#a5b4fc' }}>
            🔔 Disponibil în curând
          </div>
        </div>
      ) : (
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '24px',
        maxWidth: '1100px',
        width: '100%',
        marginBottom: '48px',
      }}>

        {/* Educatie Digitala */}
        <div
          onClick={() => router.push('/edu/cursuri-ai')}
          style={{
            background: isMobile ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)',
            border: '2px solid #6366f1',
            borderRadius: '20px',
            padding: '40px 32px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            position: 'relative',
            overflow: 'hidden',
            transform: isMobile ? 'translateY(-4px)' : undefined,
            boxShadow: isMobile ? '0 12px 32px rgba(99,102,241,0.25), 0 4px 0 rgba(99,102,241,0.4)' : undefined,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.background = 'rgba(99,102,241,0.15)'
            ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.background = 'rgba(99,102,241,0.08)'
            ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
          }}
        >
          <div style={{
            position: 'absolute', top: '-30px', right: '-30px',
            width: '120px', height: '120px',
            background: 'rgba(99,102,241,0.1)',
            borderRadius: '50%',
          }} />
          <div style={{ fontSize: '56px', marginBottom: '20px' }}>🤖</div>
          <div style={{
            display: 'inline-block',
            background: '#4338ca',
            color: '#a5b4fc',
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 12px',
            borderRadius: '20px',
            marginBottom: '14px',
            letterSpacing: '0.5px',
          }}>
            16 MODULE · INTERACTIV
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '12px', lineHeight: 1.2 }}>
            AI pentru<br />Elevi
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '28px' }}>
            Cursuri AI interactive pentru elevi — ce este inteligența artificială, cum te ajută la școală, cariere în tech, fake news, educație financiară și pregătire BAC/Capacitate.
          </p>
          <div style={{
            background: '#6366f1',
            color: '#fff',
            padding: '14px 28px',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: 700,
            display: 'inline-block',
          }}>
            Începe cursul →
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Gimnaziu', 'Liceu', 'Proiector', '24/7'].map(tag => (
              <span key={tag} style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', fontSize: '11px', padding: '3px 10px', borderRadius: '20px' }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Cursuri Profesori */}
        <div
          onClick={() => router.push('/edu/cursuri-profesori')}
          style={{
            background: isMobile ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.06)',
            border: '2px solid #f59e0b',
            borderRadius: '20px',
            padding: '40px 32px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            position: 'relative',
            overflow: 'hidden',
            transform: isMobile ? 'translateY(-4px)' : undefined,
            boxShadow: isMobile ? '0 12px 32px rgba(245,158,11,0.25), 0 4px 0 rgba(245,158,11,0.4)' : undefined,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.background = 'rgba(245,158,11,0.12)'
            ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.background = 'rgba(245,158,11,0.06)'
            ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
          }}
        >
          <div style={{
            position: 'absolute', top: '-30px', right: '-30px',
            width: '120px', height: '120px',
            background: 'rgba(245,158,11,0.08)',
            borderRadius: '50%',
          }} />
          <div style={{ fontSize: '56px', marginBottom: '20px' }}>👩‍🏫</div>
          <div style={{
            display: 'inline-block',
            background: '#78350f',
            color: '#fde68a',
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 12px',
            borderRadius: '20px',
            marginBottom: '14px',
            letterSpacing: '0.5px',
          }}>
            8 MODULE · FORMARE CONTINUĂ
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '12px', lineHeight: 1.2 }}>
            Formare<br />Continuă
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '28px' }}>
            Formează-te în utilizarea AI la clasă. Pregătire lecții, evaluare, personalizare predare și certificat de formare recunoscut.
          </p>
          <div style={{
            background: '#f59e0b',
            color: '#fff',
            padding: '14px 28px',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: 700,
            display: 'inline-block',
          }}>
            Începe formarea →
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['ARACIP', 'Certificate', 'Credite', '24/7'].map(tag => (
              <span key={tag} style={{ background: 'rgba(245,158,11,0.15)', color: '#fde68a', fontSize: '11px', padding: '3px 10px', borderRadius: '20px' }}>{tag}</span>
            ))}
          </div>
        </div>

      </div>
      )}

      {/* Stats */}
      <div style={{
        display: 'flex',
        gap: '48px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingTop: '36px',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {[
          { val: '14', label: 'Module Interactive' },
          { val: '24/7', label: 'Disponibil Oricând' },
          { val: 'AI', label: 'Profesor Adaptiv' },
          { val: '100%', label: 'Gratuit pentru Școli' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#818cf8' }}>{s.val}</div>
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '36px', fontSize: '12px', color: '#334155', textAlign: 'center' }}>
        Powered by <strong style={{ color: '#818cf8' }}>AIcraiova</strong> · NewTime Concept Solutions S.R.L.
      </div>
    </div>
  )
}
