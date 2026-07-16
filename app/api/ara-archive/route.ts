import { NextRequest, NextResponse } from 'next/server'
import { put, list, del } from '@vercel/blob'
import crypto from 'crypto'

const INDEX_KEY = 'ara-archive-index.json'
const ARCHIVE_PASSWORD = 'ARACIP2026'
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

export interface AraArchiveDoc {
  id: string
  titlu: string
  tip: 'PDF' | 'Word' | 'Text' | 'Altele'
  descriere?: string
  uploadedAt: string
  uploadedBy: string
  judet: string
  textBlobKey: string
  textPreview: string
  size: number
}

type ArchiveIndex = { updatedAt: string; docs: AraArchiveDoc[] }

// ── In-memory cache ──────────────────────────────────────────────────────────
let cachedIndex: ArchiveIndex | null = null
let cacheTs = 0
const CACHE_TTL = 5 * 60 * 1000

function invalidateCache() {
  cachedIndex = null
  cacheTs = 0
}

async function loadArchiveIndex(): Promise<ArchiveIndex> {
  if (cachedIndex && Date.now() - cacheTs < CACHE_TTL) return cachedIndex
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return { updatedAt: new Date().toISOString(), docs: [] }
  try {
    const { blobs } = await list({ prefix: INDEX_KEY, token })
    if (!blobs.length) return { updatedAt: new Date().toISOString(), docs: [] }
    const sorted = [...blobs].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )
    const res = await fetch(sorted[0].url, {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return { updatedAt: new Date().toISOString(), docs: [] }
    const data = await res.json() as ArchiveIndex
    cachedIndex = data
    cacheTs = Date.now()
    return data
  } catch {
    return { updatedAt: new Date().toISOString(), docs: [] }
  }
}

async function saveArchiveIndex(idx: ArchiveIndex): Promise<void> {
  idx.updatedAt = new Date().toISOString()
  await put(INDEX_KEY, JSON.stringify(idx, null, 2), {
    access: 'private',
    contentType: 'application/json',
    token: process.env.BLOB_READ_WRITE_TOKEN,
    allowOverwrite: true,
  })
  cachedIndex = idx
  cacheTs = Date.now()
}

// ── Text extraction (reuse same pattern as upload-pdf) ───────────────────────
function detectTip(name: string, mime: string): AraArchiveDoc['tip'] {
  const lower = name.toLowerCase()
  if (lower.endsWith('.pdf') || mime === 'application/pdf') return 'PDF'
  if (
    lower.endsWith('.docx') ||
    mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  )
    return 'Word'
  if (lower.endsWith('.txt') || mime === 'text/plain') return 'Text'
  return 'Altele'
}

async function extractTextFromBuffer(
  name: string,
  mime: string,
  bytes: ArrayBuffer
): Promise<string> {
  const lower = name.toLowerCase()
  try {
    if (lower.endsWith('.pdf') || mime === 'application/pdf') {
      const { extractText: pdfExtract, getDocumentProxy } = await import('unpdf')
      const pdf = await getDocumentProxy(new Uint8Array(bytes))
      const { text } = await pdfExtract(pdf, { mergePages: true })
      return Array.isArray(text) ? text.join('\n') : String(text || '')
    }
    if (
      lower.endsWith('.docx') ||
      mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const mammoth = await import('mammoth')
      const result = await mammoth.extractRawText({ buffer: Buffer.from(bytes) })
      return result.value || ''
    }
    if (lower.endsWith('.txt') || mime === 'text/plain') {
      return new TextDecoder('utf-8', { fatal: false }).decode(bytes)
    }
  } catch {
    // silently fail — partial extraction
  }
  return ''
}

// ── GET ──────────────────────────────────────────────────────────────────────
export async function GET(): Promise<NextResponse> {
  try {
    const idx = await loadArchiveIndex()
    return NextResponse.json({ updatedAt: idx.updatedAt, docs: idx.docs })
  } catch {
    return NextResponse.json({ updatedAt: new Date().toISOString(), docs: [] })
  }
}

// ── POST — upload document ───────────────────────────────────────────────────
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const password = req.headers.get('x-password')
    if (password !== ARCHIVE_PASSWORD) {
      return NextResponse.json({ error: 'Neautorizat.' }, { status: 401 })
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ error: 'Configurare server incompletă.' }, { status: 500 })
    }

    const formData = await req.formData()
    const titlu = (formData.get('titlu') as string | null)?.trim()
    const descriere = (formData.get('descriere') as string | null)?.trim() || undefined
    const uploadedBy = (formData.get('uploadedBy') as string | null)?.trim() || 'Inspector Național'
    const judet = (formData.get('judet') as string | null)?.trim() || 'national'
    const file = formData.get('file') as File | null

    if (!titlu) {
      return NextResponse.json({ error: 'Titlul este obligatoriu.' }, { status: 400 })
    }
    if (!file) {
      return NextResponse.json({ error: 'Niciun fișier selectat.' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: 'Fișier prea mare. Limita este 10 MB.' },
        { status: 400 }
      )
    }
    if (file.size === 0) {
      return NextResponse.json({ error: 'Fișierul este gol.' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const tip = detectTip(file.name || '', file.type || '')

    // Extract text
    const rawText = await extractTextFromBuffer(file.name || '', file.type || '', bytes)
    const cleanText = rawText
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
      .slice(0, 100_000)

    const textPreview = cleanText.slice(0, 300)

    // Store extracted text in Blob
    const id = crypto.randomUUID()
    const textBlobKey = `ara-doc-${id}.txt`

    const storedText =
      cleanText ||
      (tip === 'Altele'
        ? 'Format nesuportat pentru citire automată.'
        : 'Nu s-a putut extrage text din acest fișier.')

    await put(textBlobKey, storedText, {
      access: 'private',
      contentType: 'text/plain; charset=utf-8',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      allowOverwrite: true,
    })

    const newDoc: AraArchiveDoc = {
      id,
      titlu,
      tip,
      descriere,
      uploadedAt: new Date().toISOString(),
      uploadedBy,
      judet,
      textBlobKey,
      textPreview,
      size: file.size,
    }

    const idx = await loadArchiveIndex()
    idx.docs = [newDoc, ...idx.docs]
    await saveArchiveIndex(idx)

    return NextResponse.json({ ok: true, doc: newDoc })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg || 'Eroare internă.' }, { status: 500 })
  }
}

