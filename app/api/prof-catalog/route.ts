import { list, put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (!key) return NextResponse.json({ error: 'missing key' }, { status: 400 })

  try {
    const { blobs } = await list({ prefix: `prof-catalog/${key}` })
    if (!blobs.length) return NextResponse.json({ data: null })
    const res = await fetch(blobs[0].url, { cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ data: null })
    const data = await res.json()
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ data: null })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { key, data } = await req.json()
    if (!key || !data) return NextResponse.json({ error: 'missing params' }, { status: 400 })

    await put(`prof-catalog/${key}.json`, JSON.stringify(data), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
      allowOverwrite: true,
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
