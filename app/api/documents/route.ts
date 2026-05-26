import { NextRequest, NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'
import crypto from 'crypto'
import { rateLimit } from '@/lib/rateLimit'
import { checkAnyAdminPassword, verifySessionFromRequest } from '@/lib/session'

const BLOB_KEY = 'documents-index.json'

const TIP_VALUES = ['Circular', 'Procedură', 'Adresă', 'Metodologie', 'Ordin', 'Altele'] as const
const SURSA_TIP_VALUES = ['isj', 'inspector', 'aracip', 'director-isj', 'director-aracip'] as const
export type DocTip = typeof TIP_VALUES[number]
export type SursaTip = typeof SURSA_TIP_VALUES[number]

export type Reader = { name: string; rol: string; tipScoala?: string; scoala?: string; la: string }

export type Document = {
  id: string
  titlu: string
  tip: DocTip
  sursa: string
  sursa_tip: SursaTip
  judet: string
  termen?: string
  urgent: boolean
  continut: string
  pdfUrl?: string
  uploadedAt: string
  destinatari: string
  nr?: string
  nrInregistrare?: string
  citite?: number
  totalDestinatari?: number
  readers?: Reader[]
  recitatLa?: Record<string, string>
  tipUnitate?: string
}

type Index = { updatedAt: string; documents: Document[] }

const INITIALE: Document[] = [
  { id: '1', titlu: 'Circular nr. 1247/2026 — Raportare absențe mai 2026', tip: 'Circular', sursa: 'ISJ Dolj', sursa_tip: 'isj', judet: 'Dolj', termen: '2026-05-25', urgent: true, continut: 'Raportarea absențelor elevilor pentru luna mai 2026 se face exclusiv prin platformă (nu prin email) până la data de 25 mai 2026. Contact inspector responsabil: Ionescu Maria, 0251 411 522.', uploadedAt: '2026-05-17T09:00:00Z', destinatari: 'Toți directorii de unități școlare din județul Dolj', nr: '1247/2026' },
  { id: '2', titlu: 'Procedura nr. 892/2026 — Examene naționale 2026', tip: 'Procedură', sursa: 'ISJ Dolj', sursa_tip: 'isj', judet: 'Dolj', termen: '2026-05-30', urgent: true, continut: 'BAC sesiunea I: 17 iunie–4 iulie 2026. EN: 19–23 iunie 2026. Comisiile de examen se constituie până pe 30 mai 2026 și se transmit la ISJ. Centrele de examen se afișează pe 5 iunie 2026.', uploadedAt: '2026-05-14T10:00:00Z', destinatari: 'Directori licee și școli gimnaziale, Dolj', nr: '892/2026' },
  { id: '3', titlu: 'Adresa nr. 2103/2026 — Dotări informatice PNRR', tip: 'Adresă', sursa: 'ISJ Dolj', sursa_tip: 'isj', judet: 'Dolj', urgent: false, continut: '47 unități școlare din județul Dolj sunt beneficiare ale dotărilor informatice prin PNRR. Livrarea echipamentelor se face în perioada 10–20 iunie 2026. Directorul unității va semna procesul-verbal de recepție la livrare.', uploadedAt: '2026-05-10T08:00:00Z', destinatari: '47 unități beneficiare PNRR din Dolj', nr: '2103/2026' },
  { id: '4', titlu: 'Circular nr. 1198/2026 — Situație statistică finalizare an școlar', tip: 'Circular', sursa: 'ISJ Dolj', sursa_tip: 'isj', judet: 'Dolj', termen: '2026-06-15', urgent: false, continut: 'Situația statistică privind finalizarea anului școlar 2025-2026 se transmite la ISJ în format Excel (formular ISJ) până pe 15 iunie 2026.', uploadedAt: '2026-05-05T08:00:00Z', destinatari: 'Toți directorii din Dolj', nr: '1198/2026' },
  { id: '5', titlu: 'Metodologie Evaluare Națională 2026', tip: 'Metodologie', sursa: 'Inspector Național ARACIP', sursa_tip: 'inspector', judet: 'national', termen: '2026-06-19', urgent: true, continut: 'Metodologia desfășurării Evaluării Naționale pentru clasa a VIII-a, sesiunea 2026. Probele se desfășoară în perioada 19–23 iunie 2026. Subiecte unice la nivel național. Notarea anonimă. Contestații: 24–25 iunie 2026.', uploadedAt: '2026-05-19T09:00:00Z', destinatari: 'Toate unitățile școlare din România — național' },
]

let cache: Index | null = null
let cacheTs = 0
let cachedBlobUrl: string | null = null
const TTL = 10 * 1000 // 10 secunde — invalidat oricum la mutații

function invalidateCache() {
  cacheTs = 0
  cache = null
  cachedBlobUrl = null
}

export async function loadIndex(): Promise<Index> {
  if (cache && Date.now() - cacheTs < TTL) return cache
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return { updatedAt: new Date().toISOString(), documents: [...INITIALE] }

  let url = cachedBlobUrl
  if (!url) {
    const { blobs } = await list({ prefix: BLOB_KEY, token })
    if (!blobs.length) return { updatedAt: new Date().toISOString(), documents: [...INITIALE] }
    const sorted = [...blobs].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    url = sorted[0].url
    cachedBlobUrl = url
  }

  const res = await fetch(url, { cache: 'no-store', headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) {
    cachedBlobUrl = null
    throw new Error(`Blob read failed: ${res.status}`)
  }
  cache = await res.json()
  cacheTs = Date.now()
  return cache!
}

async function saveIndex(idx: Index) {
  idx.updatedAt = new Date().toISOString()
  const result = await put(BLOB_KEY, JSON.stringify(idx, null, 2), {
    access: 'private',
    contentType: 'application/json',
    token: process.env.BLOB_READ_WRITE_TOKEN,
    allowOverwrite: true,
  })
  cachedBlobUrl = result.url
  cache = idx
  cacheTs = Date.now()
}

// Map judet → cod
const JUDET_COD: Record<string, string> = {
  Dolj: 'DJ', Olt: 'OT', Gorj: 'GJ', Mehedinți: 'MH', Mehedinti: 'MH',
  Vâlcea: 'VL', Valcea: 'VL', București: 'B', Bucuresti: 'B',
  Cluj: 'CJ', Iași: 'IS', Iasi: 'IS', Timiș: 'TM', Timis: 'TM',
  Brașov: 'BV', Brasov: 'BV', Constanța: 'CT', Constanta: 'CT',
  Argeș: 'AG', Arges: 'AG', Prahova: 'PH', Sibiu: 'SB',
}

function getJudetCod(judet?: string): string {
  if (!judet) return 'RO'
  return JUDET_COD[judet] || 'RO'
}

function generateNrInregistrare(sursa_tip: SursaTip, judet: string | undefined, allDocs: Document[]): string {
  const year = new Date().getFullYear()
  let prefix: string
  if (sursa_tip === 'inspector') prefix = `INSP-NAT-${year}-`
  else if (sursa_tip === 'isj') prefix = `ISJ-${getJudetCod(judet)}-${year}-`
  else prefix = `ARACIP-${year}-`

  let maxN = 0
  for (const d of allDocs) {
    if (d.nrInregistrare && d.nrInregistrare.startsWith(prefix)) {
      const tail = d.nrInregistrare.slice(prefix.length)
      const n = parseInt(tail, 10)
      if (!isNaN(n) && n > maxN) maxN = n
    }
  }
  const next = (maxN + 1).toString().padStart(4, '0')
  return `${prefix}${next}`
}

// ────────────────────────────────────────────────
// VALIDARE INPUT POST
// ────────────────────────────────────────────────
type ValidationResult = { ok: true; doc: Partial<Document> } | { ok: false; error: string }

function validateNewDoc(input: any): ValidationResult {
  if (!input || typeof input !== 'object') return { ok: false, error: 'Date document lipsă.' }
  const titlu = typeof input.titlu === 'string' ? input.titlu.trim() : ''
  if (titlu.length < 1 || titlu.length > 200) return { ok: false, error: 'Titlul trebuie să aibă între 1 și 200 caractere.' }
  const continut = typeof input.continut === 'string' ? input.continut : ''
  if (continut.length < 1 || continut.length > 50000) return { ok: false, error: 'Conținutul trebuie să aibă între 1 și 50.000 caractere.' }
  const tip = input.tip
  if (!TIP_VALUES.includes(tip)) return { ok: false, error: `Tip invalid. Permise: ${TIP_VALUES.join(', ')}.` }
  const sursa_tip = input.sursa_tip
  if (!SURSA_TIP_VALUES.includes(sursa_tip)) return { ok: false, error: `sursa_tip invalid. Permise: ${SURSA_TIP_VALUES.join(', ')}.` }
  const sursa = typeof input.sursa === 'string' ? input.sursa.trim().slice(0, 200) : ''
  if (!sursa) return { ok: false, error: 'Sursa este obligatorie.' }
  const judet = typeof input.judet === 'string' ? input.judet.trim().slice(0, 50) : ''
  if (!judet) return { ok: false, error: 'Județul este obligatoriu (folosiți "national" pentru documente naționale).' }
  const destinatari = typeof input.destinatari === 'string' ? input.destinatari.trim().slice(0, 500) : ''
  if (!destinatari) return { ok: false, error: 'Destinatarii sunt obligatorii.' }

  return {
    ok: true,
    doc: {
      titlu,
      tip,
      sursa,
      sursa_tip,
      judet,
      destinatari,
      continut,
      urgent: !!input.urgent,
      termen: typeof input.termen === 'string' ? input.termen.slice(0, 50) : undefined,
      pdfUrl: typeof input.pdfUrl === 'string' ? input.pdfUrl.slice(0, 1000) : undefined,
      nr: typeof input.nr === 'string' ? input.nr.slice(0, 100) : undefined,
      totalDestinatari: typeof input.totalDestinatari === 'number' ? input.totalDestinatari : 0,
      tipUnitate: typeof input.tipUnitate === 'string' ? input.tipUnitate.slice(0, 100) : undefined,
    },
  }
}

// ────────────────────────────────────────────────
// GET — lista documente
// ────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  let idx: Index
  try {
    idx = await loadIndex()
  } catch (e) {
    console.error('[GET /api/documents] loadIndex', e)
    idx = { updatedAt: new Date().toISOString(), documents: [...INITIALE] }
  }
  const { searchParams } = new URL(req.url)
  const sursa_tip = searchParams.get('sursa_tip')
  const judet = searchParams.get('judet')
  let docs = idx.documents
  if (sursa_tip) docs = docs.filter(d => d.sursa_tip === sursa_tip)
  if (judet) docs = docs.filter(d => d.judet === judet || d.judet === 'national')
  return NextResponse.json({ updatedAt: idx.updatedAt, documents: docs })
}

// ────────────────────────────────────────────────
// POST — adaugă document
// ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!rateLimit(`docs-post:${ip}`, 20, 60_000)) {
      return NextResponse.json({ error: 'Prea multe cereri. Reveniți într-un minut.' }, { status: 429 })
    }

    const body = await req.json()
    const { document: doc, password } = body

    if (!process.env.ADMIN_PASSWORD || !process.env.ISJ_PASSWORD || !process.env.INSPECTOR_PASSWORD) {
      console.error('[POST /api/documents] missing password env vars')
      return NextResponse.json({ error: 'Configurare server incompletă.' }, { status: 500 })
    }

    // Submisii director (sursa_tip = director-isj / director-aracip) → auth pe sesiune HMAC
    const isDirectorSubmission = typeof doc?.sursa_tip === 'string' && doc.sursa_tip.startsWith('director-')
    if (isDirectorSubmission) {
      const session = verifySessionFromRequest(req)
      if (!session || (session.role !== 'director' && session.role !== 'diriginte')) {
        return NextResponse.json({ error: 'Sesiune director invalidă.' }, { status: 401 })
      }
    } else if (!checkAnyAdminPassword(password)) {
      return NextResponse.json({ error: 'Neautorizat.' }, { status: 401 })
    }

    const validation = validateNewDoc(doc)
    if (!validation.ok) return NextResponse.json({ error: validation.error }, { status: 400 })

    const idx = await loadIndex()
    const nrInregistrare = generateNrInregistrare(validation.doc.sursa_tip!, validation.doc.judet, idx.documents)

    const newDoc: Document = {
      ...(validation.doc as Document),
      id: crypto.randomUUID(),
      uploadedAt: new Date().toISOString(),
      citite: 0,
      totalDestinatari: validation.doc.totalDestinatari ?? 0,
      nrInregistrare,
      readers: [],
      recitatLa: {},
    }
    idx.documents = [newDoc, ...idx.documents]
    await saveIndex(idx)
    invalidateCache()
    return NextResponse.json({ ok: true, document: newDoc })
  } catch (e: any) {
    console.error('[POST /api/documents]', e)
    return NextResponse.json({ error: e?.message || 'Eroare internă la salvare.' }, { status: 500 })
  }
}

