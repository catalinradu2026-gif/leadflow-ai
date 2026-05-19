'use client'
import { useState, useRef, useEffect } from 'react'

type Msg = { role: 'user' | 'assistant'; content: string }

const INTREBARI_RAPIDE = [
  'Ce documente trebuie pentru autorizare?',
  'Cât durează procesul de acreditare?',
  'Ce se întâmplă la vizita comisiei ARACIP?',
  'Ce este evaluarea externă periodică?',
]

function AcreditareChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Bună ziua! Sunt asistentul AI ARACIP. Vă pot ajuta cu informații despre autorizare, acreditare sau evaluarea periodică. Cu ce vă pot ajuta?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setUnread(0)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
  }, [open, messages])

  async function send(text?: string) {
    const content = text || input.trim()
    if (!content || loading) return
    setInput('')
    const newMessages: Msg[] = [...messages, { role: 'user', content }]
    setMessages(newMessages)
    setLoading(true)
    try {
      const res = await fetch('/api/acreditare-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }])
      if (!open) setUnread(u => u + 1)
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Eroare de conexiune. Încercați din nou.' }])
    }
    setLoading(false)
  }

  return (
    <>
      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '24px', zIndex: 1000,
          width: '360px', maxHeight: '520px',
          background: '#1e293b', border: '1px solid #334155', borderRadius: '16px',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          fontFamily: "'Segoe UI', Arial, sans-serif",
        }}>
          {/* Header */}
          <div style={{ background: '#0f172a', borderBottom: '1px solid #334155', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>🏛️</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>Asistent ARACIP</div>
              <div style={{ fontSize: '11px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                Online · Autorizare &amp; Acreditare
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}>×</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%',
                  background: m.role === 'user' ? '#7c3aed' : '#0f172a',
                  color: '#e2e8f0',
                  borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  padding: '10px 13px',
                  fontSize: '13px',
                  lineHeight: 1.6,
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: '#0f172a', borderRadius: '14px 14px 14px 4px', padding: '10px 14px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#475569', display: 'inline-block', animation: `bounce 1s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions */}
          {messages.length <= 1 && (
            <div style={{ padding: '0 12px 10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {INTREBARI_RAPIDE.map(q => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '20px', padding: '5px 12px', fontSize: '11px', color: '#a78bfa', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ borderTop: '1px solid #334155', padding: '10px 12px', display: 'flex', gap: '8px' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Scrieți întrebarea..."
              style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', color: '#e2e8f0', outline: 'none', fontFamily: 'inherit' }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              style={{ background: input.trim() && !loading ? '#7c3aed' : '#334155', color: '#fff', border: 'none', borderRadius: '8px', width: '36px', flexShrink: 0, cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', fontSize: '16px' }}
            >
              ↑
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #7c3aed, #14b8a6)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px',
          boxShadow: '0 4px 20px rgba(124,58,237,0.5)',
        }}
      >
        {open ? '×' : '🏛️'}
        {!open && unread > 0 && (
          <div style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {unread}
          </div>
        )}
      </button>

      <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
    </>
  )
}

export default function AcreditareLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AcreditareChatbot />
    </>
  )
}
