'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '../../hooks/useIsMobile'

const REGISTRE = [
  { id: 1, nume: 'Registrul Național al Unităților Acreditate', icon: '🏅', color: '#22c55e', actualizat: '11 mai 2026', total: 8247, desc: 'Toate unitățile de învățământ preuniversitar care au obținut acreditarea ARACIP.' },
  { id: 2, nume: 'Registrul Autorizare Provizorie — Particular', icon: '📋', color: '#6366f1', actualizat: '19 mai 2026', total: 312, desc: 'Unități de învățământ particular autorizate provizoriu să funcționeze.' },
  { id: 3, nume: 'Registrul Autorizare Provizorie — Stat', icon: '🏫', color: '#3b82f6', actualizat: '8 mai 2026', total: 143, desc: 'Unități de învățământ de stat autorizate provizoriu să funcționeze.' },
  { id: 4, nume: 'Registrul Furnizorilor de Educație Timpurie Antepreșcolară', icon: '👶', color: '#f59e0b', actualizat: '8 mai 2026', total: 891, desc: 'Furnizori autorizați pentru educația copiilor cu vârsta sub 3 ani.' },
  { id: 5, nume: 'Registrul Unităților Evaluate Periodic', icon: '🔄', color: '#14b8a6', actualizat: '4 mai 2026', total: 4102, desc: 'Unități care au parcurs procesul de evaluare externă periodică (la 5 ani).' },
  { id: 6, nume: 'Registrul Special Sisteme de Învățământ Străine', icon: '🌍', color: '#a855f7', actualizat: '23 apr. 2026', total: 28, desc: 'Unități care funcționează după curricula unor sisteme educaționale străine.' },
  { id: 7, nume: 'Registrul Furnizorilor Școală din Spital', icon: '🏥', color: '#ef4444', actualizat: '24 nov. 2025', total: 47, desc: 'Unități de învățământ organizate în cadrul spitalelor pentru copiii internați.' },
]

const UNITATI_DEMO = [
  { id: 1, nume: 'Colegiul Național „Carol I"', judet: 'Dolj', tip: 'Colegiu', an: 2021, rezultat: 'Bine', registru: 1 },
  { id: 2, nume: 'Liceul Teoretic „Elena Cuza"', judet: 'Dolj', tip: 'Liceu', an: 2022, rezultat: 'Excelent', registru: 1 },
  { id: 3, nume: 'Grădinița „Floare de Colț"', judet: 'Dolj', tip: 'Grădiniță', an: 2023, rezultat: 'Autorizată', registru: 2 },
  { id: 4, nume: 'Liceul Tehnologic „Henri Coandă"', judet: 'Dolj', tip: 'Liceu', an: 2024, rezultat: 'Autorizată', registru: 3 },
  { id: 5, nume: 'Centrul Educațional „Micul Prinț"', judet: 'Ilfov', tip: 'Grădiniță', an: 2022, rezultat: 'Autorizată', registru: 4 },
  { id: 6, nume: 'Școala Gimnazială Nr. 7', judet: 'Dolj', tip: 'Gimnaziu', an: 2021, rezultat: 'Satisfăcător', registru: 5 },
  { id: 7, nume: 'Liceul Pedagogic „Ștefan Velovan"', judet: 'Dolj', tip: 'Liceu', an: 2023, rezultat: 'Bine', registru: 1 },
  { id: 8, nume: 'Colegiul Economic „Gh. Chițu"', judet: 'Dolj', tip: 'Colegiu', an: 2020, rezultat: 'Bine', registru: 5 },
  { id: 9, nume: 'International School of Bucharest', judet: 'Ilfov', tip: 'Liceu', an: 2022, rezultat: 'Acreditată', registru: 6 },
  { id: 10, nume: 'Școala Spital „Victor Babeș"', judet: 'Cluj', tip: 'Specială', an: 2023, rezultat: 'Autorizată', registru: 7 },
]

const REZULTAT_COLORS: Record<string, string> = {
  'Excelent': '#22c55e', 'Bine': '#3b82f6', 'Satisfăcător': '#f59e0b',
  'Nesatisfăcător': '#ef4444', 'Autorizată': '#6366f1', 'Acreditată': '#22c55e',
}

