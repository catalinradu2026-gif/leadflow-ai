'use client'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '../../hooks/useIsMobile'

export default function ExameneLanding() {
  const router = useRouter()
  const isMobile = useIsMobile()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1a1000 50%, #0f172a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '24px 16px' : '60px 20px',
      fontFamily: "'Segoe UI', Arial, sans-serif",
    }}>

      {/* Topbar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: '#0f172a', borderBottom: '1px solid #1e293b', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '16px', height: '56px', zIndex: 10 }}>
        <button onClick={() => router.push('/aracip')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Acasă</button>
        <div style={{ width: 1, height: 20, background: '#1e293b' }} />
        <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>🎯 Pregătire Examene</span>
        <span style={{ background: '#78350f', color: '#fde68a', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>AI 24/7</span>
      </div>

      <div style={{ paddingTop: '56px', width: '100%', maxWidth: '860px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px', paddingTop: '40px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: '40px', padding: '8px 20px', marginBottom: '24px',
            fontSize: '13px', color: '#fde68a',
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', boxShadow: '0 0 8px #f59e0b' }} />
            Profesor AI acasă · Gratuit · 24/7
          </div>
          <h1 style={{ fontSize: isMobile ? '30px' : '48px', fontWeight: 800, color: '#fff', marginBottom: '16px', letterSpacing: '-1px', lineHeight: 1.2 }}>
            Pregătire Examene<br />
            <span style={{ color: '#f59e0b' }}>cu Inteligență Artificială</span>
          </h1>
          <p style={{ fontSize: '17px', color: '#64748b', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            Profesor AI disponibil oricând, acasă. Explică pe tablă, vorbește rar și clar, se adaptează la nivelul tău. Mai eficient decât meditatiile clasice.
          </p>
        </div>

        {/* Carduri */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '24px', marginBottom: '40px' }}>

          {/* BAC */}
          <div
            onClick={() => router.push('/edu/bac')}
            style={{
              background: 'rgba(16,185,129,0.06)', border: '2px solid #10b981',
              borderRadius: '20px', padding: '40px 32px', cursor: 'pointer',
              transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(16,185,129,0.12)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(16,185,129,0.06)' }}
          >
            <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', background: 'rgba(16,185,129,0.08)', borderRadius: '50%' }} />
            <div style={{ fontSize: '56px', marginBottom: '20px' }}>📚</div>
            <div style={{ display: 'inline-block', background: '#065f46', color: '#6ee7b7', fontSize: '11px', fontWeight: 700, padding: '3px 12px', borderRadius: '20px', marginBottom: '14px' }}>
              MATEMATICĂ · ROMÂNĂ · 24/7
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '12px', lineHeight: 1.2 }}>
              Pregătire<br />Bacalaureat
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '28px' }}>
              Tablă digitală interactivă cu profesor AI. Explică orice capitol, scrie pe tablă pas cu pas și vorbește rar și clar. Matematică M1/M2 și Română.
            </p>
            <div style={{ background: '#10b981', color: '#fff', padding: '14px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: 700, display: 'inline-block' }}>
              Începe pregătirea →
            </div>
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Cls. IX-XII', 'M1 · M2', 'Tablă digitală', 'Voce'].map(t => (
                <span key={t} style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', fontSize: '11px', padding: '3px 10px', borderRadius: '20px' }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Capacitate */}
          <div
            onClick={() => router.push('/edu/capacitate')}
            style={{
              background: 'rgba(239,68,68,0.06)', border: '2px solid #ef4444',
              borderRadius: '20px', padding: '40px 32px', cursor: 'pointer',
              transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(239,68,68,0.12)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(239,68,68,0.06)' }}
          >
            <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', background: 'rgba(239,68,68,0.08)', borderRadius: '50%' }} />
            <div style={{ fontSize: '56px', marginBottom: '20px' }}>🎯</div>
            <div style={{ display: 'inline-block', background: '#7f1d1d', color: '#fca5a5', fontSize: '11px', fontWeight: 700, padding: '3px 12px', borderRadius: '20px', marginBottom: '14px' }}>
              MATEMATICĂ · ROMÂNĂ · 24/7
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '12px', lineHeight: 1.2 }}>
              Evaluare<br />Națională
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '28px' }}>
              Profesor AI pentru Evaluarea Națională cls. VIII. Explică orice lecție, generează exerciții și se adaptează la nivelul tău. Matematică și Română.
            </p>
            <div style={{ background: '#ef4444', color: '#fff', padding: '14px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: 700, display: 'inline-block' }}>
              Începe pregătirea →
            </div>
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Cls. VIII', 'Matematică', 'Română', 'EN 2026'].map(t => (
                <span key={t} style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5', fontSize: '11px', padding: '3px 10px', borderRadius: '20px' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Alte materii BAC */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Alte materii BAC — Profesor AI
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { icon: '🧬', label: 'Biologie', m: 'biologie', color: '#16a34a' },
              { icon: '⚡', label: 'Fizică', m: 'fizica', color: '#4f46e5' },
              { icon: '🧪', label: 'Chimie', m: 'chimie', color: '#db2777' },
              { icon: '💻', label: 'Informatică', m: 'informatica', color: '#0891b2' },
              { icon: '🌍', label: 'Geografie', m: 'geografie', color: '#d97706' },
              { icon: '📜', label: 'Istorie', m: 'istorie', color: '#7c3aed' },
            ].map(s => (
              <button
                key={s.m}
                onClick={() => router.push(`/edu/bac/materie?m=${s.m}`)}
                style={{
                  background: `rgba(0,0,0,0.3)`,
                  border: `1.5px solid ${s.color}44`,
                  borderRadius: '14px',
                  padding: '18px 16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = s.color; (e.currentTarget as HTMLButtonElement).style.background = `${s.color}10` }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = `${s.color}44`; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.3)' }}
              >
                <span style={{ fontSize: '24px' }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>{s.label}</div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>Profesor AI · BAC 2026</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { icon: '🖊️', titlu: 'Tablă digitală', desc: 'Profesorul scrie pe tablă în timp ce explică vocal' },
            { icon: '🎤', titlu: 'Vorbești cu vocea', desc: 'Pui întrebări cu microfonul, fără să tastezi' },
            { icon: '🔄', titlu: 'Se adaptează', desc: 'Explică de câte ori e nevoie, în ritmul tău' },
          ].map(item => (
            <div key={item.titlu} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>{item.titlu}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
