'use client'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { speak } from '../tts'

const MODULE = [
  {
    id: 1,
    titlu: 'Ce este Inteligența Artificială?',
    descriere: 'Descoperă cum funcționează AI-ul și de ce a devenit cel mai important instrument al secolului 21.',
    icon: '🧠',
    culoare: '#6366f1',
    culoareBg: 'rgba(99,102,241,0.1)',
  },
  {
    id: 2,
    titlu: 'Cum te ajută AI la școală?',
    descriere: 'Metode concrete prin care AI-ul poate fi asistentul tău de studiu pentru orice materie.',
    icon: '📖',
    culoare: '#8b5cf6',
    culoareBg: 'rgba(139,92,246,0.1)',
  },
  {
    id: 3,
    titlu: 'Cum înveți mai eficient cu AI?',
    descriere: 'Tehnici de învățare adaptivă — AI-ul îți explică până înțelegi, în ritmul tău.',
    icon: '⚡',
    culoare: '#06b6d4',
    culoareBg: 'rgba(6,182,212,0.1)',
  },
  {
    id: 4,
    titlu: 'Cum îți organizezi temele cu AI?',
    descriere: 'Planificare inteligentă, priorități și gestionarea timpului cu ajutorul inteligenței artificiale.',
    icon: '📅',
    culoare: '#10b981',
    culoareBg: 'rgba(16,185,129,0.1)',
  },
  {
    id: 5,
    titlu: 'AI pentru proiecte și cercetare',
    descriere: 'Cum să folosești AI pentru a căuta, analiza și structura informații pentru referate și proiecte.',
    icon: '🔬',
    culoare: '#f59e0b',
    culoareBg: 'rgba(245,158,11,0.1)',
  },
  {
    id: 6,
    titlu: 'Limitele AI — ce nu poate face?',
    descriere: 'Gândire critică: când să ai încredere în AI și când să verifici informațiile din alte surse.',
    icon: '⚠️',
    culoare: '#ef4444',
    culoareBg: 'rgba(239,68,68,0.1)',
  },
  {
    id: 7,
    titlu: 'Etica folosirii AI în școală',
    descriere: 'Ce este permis, ce nu este, și cum să folosești AI corect și responsabil ca elev.',
    icon: '⚖️',
    culoare: '#64748b',
    culoareBg: 'rgba(100,116,139,0.1)',
  },
  {
    id: 8,
    titlu: 'Viitorul tău cu AI',
    descriere: 'Cariere, oportunități și cum arată lumea în care tu și AI-ul lucrați împreună.',
    icon: '🚀',
    culoare: '#ec4899',
    culoareBg: 'rgba(236,72,153,0.1)',
  },
]

