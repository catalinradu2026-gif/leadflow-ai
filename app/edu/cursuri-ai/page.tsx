'use client'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { speak } from '../tts'
import { useIsMobile } from '../../hooks/useIsMobile'

type Nivel = 'primar' | 'gimnaziu' | 'liceu'

const MODULE = [
  {
    id: 1,
    titlu: 'Ce este Inteligența Artificială?',
    descriere: 'Descoperă cum funcționează AI-ul și de ce a devenit cel mai important instrument al secolului 21.',
    icon: '🧠',
    culoare: '#6366f1',
    culoareBg: 'rgba(99,102,241,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 2,
    titlu: 'Cum te ajută AI la școală?',
    descriere: 'Metode concrete prin care AI-ul poate fi asistentul tău de studiu pentru orice materie.',
    icon: '📖',
    culoare: '#8b5cf6',
    culoareBg: 'rgba(139,92,246,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 3,
    titlu: 'Cum înveți mai eficient cu AI?',
    descriere: 'Tehnici de învățare adaptivă — AI-ul îți explică până înțelegi, în ritmul tău.',
    icon: '⚡',
    culoare: '#06b6d4',
    culoareBg: 'rgba(6,182,212,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 4,
    titlu: 'Cum îți organizezi temele cu AI?',
    descriere: 'Planificare inteligentă, priorități și gestionarea timpului cu ajutorul inteligenței artificiale.',
    icon: '📅',
    culoare: '#10b981',
    culoareBg: 'rgba(16,185,129,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 5,
    titlu: 'AI pentru proiecte și cercetare',
    descriere: 'Cum să folosești AI pentru a căuta, analiza și structura informații pentru referate și proiecte.',
    icon: '🔬',
    culoare: '#f59e0b',
    culoareBg: 'rgba(245,158,11,0.1)',
    nivel: 'liceu' as Nivel,
  },
  {
    id: 6,
    titlu: 'Limitele AI — ce nu poate face?',
    descriere: 'Gândire critică: când să ai încredere în AI și când să verifici informațiile din alte surse.',
    icon: '⚠️',
    culoare: '#ef4444',
    culoareBg: 'rgba(239,68,68,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 7,
    titlu: 'Etica folosirii AI în școală',
    descriere: 'Ce este permis, ce nu este, și cum să folosești AI corect și responsabil ca elev.',
    icon: '⚖️',
    culoare: '#64748b',
    culoareBg: 'rgba(100,116,139,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 8,
    titlu: 'Viitorul tău cu AI',
    descriere: 'Cariere, oportunități și cum arată lumea în care tu și AI-ul lucrați împreună.',
    icon: '🚀',
    culoare: '#ec4899',
    culoareBg: 'rgba(236,72,153,0.1)',
    nivel: 'liceu' as Nivel,
  },
  {
    id: 9,
    titlu: 'Gândire critică și Fake News',
    descriere: 'Cum recunoști dezinformarea, știrile false și manipularea online cu ajutorul gândirii critice și AI.',
    icon: '🔍',
    culoare: '#dc2626',
    culoareBg: 'rgba(220,38,38,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 10,
    titlu: 'Educație financiară cu AI',
    descriere: 'Bani, economisire, investiții și antreprenoriat — AI-ul ca mentor financiar pentru tineri.',
    icon: '💰',
    culoare: '#16a34a',
    culoareBg: 'rgba(22,163,74,0.1)',
    nivel: 'liceu' as Nivel,
  },
  {
    id: 11,
    titlu: 'Antreprenoriat pentru tineri',
    descriere: 'Cum pornești o afacere de la zero, idee de business, plan, pitch — cu AI ca partener de strategie.',
    icon: '🏗️',
    culoare: '#f97316',
    culoareBg: 'rgba(249,115,22,0.1)',
    nivel: 'liceu' as Nivel,
  },
  {
    id: 12,
    titlu: 'Cariere în tehnologie',
    descriere: 'Programare, Data Science, Cybersecurity, UX Design — ce faci, cât câștigi și cum ajungi acolo.',
    icon: '💻',
    culoare: '#0ea5e9',
    culoareBg: 'rgba(14,165,233,0.1)',
    nivel: 'liceu' as Nivel,
  },
  {
    id: 13,
    titlu: 'Sănătate mintală și wellbeing',
    descriere: 'Stres, anxietate, burnout la elevi — cum să îți gestionezi sănătatea mentală în era digitală.',
    icon: '💚',
    culoare: '#22c55e',
    culoareBg: 'rgba(34,197,94,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 14,
    titlu: 'Educație civică digitală',
    descriere: 'Drepturi și responsabilități online, vot, democrație și cum participi activ la societate ca cetățean digital.',
    icon: '🏛️',
    culoare: '#8b5cf6',
    culoareBg: 'rgba(139,92,246,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 15,
    titlu: 'Meditații BAC — Matematică',
    descriere: 'Pregătire intensivă pentru BAC la matematică: algebră, analiză, geometrie cu explicații pas cu pas.',
    icon: '📐',
    culoare: '#f59e0b',
    culoareBg: 'rgba(245,158,11,0.1)',
    nivel: 'liceu' as Nivel,
  },
  {
    id: 16,
    titlu: 'Meditații BAC — Română',
    descriere: 'Eseuri, comentarii literare, gramatică și tot ce ai nevoie pentru nota 10 la BAC română.',
    icon: '📝',
    culoare: '#e879f9',
    culoareBg: 'rgba(232,121,249,0.1)',
    nivel: 'liceu' as Nivel,
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

  9: `Ești un profesor AI care predă gândire critică și identificarea dezinformării online.
Modulul curent: "Gândire critică și Fake News"

CONȚINUT DE PREDAT:
- Ce este fake news și de ce există: atenție, clicuri, manipulare politică, profit
- Cum recunoști o știre falsă: verifică sursa, data, autorul, cine beneficiază
- Deepfake-uri: imagini, video și audio generate de AI — cum le detectezi
- Camere de ecou (echo chambers) pe social media — algoritmi care amplifică credințele
- Fact-checking: site-uri de verificare (Factual.ro, Snopes, Reuters Fact Check)
- Cum folosești AI să verifici informații: "Verifică această afirmație cu surse credibile"
- REGULA DE AUR: Dacă te enervează sau te speriază, verifică înainte să distribui

EXERCIȚIU PRACTIC:
Prezintă clasei 3 titluri de știri (2 false, 1 adevărată) și ghidează-i să identifice care e care.

STIL: alert, practic, cu exemple reale din România, stimulează scepticismul sănătos`,

  10: `Ești un profesor AI care predă educație financiară pentru tineri.
Modulul curent: "Educație financiară cu AI"

CONȚINUT DE PREDAT:
- Diferența dintre venit, cheltuieli, economii și investiții
- Regula 50/30/20: 50% nevoi, 30% dorințe, 20% economii
- Dobânda compusă — de ce să economisești devreme (exemplu: 100 lei/lună de la 18 ani)
- Ce este inflația și cum îți afectează banii
- Investiții de bază: depozite bancare, fonduri de investiții, ETF-uri
- Cum evitați escrocheriile financiare online (scheme Ponzi, crypto fake)
- Cum folosești AI să îți creezi un buget personal

EXERCIȚIU:
"Ai 500 lei economii. Cum le folosești?" — discuție despre nevoi vs dorințe vs investiții.

MESAJ CHEIE: Cel mai bun moment să înveți despre bani este acum, înainte să îi ai.

STIL: practic, cu exemple concrete în lei, adaptat pentru elevi de 14-18 ani`,

  11: `Ești un profesor AI care predă antreprenoriat pentru tineri.
Modulul curent: "Antreprenoriat pentru tineri"

CONȚINUT DE PREDAT:
- Ce este un antreprenor și diferența față de un angajat
- Cum găsești o idee de business: problemă reală → soluție → piață
- Validarea ideii: cum afli dacă oamenii chiar vor să cumpere înainte să construiești
- Business Model Canvas simplificat: clienți, valoare, venituri, costuri
- Pitch-ul: cum prezinți o idee în 2 minute (elevator pitch)
- Exemple de tineri antreprenori români și internaționali care au început la liceu
- Cum folosești AI să generezi idei de afaceri și să faci research de piață
- Programe pentru tineri antreprenori: Start-Up Nation, fonduri europene

EXERCIȚIU:
"Identificați o problemă din școala voastră. Cum ați rezolva-o cu o afacere?"

STIL: energic, inspirațional, cu exemple reale, lasă spațiu pentru creativitate`,

  12: `Ești un profesor AI care predă despre carierele în tehnologie.
Modulul curent: "Cariere în tehnologie"

CONȚINUT DE PREDAT:
- Programare web (front-end/back-end): ce faci, limbaje (JavaScript, Python), salariu mediu în România
- Data Science și Machine Learning: analizezi date, construiești modele AI, salariu top
- Cybersecurity: protejezi sisteme și date, cerere foarte mare pe piață
- UX/UI Design: creezi interfețe frumoase și ușor de folosit, combini creativitate cu tech
- DevOps și Cloud: infrastructura care rulează internetul (AWS, Google Cloud)
- Product Manager: coordonezi echipe tech fără să scrii cod
- Cum alegi: matematică și logică → programare/data science; creativitate → design; comunicare → PM
- Resurse gratuite: freeCodeCamp, CS50 Harvard, Khan Academy, YouTube

PLAN DE ACȚIUNE:
La ce materii ești bun? → Ce rol ți se potrivește? → Ce înveți acum?

STIL: concret, orientat spre acțiune, cu salarii reale și pași următori clari`,

  13: `Ești un profesor AI empatic care predă despre sănătate mintală pentru elevi.
Modulul curent: "Sănătate mintală și wellbeing"

CONȚINUT DE PREDAT:
- Stresul școlar: este normal, dar cum îl gestionezi? Tehnica 4-7-8 de respirație
- Anxietatea față de performanță: perfecționismul toxic vs excelența sănătoasă
- Social media și stima de sine: comparația cu alții, FOMO, filtre și realitate
- Burnout la elevi: semne, cauze, recuperare
- Somnul — cel mai important factor de performanță școlară (8 ore minim)
- Când să ceri ajutor: psiholog școlar, linie de criză (116 123 în România)
- Tehnici mindfulness adaptate pentru elevi: 5 minute pe zi fac diferența
- Cum folosești AI ca jurnal de stres (fără să înlocuiești suportul uman)

MESAJ IMPORTANT:
A cere ajutor nu este slăbiciune — este cea mai inteligentă decizie pe care o poți lua.

STIL: empatic, fără judecată, safe space pentru discuție, nu înlocuiești un specialist`,

  14: `Ești un profesor AI care predă educație civică în era digitală.
Modulul curent: "Educație civică digitală"

CONȚINUT DE PREDAT:
- Drepturi digitale: dreptul la intimitate, la uitare, la date personale (GDPR)
- Responsabilități online: ce postezi rămâne — amprenta digitală
- Cum funcționează democrația: vot, reprezentare, separarea puterilor
- Participare civică: petiții, voluntariat, consultări publice
- Combaterea discursului de ură online: cum raportezi, cum răspunzi
- Transparența instituțională: cum accesezi informații publice (Legea 544/2001)
- Alegerile în era AI: dezinformare electorală, cum votezi informat
- Cum folosești AI să înțelegi legi și documente oficiale

EXERCIȚIU:
"Găsiți o decizie a Consiliului Local din orașul vostru. Este corectă? Cum ați fi votat?"

STIL: civic, responsabil, stimulează implicarea activă în societate`,

  15: `Ești un profesor AI specializat în pregătirea pentru BAC la matematică.
Modulul curent: "Meditații BAC — Matematică"

CONȚINUT DE PREDAT (programa BAC M1/M2):
ALGEBRĂ:
- Mulțimi de numere, operații, proprietăți
- Funcții: definiție, grafic, monotonie, paritate
- Ecuații și inecuații: liniare, pătratice, exponențiale, logaritmice
- Șiruri: aritmetice, geometrice, limita unui șir
- Limite, continuitate, derivabilitate
- Integrala definită și nedefinită — primitive

GEOMETRIE:
- Vectori, coordonate în plan și spațiu
- Dreapta și planul în spațiu
- Conice: cerc, elipsă, parabolă, hiperbolă

METODĂ DE PREDARE:
- Prezintă teoria scurt și clar
- Rezolvă un exemplu pas cu pas, explicând fiecare pas
- Propune un exercițiu similar elevului
- Verifică rezolvarea și corectează greșelile tipice

STIL: metodic, răbdător, explică de câte ori e nevoie, focusat pe subiectele frecvente la BAC`,

  16: `Ești un profesor AI specializat în pregătirea pentru BAC la limba română.
Modulul curent: "Meditații BAC — Română"

CONȚINUT DE PREDAT (programa BAC Română):
LITERATURĂ:
- Curente literare: clasicism, romantism, realism, modernism, postmodernism
- Autori canonici: Eminescu, Creangă, Caragiale, Rebreanu, Blaga, Bacovia, Arghezi, Sadoveanu, Preda, Cărtărescu
- Genuri și specii literare: epic, liric, dramatic
- Figuri de stil: metaforă, comparație, personificare, hiperbola, ironia, simbolul
- Comentariu literar: structură, cum argumentezi, citate relevante

LIMBĂ:
- Morfologie: părți de vorbire flexibile și neflexibile
- Sintaxă: propoziție, frază, funcții sintactice
- Vocabular: sinonime, antonime, omonime, pleonasm, cacofonie

STRUCTURA ESEULUI BAC:
1. Introducere: context, teză clară
2. Cuprins: 2-3 argumente cu citate și analiză
3. Concluzie: reafirmarea tezei, judecată de valoare

STIL: academic dar accesibil, cu exemple din texte canonice, ajută la structurarea eseurilor pas cu pas`,
}

type Msg = { role: 'user' | 'assistant'; content: string }

const NIVELE = [
  {
    key: 'primar' as Nivel,
    titlu: 'Primar',
    clase: 'Clasele I–IV',
    icon: '🌱',
    culoare: '#f59e0b',
    culoareBg: 'rgba(245,158,11,0.08)',
    border: '#f59e0b',
    badge: '#78350f',
    badgeText: '#fde68a',
    comingSoon: true,
  },
  {
    key: 'gimnaziu' as Nivel,
    titlu: 'Gimnaziu',
    clase: 'Clasele V–VIII',
    icon: '📚',
    culoare: '#6366f1',
    culoareBg: 'rgba(99,102,241,0.08)',
    border: '#6366f1',
    badge: '#4338ca',
    badgeText: '#a5b4fc',
    comingSoon: false,
  },
  {
    key: 'liceu' as Nivel,
    titlu: 'Liceu',
    clase: 'Clasele IX–XII',
    icon: '🎓',
    culoare: '#ec4899',
    culoareBg: 'rgba(236,72,153,0.08)',
    border: '#ec4899',
    badge: '#9d174d',
    badgeText: '#fbcfe8',
    comingSoon: false,
  },
]

export default function CursuriAI() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [nivelActiv, setNivelActiv] = useState<Nivel | null>(null)
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
      const res = await fetch('/api/acreditare-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, pagina: `Cursuri AI Elevi — Modulul ${modulActiv}`, systemPrompt: SYSTEM_PROMPTS[modulActiv] }),
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
        <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: isMobile ? '8px 12px' : '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '60px', flexShrink: 0, flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => setModulActiv(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Înapoi la module</button>
            <div style={{ width: 1, height: 20, background: '#334155' }} />
            <span style={{ fontSize: '22px' }}>{modul.icon}</span>
            <div>
              <div style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: 700, color: '#f1f5f9' }}>Modulul {modul.id}: {modul.titlu}</div>
              <div style={{ fontSize: '11px', color: modul.culoare, display: 'flex', alignItems: 'center', gap: '6px' }}>
                ● Lecție interactivă în desfășurare
                {speaking && <span style={{ color: '#a78bfa', fontSize: '11px' }}>· 🔊 vorbește...</span>}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => { if (voiceEnabled) { window.speechSynthesis?.cancel(); setSpeaking(false) }; setVoiceEnabled(v => !v) }}
              title={voiceEnabled ? 'Oprește vocea' : 'Activează vocea'}
              style={{ background: voiceEnabled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${voiceEnabled ? modul.culoare : '#334155'}`, borderRadius: '8px', padding: '5px 10px', fontSize: '16px', cursor: 'pointer', color: voiceEnabled ? modul.culoare : '#475569', lineHeight: 1 }}
            >
              {voiceEnabled ? '🔊' : '🔇'}
            </button>
            {!isMobile && MODULE.map(m => (
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
        <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '12px' : '24px', maxWidth: '800px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

  // Ecran alegere nivel
  if (!nivelActiv) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>
        <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '16px', height: '56px' }}>
          <button onClick={() => router.push('/edu')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Edu</button>
          <div style={{ width: 1, height: 20, background: '#334155' }} />
          <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>🤖 Educație Digitală</span>
          <span style={{ background: '#4338ca', color: '#a5b4fc', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>16 MODULE</span>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: isMobile ? '24px 16px' : '60px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h1 style={{ fontSize: isMobile ? '28px' : '40px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
              Alege nivelul tău
            </h1>
            <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '460px', margin: '0 auto', lineHeight: 1.7 }}>
              Cursuri AI adaptate pentru fiecare ciclu școlar — de la primar până la liceu.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '20px' }}>
            {NIVELE.map(n => {
              const count = MODULE.filter(m => m.nivel === n.key).length
              return (
                <div
                  key={n.key}
                  onClick={() => !n.comingSoon && setNivelActiv(n.key)}
                  style={{
                    background: n.culoareBg,
                    border: `2px solid ${n.comingSoon ? '#1e293b' : n.border}`,
                    borderRadius: '20px',
                    padding: '36px 28px',
                    cursor: n.comingSoon ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative',
                    overflow: 'hidden',
                    opacity: n.comingSoon ? 0.5 : 1,
                  }}
                  onMouseEnter={e => { if (!n.comingSoon) { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)' } }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
                >
                  {n.comingSoon && (
                    <div style={{ position: 'absolute', top: 12, right: 12, background: '#1e293b', color: '#475569', fontSize: '10px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>
                      ÎN CURÂND
                    </div>
                  )}
                  <div style={{ fontSize: '52px', marginBottom: '16px' }}>{n.icon}</div>
                  <div style={{ display: 'inline-block', background: n.badge, color: n.badgeText, fontSize: '11px', fontWeight: 700, padding: '3px 12px', borderRadius: '20px', marginBottom: '12px' }}>
                    {n.comingSoon ? 'ÎN PREGĂTIRE' : `${count} MODULE`}
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: n.comingSoon ? '#475569' : '#fff', marginBottom: '6px' }}>{n.titlu}</h2>
                  <div style={{ fontSize: '13px', color: n.comingSoon ? '#334155' : n.culoare, fontWeight: 600, marginBottom: '12px' }}>{n.clase}</div>
                  {!n.comingSoon && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                      {MODULE.filter(m => m.nivel === n.key).slice(0, 3).map(m => (
                        <span key={m.id} style={{ background: `${n.culoare}22`, color: n.culoare, fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>{m.icon} {m.titlu.split(' ').slice(0, 2).join(' ')}</span>
                      ))}
                      {count > 3 && <span style={{ background: `${n.culoare}22`, color: n.culoare, fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>+{count - 3} module</span>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const nivel = NIVELE.find(n => n.key === nivelActiv)!
  const moduleNivel = MODULE.filter(m => m.nivel === nivelActiv)

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>

      {/* Topbar */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '16px', height: '56px' }}>
        <button onClick={() => setNivelActiv(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Nivele</button>
        <div style={{ width: 1, height: 20, background: '#334155' }} />
        <span style={{ fontSize: '22px' }}>{nivel.icon}</span>
        <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>{nivel.titlu} — {nivel.clase}</span>
        <span style={{ background: nivel.badge, color: nivel.badgeText, fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>{moduleNivel.length} MODULE</span>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: isMobile ? '16px' : '40px 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
            {nivel.icon} Cursuri AI — {nivel.titlu}
          </h1>
          <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
            Selectați modulul săptămânii. Profesorul AI predă interactiv — pune întrebări, explică și adaptează lecția pentru clasa voastră.
          </p>
        </div>

        {/* Module grid */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '16px' }}>
          {moduleNivel.map((m) => (
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
