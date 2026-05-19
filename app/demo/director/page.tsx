'use client'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useIsMobile } from '../../hooks/useIsMobile'

function numRo(n: number): string {
  if (n === 0) return 'zero'
  const ones = ['', 'unu', 'doi', 'trei', 'patru', 'cinci', 'șase', 'șapte', 'opt', 'nouă',
    'zece', 'unsprezece', 'doisprezece', 'treisprezece', 'paisprezece', 'cincisprezece',
    'șaisprezece', 'șaptesprezece', 'optsprezece', 'nouăsprezece']
  const tens = ['', '', 'douăzeci', 'treizeci', 'patruzeci', 'cincizeci',
    'șaizeci', 'șaptezeci', 'optzeci', 'nouăzeci']
  function conv(x: number): string {
    if (x === 0) return ''
    if (x < 20) return ones[x]
    if (x < 100) { const t = Math.floor(x / 10), o = x % 10; return o === 0 ? tens[t] : `${tens[t]} și ${ones[o]}` }
    if (x < 1000) {
      const h = Math.floor(x / 100), r = x % 100
      const s = h === 1 ? 'o sută' : h === 2 ? 'două sute' : `${ones[h]} sute`
      return r === 0 ? s : `${s} ${conv(r)}`
    }
    if (x < 1000000) {
      const th = Math.floor(x / 1000), r = x % 1000
      const m = th === 1 ? 'o mie' : th === 2 ? 'două mii' : `${conv(th)} mii`
      return r === 0 ? m : `${m} ${conv(r)}`
    }
    return String(x)
  }
  return conv(n)
}