// ── DELETE — remove document ─────────────────────────────────────────────────
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const password = req.headers.get('x-password')
    if (password !== ARCHIVE_PASSWORD) {
      return NextResponse.json({ error: 'Neautorizat.' }, { status: 401 })
    }

    const { id } = await req.json() as { id?: string }
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID document lipsă.' }, { status: 400 })
    }

    const idx = await loadArchiveIndex()
    const doc = idx.docs.find(d => d.id === id)
    if (!doc) {
      return NextResponse.json({ error: 'Document negăsit.' }, { status: 404 })
    }

    // Delete text blob
    if (doc.textBlobKey && process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { blobs } = await list({
          prefix: doc.textBlobKey,
          token: process.env.BLOB_READ_WRITE_TOKEN,
        })
        for (const b of blobs) {
          await del(b.url, { token: process.env.BLOB_READ_WRITE_TOKEN })
        }
      } catch {
        // non-fatal
      }
    }

    idx.docs = idx.docs.filter(d => d.id !== id)
    await saveArchiveIndex(idx)
    invalidateCache()

    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg || 'Eroare internă.' }, { status: 500 })
  }
}

// ── Exported loader for use in acreditare-chat ───────────────────────────────
export async function loadArchiveDocs(maxDocs = 5): Promise<{ doc: AraArchiveDoc; text: string }[]> {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return []

  try {
    const idx = await loadArchiveIndex()
    const recent = idx.docs.slice(0, maxDocs)

    const results = await Promise.allSettled(
      recent.map(async doc => {
        const { blobs } = await list({ prefix: doc.textBlobKey, token })
        if (!blobs.length) return { doc, text: doc.textPreview }
        const sorted = [...blobs].sort(
          (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        )
        const res = await fetch(sorted[0].url, {
          cache: 'no-store',
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return { doc, text: doc.textPreview }
        const text = await res.text()
        return { doc, text: text.slice(0, 1500) }
      })
    )

    return results
      .filter((r): r is PromiseFulfilledResult<{ doc: AraArchiveDoc; text: string }> => r.status === 'fulfilled')
      .map(r => r.value)
  } catch {
    return []
  }
}
