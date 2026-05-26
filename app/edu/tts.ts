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

export function prepareForSpeech(text: string): string {
  let s = text
  // Emoji și simboluri
  s = s.replace(/[\u{1F300}-\u{1FFFF}]/gu, '')
       .replace(/[\u{2600}-\u{26FF}]/gu, '')
       .replace(/[\u{2700}-\u{27BF}]/gu, '')
       .replace(/[*_~`#→←•·🔴🟡🟢]/g, '')
       .replace(/—/g, ', ')
  // Titluri de adresare
  s = s.replace(/\bD(?:l|omn)\.\s*/g, 'Domnule ')
       .replace(/\bD(?:na|oamn[aă])\.\s*/g, 'Doamnă ')
       .replace(/\bD-na\b\.?\s*/g, 'Doamnă ')
       .replace(/\bDl\b\.?\s*/g, 'Domnule ')
       .replace(/\bDna\b\.?\s*/g, 'Doamnă ')
  // Funcții abreviate
  s = s.replace(/\bDir\.\s*/g, 'Director ')
       .replace(/\bProf\.\s*/g, 'Profesor ')
       .replace(/\bDr\.\s*/g, 'Doctor ')
       .replace(/\bInsp\.\s*/g, 'Inspector ')
       .replace(/\bInv\.\s*/g, 'Învățător ')
       .replace(/\bEd\.\s*/g, 'Educator ')
  // ARA — citit fonetic natural (ca un cuvânt românesc), nu literă cu literă
  s = s.replace(/\bARA\b/g, 'Ara')
  // Abrevieri românești
  s = s.replace(/\bAI\b/g, 'Inteligență Artificială')
       .replace(/\bBAC\b/g, 'Bacalaureat')
       .replace(/\bEN\b/g, 'Evaluarea Națională')
       .replace(/\bARACI P\b/g, 'Aracip')
       .replace(/\bARACIP\b/g, 'Aracip')
       .replace(/\bISJ\b/g, 'Inspectoratul Școlar Județean')
       .replace(/\bPNRR\b/g, 'Planul Național de Redresare și Reziliență')
       .replace(/\bPDI\b/g, 'Planul de Dezvoltare Instituțională')
       .replace(/\bROI\b/g, 'Regulamentul de Ordine Interioară')
       .replace(/\bRAEI\b/g, 'Raportul de Autoevaluare Internă')
       .replace(/\bRAE\b/g, 'Raportul de Autoevaluare')
       .replace(/\bM1\b/g, 'M unu')
       .replace(/\bM2\b/g, 'M doi')
       .replace(/\bnr\./gi, 'numărul')
       .replace(/\bpct\./gi, 'punctul')
       .replace(/\bcls\.\s*/gi, 'clasa ')
       .replace(/\b24\/7\b/g, 'douăzeci și patru din șapte')
  // Numere
  s = s.replace(/\b(\d+)\/(\d{4})\b/g, (_, n, y) => `${numRo(parseInt(n))} din ${numRo(parseInt(y))}`)
  s = s.replace(/\b(\d{1,9})\b/g, (_, n) => numRo(parseInt(n)))
  // Curățare finală
  s = s.replace(/\s{2,}/g, ' ').replace(/,\s*,/g, ',')
  return s.trim()
}

export function getVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  return voices.find(v => v.lang === 'ro-RO' && /ioana|carmen|maria|andrei/i.test(v.name))
    || voices.find(v => v.lang === 'ro-RO')
    || voices.find(v => v.lang.startsWith('ro'))
    || voices.find(v => v.lang === 'en-GB' && /female|woman/i.test(v.name))
    || voices.find(v => v.lang.startsWith('en-GB'))
    || voices[0]
    || null
}

export function splitSentences(text: string): string[] {
  // Împarte pe punct/!/?/... și pe virgulă dacă fraza e mai lungă de 60 de caractere
  const primary = text.split(/(?<=[.!?…])\s+/).map(s => s.trim()).filter(Boolean)
  const result: string[] = []
  for (const seg of primary) {
    if (seg.length > 60 && seg.includes(',')) {
      const parts = seg.split(/,\s+/).map(s => s.trim()).filter(Boolean)
      result.push(...parts)
    } else {
      result.push(seg)
    }
  }
  return result
}

function pauseAfter(chunk: string): number {
  const last = chunk.slice(-1)
  if (last === '.' || last === '!' || last === '?') return 350
  if (last === ',') return 180
  return 120
}

export function speak(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const clean = prepareForSpeech(text)
  const chunks = splitSentences(clean)
  if (chunks.length === 0) { onEnd?.(); return }
  // Vocea se încarcă asincron — așteptăm dacă e nevoie
  function doSpeak(voice: SpeechSynthesisVoice | null) {
    let index = 0
    function next() {
      if (index >= chunks.length) { onEnd?.(); return }
      const chunk = chunks[index++]
      const u = new SpeechSynthesisUtterance(chunk)
      u.lang = 'ro-RO'
      u.rate = 0.92
      u.pitch = 1.05
      u.volume = 1
      if (voice) u.voice = voice
      u.onend = () => setTimeout(next, pauseAfter(chunk))
      window.speechSynthesis.speak(u)
    }
    next()
  }
  const voices = window.speechSynthesis.getVoices()
  if (voices.length > 0) {
    doSpeak(getVoice())
  } else {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null
      doSpeak(getVoice())
    }
  }
}
