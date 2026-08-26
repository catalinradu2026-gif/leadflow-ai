import { NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'

// ============================================================================
// Log simplu de conversații pentru dashboard-ul admin BT — NU e analytics
// complex/ML, doar o listă append-only în Vercel Blob (același bucket ca
// bt-knowledge.json), suficientă să populeze: total mesaje, cuvinte-cheie
// frecvente, leaduri colectate (telefon din fluxul de pre-calificare) și
// activitate pe zile. Fiecare mesaj de user trimis către Ana generează o
// intrare — logat din app/api/bt-chat/route.ts, nu blochează răspunsul dacă
// eșuează (try/catch, non-fatal).
// ============================================================================

const BLOB_KEY = 'bt-conversations-log.json'
const MAX_ENTRIES = 3000 // suficient pentru un pilot; append-only cu tăiere la coadă

export type BtLogEntry = {
  ts: string // ISO timestamp
  context: string // pagina/contextul (general/carduri/credite/...)
  userMessage: string
  leadPhone?: string
  possibleGap?: boolean // răspunsul Anei a semnalat că nu are informația exactă (vezi detectGap)
}

let cached: BtLogEntry[] | null = null
let cacheTime = 0
const CACHE_TTL = 20 * 1000

/** Exportat pentru /api/bt-market-report — reutilizează același log, fără duplicare de citire. */
export async function loadLog(opts?: { fresh?: boolean }): Promise<BtLogEntry[]> {
  if (!opts?.fresh && cached && Date.now() - cacheTime < CACHE_TTL) return cached
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) return []
    const { blobs } = await list({ prefix: BLOB_KEY, token })
    if (!blobs.length) return []
    const res = await fetch(blobs[0].url, { cache: 'no-store', headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) return []
    const fresh = await res.json()
    cached = fresh
    cacheTime = Date.now()
    return fresh
  } catch (e) {
    console.error('[bt-log loadLog]', e)
    return opts?.fresh ? [] : (cached || [])
  }
}

// Scriere read-modify-write pe un fișier JSON unic — sub concurență mare, două scrieri
// simultane se pot suprascrie una pe alta (fiecare citește starea dinaintea celeilalte).
// Pentru un demo cu 1-2 vizitatori simultani, o simplă coadă in-process (un singur
// "writer" activ per instanță serverless, restul așteaptă la rând) reduce mult riscul —
// nu-l elimină 100% cross-instanță, dar acoperă cazul real de folosire de mâine.
let writeQueue: Promise<void> = Promise.resolve()

/** Apelat din /api/bt-chat după fiecare mesaj de user — non-fatal dacă eșuează. */
export function logConversation(entry: BtLogEntry): Promise<void> {
  writeQueue = writeQueue.then(async () => {
    try {
      const token = process.env.BLOB_READ_WRITE_TOKEN
      if (!token) return
      // Citire FĂRĂ cache, chiar înainte de scriere — minimizează fereastra de cursă
      // față de alte instanțe serverless care ar putea scrie concurent.
      const log = await loadLog({ fresh: true })
      const next = [...log, entry].slice(-MAX_ENTRIES)
      await put(BLOB_KEY, JSON.stringify(next), {
        access: 'private',
        contentType: 'application/json',
        token,
        allowOverwrite: true,
      })
      cached = next
      cacheTime = Date.now()
    } catch (e) {
      console.error('[bt-log logConversation]', e)
    }
  })
  return writeQueue
}

// Extrage un telefon românesc dintr-un text (07xxxxxxxx sau +407xxxxxxxx / 00407...).
const PHONE_RE = /(?:\+?40|0)\s?7\d{2}[\s.-]?\d{3}[\s.-]?\d{3}/
export function extractPhone(text: string): string | undefined {
  const m = text.match(PHONE_RE)
  return m ? m[0].replace(/[\s.-]/g, '') : undefined
}

// Extrage o adresă de email dintr-un text — folosit pentru follow-up-ul real pe email din
// /api/bt-chat (Ana îl cere conversațional, serverul îl detectează determinist ca să declanșeze
// trimiterea reală, nu doar să se bazeze pe ce "spune" LLM-ul).
const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
export function extractEmail(text: string): string | undefined {
  const m = text.match(EMAIL_RE)
  return m ? m[0] : undefined
}

// Semnalează dacă răspunsul Anei sugerează un gol de cunoștințe (a spus explicit că nu
// are o informație exactă) — folosit pentru raportul de piață agregat (secțiunea
// "întrebări la care Ana nu a putut răspunde clar"), NU pentru a bloca vreun răspuns.
const GAP_PHRASES = [
  'nu am informația exactă', 'nu am acea informație', 'nu am cifra exactă', 'nu am cifra publică',
  'nu cunosc', 'nu știu exact', 'necunoscut public', 'nu am acces la', 'nu am detaliul exact',
  'nu am această informație',
]
export function detectGap(replyText: string): boolean {
  const low = replyText.toLowerCase()
  return GAP_PHRASES.some(p => low.includes(p))
}

