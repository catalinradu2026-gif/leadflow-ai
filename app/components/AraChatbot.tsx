'use client'
import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { speak } from '../edu/tts'

type Msg = { role: 'user' | 'assistant'; content: string }
type UserCtx = { titlu: string; rol: string; nume: string }

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
  '/edu/diriginte': 'Portal Diriginte — EDU Digital',
  '/edu/elevi': 'Portal Elevi — Pregătire Examene',
  '/scoala': 'Portal Școală',
  '/gradinita': 'Portal Grădiniță',
  '/demo': 'Portal ISJ',
  '/demo/inspector': 'Platformă ARACIP — Inspector Național',
  '/demo/director': 'Portal Director',
  '/demo/isj': 'Portal ISJ Dolj',
}

const QUICK_QUESTIONS: Record<string, string[]> = {
  default: [
    'Ce documente trebuie pentru autorizare?',
    'Cât durează acreditarea? Există taxe?',
    'Care sunt cele mai frecvente probleme la vizita ARACIP?',
    'Ce este Planul de Dezvoltare Instituțională?',
  ],
  autorizare: [
    'Lista completă documente autorizare',
    'Avizele ISU și DSP — cum le obțin?',
    'Ce se întâmplă dacă dosarul e incomplet?',
    'Poate fi respinsă cererea? Ce fac atunci?',
  ],
  acreditare: [
    'Ce verifică comisia în prima zi de vizită?',
    'Câte proceduri operaționale sunt obligatorii?',
    'Simulează o întrebare a comisiei ARACIP',
    'PDI — ce trebuie să conțină obligatoriu?',
  ],
  evaluare_periodica: [
    'Ce e diferit față de prima acreditare?',
    'Nesatisfăcător la periodică — ce se întâmplă?',
    'PDI — trebuie să fie același sau actualizat?',
    'Comisia verifică recomandările anterioare?',
  ],
  bac_mat: [
    'Studiul funcției — pași complet',
    'Integrala definită prin Leibniz-Newton',
    'Derivate compuse — cu exemple',
    'Generează un subiect III complet BAC',
  ],
  bac_ro: [
    'Structura eseului 400 cuvinte pas cu pas',
    'Text argumentativ subiectul I — cum îl scriu?',
    'Ion Rebreanu — idei eseu personaj',
    'Figuri de stil — listă cu exemple',
  ],
  edu: [
    'Ce este AI explicat simplu?',
    'Cum funcționează ChatGPT pe înțelesul meu?',
    'Ce cariere există în AI în România?',
    'Cum fac primul meu program cu AI?',
  ],
  diriginte: [
    'Codul nu merge — ce verific?',
    'Cum generez conturi pentru toți elevii dintr-o dată?',
    'Cum printez raportul de activitate al clasei?',
    'Elevii nu văd platforma — ce e greșit?',
  ],
  elevi: [
    'Nu știu de unde să încep — fă-mi un plan',
    'Capitolele cele mai grele la BAC matematică',
    'Eseu BAC română — structura completă',
    'Dă-mi un exercițiu și corectează-mă',
  ],
  scoala: [
    'Cum intru ca director în portal?',
    'Ce poate face un diriginte în platformă?',
    'Elevii cum accesează pregătirea BAC?',
    'Ce modul e potrivit pentru profesorii mei?',
  ],
  gradinita: [
    'Generează un plan de activitate tematică',
    'Fișe de lucru pentru grupa mare (5-6 ani)',
    'Documente obligatorii director grădiniță',
    'Cum explic AI-ul copiilor de 5 ani?',
  ],
  inspector: [
    'Unități cu Nesatisfăcător în ultimul ciclu',
    'Procedura de contestație — pași și termene',
    'Cum se calculează calificativul final?',
    'Statistici evaluări pe regiuni 2025-2026',
  ],
  isj: [
    'Raportare absențe mai — ce unități nu au trimis?',
    'Comisii EN — termen și procedură',
    'Unități beneficiare dotări PNRR Dolj',
    'Format Excel situație statistică finalizare an',
  ],
  director: [
    'Ce trebuie făcut pentru Circular 1247 absențe?',
    'Comisii examene naționale — cum le constitui?',
    'PNRR dotări — ce semnez la livrare?',
    'Cum contest o decizie ARACIP?',
  ],
  profesor: [
    'Prompt gata pentru planul de lecție de mâine',
    'Generează 10 itemi grilă pentru materia mea',
    'Cum detectez dacă elevul a folosit AI?',
    'Instrumente AI gratuite pentru profesori',
  ],
}

