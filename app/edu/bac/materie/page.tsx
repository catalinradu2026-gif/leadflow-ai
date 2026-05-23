'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect, Suspense } from 'react'
import { speak } from '../../tts'
import { useIsMobile } from '../../../hooks/useIsMobile'

type Msg = { role: 'user' | 'assistant'; content: string }

type MaterieConfig = {
  label: string
  icon: string
  culoare: string
  culoareLight: string
  culoareBg: string
  subtitle: string
  intrebari: string[]
  capitole: string[]
}

const MATERII: Record<string, MaterieConfig> = {
  biologie: {
    label: 'Biologie',
    icon: '🧬',
    culoare: '#16a34a',
    culoareLight: '#86efac',
    culoareBg: 'rgba(34,197,94,0.06)',
    subtitle: 'Celulă, genetică, anatomie, ecologie, botanică',
    intrebari: [
      'Explică structura celulei eucariote',
      'Ce este ADN-ul și cum funcționează?',
      'Explică legile lui Mendel',
      'Cum funcționează sistemul circulator?',
      'Generează un subiect complet BAC biologie',
    ],
    capitole: [
      'Celula — structură și funcții',
      'Diviziunea celulară (mitoză, meioză)',
      'Genetică — legile Mendel',
      'ADN, ARN, sinteza proteică',
      'Anatomia omului — sisteme',
      'Ecologie și ecosisteme',
      'Botanică — plante',
      'Zoologie — animale',
      'Microbiologie',
    ],
  },
  fizica: {
    label: 'Fizică',
    icon: '⚡',
    culoare: '#4f46e5',
    culoareLight: '#a5b4fc',
    culoareBg: 'rgba(99,102,241,0.06)',
    subtitle: 'Mecanică, electricitate, termodinamică, optică, fizică modernă',
    intrebari: [
      'Explică legile lui Newton cu exemple',
      'Cum calculez energia cinetică și potențială?',
      'Explică legea lui Ohm și circuitele electrice',
      'Ce este interferența și difracția?',
      'Generează un subiect complet BAC fizică',
    ],
    capitole: [
      'Cinematică — mișcarea uniformă și accelerată',
      'Dinamică — legile Newton',
      'Lucru mecanic și energie',
      'Oscilații și unde',
      'Termodinamică — gaze, căldură',
      'Electrostatică — câmp electric',
      'Curent electric — legea Ohm',
      'Magnetism și inducție electromagnetică',
      'Optică — reflexie, refracție, difracție',
      'Fizică modernă — cuante, nuclee',
    ],
  },
  chimie: {
    label: 'Chimie',
    icon: '🧪',
    culoare: '#db2777',
    culoareLight: '#fbcfe8',
    culoareBg: 'rgba(236,72,153,0.06)',
    subtitle: 'Chimie organică și anorganică, reacții, stoechiometrie',
    intrebari: [
      'Explică legăturile chimice (ionice, covalente)',
      'Cum echilibrez o ecuație chimică?',
      'Explică hidrocarburile și funcțiunile organice',
      'Cum calculez concentrația unei soluții?',
      'Generează un subiect complet BAC chimie',
    ],
    capitole: [
      'Structura atomului și tabelul periodic',
      'Legăturile chimice',
      'Stoechiometrie — calcule',
      'Soluții și concentrații',
      'Chimie anorganică — acizi, baze, săruri',
      'Oxidoreducere și electroliză',
      'Hidrocarburi (alcheni, alchine, arene)',
      'Funcțiuni organice (alcooli, acizi, esteri)',
      'Polimeri și materiale',
    ],
  },
  informatica: {
    label: 'Informatică',
    icon: '💻',
    culoare: '#0d9488',
    culoareLight: '#99f6e4',
    culoareBg: 'rgba(20,184,166,0.06)',
    subtitle: 'Algoritmi, C++, structuri de date, grafuri, sortări',
    intrebari: [
      'Explică-mi recursivitatea cu exemple în C++',
      'Cum funcționează sortarea prin interclasare?',
      'Explică reprezentarea grafurilor și BFS/DFS',
      'Cum rezolv probleme cu vectori și matrice în C++?',
      'Generează un subiect complet BAC informatică',
    ],
    capitole: [
      'Algoritmi — complexitate și corectitudine',
      'Tablouri (vectori, matrice)',
      'Șiruri de caractere',
      'Subprograme și recursivitate',
      'Structuri de date (stivă, coadă, liste)',
      'Sortări (bule, inserție, selecție, quicksort)',
      'Căutare binară',
      'Grafuri — reprezentare, BFS, DFS',
      'Arbori — arbori binari de căutare',
      'Programare dinamică',
    ],
  },
  geografie: {
    label: 'Geografie',
    icon: '🌍',
    culoare: '#ea580c',
    culoareLight: '#fed7aa',
    culoareBg: 'rgba(249,115,22,0.06)',
    subtitle: 'România, Europa, geografie mondială, mediu',
    intrebari: [
      'Explică relieful României și unitățile de relief',
      'Care sunt principalele râuri din România?',
      'Explică clima și vegetația României',
      'Ce sunt resursele naturale și cum sunt folosite?',
      'Generează un subiect complet BAC geografie',
    ],
    capitole: [
      'Geografie fizică — relief, hidrografie',
      'Clima și vegetația României',
      'Solurile și resursele naturale',
      'Geografie umană — populație, orașe',
      'Economia României',
      'Europa — geografie fizică și umană',
      'Uniunea Europeană',
      'Continentele lumii',
      'Probleme de mediu globale',
    ],
  },
  istorie: {
    label: 'Istorie',
    icon: '🏛️',
    culoare: '#d97706',
    culoareLight: '#fde68a',
    culoareBg: 'rgba(245,158,11,0.06)',
    subtitle: 'România modernă și contemporană, relații internaționale',
    intrebari: [
      'Explică formarea statului național român',
      'Ce a fost Marea Unire din 1918?',
      'Explică România în al Doilea Război Mondial',
      'Ce a fost comunismul în România?',
      'Generează un subiect complet BAC istorie',
    ],
    capitole: [
      'Principatele Române — sec. XIX',
      'Unirea din 1859 — Alexandru Ioan Cuza',
      'Independența României (1877)',
      'Marea Unire 1918',
      'România interbelică',
      'Al Doilea Război Mondial',
      'Regimul comunist în România',
      'Revoluția din 1989',
      'România post-comunistă și UE',
      'Relații internaționale — Europa sec. XX',
    ],
  },
}

