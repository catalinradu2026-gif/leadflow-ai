'use client'

import { useEffect, useRef, useState } from 'react'
import { speak, stopSpeaking } from '../edu/tts'
import { LIMBI_DISPONIBILE, citesteLimbaManuala, scrieLimbaManuala, determinaLimba, peLimbaManualaSchimbata } from '../../lib/btLimba'

type Message = { role: 'user' | 'assistant'; content: string }

type Props = {
  /** Context-ul paginii curente: 'general' | 'carduri' | 'credite' | 'conturi' | 'imm' */
  context: string
  /** Mesajul de bun venit — apare ca prim mesaj în chat ȘI ca text al bulei de preview */
  salut: string
  /** Titlul din antetul ferestrei de chat (implicit "Nora") */
  titlu?: string
  /** Subtitlul din antet — aici stă dezvăluirea AI Act, mereu vizibilă */
  subtitlu?: string
}

/**
 * Widget de chat pentru demo-ul privat BT — structură și comportament identice cu
 * components/ChatWidget.tsx din schobel-engineering-partners (buton fix, bulă de
 * preview la 4s, fereastră 380px/520px, typing indicator, voce activă implicit).
 * Vocea folosește app/edu/tts.ts (Web Speech API nativ, deja tunat pentru română,
 * folosit și de Ava) — echivalentul local al lib/speech.ts din Schobel.
 * Input vocal (microfon) — SpeechRecognition nativ din browser, ro-RO, același
 * pattern ca la components/AraChatbot.tsx.
 * Paletă navy/teal — deliberat diferită de identitatea vizuală reală a Băncii
 * Transilvania. Cunoștințele despre produse stau în system prompt-ul rutei
 * /api/bt-chat, nu aici.
 */