// Fraze-indicator de obiecție (pentru raportul de piață) — normalizate, comparate ca
// substring pe mesajul userului, fără diacritice, ca să prindă și scris fără diacritice.
const OBJECTION_PATTERNS: { label: string; test: RegExp }[] = [
  { label: 'Dobânda pare prea mare', test: /doband\w*\s*(mare|mari|ridicat)/i },
  { label: 'Neîncredere / suspiciune', test: /nu am incredere|neincredere|suspicio/i },
  { label: 'Prea complicat / greu de înțeles', test: /prea complicat|nu inteleg|greu de inteles|complicat/i },
  { label: 'Comisioane percepute ca mari', test: /comisi\w*\s*(mare|mari|ridicat)/i },
  { label: 'Nesiguranță privind eligibilitatea', test: /nu stiu daca (ma califi|sunt eligibil)|nu sunt sigur ca (ma califi|sunt eligibil)/i },
  { label: 'Timp/proces prea lung', test: /dureaza mult|prea mult timp|proces lung/i },
]
function normalizeNoDiacritics(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}
export function detectObjections(text: string): string[] {
  const norm = normalizeNoDiacritics(text)
  return OBJECTION_PATTERNS.filter(o => o.test.test(norm)).map(o => o.label)
}

// Sumă + perioadă menționate într-un mesaj — pentru distribuția pe intervale din raportul
// de piață (agregat, NU legat de o persoană — doar bucket-uri de tip "10.000–25.000 lei").
const AMOUNT_RE = /(\d{4,7}|\d{1,3}(?:[.,\s]\d{3})+)\s*(?:lei|RON)\b/i
const MONTHS_RE = /(\d{1,3})\s*(?:de\s+)?luni\b/i
const YEARS_RE = /(\d{1,2})\s*(?:de\s+)?ani\b/i
export function extractAmount(text: string): number | undefined {
  const m = text.match(AMOUNT_RE)
  if (!m) return undefined
  const n = parseInt(m[1].replace(/[.,\s]/g, ''), 10)
  return Number.isFinite(n) && n >= 1000 && n <= 5_000_000 ? n : undefined
}
export function extractMonths(text: string): number | undefined {
  const mm = text.match(MONTHS_RE)
  if (mm) { const n = parseInt(mm[1], 10); return n >= 1 && n <= 360 ? n : undefined }
  const my = text.match(YEARS_RE)
  if (my) { const n = parseInt(my[1], 10) * 12; return n >= 1 && n <= 360 ? n : undefined }
  return undefined
}
export function amountBucket(n: number): string {
  if (n < 10_000) return '< 10.000 lei'
  if (n < 25_000) return '10.000–25.000 lei'
  if (n < 50_000) return '25.000–50.000 lei'
  if (n < 100_000) return '50.000–100.000 lei'
  return '100.000+ lei'
}
export function monthsBucket(n: number): string {
  if (n <= 12) return '≤ 12 luni'
  if (n <= 36) return '13–36 luni'
  if (n <= 60) return '37–60 luni'
  return '60+ luni'
}

const STOPWORDS = new Set([
  'si', 'sa', 'pe', 'cu', 'de', 'la', 'un', 'o', 'in', 'este', 'sunt', 'ce', 'care', 'pentru', 'din', 'mai',
  'ma', 'va', 'as', 'dori', 'vreau', 'buna', 'ziua', 'multumesc', 'pot', 'am', 'ai', 'are', 'avea', 'fi', 'nu',
  'da', 'dar', 'daca', 'sau', 'cum', 'unde', 'cand', 'cat', 'cati', 'cate', 'acest', 'aceasta', 'acesta',
  'foarte', 'doar', 'este', 'fost', 'fie', 'sunt', 'toate', 'toti', 'anul', 'luna', 'zile',
])

function extractKeywords(text: string): string[] {
  return (
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .match(/[a-z]{4,}/g) || []
  ).filter(w => !STOPWORDS.has(w))
}

export async function GET() {
  const log = await loadLog()
  const total = log.length

  const freq: Record<string, number> = {}
  for (const e of log) {
    for (const w of extractKeywords(e.userMessage)) freq[w] = (freq[w] || 0) + 1
  }
  const topKeywords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }))

  const leads = log
    .filter(e => e.leadPhone)
    .map(e => ({ phone: e.leadPhone!, context: e.context, mesaj: e.userMessage, data: e.ts }))

  // Activitate ultimele 14 zile (UTC, aproximativ — suficient pentru un grafic informativ).
  const days: Record<string, number> = {}
  const now = new Date()
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now)
    d.setUTCDate(d.getUTCDate() - i)
    days[d.toISOString().slice(0, 10)] = 0
  }
  for (const e of log) {
    const day = e.ts.slice(0, 10)
    if (day in days) days[day]++
  }
  const daily = Object.entries(days).map(([date, count]) => ({ date, count }))

  return NextResponse.json({ total, topKeywords, leads, leadsCount: leads.length, daily })
}
