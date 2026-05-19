'use client'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

const NOTIFICARI = [
  { id: 1, titlu: 'Circular nr. 1247/2026 — Raportare absențe mai 2026', data: '17 mai 2026', citit: false, urgent: true, tip: 'Circular' },
  { id: 2, titlu: 'Procedura nr. 892/2026 — Examene naționale 2026', data: '14 mai 2026', citit: true, urgent: false, tip: 'Procedură' },
  { id: 3, titlu: 'Adresa nr. 2103/2026 — Dotări informatice PNRR', data: '10 mai 2026', citit: true, urgent: false, tip: 'Adresă' },
  { id: 4, titlu: 'Circular nr. 1198/2026 — Situație statistică an școlar', data: '5 mai 2026', citit: true, urgent: false, tip: 'Circular' },
]

type Msg = { role: 'user' | 'assistant'; content: string }

export default function DirectorPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'notificari' | 'bot' | 'chat'>('notificari')
  const [notificari, setNotificari] = useState(NOTIFICARI)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<{ role: string; text: string }[]>([])
  const [chatInput, setChatInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const unread = notificari.filter(n => !n.citit).length

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function markRead(id: number) {
    setNotificari(prev => prev.map(n => n.id === id ? { ...n, citit: true } : n))
  }

  async function sendBot() {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    const newMessages: Msg[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)
    try {
      const res = await fetch('/api/demo-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.text || 'Eroare. Contactați ISJ.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Eroare de conexiune. Contactați ISJ la 0251 411 522.' }])
    }
    setLoading(false)
  }

  function sendChat() {
    if (!chatInput.trim()) return
    const msg = chatInput
    setChatInput('')
    setChatHistory(h => [...h, { role: 'director', text: msg }])
    setTimeout(() => {
      setChatHistory(h => [...h, { role: 'isj', text: 'Mesaj primit. Vă vom răspunde în cel mai scurt timp. — ISJ Dolj' }])
    }, 1000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>

      {/* Topbar */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => router.push('/demo')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Demo</button>
          <div style={{ width: 1, height: 20, background: '#334155' }} />
          <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>🏫 Liceul Teoretic Amărăștii de Jos</span>
          <span style={{ background: '#064e3b', color: '#6ee7b7', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>DIRECTOR</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Director: <strong style={{ color: '#e2e8f0' }}>Ion Marin</strong></span>
          {unread > 0 && (
            <span style={{ background: '#dc2626', color: '#fff', fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>
              🔔 {unread} nou{unread > 1 ? 'ă' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '20px 24px 0', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '4px', background: '#1e293b', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
          {[
            { key: 'notificari', label: `🔔 Notificări ISJ${unread > 0 ? ` (${unread})` : ''}` },
            { key: 'bot', label: '🤖 Asistent AI' },
            { key: 'chat', label: '💬 Chat cu ISJ' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as 'notificari' | 'bot' | 'chat')}
              style={{
                background: tab === t.key ? '#059669' : 'none',
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

      <div style={{ padding: '16px 24px 24px', maxWidth: '900px', margin: '0 auto' }}>

        {/* NOTIFICARI */}
        {tab === 'notificari' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notificari.map(n => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                style={{
                  background: '#1e293b',
                  border: `1px solid ${!n.citit ? '#f59e0b' : '#334155'}`,
                  borderRadius: '10px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 44, height: 44, background: !n.citit ? '#92400e' : '#1e293b', border: `1px solid ${!n.citit ? '#f59e0b' : '#334155'}`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>📄</div>
                  {!n.citit && (
                    <div style={{ position: 'absolute', top: -4, right: -4, width: 12, height: 12, background: '#ef4444', borderRadius: '50%', border: '2px solid #0f172a' }} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    {!n.citit && <span style={{ background: '#92400e', color: '#fcd34d', fontSize: '10px', fontWeight: 700, padding: '1px 8px', borderRadius: '20px' }}>NOU</span>}
                    {n.urgent && !n.citit && <span style={{ background: '#7f1d1d', color: '#fca5a5', fontSize: '10px', fontWeight: 700, padding: '1px 8px', borderRadius: '20px' }}>URGENT</span>}
                    <span style={{ background: '#1e40af', color: '#93c5fd', fontSize: '10px', fontWeight: 600, padding: '1px 8px', borderRadius: '20px' }}>{n.tip}</span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: !n.citit ? 700 : 500, color: !n.citit ? '#f1f5f9' : '#94a3b8' }}>{n.titlu}</div>
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>ISJ Dolj · {n.data}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {n.citit
                    ? <span style={{ fontSize: '12px', color: '#22c55e' }}>✓ Citit</span>
                    : <span style={{ fontSize: '13px', fontWeight: 600, color: '#f59e0b' }}>Apasă pentru citire →</span>
                  }
                </div>
              </div>
            ))}

            {notificari.every(n => n.citit) && (
              <div style={{ textAlign: 'center', padding: '32px', color: '#22c55e', fontSize: '14px' }}>
                ✅ Toate documentele au fost citite!
              </div>
            )}
          </div>
        )}

        {/* CHATBOT AI */}
        {tab === 'bot' && (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🤖</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>Asistent AI ISJ Dolj</div>
                <div style={{ fontSize: '12px', color: '#22c55e' }}>● Online · Cunoaște toate documentele ISJ Dolj</div>
              </div>
            </div>

            <div style={{ height: '360px', overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>🤖</div>
                  <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>Bună ziua! Sunt asistentul AI al ISJ Dolj.<br />Puteți întreba orice despre documentele oficiale.</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                    {[
                      'Când trebuie depus raportul de absențe?',
                      'Ce comisii trebuie formate pentru Bacalaureat?',
                      'Care sunt școlile cu dotări PNRR?',
                    ].map(q => (
                      <button
                        key={q}
                        onClick={() => { setInput(q) }}
                        style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', color: '#94a3b8', cursor: 'pointer' }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '8px', alignItems: 'flex-end' }}>
                  {m.role === 'assistant' && (
                    <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>🤖</div>
                  )}
                  <div style={{
                    maxWidth: '75%',
                    background: m.role === 'user' ? '#059669' : '#0f172a',
                    border: m.role === 'assistant' ? '1px solid #334155' : 'none',
                    borderRadius: m.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    color: '#f1f5f9',
                    lineHeight: 1.6,
                  }}>
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                  <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🤖</div>
                  <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px 12px 12px 4px', padding: '10px 14px' }}>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>Caut în documentele ISJ...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '12px', borderTop: '1px solid #334155', display: 'flex', gap: '8px' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendBot()}
                placeholder="Întrebați despre orice document ISJ..."
                style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#e2e8f0', outline: 'none' }}
              />
              <button
                onClick={sendBot}
                disabled={loading}
                style={{ background: loading ? '#334155' : '#059669', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? '...' : 'Întreabă'}
              </button>
            </div>
          </div>
        )}

        {/* CHAT CU ISJ */}
        {tab === 'chat' && (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 36, height: 36, background: '#1d4ed8', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🏛️</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>ISJ Dolj — Canal Oficial</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Comunicare directă cu inspectoratul</div>
              </div>
            </div>

            <div style={{ height: '360px', overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ textAlign: 'center', padding: '16px' }}>
                <span style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '20px', padding: '4px 14px', fontSize: '11px', color: '#64748b' }}>Astăzi · 19 mai 2026</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ maxWidth: '70%', background: '#0f172a', border: '1px solid #334155', borderRadius: '12px 12px 12px 4px', padding: '10px 14px', fontSize: '13px', color: '#f1f5f9', lineHeight: 1.6 }}>
                  <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>ISJ Dolj · 08:15</div>
                  Vă reamintim că termenul pentru raportul de absențe (Circular 1247/2026) este <strong>25 mai 2026</strong>. Vă rugăm să transmiteți formularul completat prin platformă.
                </div>
              </div>
              {chatHistory.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'director' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '70%',
                    background: m.role === 'director' ? '#059669' : '#0f172a',
                    border: m.role === 'isj' ? '1px solid #334155' : 'none',
                    borderRadius: m.role === 'director' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    color: '#f1f5f9',
                    lineHeight: 1.6,
                  }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{m.role === 'director' ? 'Director Marin · acum' : 'ISJ Dolj · acum'}</div>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '12px', borderTop: '1px solid #334155', display: 'flex', gap: '8px' }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChat()}
                placeholder="Scrieți un mesaj către ISJ Dolj..."
                style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#e2e8f0', outline: 'none' }}
              />
              <button onClick={sendChat} style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Trimite</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
