'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '../../hooks/useIsMobile'

type StatusEval = 'programata' | 'in-curs' | 'finalizata' | 'urgent'

type EvaluareItem = {
  id: number
  scoala: string
  judet: string
  dataVizita: string
  inspector: string
  status: StatusEval
  calificativ: string
  luniRamase: number
}

const EVALUARI: EvaluareItem[] = [
  { id: 1, scoala: 'Colegiul Național „Carol I"', judet: 'Dolj', dataVizita: '2026-06-10', inspector: 'Ionescu M.', status: 'programata', calificativ: '—', luniRamase: 3 },
  { id: 2, scoala: 'Liceul Teoretic „Elena Cuza"', judet: 'Dolj', dataVizita: '2026-05-22', inspector: 'Popescu A.', status: 'in-curs', calificativ: '—', luniRamase: 0 },
  { id: 3, scoala: 'Grădinița „Floare de Colț"', judet: 'Dolj', dataVizita: '2026-05-05', inspector: 'Marinescu C.', status: 'urgent', calificativ: '—', luniRamase: -3 },
  { id: 4, scoala: 'Școala Gimnazială Nr. 7', judet: 'Dolj', dataVizita: '2026-03-14', inspector: 'Dumitrescu R.', status: 'finalizata', calificativ: 'Bine', luniRamase: 60 },
  { id: 5, scoala: 'Liceul Pedagogic „Ștefan Velovan"', judet: 'Dolj', dataVizita: '2026-07-20', inspector: 'Stancu L.', status: 'programata', calificativ: '—', luniRamase: 14 },
  { id: 6, scoala: 'Colegiul Economic „Gh. Chițu"', judet: 'Dolj', dataVizita: '2026-02-10', inspector: 'Popa D.', status: 'finalizata', calificativ: 'Satisfăcător', luniRamase: 60 },
]

