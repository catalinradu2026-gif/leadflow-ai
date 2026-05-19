'use client'
import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { speak } from '../edu/tts'

type Msg = { role: 'user' | 'assistant'; content: string }

const PAGE_LABELS: Record<string, string> = {
  '/': 'AIcraiova',
  '/acreditare': 'Acreditare ARACIP',
  '/acreditare/autorizare': 'Autorizare de Funcționare',
  '/acreditare/acreditare-scolara': 'Acreditare Instituțională',
  '/acreditare/evaluare-periodica': 'Evaluare Externă Periodică',
  '/acreditare/dashboard': 'Dashboard ARACIP',
  '/acreditare/registre': 'Registre Naționale',
  '/acreditare/legislatie': 'Legislație ARACIP',
  '/acreditare/faq': 'Întrebări Frecvente',
  '/aracip': 'Portal ARACIP',
  '/edu': 'Platforma EDU',
  '/edu/bac/matematica': 'BAC Matematică',
  '/edu/bac/romana': 'BAC Română',
  '/edu/cursuri-ai': 'Cursuri AI Elevi',
  '/edu/cursuri-profesori': 'Formare Profesori',
  '/demo': 'Demo ISJ',
  '/demo/director': 'Portal Director ISJ',
  '/demo/isj': 'Dashboard ISJ',
}

const QUICK_QUESTIONS: Record<string, string[]> = {
  default: [
    'Ce documente trebuie pentru autorizare?',
    'Cât durează acreditarea?',
    'Ce este evaluarea periodică?',
    'Ce sunt criteriile A1, A2, A3?',
  ],
  bac_mat: [
    'Explică-mi derivatele',
    'Cum rezolv o integrală prin substituție?',
    'Structura subiectului BAC M1',
    'Dă-mi un exercițiu de limite',
  ],
  bac_ro: [
    'Cum structurez un eseu BAC?',
    'Figuri de stil principale',
    'Autori importanți la română real',
    'Structura subiectului I',
  ],
  edu: [
    'Ce este AI?',
    'Cum funcționează machine learning?',
    'Ce cariere există în AI?',
    'Ce instrumente AI pot folosi?',
  ],
  demo: [
    'Ce documente am de transmis?',
    'Termenul pentru raportare absențe',
    'Când sunt examenele naționale 2026?',
    'Dotări PNRR — ce unități beneficiază?',
  ],
}

