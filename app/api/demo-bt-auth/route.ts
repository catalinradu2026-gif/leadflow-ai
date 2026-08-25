import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'

// Parola demo-ului privat BT — EXCLUSIV din env, fără fallback hardcodat în cod
// (fallback-urile scrise în sursă au fost semnalate ca risc de securitate: ajung
// în git history și sunt vizibile oricui vede codul). Setează DEMO_BT_PASSWORD
// în Vercel → Settings → Environment Variables.

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!rateLimit(`demo-bt-auth:${ip}`, 15, 60_000)) {
      return NextResponse.json({ error: 'Prea multe încercări. Reveniți într-un minut.' }, { status: 429 })
    }

    const DEMO_PASSWORD = process.env.DEMO_BT_PASSWORD
    if (!DEMO_PASSWORD) {
      console.error('[demo-bt-auth] DEMO_BT_PASSWORD lipsă din env')
      return NextResponse.json({ error: 'Configurare server incompletă.' }, { status: 500 })
    }

    const { password } = await req.json() as { password?: string }
    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Lipsește parola.' }, { status: 400 })
    }

    if (password !== DEMO_PASSWORD) {
      return NextResponse.json({ error: 'Parolă incorectă.' }, { status: 401 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[demo-bt-auth]', e)
    return NextResponse.json({ error: 'Eroare internă.' }, { status: 500 })
  }
}