function MaterieChat() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const searchParams = useSearchParams()
  const materie = searchParams.get('materie') || 'biologie'
  const config = MATERII[materie] || MATERII['biologie']

  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const [showCapitole, setShowCapitole] = useState(false)
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
        body: JSON.stringify({ messages: newMessages, materie }),
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
            <div style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: 700, color: '#f1f5f9' }}>{config.label} — Profesor AI BAC</div>
            <div style={{ fontSize: '11px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ● Online · {config.subtitle}
              {speaking && <span style={{ color: config.culoareLight }}>· 🔊 vorbește...</span>}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => { if (voiceEnabled) { window.speechSynthesis?.cancel(); setSpeaking(false) }; setVoiceEnabled(v => !v) }}
            style={{ background: voiceEnabled ? `rgba(99,102,241,0.15)` : 'rgba(255,255,255,0.03)', border: `1px solid ${voiceEnabled ? config.culoare : '#334155'}`, borderRadius: '8px', padding: '5px 10px', fontSize: '16px', cursor: 'pointer', color: voiceEnabled ? config.culoareLight : '#475569' }}
          >
            {voiceEnabled ? '🔊' : '🔇'}
          </button>
          <button
            onClick={() => setShowCapitole(s => !s)}
            style={{ background: showCapitole ? `rgba(99,102,241,0.15)` : 'transparent', border: `1px solid ${showCapitole ? config.culoare : '#334155'}`, borderRadius: '8px', padding: '5px 12px', fontSize: '12px', cursor: 'pointer', color: showCapitole ? config.culoareLight : '#64748b', fontWeight: 600 }}
          >
            📋 Capitole
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Chat */}
        <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '12px' : '24px', maxWidth: showCapitole && !isMobile ? undefined : '800px', width: '100%', margin: showCapitole && !isMobile ? undefined : '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {messages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>{config.icon}</div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>
                Profesor AI {config.label} — BAC 2026
              </h2>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '32px', lineHeight: 1.7 }}>
                {config.subtitle}. Explică, rezolvă exerciții și generează subiecte complete.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '500px', margin: '0 auto' }}>
                {config.intrebari.map(q => (
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
                <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${config.culoare}, ${config.culoareLight}44)`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>
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
              <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${config.culoare}, ${config.culoareLight}44)`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{config.icon}</div>
              <div style={{ background: '#1e293b', border: `1px solid ${config.culoare}33`, borderRadius: '16px 16px 16px 4px', padding: '14px 18px' }}>
                <span style={{ color: '#64748b', fontSize: '14px' }}>Profesorul pregătește răspunsul...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Panel capitole */}
        {showCapitole && !isMobile && (
          <div style={{ width: '240px', background: '#0f172a', borderLeft: '1px solid #1e293b', overflowY: 'auto', padding: '16px', flexShrink: 0 }}>
            <div style={{ fontSize: '11px', color: '#475569', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Capitole {config.label}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {config.capitole.map(cap => (
                <button
                  key={cap}
                  onClick={() => sendMsg(`Explică-mi capitolul: ${cap}`)}
                  disabled={loading}
                  style={{ background: 'none', border: 'none', color: config.culoare, fontSize: '12px', cursor: 'pointer', textAlign: 'left', padding: '6px 4px', lineHeight: 1.5, borderRadius: '6px', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = `${config.culoare}15`)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  → {cap}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ background: '#1e293b', borderTop: '1px solid #334155', padding: '16px 24px', flexShrink: 0 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '12px' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMsg()}
            placeholder={`Întreabă despre ${config.label.toLowerCase()}...`}
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

export default function MateriePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontFamily: 'sans-serif' }}>Se încarcă...</div>}>
      <MaterieChat />
    </Suspense>
  )
}
