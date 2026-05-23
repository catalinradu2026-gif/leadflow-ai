'use client'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '../../hooks/useIsMobile'

export default function BACLanding() {
  const router = useRouter()
  const isMobile = useIsMobile()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #0d2818 50%, #0f172a 100%)',
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
        <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>📚 Pregătire Bacalaureat 2026</span>
        <span style={{ background: '#065f46', color: '#6ee7b7', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>AI 24/7</span>
      </div>

      <div style={{ paddingTop: '56px', width: '100%', maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px', paddingTop: '40px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '40px', padding: '8px 20px', marginBottom: '24px',
            fontSize: '13px', color: '#6ee7b7',
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }} />
            Profesor AI disponibil 24/7 · Gratuit
          </div>
          <h1 style={{ fontSize: isMobile ? '30px' : '44px', fontWeight: 800, color: '#fff', marginBottom: '16px', letterSpacing: '-1px', lineHeight: 1.2 }}>
            Pregătire Bacalaureat<br />
            <span style={{ color: '#10b981' }}>cu Inteligență Artificială</span>
          </h1>
          <p style={{ fontSize: '17px', color: '#64748b', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            Explică orice capitol, generează exerciții, corectează eseuri și se adaptează la nivelul tău. Mai eficient decât meditatiile clasice.
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
              <span style={{ background: 'rgba(59,130,246,0.15)', color: '#93c5fd', fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>M1 Mate-Info</span>
              <span style={{ background: 'rgba(59,130,246,0.15)', color: '#93c5fd', fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>M2 Real/Uman</span>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.7, marginBottom: '20px' }}>
              Derivate, integrale, matrice, geometrie analitică, probabilități. Exerciții după structura oficială BAC cu toate cele 3 subiecte.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => router.push('/edu/bac/matematica?profil=M1')}
                style={{ flex: 1, background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
              >
                M1 Mate-Info →
              </button>
              <button
                onClick={() => router.push('/edu/bac/matematica?profil=M2')}
                style={{ flex: 1, background: 'rgba(59,130,246,0.15)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '10px', padding: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
              >
                M2 Real/Uman →
              </button>
            </div>
          </div>

          {/* Română */}
          <div style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '16px', padding: '28px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 12, right: 12, background: '#6b21a8', color: '#d8b4fe', fontSize: '10px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>
              DISPONIBIL
            </div>
            <div style={{ fontSize: '44px', marginBottom: '16px' }}>📝</div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Limba Română</h2>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(168,85,247,0.15)', color: '#d8b4fe', fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>Profil Real</span>
              <span style={{ background: 'rgba(168,85,247,0.15)', color: '#d8b4fe', fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>Profil Uman</span>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.7, marginBottom: '20px' }}>
              Text la prima vedere, analiză literară, eseu 400 cuvinte. Toți autorii canonici: Eminescu, Bacovia, Blaga, Arghezi, Rebreanu, Preda.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => router.push('/edu/bac/romana?profil=real')}
                style={{ flex: 1, background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
              >
                Profil Real →
              </button>
              <button
                onClick={() => router.push('/edu/bac/romana?profil=uman')}
                style={{ flex: 1, background: 'rgba(168,85,247,0.15)', color: '#d8b4fe', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '10px', padding: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
              >
                Profil Uman →
              </button>
            </div>
          </div>

          {/* Biologie */}
          <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '16px', padding: '28px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 12, right: 12, background: '#14532d', color: '#86efac', fontSize: '10px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>
              DISPONIBIL
            </div>
            <div style={{ fontSize: '44px', marginBottom: '16px' }}>🧬</div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Biologie</h2>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(34,197,94,0.15)', color: '#86efac', fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>Celulă & Genetică</span>
              <span style={{ background: 'rgba(34,197,94,0.15)', color: '#86efac', fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>Anatomie & Ecologie</span>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.7, marginBottom: '20px' }}>
              Celula, genetică, ecosisteme, anatomia omului, botanică și zoologie. Toată programa BAC biologie.
            </p>
            <button
              onClick={() => router.push('/edu/bac/materie?materie=biologie')}
              style={{ width: '100%', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
            >
              Profesor AI Biologie →
            </button>
          </div>

          {/* Istorie */}
          <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '16px', padding: '28px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 12, right: 12, background: '#78350f', color: '#fde68a', fontSize: '10px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>
              DISPONIBIL
            </div>
            <div style={{ fontSize: '44px', marginBottom: '16px' }}>🏛️</div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Istorie</h2>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(245,158,11,0.15)', color: '#fde68a', fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>România modernă</span>
              <span style={{ background: 'rgba(245,158,11,0.15)', color: '#fde68a', fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>Relații internaționale</span>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.7, marginBottom: '20px' }}>
              Istoria românilor sec. XIX-XXI, state și relații internaționale, cultură și civilizație. Program BAC complet.
            </p>
            <button
              onClick={() => router.push('/edu/bac/materie?materie=istorie')}
              style={{ width: '100%', background: '#d97706', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
            >
              Profesor AI Istorie →
            </button>
          </div>

          {/* Fizică */}
          <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '16px', padding: '28px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 12, right: 12, background: '#312e81', color: '#a5b4fc', fontSize: '10px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>
              DISPONIBIL
            </div>
            <div style={{ fontSize: '44px', marginBottom: '16px' }}>⚡</div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Fizică</h2>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>Mecanică</span>
              <span style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>Electricitate & Optică</span>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.7, marginBottom: '20px' }}>
              Mecanică, termodinamică, electricitate, magnetism, optică, fizică modernă. Cu formule și exerciții rezolvate.
            </p>
            <button
              onClick={() => router.push('/edu/bac/materie?materie=fizica')}
              style={{ width: '100%', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
            >
              Profesor AI Fizică →
            </button>
          </div>

          {/* Chimie */}
          <div style={{ background: 'rgba(236,72,153,0.06)', border: '1px solid rgba(236,72,153,0.3)', borderRadius: '16px', padding: '28px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 12, right: 12, background: '#831843', color: '#fbcfe8', fontSize: '10px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>
              DISPONIBIL
            </div>
            <div style={{ fontSize: '44px', marginBottom: '16px' }}>🧪</div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Chimie</h2>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(236,72,153,0.15)', color: '#fbcfe8', fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>Organică</span>
              <span style={{ background: 'rgba(236,72,153,0.15)', color: '#fbcfe8', fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>Anorganică</span>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.7, marginBottom: '20px' }}>
              Chimie organică și anorganică, reacții, calcule stoechiometrice, soluții. Pregătire completă BAC chimie.
            </p>
            <button
              onClick={() => router.push('/edu/bac/materie?materie=chimie')}
              style={{ width: '100%', background: '#db2777', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
            >
              Profesor AI Chimie →
            </button>
          </div>

          {/* Informatică */}
          <div style={{ background: 'rgba(20,184,166,0.06)', border: '1px solid rgba(20,184,166,0.3)', borderRadius: '16px', padding: '28px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 12, right: 12, background: '#134e4a', color: '#99f6e4', fontSize: '10px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>
              DISPONIBIL
            </div>
            <div style={{ fontSize: '44px', marginBottom: '16px' }}>💻</div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Informatică</h2>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(20,184,166,0.15)', color: '#99f6e4', fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>C++ / Pascal</span>
              <span style={{ background: 'rgba(20,184,166,0.15)', color: '#99f6e4', fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>Algoritmi & Structuri</span>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.7, marginBottom: '20px' }}>
              Algoritmi, structuri de date, programare C++/Pascal, recursivitate, grafuri, sortări. BAC informatică intensiv.
            </p>
            <button
              onClick={() => router.push('/edu/bac/materie?materie=informatica')}
              style={{ width: '100%', background: '#0d9488', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
            >
              Profesor AI Informatică →
            </button>
          </div>

          {/* Geografie */}
          <div style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '16px', padding: '28px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 12, right: 12, background: '#7c2d12', color: '#fed7aa', fontSize: '10px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>
              DISPONIBIL
            </div>
            <div style={{ fontSize: '44px', marginBottom: '16px' }}>🌍</div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Geografie</h2>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(249,115,22,0.15)', color: '#fed7aa', fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>România</span>
              <span style={{ background: 'rgba(249,115,22,0.15)', color: '#fed7aa', fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>Europa & Mondial</span>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.7, marginBottom: '20px' }}>
              Geografie fizică și umană, România și Europa, probleme mondiale, hărți și diagrame. Program BAC complet.
            </p>
            <button
              onClick={() => router.push('/edu/bac/materie?materie=geografie')}
              style={{ width: '100%', background: '#ea580c', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
            >
              Profesor AI Geografie →
            </button>
          </div>
        </div>

        {/* Info bar */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { icon: '🤖', titlu: 'Profesor AI Adaptiv', desc: 'Se adaptează la nivelul și ritmul fiecărui elev' },
            { icon: '📋', titlu: 'Structură BAC Oficială', desc: 'Exerciții după programa și structura MEN 2026' },
            { icon: '✍️', titlu: 'Corectează Eseuri', desc: 'Feedback instant pe compuneri și eseuri' },
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
