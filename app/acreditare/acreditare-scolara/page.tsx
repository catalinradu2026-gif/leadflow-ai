'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CRITERII = [
  { cod: 'A1', titlu: 'Capacitatea instituțională', subcriterii: ['Structuri organizatorice', 'Baza materială', 'Resurse umane'] },
  { cod: 'A2', titlu: 'Eficacitatea educațională', subcriterii: ['Conținutul programelor', 'Rezultatele elevilor', 'Activitatea de cercetare'] },
  { cod: 'A3', titlu: 'Managementul calității', subcriterii: ['Strategii și proceduri', 'Proceduri de autoevaluare', 'Comunicare și transparență'] },
]

type CalificativType = '' | 'Excelent' | 'Bine' | 'Satisfăcător' | 'Nesatisfăcător'

export default function AcreditareScolara() {
  const router = useRouter()
  const [tab, setTab] = useState<'autoevaluare' | 'vizita' | 'decizie'>('autoevaluare')
  const [calificative, setCalificative] = useState<Record<string, CalificativType>>({})

  const setCalif = (key: string, val: CalificativType) => setCalificative(prev => ({ ...prev, [key]: val }))

  const CALIFICATIV_COLORS: Record<CalificativType, string> = {
    '': '#334155',
    'Excelent': '#22c55e',
    'Bine': '#3b82f6',
    'Satisfăcător': '#f59e0b',
    'Nesatisfăcător': '#ef4444',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>

      {/* Topbar */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '16px', height: '56px' }}>
        <button onClick={() => router.push('/acreditare')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Acreditare</button>
        <div style={{ width: 1, height: 20, background: '#334155' }} />
        <span style={{ fontSize: '18px' }}>🏅</span>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>Acreditare Instituțională</div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          {['autoevaluare', 'vizita', 'decizie'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t as typeof tab)}
              style={{
                background: tab === t ? '#a855f7' : 'transparent',
                color: tab === t ? '#fff' : '#64748b',
                border: tab === t ? 'none' : '1px solid #334155',
                borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {t === 'autoevaluare' ? '📝 Autoevaluare' : t === 'vizita' ? '👥 Vizita Comisiei' : '📜 Decizie'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>

        {tab === 'autoevaluare' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#f1f5f9', marginBottom: '6px' }}>Raport de Autoevaluare</h2>
              <p style={{ color: '#64748b', fontSize: '13px' }}>Completat de unitatea școlară. ARACIP evaluează fiecare criteriu și acordă calificativul final.</p>
            </div>

            {CRITERII.map(criteriu => (
              <div key={criteriu.cod} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ background: '#7e22ce', color: '#e9d5ff', borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: 700 }}>{criteriu.cod}</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9' }}>{criteriu.titlu}</div>
                </div>
                {criteriu.subcriterii.map(sub => (
                  <div key={sub} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #0f172a' }}>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>{sub}</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {(['Excelent', 'Bine', 'Satisfăcător', 'Nesatisfăcător'] as CalificativType[]).map(cal => (
                        <button
                          key={cal}
                          onClick={() => setCalif(`${criteriu.cod}-${sub}`, calificative[`${criteriu.cod}-${sub}`] === cal ? '' : cal)}
                          style={{
                            background: calificative[`${criteriu.cod}-${sub}`] === cal ? CALIFICATIV_COLORS[cal] : 'transparent',
                            color: calificative[`${criteriu.cod}-${sub}`] === cal ? '#fff' : '#475569',
                            border: `1px solid ${calificative[`${criteriu.cod}-${sub}`] === cal ? CALIFICATIV_COLORS[cal] : '#334155'}`,
                            borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                          }}
                        >
                          {cal}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            <button
              onClick={() => setTab('vizita')}
              style={{ background: '#a855f7', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px 32px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', marginTop: '8px' }}
            >
              Solicită Vizita Comisiei ARACIP →
            </button>
          </div>
        )}

        {tab === 'vizita' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#f1f5f9', marginBottom: '6px' }}>Vizita Comisiei ARACIP</h2>
              <p style={{ color: '#64748b', fontSize: '13px' }}>Calendarul vizitei, comisia desemnată și raportul de evaluare externă.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Data vizitei', val: '15–16 octombrie 2026', icon: '📅' },
                { label: 'Președinte comisie', val: 'Prof. dr. Ionescu Maria', icon: '👤' },
                { label: 'Membri comisie', val: '3 evaluatori externi', icon: '👥' },
                { label: 'Status', val: 'Confirmat', icon: '✅' },
              ].map(item => (
                <div key={item.label} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ fontSize: '20px', marginBottom: '6px' }}>{item.icon}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>{item.val}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9', marginBottom: '14px' }}>Program vizită</div>
              {[
                { ora: '09:00', activitate: 'Întâlnire cu conducerea unității', zi: 'Ziua 1' },
                { ora: '10:00', activitate: 'Inspecție spații și dotări', zi: 'Ziua 1' },
                { ora: '12:00', activitate: 'Asistențe la ore (min. 6 ore)', zi: 'Ziua 1' },
                { ora: '09:00', activitate: 'Interviuri cadre didactice și elevi', zi: 'Ziua 2' },
                { ora: '11:00', activitate: 'Analiza documentelor', zi: 'Ziua 2' },
                { ora: '14:00', activitate: 'Prezentarea concluziilor preliminare', zi: 'Ziua 2' },
              ].map(a => (
                <div key={a.activitate} style={{ display: 'flex', gap: '14px', padding: '10px 0', borderBottom: '1px solid #0f172a', alignItems: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#a855f7', fontWeight: 700, minWidth: '50px' }}>{a.ora}</div>
                  <div style={{ fontSize: '11px', color: '#475569', minWidth: '60px' }}>{a.zi}</div>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>{a.activitate}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setTab('decizie')}
              style={{ background: '#a855f7', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px 32px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
            >
              Vezi Decizia de Acreditare →
            </button>
          </div>
        )}

        {tab === 'decizie' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#f1f5f9', marginBottom: '6px' }}>Decizie de Acreditare</h2>
              <p style={{ color: '#64748b', fontSize: '13px' }}>Decizia oficială ARACIP și certificatul de acreditare.</p>
            </div>

            <div style={{ background: 'rgba(34,197,94,0.06)', border: '2px solid #22c55e', borderRadius: '16px', padding: '28px', textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏅</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#22c55e', marginBottom: '8px' }}>ACREDITATĂ</div>
              <div style={{ fontSize: '15px', color: '#f1f5f9', fontWeight: 600, marginBottom: '4px' }}>Liceul Teoretic „Exemplu"</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Decizia ARACIP nr. 1234/2026 · Valabilă 5 ani</div>
              <div style={{ marginTop: '20px', display: 'inline-block', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '10px 20px', fontSize: '12px', color: '#64748b' }}>
                Calificativ final: <strong style={{ color: '#22c55e' }}>BINE</strong> · Evaluare periodică: octombrie 2031
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ flex: 1, background: '#22c55e', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                📄 Descarcă Certificat PDF
              </button>
              <button style={{ flex: 1, background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: '10px', padding: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                📊 Raport Complet Evaluare
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
