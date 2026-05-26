import { NextRequest, NextResponse } from 'next/server'
import { loadIndex } from '../../route'

function sanitizeFilename(name: string): string {
  // ascii-safe pentru Content-Disposition; păstrăm diacritice prin filename* RFC 5987
  return name.replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, ' ').trim().slice(0, 150) || 'document'
}

function buildContentDisposition(filename: string): string {
  const safe = sanitizeFilename(filename)
  const asciiFallback = safe.replace(/[^\x20-\x7E]/g, '_')
  const encoded = encodeURIComponent(safe)
  return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encoded}`
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    if (!id) return NextResponse.json({ error: 'ID lipsă.' }, { status: 400 })

    const idx = await loadIndex()
    const doc = idx.documents.find(d => d.id === id)
    if (!doc) return NextResponse.json({ error: 'Document negăsit.' }, { status: 404 })

    const baseName = doc.titlu || `document-${doc.id}`

    if (doc.pdfUrl) {
      const token = process.env.BLOB_READ_WRITE_TOKEN
      if (!token) {
        console.error('[GET documents/[id]/download] BLOB_READ_WRITE_TOKEN missing')
        return NextResponse.json({ error: 'Configurare server incompletă.' }, { status: 500 })
      }
      const upstream = await fetch(doc.pdfUrl, {
        cache: 'no-store',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!upstream.ok || !upstream.body) {
        console.error('[GET documents/[id]/download] upstream', upstream.status)
        return NextResponse.json({ error: 'Nu s-a putut descărca fișierul.' }, { status: 502 })
      }
      const contentType = upstream.headers.get('content-type') || 'application/octet-stream'
      const ext = (() => {
        if (contentType.includes('pdf')) return '.pdf'
        if (contentType.includes('wordprocessingml')) return '.docx'
        if (contentType.includes('msword')) return '.doc'
        if (contentType.includes('jpeg')) return '.jpg'
        if (contentType.includes('png')) return '.png'
        return ''
      })()
      const filename = `${baseName}${ext}`

      const headers = new Headers({
        'Content-Type': contentType,
        'Content-Disposition': buildContentDisposition(filename),
        'Cache-Control': 'private, no-store',
      })
      const len = upstream.headers.get('content-length')
      if (len) headers.set('Content-Length', len)

      return new NextResponse(upstream.body, { status: 200, headers })
    }

    // Fără pdfUrl → returnăm conținutul text
    const text = doc.continut || ''
    const filename = `${baseName}.txt`
    return new NextResponse(text, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': buildContentDisposition(filename),
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (e: any) {
    console.error('[GET documents/[id]/download]', e)
    return NextResponse.json({ error: e?.message || 'Eroare internă.' }, { status: 500 })
  }
}
