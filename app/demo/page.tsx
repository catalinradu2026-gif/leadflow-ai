'use client'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '../hooks/useIsMobile'

export default function DemoLanding() {
  const router = useRouter()
  const isMobile = useIsMobile()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '16px' : '40px 20px',
      fontFamily: "'Segoe UI', Arial, sans-serif",
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
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
          color: '#93c5fd',
          letterSpacing: '0.5px',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }} />
          DEMO LIVE — Platformă Națională Transparență Școlară
        </div>
        <h1 style={{
          fontSize: isMobile ? '28px' : '42px',
          fontWeight: 800,
          color: '#fff',
          lineHeight: 1.2,
          marginBottom: '16px',
          letterSpacing: '-1px',
        }}>
          Sistem Național AI<br />
          <span style={{ color: '#60a5fa' }}>ISJ → Școli România</span>
        </h1>
        <p style={{ fontSize: '17px', color: '#94a3b8', maxWidth: '520px', lineHeight: 1.7 }}>
          Transparență totală între inspectoratele județene și directorii de școli.
          Comunicare oficială, documente indexate AI, notificări instant.
        </p>
      </div>

      {/* Role Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '20px',
        maxWidth: '700px',
        width: '100%',
      }}>
        {/* Inspector National */}
        <div
          onClick={() => router.push('/demo/inspector')}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '16px',
            padding: '32px 24px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            textAlign: 'center',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.1)'
            ;(e.currentTarget as HTMLDivElement).style.borderColor = '#3b82f6'
            ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)'
            ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.12)'
            ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🇷🇴</div>
          <div style={{
            display: 'inline-block',
            background: '#1d4ed8',
            color: '#93c5fd',
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 12px',
            borderRadius: '20px',
            marginBottom: '12px',
            letterSpacing: '0.5px',
          }}>
            NIVEL NAȚIONAL
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
            Titlu ARACIP
          </h3>
          <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '24px' }}>
            Vedere completă asupra tuturor județelor și școlinor din România. Statistici naționale în timp real.
          </p>
          <div style={{
            background: '#1d4ed8',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
          }}>
            Intră ca Inspector Național →
          </div>
        </div>

        {/* ISJ */}
        <div
          onClick={() => router.push('/demo/isj')}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '2px solid #3b82f6',
            borderRadius: '16px',
            padding: '32px 24px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            textAlign: 'center',
            position: 'relative',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.background = 'rgba(59,130,246,0.1)'
            ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)'
            ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
          }}
        >
          <div style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#3b82f6',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 16px',
            borderRadius: '20px',
            whiteSpace: 'nowrap',
          }}>
            DEMO RECOMANDAT
          </div>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏛️</div>
          <div style={{
            display: 'inline-block',
            background: '#164e63',
            color: '#67e8f9',
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 12px',
            borderRadius: '20px',
            marginBottom: '12px',
            letterSpacing: '0.5px',
          }}>
            NIVEL JUDEȚEAN
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
            ISJ Dolj
          </h3>
          <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '24px' }}>
            Trimite documente, comunică cu directorii, vede cine a citit și cine nu. Control total asupra județelui.
          </p>
          <div style={{
            background: '#3b82f6',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
          }}>
            Intră ca ISJ Dolj →
          </div>
        </div>

      </div>

      {/* Stats bar */}
      <div style={{
        display: 'flex',
        gap: '40px',
        marginTop: '60px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: '32px',
      }}>
        {[
          { val: '11.500+', label: 'Școli & Grădinițe' },
          { val: '42', label: 'Județe' },
          { val: '24/7', label: 'Asistent AI Activ' },
          { val: '100%', label: 'Date Securizate' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#60a5fa' }}>{s.val}</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '32px', fontSize: '12px', color: '#475569', textAlign: 'center' }}>
        Powered by <strong style={{ color: '#60a5fa' }}>AIcraiova</strong> · NewTime Concept Solutions S.R.L. · 0787 813 485
      </div>
    </div>
  )
}
