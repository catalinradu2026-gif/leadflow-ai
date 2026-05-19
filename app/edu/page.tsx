'use client'
import { useRouter } from 'next/navigation'

export default function EduLanding() {
  const router = useRouter()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
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
          fontSize: '52px',
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

      {/* Main Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px',
        maxWidth: '860px',
        width: '100%',
        marginBottom: '48px',
      }}>

        {/* Cursuri AI */}
        <div
          onClick={() => router.push('/edu/cursuri-ai')}
          style={{
            background: 'rgba(99,102,241,0.08)',
            border: '2px solid #6366f1',
            borderRadius: '20px',
            padding: '40px 32px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            position: 'relative',
            overflow: 'hidden',
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
            8 MODULE · INTERACTIV
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '12px', lineHeight: 1.2 }}>
            Cursuri AI<br />pentru Elevi
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '28px' }}>
            Învață ce este inteligența artificială, cum te ajută la școală și cum să o folosești corect. Un modul pe săptămână, predat interactiv de AI.
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

        {/* BAC */}
        <div
          onClick={() => router.push('/edu/bac')}
          style={{
            background: 'rgba(16,185,129,0.06)',
            border: '2px solid #10b981',
            borderRadius: '20px',
            padding: '40px 32px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.background = 'rgba(16,185,129,0.12)'
            ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.background = 'rgba(16,185,129,0.06)'
            ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
          }}
        >
          <div style={{
            position: 'absolute', top: '-30px', right: '-30px',
            width: '120px', height: '120px',
            background: 'rgba(16,185,129,0.08)',
            borderRadius: '50%',
          }} />
          <div style={{ fontSize: '56px', marginBottom: '20px' }}>📚</div>
          <div style={{
            display: 'inline-block',
            background: '#065f46',
            color: '#6ee7b7',
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 12px',
            borderRadius: '20px',
            marginBottom: '14px',
            letterSpacing: '0.5px',
          }}>
            MATEMATICĂ · ROMÂNĂ · 24/7
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '12px', lineHeight: 1.2 }}>
            Pregătire<br />Bacalaureat
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '28px' }}>
            Profesor AI disponibil 24/7. Explică orice capitol, generează exerciții, corectează și adaptează la nivelul tău. Mai eficient decât meditatiile clasice.
          </p>
          <div style={{
            background: '#10b981',
            color: '#fff',
            padding: '14px 28px',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: 700,
            display: 'inline-block',
          }}>
            Începe pregătirea →
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Matematică M1/M2', 'Română', 'Exerciții', 'Eseu'].map(tag => (
              <span key={tag} style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', fontSize: '11px', padding: '3px 10px', borderRadius: '20px' }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

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
          { val: '8', label: 'Module Interactive' },
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
