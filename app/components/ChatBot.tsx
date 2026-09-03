'use client'
import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  waText?: string
}

const LANG_TO_BCP47: Record<string, string> = {
  ro: 'ro-RO', en: 'en-US', de: 'de-DE', it: 'it-IT', fr: 'fr-FR', es: 'es-ES', zh: 'zh-CN',
}

const UI_TEXT: Record<string, {
  welcome: string
  aiLabel: string
  bubbleGreet: (h: number) => string
  bubbles: string[]
  placeholder: string
  mobileHint: string
  voiceCta: string
  voiceCtaSub: string[]
  typing: string
  speaking: string
  online: string
  chatBtn: string
  waBtn: string
  errorMsg: string
}> = {
  ro: {
    welcome: 'Bună! Sunt Ava, agenta virtuală AI a AIcraiova — nu sunt o persoană reală. Spune-mi ce tip de afacere ai și îți arăt exact ce putem automatiza pentru tine!',
    aiLabel: '🤖 Asistent AI · nu e un om',
    bubbleGreet: (h) => h < 12 ? 'Bună dimineața!' : h < 18 ? 'Bună ziua!' : 'Bună seara!',
    bubbles: [
      'Sunt Ava. Un bot WhatsApp care răspunde clienților tăi 24/7 — vrei să vedem ce poate face pentru afacerea ta?',
      'Știi că 3 angajați full-time costă 16.000–18.000 lei/lună? Sistemul nostru AI costă 400–600€ și nu greșește niciodată.',
      'Automatizezi orice proces repetitiv din firma ta. Sute de ore economisite lunar — fără angajare, fără concedii.',
      'Ai un site? Îți adaug un agent AI ca mine — preia clienți, răspunde întrebări, face programări. 24/7, automat.',
      'Clienți din Italia, Franța, Germania, China? Sistemul nostru răspunde automat în limba lor.',
      'O demonstrație live durează 15 minute. Spune-mi domeniul tău și îți arăt exact ce poți automatiza de mâine.',
    ],
    placeholder: 'Scrie sau vorbește...',
    mobileHint: '🎤 Pe mobil folosește microfonul de pe tastatură',
    voiceCta: '🎤 Vorbește cu mine!',
    voiceCtaSub: ['Apasă pe câmpul de text de jos,', 'apoi apasă 🎤 de pe tastatură'],
    typing: 'Ava scrie',
    speaking: 'Vorbesc...',
    online: 'Online acum',
    chatBtn: '🤖 Vorbește cu Ava!',
    waBtn: 'Scrie-ne pe WhatsApp',
    errorMsg: 'Eroare de conexiune. Scrie-ne pe WhatsApp la 0787 813 485!',
  },
  en: {
    welcome: "Hi! I'm Ava, AIcraiova's virtual AI sales agent — I'm not a real person. Tell me what type of business you have and I'll show you exactly what we can automate for you!",
    aiLabel: '🤖 AI Assistant · not a human',
    bubbleGreet: (h) => h < 12 ? 'Good morning!' : h < 18 ? 'Good afternoon!' : 'Good evening!',
    bubbles: [
      "I'm Ava. A WhatsApp bot that replies to your clients 24/7 — want to see what it can do for your business?",
      '3 full-time employees cost 16,000–18,000 RON/month. Our AI system costs 400–600€ and never makes mistakes.',
      'Automate any repetitive process in your company. Hundreds of hours saved monthly — no hiring, no sick days.',
      "Have a website? I'll add an AI agent like me — takes clients, answers questions, makes bookings. 24/7, automatic.",
      'Clients from Italy, France, Germany, China? Our system replies automatically in their language.',
      'A live demo takes 15 minutes. Tell me your industry and I\'ll show you exactly what you can automate starting tomorrow.',
    ],
    placeholder: 'Type or speak...',
    mobileHint: '🎤 On mobile use the microphone on your keyboard',
    voiceCta: '🎤 Talk to me!',
    voiceCtaSub: ['Tap the text field below,', 'then press 🎤 on your keyboard'],
    typing: 'Ava is typing',
    speaking: 'Speaking...',
    online: 'Online now',
    chatBtn: '🤖 Talk to Ava!',
    waBtn: 'Write to us on WhatsApp',
    errorMsg: 'Connection error. Write to us on WhatsApp at 0787 813 485!',
  },
  de: {
    welcome: 'Hallo! Ich bin Ava, der virtuelle KI-Verkaufsagent von AIcraiova — ich bin keine echte Person. Sagen Sie mir, welche Art von Unternehmen Sie haben, und ich zeige Ihnen genau, was wir für Sie automatisieren können!',
    aiLabel: '🤖 KI-Assistent · kein Mensch',
    bubbleGreet: (h) => h < 12 ? 'Guten Morgen!' : h < 18 ? 'Guten Tag!' : 'Guten Abend!',
    bubbles: [
      'Ich bin Ava. Ein WhatsApp-Bot, der Ihren Kunden 24/7 antwortet — möchten Sie sehen, was er für Ihr Unternehmen tun kann?',
      '3 Vollzeitmitarbeiter kosten 16.000–18.000 RON/Monat. Unser KI-System kostet 400–600€ und macht nie Fehler.',
      'Automatisieren Sie jeden repetitiven Prozess. Hunderte von Stunden monatlich gespart.',
      'Haben Sie eine Website? Ich füge einen KI-Agenten wie mich hinzu — nimmt Kunden an, beantwortet Fragen, macht Buchungen. 24/7.',
      'Kunden aus Italien, Frankreich, China? Unser System antwortet automatisch in ihrer Sprache.',
      'Eine Live-Demo dauert 15 Minuten. Sagen Sie mir Ihre Branche und ich zeige Ihnen, was Sie ab morgen automatisieren können.',
    ],
    placeholder: 'Schreiben oder sprechen...',
    mobileHint: '🎤 Auf dem Handy das Mikrofon der Tastatur verwenden',
    voiceCta: '🎤 Sprechen Sie mit mir!',
    voiceCtaSub: ['Tippen Sie das Textfeld unten an,', 'dann 🎤 auf der Tastatur drücken'],
    typing: 'Ava schreibt',
    speaking: 'Spreche...',
    online: 'Jetzt online',
    chatBtn: '🤖 Mit Ava sprechen!',
    waBtn: 'Schreiben Sie uns auf WhatsApp',
    errorMsg: 'Verbindungsfehler. Schreiben Sie uns auf WhatsApp: 0787 813 485!',
  },
  it: {
    welcome: "Ciao! Sono Ava, l'agente virtuale AI di AIcraiova — non sono una persona reale. Dimmi che tipo di attività hai e ti mostrerò esattamente cosa possiamo automatizzare per te!",
    aiLabel: '🤖 Assistente AI · non è un umano',
    bubbleGreet: (h) => h < 12 ? 'Buongiorno!' : h < 18 ? 'Buon pomeriggio!' : 'Buonasera!',
    bubbles: [
      'Sono Ava. Un bot WhatsApp che risponde ai tuoi clienti 24/7 — vuoi vedere cosa può fare per la tua attività?',
      '3 dipendenti a tempo pieno costano 16.000–18.000 RON/mese. Il nostro sistema AI costa 400–600€ e non sbaglia mai.',
      'Automatizza qualsiasi processo ripetitivo nella tua azienda. Centinaia di ore risparmiate ogni mese.',
      "Hai un sito web? Aggiungo un agente AI come me — accoglie clienti, risponde a domande, fa prenotazioni. 24/7.",
      'Clienti dall\'Italia, Francia, Cina? Il nostro sistema risponde automaticamente nella loro lingua.',
      'Una demo dal vivo dura 15 minuti. Dimmi il tuo settore e ti mostro esattamente cosa puoi automatizzare da domani.',
    ],
    placeholder: 'Scrivi o parla...',
    mobileHint: '🎤 Su mobile usa il microfono della tastiera',
    voiceCta: '🎤 Parla con me!',
    voiceCtaSub: ['Tocca il campo testo in basso,', 'poi premi 🎤 sulla tastiera'],
    typing: 'Ava sta scrivendo',
    speaking: 'Sto parlando...',
    online: 'Online ora',
    chatBtn: '🤖 Parla con Ava!',
    waBtn: 'Scrivici su WhatsApp',
    errorMsg: 'Errore di connessione. Scrivici su WhatsApp al 0787 813 485!',
  },
  fr: {
    welcome: "Bonjour! Je suis Ava, l'agente virtuelle IA d'AIcraiova — je ne suis pas une personne réelle. Dites-moi quel type d'entreprise vous avez et je vous montrerai exactement ce que nous pouvons automatiser pour vous!",
    aiLabel: '🤖 Assistante IA · pas un humain',
    bubbleGreet: (h) => h < 12 ? 'Bonjour!' : h < 18 ? 'Bon après-midi!' : 'Bonsoir!',
    bubbles: [
      "Je suis Ava. Un bot WhatsApp qui répond à vos clients 24/7 — voulez-vous voir ce qu'il peut faire pour votre entreprise?",
      "3 employés à temps plein coûtent 16 000–18 000 RON/mois. Notre système IA coûte 400–600€ et ne fait jamais d'erreurs.",
      "Automatisez n'importe quel processus répétitif. Des centaines d'heures économisées chaque mois.",
      "Vous avez un site web? J'ajoute un agent IA comme moi — accueille les clients, répond aux questions, fait des réservations. 24/7.",
      "Des clients d'Italie, France, Chine? Notre système répond automatiquement dans leur langue.",
      "Une démo en direct dure 15 minutes. Dites-moi votre secteur et je vous montrerai ce que vous pouvez automatiser dès demain.",
    ],
    placeholder: 'Écrivez ou parlez...',
    mobileHint: '🎤 Sur mobile utilisez le microphone du clavier',
    voiceCta: '🎤 Parlez-moi!',
    voiceCtaSub: ['Appuyez sur le champ texte en bas,', 'puis appuyez sur 🎤 sur votre clavier'],
    typing: 'Ava écrit',
    speaking: 'Je parle...',
    online: 'En ligne maintenant',
    chatBtn: '🤖 Parler avec Ava!',
    waBtn: 'Écrivez-nous sur WhatsApp',
    errorMsg: 'Erreur de connexion. Écrivez-nous sur WhatsApp au 0787 813 485!',
  },
  es: {
    welcome: '¡Hola! Soy Ava, la agente virtual de IA de AIcraiova — no soy una persona real. Cuéntame qué tipo de negocio tienes y te mostraré exactamente qué podemos automatizar para ti.',
    aiLabel: '🤖 Asistente de IA · no es un humano',
    bubbleGreet: (h) => h < 12 ? '¡Buenos días!' : h < 18 ? '¡Buenas tardes!' : '¡Buenas noches!',
    bubbles: [
      'Soy Ava. Un bot de WhatsApp que responde a tus clientes 24/7 — ¿quieres ver qué puede hacer por tu negocio?',
      '3 empleados a tiempo completo cuestan 16.000–18.000 RON/mes. Nuestro sistema IA cuesta 400–600€ y nunca comete errores.',
      'Automatiza cualquier proceso repetitivo de tu empresa. Cientos de horas ahorradas cada mes.',
      '¿Tienes un sitio web? Añado un agente IA como yo — atiende clientes, responde preguntas, hace reservas. 24/7.',
      '¿Clientes de Italia, Francia, China? Nuestro sistema responde automáticamente en su idioma.',
      '¿Una demo en vivo dura 15 minutos. Dime tu sector y te mostraré qué puedes automatizar desde mañana.',
    ],
    placeholder: 'Escribe o habla...',
    mobileHint: '🎤 En móvil usa el micrófono del teclado',
    voiceCta: '🎤 ¡Habla conmigo!',
    voiceCtaSub: ['Toca el campo de texto abajo,', 'luego presiona 🎤 en tu teclado'],
    typing: 'Ava está escribiendo',
    speaking: 'Hablando...',
    online: 'En línea ahora',
    chatBtn: '🤖 ¡Habla con Ava!',
    waBtn: 'Escríbenos por WhatsApp',
    errorMsg: 'Error de conexión. Escríbenos por WhatsApp al 0787 813 485.',
  },
  zh: {
    welcome: '您好！我是Ava，AIcraiova的AI虚拟销售助手——我不是真人。请告诉我您的业务类型，我将为您展示我们能自动化的内容！',
    aiLabel: '🤖 AI助手 · 非真人',
    bubbleGreet: (h) => h < 12 ? '早上好！' : h < 18 ? '下午好！' : '晚上好！',
    bubbles: [
      '我是Ava。一个24/7回复您客户的WhatsApp机器人 — 想看看它能为您的业务做什么吗？',
      '3名全职员工每月花费16,000–18,000 RON。我们的AI系统每月只需400–600欧元，而且从不出错。',
      '自动化公司中任何重复性流程。每月节省数百小时——无需招聘，无需担心病假。',
      '有网站吗？我可以为您添加像我这样的AI助手——接待客户、回答问题、进行预订。24/7，全自动。',
      '有来自意大利、法国、德国或罗马尼亚的客户？我们的系统会自动用他们的语言回复。',
      '现场演示只需15分钟。告诉我您的行业，我将展示您明天起就能自动化的内容。',
    ],
    placeholder: '请输入或说话...',
    mobileHint: '🎤 在手机上使用键盘麦克风',
    voiceCta: '🎤 和我说话！',
    voiceCtaSub: ['点击下方文本框，', '然后按键盘上的 🎤'],
    typing: 'Ava正在输入',
    speaking: '正在说话...',
    online: '现在在线',
    chatBtn: '🤖 和Ava交谈！',
    waBtn: '通过WhatsApp联系我们',
    errorMsg: '连接错误。请通过WhatsApp联系我们：0787 813 485！',
  },
}

