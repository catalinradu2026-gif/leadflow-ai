'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect, Suspense } from 'react'

import { useIsMobile } from '../../../hooks/useIsMobile'

type Msg = { role: 'user' | 'assistant'; content: string }

const INTREBARI_RAPIDE: Record<string, string[]> = {
  M1: [
    'Explică-mi derivatele cu exemple pas cu pas',
    'Cum calculez o integrală definită?',
    'Rezolvă un sistem cu metoda Cramer',
    'Fă-mi studiul complet al unei funcții',
    'Generează un subiect III complet BAC 2026',
  ],
  M2: [
    'Explică funcția de gradul II cu grafic',
    'Dă-mi exerciții cu probabilități clasice',
    'Cum rezolv o ecuație exponențială?',
    'Explică derivatele pas cu pas pentru M2',
    'Generează un subiect I complet BAC 2026',
  ],
}

const CAPITOLE: Record<string, string[]> = {
  M1: [
    'Mulțimi de numere (N, Z, Q, R)',
    'Matrice și determinanți',
    'Sisteme liniare (Cramer, Gauss)',
    'Combinatorică și binom Newton',
    'Funcții — proprietăți generale',
    'Funcții elem. (exp., log., putere)',
    'Ecuații și inecuații',
    'Șiruri și limite',
    'Continuitate și derivabilitate',
    'Studiul funcției (monotonie, extreme)',
    'Integrala nedefinită (primitive)',
    'Integrala definită (Leibniz-Newton)',
    'Geometrie analitică în plan',
    'Vectori și geometrie în spațiu',
    'Corpuri geometrice (arii, volume)',
  ],
  M2: [
    'Mulțimi de numere (N, Z, Q, R)',
    'Matrice ordin 2-3 și determinanți',
    'Sisteme liniare (2 necunoscute)',
    'Funcția liniară și pătratică',
    'Funcții exponențiale și logaritmice',
    'Ecuații și inecuații de grad I-II',
    'Derivate elementare și reguli',
    'Monotonie și extreme (studiu funcție)',
    'Probabilități clasice',
    'Statistică (medie, mediană, mod)',
    'Geometrie analitică în plan',
    'Geometrie în spațiu — noțiuni bază',
    'Corpuri geometrice (arii, volume)',
  ],
}