// ────────────────────────────────────────────────
// PATCH — editare sau marcare ca citit
// ────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!rateLimit(`docs-patch:${ip}`, 20, 60_000)) {
      return NextResponse.json({ error: 'Prea multe cereri. Reveniți într-un minut.' }, { status: 429 })
    }

    const body = await req.json()
    const { id, updates, action, password } = body
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID document lipsă.' }, { status: 400 })
    }

    const isReadAction = action === 'read'

    if (isReadAction) {
      // CRITIC 3: necesită sesiune validă (HMAC)
      const session = verifySessionFromRequest(req)
      if (!session) {
        return NextResponse.json({ error: 'Sesiune lipsă sau invalidă. Conectați-vă din nou.' }, { status: 401 })
      }
    } else {
      if (!process.env.ADMIN_PASSWORD || !process.env.ISJ_PASSWORD || !process.env.INSPECTOR_PASSWORD) {
        console.error('[PATCH /api/documents] missing password env vars')
        return NextResponse.json({ error: 'Configurare server incompletă.' }, { status: 500 })
      }
      if (!checkAnyAdminPassword(password)) {
        return NextResponse.json({ error: 'Neautorizat.' }, { status: 401 })
      }
    }

    const idx = await loadIndex()
    const i = idx.documents.findIndex(d => d.id === id)
    if (i === -1) return NextResponse.json({ error: 'Document negăsit.' }, { status: 404 })

    if (isReadAction) {
      const session = verifySessionFromRequest(req)!
      const viewer = body.viewer as { name?: string; rol?: string; tipScoala?: string; scoala?: string } | undefined
      const nowIso = new Date().toISOString()
      const newReader: Reader = {
        name: (viewer?.name || 'Anonim').slice(0, 100),
        rol: (viewer?.rol || session.role).slice(0, 50),
        tipScoala: viewer?.tipScoala?.slice(0, 100),
        scoala: viewer?.scoala?.slice(0, 200),
        la: nowIso,
      }
      const existingReaders = idx.documents[i].readers || []
      const alreadyRead = existingReaders.some(r => r.name === newReader.name && r.scoala === newReader.scoala)
      if (!alreadyRead) {
        idx.documents[i] = {
          ...idx.documents[i],
          citite: (idx.documents[i].citite ?? 0) + 1,
          readers: [...existingReaders, newReader],
          recitatLa: { ...(idx.documents[i].recitatLa || {}), [session.userId]: nowIso },
        }
      } else {
        idx.documents[i] = {
          ...idx.documents[i],
          recitatLa: { ...(idx.documents[i].recitatLa || {}), [session.userId]: nowIso },
        }
      }
    } else {
      // updates: nu permitem modificarea id, uploadedAt
      const safeUpdates = { ...updates }
      delete safeUpdates.id
      delete safeUpdates.uploadedAt
      idx.documents[i] = { ...idx.documents[i], ...safeUpdates }
    }
    await saveIndex(idx)
    invalidateCache()
    return NextResponse.json({ ok: true, document: idx.documents[i] })
  } catch (e: any) {
    console.error('[PATCH /api/documents]', e)
    return NextResponse.json({ error: e?.message || 'Eroare internă.' }, { status: 500 })
  }
}

// ────────────────────────────────────────────────
// DELETE — șterge document
// ────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!rateLimit(`docs-delete:${ip}`, 20, 60_000)) {
      return NextResponse.json({ error: 'Prea multe cereri. Reveniți într-un minut.' }, { status: 429 })
    }

    const { id, password } = await req.json()
    if (!process.env.ADMIN_PASSWORD || !process.env.ISJ_PASSWORD || !process.env.INSPECTOR_PASSWORD) {
      console.error('[DELETE /api/documents] missing password env vars')
      return NextResponse.json({ error: 'Configurare server incompletă.' }, { status: 500 })
    }
    if (!checkAnyAdminPassword(password)) {
      return NextResponse.json({ error: 'Neautorizat.' }, { status: 401 })
    }
    if (!id) return NextResponse.json({ error: 'ID document lipsă.' }, { status: 400 })

    const idx = await loadIndex()
    idx.documents = idx.documents.filter(d => d.id !== id)
    await saveIndex(idx)
    invalidateCache()
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('[DELETE /api/documents]', e)
    return NextResponse.json({ error: e?.message || 'Eroare internă.' }, { status: 500 })
  }
}