export default function Registre() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [registruActiv, setRegistruActiv] = useState<number | null>(null)
  const [cautare, setCautare] = useState('')
  const [judet, setJudet] = useState('')
  const [an, setAn] = useState('')

  const unitati = UNITATI_DEMO.filter(u => {
    const matchReg = registruActiv === null || u.registru === registruActiv
    const matchCautare = u.nume.toLowerCase().includes(cautare.toLowerCase())
    const matchJudet = !judet || u.judet === judet
    const matchAn = !an || u.an === parseInt(an)
    return matchReg && matchCautare && matchJudet && matchAn
  })

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>

      {/* Topbar */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '16px', height: '56px', flexWrap: 'wrap' }}>
        <button onClick={() => router.push('/acreditare')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Acreditare</button>
        <div style={{ width: 1, height: 20, background: '#334155' }} />
        <span>📋</span>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>Registre Naționale ARACIP</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>7 registre · actualizate permanent</div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '16px' : '28px 24px' }}>

        {/* Registre cards */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
          {REGISTRE.map(r => (
            <div
              key={r.id}
              onClick={() => setRegistruActiv(registruActiv === r.id ? null : r.id)}
              style={{
                background: registruActiv === r.id ? `${r.color}15` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${registruActiv === r.id ? r.color + '55' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: '12px', padding: '14px', cursor: 'pointer',
                transition: 'all 0.2s',
                borderLeft: registruActiv === r.id ? `3px solid ${r.color}` : '3px solid transparent',
              }}
              onMouseEnter={e => { if (registruActiv !== r.id) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { if (registruActiv !== r.id) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '22px' }}>{r.icon}</span>
                <span style={{ fontSize: '18px', fontWeight: 800, color: r.color }}>{r.total.toLocaleString()}</span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3, marginBottom: '4px' }}>{r.nume}</div>
              <div style={{ fontSize: '10px', color: '#334155' }}>Actualizat: {r.actualizat}</div>
            </div>
          ))}
          {/* Total card */}
          <div style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#a78bfa' }}>{REGISTRE.reduce((s, r) => s + r.total, 0).toLocaleString()}</div>
            <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>Total unități înregistrate</div>
          </div>
        </div>

        {registruActiv && (
          <div style={{ background: `${REGISTRE[registruActiv-1].color}10`, border: `1px solid ${REGISTRE[registruActiv-1].color}33`, borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#94a3b8' }}>
            📌 {REGISTRE[registruActiv-1].desc}
          </div>
        )}

        {/* Filtre */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            placeholder="🔍 Caută unitate școlară..."
            value={cautare}
            onChange={e => setCautare(e.target.value)}
            style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', color: '#e2e8f0', outline: 'none', width: isMobile ? '100%' : '260px' }}
          />
          <select value={judet} onChange={e => setJudet(e.target.value)} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', color: '#e2e8f0', outline: 'none', cursor: 'pointer' }}>
            <option value="">Toate județele</option>
            {['Dolj', 'Ilfov', 'Cluj', 'Prahova', 'Constanța'].map(j => <option key={j}>{j}</option>)}
          </select>
          <select value={an} onChange={e => setAn(e.target.value)} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', color: '#e2e8f0', outline: 'none', cursor: 'pointer' }}>
            <option value="">Toți anii</option>
            {[2026,2025,2024,2023,2022,2021,2020].map(a => <option key={a}>{a}</option>)}
          </select>
          {(cautare || judet || an || registruActiv) && (
            <button onClick={() => { setCautare(''); setJudet(''); setAn(''); setRegistruActiv(null) }} style={{ background: 'none', border: '1px solid #334155', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', color: '#64748b', cursor: 'pointer' }}>
              ✕ Resetează
            </button>
          )}
          <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#475569' }}>{unitati.length} rezultate</div>
        </div>

        {/* Tabel */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr style={{ background: '#0f172a' }}>
                  {['Unitate Școlară', 'Județ', 'Tip', 'An Evaluare', 'Rezultat', 'Registru'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', fontSize: '10px', fontWeight: 700, color: '#64748b', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #334155' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {unitati.map((u, i) => {
                  const reg = REGISTRE[u.registru - 1]
                  return (
                    <tr key={u.id} style={{ borderBottom: i < unitati.length - 1 ? '1px solid #0f172a' : 'none' }}>
                      <td style={{ padding: '11px 14px', fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>{u.nume}</td>
                      <td style={{ padding: '11px 14px', fontSize: '12px', color: '#64748b' }}>{u.judet}</td>
                      <td style={{ padding: '11px 14px', fontSize: '12px', color: '#64748b' }}>{u.tip}</td>
                      <td style={{ padding: '11px 14px', fontSize: '12px', color: '#64748b' }}>{u.an}</td>
                      <td style={{ padding: '11px 14px' }}>
                        <span style={{ background: `${REZULTAT_COLORS[u.rezultat]}18`, color: REZULTAT_COLORS[u.rezultat], fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>{u.rezultat}</span>
                      </td>
                      <td style={{ padding: '11px 14px' }}>
                        <span style={{ background: `${reg.color}15`, color: reg.color, fontSize: '11px', padding: '3px 8px', borderRadius: '6px' }}>{reg.icon} {reg.id}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {unitati.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#334155', fontSize: '14px' }}>Nicio unitate găsită.</div>
          )}
        </div>
      </div>
    </div>
  )
}
