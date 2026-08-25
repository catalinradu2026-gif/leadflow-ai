import { NextRequest, NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'
import { rateLimit } from '@/lib/rateLimit'

// ============================================================================
// Bază de cunoștințe DINAMICĂ pentru demo-ul BT — actualizabilă de un admin
// (Catalin/echipa BT) din /demo-bt-2026/admin, FĂRĂ să atingă codul. NU e
// fine-tuning de model — e o completare a system prompt-ului la runtime,
// exact ca patternul deja funcțional din app/api/ara-knowledge/route.ts
// (folosit de ARA/ARACIP). Storage: Vercel Blob, același bucket, cheie
// separată — simplu, fără infrastructură nouă pentru un pilot.
// ============================================================================

const BLOB_KEY = 'bt-knowledge.json'
// EXCLUSIV din env, fără fallback hardcodat în cod (semnalat ca risc de securitate).

// Intrare de cunoștințe adăugată de admin (produs nou, ofertă, corecție etc.)
export type BtKnowledgeEntry = { id: string; titlu: string; continut: string }
// Regulă de comportament adăugată prin "chat-ul de configurare" din admin —
// instrucțiune directă în limbaj natural, injectată ca atare în system prompt.
export type BtBehaviorRule = { id: string; text: string }

export type BtKnowledge = {
  updatedAt: string
  entries: BtKnowledgeEntry[]
  behaviorRules: BtBehaviorRule[]
}

const DEFAULT: BtKnowledge = {
  updatedAt: new Date().toISOString(),
  entries: [],
  behaviorRules: [],
}

let cached: BtKnowledge | null = null
let cacheTime = 0
const CACHE_TTL = 60 * 1000 // 1 minut — conținut de business, vrem propagare rapidă

export async function getBtKnowledge(): Promise<BtKnowledge> {
  if (cached && Date.now() - cacheTime < CACHE_TTL) return cached
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) return DEFAULT
    const { blobs } = await list({ prefix: BLOB_KEY, token })
    if (!blobs.length) return DEFAULT
    const res = await fetch(blobs[0].url, { cache: 'no-store', headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) return DEFAULT
    cached = await res.json()
    cacheTime = Date.now()
    return cached!
  } catch (e) {
    console.error('[bt-knowledge getBtKnowledge]', e)
    return DEFAULT
  }
}

export async function GET() {
  const data = await getBtKnowledge()
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!rateLimit(`bt-knowledge:${ip}`, 20, 60_000)) {
      return NextResponse.json({ error: 'Prea multe cereri. Reveniți într-un minut.' }, { status: 429 })
    }

    const ADMIN_PASSWORD = process.env.DEMO_BT_ADMIN_PASSWORD
    if (!ADMIN_PASSWORD) {
      console.error('[POST /api/bt-knowledge] DEMO_BT_ADMIN_PASSWORD lipsă din env')
      return NextResponse.json({ error: 'Configurare server incompletă.' }, { status: 500 })
    }

    const { password, knowledge } = await req.json() as { password?: string; knowledge?: Partial<BtKnowledge> }
    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Parolă incorectă.' }, { status: 401 })
    }
    if (!knowledge) return NextResponse.json({ error: 'Date lipsă.' }, { status: 400 })
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('[POST /api/bt-knowledge] BLOB_READ_WRITE_TOKEN missing')
      return NextResponse.json({ error: 'Configurare server incompletă (storage indisponibil).' }, { status: 500 })
    }

    const payload: BtKnowledge = {
      entries: knowledge.entries || [],
      behaviorRules: knowledge.behaviorRules || [],
      updatedAt: new Date().toISOString(),
    }
    await put(BLOB_KEY, JSON.stringify(payload, null, 2), {
      access: 'private',
      contentType: 'application/json',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      allowOverwrite: true,
    })
    cached = payload
    cacheTime = Date.now()
    return NextResponse.json({ ok: true, updatedAt: payload.updatedAt })
  } catch (e) {
    console.error('[POST /api/bt-knowledge]', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