function prepareForSpeech(text: string): string {
  let s = text
  s = s.replace(/\bISJ\b/g, 'I S J')
     .replace(/\bPNRR\b/g, 'P N R R')
     .replace(/\bAI\b/g, 'Ei Ai')
     .replace(/nr\./gi, 'numărul')
     .replace(/\bpct\./gi, 'punctul')
  s = s.replace(/[\u{1F300}-\u{1FFFF}]/gu, '').replace(/[*_~`#]/g, '')
  s = s.replace(/(\d+)\s*mai\s*(\d{4})/gi, (_, d, y) => `${numRo(parseInt(d))} mai ${numRo(parseInt(y))}`)
  s = s.replace(/\b(\d+)\/(\d{4})\b/g, (_, n, y) => `${numRo(parseInt(n))} din ${numRo(parseInt(y))}`)
  s = s.replace(/\b(\d{1,9})\b/g, (_, n) => numRo(parseInt(n)))
  return s.trim()
}

function getVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  return voices.find(v => v.lang.startsWith('ro') && v.name.toLowerCase().includes('female'))
    || voices.find(v => v.lang.startsWith('ro') && (v.name.includes('Ioana') || v.name.includes('Carmen') || v.name.includes('Maria')))
    || voices.find(v => v.lang.startsWith('ro'))
    || voices.find(v => v.lang.startsWith('en-GB'))
    || voices[0]
    || null
}

function splitSentences(text: string): string[] {
  return text.split(/(?<=[.!?…])\s+|(?<=—)\s*/).map(s => s.trim()).filter(s => s.length > 0)
}

function speak(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const clean = prepareForSpeech(text)
  const sentences = splitSentences(clean)
  if (sentences.length === 0) { onEnd?.(); return }
  const voice = getVoice()
  function makeUtt(s: string): SpeechSynthesisUtterance {
    const u = new SpeechSynthesisUtterance(s)
    u.lang = 'ro-RO'
    u.rate = 1.0
    u.pitch = 1.0
    u.volume = 1
    if (voice) u.voice = voice
    return u
  }
  let index = 0
  function speakNext() {
    if (index >= sentences.length) { onEnd?.(); return }
    const u = makeUtt(sentences[index])
    index++
    const lastChar = sentences[index - 1].slice(-1)
    const pause = (lastChar === '.' || lastChar === '!' || lastChar === '?') ? 280 : 180
    u.onend = () => setTimeout(speakNext, pause)
    window.speechSynthesis.speak(u)
  }
  speakNext()
}

const NOTIFICARI = [
  { id: 1, titlu: 'Metodologie Evaluare Națională 2026', data: '19 mai 2026', citit: false, urgent: true, tip: 'Metodologie', sursa: 'Inspector Național' },
  { id: 2, titlu: 'Circular nr. 1247/2026 — Raportare absențe mai 2026', data: '17 mai 2026', citit: false, urgent: true, tip: 'Circular', sursa: 'ISJ Dolj' },
  { id: 3, titlu: 'Procedura nr. 892/2026 — Examene naționale 2026', data: '14 mai 2026', citit: true, urgent: false, tip: 'Procedură', sursa: 'ISJ Dolj' },
  { id: 4, titlu: 'Adresa nr. 2103/2026 — Dotări informatice PNRR', data: '10 mai 2026', citit: true, urgent: false, tip: 'Adresă', sursa: 'Inspector Național' },
  { id: 5, titlu: 'Circular nr. 1198/2026 — Situație statistică an școlar', data: '5 mai 2026', citit: true, urgent: false, tip: 'Circular', sursa: 'ISJ Dolj' },
]

type Msg = { role: 'user' | 'assistant'; content: string }

export default function DirectorPage() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [tab, setTab] = useState<'notificari' | 'bot' | 'chat'>('notificari')
  const [notificari, setNotificari] = useState(NOTIFICARI)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<{ role: string; text: string }[]>([])
  const [chatInput, setChatInput] = useState('')
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const unread = notificari.filter(n => !n.citit).length

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function markRead(id: number) {
    setNotificari(prev => prev.map(n => n.id === id ? { ...n, citit: true } : n))
  }

  async function sendBot() {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    const newMessages: Msg[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)
    try {
      const res = await fetch('/api/demo-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()
      const reply = data.text || 'Eroare. Contactați ISJ.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
      if (voiceEnabled) {
        setSpeaking(true)
        speak(reply, () => setSpeaking(false))
      }
    } catch {
      const errMsg = 'Eroare de conexiune. Contactați ISJ la zero două cinci unu, patru unu unu, cinci două două.'
      setMessages(prev => [...prev, { role: 'assistant', content: 'Eroare de conexiune. Contactați ISJ la 0251 411 522.' }])
      if (voiceEnabled) { setSpeaking(true); speak(errMsg, () => setSpeaking(false)) }
    }
    setLoading(false)
  }

  function sendChat() {
    if (!chatInput.trim()) return
    const msg = chatInput
    setChatInput('')
    setChatHistory(h => [...h, { role: 'director', text: msg }])
    setTimeout(() => {
      setChatHistory(h => [...h, { role: 'isj', text: 'Mesaj primit. Vă vom răspunde în cel mai scurt timp. — ISJ Dolj' }])
    }, 1000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>

      {/* Topbar */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: isMobile ? '8px 12px' : '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '56px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => router.push('/demo')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Demo</button>
          <div style={{ width: 1, height: 20, background: '#334155' }} />
          <span style={{ fontSize: isMobile ? '12px' : '13px', color: '#fff', fontWeight: 600 }}>🏫 {isMobile ? 'Amărăștii de Jos' : 'Liceul Teoretic Amărăștii de Jos'}</span>
          <span style={{ background: '#064e3b', color: '#6ee7b7', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>DIRECTOR</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Director: <strong style={{ color: '#e2e8f0' }}>Ion Marin</strong></span>
          {unread > 0 && (
            <span style={{ background: '#dc2626', color: '#fff', fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>
              🔔 {unread} nou{unread > 1 ? 'ă' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: isMobile ? '12px 12px 0' : '20px 24px 0', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '4px', background: '#1e293b', padding: '4px', borderRadius: '10px', width: isMobile ? '100%' : 'fit-content' }}>
          {[
            { key: 'notificari', label: `🔔 Notificări ISJ${unread > 0 ? ` (${unread})` : ''}` },
            { key: 'bot', label: '🤖 Asistent AI' },
            { key: 'chat', label: '💬 Chat cu ISJ' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as 'notificari' | 'bot' | 'chat')}
              style={{
                background: tab === t.key ? '#059669' : 'none',
                color: tab === t.key ? '#fff' : '#64748b',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 18px',
                fontSize: '13px',
                fontWeight: tab === t.key ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: isMobile ? '12px' : '16px 24px 24px', maxWidth: '900px', margin: '0 auto' }}>

        {/* NOTIFICARI */}
        {tab === 'notificari' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notificari.map(n => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                style={{
                  background: '#1e293b',
                  border: `1px solid ${!n.citit ? (n.sursa === 'Inspector Național' ? '#3b82f6' : '#f59e0b') : '#334155'}`,
                  borderRadius: '10px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 44, height: 44, background: !n.citit ? (n.sursa === 'Inspector Național' ? '#1d4ed8' : '#92400e') : '#1e293b', border: `1px solid ${!n.citit ? '#f59e0b' : '#334155'}`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>📄</div>
                  {!n.citit && (
                    <div style={{ position: 'absolute', top: -4, right: -4, width: 12, height: 12, background: '#ef4444', borderRadius: '50%', border: '2px solid #0f172a' }} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    {!n.citit && <span style={{ background: '#92400e', color: '#fcd34d', fontSize: '10px', fontWeight: 700, padding: '1px 8px', borderRadius: '20px' }}>NOU</span>}
                    {n.urgent && !n.citit && <span style={{ background: '#7f1d1d', color: '#fca5a5', fontSize: '10px', fontWeight: 700, padding: '1px 8px', borderRadius: '20px' }}>URGENT</span>}
                    <span style={{ background: '#1e40af', color: '#93c5fd', fontSize: '10px', fontWeight: 600, padding: '1px 8px', borderRadius: '20px' }}>{n.tip}</span>
                    <span style={{ background: n.sursa === 'Inspector Național' ? '#1d4ed8' : '#064e3b', color: n.sursa === 'Inspector Național' ? '#93c5fd' : '#6ee7b7', fontSize: '10px', fontWeight: 700, padding: '1px 8px', borderRadius: '20px' }}>
                      {n.sursa === 'Inspector Național' ? '🇾🇴 Inspector Național' : '🏛️ ISJ Dolj'}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: !n.citit ? 700 : 500, color: !n.citit ? '#f1f5f9' : '#94a3b8' }}>{n.titlu}</div>
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>{n.sursa} · {n.data}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {n.citit
                    ? <span style={{ fontSize: '12px', color: '#22c55e' }}>✓ Citit</span>
                    : <span style={{ fontSize: '13px', fontWeight: 600, color: '#f59e0b' }}>Apasă pentru citire →</span>
                  }
                </div>
              </div>
            ))}

            {notificari.every(n => n.citit) && (
              <div style={{ textAlign: 'center', padding: '32px', color: '#22c55e', fontSize: '14px' }}>
                ✅ Toate documentele au fost citite!
              </div>
            )}
          </div>
        )}

        {/* CHATBOT AI */}
        {tab === 'bot' && (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🤖</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Asistent AI ISJ Dolj
                  {speaking && (
                    <span style={{ fontSize: '11px', color: '#a78bfa', background: 'rgba(167,139,250,0.15)', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>
                      🔊 vorbește...
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: '#22c55e' }}>● Online · Cunoaște toate documentele ISJ Dolj</div>
              </div>
              <button
                onClick={() => {
                  if (voiceEnabled) { window.speechSynthesis?.cancel(); setSpeaking(false) }
                  setVoiceEnabled(v => !v)
                }}
                title={voiceEnabled ? 'Oprește vocea' : 'Activează vocea'}
                style={{
                  background: voiceEnabled ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${voiceEnabled ? '#7c3aed' : '#334155'}`,
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '18px',
                  cursor: 'pointer',
                  color: voiceEnabled ? '#a78bfa' : '#475569',
                  lineHeight: 1,
                }}
              >
                {voiceEnabled ? '🔊' : '🔇'}
              </button>
            </div>

            <div style={{ height: '360px', overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>🤖</div>
                  <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>Bună ziua! Sunt asistentul AI al ISJ Dolj.<br />Puteți întreba orice despre documentele oficiale.</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                    {[
                      'Când trebuie depus raportul de absențe?',
                      'Ce comisii trebuie formate pentru Bacalaureat?',
                      'Care sunt școlile cu dotări PNRR?',
                    ].map(q => (
                      <button
                        key={q}
                        onClick={() => { setInput(q) }}
                        style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', color: '#94a3b8', cursor: 'pointer' }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '8px', alignItems: 'flex-end' }}>
                  {m.role === 'assistant' && (
                    <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>🤖</div>
                  )}
                  <div style={{
                    maxWidth: '75%',
                    background: m.role === 'user' ? '#059669' : '#0f172a',
                    border: m.role === 'assistant' ? '1px solid #334155' : 'none',
                    borderRadius: m.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    color: '#f1f5f9',
                    lineHeight: 1.6,
                  }}>
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                  <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🤖</div>
                  <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px 12px 12px 4px', padding: '10px 14px' }}>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>Caut în documentele ISJ...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '12px', borderTop: '1px solid #334155', display: 'flex', gap: '8px' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendBot()}
                placeholder="Întrebați despre orice document ISJ..."
                style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#e2e8f0', outline: 'none' }}
              />
              <button
                onClick={sendBot}
                disabled={loading}
                style={{ background: loading ? '#334155' : '#059669', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? '...' : 'Întreabă'}
              </button>
            </div>
          </div>
        )}

        {/* CHAT CU ISJ */}
        {tab === 'chat' && (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 36, height: 36, background: '#1d4ed8', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🏛️</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>ISJ Dolj — Canal Oficial</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Comunicare directă cu inspectoratul</div>
              </div>
            </div>

            <div style={{ height: '360px', overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ textAlign: 'center', padding: '16px' }}>
                <span style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '20px', padding: '4px 14px', fontSize: '11px', color: '#64748b' }}>Astăzi · 19 mai 2026</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ maxWidth: '70%', background: '#0f172a', border: '1px solid #334155', borderRadius: '12px 12px 12px 4px', padding: '10px 14px', fontSize: '13px', color: '#f1f5f9', lineHeight: 1.6 }}>
                  <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>ISJ Dolj · 08:15</div>
                  Vă reamintim că termenul pentru raportul de absențe (Circular 1247/2026) este <strong>25 mai 2026</strong>. Vă rugăm să transmiteți formularul completat prin platformă.
                </div>
              </div>
              {chatHistory.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'director' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '70%',
                    background: m.role === 'director' ? '#059669' : '#0f172a',
                    border: m.role === 'isj' ? '1px solid #334155' : 'none',
                    borderRadius: m.role === 'director' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    color: '#f1f5f9',
                    lineHeight: 1.6,
                  }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{m.role === 'director' ? 'Director Marin · acum' : 'ISJ Dolj · acum'}</div>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '12px', borderTop: '1px solid #334155', display: 'flex', gap: '8px' }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChat()}
                placeholder="Scrieți un mesaj către ISJ Dolj..."
                style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#e2e8f0', outline: 'none' }}
              />
              <button onClick={sendChat} style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Trimite</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
