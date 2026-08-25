'use client'
import { useState, useRef, useEffect } from 'react'

type Msg = { role: 'user' | 'assistant'; content: string }

type Props = {
  /** Context-ul paginii curente: 'general' | 'carduri' | 'credite' | 'conturi' | 'imm' */
  context: string
  /** Mesajul de deschidere, specific paginii */
  salut: string
  /** Întrebări rapide sugerate, specifice paginii */
  intrebari: string[]
}

const NAVY = '#0f2942'
const TEAL = '#1b7a72'
const TEAL_LIGHT = '#2ea89d'

/**
 * Widget de chat pentru demo-ul privat BT. Paletă navy/teal — deliberat diferită
 * de identitatea vizuală reală a Băncii Transilvania (nu clonăm brandul).
 * Cunoștințele despre produse stau în system prompt-ul rutei /api/bt-chat, nu aici.
 */
export default function BTChatbot({ context, salut, intrebari }: Props) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([{ role: 'assistant', content: salut }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setUnread(0)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
  }, [open, messages, loading])

  async function send(text?: string) {
    const content = (text ?? input).trim()
    if (!content || loading) return
    setInput('')
    const newMessages: Msg[] = [...messages, { role: 'user', content }]
    setMessages(newMessages)
    setLoading(true)
    try {
      const res = await fetch('/api/bt-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, context }),
      })
      const data = await res.json()
      const raspuns = data.text || 'Momentan nu pot răspunde. Reîncercați în câteva secunde.'
      setMessages(prev => [...prev, { role: 'assistant', content: raspuns }])
      if (!open) setUnread(u => u + 1)
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Eroare de conexiune. Reîncercați.' }])
    }
    setLoading(false)
  }

  return (
    <>
      {open && (
        <div
          style={{
            position: 'fixed', bottom: '90px', right: '12px', left: 'auto', zIndex: 9999,
            width: 'min(370px, calc(100vw - 24px))', height: 'min(560px, calc(100vh - 110px))',
            background: '#0a1a2a', border: `1px solid ${TEAL}55`, borderRadius: '16px',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
            fontFamily: "'Segoe UI', Arial, sans-serif",
          }}
        >
          <div style={{ background: NAVY, borderBottom: `1px solid ${TEAL}44`, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${TEAL_LIGHT}, ${TEAL})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800, color: '#04141a', flexShrink: 0 }}>A</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>Ana · Consultant Bancar AI</div>
              <div style={{ fontSize: '11px', color: TEAL_LIGHT }}>Demo conceptual · prototip neoficial</div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#fcd34d', marginTop: '2px' }}>🤖 Sunt un asistent AI — nu o persoană reală, nu un canal oficial BT</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}>×</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div
                  style={{
                    maxWidth: '85%',
                    background: m.role === 'user' ? `linear-gradient(135deg, ${TEAL_LIGHT}, ${TEAL})` : '#132a3d',
                    color: m.role === 'user' ? '#04141a' : '#e2e8f0',
                    fontWeight: m.role === 'user' ? 600 : 400,
                    border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.07)',
                    borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    padding: '10px 13px', fontSize: '13px', lineHeight: 1.6, whiteSpace: 'pre-wrap',
                  }}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: '#132a3d', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px 14px 14px 4px', padding: '10px 14px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: TEAL_LIGHT, display: 'inline-block', animation: `bt-bounce 1s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length <= 1 && (
            <div style={{ padding: '0 12px 10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {intrebari.map(q => (
                <button key={q} onClick={() => send(q)} style={{ background: `${TEAL}26`, border: `1px solid ${TEAL}66`, borderRadius: '20px', padding: '5px 12px', fontSize: '11px', color: TEAL_LIGHT, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          <div style={{ borderTop: `1px solid ${TEAL}33`, padding: '10px 12px', display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Scrieți întrebarea…"
              style={{ flex: 1, minWidth: 0, height: '40px', background: '#0a1a2a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0 12px', fontSize: '14px', color: '#e2e8f0', outline: 'none', fontFamily: 'inherit' }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              style={{ background: input.trim() && !loading ? `linear-gradient(135deg, ${TEAL_LIGHT}, ${TEAL})` : '#1e293b', color: '#04141a', border: 'none', borderRadius: '8px', width: '40px', height: '40px', flexShrink: 0, cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
            >
              ↑
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Vorbește cu Ana, asistentul AI"
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          height: '52px',
          borderRadius: open ? '50%' : '26px',
          width: open ? '52px' : 'auto',
          padding: open ? '0' : '0 20px 0 16px',
          background: `linear-gradient(135deg, ${TEAL_LIGHT}, ${TEAL})`,
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          boxShadow: `0 4px 24px ${TEAL}88`,
          animation: open ? 'none' : 'bt-pulse 2.5s ease-in-out infinite',
          transition: 'all 0.25s ease',
          whiteSpace: 'nowrap',
        }}
      >
        {open ? (
          <span style={{ fontSize: '22px', color: '#04141a' }}>×</span>
        ) : (
          <>
            <span style={{ fontSize: '18px', fontWeight: 800 }}>A</span>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#04141a', letterSpacing: '0.3px' }}>Vorbește cu Ana (AI)</span>
          </>
        )}
        {!open && unread > 0 && (
          <div style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {unread}
          </div>
        )}
      </button>

      <style>{`@keyframes bt-bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}} @keyframes bt-pulse{0%,100%{box-shadow:0 4px 24px ${TEAL}88}50%{box-shadow:0 4px 32px ${TEAL}cc,0 0 0 6px ${TEAL}26}}`}</style>
    </>
  )
}