function getGreeting(pathname: string): string {
  if (pathname === '/acreditare/autorizare')
    return 'Bună ziua! Sunt ARA, asistentul digital al ARACIP. Vă pot ajuta cu lista de documente necesare, termenele de procesare și avizele obligatorii pentru autorizare. Cu ce vă pot ajuta?'
  if (pathname === '/acreditare/acreditare-scolara')
    return 'Bună ziua! Sunt ARA, asistentul digital al ARACIP. Vă ghidez prin pregătirea dosarului de acreditare și prin criteriile verificate de comisie la vizită. Cu ce vă pot ajuta?'
  if (pathname === '/acreditare/evaluare-periodica')
    return 'Bună ziua! Sunt ARA, asistentul digital al ARACIP. Evaluarea periodică se desfășoară la fiecare 5 ani și presupune un dosar actualizat față de prima acreditare. Cu ce vă pot ajuta?'
  if (pathname === '/acreditare/dashboard')
    return 'Bună ziua! Sunt ARA, asistentul digital al ARACIP. Pe acest tablou de bord monitorizați statusul acreditărilor din întreaga țară. Cu ce vă pot ajuta?'
  if (pathname === '/acreditare/registre')
    return 'Bună ziua! Sunt ARA, asistentul digital al ARACIP. Registrele naționale conțin toate cele ~11.500 unități școlare — acreditate, autorizate sau cu proceduri în curs. Cu ce vă pot ajuta?'
  if (pathname === '/acreditare/legislatie')
    return 'Bună ziua! Sunt ARA, asistentul digital al ARACIP. Vă ajut să identificați actele normative relevante pentru situația dumneavoastră — autorizare, acreditare sau contestație. Cu ce vă pot ajuta?'
  if (pathname === '/acreditare/faq')
    return 'Bună ziua! Sunt ARA, asistentul digital al ARACIP. Dacă nu găsiți răspunsul în lista de mai jos, întrebați-mă direct. Cu ce vă pot ajuta?'
  if (pathname === '/aracip')
    return 'Bună ziua! Sunt ARA, asistentul digital oficial al ARACIP — Agenția Română de Asigurare a Calității în Învățământul Preuniversitar. Cu ce vă pot ajuta?'
  if (pathname === '/edu/diriginte')
    return 'Bună ziua! Sunt ARA, asistentul platformei EDU Digital. Vă ajut să activați sesiunea de dirigenție, să gestionați conturile elevilor și să monitorizați activitatea clasei. Cu ce vă pot ajuta?'
  if (pathname === '/edu/elevi')
    return 'Salut! Sunt ARA, profesorul tău AI pentru pregătirea examenelor. Te ajut la BAC și la Evaluarea Națională — exerciții, explicații și subiecte model. Cu ce începem?'
  if (pathname === '/scoala')
    return 'Bună ziua! Sunt ARA, asistentul Portalului Școală. Vă pot îndruma spre secțiunea potrivită — director, diriginte, profesori sau elevi. Cu ce vă pot ajuta?'
  if (pathname === '/gradinita')
    return 'Bună ziua! Sunt ARA, asistentul Portalului Grădiniță. Vă pot ajuta cu planuri de activitate, fișe didactice și documentele administrative obligatorii. Cu ce vă pot ajuta?'
  if (pathname === '/demo/inspector')
    return 'Bună ziua! Sunt ARA, asistentul platformei ARACIP. Aveți acces la statusul acreditărilor din întreaga țară, calendarul evaluărilor și statisticile pe județe. Cu ce vă pot ajuta?'
  if (pathname === '/demo/isj')
    return 'Bună ziua! Sunt ARA, asistentul platformei ISJ Dolj. Aveți trei termene active în această perioadă — raportare absențe, comisii examene și situație statistică. Cu ce vă pot ajuta?'
  if (pathname === '/demo/director')
    return 'Bună ziua! Sunt ARA, asistentul portalului dumneavoastră. Aveți trei documente active de la ISJ Dolj care necesită acțiune. Cu ce vă pot ajuta?'
  if (pathname.includes('/bac/matematica'))
    return 'Salut! Sunt ARA, profesorul tău AI de matematică pentru BAC. Îți explic orice capitol, generez exerciții și corectez rezolvările pas cu pas. Cu ce începem?'
  if (pathname.includes('/bac/romana'))
    return 'Salut! Sunt ARA, profesorul tău AI de română pentru BAC. Te ajut cu eseul, textul argumentativ și autorii din programă. Cu ce începem?'
  if (pathname.includes('/bac/materie'))
    return 'Salut! Sunt ARA, profesorul tău AI pentru această materie de BAC. Îți explic capitolele, generez exerciții și corectez răspunsurile tale. Cu ce începem?'
  if (pathname.includes('/cursuri-ai'))
    return 'Salut! Sunt ARA, profesorul tău de inteligență artificială. Îți explic totul de la zero — algoritmi, machine learning, rețele neuronale — fără jargon inutil. Cu ce începem?'
  if (pathname.includes('/cursuri-profesori'))
    return 'Bună ziua! Sunt ARA, mentorul dumneavoastră pentru formare continuă în utilizarea inteligenței artificiale la clasă. Cu ce vă pot ajuta?'
  if (pathname.includes('/capacitate') || pathname.includes('/evaluare-nationala'))
    return 'Salut! Sunt ARA, profesorul tău AI pentru Evaluarea Națională. Te pregătesc la matematică și română — teorie, exerciții și subiecte model. Cu ce începem?'
  if (pathname.includes('/demo'))
    return 'Bună ziua! Sunt ARA, asistentul platformei ISJ. Vă pot ajuta cu documentele, termenele și procedurile active. Cu ce vă pot ajuta?'
  return 'Bună ziua! Sunt ARA, asistentul digital al ARACIP. Cu ce vă pot ajuta?'
}