const SYSTEM_PROMPTS: Record<string, string> = {
  M1: `Ești CEL MAI BUN profesor de matematică din România, specializat în BAC profil M1 (Matematică-Informatică), conform programei oficiale MEN 2026.

PERSONALITATEA TA:
- Ești cald, răbdător și entuziast — elevul trebuie să ÎNȚELEAGĂ, nu să memoreze
- Explici ÎNTOTDEAUNA prin exemple concrete, nu prin teorie abstractă
- Structura fiecărui răspuns: 1) Definiție scurtă și clară (1-2 propoziții) → 2) Exemplu rezolvat complet pas cu pas pe tablă
- Numerotezi pașii: "Pasul 1:", "Pasul 2:" etc.
- La final întrebi: "Ai înțeles? Vrei un alt exemplu?"
- Dacă elevul greșește, nu critici — explici din nou cu un exemplu diferit
- Folosești analogii simple: "derivata e ca viteza — îți spune cât de repede se schimbă"

PROGRAMA OFICIALĂ M1 — CONȚINUTURI COMPLETE:

## ALGEBRĂ LINIARĂ
- Matrice: definiție, tipuri (pătrată, nulă, identitate, transpusă), operații (adunare, înmulțire cu scalar, produs matriceal)
- Determinanți de ordinul 2 și 3 (regula Sarrus)
- Matricea inversă (pentru matrice de ordinul 2)
- Sisteme de ecuații liniare: scrierea matriceală Ax=b, metoda Cramer (det≠0), metoda Gauss (eliminare), discuția soluțiilor
- Rangul unei matrice

## COMBINATORICĂ ȘI PROBABILITĂȚI
- Permutări, aranjamente, combinări — formule și proprietăți
- Binomul lui Newton: formula generală, coeficienți binomiali, triunghiul lui Pascal
- Evenimente, probabilitate clasică, probabilitate condiționată

## FUNCȚII REALE
- Definiție, domeniu, codomeniu, grafic
- Injectivitate, surjectivitate, bijectivitate
- Monotonie, mărginire, paritate (funcții pare/impare), periodicitate
- Funcția compusă, funcția inversă
- Funcții elementare și proprietățile lor:
  • Funcția liniară f(x)=ax+b și pătratică f(x)=ax²+bx+c
  • Funcția de putere f(x)=xⁿ și f(x)=x^(1/n)
  • Funcția exponențială f(x)=aˣ (a>0, a≠1) — grafic, monotonie
  • Funcția logaritmică f(x)=logₐx — grafic, relație cu exponențiala
- Ecuații și inecuații: raționale, iraționale, exponențiale, logaritmice, cu modul

## ANALIZĂ MATEMATICĂ
- Șiruri de numere reale: definiție, monotonie, mărginire
- Șiruri aritmetice (rațiunea d, termenul general, suma primilor n termeni)
- Șiruri geometrice (rațiunea q, termenul general, suma primilor n termeni)
- Limita unui șir: cazuri nedeterminate (∞-∞, ∞/∞, 0/0), regula Stolz
- Limita unei funcții în punct și la infinit, asimptote (orizontale, verticale, oblice)
- Continuitate: definiție, tipuri de discontinuitate, teorema lui Weierstrass, teorema valorii intermediare
- Derivabilitate: definiție, derivate elementare (xⁿ, eˣ, ln x, sin x, cos x)
- Reguli de derivare: suma, produsul, câtul, funcția compusă
- Derivata funcției inverse
- Aplicații ale derivatei: monotonie, extreme locale, convexitate/concavitate, puncte de inflexiune
- Studiul complet al unei funcții (domeniu, intersecții cu axele, paritate, asimptote, derivata I și II, tabel variații, grafic)
- Integrala nedefinită: primitive, tabel primitive elementare
- Metode de integrare: substituție, integrare prin părți
- Integrala definită: proprietăți, regula Leibniz-Newton
- Aplicații: aria suprafeței plane, lungimea arcului de curbă

## GEOMETRIE
- Vectori în plan și spațiu: operații, produs scalar, produs vectorial
- Geometrie analitică în plan: ecuația dreptei (forme), distanța de la punct la dreaptă, unghiuri, arii
- Geometrie în spațiu: drepte și plane (paralelism, perpendicularitate, unghiuri diedre)
- Coordonate în spațiu, distanțe, produse de vectori
- Corpuri geometrice: prismă, piramidă, cilindru, con, sferă — arii și volume

STRUCTURA SUBIECTULUI BAC M1:
• Subiect I (30p): 6 cerințe × 5p — algebră, combinatorică, geometrie analitică, limite
• Subiect II (30p): 6 cerințe × 5p — funcții, ecuații, sisteme, probabilități
• Subiect III (30p): 6 cerințe × 5p — studiu funcție, integrale, geometrie în spațiu

FORMAT RĂSPUNS PE TABLĂ:
📌 DEFINIȚIE: [1-2 propoziții clare]

✏️ EXEMPLU REZOLVAT:
Pasul 1: ...
Pasul 2: ...
Pasul 3: ...
=== Rezultat: ===

💡 Acum încearcă tu: [exercițiu similar]

- Limbaj: română, ton cald și energic
- Răspunsurile să fie clare și vizuale, ca pe o tablă reală`,

  M2: `Ești CEL MAI BUN profesor de matematică din România, specializat în BAC profil M2 (Științe ale Naturii), conform programei oficiale MEN 2026.

PERSONALITATEA TA:
- Ești cald, răbdător și entuziast — elevul trebuie să ÎNȚELEAGĂ, nu să memoreze
- Explici ÎNTOTDEAUNA prin exemple concrete, nu prin teorie abstractă
- Structura fiecărui răspuns: 1) Definiție scurtă și clară (1-2 propoziții) → 2) Exemplu rezolvat complet pas cu pas pe tablă
- Numerotezi pașii: "Pasul 1:", "Pasul 2:" etc.
- La final întrebi: "Ai înțeles? Vrei un alt exemplu?"
- Dacă elevul greșește, nu critici — explici din nou cu un exemplu diferit
- Folosești analogii simple pentru M2: "funcția pătratică e ca o aruncare de minge — urcă, atinge maximul, coboară"

PROGRAMA OFICIALĂ M2 — CONȚINUTURI COMPLETE:

## ALGEBRĂ LINIARĂ (simplificat față de M1)
- Matrice de ordinul 2 și 3: operații de bază (adunare, produs cu scalar, înmulțire)
- Determinanți de ordinul 2 (regulă directă) și ordinul 3 (regula Sarrus)
- Sisteme de ecuații liniare cu 2 necunoscute: metoda Cramer, metoda substituției, metoda reducerii
- Discuția compatibilității unui sistem

## FUNCȚII REALE
- Funcția liniară f(x)=ax+b: grafic, pantă, intersecții
- Funcția de gradul II f(x)=ax²+bx+c: vârful parabolei, forma canonică, intersecții cu axele, grafic
- Ecuații de gradul I și II, inecuații de gradul I și II
- Funcția exponențială f(x)=aˣ: grafic, proprietăți, ecuații exponențiale (metoda substituției)
- Funcția logaritmică f(x)=logₐx: definiție, proprietăți, ecuații logaritmice
- Funcția modul și valoarea absolută

## COMBINATORICĂ ȘI PROBABILITĂȚI
- Permutări, aranjamente, combinări — formule, calcul numeric
- Probabilitate clasică: definiție, spațiu de evenimente, operații cu evenimente
- Evenimente independente, probabilitate condiționată (noțiuni de bază)
- Statistică: medie aritmetică, mediană, modul, frecvențe relative

## ANALIZĂ MATEMATICĂ
- Șiruri aritmetice și geometrice: termen general, sumă
- Limite de funcții (cazuri elementare, limitele funcțiilor elementare)
- Asimptote orizontale și verticale (fără oblice)
- Continuitate: definiție, exemple simple
- Derivate ale funcțiilor elementare: xⁿ, eˣ, ln x, sin x, cos x, tg x
- Reguli de derivare: suma, produsul, câtul, compusă (cazuri simple)
- Aplicații derivate: monotonie pe intervale, extreme locale (tabel de semn f')
- Studiul de funcție simplificat: domeniu, asimptote orizontale/verticale, monotonie, extreme, grafic

## GEOMETRIE
- Vectori în plan: operații, produs scalar, unghi între vectori
- Geometrie analitică în plan: ecuația dreptei (forme: generală, segmentară, parametrică), distanța punct-dreaptă, condiție de paralelism/perpendicularitate
- Aria unui triunghi cu coordonate
- Geometrie în spațiu — noțiuni de bază: drepte și plane, paralelism, perpendicularitate
- Corpuri geometrice: cub, cuboid, prismă, piramidă, cilindru, con, sferă — formule de arie și volum

STRUCTURA SUBIECTULUI BAC M2:
• Subiect I (30p): 6 cerințe × 5p — calcul numeric, algebră, funcții simple
• Subiect II (30p): 6 cerințe × 5p — ecuații, sisteme, probabilități, statistică
• Subiect III (30p): 6 cerințe × 5p — studiu funcție simplificat, geometrie

FORMAT RĂSPUNS PE TABLĂ:
📌 DEFINIȚIE: [1-2 propoziții clare]

✏️ EXEMPLU REZOLVAT:
Pasul 1: ...
Pasul 2: ...
Pasul 3: ...
=== Rezultat: ===

💡 Acum încearcă tu: [exercițiu similar]

- Limbaj: română, ton cald și energic
- Evită notații abstracte inutile — M2 e pentru elevi care nu au matematică intensiv
- Răspunsurile să fie clare și vizuale, ca pe o tablă reală`,
}