const SYSTEM_PROMPTS: Record<number, string> = {
  1: `Ești un profesor AI prietenos și entuziast care predă elevilor de gimnaziu și liceu din România despre inteligența artificială.
Modulul curent: "Ce este Inteligența Artificială?"

CONȚINUT DE PREDAT:
- AI înseamnă că un calculator poate face lucruri care necesită de obicei inteligență umană: să recunoască imagini, să înțeleagă limbaj, să ia decizii
- AI învață din exemple — dacă i se arată mii de fotografii cu câini, învață să recunoască câini
- Tipuri de AI: recunoaștere vocală (asistentul telefonului), traducere automată, recomandări (ce să urmărești pe YouTube), diagnostic medical
- AI nu gândește ca un om — nu are emoții, nu înțelege contextul, nu are conștiință
- Cele mai cunoscute AI-uri: ChatGPT, Google Gemini, Copilot Microsoft

STIL DE PREDARE:
- Pune întrebări elevilor pentru a verifica înțelegerea
- Folosește exemple din viața reală: medicină, meteorologie, astronomie, traducere
- Explică simplu, fără jargon tehnic
- La fiecare concept nou, întreabă "Ați înțeles? Aveți întrebări?"
- Dacă clasa răspunde greșit, explică cu răbdare
- Vorbește la plural (clasa) sau singular după context
- Limba română, ton cald și profesional`,

  2: `Ești un profesor AI care predă elevilor cum să folosească AI ca instrument de studiu.
Modulul curent: "Cum te ajută AI la școală?"

CONȚINUT DE PREDAT:
- AI poate explica orice lecție dificilă în moduri diferite până înțelegi
- Poate genera exerciții și probleme la orice nivel de dificultate
- Poate rezuma texte lungi în puncte cheie
- Poate corecta compuneri și eseuri, sugerând îmbunătățiri
- Poate crea fișe de recapitulare pentru orice materie
- IMPORTANT: AI-ul este asistent, nu face temele în locul tău — te ajută să înveți

EXEMPLE CONCRETE:
- Matematică: "Explică-mi derivatele pas cu pas"
- Română: "Ce trebuie să știu despre Eminescu pentru BAC?"
- Biologie: "Rezumă ciclul Krebs în 5 puncte"
- Istorie: "Care sunt cauzele Primului Război Mondial?"

STIL: întrebări interactive, exemple practice, ton prietenos și educativ`,

  3: `Ești un profesor AI care predă tehnici de învățare eficientă cu AI.
Modulul curent: "Cum înveți mai eficient cu AI?"

CONȚINUT DE PREDAT:
- Tehnica Feynman cu AI: explici AI-ului ce ai înțeles, el corectează și completează
- Spaced repetition: AI generează quiz-uri la intervale optime
- Active recall: nu recitești notițele, ci îi ceri AI-ului să te testeze
- Învățare adaptivă: AI identifică unde ai lacune și se concentrează acolo
- Cum să pui întrebări bune unui AI (prompt writing de bază)

EXEMPLE DE PROMPTS BUNE:
- "Testează-mă cu 5 întrebări despre fotosinteza"
- "Explică-mi ca și cum aș avea 12 ani"
- "Care sunt cele mai frecvente greșeli la acest subiect?"
- "Dă-mi un exercițiu mai greu decât precedentul"

STIL: practic, cu demonstrații, implică clasa în exerciții`,

  4: `Ești un profesor AI care predă organizarea studiului cu ajutorul AI.
Modulul curent: "Cum îți organizezi temele cu AI?"

CONȚINUT DE PREDAT:
- AI poate crea un plan de studiu personalizat bazat pe materii și termene
- Poate prioritiza temele după dificultate și timp disponibil
- Poate împărți o sarcină mare în pași mici și gestionabili
- Tehnica Pomodoro explicată și cum AI te poate ajuta să o aplici
- Cum să folosești AI să estimezi cât timp ai nevoie pentru o temă

EXERCIȚIU PRACTIC ÎN CLASĂ:
Propune elevilor să îți spună toate temele pe care le au această săptămână, și creează împreună un plan de studiu.

STIL: practic, organizat, cu exemple din viața de elev`,

  5: `Ești un profesor AI care predă cum să folosești AI pentru cercetare și proiecte școlare.
Modulul curent: "AI pentru proiecte și cercetare"

CONȚINUT DE PREDAT:
- Cum să cauți informații cu AI vs Google — diferențe importante
- AI poate structura un referat: introducere, cuprins, concluzii
- Poate sintetiza informații din surse multiple
- ATENȚIE CRITICĂ: AI poate da informații greșite — întotdeauna verifică sursele
- Cum să citezi corect când folosești AI în proiecte
- Diferența dintre a folosi AI ca instrument și plagiat

REGULA DE AUR:
AI este punctul de start, nu produsul final. Folosește-l să înțelegi și să structurezi, nu să copiezi.

STIL: echilibrat, cu avertismente clare despre utilizare responsabilă`,

  6: `Ești un profesor AI care predă gândire critică despre limitele AI.
Modulul curent: "Limitele AI — ce nu poate face?"

CONȚINUT DE PREDAT:
- AI poate "halucinа" — inventează fapte care par reale dar sunt false
- Nu are cunoștințe despre evenimente recente (are o dată limită de cunoștințe)
- Nu înțelege contextul emoțional și social ca un om
- Nu poate judeca etic situații complexe
- Nu înlocuiește un profesor, medic, avocat sau specialist
- Poate fi părtinitor (biased) dacă a fost antrenat pe date incomplete

EXERCIȚIU: Pune-i AI-ului o întrebare cu răspuns greșit și arată clasei cum să verifice.

MESAJ CHEIE: Un utilizator inteligent de AI știe când să aibă încredere și când să verifice.

STIL: critic, analitic, stimulează gândirea independentă`,

  7: `Ești un profesor AI care predă etica folosirii AI în școală.
Modulul curent: "Etica folosirii AI în școală"

CONȚINUT DE PREDAT:
- CE ESTE PERMIS: să folosești AI să înveți, să înțelegi, să te pregătești
- CE NU ESTE PERMIS: să trimiți ca temă proprie texte scrise integral de AI
- Plagiat cu AI: ce este, consecințe, cum îl detectează profesorii
- Dreptul la o educație autentică — de ce contează să înveți tu, nu AI-ul
- Responsabilitate digitală: datele tale, confidențialitatea
- Cum vor arăta școlile în viitor cu AI integrat corect

DISCUȚIE ÎN CLASĂ:
"Dacă AI-ul face tema, tu ce ai învățat?" — dezbatere etică

STIL: serios, cu exemple de situații reale, stimulează dezbaterea`,

  8: `Ești un profesor AI care predă despre viitorul carierei în era AI.
Modulul curent: "Viitorul tău cu AI"

CONȚINUT DE PREDAT:
- Meserii care vor crește datorită AI: ingineri AI, analiști de date, designeri UX, medici cu AI
- Meserii care se vor transforma, nu dispărea: profesori, avocați, jurnaliști, arhitecți
- Skills care contează în viitor: gândire critică, creativitate, comunicare, adaptabilitate
- Prompt engineering — o nouă competență valoroasă
- România în contextul AI european — oportunități PNRR, fonduri europene
- Cum să te pregătești: matematică, informatică, limbi străine + AI literacy

MESAJ MOTIVAȚIONAL:
Generația voastră este prima care crește cu AI. Aveți un avantaj enorm față de toate generațiile anterioare — folosiți-l.

STIL: inspirațional, optimist, concret, cu exemple de tineri români care lucrează în AI`,
}

