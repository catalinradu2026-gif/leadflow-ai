'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type TipUnitate = 'Liceu' | 'Colegiu' | 'Școală' | 'Grădiniță'
const TIP_COLORS: Record<TipUnitate, { bg: string; color: string }> = {
  'Liceu':     { bg: '#1e3a5f', color: '#93c5fd' },
  'Colegiu':   { bg: '#4c1d95', color: '#c4b5fd' },
  'Școală':    { bg: '#064e3b', color: '#6ee7b7' },
  'Grădiniță': { bg: '#713f12', color: '#fde68a' },
}
const SCOLI_DOLJ = [
  { name: 'Liceul Teoretic "Amărăștii de Jos"', loc: 'Amărăștii de Jos', director: 'Ion Marin', citit: true, activ: true, tip: 'Liceu' as TipUnitate },
  { name: 'Colegiul Național "Elena Cuza"', loc: 'Craiova', director: 'Maria Ionescu', citit: true, activ: true, tip: 'Colegiu' as TipUnitate },
  { name: 'Liceul Teoretic "Henri Coandă"', loc: 'Craiova', director: 'Andrei Popescu', citit: true, activ: true, tip: 'Liceu' as TipUnitate },
  { name: 'Școala Gimnazială Nr. 12', loc: 'Craiova', director: 'Elena Dumitrescu', citit: false, activ: true, tip: 'Școală' as TipUnitate },
  { name: 'Colegiul Tehnic "Costin D. Nenițescu"', loc: 'Craiova', director: 'Gheorghe Stan', citit: true, activ: true, tip: 'Colegiu' as TipUnitate },
  { name: 'Liceul cu Program Sportiv', loc: 'Craiova', director: 'Florin Popa', citit: false, activ: false, tip: 'Liceu' as TipUnitate },
  { name: 'Grădinița Nr. 3', loc: 'Craiova', director: 'Ana Stoica', citit: true, activ: true, tip: 'Grădiniță' as TipUnitate },
  { name: 'Grădinița Nr. 8 Craiova', loc: 'Craiova', director: 'Ioana Vlad', citit: true, activ: true, tip: 'Grădiniță' as TipUnitate },
  { name: 'Grădinița "Lumina" Craiova', loc: 'Craiova', director: 'Petra Ionescu', citit: true, activ: true, tip: 'Grădiniță' as TipUnitate },
  { name: 'Școala Gimnazială "Nicolae Titulescu"', loc: 'Băilești', director: 'Mihai Tudorache', citit: true, activ: true, tip: 'Școală' as TipUnitate },
  { name: 'Liceul Teoretic "George Țărnea"', loc: 'Băilești', director: 'Rodica Nițu', citit: true, activ: true, tip: 'Liceu' as TipUnitate },
  { name: 'Școala Primară Segarcea', loc: 'Segarcea', director: 'Vasile Constantin', citit: false, activ: true, tip: 'Școală' as TipUnitate },
  { name: 'Liceul Tehnologic Calafat', loc: 'Calafat', director: 'Cristina Barbu', citit: true, activ: true, tip: 'Liceu' as TipUnitate },
]

const DOCUMENTE = [
  { id: 1, titlu: 'Metodologie Evaluare Națională 2026', data: '19 mai 2026', citite: 0, total: 240, tip: 'Metodologie', sursa: 'Inspector Național', nou: true },
  { id: 2, titlu: 'Circular nr. 1247/2026 — Raportare absențe mai 2026', data: '17 mai 2026', citite: 198, total: 240, tip: 'Circular', sursa: 'ISJ Dolj', nou: false },
  { id: 3, titlu: 'Procedura nr. 892/2026 — Examene naționale 2026', data: '14 mai 2026', citite: 236, total: 240, tip: 'Procedură', sursa: 'ISJ Dolj', nou: false },
  { id: 4, titlu: 'Adresa nr. 2103/2026 — Dotări informatice PNRR', data: '10 mai 2026', citite: 240, total: 240, tip: 'Adresă', sursa: 'Inspector Național', nou: false },
  { id: 5, titlu: 'Circular nr. 1198/2026 — Situație statistică an școlar', data: '5 mai 2026', citite: 240, total: 240, tip: 'Circular', sursa: 'ISJ Dolj', nou: false },
]

