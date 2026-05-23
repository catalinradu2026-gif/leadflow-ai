'use client'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '../../hooks/useIsMobile'

export default function CapacitateLanding() {
  const router = useRouter()
  const isMobile = useIsMobile()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1a0a0a 50%, #0f172a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '0' : '40px 20px',
      fontFamily: "'Segoe UI', Arial, sans-serif",
    }}>

      {/* Topbar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '16px', height: '56px', zIndex: 10 }}>
        <button onClick={() => router.push('/edu')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Edu</button>
        <div style={{ width: 1, height: 20, background: '#334155' }} />
        <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>🎯 Evaluare Națională 2026</span>
        <span style={{ background: '#7f1d1d', color: '#fca5a5', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>AI 24/7</span>
      </div>

      <div style={{ paddingTop: '56px', width: '100%', maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px', paddingTop: '40px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '40px', padding: '8px 20px', marginBottom: '24px',
            fontSize: '13px', color: '#fca5a5',
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block', boxShadow: '0 0 8px #ef4444' }} />
            Profesor AI disponibil 24/7 · Gratuit
          </div>
          <h1 style={{ fontSize: isMobile ? '30px' : '44px', fontWeight: 800, color: '#fff', marginBottom: '16px', letterSpacing: '-1px', lineHeight: 1.2 }}>
            Pregătire Evaluare Națională<br />
            <span style={{ color: '#f87171' }}>cu Inteligență Artificială</span>
          </h1>
          <p style={{ fontSize: '17px', color: '#64748b', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            Profesor AI pentru clasa a VIII-a. Explică orice lecție, generează exerciții, corectează și se adaptează la nivelul tău. Pregătire completă pentru EN 2026.
          </p>
        </div>

        {/* Materii */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '20px', marginBottom: '40px' }}>

          {/* Matematică */}
          <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '16px', padding: '28px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 12, right: 12, background: '#1d4ed8', color: '#93c5fd', fontSize: '10px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>
              DISPONIBIL
            </div>
            <div style={{ fontSize: '44px', marginBottom: '16px' }}>📐</div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Matematică</h2>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(59,130,246,0.15)', color: '#93c5fd', fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>Algebră</span>
              <span style={{ background: 'rgba(59,130,246,0.15)', color: '#93c5fd', fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>Geometrie</span>
              <span style={{ background: 'rgba(59,130,246,0.15)', color: '#93c5fd', fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>Cls. V-VIII</span>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.7, marginBottom: '20px' }}>
              Mulțimi, ecuații, funcții, trigonometrie, geometrie plană și în spațiu. Exerciții după structura oficială EN cu toate cele 3 subiecte.
            </p>
            <button
              onClick={() => router.push('/edu/capacitate/matematica')}
              style={{ width: '100%', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
            >
              Matematică EN →
            </button>
          </div>

          {/* Română */}
          <div style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '16px', padding: '28px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 12, right: 12, background: '#6b21a8', color: '#d8b4fe', fontSize: '10px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>
              DISPONIBIL
            </div>
            <div style={{ fontSize: '44px', marginBottom: '16px' }}>📝</div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Limba Română</h2>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(168,85,247,0.15)', color: '#d8b4fe', fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>Text la vedere</span>
              <span style={{ background: 'rgba(168,85,247,0.15)', color: '#d8b4fe', fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>Redactare</span>
              <span style={{ background: 'rgba(168,85,247,0.15)', color: '#d8b4fe', fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>Gramatică</span>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.7, marginBottom: '20px' }}>
              Text narativ și descriptiv, figuri de stil, morfologie și sintaxă, redactare compunere. Toată programa cls. V-VIII pentru EN română.
            </p>
            <button
              onClick={() => router.push('/edu/capacitate/romana')}
              style={{ width: '100%', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
            >
              Română EN →
            </button>
          </div>
        </div>

        {/* Info bar */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { icon: '🤖', titlu: 'Profesor AI Adaptiv', desc: 'Se adaptează la nivelul fiecărui elev de cls. VIII' },
            { icon: '📋', titlu: 'Structură EN Oficială', desc: 'Exerciții după programa și structura MEN 2026' },
            { icon: '✍️', titlu: 'Corectează Compuneri', desc: 'Feedback instant pe texte și compuneri' },
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