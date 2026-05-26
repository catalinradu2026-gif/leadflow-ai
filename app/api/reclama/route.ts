import { NextRequest, NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'

const BLOB_KEY = 'reclamatii.json'

// Rate limit simplu in-memory: max 10 reclamații/minut per IP
const RATE_LIMIT_MAX = 10
const RATE_LIMIT_WINDOW_MS = 60_000
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { ok: true }
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }
  entry.count++
  return { ok: true }
}

type Reclama = {
  id: string
  categorie: string
  descriere: string
  trimiteISJ: boolean
  trimiteARACIP: boolean
  director: string
  tipScoala: string
  trimisLa: string
  status: 'Primită' | 'În analiză' | 'Rezolvată'
}

async function loadReclamatii(): Promise<Reclama[]> {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return []
  try {
    const { blobs } = await list({ prefix: BLOB_KEY, token })
    if (!blobs.length) return []
    const sorted = [...blobs].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    const res = await fetch(sorted[0].url, { cache: 'no-store', headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) return []
    return await res.json()
  } catch (e) { console.error("[reclama]", e)
    return []
  }
}

async function saveReclamatii(list_: Reclama[]) {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return
  await put(BLOB_KEY, JSON.stringify(list_, null, 2), {
    access: 'private',
    contentType: 'application/json',
    token,
    allowOverwrite: true,
  })
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
      || req.headers.get('x-real-ip')
      || 'unknown'
    const rl = checkRateLimit(ip)
    if (!rl.ok) {
      return NextResponse.json(
        { error: `Prea multe sesizări. Reîncercați în ${rl.retryAfter}s.` },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
      )
    }

    const body = await req.json()
    const { categorie, descriere, trimiteISJ, trimiteARACIP, director, tipScoala } = body
    if (!descriere?.trim()) return NextResponse.json({ error: 'Descrierea este obligatorie.' }, { status: 400 })

    const existing = await loadReclamatii()
    const newReclama: Reclama = {
      id: Date.now().toString(),
      categorie: categorie || 'Altele',
      descriere: descriere.trim(),
      trimiteISJ: !!trimiteISJ,
      trimiteARACIP: !!trimiteARACIP,
      director: director || 'Anonim',
      tipScoala: tipScoala || 'Necunoscut',
      trimisLa: new Date().toISOString(),
      status: 'Primită',
    }
    await saveReclamatii([newReclama, ...existing])
    return NextResponse.json({ ok: true, id: newReclama.id, trimisLa: newReclama.trimisLa })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Eroare.' }, { status: 500 })
  }
}

export async function GET() {
  const data = await loadReclamatii()
  return NextResponse.json(data)
}
