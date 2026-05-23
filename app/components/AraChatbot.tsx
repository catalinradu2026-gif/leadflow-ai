'use client'
import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { speak } from '../edu/tts'

type Msg = { role: 'user' | 'assistant'; content: string }

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
  if (pathname === '/acreditare/autorizare') return 'Bună ziua! Sunt ARA. Știu de ce ați deschis această pagină — vreți să înțelegeți ce documente trebuie și cât durează autorizarea. Vă dau imediat lista completă:\n\n📋 Documente obligatorii: cerere tip ARACIP, acte proprietate/folosință spațiu, aviz ISU (pompieri), aviz DSP (sanitar), plan de școlarizare, lista cadrelor didactice cu grade, regulament intern, ofertă educațională.\n\n⏱️ Durată: 30-60 zile lucrătoare — depuneți cu minimum 3 luni înainte de deschidere.\n\nCe vă ridică semne de întrebare?'
  if (pathname === '/acreditare/acreditare-scolara') return 'Bună ziua! Sunt ARA. Dacă ați deschis această pagină, probabil aveți o vizită ARACIP în orizont sau vreți să știți cum să vă pregătiți dosarul.\n\n🎯 Cele mai frecvente probleme găsite de comisie:\n• Proceduri operaționale lipsă sau neactualizate\n• PDI expirat\n• ROI din ani anteriori, nereaprobat\n• Personal fără fișă de post actualizată\n\nAveți deja o dată programată pentru vizită?'
  if (pathname === '/acreditare/evaluare-periodica') return 'Bună ziua! Sunt ARA. Evaluarea periodică este obligatorie la fiecare 5 ani și mulți directori o subestimează față de prima acreditare — greșeală.\n\n⚠️ Comisia știe că ați mai trecut printr-o evaluare. Verifică dacă ați aplicat recomandările anterioare.\n\n🔴 Cel mai frecvent motiv de Nesatisfăcător: PDI expirat + proceduri nerevizuite.\n\nDe când suntem la ultima acreditare? Vă ajut să estimați dacă suntem în termen.'
  if (pathname === '/acreditare/dashboard') return 'Bună ziua! Sunt ARA. Pe acest dashboard monitorizați calitatea la nivel național. Puteți filtra după județ, tip de unitate sau calificativ ARACIP.\n\n💭 Poate te interesează și: statusul unităților cu Nesatisfăcător din județ sau calendarul evaluărilor programate pentru trim. III 2026. Cu ce vă ajut?'
  if (pathname === '/acreditare/registre') return 'Bună ziua! Sunt ARA. Registrele Naționale ARACIP conțin toate cele ~11.500 unități școlare din România — acreditate, autorizate sau cu proceduri în curs.\n\nCăutați o unitate specifică sau vreți să verificați statusul acreditării pentru un județ? Spuneți-mi și găsim imediat.'
  if (pathname === '/acreditare/legislatie') return 'Bună ziua! Sunt ARA. Știu că actele normative pot fi copleșitoare — vă spun eu care contează pentru situația dumneavoastră.\n\n📚 Cele mai accesate: Legea 87/2006 (calitate educație), HG 22/2007 (metodologia ARACIP), OM 5337/2020 (standarde acreditare).\n\nCe situație aveți — autorizare, acreditare sau contestație? Vă indic exact articolul relevant.'
  if (pathname === '/acreditare/faq') return 'Bună ziua! Sunt ARA. Probabil aveți o întrebare care nu e în lista de mai jos — întrebați-mă direct, știu tot ce e de știut despre procesele ARACIP.\n\n💭 Cele mai frecvente întrebări care nu apar în FAQ: cum corectez o decizie de Nesatisfăcător, cât costă procesele ARACIP și dacă pot reprograma vizita.'
  if (pathname === '/aracip') return 'Bună ziua! Sunt ARA, asistentul digital oficial al ARACIP.\n\nÎn funcție de cine sunteți, vă pot ajuta diferit:\n• 🏫 Director de școală → autorizare, acreditare, pregătire vizită\n• 🔍 Inspector → statistici, calificative, proceduri evaluare\n• 👨‍🏫 Profesor → formare continuă cu AI\n• 🎓 Elev → pregătire BAC și Evaluare Națională\n\nCine sunteți și cu ce vă ajut azi?'
  if (pathname === '/edu/diriginte') return 'Bună ziua! Sunt ARA. Știu că aveți ora de dirigenție și aveți nevoie să activați sesiunea rapid.\n\n▶️ Pașii: copiați codul din header → introduceți-l în câmpul de activare → apăsați "Activează" → sesiunea devine activă 60 de minute.\n\nCodul se generează automat în ziua orei selectate. Dacă butonul nu e activ, verificați că ziua setată coincide cu ziua de azi. Cu ce vă mai ajut?'
  if (pathname === '/edu/elevi') return 'Salut! Sunt ARA, profesorul tău AI disponibil 24/7.\n\nȘtiu că pregătirea pentru examene pare copleșitoare. Hai să simplificăm:\n• 📐 BAC Matematică M1 sau M2\n• 📝 BAC Română real sau uman\n• 🎯 Evaluare Națională cls. VIII\n\nLa ce materie lucrăm azi și de unde simți că ești mai slab?'
  if (pathname === '/scoala') return 'Bună ziua! Sunt ARA. Vă ghidez spre secțiunea potrivită în funcție de rolul dumneavoastră:\n\n• 🏫 Director → portalul Director cu documentele ISJ\n• 👨‍🏫 Profesor → formare continuă cu AI\n• 📋 Diriginte → ora de dirigenție digitală\n• 🎓 Elevi → pregătire BAC și EN\n\nCe rol aveți?'
  if (pathname === '/gradinita') return 'Bună ziua! Sunt ARA. Știu că unitățile preșcolare au nevoi specifice — nu doar documente administrative, ci și resurse didactice pentru educatoare.\n\nPot genera planuri de activitate tematice, fișe de lucru pentru 3-6 ani sau vă ajut cu documentele obligatorii pentru director (plan managerial, ROI preșcolar, raportare ISJ). Cu ce începem?'
  if (pathname === '/demo/inspector') return 'Bună ziua! Sunt ARA. Știu că vreți să monitorizați eficient — vă ofer imediat informațiile cele mai relevante.\n\n📊 La nivel național: ~11.500 unități evaluate de ARACIP, rata de calificativ Nesatisfăcător 3-4%, județele cu cele mai multe neconformități în trimestrul curent.\n\nCăutați o unitate specifică sau vreți situația pe un județ?'
  if (pathname === '/demo/isj') return 'Bună ziua! Sunt ARA. Termene active ISJ Dolj:\n\n🔴 25 mai → Raportare absențe mai 2026 (Circular 1247)\n🔴 30 mai → Comisii examene naționale constituite (Procedura 892)\n🔴 15 iunie → Situație statistică finalizare an (Circular 1198)\n\nCare unitate/problemă vă ocupă azi?'
  if (pathname === '/demo/director') return 'Bună ziua! Sunt ARA. Aveți 3 documente active de la ISJ Dolj:\n\n🔴 Circular 1247 — raportare absențe până 25 mai (prin platformă, nu email)\n🔴 Procedura 892 — comisii EN până 30 mai\n🟡 Adresa 2103 — dotări PNRR, livrare 10-20 iunie\n\nVreți să vedem ce trebuie făcut pentru fiecare?'
  if (pathname.includes('/bac/matematica')) return 'Salut! Sunt ARA, profesorul tău AI de matematică BAC.\n\nȘtiu că cei mai mulți elevi au probleme cu: studiul funcției (derivate, extreme, asimptote) și integralele. De acolo vă suceam de obicei la subiectul III.\n\nLa ce capitol simți că ești mai nesigur? Sau îți generez un subiect complet să vedem unde ești?'
  if (pathname.includes('/bac/romana')) return 'Salut! Sunt ARA, profesorul tău AI de română BAC.\n\nCel mai dificil la română BAC e de obicei eseul de 400 de cuvinte — să ai structură clară și citate relevante. Și textul argumentativ din subiectul I.\n\nCe profil ai — Real sau Uman? Și la ce te simți mai nesigur?'
  if (pathname.includes('/bac/materie')) return 'Salut! Sunt ARA, profesorul tău AI pentru această materie BAC.\n\nÎnainte să începem — spune-mi ce capitol ți se pare cel mai greu sau ce vrei să exersezi. Mă adaptez la nivelul tău și generez exerciții la cerere.'
  if (pathname.includes('/cursuri-ai')) return 'Salut! Sunt ARA, profesorul tău de inteligență artificială.\n\nAI pare complicat, dar nu e — îți explic orice, de la ce este un algoritm până la cum funcționează ChatGPT. Fără jargon inutil.\n\nEști la început sau ai deja niște cunoștințe? Îmi spui și pornesc de la nivelul tău.'
  if (pathname.includes('/cursuri-profesori')) return 'Bună ziua! Sunt ARA, mentorul dumneavoastră AI pentru formare continuă.\n\nȘtiu că cel mai frecvent profesorii mă întreabă: "Ce pot folosi concret mâine la clasă?"\n\nRăspuns scurt: ChatGPT pentru planuri de lecție, Quizlet AI pentru fișe, Canva AI pentru prezentări — toate gratuite.\n\nLa ce materie predați? Vă dau un prompt specific gata de folosit.'
  if (pathname.includes('/capacitate') || pathname.includes('/evaluare-nationala')) return 'Salut! Sunt ARA, profesorul tău AI pentru Evaluarea Națională.\n\nCele mai frecvente probleme la EN: ecuațiile de gradul II, geometria în spațiu și morfologia la română.\n\nCe materie și de unde simți că ai nevoie de ajutor? Generez exerciții la nivelul tău.'
  if (pathname.includes('/demo')) return 'Bună ziua! Sunt ARA, asistenta platformei ISJ. Vă pot ajuta cu documentele, termenele sau procedurile active. Cu ce vă ajut?'
  return 'Bună ziua! Sunt ARA, asistentul digital ARACIP. Cu ce vă pot ajuta?'
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
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: getGreeting(pathname) }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(0)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const greetingSpokenRef = useRef(false)

  function startListening() {
    const SR = (window as typeof window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition || (window as typeof window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition
    if (!SR) return
    if (listening) { recognitionRef.current?.stop(); setListening(false); return }
    window.speechSynthesis?.cancel()
    setSpeaking(false)
    const rec = new SR()
    rec.lang = 'ro-RO'
    rec.continuous = false
    rec.interimResults = true
    rec.onstart = () => setListening(true)
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join('')
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
      const res = await fetch('/api/acreditare-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, pagina }),
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
          position: 'fixed', bottom: '90px', right: '24px', zIndex: 9999,
          width: '360px', maxHeight: '520px',
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
          <div style={{ borderTop: '1px solid #334155', padding: '10px 12px', display: 'flex', gap: '8px' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder={listening ? '🎙️ Ascult...' : 'Scrieți sau vorbiți...'}
              style={{ flex: 1, background: listening ? 'rgba(239,68,68,0.07)' : '#0f172a', border: `1px solid ${listening ? '#ef4444' : '#334155'}`, borderRadius: '8px', padding: '8px 12px', fontSize: '13px', color: '#e2e8f0', outline: 'none', fontFamily: 'inherit', transition: 'all 0.2s' }}
            />
            <button onClick={startListening} title={listening ? 'Oprește microfonul' : 'Vorbește'} style={{ background: listening ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${listening ? '#ef4444' : '#334155'}`, borderRadius: '8px', width: '36px', flexShrink: 0, cursor: 'pointer', fontSize: '16px', animation: listening ? 'pulse 1s infinite' : 'none' }}>
              🎙️
            </button>
            <button onClick={() => send()} disabled={!input.trim() || loading} style={{ background: input.trim() && !loading ? '#7c3aed' : '#334155', color: '#fff', border: 'none', borderRadius: '8px', width: '36px', flexShrink: 0, cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', fontSize: '16px' }}>
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