export default function ISJDolj() {
  const router = useRouter()
  const [tab, setTab] = useState<'docs' | 'scoli' | 'chat'>('docs')
  const [showUpload, setShowUpload] = useState(false)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadContent, setUploadContent] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadDone, setUploadDone] = useState(false)
  const [docs, setDocs] = useState(DOCUMENTE)
  const [chatMsg, setChatMsg] = useState('')
  const [chatHistory, setChatHistory] = useState<{ role: string; text: string }[]>([
    { role: 'system', text: 'Chat ISJ → Director deschis. Puteți trimite mesaje individuale sau broadcast.' }
  ])
  const [selectedSchool, setSelectedSchool] = useState(SCOLI_DOLJ[0].name)
  const [tipFilter, setTipFilter] = useState<string>('Toate')
  const [uploadTipDoc, setUploadTipDoc] = useState('Circular')
  const [uploadTipUnitate, setUploadTipUnitate] = useState<string>('Toate')

  const TIP_RATII: Record<string, number> = { 'Toate': 1, 'Liceu': 0.18, 'Colegiu': 0.12, 'Școală': 0.45, 'Grădiniță': 0.25 }

  async function handleUpload() {
    if (!uploadTitle.trim()) return
    setUploading(true)
    await new Promise(r => setTimeout(r, 1800))
    const total = Math.round(240 * (TIP_RATII[uploadTipUnitate] ?? 1))
    setDocs(prev => [{
      id: prev.length + 1,
      titlu: uploadTitle + (uploadTipUnitate !== 'Toate' ? ` — ${uploadTipUnitate}e` : ''),
      data: '19 mai 2026',
      citite: 0,
      total,
      tip: uploadTipDoc,
      sursa: 'ISJ Dolj',
      nou: true,
    }, ...prev])
    setUploading(false)
    setUploadDone(true)
    setTimeout(() => { setShowUpload(false); setUploadDone(false); setUploadTitle(''); setUploadContent(''); setUploadTipUnitate('Toate') }, 2000)
  }

  async function sendChat() {
    if (!chatMsg.trim()) return
    const msg = chatMsg
    setChatMsg('')
    setChatHistory(h => [...h, { role: 'isj', text: msg }])
    await new Promise(r => setTimeout(r, 800))
    setChatHistory(h => [...h, { role: 'director', text: `Am primit mesajul dvs. Vă mulțumesc, voi lua măsurile necesare. — Director ${SCOLI_DOLJ.find(s => s.name === selectedSchool)?.director}` }])
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>

      {/* Topbar */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => router.push('/demo')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Demo</button>
          <div style={{ width: 1, height: 20, background: '#334155' }} />
          <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>🏛️ ISJ Dolj</span>
          <span style={{ background: '#164e63', color: '#67e8f9', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>INSPECTOR ȘEF</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#92400e', border: '1px solid #f59e0b', borderRadius: '8px', padding: '6px 12px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', boxShadow: '0 0 6px #f59e0b' }} />
            <span style={{ fontSize: '12px', color: '#fcd34d', fontWeight: 700 }}>🔔 1 document nou de la Inspector Național</span>
          </div>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Inspector: <strong style={{ color: '#e2e8f0' }}>Popescu Dumitru</strong></span>
          <button
            onClick={() => setShowUpload(true)}
            style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
          >
            + Încarcă Document
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: '20px 24px 0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', maxWidth: '1200px', margin: '0 auto' }}>
        {[
          { label: 'Unități Școlare Dolj', val: '240', icon: '🏫', color: '#3b82f6' },
          { label: 'Conectate Azi', val: '238', icon: '🟢', color: '#22c55e' },
          { label: 'Documente Publicate', val: docs.length.toString(), icon: '📄', color: '#a78bfa' },
          { label: 'Directori cu Alertă', val: '2', icon: '⚠️', color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>{s.label}</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: s.color }}>{s.val}</div>
            </div>
            <span style={{ fontSize: '24px' }}>{s.icon}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ padding: '20px 24px 0', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '4px', background: '#1e293b', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
          {[
            { key: 'docs', label: '📄 Documente' },
            { key: 'scoli', label: '🏫 Școli & Directori' },
            { key: 'chat', label: '💬 Chat cu Director' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as 'docs' | 'scoli' | 'chat')}
              style={{
                background: tab === t.key ? '#3b82f6' : 'none',
                color: tab === t.key ? '#fff' : '#64748b',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 18px',
                fontSize: '13px',
                fontWeight: tab === t.key ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 24px 24px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* DOCUMENTE TAB */}
        {tab === 'docs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {docs.map(doc => (
              <div key={doc.id} style={{ background: '#1e293b', border: `1px solid ${doc.nou ? '#f59e0b' : '#334155'}`, borderRadius: '10px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 40, height: 40, background: doc.sursa === 'Inspector Național' ? '#1d4ed8' : '#1e293b', border: '1px solid #334155', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📄</div>
                  {doc.nou && <div style={{ position: 'absolute', top: -4, right: -4, width: 12, height: 12, background: '#ef4444', borderRadius: '50%', border: '2px solid #0f172a' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
                    {doc.nou && <span style={{ background: '#92400e', color: '#fcd34d', fontSize: '10px', fontWeight: 700, padding: '1px 8px', borderRadius: '20px' }}>NOU</span>}
                    <span style={{ background: '#1e40af', color: '#93c5fd', fontSize: '10px', fontWeight: 600, padding: '1px 8px', borderRadius: '20px' }}>{doc.tip}</span>
                    <span style={{ background: doc.sursa === 'Inspector Național' ? '#1d4ed8' : '#064e3b', color: doc.sursa === 'Inspector Național' ? '#93c5fd' : '#6ee7b7', fontSize: '10px', fontWeight: 700, padding: '1px 8px', borderRadius: '20px' }}>
                      {doc.sursa === 'Inspector Național' ? '🇷🇴 Inspector Național' : '🏛️ ISJ Dolj'}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: doc.nou ? 700 : 600, color: '#f1f5f9', marginBottom: '4px' }}>{doc.titlu}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{doc.data} · AI indexat ✓</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: doc.citite === doc.total ? '#22c55e' : '#f59e0b' }}>
                    {doc.citite}/{doc.total} citit
                  </div>
                  <div style={{ width: 120, height: 4, background: '#334155', borderRadius: '2px', marginTop: '6px' }}>
                    <div style={{ width: `${(doc.citite / doc.total) * 100}%`, height: '100%', background: doc.citite === doc.total ? '#22c55e' : '#f59e0b', borderRadius: '2px' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SCOLI TAB */}
        {tab === 'scoli' && (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', overflow: 'hidden' }}>
            {/* Filtre tip */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #334155', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tip:</span>
              {(['Toate', 'Liceu', 'Colegiu', 'Școală', 'Grădiniță'] as const).map(t => {
                const count = t === 'Toate' ? SCOLI_DOLJ.length : SCOLI_DOLJ.filter(s => s.tip === t).length
                if (count === 0) return null
                const sel = tipFilter === t
                const tc = t !== 'Toate' ? TIP_COLORS[t] : { bg: '#334155', color: '#94a3b8' }
                return (
                  <button key={t} onClick={() => setTipFilter(t)} style={{
                    background: sel ? tc.bg : '#0f172a',
                    border: `1px solid ${sel ? tc.color : '#334155'}`,
                    color: sel ? tc.color : '#64748b',
                    borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: sel ? 700 : 400, cursor: 'pointer',
                  }}>
                    {t} ({count})
                  </button>
                )
              })}
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0f172a' }}>
                  {['Unitate Școlară', 'Tip', 'Localitate', 'Director', 'Doc citit', 'Status'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SCOLI_DOLJ.filter(s => tipFilter === 'Toate' || s.tip === tipFilter).map((s, i) => {
                  const tc = TIP_COLORS[s.tip]
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>{s.name}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: tc.bg, color: tc.color, fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>{s.tip}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#94a3b8' }}>{s.loc}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#94a3b8' }}>{s.director}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                        {s.citit ? <span style={{ color: '#22c55e' }}>✓ Da</span> : <span style={{ color: '#ef4444' }}>✗ Nu</span>}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {s.activ
                          ? <span style={{ background: '#052e16', color: '#86efac', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>● Activ</span>
                          : <span style={{ background: '#7f1d1d', color: '#fca5a5', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>⚠ Inactiv 48h</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* CHAT TAB */}
        {tab === 'chat' && (
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '16px', height: '500px' }}>
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid #334155', fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Selectează Școala</div>
              <div style={{ overflowY: 'auto', flex: 1 }}>
                {SCOLI_DOLJ.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedSchool(s.name)}
                    style={{
                      padding: '10px 14px',
                      cursor: 'pointer',
                      background: selectedSchool === s.name ? '#1d4ed8' : 'transparent',
                      borderBottom: '1px solid #334155',
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 600, color: selectedSchool === s.name ? '#fff' : '#e2e8f0' }}>{s.name.slice(0, 30)}...</div>
                    <div style={{ fontSize: '11px', color: selectedSchool === s.name ? '#93c5fd' : '#64748b' }}>{s.director}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #334155' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>{selectedSchool}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Chat direct ISJ ↔ Director</div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {chatHistory.map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: m.role === 'isj' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '70%',
                      background: m.role === 'isj' ? '#1d4ed8' : m.role === 'system' ? '#334155' : '#065f46',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      fontSize: '13px',
                      color: '#f1f5f9',
                    }}>
                      {m.role !== 'system' && <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>{m.role === 'isj' ? 'ISJ Dolj' : 'Director'}</div>}
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '14px', borderTop: '1px solid #334155', display: 'flex', gap: '10px' }}>
                <input
                  value={chatMsg}
                  onChange={e => setChatMsg(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendChat()}
                  placeholder="Scrieți mesaj pentru director..."
                  style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#e2e8f0', outline: 'none' }}
                />
                <button onClick={sendChat} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Trimite</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '32px', width: '520px' }}>
            {uploadDone ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ color: '#22c55e', fontSize: '18px', fontWeight: 700 }}>Document publicat!</h3>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '8px' }}>AI a indexat documentul. Toți cei 240 directori au primit notificare.</p>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f1f5f9', marginBottom: '20px' }}>📄 Încarcă Document ISJ</h3>

                {/* Tip document */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tip document</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['Circular', 'Procedură', 'Adresă', 'Decizie'].map(t => (
                      <button key={t} onClick={() => setUploadTipDoc(t)} style={{
                        background: uploadTipDoc === t ? '#1d4ed8' : '#0f172a',
                        border: `1px solid ${uploadTipDoc === t ? '#3b82f6' : '#334155'}`,
                        color: uploadTipDoc === t ? '#fff' : '#94a3b8',
                        borderRadius: '20px', padding: '5px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                      }}>{t}</button>
                    ))}
                  </div>
                </div>

                {/* Tip unitate destinatara */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Destinatari — tip unitate</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {[
                      { val: 'Toate', label: 'Toate', color: '#94a3b8', bg: '#334155', count: '240' },
                      { val: 'Liceu', label: 'Licee', color: '#93c5fd', bg: '#1e3a5f', count: '~43' },
                      { val: 'Colegiu', label: 'Colegii', color: '#c4b5fd', bg: '#4c1d95', count: '~29' },
                      { val: 'Școală', label: 'Școli Gimn.', color: '#6ee7b7', bg: '#064e3b', count: '~108' },
                      { val: 'Grădiniță', label: 'Grădinițe', color: '#fde68a', bg: '#713f12', count: '~60' },
                    ].map(opt => {
                      const sel = uploadTipUnitate === opt.val
                      return (
                        <button key={opt.val} onClick={() => setUploadTipUnitate(opt.val)} style={{
                          background: sel ? opt.bg : '#0f172a',
                          border: `2px solid ${sel ? opt.color : '#334155'}`,
                          color: sel ? opt.color : '#64748b',
                          borderRadius: '10px', padding: '7px 14px', cursor: 'pointer', textAlign: 'center',
                        }}>
                          <div style={{ fontSize: '12px', fontWeight: 700 }}>{opt.label}</div>
                          <div style={{ fontSize: '10px', opacity: 0.75 }}>{opt.count} unități</div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px' }}>Titlu document</label>
                  <input
                    value={uploadTitle}
                    onChange={e => setUploadTitle(e.target.value)}
                    placeholder="ex: Circular nr. 1250/2026 — ..."
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px' }}>Conținut document (AI va indexa acest text)</label>
                  <textarea
                    value={uploadContent}
                    onChange={e => setUploadContent(e.target.value)}
                    placeholder="Introduceți sau lipiți conținutul documentului..."
                    rows={5}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#e2e8f0', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '12px', marginBottom: '20px', fontSize: '12px', color: '#64748b' }}>
                  <strong style={{ color: '#a78bfa' }}>🤖 AI automat:</strong> Documentul va fi indexat instant. Directorii pot întreba chatbot-ul despre conținut imediat după publicare.
                </div>
                {uploading ? (
                  <div style={{ textAlign: 'center', padding: '16px', color: '#3b82f6', fontSize: '14px' }}>
                    🤖 AI indexează documentul... notificând 240 directori...
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setShowUpload(false)} style={{ flex: 1, background: '#334155', color: '#94a3b8', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', cursor: 'pointer' }}>Anulează</button>
                    <button onClick={handleUpload} style={{ flex: 1, background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Publică & Notifică →</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
