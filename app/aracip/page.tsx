'use client'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '../hooks/useIsMobile'
import { useEffect, useState } from 'react'

function _AraChatbotRemoved({ isMobile }: { isMobile: boolean }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: ARA_GREETING }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const [listening, setListening] = useState(false)
  const [unread, setUnread] = useState(0)
  const [introduced, setIntroduced] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setUnread(0)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
      if (!introduced) {
        setIntroduced(true)
        setSpeaking(true)
        speak(ARA_GREETING, () => setSpeaking(false))
      }
    }
  }, [open, messages, introduced])

  function startListening() {
    const SR = (window as typeof window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition
      || (window as typeof window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition
    if (!SR) return
    if (listening) { recognitionRef.current?.stop(); setListening(false); return }
    window.speechSynthesis?.cancel(); setSpeaking(false)
    const rec = new SR()
    rec.lang = 'ro-RO'
    rec.continuous = false
    rec.interimResults = true
    rec.onstart = () => setListening(true)
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join('')
      setInput(transcript)
      if (e.results[e.results.length - 1].isFinal) { rec.stop(); send(transcript) }
    }
    rec.onerror = () => setListening(false)
    rec.onend = () => setListening(false)
    recognitionRef.current = rec
    rec.start()
  }

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
      if (voiceEnabled && data.text) { setSpeaking(true); speak(data.text, () => setSpeaking(false)) }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Eroare de conexiune. Încercați din nou.' }])
    }
    setLoading(false)
  }

  const QUICK = ['Ce documente trebuie pentru autorizare?', 'Cum funcționează acreditarea?', 'Ce este evaluarea periodică?']

  return (
    <>
      {open && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '24px', zIndex: 1000,
          width: isMobile ? 'calc(100vw - 32px)' : '380px',
          maxHeight: '540px',
          background: '#0d1117',
          border: '1px solid rgba(167,139,250,0.2)',
          borderRadius: '20px',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(167,139,250,0.1)',
          fontFamily: "'Segoe UI', Arial, sans-serif",
        }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(20,184,166,0.1))', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0, boxShadow: '0 4px 12px rgba(124,58,237,0.4)' }}>🏛️</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.3px' }}>ARA</div>
              <div style={{ fontSize: '11px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px #22c55e' }} />
                {speaking ? 'Vorbește...' : listening ? 'Ascultă...' : 'Expert ARACIP · Online'}
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => { if (voiceEnabled) { window.speechSynthesis?.cancel(); setSpeaking(false) } setVoiceEnabled(v => !v) }}
                style={{ background: voiceEnabled ? 'rgba(20,184,166,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${voiceEnabled ? '#14b8a6' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', padding: '5px 9px', fontSize: '14px', cursor: 'pointer', color: voiceEnabled ? '#14b8a6' : '#475569' }}
              >{voiceEnabled ? '🔊' : '🔇'}</button>
              <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '5px 9px', color: '#475569', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}>×</button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '8px', alignItems: 'flex-end' }}>
                {m.role === 'assistant' && (
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0 }}>🏛️</div>
                )}
                <div style={{
                  maxWidth: '82%',
                  background: m.role === 'user' ? 'linear-gradient(135deg, #7c3aed, #6366f1)' : 'rgba(255,255,255,0.04)',
                  border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.06)',
                  color: '#e2e8f0',
                  borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  lineHeight: 1.65,
                  boxShadow: m.role === 'user' ? '0 4px 12px rgba(124,58,237,0.3)' : 'none',
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>🏛️</div>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px 16px 16px 4px', padding: '12px 16px', display: 'flex', gap: '5px', alignItems: 'center' }}>
                  {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed', display: 'inline-block', animation: `bounce 1.2s ${i*0.2}s infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions */}
          {messages.length <= 1 && (
            <div style={{ padding: '0 12px 10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {QUICK.map(q => (
                <button key={q} onClick={() => send(q)} style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '20px', padding: '5px 12px', fontSize: '11px', color: '#a78bfa', cursor: 'pointer', fontFamily: 'inherit' }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '10px 12px', display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.2)' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder={listening ? '🎙️ Ascult...' : 'Întrebați-o pe ARA...'}
              style={{ flex: 1, background: listening ? 'rgba(239,68,68,0.07)' : 'rgba(255,255,255,0.04)', border: `1px solid ${listening ? '#ef444466' : 'rgba(255,255,255,0.08)'}`, borderRadius: '10px', padding: '9px 13px', fontSize: '13px', color: '#e2e8f0', outline: 'none', fontFamily: 'inherit', transition: 'all 0.2s' }}
            />
            <button onClick={startListening} style={{ background: listening ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${listening ? '#ef444466' : 'rgba(255,255,255,0.08)'}`, borderRadius: '10px', width: '38px', cursor: 'pointer', fontSize: '16px', animation: listening ? 'pulse-red 1s infinite' : 'none' }}>🎙️</button>
            <button onClick={() => send()} disabled={!input.trim() || loading} style={{ background: input.trim() && !loading ? 'linear-gradient(135deg, #7c3aed, #6366f1)' : 'rgba(255,255,255,0.04)', color: '#fff', border: 'none', borderRadius: '10px', width: '38px', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', fontSize: '16px', boxShadow: input.trim() && !loading ? '0 4px 12px rgba(124,58,237,0.35)' : 'none' }}>↑</button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
          width: '60px', height: '60px', borderRadius: '50%',
          background: open ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #7c3aed, #14b8a6)',
          border: open ? '1px solid rgba(255,255,255,0.15)' : 'none',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: open ? '22px' : '26px',
          boxShadow: open ? 'none' : '0 8px 28px rgba(124,58,237,0.5)',
          transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {open ? '×' : '🏛️'}
        {!open && unread > 0 && (
          <div style={{ position: 'absolute', top: -3, right: -3, background: '#ef4444', color: '#fff', borderRadius: '50%', width: 20, height: 20, fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(239,68,68,0.5)' }}>{unread}</div>
        )}
      </button>

      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        @keyframes pulse-red { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)} 50%{box-shadow:0 0 0 8px rgba(239,68,68,0)} }
      `}</style>
    </>
  )
}

export default function AracipHome() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const cards = [
    {
      id: 'isj',
      icon: '🏫',
      tag: 'Portal ISJ',
      title: 'Inspectorate,\nDirectori & Diriginți',
      desc: 'Dashboard centralizat pentru toate unitățile din județ. Raportare, documente și comunicare în timp real.',
      color: '#6366f1',
      colorLight: 'rgba(99,102,241,0.1)',
      colorBorder: 'rgba(99,102,241,0.25)',
      colorHover: 'rgba(99,102,241,0.18)',
      route: '/demo',
      securizabil: true,
    },
    {
      id: 'elevi',
      icon: '🎓',
      tag: 'Portal Elevi',
      title: 'Elevi\nClasa a 8-a & a 12-a',
      desc: 'Autentifică-te cu datele clasei tale și accesează lecțiile AI pentru Capacitate și Bacalaureat.',
      color: '#6366f1',
      colorLight: 'rgba(99,102,241,0.1)',
      colorBorder: 'rgba(99,102,241,0.25)',
      colorHover: 'rgba(99,102,241,0.18)',
      route: '/edu/elevi',
    },
    {
      id: 'acreditare',
      icon: '🏅',
      tag: 'Calitate',
      title: 'Autorizare,\nAcreditare & Evaluare',
      desc: 'Dosare digitale, vizite comisii ARACIP și evaluare externă periodică — fără hârtii, 100% online.',
      color: '#a855f7',
      colorLight: 'rgba(168,85,247,0.1)',
      colorBorder: 'rgba(168,85,247,0.25)',
      colorHover: 'rgba(168,85,247,0.18)',
      route: '/acreditare',
    },
    {
      id: 'examene',
      icon: '🎯',
      tag: 'Pregătire Examene',
      title: 'BAC &\nCapacitate',
      desc: 'Profesor AI acasă — meditații interactive pentru Bacalaureat și Evaluare Națională, 24/7, gratuit.',
      color: '#f59e0b',
      colorLight: 'rgba(245,158,11,0.1)',
      colorBorder: 'rgba(245,158,11,0.25)',
      colorHover: 'rgba(245,158,11,0.18)',
      route: '/edu/examene',
    },
    {
      id: 'profesori',
      icon: '🧑‍💻',
      tag: 'Portal Profesori',
      title: 'Profesori\n& Formare',
      desc: 'Resurse AI pentru profesori, formare continuă digitală și instrumente pentru ora de curs.',
      color: '#f97316',
      colorLight: 'rgba(249,115,22,0.1)',
      colorBorder: 'rgba(249,115,22,0.25)',
      colorHover: 'rgba(249,115,22,0.18)',
      route: '/edu/cursuri-profesori',
    },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060b14',
      fontFamily: "'Segoe UI', Arial, sans-serif",
      color: '#f1f5f9',
      overflowX: 'hidden',
      position: 'relative',
    }}>

      {/* Background glow effects */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '600px', background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '500px', height: '500px', background: 'radial-gradient(ellipse, rgba(20,184,166,0.07) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '40%', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <header style={{
          padding: isMobile ? '18px 20px' : '24px 56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(6,11,20,0.8)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: 42, height: 42, borderRadius: '12px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #14b8a6 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', boxShadow: '0 4px 16px rgba(124,58,237,0.35)',
            }}>🏛️</div>
            <div>
              <div style={{ fontSize: '17px', fontWeight: 800, letterSpacing: '-0.3px', color: '#f1f5f9' }}>ARACIP</div>
              <div style={{ fontSize: '10px', color: '#334155', letterSpacing: '0.3px' }}>PLATFORMĂ DIGITALĂ NAȚIONALĂ</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!isMobile && (
              <span style={{ fontSize: '12px', color: '#334155' }}>România · 2026</span>
            )}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: '20px', padding: '6px 14px',
              fontSize: '12px', color: '#22c55e', fontWeight: 600,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e', animation: mounted ? 'pulse 2s infinite' : 'none' }} />
              Sistem Activ
            </div>
          </div>
        </header>

        {/* Hero */}
        <section style={{
          textAlign: 'center',
          padding: isMobile ? '60px 24px 48px' : '100px 40px 80px',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(167,139,250,0.08)',
            border: '1px solid rgba(167,139,250,0.2)',
            borderRadius: '40px',
            padding: '8px 20px',
            fontSize: '12px', color: '#c4b5fd',
            fontWeight: 600, letterSpacing: '0.3px',
            marginBottom: '32px',
          }}>
            🇷🇴 Agenția Română de Asigurare a Calității în Învățământul Preuniversitar
          </div>

          <h1 style={{
            fontSize: isMobile ? '38px' : '72px',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: isMobile ? '-1.5px' : '-3px',
            marginBottom: '24px',
            ...(isMobile ? { color: '#ffffff' } : {
              background: 'linear-gradient(135deg, #f1f5f9 30%, #a78bfa 70%, #14b8a6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }),
          }}>
            Educație de calitate<br />în era digitală
          </h1>

          <p style={{
            fontSize: isMobile ? '15px' : '19px',
            color: '#475569',
            maxWidth: '560px',
            lineHeight: 1.75,
            margin: '0 auto 48px',
          }}>
            Platforma națională pentru autorizare, acreditare și evaluare a unităților de învățământ preuniversitar. Zero hârtii, 100% digital.
          </p>

          {/* Quick stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: isMobile ? '20px' : '48px',
            flexWrap: 'wrap',
            marginBottom: isMobile ? '56px' : '80px',
          }}>
            {[
              { val: '11.500', label: 'Unități școlare' },
              { val: '42', label: 'Județe' },
              { val: '100%', label: 'Digital' },
              { val: '24/7', label: 'Disponibil' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 900, color: '#a78bfa', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? '16px' : '20px',
            maxWidth: '960px',
            margin: '0 auto',
          }}>
            {cards.map(card => (
              <button
                key={card.id}
                onClick={() => router.push(card.route)}
                onMouseEnter={() => setHovered(card.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: isMobile ? card.colorHover : (hovered === card.id ? card.colorHover : card.colorLight),
                  border: `1.5px solid ${isMobile ? card.color : (hovered === card.id ? card.color : card.colorBorder)}`,
                  borderRadius: '24px',
                  padding: isMobile ? '28px 24px' : '36px 32px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transform: isMobile ? 'translateY(-4px)' : (hovered === card.id ? 'translateY(-6px)' : 'translateY(0)'),
                  transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                  boxShadow: isMobile
                    ? `0 12px 32px ${card.color}33, 0 4px 0 ${card.color}44`
                    : (hovered === card.id ? `0 20px 48px ${card.color}22` : '0 4px 20px rgba(0,0,0,0.2)'),
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Glow top-right */}
                <div style={{
                  position: 'absolute', top: '-40px', right: '-40px',
                  width: '120px', height: '120px',
                  background: `radial-gradient(ellipse, ${card.color}22, transparent 70%)`,
                  borderRadius: '50%',
                  transition: 'opacity 0.25s',
                  opacity: hovered === card.id ? 1 : 0.5,
                }} />

                {(card as any).securizabil && (
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    background: 'rgba(239,68,68,0.12)',
                    border: '1px solid rgba(239,68,68,0.35)',
                    borderRadius: '20px', padding: '2px 10px',
                    fontSize: '10px', fontWeight: 800, color: '#ef4444',
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                  }}>
                    🔒 Securizabil
                  </div>
                )}

                <div style={{ fontSize: '40px', marginBottom: '16px', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}>{card.icon}</div>

                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  background: `${card.color}22`,
                  border: `1px solid ${card.color}44`,
                  borderRadius: '20px', padding: '3px 12px',
                  fontSize: '10px', fontWeight: 800, color: card.color,
                  textTransform: 'uppercase', letterSpacing: '1px',
                  marginBottom: '14px',
                }}>
                  {card.tag}
                </div>

                <div style={{
                  fontSize: isMobile ? '19px' : '21px',
                  fontWeight: 800,
                  color: '#f1f5f9',
                  lineHeight: 1.25,
                  marginBottom: '12px',
                  whiteSpace: 'pre-line',
                }}>
                  {card.title}
                </div>

                <div style={{
                  fontSize: '13px',
                  color: '#475569',
                  lineHeight: 1.65,
                  marginBottom: '24px',
                }}>
                  {card.desc}
                </div>

                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  fontSize: '13px', fontWeight: 700, color: card.color,
                  background: `${card.color}15`,
                  border: `1px solid ${card.color}33`,
                  borderRadius: '10px',
                  padding: '8px 18px',
                  transition: 'all 0.2s',
                }}>
                  Accesează
                  <span style={{
                    display: 'inline-block',
                    transform: hovered === card.id ? 'translateX(4px)' : 'translateX(0)',
                    transition: 'transform 0.2s',
                  }}>→</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Features strip */}
        <section style={{
          borderTop: '1px solid rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          padding: isMobile ? '32px 20px' : '40px 56px',
          background: 'rgba(255,255,255,0.015)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
            gap: isMobile ? '24px' : '32px',
            maxWidth: '960px',
            margin: '0 auto',
            textAlign: 'center',
          }}>
            {[
              { icon: '🔒', title: 'Securizat GDPR', desc: 'Date stocate pe servere europene' },
              { icon: '⚡', title: 'Timp Real', desc: 'Notificări și alerte instant' },
              { icon: '📄', title: 'Zero Hârtii', desc: 'Toate documentele 100% digital' },
              { icon: '🤖', title: 'AI Integrat', desc: 'Asistent inteligent disponibil 24/7' },
            ].map(f => (
              <div key={f.title}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{f.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0', marginBottom: '4px' }}>{f.title}</div>
                <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Despre noi */}
        <section style={{
          padding: isMobile ? '48px 20px' : '72px 56px',
          maxWidth: '860px',
          margin: '0 auto',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'inline-block', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '20px', padding: '6px 16px', fontSize: '11px', fontWeight: 700, color: '#a78bfa', letterSpacing: '1px', marginBottom: '16px' }}>DESPRE NOI</div>
            <h2 style={{ fontSize: isMobile ? '26px' : '36px', fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, marginBottom: '16px' }}>
              Transparență în Era Digitală
            </h2>
            <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '560px', margin: '0 auto', lineHeight: 1.8 }}>
              România 2026 — digitalizarea educației nu mai e o viziune, e o realitate.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' }}>
            {[
              {
                icon: '🤖',
                titlu: 'ARA — Asistentul AI ARACIP',
                text: 'ARA este primul asistent digital vocal specializat pe procedurile ARACIP din România. Răspunde în timp real la întrebări despre autorizare, acreditare și evaluare periodică — disponibil 24/7, în limba română, pe orice dispozitiv.',
              },
              {
                icon: '🧠',
                titlu: 'Inteligență Artificială în Educație',
                text: 'ARA nu este un chatbot obișnuit. Cunoaște legislația ARACIP, standardele A1/A2/A3, procedurile ISJ și programele BAC. Se adaptează contextului fiecărei pagini și ghidează fiecare utilizator exact acolo unde are nevoie.',
              },
              {
                icon: '🏛️',
                titlu: 'Cine este ARACIP',
                text: 'Agenția Română de Asigurare a Calității în Învățământul Preuniversitar este autoritatea națională care evaluează și acreditează unitățile de învățământ din România, garantând dreptul fiecărui copil la o educație de calitate.',
              },
              {
                icon: '🎯',
                titlu: 'Misiunea ARACIP',
                text: 'Evaluarea externă a calității educației în toate cele 11.500 de unități școlare din România — stat și privat, urban și rural — printr-un sistem transparent, obiectiv și bazat pe standarde naționale și europene.',
              },
              {
                icon: '⚖️',
                titlu: 'Cadrul legal',
                text: 'ARACIP funcționează în baza Legii 198/2023 și OUG 75/2005, aplicând standarde de calitate aliniate directivelor europene. Fiecare decizie de acreditare are forță juridică și este publicată în Registrul Național.',
              },
              {
                icon: '🚀',
                titlu: 'ARACIP Digital',
                text: 'Prin această platformă, ARACIP face pasul decisiv spre transparență totală — procese 100% digitale, registre publice în timp real, comunicare directă cu unitățile școlare și acces deschis pentru elevi, părinți și societate.',
              },
            ].map(item => (
              <div key={item.titlu} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(124,58,237,0.2)',
                borderRadius: '14px',
                padding: '24px',
                transform: isMobile ? 'translateY(-4px)' : undefined,
                boxShadow: isMobile
                  ? '0 12px 32px rgba(124,58,237,0.2), 0 4px 0 rgba(124,58,237,0.35)'
                  : '0 4px 20px rgba(0,0,0,0.2)',
                transition: 'all 0.25s ease',
              }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{item.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>{item.titlu}</div>
                <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.7 }}>{item.text}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          padding: isMobile ? '24px 20px 100px' : '28px 56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '8px',
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 24, height: 24, borderRadius: '6px', background: 'linear-gradient(135deg, #7c3aed, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>🏛️</div>
            <span style={{ fontSize: '12px', color: '#334155' }}>ARACIP · Platformă Digitală · România · 2026</span>
          </div>
          <div style={{ fontSize: '12px', color: '#1e293b' }}>
            Powered by <strong style={{ color: '#7c3aed' }}>AIcraiova</strong>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 8px #22c55e; }
          50% { box-shadow: 0 0 16px #22c55e, 0 0 24px #22c55e44; }
        }
      `}</style>

    </div>
  )
}
