'use client'
import { useEffect, useState } from 'react'

type Status = 'ok' | 'expirat' | 'neîndeplinit'
type Entry = { status: Status; dataMarcare?: string }

const CERINTE: { titlu: string; valabLuni: number }[] = [
  { titlu: 'Regulament intern actualizat', valabLuni: 12 },
  { titlu: 'Plan managerial aprobat', valabLuni: 12 },
  { titlu: 'RAEI depus', valabLuni: 12 },
  { titlu: 'Fișe post personal didactic', valabLuni: 12 },
  { titlu: 'Proceduri CEAC', valabLuni: 36 },
  { titlu: 'Autorizație sanitară', valabLuni: 12 },
  { titlu: 'Autorizație ISU', valabLuni: 12 },
  { titlu: 'Plan dezvoltare instituțională', valabLuni: 60 },
  { titlu: 'Regulament CEAC', valabLuni: 36 },
  { titlu: 'Contracte muncă personal', valabLuni: 12 },
  { titlu: 'Registru inspecții', valabLuni: 12 },
  { titlu: 'Declarații GDPR personal', valabLuni: 12 },
]

function storageKey(userId: string) {
  return `ara_checklist_${userId || 'anon'}`
}

function recalc(state: Record<number, Entry>): Record<number, Entry> {
  const now = new Date()
  const out: Record<number, Entry> = {}
  CERINTE.forEach((c, i) => {
    const cur = state[i]
    if (!cur || !cur.dataMarcare) { out[i] = { status: 'neîndeplinit' }; return }
    const marcat = new Date(cur.dataMarcare)
    const expira = new Date(marcat)
    expira.setMonth(expira.getMonth() + c.valabLuni)
    out[i] = { status: expira < now ? 'expirat' : 'ok', dataMarcare: cur.dataMarcare }
  })
  return out
}

export default function ChecklistConformitate({ userId }: { userId: string }) {
  const [state, setState] = useState<Record<number, Entry>>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(userId))
      const parsed = raw ? JSON.parse(raw) : {}
      setState(recalc(parsed))
    } catch (e) { console.error('[ChecklistConformitate load]', e); setState(recalc({})) }
    setLoaded(true)
  }, [userId])

  function save(next: Record<number, Entry>) {
    setState(next)
    try { localStorage.setItem(storageKey(userId), JSON.stringify(next)) }
    catch (e) { console.error('[ChecklistConformitate save]', e) }
  }

  function markOk(idx: number) {
    const today = new Date().toISOString().slice(0, 10)
    const next = { ...state, [idx]: { status: 'ok' as Status, dataMarcare: today } }
    save(recalc(next))
  }

  function reset(idx: number) {
    const next = { ...state, [idx]: { status: 'neîndeplinit' as Status } }
    save(next)
  }

  if (!loaded) return null

  const okCount = Object.values(state).filter(s => s.status === 'ok').length
  const pct = Math.round((okCount / CERINTE.length) * 100)

  return (
    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📋 Checklist Conformitate ARACIP</h3>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '22px', fontWeight: 800, color: pct >= 80 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444' }}>{pct}%</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>{okCount}/{CERINTE.length} conforme</div>
        </div>
      </div>
      <div style={{ height: 6, background: '#0f172a', borderRadius: '4px', marginBottom: '14px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: pct >= 80 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444', transition: 'width 0.3s' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '420px', overflowY: 'auto' }}>
        {CERINTE.map((c, i) => {
          const s = state[i] || { status: 'neîndeplinit' as Status }
          const bg = s.status === 'ok' ? 'rgba(34,197,94,0.06)' : s.status === 'expirat' ? 'rgba(245,158,11,0.06)' : 'rgba(239,68,68,0.04)'
          const border = s.status === 'ok' ? 'rgba(34,197,94,0.25)' : s.status === 'expirat' ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.2)'
          const color = s.status === 'ok' ? '#22c55e' : s.status === 'expirat' ? '#f59e0b' : '#ef4444'
          const icon = s.status === 'ok' ? '✓' : s.status === 'expirat' ? '⏰' : '✗'
          return (
            <div key={i} style={{ background: bg, border: `1px solid ${border}`, borderRadius: '8px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>{icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>{c.titlu}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                  Valabilitate {c.valabLuni} luni
                  {s.dataMarcare && <span> · marcat {new Date(s.dataMarcare).toLocaleDateString('ro-RO')}</span>}
                  <span style={{ marginLeft: '6px', color, fontWeight: 700, textTransform: 'uppercase' }}>{s.status}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button onClick={() => markOk(i)} style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', borderRadius: '6px', padding: '5px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Marchează azi</button>
                {s.status !== 'neîndeplinit' && (
                  <button onClick={() => reset(i)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #334155', color: '#94a3b8', borderRadius: '6px', padding: '5px 8px', fontSize: '11px', cursor: 'pointer' }}>↺</button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