function getGreeting(pathname: string): string {
  if (pathname === '/acreditare') return 'Bună ziua! Sunt ARA, asistentul digital ARACIP. Vă pot ajuta să navigați prin procesele de autorizare, acreditare și evaluare periodică. Ce doriți să aflați?'
  if (pathname === '/acreditare/autorizare') return 'Bună ziua! Sunt ARA. Pe această pagină depuneți dosarul de autorizare de funcționare pentru o unitate școlară nouă. Vă pot ghida pas cu pas prin documente și cerințe. Cu ce începem?'
  if (pathname === '/acreditare/acreditare-scolara') return 'Bună ziua! Sunt ARA. Suntem pe pagina de acreditare instituțională — etapa a doua după autorizare. Vă pot explica criteriile A1, A2, A3 sau cum să pregătiți dosarul. Ce vă interesează?'
  if (pathname === '/acreditare/evaluare-periodica') return 'Bună ziua! Sunt ARA. Aceasta este pagina pentru evaluarea externă periodică — obligatorie la fiecare 5 ani. Vă pot ajuta cu calendarul, procedura sau ce presupune vizita comisiei. Ce doriți să știți?'
  if (pathname === '/acreditare/dashboard') return 'Bună ziua! Sunt ARA. Pe acest dashboard vedeți situația tuturor unităților școlare. Vă pot ajuta să interpretați datele sau să găsiți o unitate specifică. Cu ce vă ajut?'
  if (pathname === '/acreditare/registre') return 'Bună ziua! Sunt ARA. Aceasta este pagina Registrelor Naționale ARACIP — puteți căuta orice unitate școlară acreditată sau autorizată din România. Cum vă pot ajuta?'
  if (pathname === '/acreditare/legislatie') return 'Bună ziua! Sunt ARA. Pe această pagină găsiți legislația ARACIP centralizată — legi, hotărâri de guvern și ordine ministeriale. Vă pot explica orice act normativ. Ce doriți să aflați?'
  if (pathname === '/acreditare/faq') return 'Bună ziua! Sunt ARA. Aceasta este pagina cu întrebările frecvente ARACIP. Dacă nu găsiți răspunsul în listă, întrebați-mă direct — știu tot ce trebuie despre procesele noastre.'
  if (pathname === '/aracip') return 'Bună ziua! Sunt ARA, asistentul digital oficial al ARACIP — Agenția Română de Asigurare a Calității în Învățământul Preuniversitar. Sunt aici să vă ghidez prin procesele de autorizare, acreditare și evaluare externă. Cum vă pot ajuta?'
  if (pathname.includes('/bac/matematica')) return 'Salut! Sunt ARA, profesorul tău AI de matematică BAC. Suntem pe pagina de pregătire matematică. Poți să-mi pui orice exercițiu sau să-mi ceri să explic un concept. De unde începem?'
  if (pathname.includes('/bac/romana')) return 'Salut! Sunt ARA, profesorul tău AI de română BAC. Suntem pe pagina de pregătire pentru examen. Te ajut cu eseuri, figuri de stil, autori sau structura probei. Ce vrei să exersăm?'
  if (pathname.includes('/cursuri-ai')) return 'Salut! Sunt ARA, profesorul tău de inteligență artificială. Suntem în modulul de cursuri AI pentru elevi. Îți explic orice concept, de la ce este AI până la cum funcționează rețelele neuronale. Cu ce începem?'
  if (pathname.includes('/cursuri-profesori')) return 'Bună ziua! Sunt ARA, mentorul tău AI pentru formare continuă. Pe această pagină explorăm cum puteți integra AI-ul în activitatea didactică. Ce aspect vă interesează cel mai mult?'
  if (pathname.includes('/demo/director') || pathname.includes('/demo/isj')) return 'Bună ziua! Sunt ARA, asistentul platformei ISJ. Vă pot ajuta cu documentele circulare, termenele de raportare sau procedurile active din sistem. Cu ce vă ajut?'
  if (pathname.includes('/demo')) return 'Bună ziua! Sunt ARA, asistentul platformei ISJ Dolj. Navigați prin demo-ul platformei de transparență școlară. Vă pot explica orice funcționalitate sau document. Cu ce vă ajut?'
  return 'Bună ziua! Sunt ARA, asistentul digital ARACIP. Cu ce vă pot ajuta?'
}

function getQuickQuestions(pathname: string): string[] {
  if (pathname.includes('bac/matematica')) return QUICK_QUESTIONS.bac_mat
  if (pathname.includes('bac/romana')) return QUICK_QUESTIONS.bac_ro
  if (pathname.includes('cursuri') || pathname.includes('edu')) return QUICK_QUESTIONS.edu
  if (pathname.includes('demo')) return QUICK_QUESTIONS.demo
  return QUICK_QUESTIONS.default
}