function extractWA(text: string): { clean: string; waText: string | null } {
  const waMatch = text.match(/\[WA:([\s\S]+?)\]/) || text.match(/\[WA:([\s\S]+)$/)
  const clean = text
    .replace(/\[WA:[\s\S]+?\]/g, '')
    .replace(/\[WA:[\s\S]+$/g, '')
    .trim()
  return {
    clean: clean || text.trim(),
    waText: waMatch ? waMatch[1].trim() : null,
  }
}

function waLink(msg: string): string {
  return `https://wa.me/40787813485?text=${encodeURIComponent(msg)}`
}

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

function prepareForSpeech(text: string, lang: string): string {
  let s = text

  s = s.replace(/AIcraiova/gi, lang === 'ro' ? 'Ei Ai Craiova' : 'AI Craiova')
  s = s.replace(/\bAI\b/g, lang === 'ro' ? 'Ei Ai' : 'AI')
  s = s.replace(/n8n/gi, lang === 'ro' ? 'en opt en' : 'N 8 N')
  s = s.replace(/WhatsApp/gi, lang === 'ro' ? 'uotsap' : 'WhatsApp')
  if (lang === 'ro') {
    s = s.replace(/CRM/gi, 'C R M').replace(/ERP/gi, 'E R P')
       .replace(/SLA/gi, 'S L A').replace(/POS/gi, 'P O S')
  }

  s = s.replace(/[\u{1F300}-\u{1FFFF}]/gu, '').replace(/[*_~`#]/g, '')

  if (lang === 'ro') {
    s = s.replace(/×/g, ' ori ').replace(/\+/g, ' plus ').replace(/=\s*/g, ' egal ')

    const phoneMap: Record<string, string> = {}
    let phoneIdx = 0
    s = s.replace(/\b\d{10,}\b/g, (m) => {
      const key = `__PHONE${phoneIdx++}__`
      phoneMap[key] = m.split('').join(' ')
      return key
    })

    s = s.replace(/(\d[\d.]*),(\d+)/g, (_, int, dec) => {
      const n = parseInt(int.replace(/\./g, ''))
      return `${numRo(n)} virgulă ${numRo(parseInt(dec))}`
    })
    s = s.replace(/\b\d{1,3}(?:\.\d{3})+\b/g, (m) => numRo(parseInt(m.replace(/\./g, ''))))
    s = s.replace(/\b(\d+)\s*€/g, (_, n) => `${numRo(parseInt(n))} euro`)
    s = s.replace(/\b(\d+)\s*%/g, (_, n) => `${numRo(parseInt(n))} la sută`)
    s = s.replace(/\b(\d+)\s*(lei|ron)/gi, (_, n, unit) => `${numRo(parseInt(n))} ${unit}`)
    s = s.replace(/\b(\d+)\s*(luni|lună|zile|zi|ore|săptămâni)/gi, (_, n, unit) => `${numRo(parseInt(n))} ${unit}`)
    s = s.replace(/\b(\d{1,9})\b/g, (_, n) => numRo(parseInt(n)))

    for (const [key, val] of Object.entries(phoneMap)) s = s.replace(key, val)

    s = s.replace(/(\w)-(\w)/g, '$1 $2').replace(/(\w)\/(\w)/g, '$1 $2')
  }

  return s.trim()
}

function getVoice(lang: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  const bcp = LANG_TO_BCP47[lang] || 'ro-RO'
  const primary = bcp.split('-')[0]

  return voices.find(v => v.lang === bcp && v.name.toLowerCase().includes('female'))
    || voices.find(v => v.lang === bcp)
    || voices.find(v => v.lang.startsWith(primary) && v.name.toLowerCase().includes('female'))
    || voices.find(v => v.lang.startsWith(primary))
    || voices.find(v => v.lang.startsWith('en'))
    || voices[0]
    || null
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?…])\s+|(?<=—)\s*/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
}

function speak(text: string, lang: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const clean = prepareForSpeech(text, lang)
  const sentences = splitSentences(clean)
  if (sentences.length === 0) return

  const voice = getVoice(lang)
  const bcp47 = LANG_TO_BCP47[lang] || 'ro-RO'

  function makeUtt(s: string): SpeechSynthesisUtterance {
    const u = new SpeechSynthesisUtterance(s)
    u.lang = bcp47
    u.rate = 1.0
    u.pitch = 1.0
    u.volume = 1
    if (voice) u.voice = voice
    return u
  }

  let index = 0
  function speakNext() {
    if (index >= sentences.length) return
    const u = makeUtt(sentences[index])
    index++
    const lastChar = sentences[index - 1].slice(-1)
    const pause = (lastChar === '.' || lastChar === '!' || lastChar === '?') ? 280 : 180
    u.onend = () => setTimeout(speakNext, pause)
    window.speechSynthesis.speak(u)
  }

  speakNext()
}

export default function ChatBot() {
  const [detectedLang, setDetectedLang] = useState<string>('ro')
  const [open, setOpen] = useState(false)
  const [bubble, setBubble] = useState(false)
  const [bubbleTyping, setBubbleTyping] = useState(false)
  const [bubbleMsg, setBubbleMsg] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: UI_TEXT.ro.welcome }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showQuick, setShowQuick] = useState(true)
  const [voiceOn, setVoiceOn] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const bubbleTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  function clearBubbleTimers() {
    bubbleTimers.current.forEach(clearTimeout)
    bubbleTimers.current = []
  }

  function showBubbleMessage(msgs: string[], idx: number) {
    if (open) return
    setBubbleTyping(true)
    setBubbleMsg('')
    const t1 = setTimeout(() => {
      setBubbleTyping(false)
      setBubbleMsg(msgs[idx])
      const nextIdx = (idx + 1) % msgs.length
      const t2 = setTimeout(() => showBubbleMessage(msgs, nextIdx), 5000)
      bubbleTimers.current.push(t2)
    }, 1200)
    bubbleTimers.current.push(t1)
  }

  // Fetch detected language and start bubble
  useEffect(() => {
    fetch('/api/geo')
      .then(r => r.json())
      .then(({ lang }: { lang: string }) => {
        const l = UI_TEXT[lang] ? lang : 'en'
        setDetectedLang(l)
        setMessages(prev => {
          if (prev.length === 1 && prev[0].role === 'assistant') {
            return [{ role: 'assistant', content: UI_TEXT[l].welcome }]
          }
          return prev
        })
        const h = new Date().getHours()
        const ui = UI_TEXT[l]
        const greet = ui.bubbleGreet(h)
        const msgs = [greet + ' ' + ui.bubbles[0], ...ui.bubbles.slice(1)]
        const t = setTimeout(() => {
          setBubble(true)
          showBubbleMessage(msgs, 0)
        }, 2000)
        bubbleTimers.current.push(t)
      })
      .catch(() => {
        const h = new Date().getHours()
        const ui = UI_TEXT.ro
        const greet = ui.bubbleGreet(h)
        const msgs = [greet + ' ' + ui.bubbles[0], ...ui.bubbles.slice(1)]
        const t = setTimeout(() => {
          setBubble(true)
          showBubbleMessage(msgs, 0)
        }, 2000)
        bubbleTimers.current.push(t)
      })

    return () => clearBubbleTimers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (open) {
      setBubble(false)
      clearBubbleTimers()
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, open])

  useEffect(() => {
    if (!open && typeof window !== 'undefined') window.speechSynthesis?.cancel()
  }, [open])

  function speakText(text: string) {
    if (!voiceOn) return
    setSpeaking(true)
    const trySpeak = () => {
      speak(text, detectedLang)
      const interval = setInterval(() => {
        if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
          setSpeaking(false)
          clearInterval(interval)
        }
      }, 250)
      setTimeout(() => { setSpeaking(false); clearInterval(interval) }, 30000)
    }
    if (window.speechSynthesis.getVoices().length > 0) {
      trySpeak()
    } else {
      window.speechSynthesis.onvoiceschanged = () => { trySpeak(); window.speechSynthesis.onvoiceschanged = null }
    }
  }

  function handleFirstInteraction() {
    if (!userInteracted) {
      setUserInteracted(true)
      speakText(UI_TEXT[detectedLang]?.welcome || UI_TEXT.ro.welcome)
    }
  }

  function toggleVoice() {
    if (voiceOn) window.speechSynthesis?.cancel()
    setVoiceOn(v => !v)
    setSpeaking(false)
  }

  async function send(textParam?: string) {
    const msg = (textParam || input).trim()
    if (!msg || loading) return
    setShowQuick(false)
    const userMsg: Message = { role: 'user', content: msg }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    const ui = UI_TEXT[detectedLang] || UI_TEXT.ro
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages
            .filter(m => m.role !== 'assistant' || m.content !== (UI_TEXT[detectedLang]?.welcome || UI_TEXT.ro.welcome))
            .map(m => ({ role: m.role, content: m.content })),
          lang: detectedLang,
        }),
      })
      const data = await res.json()
      const raw = data.text || ui.errorMsg
      const { clean, waText } = extractWA(raw)
      setMessages(prev => [...prev, { role: 'assistant', content: clean, waText: waText || undefined }])
      speakText(clean)
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: ui.errorMsg }])
    } finally {
      setLoading(false)
    }
  }

  const ui = UI_TEXT[detectedLang] || UI_TEXT.ro

  return (
    <>
      {/* Fereastra chat */}
      {open && (
        <div className="fixed bottom-24 left-4 z-50 w-[320px] max-w-[calc(100vw-32px)] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
          style={{ height: '460px', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 shrink-0"
            style={{ background: 'linear-gradient(135deg, #6d28d9 0%, #2563eb 100%)' }}>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold shrink-0">AI</div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm leading-tight">Ava · AIcraiova</p>
              <p className="text-white/70 text-[10px] font-semibold mt-0.5">{ui.aiLabel}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {speaking ? (
                  <>
                    <span className="flex gap-0.5">
                      <span className="w-0.5 h-3 bg-emerald-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-0.5 h-3 bg-emerald-300 rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
                      <span className="w-0.5 h-3 bg-emerald-300 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                    </span>
                    <p className="text-emerald-300 text-xs">{ui.speaking}</p>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
                    <p className="text-white/65 text-xs">{ui.online}</p>
                  </>
                )}
              </div>
            </div>

            {/* Buton voce */}
            <button onClick={toggleVoice} title={voiceOn ? 'Oprește vocea' : 'Pornește vocea'}
              className={`p-1.5 rounded-full transition-colors ${voiceOn ? 'text-white hover:bg-white/15' : 'text-white/30 hover:bg-white/10'}`}>
              {voiceOn ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-3.536-9.536a5 5 0 000 7.072M9 12H3m18 0h-6" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              )}
            </button>

            <button onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white transition text-xl leading-none w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/15">
              ×
            </button>
          </div>

          {/* Mesaje */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ background: '#f7f8fc' }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[82%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'text-white rounded-2xl rounded-br-sm'
                    : 'bg-white text-gray-700 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100'
                }`}
                style={m.role === 'user' ? { background: 'linear-gradient(135deg, #6d28d9 0%, #2563eb 100%)' } : {}}>
                  {m.content}
                </div>
                {m.waText && (
                  <a
                    href={waLink(m.waText)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow transition-all"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.553 4.103 1.522 5.828L.057 23.082a.75.75 0 00.92.92l5.255-1.465A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.497-5.206-1.367l-.374-.214-3.876 1.081 1.081-3.876-.214-.374A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                    </svg>
                    {ui.waBtn}
                  </a>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {showQuick && messages.length === 1 && (
              <div className="bg-violet-50 border border-violet-200 rounded-2xl px-4 py-3 w-full text-center cursor-pointer mt-1"
                onClick={handleFirstInteraction}>
                <p className="text-violet-700 font-semibold text-sm mb-1">{ui.voiceCta}</p>
                <p className="text-violet-500 text-xs leading-relaxed">
                  {ui.voiceCtaSub[0]}<br/><strong>{ui.voiceCtaSub[1]}</strong>
                </p>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="bg-white border-t border-gray-100 px-3 pt-2 pb-3 shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                onFocus={handleFirstInteraction}
                placeholder={ui.placeholder}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 placeholder-gray-400"
                style={{ fontSize: '16px' }}
              />
              <button onClick={() => send()} disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 shrink-0 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #6d28d9 0%, #2563eb 100%)' }}>
                <svg className="w-4 h-4 text-white rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-gray-400 text-[11px] mt-1.5 text-center">{ui.mobileHint}</p>
          </div>
        </div>
      )}

      {/* Bubble rotativă */}
      {bubble && !open && (
        <div
          className="fixed bottom-24 left-20 z-50 bg-white rounded-2xl rounded-bl-sm shadow-xl border border-gray-100 px-4 py-3 max-w-[220px] cursor-pointer transition-all"
          onClick={() => { setOpen(true); setBubble(false); clearBubbleTimers() }}
        >
          <button
            className="absolute -top-2 -right-2 bg-gray-100 hover:bg-gray-200 rounded-full w-5 h-5 text-xs flex items-center justify-center text-gray-500 transition-colors"
            onClick={e => { e.stopPropagation(); setBubble(false); clearBubbleTimers() }}
          >×</button>

          {bubbleTyping ? (
            <div className="flex items-center gap-2 py-1">
              <span className="text-xs text-gray-400 italic">{ui.typing}</span>
              <span className="flex gap-0.5">
                <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          ) : (
            <p className="text-sm text-gray-800 leading-snug">{bubbleMsg}</p>
          )}
        </div>
      )}

      {/* Buton toggle + eticheta */}
      <div className="fixed bottom-6 left-4 z-50 flex flex-col items-start gap-1.5">
        {!open && (
          <button
            onClick={() => { setOpen(true); setBubble(false); clearBubbleTimers() }}
            className="text-xs font-semibold whitespace-nowrap px-3 py-1.5 rounded-full shadow-md border transition-all hover:opacity-90"
            style={{ background: 'white', color: '#6d28d9', borderColor: '#6d28d9aa' }}
          >
            {ui.chatBtn}
          </button>
        )}
        <button
          onClick={() => { setOpen(o => !o); setBubble(false); clearBubbleTimers() }}
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 hover:shadow-xl shrink-0"
          style={{ background: 'linear-gradient(135deg, #6d28d9 0%, #2563eb 100%)' }}
          aria-label="Chat Ava"
        >
          {open ? (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
            </svg>
          )}
        </button>
      </div>
    </>
  )
}
