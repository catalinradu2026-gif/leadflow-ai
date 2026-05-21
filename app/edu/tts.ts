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
  s = s.replace(/\bAI\b/g, 'Ei Ai')
       .replace(/\bBAC\b/g, 'Bacalaureat')
       .replace(/\bM1\b/g, 'M unu')
       .replace(/\bM2\b/g, 'M doi')
       .replace(/\bnr\./gi, 'numărul')
       .replace(/\bpct\./gi, 'punctul')
       .replace(/\bpg\./gi, 'pagina')
  s = s.replace(/[\u{1F300}-\u{1FFFF}]/gu, '').replace(/[*_~`#→←•]/g, '')
  s = s.replace(/\b(\d+)\/(\d{4})\b/g, (_, n, y) => `${numRo(parseInt(n))} din ${numRo(parseInt(y))}`)
  s = s.replace(/\b(\d{1,9})\b/g, (_, n) => numRo(parseInt(n)))
  s = s.replace(/\s{2,}/g, ' ')
  return s.trim()
}

export function getVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  return voices.find(v => v.lang.startsWith('ro') && v.name.toLowerCase().includes('female'))
    || voices.find(v => v.lang.startsWith('ro') && (v.name.includes('Ioana') || v.name.includes('Carmen') || v.name.includes('Maria')))
    || voices.find(v => v.lang.startsWith('ro'))
    || voices.find(v => v.lang.startsWith('en-GB'))
    || voices[0]
    || null
}

export function splitSentences(text: string): string[] {
  return text.split(/(?<=[.!?…])\s+|(?<=—)\s*/).map(s => s.trim()).filter(s => s.length > 0)
}

export function speak(text: string, onEnd?: () => void, rate = 1.0) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const clean = prepareForSpeech(text)
  const sentences = splitSentences(clean)
  if (sentences.length === 0) { onEnd?.(); return }
  const voice = getVoice()
  function makeUtt(s: string): SpeechSynthesisUtterance {
    const u = new SpeechSynthesisUtterance(s)
    u.lang = 'ro-RO'
    u.rate = rate
    u.pitch = 1.0
    u.volume = 1
    if (voice) u.voice = voice
    return u
  }
  let index = 0
  function speakNext() {
    if (index >= sentences.length) { onEnd?.(); return }
    const u = makeUtt(sentences[index])
    index++
    const lastChar = sentences[index - 1].slice(-1)
    const pause = (lastChar === '.' || lastChar === '!' || lastChar === '?') ? 280 : 180
    u.onend = () => setTimeout(speakNext, pause)
    window.speechSynthesis.speak(u)
  }
  speakNext()
}
