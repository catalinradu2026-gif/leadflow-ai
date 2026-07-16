'use client'
import { useState, useRef, useEffect } from 'react'
import { speak } from '../edu/tts'
import { useLang } from '../LangContext'
import { t } from '../translations'

type Msg = { role: 'user' | 'assistant'; content: string }

export default function NidoChatbot() {
  const { lang } = useLang()
  const tr = t[lang].nido

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([{ role: 'assistant', content: tr.chatWelcome }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(0)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Resetează mesajul de întâmpinare când se schimbă limba (doar dacă userul nu a scris încă)
  useEffect(() => {
    setMessages(prev => (prev.length <= 1 ? [{ role: 'assistant', content: tr.chatWelcome }] : prev))
  }, [tr.chatWelcome])

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
      const res = await fetch('/api/nido-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, lang }),
      })
      const data = await res.json()
      const text = data.text || ''
      setMessages(prev => [...prev, { role: 'assistant', content: text }])
      if (voiceEnabled && text) { try { speak(text) } catch {} }
      if (!open) setUnread(u => u + 1)
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: tr.chatError },
      ])
    }
    setLoading(false)
  }

  return (
    <>
      {open && (
        <div
          style={{
            position: 'fixed', bottom: '90px', right: '12px', left: 'auto', zIndex: 9999,
            width: 'min(360px, calc(100vw - 24px))', height: 'min(560px, calc(100vh - 110px))',
            background: '#0a1a2b', border: '1px solid rgba(34,211,238,0.25)', borderRadius: '16px',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
            fontFamily: "'Segoe UI', Arial, sans-serif",
          }}
        >
          {/* Header */}
          <div style={{ background: '#04111f', borderBottom: '1px solid rgba(34,211,238,0.2)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #22d3ee, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>🐣</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>{tr.chatTitle}</div>
              <div style={{ fontSize: '11px', color: '#67e8f9' }}>{tr.headerTagline}</div>
            </div>
            <button
              onClick={() => { setVoiceEnabled(v => { if (v) { try { window.speechSynthesis?.cancel() } catch {} } return !v }) }}
              title={voiceEnabled ? 'Oprește vocea' : 'Pornește vocea'}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', color: voiceEnabled ? '#67e8f9' : '#64748b', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}
            >{voiceEnabled ? '🔊' : '🔇'}</button>
            <button onClick={() => { try { window.speechSynthesis?.cancel() } catch {}; setOpen(false) }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}>×</button>
          </div>

          {/* Mesaje */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div
                  style={{
                    maxWidth: '85%',
                    background: m.role === 'user' ? 'linear-gradient(135deg, #22d3ee, #3b82f6)' : '#04111f',
                    color: m.role === 'user' ? '#04263b' : '#e2e8f0',
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
                <div style={{ background: '#04111f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px 14px 14px 4px', padding: '10px 14px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#22d3ee', display: 'inline-block', animation: `nido-bounce 1s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Intrebari rapide */}
          {messages.length <= 1 && (
            <div style={{ padding: '0 12px 10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {tr.chatQuick.map(q => (
                <button key={q} onClick={() => send(q)} style={{ background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: '20px', padding: '5px 12px', fontSize: '11px', color: '#67e8f9', cursor: 'pointer', fontFamily: 'inherit' }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ borderTop: '1px solid rgba(34,211,238,0.2)', padding: '10px 12px', display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder={tr.chatPlaceholder}
              autoFocus
              style={{ flex: 1, minWidth: 0, height: '40px', background: '#04111f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0 12px', fontSize: '14px', color: '#e2e8f0', outline: 'none', fontFamily: 'inherit' }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              title="Trimite mesaj"
              style={{ background: input.trim() && !loading ? 'linear-gradient(135deg, #22d3ee, #3b82f6)' : '#1e3a52', color: '#04263b', border: 'none', borderRadius: '8px', width: '40px', height: '40px', flexShrink: 0, cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
            >
              ↑
            </button>
          </div>
        </div>
      )}

      {/* Buton flotant */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Vorbește cu Ava, asistenta Nido"
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          height: '52px',
          borderRadius: open ? '50%' : '26px',
          width: open ? '52px' : 'auto',
          padding: open ? '0' : '0 20px 0 16px',
          background: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          boxShadow: '0 4px 24px rgba(34,211,238,0.55)',
          animation: open ? 'none' : 'nido-pulse 2.5s ease-in-out infinite',
          transition: 'all 0.25s ease',
          whiteSpace: 'nowrap',
        }}
      >
        {open ? (
          <span style={{ fontSize: '22px', color: '#04263b' }}>×</span>
        ) : (
          <>
            <span style={{ fontSize: '22px' }}>🐣</span>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#04263b', letterSpacing: '0.3px' }}>{tr.chatButton}</span>
          </>
        )}
        {!open && unread > 0 && (
          <div style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {unread}
          </div>
        )}
      </button>

      <style>{`@keyframes nido-bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}} @keyframes nido-pulse{0%,100%{box-shadow:0 4px 24px rgba(34,211,238,0.55)}50%{box-shadow:0 4px 32px rgba(34,211,238,0.9),0 0 0 6px rgba(34,211,238,0.15)}}`}</style>
    </>
  )
}
