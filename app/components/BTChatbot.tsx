'use client'

import { useEffect, useRef, useState } from 'react'

type Message = { role: 'user' | 'assistant'; content: string }

type Props = {
  /** Context-ul paginii curente: 'general' | 'carduri' | 'credite' | 'conturi' | 'imm' */
  context: string
  /** Mesajul de bun venit — apare ca prim mesaj în chat ȘI ca text al bulei de preview */
  salut: string
  /** Titlul din antetul ferestrei de chat (implicit "Ana") */
  titlu?: string
  /** Subtitlul din antet — aici stă dezvăluirea AI Act, mereu vizibilă */
  subtitlu?: string
}

/**
 * Widget de chat pentru demo-ul privat BT — structură și comportament identice cu
 * components/ChatWidget.tsx din schobel-engineering-partners (buton fix, bulă de
 * preview la 4s, fereastră 380px/520px, typing indicator), fără sistemul de voce.
 * Paletă navy/teal — deliberat diferită de identitatea vizuală reală a Băncii
 * Transilvania. Cunoștințele despre produse stau în system prompt-ul rutei
 * /api/bt-chat, nu aici.
 */
export default function BTChatbot({ context, salut, titlu = 'Ana', subtitlu = 'Asistent AI · nu e o persoană reală' }: Props) {
  const [open, setOpen] = useState(false)
  const [bubble, setBubble] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: salut }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setBubble(true), 4000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    const next = [...messages, { role: 'user' as const, content: text }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/bt-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, context }),
      })
      if (!res.ok) throw new Error('chat request failed')
      const data = await res.json()
      const reply = data.text || 'Momentan nu pot răspunde. Reîncercați în câteva secunde.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Eroare de conexiune. Reîncercați.' }])
    } finally {
      setLoading(false)
    }
  }

  function toggleOpen() {
    setOpen(o => !o)
    setBubble(false)
  }

  return (
    <>
      {open && (
        <div
          className="fixed bottom-24 left-3 right-3 z-50 flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#0a1a2a] shadow-2xl md:bottom-28 md:left-auto md:right-6 md:w-[380px]"
          style={{ height: '520px', maxHeight: '72dvh', fontFamily: "'Segoe UI', Arial, sans-serif" }}
        >
          <div className="flex items-center gap-3 border-b border-white/10 bg-[#0f2942] px-4 py-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#2ea89d] font-mono text-xs font-bold text-[#04141a]">
              {titlu.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold uppercase tracking-widest text-[#f1f5f9]">
                {titlu}
              </p>
              <p className="truncate text-xs text-[#fcd34d]">{subtitlu}</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="shrink-0 rounded-md px-2 py-1 text-lg leading-none text-[#94a3b8] transition-colors hover:text-[#f1f5f9]"
              aria-label="Închide"
            >
              ×
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={[
                    'max-w-[85%] whitespace-pre-wrap rounded-lg px-3.5 py-2.5 text-sm leading-relaxed',
                    m.role === 'user'
                      ? 'bg-[#2ea89d] text-[#04141a] font-medium'
                      : 'bg-[#0f2942] text-[#e2e8f0] border border-white/10',
                  ].join(' ')}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-1.5 rounded-lg border border-white/10 bg-[#0f2942] px-4 py-3">
                  {[0, 150, 300].map(delay => (
                    <span
                      key={delay}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#2ea89d]"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="flex gap-2 border-t border-white/10 p-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Scrieți întrebarea…"
              className="flex-1 rounded-md border border-white/10 bg-[#0f2942] px-3 py-2.5 text-sm text-[#e2e8f0] outline-none transition-colors focus:border-[#2ea89d]"
              style={{ fontSize: '16px' }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#2ea89d] text-[#04141a] transition-all hover:bg-[#26958c] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Trimite"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {bubble && !open && (
        <div
          className="fixed bottom-24 right-4 z-50 max-w-[240px] cursor-pointer rounded-lg rounded-br-sm border border-white/10 bg-[#0a1a2a] px-4 py-3 shadow-xl md:bottom-28"
          onClick={toggleOpen}
        >
          <button
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs text-[#94a3b8] hover:text-[#f1f5f9]"
            onClick={e => {
              e.stopPropagation()
              setBubble(false)
            }}
            aria-label="Închide"
          >
            ×
          </button>
          <p className="text-sm leading-relaxed text-[#e2e8f0]">{salut}</p>
        </div>
      )}

      <button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#2ea89d] text-[#04141a] shadow-lg transition-transform hover:scale-105"
        aria-label="Vorbește cu Ana, asistentul AI"
      >
        {open ? (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>
    </>
  )
}
