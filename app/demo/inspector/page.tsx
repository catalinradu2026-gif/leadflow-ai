'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const JUDETE = [
  { name: 'Alba', scoli: 198, active: 198, doc: 12, alert: 0 },
  { name: 'Arad', scoli: 221, active: 219, doc: 8, alert: 2 },
  { name: 'Argeș', scoli: 312, active: 310, doc: 15, alert: 0 },
  { name: 'Bacău', scoli: 287, active: 285, doc: 11, alert: 2 },
  { name: 'Bihor', scoli: 334, active: 334, doc: 9, alert: 0 },
  { name: 'Bistrița-Năsăud', scoli: 167, active: 165, doc: 7, alert: 2 },
  { name: 'Botoșani', scoli: 243, active: 241, doc: 10, alert: 2 },
  { name: 'Brăila', scoli: 142, active: 142, doc: 6, alert: 0 },
  { name: 'Brașov', scoli: 276, active: 276, doc: 14, alert: 0 },
  { name: 'Buzău', scoli: 231, active: 229, doc: 8, alert: 2 },
  { name: 'Călărași', scoli: 156, active: 154, doc: 5, alert: 2 },
  { name: 'Caraș-Severin', scoli: 178, active: 178, doc: 7, alert: 0 },
  { name: 'Cluj', scoli: 398, active: 398, doc: 18, alert: 0 },
  { name: 'Constanța', scoli: 341, active: 339, doc: 13, alert: 2 },
  { name: 'Covasna', scoli: 112, active: 112, doc: 5, alert: 0 },
  { name: 'Dâmbovița', scoli: 267, active: 265, doc: 9, alert: 2 },
  { name: 'Dolj', scoli: 240, active: 238, doc: 16, alert: 2 },
  { name: 'Galați', scoli: 223, active: 221, doc: 8, alert: 2 },
  { name: 'Giurgiu', scoli: 134, active: 134, doc: 4, alert: 0 },
  { name: 'Gorj', scoli: 189, active: 187, doc: 7, alert: 2 },
  { name: 'Harghita', scoli: 178, active: 178, doc: 6, alert: 0 },
  { name: 'Hunedoara', scoli: 201, active: 199, doc: 8, alert: 2 },
  { name: 'Ialomița', scoli: 143, active: 141, doc: 5, alert: 2 },
  { name: 'Iași', scoli: 412, active: 412, doc: 19, alert: 0 },
  { name: 'Ilfov', scoli: 167, active: 167, doc: 7, alert: 0 },
  { name: 'Maramureș', scoli: 256, active: 254, doc: 10, alert: 2 },
  { name: 'Mehedinți', scoli: 145, active: 143, doc: 6, alert: 2 },
  { name: 'Mureș', scoli: 298, active: 298, doc: 11, alert: 0 },
  { name: 'Neamț', scoli: 234, active: 232, doc: 9, alert: 2 },
  { name: 'Olt', scoli: 198, active: 196, doc: 7, alert: 2 },
  { name: 'Prahova', scoli: 356, active: 354, doc: 14, alert: 2 },
  { name: 'Sălaj', scoli: 134, active: 134, doc: 5, alert: 0 },
  { name: 'Satu Mare', scoli: 178, active: 176, doc: 6, alert: 2 },
  { name: 'Sibiu', scoli: 212, active: 212, doc: 9, alert: 0 },
  { name: 'Suceava', scoli: 378, active: 376, doc: 16, alert: 2 },
  { name: 'Teleorman', scoli: 167, active: 165, doc: 6, alert: 2 },
  { name: 'Timiș', scoli: 312, active: 312, doc: 13, alert: 0 },
  { name: 'Tulcea', scoli: 134, active: 132, doc: 5, alert: 2 },
  { name: 'Vâlcea', scoli: 189, active: 187, doc: 7, alert: 2 },
  { name: 'Vaslui', scoli: 223, active: 221, doc: 8, alert: 2 },
  { name: 'Vrancea', scoli: 167, active: 165, doc: 6, alert: 2 },
  { name: 'Municipiul București', scoli: 512, active: 512, doc: 24, alert: 0 },
]

const totalScoli = JUDETE.reduce((s, j) => s + j.scoli, 0)
const totalActive = JUDETE.reduce((s, j) => s + j.active, 0)
const totalAlerte = JUDETE.reduce((s, j) => s + j.alert, 0)

