import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ============================================================================
// Comutatoare de disponibilitate — REACTIVARE LA ABONARE (schimbă în `true`).
// Ascund module care nu fac parte din livrarea curentă ARACIP, fără a șterge cod.
//   SHOW_EDU            → platforma EDU Digital + portalurile Școală / Grădiniță
//   SHOW_RAEI_GENERATOR → generatorul RAEI din portalul Director (/demo/director/raei)
// Când sunt false, rutele respective redirecționează spre portalul /aracip.
// ============================================================================
const SHOW_EDU = false
const SHOW_RAEI_GENERATOR = true

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const eduPath =
    pathname === '/edu' || pathname.startsWith('/edu/') ||
    pathname === '/scoala' || pathname.startsWith('/scoala/') ||
    pathname === '/gradinita' || pathname.startsWith('/gradinita/')

  const raeiPath = pathname === '/demo/director/raei'

  if ((!SHOW_EDU && eduPath) || (!SHOW_RAEI_GENERATOR && raeiPath)) {
    return NextResponse.redirect(new URL('/aracip', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/edu',
    '/edu/:path*',
    '/scoala',
    '/scoala/:path*',
    '/gradinita',
    '/gradinita/:path*',
    '/demo/director/raei',
  ],
}
