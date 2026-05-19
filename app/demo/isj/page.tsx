'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const SCOLI_DOLJ = [
  { name: 'Liceul Teoretic "Amărăștii de Jos"', loc: 'Amărăștii de Jos', director: 'Ion Marin', citit: true, activ: true },
  { name: 'Colegiul Național "Elena Cuza"', loc: 'Craiova', director: 'Maria Ionescu', citit: true, activ: true },
  { name: 'Liceul Teoretic "Henri Coandă"', loc: 'Craiova', director: 'Andrei Popescu', citit: true, activ: true },
  { name: 'Școala Gimnazială Nr. 12', loc: 'Craiova', director: 'Elena Dumitrescu', citit: false, activ: true },
  { name: 'Colegiul Tehnic "Costin D. Nenițescu"', loc: 'Craiova', director: 'Gheorghe Stan', citit: true, activ: true },
  { name: 'Liceul cu Program Sportiv', loc: 'Craiova', director: 'Florin Popa', citit: false, activ: false },
  { name: 'Grădinița Nr. 3', loc: 'Craiova', director: 'Ana Stoica', citit: true, activ: true },
  { name: 'Școala Gimnazială "Nicolae Titulescu"', loc: 'Băilești', director: 'Mihai Tudorache', citit: true, activ: true },
  { name: 'Liceul Teoretic "George Țărnea"', loc: 'Băilești', director: 'Rodica Nițu', citit: true, activ: true },
  { name: 'Școala Primară Segarcea', loc: 'Segarcea', director: 'Vasile Constantin', citit: false, activ: true },
  { name: 'Liceul Tehnologic Calafat', loc: 'Calafat', director: 'Cristina Barbu', citit: true, activ: true },
  { name: 'Grădinița Nr. 8 Craiova', loc: 'Craiova', director: 'Ioana Vlad', citit: true, activ: true },
]

const DOCUMENTE = [
  { id: 1, titlu: 'Circular nr. 1247/2026 — Raportare absențe mai 2026', data: '17 mai 2026', citite: 198, total: 240, tip: 'Circular' },
  { id: 2, titlu: 'Procedura nr. 892/2026 — Examene naționale 2026', data: '14 mai 2026', citite: 236, total: 240, tip: 'Procedură' },
  { id: 3, titlu: 'Adresa nr. 2103/2026 — Dotări informatice PNRR', data: '10 mai 2026', citite: 240, total: 240, tip: 'Adresă' },
  { id: 4, titlu: 'Circular nr. 1198/2026 — Situație statistică an școlar', data: '5 mai 2026', citite: 240, total: 240, tip: 'Circular' },
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

  async function handleUpload() {
    if (!uploadTitle.trim()) return
    setUploading(true)
    await new Promise(r => setTimeout(r, 1800))
    setDocs(prev => [{
      id: prev.length + 1,
      titlu: uploadTitle,
      data: '19 mai 2026',
      citite: 0,
      total: 240,
      tip: 'Circular',
    }, ...prev])
    setUploading(false)
    setUploadDone(true)
    setTimeout(() => { setShowUpload(false); setUploadDone(false); setUploadTitle(''); setUploadContent('') }, 2000)
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
              <div key={doc.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: 40, height: 40, background: '#1d4ed8', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>📄</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>{doc.titlu}</div>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{doc.data}</span>
                    <span style={{ background: '#1e40af', color: '#93c5fd', fontSize: '11px', fontWeight: 600, padding: '1px 8px', borderRadius: '20px' }}>{doc.tip}</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      AI indexat ✓
                    </span>
                  </div>
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
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0f172a' }}>
                  {['Unitate Școlară', 'Localitate', 'Director', 'Ultim doc citit', 'Status'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SCOLI_DOLJ.map((s, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>{s.name}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#94a3b8' }}>{s.loc}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#94a3b8' }}>{s.director}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                      {s.citit
                        ? <span style={{ color: '#22c55e' }}>✓ Da</span>
                        : <span style={{ color: '#ef4444' }}>✗ Nu</span>}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {s.activ
                        ? <span style={{ background: '#052e16', color: '#86efac', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>● Activ</span>
                        : <span style={{ background: '#7f1d1d', color: '#fca5a5', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>⚠ Inactiv 48h</span>}
                    </td>
                  </tr>
                ))}
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
