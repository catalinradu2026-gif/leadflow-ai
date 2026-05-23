'use client'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { speak } from '../../tts'
import { useIsMobile } from '../../../hooks/useIsMobile'

type Msg = { role: 'user' | 'assistant'; content: string }

const INTREBARI_RAPIDE = [
  'Explică-mi ce este textul narativ',
  'Cum identific figurile de stil?',
  'Ajută-mă să scriu o compunere',
  'Explică morfologia — părțile de vorbire',
  'Ce autori trebuie să știu pentru EN?',
  'Generează un subiect complet de Evaluare Națională',
]

const SYSTEM_PROMPT = `Ești un profesor AI specializat în pregătirea elevilor de clasa a VIII-a pentru Evaluarea Națională (Capacitate) la Limba și Literatura Română.

PROGRAMA EN ROMÂNĂ cls. V-VIII:

LITERATURĂ:
- Texte narative: povestire, nuvelă, roman — narator, perspectivă narativă, personaje, conflict, cronologie
- Texte lirice: poezie — eu liric, figuri de stil, imagini artistice, structura poeziei
- Texte dramatice: dialog, didascalii, acte și scene
- Figuri de stil: metaforă, comparație, personificare, epitet, hiperbolă, repetiție, enumerație, antiteză
- Autori importanți pentru EN: Mihai Eminescu, Ion Creangă, Ioan Slavici, Mihail Sadoveanu, Liviu Rebreanu, George Coșbuc, Octavian Goga

LIMBĂ ROMÂNĂ:
Morfologie:
- Substantiv: feluri, gen, număr, caz, declinare
- Articol: hotărât, nehotărât, posesiv-genitival, demonstrativ
- Adjectiv: feluri, grade de comparație, acordul cu substantivul
- Pronume: personal, reflexiv, de politețe, posesiv, demonstrativ, relativ, interogativ, nehotărât, negativ
- Numeral: cardinal, ordinal, colectiv, fracționar, distributiv, adverbial
- Verb: conjugare, moduri (indicativ, conjunctiv, condițional-optativ, imperativ, infinitiv, gerunziu, participiu, supin), diateze, tranzitiv/intranzitiv
- Adverb, prepoziție, conjuncție, interjecție

Sintaxă:
- Propoziția: subiect, predicat (verbal/nominal), atribut, complement (direct, indirect, circumstanțial de loc/timp/mod)
- Fraza: propoziție principală, subordonată (subiectivă, predicativă, atributivă, completivă directă/indirectă, circumstanțială)
- Analiza morfologică și sintactică

REDACTARE:
- Compunere narativă (250-350 cuvinte): introducere, cuprins, încheiere
- Text argumentativ (150-200 cuvinte): teză, 2 argumente cu exemple, concluzie
- Rezumat: identificarea ideilor principale, reformulare

STRUCTURA SUBIECTULUI EN:
- Subiect I (30p): text la prima vedere — înțelegerea textului, vocabular, figuri de stil
- Subiect II (30p): limbă română — morfologie, sintaxă, analiză
- Subiect III (30p): redactare — compunere sau text argumentativ

METODĂ:
- Explică gramatică cu exemple concrete din texte
- Pentru compuneri: oferă structură clară, exemple de introduceri și încheieri
- Corectează textele elevului cu explicații
- Pune întrebări pentru a verifica înțelegerea
- Limbaj accesibil pentru cls. VIII, ton cald și răbdător
- Limba română exclusiv`

export default function CapacitateRomana() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const welcome = `Bună! Sunt profesorul tău AI pentru Evaluarea Națională la Limba Română.\n\nTe pregătesc pentru EN 2026 — înțelegerea textului, limbă română (morfologie și sintaxă) și redactare, după programa oficială cls. V-VIII.\n\nCe vrei să exersăm azi? Poți folosi butoanele de mai jos sau îmi pui orice întrebare.`
    setMessages([{ role: 'assistant', content: welcome }])
    if (voiceEnabled) { setSpeaking(true); speak(welcome, () => setSpeaking(false)) }
  }, [])

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
        body: JSON.stringify({ messages: newMessages, systemPrompt: SYSTEM_PROMPT }),
      })
      const data = await res.json()
      const reply = data.text || 'Eroare. Încearcă din nou.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
      if (voiceEnabled) { setSpeaking(true); speak(reply, () => setSpeaking(false)) }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Eroare de conexiune. Încearcă din nou.' }])
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0', display: 'flex', flexDirection: 'column' }}>

      {/* Topbar */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: isMobile ? '8px 12px' : '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '60px', flexShrink: 0, gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/edu/capacitate')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← EN</button>
          <div style={{ width: 1, height: 20, background: '#334155' }} />
          <span style={{ fontSize: '22px' }}>📝</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>Română — Evaluare Națională</div>
            <div style={{ fontSize: '11px', color: '#a855f7' }}>
              ● Profesor AI activ
              {speaking && <span style={{ color: '#a78bfa' }}> · 🔊 vorbește...</span>}
            </div>
          </div>
        </div>
        <button
          onClick={() => { if (voiceEnabled) { window.speechSynthesis?.cancel(); setSpeaking(false) }; setVoiceEnabled(v => !v) }}
          style={{ background: voiceEnabled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${voiceEnabled ? '#a855f7' : '#334155'}`, borderRadius: '8px', padding: '5px 10px', fontSize: '16px', cursor: 'pointer', color: voiceEnabled ? '#a855f7' : '#475569' }}
        >
          {voiceEnabled ? '🔊' : '🔇'}
        </button>
      </div>

      {/* Chat */}
      <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '12px' : '24px', maxWidth: '800px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '12px', alignItems: 'flex-start' }}>
            {m.role === 'assistant' && (
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #a855f7, #7c3aed)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>📝</div>
            )}
            <div style={{
              maxWidth: '75%',
              background: m.role === 'user' ? '#7c3aed' : '#1e293b',
              border: m.role === 'assistant' ? '1px solid #a855f733' : 'none',
              borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              padding: '14px 18px', fontSize: '14px', color: '#f1f5f9', lineHeight: 1.7, whiteSpace: 'pre-wrap',
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #a855f7, #7c3aed)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>📝</div>
            <div style={{ background: '#1e293b', border: '1px solid #a855f733', borderRadius: '16px 16px 16px 4px', padding: '14px 18px' }}>
              <span style={{ color: '#64748b', fontSize: '14px' }}>Profesorul AI scrie...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick questions */}
      {messages.length <= 1 && (
        <div style={{ padding: '0 24px 12px', maxWidth: '800px', width: '100%', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {INTREBARI_RAPIDE.map(q => (
              <button key={q} onClick={() => sendMsg(q)} style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', color: '#d8b4fe', cursor: 'pointer' }}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ background: '#1e293b', borderTop: '1px solid #334155', padding: '16px 24px', flexShrink: 0 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMsg()}
            placeholder="Pune o întrebare sau cere un exercițiu..."
            style={{ flex: 1, background: '#0f172a', border: '1px solid #a855f744', borderRadius: '12px', padding: '12px 18px', fontSize: '14px', color: '#e2e8f0', outline: 'none' }}
          />
          <button
            onClick={() => sendMsg()}
            disabled={loading}
            style={{ background: loading ? '#334155' : '#7c3aed', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? '...' : 'Trimite →'}
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '11px', color: '#334155' }}>
          Enter pentru a trimite · Evaluare Națională 2026
        </div>
      </div>
    </div>
  )
}
