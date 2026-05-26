'use client'
import { useMemo } from 'react'

type Termen = { titlu: string; luna: number; zi: number }

const TERMENE: Termen[] = [
  { titlu: 'Depunere RAEI', luna: 8, zi: 15 },
  { titlu: 'Raport semestrial I', luna: 9, zi: 30 },
  { titlu: 'Autoevaluare CEAC', luna: 10, zi: 30 },
  { titlu: 'Plan managerial an următor', luna: 2, zi: 1 },
  { titlu: 'Revizuire CEAC', luna: 3, zi: 30 },
  { titlu: 'Raport semestrial II', luna: 5, zi: 15 },
]

function nextOccurrence(luna: number, zi: number): Date {
  const now = new Date()
  const y = now.getFullYear()
  // luna is 1-12
  let candidate = new Date(y, luna - 1, zi, 0, 0, 0)
  if (candidate.getTime() < now.getTime() - 86400000) {
    candidate = new Date(y + 1, luna - 1, zi, 0, 0, 0)
  }
  return candidate
}

export default function CalendarTermene({ titlu = '📅 Calendar Termene ARACIP' }: { titlu?: string }) {
  const items = useMemo(() => {
    const now = Date.now()
    return TERMENE.map(t => {
      const data = nextOccurrence(t.luna, t.zi)
      const zile = Math.ceil((data.getTime() - now) / 86400000)
      return { ...t, data, zile }
    }).sort((a, b) => a.data.getTime() - b.data.getTime())
  }, [])

  return (
    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px' }}>
      <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>{titlu}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((it, i) => {
          let badgeBg = '#052e16', badgeColor = '#86efac', badgeText = `${it.zile} zile`
          if (it.zile < 7) { badgeBg = '#7f1d1d'; badgeColor = '#fca5a5' }
          else if (it.zile < 30) { badgeBg = '#451a03'; badgeColor = '#fcd34d' }
          if (it.zile <= 0) badgeText = 'AZI / DEPĂȘIT'
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '10px 12px', background: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>{it.titlu}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                  {it.data.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
              <span style={{ background: badgeBg, color: badgeColor, fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', whiteSpace: 'nowrap' }}>{badgeText}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
