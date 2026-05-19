'use client'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { speak } from '../tts'
import { useIsMobile } from '../../hooks/useIsMobile'

const MODULE = [
  {
    id: 1,
    titlu: 'Introducere în AI pentru profesori',
    descriere: 'Ce este AI-ul, cum funcționează și de ce contează pentru educație. Noțiuni esențiale fără jargon tehnic.',
    icon: '🧠',
    culoare: '#f59e0b',
  },
  {
    id: 2,
    titlu: 'AI în pregătirea lecțiilor',
    descriere: 'Cum folosești AI să creezi planuri de lecție, materiale didactice și prezentări în timp record.',
    icon: '📋',
    culoare: '#f97316',
  },
  {
    id: 3,
    titlu: 'Evaluare și teste cu AI',
    descriere: 'Generează itemi de evaluare, grile de corectare și feedback personalizat pentru fiecare elev.',
    icon: '✅',
    culoare: '#eab308',
  },
  {
    id: 4,
    titlu: 'Predare diferențiată cu AI',
    descriere: 'Cum adaptezi conținutul pentru elevi cu nevoi diferite — supradotați, cu dificultăți de învățare sau CES.',
    icon: '🎯',
    culoare: '#84cc16',
  },
  {
    id: 5,
    titlu: 'Feedback rapid și corectare',
    descriere: 'AI pentru corectarea lucrărilor, feedback instant și rapoarte de progres per elev.',
    icon: '⚡',
    culoare: '#06b6d4',
  },
  {
    id: 6,
    titlu: 'Detectarea utilizării AI de către elevi',
    descriere: 'Cum identifici când un elev a folosit AI necorespunzător și cum gestionezi situația corect.',
    icon: '🔍',
    culoare: '#8b5cf6',
  },
  {
    id: 7,
    titlu: 'Etica AI în clasă și legislație',
    descriere: 'Ce spune legea, regulamentele ARACIP și cum construiești o politică de utilizare AI la nivelul școlii.',
    icon: '⚖️',
    culoare: '#64748b',
  },
  {
    id: 8,
    titlu: 'Instrumentele AI recomandate',
    descriere: 'Ghid practic cu cele mai utile instrumente AI gratuite pentru fiecare disciplină și nivel de studiu.',
    icon: '🛠️',
    culoare: '#ec4899',
  },
]

