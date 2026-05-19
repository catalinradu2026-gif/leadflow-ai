'use client'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '../hooks/useIsMobile'

export default function AcreditareLanding() {
  const router = useRouter()
  const isMobile = useIsMobile()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1a1035 50%, #0f172a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '16px' : '40px 20px',
      fontFamily: "'Segoe UI', Arial, sans-serif",
    }}>

      {/* Header badge */}
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '40px',
          padding: '8px 20px',
          marginBottom: '28px',
          fontSize: '13px',
          color: '#c4b5fd',
          letterSpacing: '0.5px',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }} />
          Platformă ARACIP · Asigurarea Calității în Educație
        </div>

        <h1 style={{
          fontSize: isMobile ? '32px' : '48px',
          fontWeight: 800,
          color: '#fff',
          lineHeight: 1.15,
          marginBottom: '18px',
          letterSpacing: '-1.5px',
        }}>
          Autorizare, Acreditare<br />
          <span style={{ color: '#a78bfa' }}>și Evaluare Periodică</span>
        </h1>

        <p style={{
          fontSize: '17px',
          color: '#94a3b8',
          maxWidth: '540px',
          lineHeight: 1.7,
          margin: '0 auto',
        }}>
          Platforma digitală ARACIP pentru managementul calității în unitățile de învățământ preuniversitar din România.
        </p>

        <div style={{ marginTop: '24px' }}>
          <button
            onClick={() => router.push('/acreditare/dashboard')}
            style={{
              background: 'rgba(167,139,250,0.12)',
              border: '1px solid #a78bfa',
              borderRadius: '12px',
              padding: '12px 28px',
              fontSize: '14px',
              fontWeight: 700,
              color: '#a78bfa',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            🏛️ Dashboard ARACIP — Toate Unitățile Școlare →
          </button>
        </div>
      </div>

      {/* Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '24px',
        maxWidth: '1080px',
        width: '100%',
        marginBottom: '48px',
      }}>

        {/* Autorizare */}
        <div
          onClick={() => router.push('/acreditare/autorizare')}
          style={{
            background: 'rgba(59,130,246,0.07)',
            border: '2px solid #3b82f6',
            borderRadius: '20px',
            padding: '40px 32px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.background = 'rgba(59,130,246,0.14)'
            ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.background = 'rgba(59,130,246,0.07)'
            ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
          }}
        >
          <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', background: 'rgba(59,130,246,0.1)', borderRadius: '50%' }} />
          <div style={{ fontSize: '52px', marginBottom: '18px' }}>📋</div>
          <div style={{
            display: 'inline-block',
            background: '#1d4ed8',
            color: '#bfdbfe',
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 12px',
            borderRadius: '20px',
            marginBottom: '14px',
            letterSpacing: '0.5px',
          }}>
            ETAPA 1 · FUNCȚIONARE PROVIZORIE
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '12px', lineHeight: 1.2 }}>
            Autorizare<br />de Funcționare
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '28px' }}>
            Dosar digital pentru unități școlare noi. Verificare standarde minime, urmărire status, comunicare ARACIP în timp real.
          </p>
          <div style={{
            background: '#3b82f6',
            color: '#fff',
            padding: '13px 24px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 700,
            display: 'inline-block',
          }}>
            Depune dosar →
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Școli noi', 'Dosar digital', 'Status live'].map(tag => (
              <span key={tag} style={{ background: 'rgba(59,130,246,0.18)', color: '#93c5fd', fontSize: '11px', padding: '3px 10px', borderRadius: '20px' }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Acreditare */}
        <div
          onClick={() => router.push('/acreditare/acreditare-scolara')}
          style={{
            background: 'rgba(168,85,247,0.07)',
            border: '2px solid #a855f7',
            borderRadius: '20px',
            padding: '40px 32px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.background = 'rgba(168,85,247,0.14)'
            ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.background = 'rgba(168,85,247,0.07)'
            ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
          }}
        >
          <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', background: 'rgba(168,85,247,0.1)', borderRadius: '50%' }} />
          <div style={{ fontSize: '52px', marginBottom: '18px' }}>🏅</div>
          <div style={{
            display: 'inline-block',
            background: '#7e22ce',
            color: '#e9d5ff',
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 12px',
            borderRadius: '20px',
            marginBottom: '14px',
            letterSpacing: '0.5px',
          }}>
            ETAPA 2 · ACREDITARE PERMANENTĂ
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '12px', lineHeight: 1.2 }}>
            Acreditare<br />Instituțională
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '28px' }}>
            Evaluare completă a calității educației oferite. Dosar acreditare, vizita comisiei ARACIP, raport final și decizie de acreditare.
          </p>
          <div style={{
            background: '#a855f7',
            color: '#fff',
            padding: '13px 24px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 700,
            display: 'inline-block',
          }}>
            Solicită acreditare →
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Calitate', 'Comisie ARACIP', 'Decizie oficială'].map(tag => (
              <span key={tag} style={{ background: 'rgba(168,85,247,0.18)', color: '#d8b4fe', fontSize: '11px', padding: '3px 10px', borderRadius: '20px' }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Evaluare Periodica */}
        <div
          onClick={() => router.push('/acreditare/evaluare-periodica')}
          style={{
            background: 'rgba(20,184,166,0.07)',
            border: '2px solid #14b8a6',
            borderRadius: '20px',
            padding: '40px 32px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.background = 'rgba(20,184,166,0.14)'
            ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.background = 'rgba(20,184,166,0.07)'
            ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
          }}
        >
          <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', background: 'rgba(20,184,166,0.1)', borderRadius: '50%' }} />
          <div style={{ fontSize: '52px', marginBottom: '18px' }}>🔄</div>
          <div style={{
            display: 'inline-block',
            background: '#0f766e',
            color: '#99f6e4',
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 12px',
            borderRadius: '20px',
            marginBottom: '14px',
            letterSpacing: '0.5px',
          }}>
            ETAPA 3 · LA FIECARE 5 ANI
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '12px', lineHeight: 1.2 }}>
            Evaluare Externă<br />Periodică
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '28px' }}>
            Reevaluarea calității la fiecare 5 ani pentru menținerea acreditării. Rapoarte online, calendar vizite, decizii și recomandări ARACIP.
          </p>
          <div style={{
            background: '#14b8a6',
            color: '#fff',
            padding: '13px 24px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 700,
            display: 'inline-block',
          }}>
            Vezi calendar →
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['5 ani', 'Toate școlile', 'Raport ARACIP'].map(tag => (
              <span key={tag} style={{ background: 'rgba(20,184,166,0.18)', color: '#5eead4', fontSize: '11px', padding: '3px 10px', borderRadius: '20px' }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'flex',
        gap: '56px',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        paddingTop: '32px',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {[
          { val: '11.500', label: 'Unități Școlare' },
          { val: '42', label: 'Județe + București' },
          { val: '5 ani', label: 'Ciclu Evaluare' },
          { val: '100%', label: 'Digital, Zero Hârtie' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#a78bfa' }}>{s.val}</div>
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '32px', fontSize: '12px', color: '#334155', textAlign: 'center' }}>
        Powered by <strong style={{ color: '#a78bfa' }}>AIcraiova</strong> · NewTime Concept Solutions S.R.L. · în parteneriat cu <strong style={{ color: '#a78bfa' }}>ARACIP</strong>
      </div>
    </div>
  )
}
