import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'

// Colectează erorile din client (raportate de error boundaries) și le scrie în logurile
// serverului (vizibile în panoul de găzduire). Fără date personale, cu rate limit anti-abuz.
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!rateLimit(`log-error:${ip}`, 30, 60_000)) {
      return NextResponse.json({ ok: false }, { status: 429 })
    }
    const b = await req.json().catch(() => ({})) as { message?: string; url?: string; digest?: string }
    console.error('[client-error]', JSON.stringify({
      message: (b?.message || '').slice(0, 500),
      url: (b?.url || '').slice(0, 300),
      digest: b?.digest,
      ua: (req.headers.get('user-agent') || '').slice(0, 200),
    }))
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