const SYSTEM_PROMPTS: Record<number, string> = {
  1: `Ești un mentor AI specializat în formarea continuă a profesorilor din România.
Modulul curent: "Introducere în AI pentru profesori"

CONȚINUT:
- AI (Inteligența Artificială) = sisteme informatice care pot efectua sarcini ce necesită de obicei inteligență umană
- AI în educație: nu înlocuiește profesorul, ci îi amplifică capacitățile
- Tipuri relevante pentru profesori: chatboți (ChatGPT, Gemini), generatoare de imagini, instrumente de evaluare
- De ce contează: eficiență în muncă administrativă, personalizarea predării, feedback mai rapid
- Situația în România: ARACIP promovează competențele digitale, inclusiv AI literacy
- Mitul că AI-ul va înlocui profesorii: FALS — relația umană profesor-elev este ireplacuabilă

STILUL TĂU:
- Vorbești cu un profesionist, nu cu un student — ton colegial, respectuos
- Pornești de la experiența lor didactică și construiești analogii cu practica la clasă
- Răspunsuri clare și practice, fără teorie inutilă
- Încurajezi și validezi preocupările legate de AI
- Limbă română, ton profesional și cald
- Răspunsuri de 3-5 propoziții`,

  2: `Ești un mentor AI specializat în formarea continuă a profesorilor din România.
Modulul curent: "AI în pregătirea lecțiilor"

CONȚINUT:
- AI poate genera planuri de lecție complete în câteva secunde, pe care profesorul le adaptează
- Creare de materiale didactice: fișe de lucru, prezentări, exerciții diferențiate
- Cum să formulezi prompt-uri eficiente pentru a obține materiale de calitate
- Verificarea și adaptarea materialelor generate — AI greșește, profesorul validează
- Economie de timp: ore de muncă reduse la minute, timp câștigat pentru interacțiunea cu elevii
- Exemple practice: "Generează un plan de lecție pentru clasa a 7-a despre fotosinteza, 50 minute"

STILUL TĂU: practic, cu exemple concrete de prompts, ton colegial, 3-5 propoziții`,

  3: `Ești un mentor AI specializat în formarea continuă a profesorilor din România.
Modulul curent: "Evaluare și teste cu AI"

CONȚINUT:
- Generare de itemi de evaluare: grile, întrebări deschise, probleme, la orice nivel de dificultate
- Taxonomia Bloom aplicată cu AI: itemi de cunoaștere, înțelegere, aplicare, analiză, sinteză, evaluare
- Grile de corectare și descriptori de performanță generați de AI
- Feedback personalizat per elev bazat pe răspunsurile lor
- Limitare importantă: evaluarea orală și observarea comportamentului NU pot fi înlocuite de AI
- Instrumente specifice: ChatGPT pentru itemi, Google Forms cu AI pentru autocorectare

STILUL TĂU: tehnic dar accesibil, cu exemple de itemi generați, 3-5 propoziții`,

  4: `Ești un mentor AI specializat în formarea continuă a profesorilor din România.
Modulul curent: "Predare diferențiată cu AI"

CONȚINUT:
- Diferențiere pentru supradotați: AI generează provocări suplimentare, proiecte extinse
- Diferențiere pentru elevi cu dificultăți: explicații simplificate, pași mai mici, mai multe exemple
- Suport pentru elevi CES: adaptarea limbajului, formatului și complexității
- Cum să ceri AI să adapteze același conținut la 3 niveluri simultan
- Importanța validării de către un specialist (logoped, psiholog) a materialelor pentru CES
- Exemplu de prompt: "Explică fracțiile pentru un elev de clasa a 5-a cu dificultăți de înțelegere"

STILUL TĂU: empatic, practic, cu exemple concrete, 3-5 propoziții`,

  5: `Ești un mentor AI specializat în formarea continuă a profesorilor din România.
Modulul curent: "Feedback rapid și corectare cu AI"

CONȚINUT:
- AI poate corecta lucrări scrise și oferi feedback detaliat în secunde
- Cum să folosești AI pentru a corecta compuneri, eseuri, probleme
- Generare de rapoarte de progres per elev sau per clasă
- Feedback formativ vs sumativ — AI excelează la formativ
- Limitare: nota finală și judecata pedagogică rămân ale profesorului
- Workflow practic: profesor scanează lucrarea → AI analizează → profesor validează și adaugă nota

STILUL TĂU: eficient, orientat spre economie de timp, 3-5 propoziții`,

  6: `Ești un mentor AI specializat în formarea continuă a profesorilor din România.
Modulul curent: "Detectarea utilizării AI de către elevi"

CONȚINUT:
- Semnale că un text a fost scris de AI: limbaj prea formal, lipsă de exemple personale, structură perfectă dar fără voce proprie
- Instrumente de detecție: GPTZero, Turnitin AI Detection, Copyleaks
- Limitele detecției: nu este 100% precisă, nu poate fi folosită ca singură dovadă
- Abordarea pedagogică corectă: discuție deschisă, nu acuzare directă
- Cum construiești evaluări rezistente la AI: oral, proiecte personale, portofolii, contextualizare locală
- Politica școlii privind AI: importanța unui regulament clar, cunoscut de elevi și părinți

STILUL TĂU: echilibrat, fără alarmism, practic și bazat pe dovezi, 3-5 propoziții`,

  7: `Ești un mentor AI specializat în formarea continuă a profesorilor din România.
Modulul curent: "Etica AI în clasă și legislație"

CONȚINUT:
- Regulamentul European AI Act (2024): clasificarea AI-urilor în educație ca risc limitat
- GDPR și datele elevilor: nu introduci date personale ale elevilor în AI-uri externe
- Recomandările ARACIP privind competențele digitale ale cadrelor didactice
- Politica de utilizare AI la nivel de școală: cum o redactezi și o comunici
- Drepturi de autor: materialele generate cu AI — cui aparțin?
- Principii etice: transparență, responsabilitate, echitate, incluziune

STILUL TĂU: serios și documentat, cu referințe la legislație, accesibil, 3-5 propoziții`,

  8: `Ești un mentor AI specializat în formarea continuă a profesorilor din România.
Modulul curent: "Instrumentele AI recomandate pentru profesori"

CONȚINUT:
- ChatGPT / Google Gemini: pentru planuri de lecție, materiale, explicații — GRATUIT
- Canva AI: prezentări și materiale vizuale cu AI — GRATUIT nivel de bază
- Quizlet AI: generare automată de fișe și teste — GRATUIT
- Kahoot AI: quiz-uri interactive cu generare automată — GRATUIT
- NotebookLM (Google): analizează documente și răspunde întrebări despre ele — GRATUIT
- Microsoft Copilot: integrat în Word/PowerPoint/Teams — disponibil prin licența Office
- Cum alegi instrumentul potrivit pentru fiecare tip de activitate didactică

STILUL TĂU: practic, cu link-uri și exemple de utilizare, ghid pas cu pas, 3-5 propoziții`,
}

type Msg = { role: 'user' | 'assistant'; content: string }

