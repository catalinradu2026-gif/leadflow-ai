import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { rateLimit } from '@/lib/rateLimit'

// Upload PUBLIC (rate-limited) pentru documentele dosarului de autorizare.
// Fondatorii de unități noi NU au cont — de aceea e public, dar limitat anti-abuz.
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!rateLimit(`autorizare-upload:${ip}`, 30, 60_000)) {
      return NextResponse.json({ ok: false, error: 'Prea multe încărcări. Reveniți într-un minut.' }, { status: 429 })
    }
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ ok: false, error: 'Configurare server incompletă.' }, { status: 500 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ ok: false, error: 'Niciun fișier selectat.' }, { status: 400 })
    if (file.size === 0) return NextResponse.json({ ok: false, error: 'Fișierul este gol.' }, { status: 400 })
    if (file.size > MAX_BYTES) return NextResponse.json({ ok: false, error: 'Fișier prea mare (max 10 MB).' }, { status: 400 })

    const name = (file.name || '').toLowerCase()
    const extOk = /\.(pdf|doc|docx|xls|xlsx|jpg|jpeg|png|webp)$/i.test(name)
    if (!extOk) {
      return NextResponse.json({ ok: false, error: 'Tip neacceptat. Permise: PDF, Word, Excel, imagini.' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    if (bytes.byteLength > MAX_BYTES) return NextResponse.json({ ok: false, error: 'Fișier prea mare (max 10 MB).' }, { status: 400 })

    const safeName = (file.name || 'doc').replace(/[^\w.\-]+/g, '_').slice(0, 120)
    const blob = await put(`autorizare/${Date.now()}-${safeName}`, bytes, {
      access: 'private',
      contentType: file.type || 'application/octet-stream',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return NextResponse.json({ ok: true, url: blob.url, name: file.name })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Eroare la încărcare.'
    console.error('[autorizare-upload]', e)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