export default function AraChatbot() {
  const pathname = usePathname()
  if (pathname === '/') return null
  const pagina = PAGE_LABELS[pathname] || 'Platformă ARACIP'
  const quickQuestions = getQuickQuestions(pathname)

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: getGreeting(pathname) }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(0)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  function startListening() {
    const SR = (window as typeof window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition || (window as typeof window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition
    if (!SR) return
    if (listening) { recognitionRef.current?.stop(); setListening(false); return }
    window.speechSynthesis?.cancel()
    setSpeaking(false)
    const rec = new SR()
    rec.lang = 'ro-RO'
    rec.continuous = false
    rec.interimResults = true
    rec.onstart = () => setListening(true)
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join('')
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
        body: JSON.stringify({ messages: newMessages, pagina }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }])
      if (!open) setUnread(u => u + 1)
      if (voiceEnabled && data.text) {
        setSpeaking(true)
        speak(data.text, () => setSpeaking(false))
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Eroare de conexiune. Încercați din nou.' }])
    }
    setLoading(false)
  }

  return (
    <>
      {open && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '24px', zIndex: 9999,
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
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>ARA · Asistent ARACIP</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>{pagina}</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {speaking && <span style={{ fontSize: '11px', color: '#14b8a6' }}>🔊</span>}
              <button
                onClick={() => { if (voiceEnabled) { window.speechSynthesis?.cancel(); setSpeaking(false) }; setVoiceEnabled(v => !v) }}
                title={voiceEnabled ? 'Oprește vocea' : 'Activează vocea'}
                style={{ background: voiceEnabled ? 'rgba(20,184,166,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${voiceEnabled ? '#14b8a6' : '#334155'}`, borderRadius: '6px', padding: '4px 8px', fontSize: '14px', cursor: 'pointer', color: voiceEnabled ? '#14b8a6' : '#475569' }}
              >
                {voiceEnabled ? '🔊' : '🔇'}
              </button>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}>×</button>
            </div>
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
                  padding: '10px 13px', fontSize: '13px', lineHeight: 1.6,
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: '#0f172a', borderRadius: '14px 14px 14px 4px', padding: '10px 14px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#475569', display: 'inline-block', animation: `bounce 1s ${i * 0.2}s infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions */}
          {messages.length <= 1 && (
            <div style={{ padding: '0 12px 10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {quickQuestions.map(q => (
                <button key={q} onClick={() => send(q)} style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '20px', padding: '5px 12px', fontSize: '11px', color: '#a78bfa', cursor: 'pointer', fontFamily: 'inherit' }}>
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
              placeholder={listening ? '🎙️ Ascult...' : 'Scrieți sau vorbiți...'}
              style={{ flex: 1, background: listening ? 'rgba(239,68,68,0.07)' : '#0f172a', border: `1px solid ${listening ? '#ef4444' : '#334155'}`, borderRadius: '8px', padding: '8px 12px', fontSize: '13px', color: '#e2e8f0', outline: 'none', fontFamily: 'inherit', transition: 'all 0.2s' }}
            />
            <button onClick={startListening} title={listening ? 'Oprește microfonul' : 'Vorbește'} style={{ background: listening ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${listening ? '#ef4444' : '#334155'}`, borderRadius: '8px', width: '36px', flexShrink: 0, cursor: 'pointer', fontSize: '16px', animation: listening ? 'pulse 1s infinite' : 'none' }}>
              🎙️
            </button>
            <button onClick={() => send()} disabled={!input.trim() || loading} style={{ background: input.trim() && !loading ? '#7c3aed' : '#334155', color: '#fff', border: 'none', borderRadius: '8px', width: '36px', flexShrink: 0, cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', fontSize: '16px' }}>
              ↑
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          height: '48px',
          borderRadius: open ? '50%' : '24px',
          width: open ? '48px' : 'auto',
          padding: open ? '0' : '0 18px 0 14px',
          background: 'linear-gradient(135deg, #7c3aed, #14b8a6)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          boxShadow: '0 4px 24px rgba(124,58,237,0.55)',
          animation: open ? 'none' : 'ara-pulse 2.5s ease-in-out infinite',
          transition: 'all 0.25s ease',
          whiteSpace: 'nowrap',
        }}
      >
        {open ? (
          <span style={{ fontSize: '20px', color: '#fff' }}>×</span>
        ) : (
          <>
            <span style={{ fontSize: '20px' }}>🏛️</span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#fff', letterSpacing: '0.5px', fontFamily: "'Segoe UI', Arial, sans-serif" }}>AI</span>
          </>
        )}
        {!open && unread > 0 && (
          <div style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {unread}
          </div>
        )}
      </button>

      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} @keyframes ara-pulse{0%,100%{box-shadow:0 4px 24px rgba(124,58,237,0.55)}50%{box-shadow:0 4px 32px rgba(124,58,237,0.9),0 0 0 6px rgba(124,58,237,0.15)}}`}</style>
    </>
  )
}