export default function InspectorNational() {
  const router = useRouter()
  const [showBroadcast, setShowBroadcast] = useState(false)
  const [broadcastMsg, setBroadcastMsg] = useState('')
  const [sent, setSent] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = JUDETE.filter(j => j.name.toLowerCase().includes(search.toLowerCase()))

  function handleBroadcast() {
    if (!broadcastMsg.trim()) return
    setSent(true)
    setTimeout(() => { setShowBroadcast(false); setSent(false); setBroadcastMsg('') }, 2000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>

      {/* Topbar */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => router.push('/demo')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Demo</button>
          <div style={{ width: 1, height: 20, background: '#334155' }} />
          <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>🇷🇴 Inspector Național</span>
          <span style={{ background: '#1d4ed8', color: '#93c5fd', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>NIVEL NAȚIONAL</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>19 mai 2026 · 09:42</span>
          <button
            onClick={() => setShowBroadcast(true)}
            style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
          >
            📢 Broadcast Național
          </button>
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total Unități Școlare', val: totalScoli.toLocaleString('ro'), icon: '🏫', color: '#3b82f6', sub: 'școli + grădinițe' },
            { label: 'Județe Active', val: '42 / 42', icon: '✅', color: '#10b981', sub: 'toate conectate' },
            { label: 'Conectate Azi', val: totalActive.toLocaleString('ro'), icon: '🟢', color: '#22c55e', sub: `din ${totalScoli.toLocaleString('ro')} total` },
            { label: 'Alerte Nerezolvate', val: totalAlerte, icon: '⚠️', color: '#f59e0b', sub: 'directori inactivi' },
          ].map(s => (
            <div key={s.label} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>{s.label}</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>{s.sub}</div>
                </div>
                <div style={{ fontSize: '28px' }}>{s.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Activitate recentă + Tabel județe */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>

          {/* Tabel judete */}
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9' }}>Situație pe județe</h2>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Caută județ..."
                style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '6px 12px', fontSize: '13px', color: '#e2e8f0', outline: 'none', width: '160px' }}
              />
            </div>
            <div style={{ overflowY: 'auto', maxHeight: '520px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#0f172a', position: 'sticky', top: 0 }}>
                    {['Județ', 'Unități', 'Conectate', 'Documente', 'Status'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((j, i) => (
                    <tr key={j.name} style={{ borderBottom: '1px solid #1e293b', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>{j.name}</td>
                      <td style={{ padding: '10px 16px', fontSize: '13px', color: '#94a3b8' }}>{j.scoli}</td>
                      <td style={{ padding: '10px 16px', fontSize: '13px' }}>
                        <span style={{ color: j.active === j.scoli ? '#22c55e' : '#f59e0b' }}>
                          {j.active}/{j.scoli}
                        </span>
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: '13px', color: '#60a5fa' }}>{j.doc}</td>
                      <td style={{ padding: '10px 16px' }}>
                        {j.alert > 0
                          ? <span style={{ background: '#7f1d1d', color: '#fca5a5', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>⚠️ {j.alert} alerte</span>
                          : <span style={{ background: '#052e16', color: '#86efac', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>✓ OK</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Activitate recenta */}
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' }}>Activitate Recentă</h3>
              {[
                { time: '09:38', text: 'ISJ Cluj a încărcat Circular 1247/2026', color: '#3b82f6' },
                { time: '09:21', text: 'ISJ Iași — 412 directori au confirmat lectura', color: '#22c55e' },
                { time: '08:55', text: '⚠️ ISJ Bacău — 2 directori inactivi 48h', color: '#f59e0b' },
                { time: '08:30', text: 'ISJ Timiș a trimis broadcast județean', color: '#3b82f6' },
                { time: '07:44', text: 'ISJ Dolj — document nou procesat de AI', color: '#a78bfa' },
                { time: 'Ieri', text: '38 ISJ-uri au raportat situația lunară', color: '#22c55e' },
              ].map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '11px', color: '#475569', whiteSpace: 'nowrap', marginTop: '1px', minWidth: '36px' }}>{a.time}</span>
                  <span style={{ width: 3, minWidth: 3, height: '100%', background: a.color, borderRadius: '2px', alignSelf: 'stretch', minHeight: '16px' }} />
                  <span style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>{a.text}</span>
                </div>
              ))}
            </div>

            {/* Statistici documente */}
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' }}>Documente Naționale</h3>
              {[
                { label: 'Total documente urcate', val: '387', color: '#3b82f6' },
                { label: 'Indexate de AI', val: '387', color: '#22c55e' },
                { label: 'Întrebări chatbot azi', val: '1.243', color: '#a78bfa' },
                { label: 'Confirmări citire', val: '98.7%', color: '#10b981' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{s.label}</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: s.color }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast Modal */}
      {showBroadcast && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '32px', width: '480px' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ color: '#22c55e', fontSize: '18px', fontWeight: 700 }}>Mesaj trimis cu succes!</h3>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '8px' }}>Toți directorii din România au fost notificați.</p>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>📢 Broadcast Național</h3>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Mesajul va fi trimis simultan tuturor celor <strong style={{ color: '#f1f5f9' }}>11.500+ directori</strong> din România.</p>
                <textarea
                  value={broadcastMsg}
                  onChange={e => setBroadcastMsg(e.target.value)}
                  placeholder="Scrieți mesajul național..."
                  rows={4}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '12px', fontSize: '14px', color: '#e2e8f0', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <button onClick={() => setShowBroadcast(false)} style={{ flex: 1, background: '#334155', color: '#94a3b8', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', cursor: 'pointer' }}>Anulează</button>
                  <button onClick={handleBroadcast} style={{ flex: 1, background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Trimite Național →</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
