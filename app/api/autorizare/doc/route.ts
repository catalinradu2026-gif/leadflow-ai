import { NextRequest, NextResponse } from 'next/server'

// Proxy securizat pentru descărcarea documentelor dintr-un dosar de autorizare.
// Documentele conțin date personale (ex. buletin) → blobul rămâne PRIVAT, iar accesul
// se face doar server-side cu Bearer token, protejat de parola ARACIP (x-password).
export const dynamic = 'force-dynamic'

function adminPassword(): string | undefined {
  return process.env.ADMIN_PASSWORD || process.env.ISJ_PASSWORD || process.env.INSPECTOR_PASSWORD
}

// Anti-SSRF: acceptăm doar URL-uri de blob Vercel din folderul nostru „autorizare/”.
function urlPermis(raw: string): boolean {
  try {
    const u = new URL(raw)
    if (u.protocol !== 'https:') return false
    if (!/\.blob\.vercel-storage\.com$/.test(u.hostname)) return false
    if (!u.pathname.includes('/autorizare/')) return false
    return true
  } catch { return false }
}

export async function GET(req: NextRequest) {
  const pass = req.headers.get('x-password') || new URL(req.url).searchParams.get('pass') || ''
  const expected = adminPassword()
  if (!expected || pass !== expected) {
    return NextResponse.json({ error: 'Neautorizat. Deblochează deciziile ARACIP.' }, { status: 401 })
  }

  const url = new URL(req.url).searchParams.get('url') || ''
  if (!url || !urlPermis(url)) {
    return NextResponse.json({ error: 'URL invalid.' }, { status: 400 })
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    console.error('[autorizare/doc] BLOB_READ_WRITE_TOKEN missing')
    return NextResponse.json({ error: 'Configurare server incompletă.' }, { status: 500 })
  }

  try {
    const upstream = await fetch(url, { cache: 'no-store', headers: { Authorization: `Bearer ${token}` } })
    if (!upstream.ok || !upstream.body) {
      console.error('[autorizare/doc] upstream', upstream.status)
      return NextResponse.json({ error: 'Nu s-a putut descărca fișierul.' }, { status: 502 })
    }
    const contentType = upstream.headers.get('content-type') || 'application/octet-stream'
    const headers = new Headers({
      'Content-Type': contentType,
      'Cache-Control': 'private, no-store',
    })
    const len = upstream.headers.get('content-length')
    if (len) headers.set('Content-Length', len)
    return new NextResponse(upstream.body, { status: 200, headers })
  } catch (e) {
    console.error('[autorizare/doc] GET', e)
    return NextResponse.json({ error: 'Eroare internă.' }, { status: 500 })
  }
}
