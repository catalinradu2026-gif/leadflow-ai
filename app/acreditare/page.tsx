'use client'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '../hooks/useIsMobile'

export default function AcreditareLanding() {
  const router = useRouter()
  const isMobile = useIsMobile()

  // Cele 3 etape din ciclul de viață al unei unități.
  // securizat = doar pentru unități existente (director logat) → duce în Portalul Director.
  const etape = [
    {
      icon: '📋', tag: 'ETAPA 1 · UNITATE NOUĂ', color: '#3b82f6', colorSoft: 'rgba(59,130,246,',
      titlu: 'Autorizare\nde Funcționare',
      desc: 'Pentru unități școlare NOI sau existente care vor un nivel/specializare nouă. Depui dosarul digital; ARACIP verifică standardele minime.',
      cta: 'Depune dosarul →', ctaReal: true, securizat: false, notaDirector: false, route: '/acreditare/autorizare',
      tags: ['Persoane fizice', 'Unități existente', 'Public'],
    },
    {
      icon: '🏅', tag: 'ETAPA 2 · DUPĂ ~1 AN', color: '#a855f7', colorSoft: 'rgba(168,85,247,',
      titlu: 'Acreditare\nInstituțională',
      desc: 'Pentru unitățile deja autorizate. Vezi cum funcționează: dosarul de acreditare, vizita comisiei ARACIP, raportul și decizia.',
      cta: 'Vezi cum funcționează →', ctaReal: false, securizat: false, notaDirector: true, route: '/acreditare/acreditare-scolara',
      tags: ['Info publică', 'Unitate autorizată'],
    },
    {
      icon: '🔄', tag: 'ETAPA 3 · LA FIECARE 5 ANI', color: '#14b8a6', colorSoft: 'rgba(20,184,166,',
      titlu: 'Evaluare Externă\nPeriodică',
      desc: 'Pentru unitățile acreditate, la fiecare 5 ani. Vezi cum funcționează: calendarul, rapoartele și deciziile ARACIP.',
      cta: 'Vezi cum funcționează →', ctaReal: false, securizat: false, notaDirector: true, route: '/acreditare/evaluare-periodica',
      tags: ['Info publică', 'Unitate acreditată'],
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1a1035 50%, #0f172a 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: isMobile ? '16px' : '40px 20px', fontFamily: "'Segoe UI', Arial, sans-serif" }}>

      <button onClick={() => router.push('/aracip')} style={{ position: 'fixed', top: 20, left: 20, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '8px 16px', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', zIndex: 20 }}>← Înapoi</button>

      {/* Header */}
      <div style={{ textAlign: 'center', marginTop: isMobile ? '48px' : '20px', marginBottom: '40px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '40px', padding: '8px 20px', marginBottom: '24px', fontSize: '13px', color: '#c4b5fd', letterSpacing: '0.5px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }} />
          Platformă ARACIP · Asigurarea Calității în Educație
        </div>
        <h1 style={{ fontSize: isMobile ? '30px' : '46px', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: '16px', letterSpacing: '-1.5px' }}>
          Autorizare, Acreditare<br /><span style={{ color: '#a78bfa' }}>și Evaluare Periodică</span>
        </h1>
        <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: '580px', lineHeight: 1.7, margin: '0 auto' }}>
          Parcursul unei unități de învățământ în relația cu ARACIP. 🟢 Autorizarea e publică (oricine o poate depune); 🔒 acreditarea și evaluarea periodică se fac din Portalul Director.
        </p>
      </div>

      {/* Cele 3 etape */}
      <div style={{ width: '100%', maxWidth: '1080px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', textAlign: 'center' }}>
          Parcursul unei unități — cele 3 etape
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
          {etape.map(e => (
            <div
              key={e.tag}
              role="button"
              tabIndex={0}
              onClick={() => router.push(e.route)}
              onKeyDown={ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); router.push(e.route) } }}
              style={{ background: `${e.colorSoft}${isMobile ? '0.14' : '0.07'})`, border: `2px solid ${e.securizat ? 'rgba(239,68,68,0.5)' : e.color}`, borderRadius: '20px', padding: '32px 28px', cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={ev => { (ev.currentTarget as HTMLDivElement).style.background = `${e.colorSoft}0.14)`; (ev.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)' }}
              onMouseLeave={ev => { (ev.currentTarget as HTMLDivElement).style.background = `${e.colorSoft}${isMobile ? '0.14' : '0.07'})`; (ev.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
            >
              {/* Colț status: verde (acțiune publică) / albastru (info publică) */}
              <div style={{ position: 'absolute', top: 14, right: 14, background: e.ctaReal ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.12)', border: `1px solid ${e.ctaReal ? 'rgba(34,197,94,0.5)' : 'rgba(59,130,246,0.4)'}`, color: e.ctaReal ? '#4ade80' : '#93c5fd', fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>
                {e.ctaReal ? '🟢 Public' : 'ℹ️ Info publică'}
              </div>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{e.icon}</div>
              <div style={{ display: 'inline-block', background: e.color, color: '#fff', fontSize: '10.5px', fontWeight: 700, padding: '3px 12px', borderRadius: '20px', marginBottom: '14px', letterSpacing: '0.5px' }}>{e.tag}</div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '12px', lineHeight: 1.2, whiteSpace: 'pre-line' }}>{e.titlu}</h2>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '24px' }}>{e.desc}</p>
              <div style={{ background: e.ctaReal ? e.color : 'transparent', color: e.ctaReal ? '#fff' : (e.securizat ? '#f87171' : e.color), border: e.ctaReal ? 'none' : `1.5px solid ${e.securizat ? 'rgba(239,68,68,0.5)' : `${e.color}88`}`, padding: '12px 22px', borderRadius: '12px', fontSize: '13.5px', fontWeight: 700, display: 'inline-block' }}>{e.cta}</div>
              {e.notaDirector && <div style={{ marginTop: '10px', fontSize: '11px', color: '#f87171' }}>🔒 Depunerea efectivă se face din Portalul Director</div>}
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {e.tags.map(tag => <span key={tag} style={{ background: `${e.colorSoft}0.18)`, color: '#cbd5e1', fontSize: '11px', padding: '3px 10px', borderRadius: '20px' }}>{tag}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resurse publice */}
      <div style={{ width: '100%', maxWidth: '1080px', marginBottom: '40px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Resurse & Informații (publice)</div>
        <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '16px', lineHeight: 1.6, maxWidth: '640px' }}>Pentru <strong style={{ color: '#94a3b8' }}>părinți și public</strong> — verificați dacă o școală/grădiniță este autorizată sau acreditată și consultați legislația în vigoare. Acces liber, fără cont.</div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '12px' }}>
          {[
            { icon: '🔎', label: 'Verifică o unitate', desc: 'Vezi dacă o școală/grădiniță e autorizată sau acreditată (pentru părinți și public)', color: '#6366f1', route: '/acreditare/registre' },
            { icon: '⚖️', label: 'Legislație', desc: 'Actele normative în vigoare (referință publică)', color: '#a855f7', route: '/acreditare/legislatie' },
          ].map(r => (
            <div key={r.label} role="button" tabIndex={0} onClick={() => router.push(r.route)} onKeyDown={ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); router.push(r.route) } }}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '16px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '12px' }}
              onMouseEnter={ev => { (ev.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.06)'; (ev.currentTarget as HTMLDivElement).style.borderColor = `${r.color}44` }}
              onMouseLeave={ev => { (ev.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'; (ev.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)' }}>
              <div style={{ width: 40, height: 40, borderRadius: '10px', background: `${r.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{r.icon}</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0' }}>{r.label}</div>
                <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: isMobile ? '32px' : '56px', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
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

      <div style={{ marginTop: '32px', marginBottom: '20px', fontSize: '12px', color: '#334155', textAlign: 'center' }}>
        Powered by <strong style={{ color: '#a78bfa' }}>AIcraiova</strong> · NewTime Concept Solutions S.R.L. · în parteneriat cu <strong style={{ color: '#a78bfa' }}>ARACIP</strong>
      </div>
    </div>
  )
}
