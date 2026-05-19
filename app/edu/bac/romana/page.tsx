'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect, Suspense } from 'react'
import { speak } from '../../tts'
import { useIsMobile } from '../../../hooks/useIsMobile'

type Msg = { role: 'user' | 'assistant'; content: string }

const INTREBARI_RAPIDE: Record<string, string[]> = {
  real: [
    'Ce trebuie să știu despre Ion de Rebreanu?',
    'Ajută-mă să scriu un eseu despre Moromeții',
    'Explică structura subiectului I',
    'Ce figuri de stil apar frecvent la BAC?',
    'Generează un text argumentativ de 150 cuvinte',
  ],
  uman: [
    'Explică poezia Plumb de Bacovia',
    'Ce trebuie să știu despre Eminescu pentru BAC?',
    'Cum scriu un eseu despre o poezie expresionistă?',
    'Explică simbolismul lui Bacovia',
    'Ajută-mă cu eseul despre Blaga',
  ],
}

const PROFIL_CONFIG = {
  real: { label: 'Profil Real', culoare: '#7c3aed', culoareLight: '#a78bfa', icon: '📝', subtitle: 'Proză: Rebreanu, Preda, Camil Petrescu, Călinescu, Sadoveanu' },
  uman: { label: 'Profil Uman', culoare: '#9333ea', culoareLight: '#c4b5fd', icon: '📜', subtitle: 'Poezie: Eminescu, Bacovia, Blaga, Arghezi, Barbu' },
}

function RomanaChat() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const searchParams = useSearchParams()
  const profil = (searchParams.get('profil') || 'real') as 'real' | 'uman'
  const config = PROFIL_CONFIG[profil]
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMsg(text?: string) {
    const userMsg = (text || input).trim()
    if (!userMsg || loading) return
    setInput('')
    const newMessages: Msg[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)
    try {
      const res = await fetch('/api/acreditare-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, pagina: `BAC Română ${profil}` }),
      })
      const data = await res.json()
      const reply = data.text || 'Eroare. Încercați din nou.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
      if (voiceEnabled) { setSpeaking(true); speak(reply, () => setSpeaking(false)) }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Eroare de conexiune. Încercați din nou.' }])
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0', display: 'flex', flexDirection: 'column' }}>

      {/* Topbar */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: isMobile ? '8px 12px' : '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '60px', flexShrink: 0, flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => router.push('/edu/bac')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← BAC</button>
          <div style={{ width: 1, height: 20, background: '#334155' }} />
          <span style={{ fontSize: '22px' }}>{config.icon}</span>
          <div>
            <div style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: 700, color: '#f1f5f9' }}>Română — {config.label} — Profesor AI</div>
            <div style={{ fontSize: '11px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ● Online · {config.subtitle}
              {speaking && <span style={{ color: '#a78bfa' }}>· 🔊 vorbește...</span>}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => { if (voiceEnabled) { window.speechSynthesis?.cancel(); setSpeaking(false) }; setVoiceEnabled(v => !v) }}
            title={voiceEnabled ? 'Oprește vocea' : 'Activează vocea'}
            style={{ background: voiceEnabled ? `rgba(124,58,237,0.15)` : 'rgba(255,255,255,0.03)', border: `1px solid ${voiceEnabled ? config.culoare : '#334155'}`, borderRadius: '8px', padding: '5px 10px', fontSize: '16px', cursor: 'pointer', color: voiceEnabled ? config.culoareLight : '#475569', lineHeight: 1 }}
          >
            {voiceEnabled ? '🔊' : '🔇'}
          </button>
          <button
            onClick={() => router.push('/edu/bac/romana?profil=real')}
            style={{ background: profil === 'real' ? config.culoare : '#1e293b', border: '1px solid #334155', color: profil === 'real' ? '#fff' : '#64748b', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
          >Real</button>
          <button
            onClick={() => router.push('/edu/bac/romana?profil=uman')}
            style={{ background: profil === 'uman' ? config.culoare : '#1e293b', border: '1px solid #334155', color: profil === 'uman' ? '#fff' : '#64748b', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
          >Uman</button>
        </div>
      </div>

      {/* Chat */}
      <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '12px' : '24px', maxWidth: '800px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>{config.icon}</div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>
              Profesor AI Română — {config.label}
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '32px', lineHeight: 1.7 }}>
              {config.subtitle}. Ajutor pentru eseu, analiză literară și textul la prima vedere.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '500px', margin: '0 auto' }}>
              {INTREBARI_RAPIDE[profil].map(q => (
                <button
                  key={q}
                  onClick={() => sendMsg(q)}
                  style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#94a3b8', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = config.culoare)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#334155')}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '12px', alignItems: 'flex-start' }}>
            {m.role === 'assistant' && (
              <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${config.culoare}, #9333ea)`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>
                {config.icon}
              </div>
            )}
            <div style={{
              maxWidth: '75%',
              background: m.role === 'user' ? config.culoare : '#1e293b',
              border: m.role === 'assistant' ? `1px solid ${config.culoare}33` : 'none',
              borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              padding: '14px 18px',
              fontSize: '14px',
              color: '#f1f5f9',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
            }}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${config.culoare}, #9333ea)`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{config.icon}</div>
            <div style={{ background: '#1e293b', border: `1px solid ${config.culoare}33`, borderRadius: '16px 16px 16px 4px', padding: '14px 18px' }}>
              <span style={{ color: '#64748b', fontSize: '14px' }}>Profesorul analizează...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ background: '#1e293b', borderTop: '1px solid #334155', padding: '16px 24px', flexShrink: 0 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '12px' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMsg()}
            placeholder="Întreabă despre autori, opere, eseu, text la prima vedere..."
            style={{ flex: 1, background: '#0f172a', border: `1px solid ${config.culoare}33`, borderRadius: '12px', padding: '12px 18px', fontSize: '14px', color: '#e2e8f0', outline: 'none' }}
          />
          <button
            onClick={() => sendMsg()}
            disabled={loading}
            style={{ background: loading ? '#334155' : config.culoare, color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? '...' : 'Întreabă →'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function RomanaPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontFamily: 'sans-serif' }}>Se încarcă...</div>}>
      <RomanaChat />
    </Suspense>
  )
}