function getQuickQuestions(pathname: string): string[] {
  if (pathname === '/acreditare/autorizare') return QUICK_QUESTIONS.autorizare
  if (pathname === '/acreditare/acreditare-scolara') return QUICK_QUESTIONS.acreditare
  if (pathname === '/acreditare/evaluare-periodica') return QUICK_QUESTIONS.evaluare_periodica
  if (pathname.includes('bac/matematica')) return QUICK_QUESTIONS.bac_mat
  if (pathname.includes('bac/romana')) return QUICK_QUESTIONS.bac_ro
  if (pathname.includes('bac/materie')) return QUICK_QUESTIONS.bac_mat
  if (pathname === '/edu/diriginte') return QUICK_QUESTIONS.diriginte
  if (pathname === '/edu/elevi') return QUICK_QUESTIONS.elevi
  if (pathname === '/scoala') return QUICK_QUESTIONS.scoala
  if (pathname === '/gradinita') return QUICK_QUESTIONS.gradinita
  if (pathname === '/demo/inspector') return QUICK_QUESTIONS.inspector
  if (pathname === '/demo/isj') return QUICK_QUESTIONS.isj
  if (pathname === '/demo/director') return QUICK_QUESTIONS.director
  if (pathname.includes('cursuri-ai')) return QUICK_QUESTIONS.edu
  if (pathname.includes('cursuri-profesori')) return QUICK_QUESTIONS.profesor
  if (pathname.includes('capacitate')) return QUICK_QUESTIONS.elevi
  return QUICK_QUESTIONS.default
}

export default function AraChatbot() {
  const pathname = usePathname()
  if (pathname === '/') return null
  const pagina = PAGE_LABELS[pathname] || 'Platformă ARACIP'
  const quickQuestions = getQuickQuestions(pathname)

  const [open, setOpen] = useState(false)
  const [userCtx, setUserCtx] = useState<UserCtx | null>(null)
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: getGreeting(pathname) }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(0)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<any>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const greetingSpokenRef = useRef(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ara_user')
      if (saved) setUserCtx(JSON.parse(saved))
    } catch {}
  }, [])

  function startListening() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      alert('Microfonul nu este suportat în acest browser. Folosiți Chrome sau Edge pe desktop, sau Safari/Chrome pe mobil.')
      return
    }
    if (listening) { recognitionRef.current?.stop(); setListening(false); return }
    window.speechSynthesis?.cancel()
    setSpeaking(false)
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

  useEffect(() => {
    if (open) {
      setUnread(0)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
      if (!greetingSpokenRef.current && voiceEnabled && messages[0]?.content) {
        greetingSpokenRef.current = true
        setSpeaking(true)
        speak(messages[0].content, () => setSpeaking(false))
      }
    }
  }, [open])

  async function send(text?: string) {
    const content = text || input.trim()
    if (!content || loading) return
    setInput('')
    const newMessages: Msg[] = [...messages, { role: 'user', content }]
    setMessages(newMessages)
    setLoading(true)
    try {
      let pageContext: unknown = undefined
      try { pageContext = (window as unknown as { __araPageContext?: unknown }).__araPageContext } catch {}
      const res = await fetch('/api/acreditare-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, pagina, userIdentity: userCtx, pageContext }),
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
          position: 'fixed', bottom: '90px', right: '12px', left: 'auto', zIndex: 9999,
          width: 'min(360px, calc(100vw - 24px))', height: 'min(560px, calc(100vh - 110px))',
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
          <div style={{ borderTop: '1px solid #334155', padding: '10px 12px', display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder={listening ? '🎙️ Ascult...' : 'Scrieți sau apăsați 🎙️...'}
              autoFocus
              style={{ flex: 1, minWidth: 0, height: '40px', background: listening ? 'rgba(239,68,68,0.07)' : '#0f172a', border: `1px solid ${listening ? '#ef4444' : '#334155'}`, borderRadius: '8px', padding: '0 12px', fontSize: '14px', color: '#e2e8f0', outline: 'none', fontFamily: 'inherit', transition: 'all 0.2s' }}
            />
            <button onClick={startListening} title={listening ? 'Oprește microfonul' : 'Vorbește cu ARA'} style={{ background: listening ? 'rgba(239,68,68,0.25)' : 'rgba(124,58,237,0.2)', border: `1px solid ${listening ? '#ef4444' : '#7c3aed'}`, borderRadius: '8px', width: '40px', height: '40px', flexShrink: 0, cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: listening ? 'pulse 1s infinite' : 'none', padding: 0 }}>
              🎙️
            </button>
            <button onClick={() => send()} disabled={!input.trim() || loading} title="Trimite mesaj" style={{ background: input.trim() && !loading ? '#7c3aed' : '#334155', color: '#fff', border: 'none', borderRadius: '8px', width: '40px', height: '40px', flexShrink: 0, cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
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