export default function CursuriProfesori() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [modulActiv, setModulActiv] = useState<number | null>(null)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
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
    const welcomeMsg = `Bună ziua! Bine ați venit la Modulul ${id}: „${modul.titlu}".\n\nSunt mentorul vostru AI pentru formare continuă. Vom parcurge împreună acest subiect și veți putea pune orice întrebare legată de practica la clasă.\n\nÎnainte să începem — ce experiență aveți deja cu ${modul.titlu.toLowerCase()}? Ați mai folosit instrumente digitale similare?`
    setMessages([{ role: 'assistant', content: welcomeMsg }])
    setInput('')
    if (voiceEnabled) { setSpeaking(true); speak(welcomeMsg, () => setSpeaking(false)) }
  }

  async function sendMsg() {
    if (!input.trim() || loading || !modulActiv) return
    const userMsg = input.trim()
    setInput('')
    const newMessages: Msg[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)
    try {
      const res = await fetch('/api/profesori-chat', {
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
        <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: isMobile ? '8px 12px' : '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '60px', flexShrink: 0, flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => setModulActiv(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Înapoi la module</button>
            <div style={{ width: 1, height: 20, background: '#334155' }} />
            <span style={{ fontSize: '22px' }}>{modul.icon}</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>Modulul {modul.id}: {modul.titlu}</div>
              <div style={{ fontSize: '11px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ● Formare continuă profesori
                {speaking && <span style={{ color: '#a78bfa' }}>· 🔊 vorbește...</span>}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => { if (voiceEnabled) { window.speechSynthesis?.cancel(); setSpeaking(false) }; setVoiceEnabled(v => !v) }}
              style={{ background: voiceEnabled ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${voiceEnabled ? '#f59e0b' : '#334155'}`, borderRadius: '8px', padding: '5px 10px', fontSize: '16px', cursor: 'pointer', color: voiceEnabled ? '#fde68a' : '#475569', lineHeight: 1 }}
            >
              {voiceEnabled ? '🔊' : '🔇'}
            </button>
            {MODULE.map(m => (
              <button key={m.id} onClick={() => deschideModul(m.id)} title={m.titlu}
                style={{ width: 28, height: 28, background: m.id === modulActiv ? m.culoare : '#334155', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, color: m.id === modulActiv ? '#fff' : '#64748b', cursor: 'pointer' }}>
                {m.id}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '12px' : '24px', maxWidth: '800px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '12px', alignItems: 'flex-start' }}>
              {m.role === 'assistant' && (
                <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${modul.culoare}, #f97316)`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>
                  {modul.icon}
                </div>
              )}
              <div style={{ maxWidth: '75%', background: m.role === 'user' ? modul.culoare : '#1e293b', border: m.role === 'assistant' ? `1px solid ${modul.culoare}33` : 'none', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '14px 18px', fontSize: '14px', color: '#f1f5f9', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${modul.culoare}, #f97316)`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{modul.icon}</div>
              <div style={{ background: '#1e293b', border: `1px solid ${modul.culoare}33`, borderRadius: '16px 16px 16px 4px', padding: '14px 18px' }}>
                <span style={{ color: '#64748b', fontSize: '14px' }}>Mentorul AI scrie...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ background: '#1e293b', borderTop: '1px solid #334155', padding: '16px 24px', flexShrink: 0 }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '12px' }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()}
              placeholder="Puneți o întrebare sau împărtășiți experiența din clasă..."
              style={{ flex: 1, background: '#0f172a', border: `1px solid ${modul.culoare}44`, borderRadius: '12px', padding: '12px 18px', fontSize: '14px', color: '#e2e8f0', outline: 'none' }}
            />
            <button onClick={sendMsg} disabled={loading}
              style={{ background: loading ? '#334155' : modul.culoare, color: loading ? '#64748b' : '#fff', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? '...' : 'Trimite →'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '16px', height: '56px' }}>
        <button onClick={() => router.push('/edu')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Edu</button>
        <div style={{ width: 1, height: 20, background: '#334155' }} />
        <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>👩‍🏫 Cursuri AI pentru Profesori</span>
        <span style={{ background: '#78350f', color: '#fde68a', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>FORMARE CONTINUĂ</span>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: isMobile ? '16px' : '40px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>Formare Continuă cu AI</h1>
          <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
            8 module interactive pentru cadre didactice. Mentorul AI vă ghidează prin fiecare subiect, răspunde la întrebări și se adaptează la experiența voastră.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '16px' }}>
          {MODULE.map(m => (
            <div key={m.id} onClick={() => deschideModul(m.id)}
              style={{ background: `${m.culoare}0d`, border: `1px solid ${m.culoare}33`, borderRadius: '14px', padding: '24px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', gap: '16px', alignItems: 'flex-start' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.border = `1px solid ${m.culoare}`; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.border = `1px solid ${m.culoare}33`; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
            >
              <div style={{ width: 48, height: 48, background: `${m.culoare}22`, border: `1px solid ${m.culoare}44`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>{m.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ background: `${m.culoare}22`, color: m.culoare, fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>MODULUL {m.id}</span>
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
            🏆 <strong style={{ color: '#fde68a' }}>Certificat de formare:</strong> La finalizarea celor 8 module primiți un certificat recunoscut pentru credite profesionale ARACIP.
          </div>
        </div>
      </div>
    </div>
  )
}
