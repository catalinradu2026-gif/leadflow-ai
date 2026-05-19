import { NextRequest, NextResponse } from 'next/server'
import { put, head } from '@vercel/blob'

const BLOB_FILENAME = 'edu-modules.json'
const ADMIN_PASSWORD = process.env.EDU_ADMIN_PASSWORD || 'inspector2026'

const DEFAULT_MODULES = require('../../../data/edu-modules.json')

async function getModules() {
  try {
    const blobUrl = process.env.EDU_MODULES_BLOB_URL
    if (blobUrl) {
      const res = await fetch(blobUrl, { next: { revalidate: 60 } })
      if (res.ok) return await res.json()
    }
  } catch {}
  return DEFAULT_MODULES
}

export async function GET() {
  try {
    const data = await getModules()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(DEFAULT_MODULES)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { password, modules } = await req.json()
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Parolă incorectă' }, { status: 401 })
    }
    if (!modules || !Array.isArray(modules)) {
      return NextResponse.json({ error: 'Date invalide' }, { status: 400 })
    }

    const content = JSON.stringify({ modules }, null, 2)
    const blob = await put(BLOB_FILENAME, content, {
      access: 'public',
      contentType: 'application/json',
      allowOverwrite: true,
    })

    return NextResponse.json({ ok: true, url: blob.url })
  } catch (e) {
    return NextResponse.json({ error: 'Eroare la salvare. Verificați configurarea Vercel Blob.' }, { status: 500 })
  }
}
