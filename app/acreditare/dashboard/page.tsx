'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '../../hooks/useIsMobile'

type StatusType = 'autorizata' | 'in-evaluare' | 'acreditata' | 'expirata' | 'suspendata'

type Scoala = {
  id: number
  nume: string
  judet: string
  tip: string
  status: StatusType
  expiraIn: number | null
  ultimaEvaluare: string
  urmatoareaEvaluare: string
  inspector: string
  live?: boolean
  calificativ?: string | null
  rezumat?: string | null
}

// Mapează statusul din depunerea live (unitati_calitate) la StatusType-ul dashboardului.
function mapStatusLive(s: string): StatusType {
  switch (s) {
    case 'acreditat': return 'acreditata'
    case 'in_evaluare': return 'in-evaluare'
    case 'periodica': return 'in-evaluare'
    default: return 'autorizata' // autoevaluare_depusa
  }
}

const SCOLI: Scoala[] = [
  { id: 1, nume: 'Liceul Teoretic „Elena Cuza"', judet: 'Dolj', tip: 'Liceu', status: 'acreditata', expiraIn: 38, ultimaEvaluare: '2022-03', urmatoareaEvaluare: '2027-03', inspector: 'Ionescu M.' },
  { id: 2, nume: 'Școala Gimnazială Nr. 7', judet: 'Dolj', tip: 'Gimnaziu', status: 'in-evaluare', expiraIn: null, ultimaEvaluare: '2024-09', urmatoareaEvaluare: '—', inspector: 'Popescu A.' },
  { id: 3, nume: 'Grădinița „Floare de Colț"', judet: 'Dolj', tip: 'Grădiniță', status: 'expirata', expiraIn: -3, ultimaEvaluare: '2020-11', urmatoareaEvaluare: 'URGENTĂ', inspector: 'Marinescu C.' },
  { id: 4, nume: 'Colegiul Național „Carol I"', judet: 'Dolj', tip: 'Colegiu', status: 'acreditata', expiraIn: 51, ultimaEvaluare: '2021-06', urmatoareaEvaluare: '2026-06', inspector: 'Dumitrescu R.' },
  { id: 5, nume: 'Liceul Tehnologic „Henri Coandă"', judet: 'Dolj', tip: 'Liceu', status: 'autorizata', expiraIn: 8, ultimaEvaluare: '—', urmatoareaEvaluare: '2025-09', inspector: 'Stancu L.' },
  { id: 6, nume: 'Școala Specială Nr. 2', judet: 'Dolj', tip: 'Specială', status: 'acreditata', expiraIn: 22, ultimaEvaluare: '2023-01', urmatoareaEvaluare: '2028-01', inspector: 'Radu V.' },
  { id: 7, nume: 'Colegiul Economic „Gh. Chițu"', judet: 'Dolj', tip: 'Colegiu', status: 'in-evaluare', expiraIn: null, ultimaEvaluare: '2025-02', urmatoareaEvaluare: '—', inspector: 'Popa D.' },
  { id: 8, nume: 'Grădinița Nr. 14', judet: 'Dolj', tip: 'Grădiniță', status: 'autorizata', expiraIn: 4, ultimaEvaluare: '—', urmatoareaEvaluare: '2025-10', inspector: 'Gheorghe M.' },
  { id: 9, nume: 'Liceul „Voltaire"', judet: 'Dolj', tip: 'Liceu', status: 'suspendata', expiraIn: null, ultimaEvaluare: '2024-04', urmatoareaEvaluare: 'SUSPENDAT', inspector: 'Costea F.' },
  { id: 10, nume: 'Școala Gimnazială Breasta', judet: 'Dolj', tip: 'Gimnaziu', status: 'acreditata', expiraIn: 60, ultimaEvaluare: '2022-08', urmatoareaEvaluare: '2027-08', inspector: 'Niculescu A.' },
  { id: 11, nume: 'Liceul Pedagogic „Ștefan Velovan"', judet: 'Dolj', tip: 'Liceu', status: 'acreditata', expiraIn: 14, ultimaEvaluare: '2023-05', urmatoareaEvaluare: '2028-05', inspector: 'Barbu I.' },
  { id: 12, nume: 'Grădinița „Lumea Copiilor"', judet: 'Dolj', tip: 'Grădiniță', status: 'expirata', expiraIn: -1, ultimaEvaluare: '2019-12', urmatoareaEvaluare: 'URGENTĂ', inspector: 'Diaconu T.' },
]

