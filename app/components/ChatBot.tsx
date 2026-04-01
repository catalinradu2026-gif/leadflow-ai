'use client'
import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const WELCOME = 'Bună! Sunt asistentul AI al firmei AI Craiova. Apasă butonul de mai jos și vorbește cu mine!'

const QUICK_REPLIES = [
  'Ce servicii oferiți?',
  'Care sunt prețurile?',
  'Cât durează implementarea?',
  'Vreau o ofertă',
]

function speak(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  // Curata emojis si caractere speciale
  const clean = text.replace(/[\u{1F300}-\u{1FFFF}]/gu, '').replace(/[*_~`]/g, '').trim()
  const utt = new SpeechSynthesisUtterance(clean)
  utt.lang = 'ro-RO'
  utt.rate = 1.05
  utt.pitch = 1
  utt.volume = 1
  // Incearca voce romaneasca, altfel prima disponibila
  const voices = window.speechSynthesis.getVoices()
  const roVoice = voices.find(v => v.lang.startsWith('ro')) || voices.find(v => v.lang.startsWith('en')) || voices[0]
  if (roVoice) utt.voice = roVoice
  window.speechSynthesis.speak(utt)
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [bubble, setBubble] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: WELCOME }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showQuick, setShowQuick] = useState(true)
  const [voiceOn, setVoiceOn] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const [listening, setListening] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const t = setTimeout(() => {
      if (!open) { setOpen(true); setBubble(false) }
    }, 7000)
    return () => clearTimeout(t)
  }, [])

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

  function speakText(text: string) {
    if (!voiceOn) return
    setSpeaking(true)
    const trySpeak = () => {
      speak(text)
      const interval = setInterval(() => {
        if (!window.speechSynthesis.speaking) { setSpeaking(false); clearInterval(interval) }
      }, 200)
      setTimeout(() => { setSpeaking(false); clearInterval(interval) }, 15000)
    }
    if (window.speechSynthesis.getVoices().length > 0) {
      trySpeak()
    } else {
      window.speechSynthesis.onvoiceschanged = () => { trySpeak(); window.speechSynthesis.onvoiceschanged = null }
    }
  }

  // Cand userul interactioneaza prima data → citeste bun venit
  function handleFirstInteraction() {
    if (!userInteracted) {
      setUserInteracted(true)
      speakText(WELCOME)
    }
  }

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, open])

  // Opreste vocea cand se inchide chat-ul
  useEffect(() => {
    if (!open && typeof window !== 'undefined') window.speechSynthesis?.cancel()
  }, [open])

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
      const reply = data.text || 'A apărut o eroare. Scrie-ne pe WhatsApp: 0787 813 485'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
      speakText(reply)
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Eroare de conexiune. Scrie-ne pe WhatsApp la 0787 813 485!' }])
    } finally {
      setLoading(false)
    }
  }

  function toggleVoice() {
    if (voiceOn) window.speechSynthesis?.cancel()
    setVoiceOn(v => !v)
    setSpeaking(false)
  }

  function toggleMic() {
    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setMessages(prev => [...prev, { role: 'assistant', content: '🎤 Microfonul funcționează doar în Chrome. Te rog deschide aicraiova.ro în Chrome pe telefon.' }])
      return
    }
    const rec = new SpeechRecognition()
    rec.lang = 'ro-RO'
    rec.continuous = false
    rec.interimResults = false
    rec.onstart = () => setListening(true)
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript
      setListening(false)
      send(transcript)
    }
    rec.onerror = (e: any) => {
      setListening(false)
      if (e.error === 'not-allowed') {
        setMessages(prev => [...prev, { role: 'assistant', content: '🎤 Accesul la microfon a fost blocat. În Chrome, apasă pe 🔒 din bara de adresă → Microfon → Permite.' }])
      } else if (e.error === 'no-speech') {
        setMessages(prev => [...prev, { role: 'assistant', content: '🎤 Nu am auzit nimic. Încearcă din nou.' }])
      }
    }
    rec.onend = () => setListening(false)
    recognitionRef.current = rec
    rec.start()
  }

  return (
    <>
      {/* Fereastra chat */}
      {open && (
        <div className="fixed bottom-24 left-4 z-50 w-[320px] max-w-[calc(100vw-32px)] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
          style={{ height: '440px', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 shrink-0" style={{ background: 'linear-gradient(135deg, #6d28d9 0%, #2563eb 100%)' }}>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-sm shrink-0">AI</div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm leading-tight">AI Craiova</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {speaking ? (
                  <>
                    <span className="flex gap-0.5">
                      <span className="w-0.5 h-3 bg-emerald-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-0.5 h-3 bg-emerald-300 rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
                      <span className="w-0.5 h-3 bg-emerald-300 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                    </span>
                    <p className="text-emerald-300 text-xs">Vorbesc...</p>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
                    <p className="text-white/65 text-xs">Online acum</p>
                  </>
                )}
              </div>
            </div>

            {/* Buton voce */}
            <button onClick={toggleVoice} title={voiceOn ? 'Oprește vocea' : 'Pornește vocea'}
              className={`p-1.5 rounded-full transition-colors ${voiceOn ? 'text-white hover:bg-white/15' : 'text-white/30 hover:bg-white/10'}`}>
              {voiceOn ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-3.536-9.536a5 5 0 000 7.072M9 12H3m18 0h-6" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              )}
            </button>

            <a href="https://wa.me/40787813485" target="_blank" rel="noopener noreferrer"
              className="text-white/50 hover:text-green-300 transition-colors p-1" title="WhatsApp">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
            <button onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white transition text-xl leading-none w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/15">
              ×
            </button>
          </div>

          {/* Mesaje */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ background: '#f7f8fc' }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'text-white rounded-2xl rounded-br-sm'
                    : 'bg-white text-gray-700 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100'
                }`}
                style={m.role === 'user' ? { background: 'linear-gradient(135deg, #6d28d9 0%, #2563eb 100%)' } : {}}>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {showQuick && messages.length === 1 && (
              <div className="flex flex-col items-center gap-3 pt-2">
                {/* Buton mare microfon */}
                <button
                  onClick={() => { handleFirstInteraction(); toggleMic() }}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all group-hover:scale-105 ${listening ? 'bg-red-500' : 'bg-gradient-to-br from-violet-600 to-blue-600'}`}>
                    {listening ? (
                      <span className="flex gap-1">
                        <span className="w-1 h-5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1 h-5 bg-white rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
                        <span className="w-1 h-5 bg-white rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                      </span>
                    ) : (
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-violet-600 font-semibold">{listening ? 'Ascult...' : '🎤 Apasă și vorbește'}</span>
                </button>
                {/* Separator */}
                <div className="flex items-center gap-2 w-full">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-gray-400 text-xs">sau scrie</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                {/* Quick replies */}
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {QUICK_REPLIES.map(q => (
                    <button key={q} onClick={() => { handleFirstInteraction(); send(q) }}
                      className="px-3 py-1.5 text-xs font-medium border border-violet-200 text-violet-600 bg-white hover:bg-violet-50 rounded-full transition-colors shadow-sm">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="bg-white border-t border-gray-100 px-3 pt-2 pb-3 shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                onFocus={handleFirstInteraction}
                placeholder="Scrie un mesaj..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 placeholder-gray-400"
                style={{ fontSize: '16px' }}
              />
              <button onClick={() => send()} disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 shrink-0 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #6d28d9 0%, #2563eb 100%)' }}>
                <svg className="w-4 h-4 text-white rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-gray-400 text-[11px] mt-1.5 text-center">
              🎤 Pe mobil folosește microfonul de pe tastatură
            </p>
          </div>
        </div>
      )}

      {/* Bubble */}
      {bubble && !open && (
        <div className="fixed bottom-24 left-20 z-50 bg-white rounded-2xl rounded-bl-sm shadow-xl border border-gray-100 px-4 py-3 max-w-[200px] cursor-pointer"
          onClick={() => { setOpen(true); setBubble(false) }}>
          <button className="absolute -top-2 -right-2 bg-gray-100 hover:bg-gray-200 rounded-full w-5 h-5 text-xs flex items-center justify-center text-gray-500 transition-colors"
            onClick={e => { e.stopPropagation(); setBubble(false) }}>×</button>
          <p className="text-sm text-gray-700 leading-snug">👋 Bună! Cu ce te pot ajuta azi?</p>
        </div>
      )}

      {/* Buton toggle */}
      <button
        onClick={() => { setOpen(o => !o); setBubble(false) }}
        className="fixed bottom-6 left-4 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 hover:shadow-xl"
        style={{ background: 'linear-gradient(135deg, #6d28d9 0%, #2563eb 100%)' }}
        aria-label="Chat"
      >
        {open ? (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        )}
      </button>
    </>
  )
}