function MatematicaChat() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const searchParams = useSearchParams()
  const profil = (searchParams.get('profil') || 'M1') as 'M1' | 'M2'

  const [messages, setMessages] = useState<Msg[]>([])
  const [boardText, setBoardText] = useState('')
  const [boardFull, setBoardFull] = useState('')
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)

  const DAILY_LIMIT = 10
  const storageKey = `edu_bac_${new Date().toDateString()}`

  function getDailyCount(): number {
    if (typeof window === 'undefined') return 0
    return parseInt(localStorage.getItem(storageKey) || '0', 10)
  }

  function incrementDailyCount() {
    const next = getDailyCount() + 1
    localStorage.setItem(storageKey, String(next))
    return next
  }

  const [listening, setListening] = useState(false)
  const typewriterRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const boardContainerRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  function toggleMic() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { alert('Browserul tău nu suportă recunoaștere vocală. Folosește Chrome.'); return }

    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }

    const rec = new SR()
    rec.lang = 'ro-RO'
    rec.continuous = false
    rec.interimResults = false
    recognitionRef.current = rec

    rec.onstart = () => setListening(true)
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      const transcript = e.results[0]?.[0]?.transcript
      if (transcript) {
        setInput(transcript)
        setTimeout(() => sendMsg(transcript), 100)
      }
    }
    rec.start()
  }

  // ResizeObserver pentru canvas
  useEffect(() => {
    if (!boardContainerRef.current) return
    const obs = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      setCanvasSize({ w: Math.floor(width), h: Math.floor(height) })
    })
    obs.observe(boardContainerRef.current)
    return () => obs.disconnect()
  }, [])

  // Desenează tabla pe canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || canvasSize.w === 0) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = canvasSize.w * dpr
    canvas.height = canvasSize.h * dpr
    canvas.style.width = canvasSize.w + 'px'
    canvas.style.height = canvasSize.h + 'px'
    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)
    const W = canvasSize.w
    const H = canvasSize.h
    const PADDING = 32
    const FONT_SIZE = 22
    const LINE_HEIGHT = 36
    ctx.clearRect(0, 0, W, H)
    ctx.font = `${FONT_SIZE}px 'Caveat', cursive`

    function seededRand(seed: number) {
      const x = Math.sin(seed + 1) * 10000
      return x - Math.floor(x)
    }

    function drawChalkText(text: string, x: number, y: number, rgb: string, baseOffset: number) {
      let cx = x
      ctx.textBaseline = 'top'
      for (let i = 0; i < text.length; i++) {
        const s = baseOffset + i
        const ox = (seededRand(s * 2) - 0.5) * 1.6
        const oy = (seededRand(s * 2 + 1) - 0.5) * 1.6
        const alpha = 0.85 + seededRand(s * 3) * 0.15
        ctx.fillStyle = `rgba(${rgb},${alpha})`
        ctx.shadowBlur = 2
        ctx.shadowColor = `rgba(${rgb},0.35)`
        ctx.fillText(text[i], cx + ox, y + oy)
        cx += ctx.measureText(text[i]).width
      }
      return cx - x
    }

    function wrapText(text: string, maxW: number): string[] {
      const lines: string[] = []
      for (const para of text.split('\n')) {
        if (!para) { lines.push(''); continue }
        let line = ''
        for (const word of para.split(' ')) {
          const test = line ? line + ' ' + word : word
          if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = word }
          else line = test
        }
        if (line) lines.push(line)
      }
      return lines
    }

    const isEmpty = messages.length === 0 && !boardText
    if (isEmpty) {
      ctx.textBaseline = 'middle'
      ctx.font = '28px "Caveat", cursive'
      ctx.fillStyle = 'rgba(134,239,172,0.35)'
      ctx.shadowBlur = 0
      const title = `Profesor AI — Matematică ${profil}`
      ctx.fillText(title, PADDING, H / 2 - 20)
      ctx.font = '20px "Caveat", cursive'
      ctx.fillStyle = 'rgba(134,239,172,0.2)'
      ctx.fillText('Pune o întrebare sau alege un subiect →', PADDING, H / 2 + 20)
      return
    }

    type CLine = { text: string; rgb: string; off: number }
    const clines: CLine[] = []
    let off = 0
    const maxW = W - PADDING * 2

    const lastUser = [...messages].reverse().find(m => m.role === 'user')
    if (lastUser) {
      const wrapped = wrapText('Elev: ' + lastUser.content, maxW)
      for (const l of wrapped) { clines.push({ text: l, rgb: '251,191,36', off }); off += l.length }
      clines.push({ text: '', rgb: '251,191,36', off }); off++
    }

    if (boardText) {
      clines.push({ text: 'Prof:', rgb: '134,239,172', off }); off += 5
      for (const l of wrapText(boardText, maxW)) { clines.push({ text: l, rgb: '240,255,235', off }); off += l.length }
    }

    const totalH = clines.length * LINE_HEIGHT + PADDING * 2
    const scrollOff = Math.max(0, totalH - H)

    for (let i = 0; i < clines.length; i++) {
      const y = PADDING + i * LINE_HEIGHT - scrollOff
      if (y + LINE_HEIGHT < 0 || y > H) continue
      const cl = clines[i]
      if (cl.text) drawChalkText(cl.text, PADDING, y, cl.rgb, cl.off)
    }

    // Cursor clipit
    if (typing && clines.length > 0) {
      const last = clines[clines.length - 1]
      const ly = PADDING + (clines.length - 1) * LINE_HEIGHT - scrollOff
      const tw = ctx.measureText(last.text).width
      if (Math.floor(Date.now() / 500) % 2 === 0) {
        ctx.fillStyle = 'rgba(134,239,172,0.9)'
        ctx.shadowBlur = 4
        ctx.shadowColor = 'rgba(134,239,172,0.5)'
        ctx.fillRect(PADDING + tw + 3, ly + 2, 2, FONT_SIZE)
      }
    }
  }, [boardText, canvasSize, messages, typing, profil])

  function startSyncedOutput(text: string) {
    if (typewriterRef.current) clearInterval(typewriterRef.current)
    window.speechSynthesis?.cancel()
    setBoardText('')
    setTyping(true)

    // Tabla scrie tot răspunsul la 80ms/char
    const MS_PER_CHAR = 80
    let i = 0
    typewriterRef.current = setInterval(() => {
      i++
      setBoardText(text.slice(0, i))
      if (i >= text.length) { clearInterval(typewriterRef.current!); setTyping(false) }
    }, MS_PER_CHAR)

    if (!voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) {
      setSpeaking(false)
      return
    }

    // Vocea spune DOAR definiția — restul se desenează pe tablă
    const defLine = text.split('\n').find(l => l.includes('DEFINIȚIE') || l.includes('Definiție'))
    const voiceText = defLine
      ? defLine.replace(/^.*DEFINIȚIE\s*:\s*/i, '').trim()
      : text.split('\n')[0].trim()

    setSpeaking(true)
    const u = new SpeechSynthesisUtterance(voiceText)
    u.lang = 'ro-RO'
    u.rate = 0.85
    const voices = window.speechSynthesis.getVoices()
    const roVoice = voices.find(v => v.lang.startsWith('ro'))
    if (roVoice) u.voice = roVoice
    u.onend = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(u)
  }

  async function sendMsg(text?: string) {
    const userMsg = (text || input).trim()
    if (!userMsg || loading) return

    if (getDailyCount() >= DAILY_LIMIT) {
      setShowUpgrade(true)
      return
    }

    setInput('')
    const newMessages: Msg[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)
    setBoardText('...')
    try {
      const res = await fetch('/api/bac-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, materie: 'matematica', profil, systemPrompt: SYSTEM_PROMPTS[profil] }),
      })
      const data = await res.json()

      if (data.text === 'DAILY_LIMIT') {
        setShowUpgrade(true)
        setLoading(false)
        setBoardText('')
        return
      }

      const reply = data.text || 'Eroare. Încercați din nou.'
      incrementDailyCount()
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
      setBoardFull(reply)
      startSyncedOutput(reply)

      if (getDailyCount() >= DAILY_LIMIT) setShowUpgrade(true)
    } catch {
      const err = 'Eroare de conexiune. Încercați din nou.'
      setBoardText(err)
      setMessages(prev => [...prev, { role: 'assistant', content: err }])
    }
    setLoading(false)
  }

  const isEmpty = messages.length === 0 && !boardText

  return (
    <div style={{ height: '100vh', background: '#0a0f1a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Upgrade overlay */}
      {showUpgrade && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '40px 36px', maxWidth: '440px', width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>🎓</div>
            <div style={{ display: 'inline-block', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '20px', padding: '3px 14px', fontSize: '11px', fontWeight: 700, color: '#a5b4fc', letterSpacing: '0.5px', marginBottom: '16px' }}>
              VERSIUNE BETA
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f1f5f9', marginBottom: '10px', lineHeight: 1.3 }}>
              Școala ta a folosit cele 10 întrebări ale zilei
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.7, marginBottom: '8px' }}>
              În versiunea Beta EDU DIGITAL, fiecare școală beneficiază de <strong style={{ color: '#f1f5f9' }}>10 întrebări gratuite pe zi</strong>, partajate între toți elevii. Contorul se resetează automat la miezul nopții.
            </p>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '28px' }}>
              Pentru acces nelimitat pentru toată școala, <strong style={{ color: '#a5b4fc' }}>directorul sau ISJ-ul poate activa platforma completă</strong> — fără niciun cost pentru tine ca elev.
            </p>
            <a
              href={`mailto:contact@aicraiova.ro?subject=Acces complet EDU DIGITAL&body=Buna ziua, sunt elev si as dori ca scoala mea sa activeze accesul complet la platforma EDU DIGITAL BAC.`}
              style={{ display: 'block', background: '#6366f1', color: '#fff', padding: '14px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', marginBottom: '12px' }}
            >
              Solicită accesul pentru școala ta →
            </a>
            <button
              onClick={() => setShowUpgrade(false)}
              style={{ background: 'transparent', border: 'none', color: '#334155', fontSize: '13px', cursor: 'pointer', padding: '8px' }}
            >
              Închide
            </button>
          </div>
        </div>
      )}

      {/* Topbar */}
      <div style={{ background: '#0f172a', borderBottom: '1px solid #1e293b', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '52px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/edu/bac')} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '13px' }}>← BAC</button>
          <div style={{ width: 1, height: 18, background: '#1e293b' }} />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>📐 Matematică {profil}</span>
          {speaking && <span style={{ fontSize: '11px', color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '4px' }}>🔊 explică...</span>}
          {typing && !speaking && <span style={{ fontSize: '11px', color: '#22c55e' }}>✏️ scrie...</span>}
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <div
            onClick={() => getDailyCount() >= DAILY_LIMIT && setShowUpgrade(true)}
            style={{ fontSize: '11px', color: getDailyCount() >= DAILY_LIMIT ? '#ef4444' : '#475569', background: 'rgba(255,255,255,0.04)', border: '1px solid #1e293b', borderRadius: '6px', padding: '4px 10px', cursor: getDailyCount() >= DAILY_LIMIT ? 'pointer' : 'default', whiteSpace: 'nowrap' }}
          >
            {DAILY_LIMIT - getDailyCount() > 0 ? `${DAILY_LIMIT - getDailyCount()}/${DAILY_LIMIT} întrebări azi` : '0 întrebări rămase'}
          </div>
          <button
            onClick={() => { if (voiceEnabled) { window.speechSynthesis?.cancel(); setSpeaking(false) }; setVoiceEnabled(v => !v) }}
            style={{ background: voiceEnabled ? 'rgba(167,139,250,0.15)' : 'transparent', border: `1px solid ${voiceEnabled ? '#a78bfa' : '#1e293b'}`, borderRadius: '6px', padding: '4px 10px', fontSize: '14px', cursor: 'pointer', color: voiceEnabled ? '#a78bfa' : '#334155' }}
          >
            {voiceEnabled ? '🔊' : '🔇'}
          </button>
          <button
            onClick={() => setShowHistory(h => !h)}
            style={{ background: showHistory ? 'rgba(99,102,241,0.15)' : 'transparent', border: `1px solid ${showHistory ? '#6366f1' : '#1e293b'}`, borderRadius: '6px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer', color: showHistory ? '#a5b4fc' : '#334155', fontWeight: 600 }}
          >
            📋 Istoric
          </button>
          <button onClick={() => router.push('/edu/bac/matematica?profil=M1')} style={{ background: profil === 'M1' ? '#1d4ed8' : 'transparent', border: `1px solid ${profil === 'M1' ? '#1d4ed8' : '#1e293b'}`, color: profil === 'M1' ? '#fff' : '#475569', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>M1</button>
          <button onClick={() => router.push('/edu/bac/matematica?profil=M2')} style={{ background: profil === 'M2' ? '#1d4ed8' : 'transparent', border: `1px solid ${profil === 'M2' ? '#1d4ed8' : '#1e293b'}`, color: profil === 'M2' ? '#fff' : '#475569', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>M2</button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: isMobile ? 'column' : 'row', overflow: 'hidden' }}>

        {/* Tablă */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Suprafața tablei — Canvas cu efect cretă */}
          <div
            ref={boardContainerRef}
            style={{
              flex: 1,
              background: 'linear-gradient(160deg, #0d2b0d 0%, #0a230a 40%, #0c2a0c 100%)',
              borderBottom: '4px solid #1a3d1a',
              borderRight: isMobile ? 'none' : '3px solid #1a3d1a',
              position: 'relative',
              boxShadow: 'inset 0 0 60px rgba(0,0,0,0.5)',
              overflow: 'hidden',
            }}
          >
            {/* Linii orizontale subtile ca o tablă reală */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(transparent, transparent 35px, rgba(255,255,255,0.02) 35px, rgba(255,255,255,0.02) 36px)', pointerEvents: 'none', zIndex: 1 }} />
            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 2 }} />
          </div>

          {/* Bordul tablei (chalk tray) */}
          <div style={{ background: '#2d1b00', height: '12px', borderBottom: '2px solid #1a0f00', flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 20px', gap: '8px' }}>
            {['#fff', '#fca5a5', '#86efac', '#93c5fd', '#fde68a'].map((c, i) => (
              <div key={i} style={{ width: 28, height: 6, background: c, borderRadius: '3px', opacity: 0.7 }} />
            ))}
          </div>

          {/* Input */}
          <div style={{ background: '#0f172a', borderTop: '1px solid #1e293b', padding: '12px 16px', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMsg()}
                placeholder={listening ? '🎤 Ascult...' : `Întreabă profesorul despre Matematică ${profil}...`}
                style={{ flex: 1, background: listening ? 'rgba(239,68,68,0.08)' : '#1e293b', border: `1px solid ${listening ? '#ef4444' : '#334155'}`, borderRadius: '10px', padding: '10px 16px', fontSize: '14px', color: '#e2e8f0', outline: 'none', transition: 'all 0.2s' }}
              />
              <button
                onClick={toggleMic}
                title={listening ? 'Oprește microfonul' : 'Vorbește cu profesorul'}
                style={{
                  background: listening ? '#ef4444' : 'rgba(239,68,68,0.1)',
                  border: `1px solid ${listening ? '#ef4444' : 'rgba(239,68,68,0.3)'}`,
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '18px',
                  cursor: 'pointer',
                  flexShrink: 0,
                  animation: listening ? 'pulse 1s infinite' : 'none',
                }}
              >
                🎤
              </button>
              <button
                onClick={() => sendMsg()}
                disabled={loading || typing}
                style={{ background: (loading || typing) ? '#1e293b' : '#1d4ed8', color: (loading || typing) ? '#475569' : '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '14px', fontWeight: 700, cursor: (loading || typing) ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
              >
                {loading ? '⏳' : typing ? '✏️' : 'Întreabă →'}
              </button>
            </div>
          </div>
        </div>

        {/* Panel lateral — întrebări rapide + istoric */}
        {!isMobile && (
          <div style={{ width: '260px', background: '#0f172a', borderLeft: '1px solid #1e293b', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>

            {showHistory ? (
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                <div style={{ fontSize: '11px', color: '#475569', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Istoric conversație</div>
                {messages.length === 0 ? (
                  <div style={{ fontSize: '12px', color: '#334155', textAlign: 'center', marginTop: '20px' }}>Nicio conversație încă</div>
                ) : (
                  messages.map((m, i) => (
                    <div key={i} style={{ marginBottom: '10px', padding: '8px 10px', background: m.role === 'user' ? 'rgba(29,78,216,0.1)' : 'rgba(34,197,94,0.06)', border: `1px solid ${m.role === 'user' ? 'rgba(29,78,216,0.2)' : 'rgba(34,197,94,0.1)'}`, borderRadius: '8px' }}>
                      <div style={{ fontSize: '10px', color: m.role === 'user' ? '#93c5fd' : '#86efac', fontWeight: 700, marginBottom: '4px' }}>{m.role === 'user' ? 'Tu' : 'Profesor'}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{m.content.slice(0, 120)}{m.content.length > 120 ? '...' : ''}</div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                <div style={{ fontSize: '11px', color: '#475569', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Subiecte rapide</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {INTREBARI_RAPIDE[profil].map(q => (
                    <button
                      key={q}
                      onClick={() => sendMsg(q)}
                      disabled={loading || typing}
                      style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#94a3b8', cursor: 'pointer', textAlign: 'left', lineHeight: 1.5, transition: 'all 0.15s' }}
                      onMouseEnter={e => { (e.currentTarget.style.borderColor = '#3b82f6'); (e.currentTarget.style.color = '#e2e8f0') }}
                      onMouseLeave={e => { (e.currentTarget.style.borderColor = '#334155'); (e.currentTarget.style.color = '#94a3b8') }}
                    >
                      {q}
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#475569', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Capítole BAC {profil}</div>
                  {CAPITOLE[profil].map(cap => (
                    <button
                      key={cap}
                      onClick={() => sendMsg(`Explică-mi capitolul: ${cap}`)}
                      disabled={loading || typing}
                      style={{ display: 'block', width: '100%', background: 'none', border: 'none', color: '#6366f1', fontSize: '12px', cursor: 'pointer', textAlign: 'left', padding: '4px 0', lineHeight: 1.6 }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#a5b4fc')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#6366f1')}
                    >
                      → {cap}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&display=swap');
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
        }
      `}</style>
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
