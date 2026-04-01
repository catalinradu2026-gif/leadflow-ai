'use client'
import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const WELCOME = '👋 Bună! Sunt asistentul AI al firmei AI Craiova.\n\nTe pot ajuta cu informații despre servicii, prețuri sau orice întrebare ai despre automatizări AI. Cu ce te pot ajuta?'

const QUICK_REPLIES = [
  'Ce servicii oferiți?',
  'Care sunt prețurile?',
  'Cât durează implementarea?',
  'Vreau o ofertă',
]

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [bubble, setBubble] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: WELCOME }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showQuick, setShowQuick] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Deschide automat dupa 7 secunde
  useEffect(() => {
    const t = setTimeout(() => {
      if (!open) { setOpen(true); setBubble(false) }
    }, 7000)
    return () => clearTimeout(t)
  }, [])

  // Bubble dupa 2 secunde daca nu e deschis
  useEffect(() => {
    const t = setTimeout(() => {
      if (!open) setBubble(true)
    }, 2000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (open) {
      setBubble(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, open])

  async function send(text?: string) {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setShowQuick(false)
    const userMsg: Message = { role: 'user', content: msg }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.text || 'A apărut o eroare. Scrie-ne pe WhatsApp: 0787 813 485' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Eroare de conexiune. Scrie-ne pe WhatsApp la 0787 813 485!' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Fereastra chat */}
      {open && (
        <div className="fixed top-20 left-3 right-3 md:top-20 md:left-6 md:right-auto z-50 md:w-[350px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          style={{ height: '500px', maxHeight: '75dvh' }}>

          {/* Header */}
          <div className="px-4 py-3 flex items-center gap-3 shrink-0" style={{ background: 'linear-gradient(135deg, #1a0533 0%, #0a0a2e 100%)' }}>
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white font-bold text-sm shrink-0">AI</div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">AI Craiova</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <p className="text-white/55 text-xs">Asistent virtual · online</p>
              </div>
            </div>
            <a href="https://wa.me/40787813485" target="_blank" rel="noopener noreferrer"
              className="text-white/40 hover:text-green-400 transition-colors mr-2" title="WhatsApp">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
            <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white transition text-xl leading-none">×</button>
          </div>

          {/* Mesaje */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'text-white rounded-br-sm'
                    : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
                }`}
                style={m.role === 'user' ? { background: 'linear-gradient(135deg, #4c1d95 0%, #1e3a8a 100%)' } : {}}>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {/* Quick replies */}
            {showQuick && messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_REPLIES.map(q => (
                  <button key={q} onClick={() => send(q)}
                    className="px-3 py-1.5 border border-purple-200 text-purple-700 text-xs bg-white hover:bg-purple-50 transition-colors rounded-full shadow-sm">
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-3 flex gap-2 bg-white shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Scrie un mesaj..."
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400"
              style={{ fontSize: '16px' }}
            />
            <button onClick={() => send()} disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition disabled:opacity-40 shrink-0 text-white"
              style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #1e3a8a 100%)' }}>
              <svg className="w-4 h-4 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Bubble notificare */}
      {bubble && !open && (
        <div className="fixed top-20 left-20 z-50 bg-white rounded-2xl rounded-bl-sm shadow-xl border border-gray-100 px-4 py-3 max-w-[220px] cursor-pointer"
          onClick={() => { setOpen(true); setBubble(false) }}>
          <button className="absolute -top-2 -right-2 bg-gray-200 rounded-full w-5 h-5 text-xs flex items-center justify-center text-gray-500 hover:bg-gray-300"
            onClick={e => { e.stopPropagation(); setBubble(false) }}>×</button>
          <p className="text-sm text-gray-800">👋 Bună! Cum te pot ajuta cu automatizările AI? 🤖</p>
        </div>
      )}

      {/* Buton toggle */}
      <button
        onClick={() => { setOpen(o => !o); setBubble(false) }}
        className="fixed top-4 left-4 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 text-white"
        style={{ background: 'linear-gradient(135deg, #1a0533 0%, #0a0a2e 100%)' }}
        aria-label="Deschide chat"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        )}
      </button>
    </>
  )
}