const STATUS_CONFIG: Record<StatusType, { label: string; color: string; bg: string; dot: string }> = {
  'acreditata':   { label: 'Acreditată',      color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   dot: '#22c55e' },
  'in-evaluare':  { label: 'În Evaluare',     color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  dot: '#f59e0b' },
  'autorizata':   { label: 'Autorizată',      color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  dot: '#3b82f6' },
  'expirata':     { label: 'Expirată',        color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   dot: '#ef4444' },
  'suspendata':   { label: 'Suspendată',      color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', dot: '#94a3b8' },
}

export default function DashboardAracip() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [filtruStatus, setFiltruStatus] = useState<string>('toate')
  const [filtruTip, setFiltruTip] = useState<string>('toate')
  const [filtruJudet, setFiltruJudet] = useState<string>('toate')
  const [cautare, setCautare] = useState('')
  const [scoalaSelectata, setScoalaSelectata] = useState<Scoala | null>(null)
  const [live, setLive] = useState<Scoala[]>([])
  const [loadingLive, setLoadingLive] = useState(false)

  async function loadLive() {
    setLoadingLive(true)
    try {
      const r = await fetch('/api/unitati')
      const j = await r.json()
      const mapped: Scoala[] = (j.unitati || []).map((u: any, i: number) => ({
        id: 100000 + i,
        nume: u.nume_unitate,
        judet: u.judet,
        tip: u.tip_unitate || 'Școală',
        status: mapStatusLive(u.status),
        expiraIn: null,
        ultimaEvaluare: u.created_at ? new Date(u.created_at).toLocaleDateString('ro-RO', { month: '2-digit', year: 'numeric' }).replace('.', '-') : '—',
        urmatoareaEvaluare: '—',
        inspector: 'Depunere unitate',
        live: true,
        calificativ: u.calificativ_general || null,
        rezumat: u.rezumat || null,
      }))
      setLive(mapped)
    } catch (e) { console.error('[dashboard unitati live]', e) }
    setLoadingLive(false)
  }
  useEffect(() => { loadLive() }, [])

  // Unitățile reale depuse apar primele; cele demo rămân ca EXEMPLU ilustrativ.
  const toate = [...live, ...SCOLI]
  const judeteDisponibile = Array.from(new Set(toate.map(s => s.judet))).sort((a, b) => a.localeCompare(b, 'ro'))

  const scoli = toate.filter(s => {
    const matchStatus = filtruStatus === 'toate' || s.status === filtruStatus
    const matchTip = filtruTip === 'toate' || s.tip === filtruTip
    const matchJudet = filtruJudet === 'toate' || s.judet === filtruJudet
    const matchCautare = s.nume.toLowerCase().includes(cautare.toLowerCase()) || s.judet.toLowerCase().includes(cautare.toLowerCase())
    return matchStatus && matchTip && matchJudet && matchCautare
  })

  const stats = {
    total: toate.length,
    live: live.length,
    acreditate: toate.filter(s => s.status === 'acreditata').length,
    inEvaluare: toate.filter(s => s.status === 'in-evaluare').length,
    autorizate: toate.filter(s => s.status === 'autorizata').length,
    expirate: toate.filter(s => s.status === 'expirata').length,
    alerteUrgente: toate.filter(s => s.expiraIn !== null && s.expiraIn < 10).length,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>

      {/* Topbar */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => router.push('/acreditare')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Acreditare</button>
          <div style={{ width: 1, height: 20, background: '#334155' }} />
          <span style={{ fontSize: '20px' }}>🏛️</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>Dashboard ARACIP</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Monitorizare unități școlare · <span style={{ color: '#22c55e', fontWeight: 700 }}>{stats.live} depuse LIVE</span></div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {stats.alerteUrgente > 0 && (
            <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', borderRadius: '8px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block', boxShadow: '0 0 6px #ef4444' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#ef4444' }}>{stats.alerteUrgente} alerte urgente</span>
            </div>
          )}
          <div style={{ fontSize: '12px', color: '#475569' }}>Inspector: Popescu Ion</div>
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Stats cards */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)', gap: '14px', marginBottom: '24px' }}>
          {[
            { label: 'Total Unități', val: stats.total, color: '#818cf8', icon: '🏫' },
            { label: 'Acreditate', val: stats.acreditate, color: '#22c55e', icon: '✅' },
            { label: 'În Evaluare', val: stats.inEvaluare, color: '#f59e0b', icon: '🔍' },
            { label: 'Autorizate', val: stats.autorizate, color: '#3b82f6', icon: '📋' },
            { label: 'Expirate ⚠️', val: stats.expirate, color: '#ef4444', icon: '❌' },
          ].map(s => (
            <div key={s.label} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px 18px' }}>
              <div style={{ fontSize: '20px', marginBottom: '6px' }}>{s.icon}</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Alerte urgente */}
        {SCOLI.filter(s => s.expiraIn !== null && s.expiraIn < 10).length > 0 && (
          <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
              ⚠️ Alerte — Evaluare Expirată sau Iminentă
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {SCOLI.filter(s => s.expiraIn !== null && s.expiraIn < 10).map(s => (
                <div
                  key={s.id}
                  onClick={() => setScoalaSelectata(s)}
                  style={{ background: '#1e293b', border: `1px solid ${s.expiraIn! < 0 ? '#ef4444' : '#f59e0b'}`, borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.expiraIn! < 0 ? '#ef4444' : '#f59e0b', display: 'inline-block' }} />
                  <span style={{ fontSize: '12px', color: '#e2e8f0', fontWeight: 600 }}>{s.nume}</span>
                  <span style={{ fontSize: '11px', color: s.expiraIn! < 0 ? '#ef4444' : '#f59e0b' }}>
                    {s.expiraIn! < 0 ? `Expirată de ${Math.abs(s.expiraIn!)} luni` : `Expiră în ${s.expiraIn} luni`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '20px', flexDirection: isMobile ? 'column' : 'row' }}>

          {/* Tabel scoli */}
          <div style={{ flex: 1 }}>
            {/* Filtre */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                placeholder="🔍 Caută școală..."
                value={cautare}
                onChange={e => setCautare(e.target.value)}
                style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', color: '#e2e8f0', outline: 'none', width: '220px' }}
              />
              <select
                value={filtruStatus}
                onChange={e => setFiltruStatus(e.target.value)}
                style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', color: '#e2e8f0', outline: 'none', cursor: 'pointer' }}
              >
                <option value="toate">Toate statusurile</option>
                <option value="acreditata">Acreditate</option>
                <option value="in-evaluare">În Evaluare</option>
                <option value="autorizata">Autorizate</option>
                <option value="expirata">Expirate</option>
                <option value="suspendata">Suspendate</option>
              </select>
              <select
                value={filtruTip}
                onChange={e => setFiltruTip(e.target.value)}
                style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', color: '#e2e8f0', outline: 'none', cursor: 'pointer' }}
              >
                <option value="toate">Toate tipurile</option>
                <option value="Liceu">Licee</option>
                <option value="Colegiu">Colegii</option>
                <option value="Gimnaziu">Gimnazii</option>
                <option value="Grădiniță">Grădinițe</option>
                <option value="Specială">Speciale</option>
              </select>
              <select
                value={filtruJudet}
                onChange={e => setFiltruJudet(e.target.value)}
                style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', color: '#e2e8f0', outline: 'none', cursor: 'pointer' }}
              >
                <option value="toate">Toate județele</option>
                {judeteDisponibile.map(j => <option key={j} value={j}>{j}</option>)}
              </select>
              <button onClick={loadLive} disabled={loadingLive} style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.35)', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', color: '#c4b5fd', cursor: 'pointer', fontWeight: 600 }}>
                {loadingLive ? '...' : '🔄 Reîncarcă LIVE'}
              </button>
              <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#475569' }}>
                {scoli.length} unități afișate
              </div>
            </div>

            {/* Table */}
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#0f172a' }}>
                    {['Unitate Școlară', 'Județ', 'Tip', 'Status', 'Expiră în', 'Ultima Eval.', 'Inspector'].map(h => (
                      <th key={h} style={{ padding: '11px 14px', fontSize: '11px', fontWeight: 700, color: '#64748b', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #334155' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scoli.map((s, i) => {
                    const cfg = STATUS_CONFIG[s.status]
                    const isSelected = scoalaSelectata?.id === s.id
                    return (
                      <tr
                        key={s.id}
                        onClick={() => setScoalaSelectata(isSelected ? null : s)}
                        style={{
                          borderBottom: i < scoli.length - 1 ? '1px solid #1e293b' : 'none',
                          cursor: 'pointer',
                          background: isSelected ? 'rgba(167,139,250,0.08)' : (i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'),
                          borderLeft: isSelected ? '3px solid #a78bfa' : '3px solid transparent',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,255,255,0.03)' }}
                        onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}
                      >
                        <td style={{ padding: '11px 14px', fontSize: '13px', fontWeight: 600, color: '#f1f5f9', maxWidth: '240px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                            {s.live
                              ? <span style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontSize: '9px', fontWeight: 800, padding: '1px 6px', borderRadius: '10px', flexShrink: 0 }}>LIVE</span>
                              : <span style={{ background: 'rgba(148,163,184,0.12)', color: '#64748b', fontSize: '9px', fontWeight: 700, padding: '1px 6px', borderRadius: '10px', flexShrink: 0 }}>exemplu</span>}
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.nume}</span>
                          </div>
                        </td>
                        <td style={{ padding: '11px 14px', fontSize: '12px', color: '#94a3b8' }}>{s.judet}</td>
                        <td style={{ padding: '11px 14px', fontSize: '12px', color: '#94a3b8' }}>{s.tip}</td>
                        <td style={{ padding: '11px 14px' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: cfg.bg, borderRadius: '20px', padding: '3px 10px' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
                            <span style={{ fontSize: '11px', fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
                          </div>
                        </td>
                        <td style={{ padding: '11px 14px', fontSize: '12px' }}>
                          {s.expiraIn === null ? (
                            <span style={{ color: '#475569' }}>—</span>
                          ) : s.expiraIn < 0 ? (
                            <span style={{ color: '#ef4444', fontWeight: 700 }}>Expirat ({Math.abs(s.expiraIn)} luni)</span>
                          ) : s.expiraIn < 10 ? (
                            <span style={{ color: '#f59e0b', fontWeight: 700 }}>{s.expiraIn} luni ⚠️</span>
                          ) : (
                            <span style={{ color: '#64748b' }}>{s.expiraIn} luni</span>
                          )}
                        </td>
                        <td style={{ padding: '11px 14px', fontSize: '12px', color: '#64748b' }}>{s.ultimaEvaluare}</td>
                        <td style={{ padding: '11px 14px', fontSize: '12px', color: '#64748b' }}>{s.inspector}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {scoli.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', color: '#334155', fontSize: '14px' }}>
                  Nicio unitate școlară nu corespunde filtrelor aplicate.
                </div>
              )}
              </div>
            </div>
          </div>

          {/* Panel detalii */}
          {scoalaSelectata && (
            <div style={isMobile ? { position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200 } : { width: '300px', flexShrink: 0 }}>
              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: isMobile ? '12px 12px 0 0' : '12px', padding: '20px', position: isMobile ? 'relative' : 'sticky', top: isMobile ? 'auto' : '20px', maxHeight: isMobile ? '60vh' : 'none', overflowY: isMobile ? 'auto' : 'visible' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Detalii Unitate</div>
                  <button onClick={() => setScoalaSelectata(null)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}>×</button>
                </div>

                <div style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9', marginBottom: '6px', lineHeight: 1.3 }}>{scoalaSelectata.nume}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>{scoalaSelectata.tip} · {scoalaSelectata.judet}</div>

                {(() => {
                  const cfg = STATUS_CONFIG[scoalaSelectata.status]
                  return (
                    <div style={{ background: cfg.bg, border: `1px solid ${cfg.color}44`, borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: cfg.dot, display: 'inline-block', boxShadow: `0 0 6px ${cfg.dot}` }} />
                      <span style={{ fontSize: '13px', fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
                    </div>
                  )
                })()}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  {[
                    { label: 'Ultima evaluare', val: scoalaSelectata.ultimaEvaluare },
                    { label: 'Următoarea evaluare', val: scoalaSelectata.urmatoareaEvaluare },
                    { label: 'Inspector responsabil', val: scoalaSelectata.inspector },
                    {
                      label: 'Termen evaluare',
                      val: scoalaSelectata.expiraIn === null ? '—'
                        : scoalaSelectata.expiraIn < 0 ? `Depășit cu ${Math.abs(scoalaSelectata.expiraIn)} luni`
                        : `${scoalaSelectata.expiraIn} luni rămase`
                    },
                  ].map(r => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #334155' }}>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{r.label}</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#e2e8f0' }}>{r.val}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button style={{ background: '#a855f7', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', textAlign: 'center' }}>
                    📄 Vezi Dosar Complet
                  </button>
                  <button style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', textAlign: 'center' }}>
                    📅 Programează Vizită
                  </button>
                  <button style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', textAlign: 'center' }}>
                    ✉️ Notifică Directorul
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
