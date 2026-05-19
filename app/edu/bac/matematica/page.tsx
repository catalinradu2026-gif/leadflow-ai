'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect, Suspense } from 'react'

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
  const searchParams = useSearchParams()
  const profil = (searchParams.get('profil') || 'M1') as 'M1' | 'M2'
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
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
      const res = await fetch('/api/bac-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, materie: 'matematica', profil }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.text || 'Eroare. Încercați din nou.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Eroare de conexiune. Încercați din nou.' }])
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0', display: 'flex', flexDirection: 'column' }}>

      {/* Topbar */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => router.push('/edu/bac')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← BAC</button>
          <div style={{ width: 1, height: 20, background: '#334155' }} />
          <span style={{ fontSize: '22px' }}>📐</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>Matematică {profil} — Profesor AI</div>
            <div style={{ fontSize: '11px', color: '#22c55e' }}>● Online · Cunoaște toată programa BAC 2026</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => router.push('/edu/bac/matematica?profil=M1')}
            style={{ background: profil === 'M1' ? '#1d4ed8' : '#1e293b', border: '1px solid #334155', color: profil === 'M1' ? '#fff' : '#64748b', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
          >M1</button>
          <button
            onClick={() => router.push('/edu/bac/matematica?profil=M2')}
            style={{ background: profil === 'M2' ? '#1d4ed8' : '#1e293b', border: '1px solid #334155', color: profil === 'M2' ? '#fff' : '#64748b', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
          >M2</button>
        </div>
      </div>

      {/* Chat */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', maxWidth: '800px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📐</div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>
              Profesor AI Matematică {profil}
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '32px', lineHeight: 1.7 }}>
              Explică orice capitol din programă, generează exerciții și te pregătește după structura oficială BAC 2026.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '500px', margin: '0 auto' }}>
              {INTREBARI_RAPIDE[profil].map(q => (
                <button
                  key={q}
                  onClick={() => sendMsg(q)}
                  style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#94a3b8', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#3b82f6')}
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
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>
                📐
              </div>
            )}
            <div style={{
              maxWidth: '75%',
              background: m.role === 'user' ? '#1d4ed8' : '#1e293b',
              border: m.role === 'assistant' ? '1px solid #1e40af44' : 'none',
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
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>📐</div>
            <div style={{ background: '#1e293b', border: '1px solid #1e40af44', borderRadius: '16px 16px 16px 4px', padding: '14px 18px' }}>
              <span style={{ color: '#64748b', fontSize: '14px' }}>Profesorul calculează...</span>
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
            placeholder={`Întreabă despre orice din programa BAC Matematică ${profil}...`}
            style={{ flex: 1, background: '#0f172a', border: '1px solid #1e40af44', borderRadius: '12px', padding: '12px 18px', fontSize: '14px', color: '#e2e8f0', outline: 'none' }}
          />
          <button
            onClick={() => sendMsg()}
            disabled={loading}
            style={{ background: loading ? '#334155' : '#1d4ed8', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? '...' : 'Întreabă →'}
          </button>
        </div>
      </div>
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