const STATUS_CFG: Record<StatusEval, { label: string; color: string; bg: string }> = {
  'programata': { label: 'Programată', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  'in-curs':    { label: 'În Curs',    color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  'finalizata': { label: 'Finalizată', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  'urgent':     { label: 'URGENTĂ',   color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
}

const CALIF_COLORS: Record<string, string> = {
  'Excelent': '#22c55e',
  'Bine': '#3b82f6',
  'Satisfăcător': '#f59e0b',
  'Nesatisfăcător': '#ef4444',
  '—': '#475569',
}

export default function EvaluarePeriodica() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [selectata, setSelectata] = useState<EvaluareItem | null>(null)
  const [filtru, setFiltru] = useState<string>('toate')
  const [calificativNou, setCalificativNou] = useState('')

  const evaluari = EVALUARI.filter(e => filtru === 'toate' || e.status === filtru)

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>

      {/* Topbar */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '16px', height: '56px' }}>
        <button onClick={() => router.push('/acreditare')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Acreditare</button>
        <div style={{ width: 1, height: 20, background: '#334155' }} />
        <span style={{ fontSize: '18px' }}>🔄</span>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>Evaluare Externă Periodică</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Calendar 2026 — Județul Dolj</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          {EVALUARI.filter(e => e.status === 'urgent').length > 0 && (
            <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 700, color: '#ef4444' }}>
              ⚠️ {EVALUARI.filter(e => e.status === 'urgent').length} evaluări depășite
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '12px' : '24px', gap: '20px', flexDirection: isMobile ? 'column' : 'row' }}>

        {/* Left — calendar + tabel */}
        <div style={{ flex: 1 }}>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Total 2026', val: EVALUARI.length, color: '#818cf8' },
              { label: 'Programate', val: EVALUARI.filter(e => e.status === 'programata').length, color: '#3b82f6' },
              { label: 'În Curs', val: EVALUARI.filter(e => e.status === 'in-curs').length, color: '#f59e0b' },
              { label: 'Finalizate', val: EVALUARI.filter(e => e.status === 'finalizata').length, color: '#22c55e' },
            ].map(s => (
              <div key={s.label} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '14px 16px' }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filtre */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            {[
              { val: 'toate', label: 'Toate' },
              { val: 'urgent', label: '⚠️ Urgente' },
              { val: 'in-curs', label: '🔍 În Curs' },
              { val: 'programata', label: '📅 Programate' },
              { val: 'finalizata', label: '✅ Finalizate' },
            ].map(f => (
              <button
                key={f.val}
                onClick={() => setFiltru(f.val)}
                style={{
                  background: filtru === f.val ? '#14b8a6' : '#1e293b',
                  color: filtru === f.val ? '#fff' : '#64748b',
                  border: `1px solid ${filtru === f.val ? '#14b8a6' : '#334155'}`,
                  borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Tabel */}
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0f172a' }}>
                  {['Unitate Școlară', 'Județ', 'Data Vizitei', 'Inspector', 'Status', 'Calificativ'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', fontSize: '10px', fontWeight: 700, color: '#64748b', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #334155' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {evaluari.map((e, i) => {
                  const cfg = STATUS_CFG[e.status]
                  const isSelected = selectata?.id === e.id
                  return (
                    <tr
                      key={e.id}
                      onClick={() => setSelectata(isSelected ? null : e)}
                      style={{
                        borderBottom: i < evaluari.length - 1 ? '1px solid #0f172a' : 'none',
                        cursor: 'pointer',
                        background: isSelected ? 'rgba(20,184,166,0.08)' : 'transparent',
                        borderLeft: isSelected ? '3px solid #14b8a6' : '3px solid transparent',
                        transition: 'background 0.15s',
                      }}
                    >
                      <td style={{ padding: '11px 14px', fontSize: '13px', fontWeight: 600, color: '#f1f5f9', maxWidth: '200px' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.scoala}</div>
                      </td>
                      <td style={{ padding: '11px 14px', fontSize: '12px', color: '#64748b' }}>{e.judet}</td>
                      <td style={{ padding: '11px 14px', fontSize: '12px', color: '#94a3b8' }}>{e.dataVizita}</td>
                      <td style={{ padding: '11px 14px', fontSize: '12px', color: '#64748b' }}>{e.inspector}</td>
                      <td style={{ padding: '11px 14px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: cfg.bg, borderRadius: '20px', padding: '3px 10px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
                        </div>
                      </td>
                      <td style={{ padding: '11px 14px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: CALIF_COLORS[e.calificativ] || '#475569' }}>{e.calificativ}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            </div>
          </div>

          {/* Buton nou */}
          <div style={{ marginTop: '16px' }}>
            <button style={{ background: '#14b8a6', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
              + Programează Evaluare Nouă
            </button>
          </div>
        </div>

        {/* Panel detalii */}
        {selectata && (
          <div style={isMobile ? { position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200 } : { width: '280px', flexShrink: 0 }}>
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: isMobile ? '12px 12px 0 0' : '12px', padding: '20px', position: isMobile ? 'relative' : 'sticky', top: isMobile ? 'auto' : '20px', maxHeight: isMobile ? '60vh' : 'none', overflowY: isMobile ? 'auto' : 'visible' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Evaluare Selectată</div>
                <button onClick={() => setSelectata(null)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '16px' }}>×</button>
              </div>

              <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px', lineHeight: 1.3 }}>{selectata.scoala}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>{selectata.judet}</div>

              {(() => {
                const cfg = STATUS_CFG[selectata.status]
                return <div style={{ background: cfg.bg, borderRadius: '8px', padding: '8px 12px', marginBottom: '16px', display: 'inline-block', fontSize: '12px', fontWeight: 700, color: cfg.color }}>{cfg.label}</div>
              })()}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {[
                  { label: 'Data vizitei', val: selectata.dataVizita },
                  { label: 'Inspector', val: selectata.inspector },
                  { label: 'Calificativ', val: selectata.calificativ },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #334155', fontSize: '12px' }}>
                    <span style={{ color: '#64748b' }}>{r.label}</span>
                    <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{r.val}</span>
                  </div>
                ))}
              </div>

              {selectata.status === 'in-curs' && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase' }}>Acordă calificativ</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {['Excelent', 'Bine', 'Satisfăcător', 'Nesatisfăcător'].map(c => (
                      <button
                        key={c}
                        onClick={() => setCalificativNou(c)}
                        style={{
                          background: calificativNou === c ? CALIF_COLORS[c] : '#0f172a',
                          color: calificativNou === c ? '#fff' : '#64748b',
                          border: `1px solid ${calificativNou === c ? CALIF_COLORS[c] : '#334155'}`,
                          borderRadius: '8px', padding: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  {calificativNou && (
                    <button style={{ width: '100%', marginTop: '10px', background: '#14b8a6', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                      ✓ Finalizează Evaluarea
                    </button>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button style={{ background: '#14b8a6', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                  📝 Completează Raport
                </button>
                <button style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: '8px', padding: '10px', fontSize: '12px', cursor: 'pointer' }}>
                  ✉️ Notifică Directorul
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