export default function BTChatbot({ context, salut, titlu = 'Nora', subtitlu = 'Asistent AI · nu e o persoană reală' }: Props) {
  const [open, setOpen] = useState(false)
  const [bubble, setBubble] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: salut }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [voiceOn, setVoiceOn] = useState(true)
  const [listening, setListening] = useState(false)
  const [lang, setLang] = useState('română')
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const recognitionRef = useRef<any>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  // Id opac generat o singură dată per montare a widgetului (o "sesiune" de chat) — NU e
  // date personale, doar leagă mesajele aceleiași conversații pentru Agent Assist Live din
  // admin (consultantul vede transcriptul complet, nu doar mesajul cu telefonul).
  const conversationIdRef = useRef<string>(
    typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `bt-${Date.now()}-${Math.random().toString(36).slice(2)}`
  )

  useEffect(() => {
    const t = setTimeout(() => setBubble(true), 4000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    determinaLimba().then(setLang)
    return peLimbaManualaSchimbata(() => determinaLimba().then(setLang))
  }, [])

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  // Accesibilitate: Esc închide fereastra de chat (echivalentul tastaturii pentru
  // butonul ×), util pentru utilizatorii care navighează doar cu tastatura.
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { stopSpeaking(); setOpen(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Focus mutat automat pe input la deschidere — util pentru utilizatorii de
  // tastatură/screen-reader, care altfel ar rămâne cu focusul pe butonul de trigger.
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  async function send(overrideText?: string) {
    const text = (overrideText ?? input).trim()
    if (!text || loading) return
    const next = [...messages, { role: 'user' as const, content: text }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/bt-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, context, lang, conversationId: conversationIdRef.current }),
      })
      if (!res.ok) throw new Error('chat request failed')
      const data = await res.json()
      const reply = data.text || 'Momentan nu pot răspunde. Reîncercați în câteva secunde.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
      if (voiceOn) speak(reply)
    } catch {
      const errMsg = 'Eroare de conexiune. Reîncercați.'
      setMessages(prev => [...prev, { role: 'assistant', content: errMsg }])
      if (voiceOn) speak(errMsg)
    } finally {
      setLoading(false)
    }
  }

  function toggleOpen() {
    setOpen(o => {
      const next = !o
      if (!next) stopSpeaking()
      else if (voiceOn && messages.length === 1) speak(messages[0].content)
      return next
    })
    setBubble(false)
  }

  function toggleVoice() {
    setVoiceOn(v => {
      if (v) stopSpeaking()
      return !v
    })
  }

  // Input vocal — Web Speech API nativ din browser (gratuit, fără serviciu extern),
  // același pattern ca la AraChatbot.tsx: ascultă în română, pune transcrierea în
  // input pe măsură ce vorbește, și trimite automat mesajul la rezultatul final.
  function startListening() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      alert('Microfonul nu este suportat în acest browser. Folosiți Chrome sau Edge pe desktop, sau Safari/Chrome pe mobil.')
      return
    }
    if (listening) { recognitionRef.current?.stop(); setListening(false); return }
    stopSpeaking()
    const rec = new SR()
    rec.lang = 'ro-RO'
    rec.continuous = false
    rec.interimResults = true
    rec.onstart = () => setListening(true)
    rec.onresult = (e: any) => {
      const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join('')
      setInput(transcript)
      if (e.results[e.results.length - 1].isFinal) {
        rec.stop()
        send(transcript)
      }
    }
    rec.onerror = () => setListening(false)
    rec.onend = () => setListening(false)
    recognitionRef.current = rec
    rec.start()
  }

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Chat cu ${titlu}, asistent AI`}
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
            <div className="relative shrink-0">
              <button
                onClick={() => setLangMenuOpen(v => !v)}
                className="rounded-md px-2 py-1 text-xs font-semibold text-[#94a3b8] transition-colors hover:text-[#f1f5f9]"
                title="Schimbă limba"
                aria-label="Schimbă limba"
              >
                {LIMBI_DISPONIBILE.find(o => o.nume === lang)?.eticheta.split(' ')[0] || '🌍'} ▾
              </button>
              {langMenuOpen && (
                <>
                  <div className="fixed inset-0 z-[60]" onClick={() => setLangMenuOpen(false)} />
                  <div className="absolute right-0 top-full z-[70] mt-1.5 max-h-72 w-48 overflow-y-auto rounded-xl border border-white/15 bg-[#0a1a2a] p-1.5 shadow-2xl">
                    <button
                      onClick={() => { scrieLimbaManuala(null); setLangMenuOpen(false) }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-[#94a3b8] hover:bg-white/10"
                    >
                      🌍 Automat (după locație)
                    </button>
                    {LIMBI_DISPONIBILE.map(o => (
                      <button
                        key={o.nume}
                        onClick={() => { scrieLimbaManuala(o.nume); setLangMenuOpen(false) }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-[#e2e8f0] hover:bg-white/10"
                        style={o.nume === lang && citesteLimbaManuala() ? { color: '#2ea89d' } : undefined}
                      >
                        {o.eticheta}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button
              onClick={toggleVoice}
              className="shrink-0 rounded-md px-2 py-1 text-base leading-none text-[#94a3b8] transition-colors hover:text-[#f1f5f9]"
              aria-label={voiceOn ? 'Oprește vocea' : 'Pornește vocea'}
              title={voiceOn ? 'Oprește vocea' : 'Pornește vocea'}
            >
              {voiceOn ? '🔊' : '🔇'}
            </button>
            <button
              onClick={() => {
                stopSpeaking()
                setOpen(false)
              }}
              className="shrink-0 rounded-md px-2 py-1 text-lg leading-none text-[#94a3b8] transition-colors hover:text-[#f1f5f9]"
              aria-label="Închide"
            >
              ×
            </button>
          </div>

          <div
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            aria-label="Conversație cu Nora"
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
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
                  <span className="sr-only">{m.role === 'user' ? 'Dvs.: ' : 'Nora: '}</span>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start" aria-live="polite">
                <span className="sr-only">Nora scrie…</span>
                <div className="flex gap-1.5 rounded-lg border border-white/10 bg-[#0f2942] px-4 py-3" aria-hidden="true">
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

          <div className="border-t border-white/10 p-3">
            <div className="flex gap-2">
              <label htmlFor="bt-chat-input" className="sr-only">Scrieți un mesaj pentru Nora</label>
              <input
                id="bt-chat-input"
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder={listening ? '🎙️ Ascult…' : 'Scrieți mesajul, apoi Enter sau ➤…'}
                aria-label="Scrieți un mesaj pentru Nora"
                className={`flex-1 rounded-md border px-3 py-2.5 text-sm text-[#e2e8f0] transition-colors focus:border-[#2ea89d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#2ea89d] ${listening ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-[#0f2942]'}`}
                style={{ fontSize: '16px' }}
              />
              <button
                onClick={startListening}
                title={listening ? 'Oprește microfonul' : 'Vorbește cu Nora'}
                aria-label={listening ? 'Oprește microfonul' : 'Vorbește cu Nora'}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md border text-lg transition-all ${listening ? 'border-red-500 bg-red-500/25 animate-pulse' : 'border-[#2ea89d] bg-[#2ea89d]/20'}`}
              >
                🎙️
              </button>
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                title="Trimite mesajul (Enter)"
                aria-label="Trimite mesajul"
                className={`flex h-11 min-w-[44px] shrink-0 items-center justify-center gap-1.5 rounded-md bg-[#2ea89d] px-3 text-[#04141a] transition-all hover:scale-105 hover:bg-[#26958c] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 ${input.trim() && !loading ? 'shadow-[0_0_0_3px_rgba(46,168,157,0.25)]' : ''}`}
              >
                <span className="hidden text-sm font-bold sm:inline">Trimite</span>
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </button>
            </div>
            <p className="mt-1.5 px-0.5 text-[11px] text-[#64748b]">
              Apăsați <kbd className="rounded border border-white/15 bg-white/5 px-1 py-0.5 font-mono text-[10px] text-[#94a3b8]">Enter</kbd> sau butonul <span className="font-semibold text-[#2ea89d]">Trimite</span> pentru a trimite mesajul.
            </p>
          </div>
        </div>
      )}

      {bubble && !open && (
        <div className="fixed bottom-24 right-4 z-50 max-w-[240px] rounded-lg rounded-br-sm border border-white/10 bg-[#0a1a2a] px-4 py-3 shadow-xl md:bottom-28">
          <button
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs text-[#94a3b8] hover:text-[#f1f5f9]"
            onClick={e => {
              e.stopPropagation()
              setBubble(false)
            }}
            aria-label="Închide mesajul"
          >
            ×
          </button>
          <button
            onClick={toggleOpen}
            className="block w-full cursor-pointer bg-transparent p-0 text-left"
            aria-label={`Deschide chat cu Nora: ${salut}`}
          >
            <p className="text-sm leading-relaxed text-[#e2e8f0]">{salut}</p>
          </button>
        </div>
      )}

      <button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#2ea89d] text-[#04141a] shadow-lg transition-transform hover:scale-105"
        aria-label="Vorbește cu Nora, asistentul AI"
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
