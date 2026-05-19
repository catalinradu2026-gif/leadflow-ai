'use client'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '../hooks/useIsMobile'

export default function AracipHome() {
  const router = useRouter()
  const isMobile = useIsMobile()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Segoe UI', Arial, sans-serif",
    }}>

      {/* Header */}
      <header style={{
        borderBottom: '1px solid #1e293b',
        padding: isMobile ? '16px 20px' : '20px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '10px',
            background: 'linear-gradient(135deg, #7c3aed, #14b8a6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px',
          }}>🏛️</div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px' }}>ARACIP</div>
            <div style={{ fontSize: '10px', color: '#475569', marginTop: '-2px' }}>Platformă Digitală · România</div>
          </div>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: '20px', padding: '5px 14px',
          fontSize: '12px', color: '#22c55e', fontWeight: 600,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px #22c55e' }} />
          {isMobile ? 'Online' : 'Sistem Online'}
        </div>
      </header>

      {/* Hero */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '40px 20px' : '60px 40px',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: isMobile ? '11px' : '12px',
          fontWeight: 700,
          color: '#7c3aed',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '20px',
        }}>
          Agenția Română de Asigurare a Calității în Învățământul Preuniversitar
        </div>

        <h1 style={{
          fontSize: isMobile ? '34px' : '58px',
          fontWeight: 900,
          color: '#f1f5f9',
          lineHeight: 1.1,
          letterSpacing: '-2px',
          marginBottom: '20px',
          maxWidth: '780px',
        }}>
          Calitate în Educație<br />
          <span style={{ color: '#a78bfa' }}>Digitalizat</span>
        </h1>

        <p style={{
          fontSize: isMobile ? '15px' : '18px',
          color: '#64748b',
          maxWidth: '520px',
          lineHeight: 1.7,
          marginBottom: isMobile ? '48px' : '64px',
        }}>
          Platforma națională pentru autorizare, acreditare și evaluare externă a unităților de învățământ.
        </p>

        {/* 3 Carduri principale */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? '16px' : '20px',
          width: '100%',
          maxWidth: '960px',
          marginBottom: '48px',
        }}>

          {/* Portal ISJ */}
          <button
            onClick={() => router.push('/demo/isj')}
            style={{
              background: 'rgba(99,102,241,0.06)',
              border: '1.5px solid rgba(99,102,241,0.3)',
              borderRadius: '20px',
              padding: isMobile ? '28px 24px' : '36px 28px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.12)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#6366f1'
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.06)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99,102,241,0.3)'
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
            }}
          >
            <div style={{ fontSize: '36px', marginBottom: '14px' }}>🏫</div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Portal ISJ</div>
            <div style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: 800, color: '#f1f5f9', marginBottom: '10px', lineHeight: 1.2 }}>
              Inspectorate &<br />Directori
            </div>
            <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
              Dashboard centralizat, raportare, documente și comunicare ISJ-directori.
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#6366f1' }}>
              Accesează <span>→</span>
            </div>
          </button>

          {/* Acreditare */}
          <button
            onClick={() => router.push('/acreditare')}
            style={{
              background: 'rgba(124,58,237,0.08)',
              border: '1.5px solid rgba(124,58,237,0.4)',
              borderRadius: '20px',
              padding: isMobile ? '28px 24px' : '36px 28px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(124,58,237,0.15)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#7c3aed'
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(124,58,237,0.08)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(124,58,237,0.4)'
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
            }}
          >
            <div style={{ fontSize: '36px', marginBottom: '14px' }}>🏅</div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Calitate</div>
            <div style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: 800, color: '#f1f5f9', marginBottom: '10px', lineHeight: 1.2 }}>
              Autorizare,<br />Acreditare & Evaluare
            </div>
            <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
              Dosare digitale, vizite comisii ARACIP și evaluare externă periodică la 5 ani.
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#a78bfa' }}>
              Accesează <span>→</span>
            </div>
          </button>

          {/* EDU AI */}
          <button
            onClick={() => router.push('/edu')}
            style={{
              background: 'rgba(20,184,166,0.06)',
              border: '1.5px solid rgba(20,184,166,0.3)',
              borderRadius: '20px',
              padding: isMobile ? '28px 24px' : '36px 28px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(20,184,166,0.12)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#14b8a6'
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(20,184,166,0.06)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(20,184,166,0.3)'
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
            }}
          >
            <div style={{ fontSize: '36px', marginBottom: '14px' }}>🤖</div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#14b8a6', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>EDU·AI</div>
            <div style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: 800, color: '#f1f5f9', marginBottom: '10px', lineHeight: 1.2 }}>
              Cursuri AI,<br />BAC & Profesori
            </div>
            <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
              Inteligență artificială în educație — cursuri interactive, pregătire BAC, formare profesori.
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#14b8a6' }}>
              Accesează <span>→</span>
            </div>
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          gap: isMobile ? '28px' : '56px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          borderTop: '1px solid #1e293b',
          paddingTop: '32px',
          width: '100%',
          maxWidth: '700px',
        }}>
          {[
            { val: '11.500', label: 'Unități Școlare' },
            { val: '42', label: 'Județe' },
            { val: '5 ani', label: 'Ciclu Evaluare' },
            { val: '24/7', label: 'Disponibil' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: 900, color: '#a78bfa' }}>{s.val}</div>
              <div style={{ fontSize: '11px', color: '#334155', marginTop: '3px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #1e293b',
        padding: isMobile ? '16px 20px' : '20px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div style={{ fontSize: '12px', color: '#334155' }}>
          © 2026 ARACIP · Platformă digitală
        </div>
        <div style={{ fontSize: '12px', color: '#334155' }}>
          Powered by <strong style={{ color: '#7c3aed' }}>AIcraiova</strong> · NewTime Concept Solutions S.R.L.
        </div>
      </footer>
    </div>
  )
}
