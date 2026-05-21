'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect, Suspense } from 'react'
import { speak } from '../../tts'
import { useIsMobile } from '../../../hooks/useIsMobile'

type Msg = { role: 'user' | 'assistant'; content: string }

const INTREBARI_RAPIDE: Record<string, string[]> = {
  M1: [
    'Explică-mi derivatele pas cu pas',
    'Dă-mi un exercițiu cu integrale',
    'Cum rezolv un sistem cu matricea lui Cramer?',
    'Explică studiul de funcție complet',
    'Generează un subiect III complet de BAC',
  ],
  M2: [
    'Explică legile de compoziție',
    'Dă-mi exerciții cu probabilități',
    'Cum calculez aria unui triunghi analitic?',
    'Explică derivatele simplu pentru M2',
    'Generează un subiect I complet de BAC',
  ],
}

function MatematicaChat() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const searchParams = useSearchParams()
  const profil = (searchParams.get('profil') || 'M1') as 'M1' | 'M2'

  const [messages, setMessages] = useState<Msg[]>([])
  const [boardText, setBoardText] = useState('')
  const [boardFull, setBoardFull] = useState('')
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const typewriterRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  // Scroll tabla la final când textul crește
  useEffect(() => {
    if (boardRef.current) boardRef.current.scrollTop = boardRef.current.scrollHeight
  }, [boardText])

  function startTypewriter(text: string) {
    if (typewriterRef.current) clearInterval(typewriterRef.current)
    setBoardText('')
    setTyping(true)
    let i = 0
    typewriterRef.current = setInterval(() => {
      i++
      setBoardText(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(typewriterRef.current!)
        setTyping(false)
      }
    }, 18)
  }

  async function sendMsg(text?: string) {
    const userMsg = (text || input).trim()
    if (!userMsg || loading) return
    setInput('')
    const newMessages: Msg[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)
    setBoardText('...')
    try {
      const res = await fetch('/api/acreditare-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, pagina: `BAC Matematică ${profil}` }),
      })
      const data = await res.json()
      const reply = data.text || 'Eroare. Încercați din nou.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
      setBoardFull(reply)
      startTypewriter(reply)
      if (voiceEnabled) { setSpeaking(true); speak(reply, () => setSpeaking(false)) }
    } catch {
      const err = 'Eroare de conexiune. Încercați din nou.'
      setBoardText(err)
      setMessages(prev => [...prev, { role: 'assistant', content: err }])
    }
    setLoading(false)
  }

  const isEmpty = messages.length === 0 && !boardText

  return (
    <div style={{ height: '100vh', background: '#0a0f1a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Topbar */}
      <div style={{ background: '#0f172a', borderBottom: '1px solid #1e293b', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '52px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/edu/bac')} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '13px' }}>← BAC</button>
          <div style={{ width: 1, height: 18, background: '#1e293b' }} />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>📐 Matematică {profil}</span>
          {speaking && <span style={{ fontSize: '11px', color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '4px' }}>🔊 explică...</span>}
          {typing && !speaking && <span style={{ fontSize: '11px', color: '#22c55e' }}>✏️ scrie...</span>}
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button
            onClick={() => { if (voiceEnabled) { window.speechSynthesis?.cancel(); setSpeaking(false) }; setVoiceEnabled(v => !v) }}
            style={{ background: voiceEnabled ? 'rgba(167,139,250,0.15)' : 'transparent', border: `1px solid ${voiceEnabled ? '#a78bfa' : '#1e293b'}`, borderRadius: '6px', padding: '4px 10px', fontSize: '14px', cursor: 'pointer', color: voiceEnabled ? '#a78bfa' : '#334155' }}
          >
            {voiceEnabled ? '🔊' : '🔇'}
          </button>
          <button
            onClick={() => setShowHistory(h => !h)}
            style={{ background: showHistory ? 'rgba(99,102,241,0.15)' : 'transparent', border: `1px solid ${showHistory ? '#6366f1' : '#1e293b'}`, borderRadius: '6px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer', color: showHistory ? '#a5b4fc' : '#334155', fontWeight: 600 }}
          >
            📋 Istoric
          </button>
          <button onClick={() => router.push('/edu/bac/matematica?profil=M1')} style={{ background: profil === 'M1' ? '#1d4ed8' : 'transparent', border: `1px solid ${profil === 'M1' ? '#1d4ed8' : '#1e293b'}`, color: profil === 'M1' ? '#fff' : '#475569', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>M1</button>
          <button onClick={() => router.push('/edu/bac/matematica?profil=M2')} style={{ background: profil === 'M2' ? '#1d4ed8' : 'transparent', border: `1px solid ${profil === 'M2' ? '#1d4ed8' : '#1e293b'}`, color: profil === 'M2' ? '#fff' : '#475569', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>M2</button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: isMobile ? 'column' : 'row', overflow: 'hidden' }}>

        {/* Tablă */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Suprafața tablei */}
          <div
            ref={boardRef}
            style={{
              flex: 1,
              background: 'linear-gradient(160deg, #0d2b0d 0%, #0a230a 40%, #0c2a0c 100%)',
              borderBottom: '4px solid #1a3d1a',
              borderRight: isMobile ? 'none' : '3px solid #1a3d1a',
              padding: isMobile ? '20px 16px' : '32px 40px',
              overflowY: 'auto',
              position: 'relative',
              boxShadow: 'inset 0 0 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Linii orizontale subtile ca o tablă reală */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, rgba(255,255,255,0.02) 39px, rgba(255,255,255,0.02) 40px)', pointerEvents: 'none' }} />

            {isEmpty ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.4 }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>📐</div>
                <div style={{ fontSize: '22px', color: '#86efac', fontFamily: "'Courier New', monospace", textAlign: 'center', lineHeight: 1.6 }}>
                  Profesor AI Matematică {profil}
                </div>
                <div style={{ fontSize: '14px', color: '#4ade80', marginTop: '12px', textAlign: 'center', maxWidth: '400px', lineHeight: 1.7, fontFamily: "'Courier New', monospace" }}>
                  Pune o întrebare sau alege un subiect din dreapta.{'\n'}Voi explica pe tablă și vocal, pas cu pas.
                </div>
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                {/* Întrebarea elevului */}
                {messages.length > 0 && messages[messages.length - 1]?.role === 'user' && (
                  <div style={{ marginBottom: '24px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '12px', color: '#fbbf24', fontFamily: "'Courier New', monospace", background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '4px', padding: '2px 8px', whiteSpace: 'nowrap', flexShrink: 0 }}>Elev:</span>
                    <span style={{ fontSize: isMobile ? '14px' : '15px', color: '#fde68a', fontFamily: "'Courier New', monospace", lineHeight: 1.6 }}>
                      {messages[messages.length - (messages[messages.length-1].role === 'user' ? 1 : 2)]?.content}
                    </span>
                  </div>
                )}

                {/* Răspunsul pe tablă */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '12px', color: '#86efac', fontFamily: "'Courier New', monospace", background: 'rgba(134,239,172,0.1)', border: '1px solid rgba(134,239,172,0.2)', borderRadius: '4px', padding: '2px 8px', whiteSpace: 'nowrap', flexShrink: 0 }}>Prof:</span>
                  <div style={{ fontSize: isMobile ? '14px' : '16px', color: '#f0fdf4', fontFamily: "'Courier New', monospace", lineHeight: 1.9, whiteSpace: 'pre-wrap', letterSpacing: '0.3px' }}>
                    {boardText}
                    {typing && <span style={{ display: 'inline-block', width: '10px', height: '18px', background: '#86efac', marginLeft: '2px', verticalAlign: 'middle', animation: 'blink 0.7s step-end infinite' }} />}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bordul tablei (chalk tray) */}
          <div style={{ background: '#2d1b00', height: '12px', borderBottom: '2px solid #1a0f00', flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 20px', gap: '8px' }}>
            {['#fff', '#fca5a5', '#86efac', '#93c5fd', '#fde68a'].map((c, i) => (
              <div key={i} style={{ width: 28, height: 6, background: c, borderRadius: '3px', opacity: 0.7 }} />
            ))}
          </div>

          {/* Input */}
          <div style={{ background: '#0f172a', borderTop: '1px solid #1e293b', padding: '12px 16px', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMsg()}
                placeholder={`Întreabă profesorul despre Matematică ${profil}...`}
                style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '10px 16px', fontSize: '14px', color: '#e2e8f0', outline: 'none' }}
              />
              <button
                onClick={() => sendMsg()}
                disabled={loading || typing}
                style={{ background: (loading || typing) ? '#1e293b' : '#1d4ed8', color: (loading || typing) ? '#475569' : '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '14px', fontWeight: 700, cursor: (loading || typing) ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
              >
                {loading ? '⏳' : typing ? '✏️' : 'Întreabă →'}
              </button>
            </div>
          </div>
        </div>

        {/* Panel lateral — întrebări rapide + istoric */}
        {!isMobile && (
          <div style={{ width: '260px', background: '#0f172a', borderLeft: '1px solid #1e293b', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>

            {showHistory ? (
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                <div style={{ fontSize: '11px', color: '#475569', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Istoric conversație</div>
                {messages.length === 0 ? (
                  <div style={{ fontSize: '12px', color: '#334155', textAlign: 'center', marginTop: '20px' }}>Nicio conversație încă</div>
                ) : (
                  messages.map((m, i) => (
                    <div key={i} style={{ marginBottom: '10px', padding: '8px 10px', background: m.role === 'user' ? 'rgba(29,78,216,0.1)' : 'rgba(34,197,94,0.06)', border: `1px solid ${m.role === 'user' ? 'rgba(29,78,216,0.2)' : 'rgba(34,197,94,0.1)'}`, borderRadius: '8px' }}>
                      <div style={{ fontSize: '10px', color: m.role === 'user' ? '#93c5fd' : '#86efac', fontWeight: 700, marginBottom: '4px' }}>{m.role === 'user' ? 'Tu' : 'Profesor'}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{m.content.slice(0, 120)}{m.content.length > 120 ? '...' : ''}</div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                <div style={{ fontSize: '11px', color: '#475569', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Subiecte rapide</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {INTREBARI_RAPIDE[profil].map(q => (
                    <button
                      key={q}
                      onClick={() => sendMsg(q)}
                      disabled={loading || typing}
                      style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#94a3b8', cursor: 'pointer', textAlign: 'left', lineHeight: 1.5, transition: 'all 0.15s' }}
                      onMouseEnter={e => { (e.currentTarget.style.borderColor = '#3b82f6'); (e.currentTarget.style.color = '#e2e8f0') }}
                      onMouseLeave={e => { (e.currentTarget.style.borderColor = '#334155'); (e.currentTarget.style.color = '#94a3b8') }}
                    >
                      {q}
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#475569', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Capítole BAC {profil}</div>
                  {(profil === 'M1'
                    ? ['Derivate', 'Integrale', 'Matrice', 'Geometrie analitică', 'Numere complexe', 'Șiruri și limite']
                    : ['Funcția liniară', 'Probabilități', 'Geometrie plană', 'Ecuații pătratice', 'Progresii', 'Vectori']
                  ).map(cap => (
                    <button
                      key={cap}
                      onClick={() => sendMsg(`Explică-mi capitolul: ${cap}`)}
                      disabled={loading || typing}
                      style={{ display: 'block', width: '100%', background: 'none', border: 'none', color: '#6366f1', fontSize: '12px', cursor: 'pointer', textAlign: 'left', padding: '4px 0', lineHeight: 1.6 }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#a5b4fc')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#6366f1')}
                    >
                      → {cap}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}

export default function MatematicaPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontFamily: 'sans-serif' }}>Se încarcă...</div>}>
      <MatematicaChat />
    </Suspense>
  )
}