type Msg = { role: 'user' | 'assistant'; content: string }

export default function CursuriAI() {
  const router = useRouter()
  const [modulActiv, setModulActiv] = useState<number | null>(null)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function deschideModul(id: number) {
    const modul = MODULE.find(m => m.id === id)!
    window.speechSynthesis?.cancel()
    setSpeaking(false)
    setModulActiv(id)
    const welcomeMsg = `Bună ziua! Astăzi vom explora împreună Modulul ${id}: „${modul.titlu}".\n\nSunt profesorul vostru AI și vom parcurge acest subiect împreună, pas cu pas. Voi pune întrebări pe parcurs pentru a verifica înțelegerea.\n\nSă începem! Prima întrebare pentru voi: Ați mai auzit până acum de ${modul.titlu.toLowerCase()}? Ce știți deja despre acest subiect?`
    setMessages([{ role: 'assistant', content: welcomeMsg }])
    setInput('')
    if (voiceEnabled) {
      setSpeaking(true)
      speak(welcomeMsg, () => setSpeaking(false))
    }
  }

  async function sendMsg() {
    if (!input.trim() || loading || !modulActiv) return
    const userMsg = input.trim()
    setInput('')
    const newMessages: Msg[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)
    try {
      const res = await fetch('/api/edu-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, modulId: modulActiv }),
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

  if (modulActiv) {
    const modul = MODULE.find(m => m.id === modulActiv)!
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0', display: 'flex', flexDirection: 'column' }}>

        {/* Topbar */}
        <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => setModulActiv(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Înapoi la module</button>
            <div style={{ width: 1, height: 20, background: '#334155' }} />
            <span style={{ fontSize: '22px' }}>{modul.icon}</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>Modulul {modul.id}: {modul.titlu}</div>
              <div style={{ fontSize: '11px', color: modul.culoare, display: 'flex', alignItems: 'center', gap: '6px' }}>
                ● Lecție interactivă în desfășurare
                {speaking && <span style={{ color: '#a78bfa', fontSize: '11px' }}>· 🔊 vorbește...</span>}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => { if (voiceEnabled) { window.speechSynthesis?.cancel(); setSpeaking(false) }; setVoiceEnabled(v => !v) }}
              title={voiceEnabled ? 'Oprește vocea' : 'Activează vocea'}
              style={{ background: voiceEnabled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${voiceEnabled ? modul.culoare : '#334155'}`, borderRadius: '8px', padding: '5px 10px', fontSize: '16px', cursor: 'pointer', color: voiceEnabled ? modul.culoare : '#475569', lineHeight: 1 }}
            >
              {voiceEnabled ? '🔊' : '🔇'}
            </button>
            {MODULE.map(m => (
              <button
                key={m.id}
                onClick={() => deschideModul(m.id)}
                title={m.titlu}
                style={{
                  width: 28, height: 28,
                  background: m.id === modulActiv ? m.culoare : '#334155',
                  border: 'none', borderRadius: '6px',
                  fontSize: '12px', fontWeight: 700,
                  color: m.id === modulActiv ? '#fff' : '#64748b',
                  cursor: 'pointer',
                }}
              >
                {m.id}
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', maxWidth: '800px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '12px', alignItems: 'flex-start' }}>
              {m.role === 'assistant' && (
                <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${modul.culoare}, #4f46e5)`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>
                  {modul.icon}
                </div>
              )}
              <div style={{
                maxWidth: '75%',
                background: m.role === 'user' ? modul.culoare : '#1e293b',
                border: m.role === 'assistant' ? `1px solid ${modul.culoare}33` : 'none',
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
              <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${modul.culoare}, #4f46e5)`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                {modul.icon}
              </div>
              <div style={{ background: '#1e293b', border: `1px solid ${modul.culoare}33`, borderRadius: '16px 16px 16px 4px', padding: '14px 18px' }}>
                <span style={{ color: '#64748b', fontSize: '14px' }}>Profesorul AI scrie...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ background: '#1e293b', borderTop: '1px solid #334155', padding: '16px 24px', flexShrink: 0 }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMsg()}
              placeholder="Răspundeți sau puneți o întrebare profesorului AI..."
              style={{ flex: 1, background: '#0f172a', border: `1px solid ${modul.culoare}44`, borderRadius: '12px', padding: '12px 18px', fontSize: '14px', color: '#e2e8f0', outline: 'none' }}
            />
            <button
              onClick={sendMsg}
              disabled={loading}
              style={{ background: loading ? '#334155' : modul.culoare, color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
            >
              {loading ? '...' : 'Trimite →'}
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '11px', color: '#334155' }}>
            Enter pentru a trimite · Profesorul AI predă interactiv
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>

      {/* Topbar */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '16px', height: '56px' }}>
        <button onClick={() => router.push('/edu')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Edu</button>
        <div style={{ width: 1, height: 20, background: '#334155' }} />
        <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>🤖 Cursuri AI pentru Elevi</span>
        <span style={{ background: '#4338ca', color: '#a5b4fc', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>8 MODULE</span>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
            Cursuri AI Interactive
          </h1>
          <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
            Selectați modulul săptămânii. Profesorul AI predă interactiv — pune întrebări, explică și adaptează lecția pentru clasa voastră.
          </p>
        </div>

        {/* Module grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {MODULE.map(m => (
            <div
              key={m.id}
              onClick={() => deschideModul(m.id)}
              style={{
                background: m.culoareBg,
                border: `1px solid ${m.culoare}44`,
                borderRadius: '14px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.border = `1px solid ${m.culoare}`
                ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.border = `1px solid ${m.culoare}44`
                ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
              }}
            >
              <div style={{ width: 48, height: 48, background: `${m.culoare}22`, border: `1px solid ${m.culoare}44`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                {m.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ background: `${m.culoare}22`, color: m.culoare, fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>
                    SĂPTĂMÂNA {m.id}
                  </span>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9', marginBottom: '6px' }}>{m.titlu}</div>
                <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>{m.descriere}</div>
              </div>
              <div style={{ color: m.culoare, fontSize: '18px', flexShrink: 0, paddingTop: '2px' }}>→</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px', padding: '20px', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}>
          <div style={{ fontSize: '14px', color: '#64748b' }}>
            💡 <strong style={{ color: '#94a3b8' }}>Pentru profesori:</strong> Deschideți modulul pe proiector și ghidați conversația cu clasa. Profesorul AI se adaptează la răspunsurile elevilor.
          </div>
        </div>
      </div>
    </div>
  )
}
