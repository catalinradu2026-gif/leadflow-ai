import { NextRequest, NextResponse } from 'next/server'
import { put, head, del } from '@vercel/blob'

const BLOB_KEY = 'ara-knowledge.json'
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'ARACIP2026'

export type AraDoc = { id: string; titlu: string; continut: string; termen?: string; urgent?: boolean }
export type AraModul = { id: string; titlu: string; url: string; descriere: string }
export type AraAnunt = { id: string; titlu: string; continut: string; activ: boolean }
export type AraGeneral = { id: string; titlu: string; continut: string }

export type AraKnowledge = {
  updatedAt: string
  isj: AraDoc[]
  module: AraModul[]
  anunturi: AraAnunt[]
  general: AraGeneral[]
}

const DEFAULT: AraKnowledge = {
  updatedAt: new Date().toISOString(),
  isj: [
    { id: '1247-2026', titlu: 'Circular nr. 1247/2026 — Raportare absențe mai 2026', continut: 'Termen 25 mai 2026, prin platformă (nu email). Contact inspector Ionescu Maria, 0251 411 522.', termen: '2026-05-25', urgent: true },
    { id: '892-2026', titlu: 'Procedura nr. 892/2026 — Examene naționale 2026', continut: 'BAC sesiunea I: 17 iunie–4 iulie 2026. EN: 19–23 iunie 2026. Comisii constituite până pe 30 mai 2026.', termen: '2026-05-30', urgent: true },
    { id: '2103-2026', titlu: 'Adresa nr. 2103/2026 — Dotări informatice PNRR', continut: '47 unități din județul Dolj beneficiare. Livrare echipamente: 10–20 iunie 2026.', urgent: false },
    { id: '1198-2026', titlu: 'Circular nr. 1198/2026 — Situație statistică finalizare an școlar', continut: 'Termen raportare: 15 iunie 2026. Format Excel ISJ.', termen: '2026-06-15', urgent: false },
  ],
  module: [
    { id: 'bac-matematica-m1', titlu: 'BAC Matematică M1', url: '/edu/bac/matematica?profil=M1', descriere: 'Algebră avansată, analiză matematică, geometrie — profil matematică-informatică' },
    { id: 'bac-matematica-m2', titlu: 'BAC Matematică M2', url: '/edu/bac/matematica?profil=M2', descriere: 'Algebră de bază, geometrie, analiză simplă — profil real/uman' },
    { id: 'bac-romana', titlu: 'BAC Română', url: '/edu/bac/romana', descriere: 'Eseu, text argumentativ, autori canonici — real și uman' },
    { id: 'bac-biologie', titlu: 'BAC Biologie', url: '/edu/bac/materie?materie=biologie', descriere: 'Celulă, genetică, ecologie, fiziologie' },
    { id: 'bac-fizica', titlu: 'BAC Fizică', url: '/edu/bac/materie?materie=fizica', descriere: 'Mecanică, termodinamică, electricitate, optică' },
    { id: 'bac-chimie', titlu: 'BAC Chimie', url: '/edu/bac/materie?materie=chimie', descriere: 'Chimie organică și anorganică' },
    { id: 'bac-informatica', titlu: 'BAC Informatică', url: '/edu/bac/materie?materie=informatica', descriere: 'Algoritmi, structuri de date, C++/Pascal' },
    { id: 'bac-geografie', titlu: 'BAC Geografie', url: '/edu/bac/materie?materie=geografie', descriere: 'Geografie fizică și umană a României și a lumii' },
    { id: 'bac-istorie', titlu: 'BAC Istorie', url: '/edu/bac/materie?materie=istorie', descriere: 'Istoria României și istoria universală' },
    { id: 'en-matematica', titlu: 'EN Matematică cls. VIII', url: '/edu/capacitate/matematica', descriere: 'Algebră și geometrie nivel gimnaziu — Evaluarea Națională' },
    { id: 'en-romana', titlu: 'EN Română cls. VIII', url: '/edu/capacitate/romana', descriere: 'Text narativ, liric, gramatică, compunere — Evaluarea Națională' },
    { id: 'cursuri-ai', titlu: 'Cursuri AI pentru elevi', url: '/edu/cursuri-ai', descriere: '8 module despre inteligența artificială, de la zero' },
    { id: 'cursuri-profesori', titlu: 'Formare continuă profesori', url: '/edu/cursuri-profesori', descriere: '8 module despre utilizarea AI la clasă' },
  ],
  anunturi: [],
  general: [
    { id: 'platforma', titlu: 'Despre platformă', continut: 'Platforma EDU DIGITAL de la AIcraiova.ro oferă pregătire pentru BAC și Evaluarea Națională, formare continuă pentru profesori, management digital al orei de dirigenție și portal de comunicare ISJ–director. Adresă: aicraiova.ro. Contact: contact@aicraiova.ro, tel. 0787 813 485.' },
  ],
}

let cachedKnowledge: AraKnowledge | null = null
let cacheTime = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minute

export async function getKnowledge(): Promise<AraKnowledge> {
  if (cachedKnowledge && Date.now() - cacheTime < CACHE_TTL) return cachedKnowledge
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) return DEFAULT
    const info = await head(`https://blob.vercel-storage.com/${BLOB_KEY}`, { token })
    if (!info?.url) return DEFAULT
    const res = await fetch(info.url, { cache: 'no-store' })
    if (!res.ok) return DEFAULT
    cachedKnowledge = await res.json()
    cacheTime = Date.now()
    return cachedKnowledge!
  } catch {
    return DEFAULT
  }
}

export async function GET() {
  const data = await getKnowledge()
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const { password, knowledge } = await req.json()
  if (password !== ADMIN_PASS) return NextResponse.json({ error: 'Parolă incorectă.' }, { status: 401 })
  if (!knowledge) return NextResponse.json({ error: 'Date lipsă.' }, { status: 400 })
  try {
    const payload: AraKnowledge = { ...knowledge, updatedAt: new Date().toISOString() }
    await put(BLOB_KEY, JSON.stringify(payload, null, 2), {
      access: 'public',
      contentType: 'application/json',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      allowOverwrite: true,
    })
    cachedKnowledge = payload
    cacheTime = Date.now()
    return NextResponse.json({ ok: true, updatedAt: payload.updatedAt })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
