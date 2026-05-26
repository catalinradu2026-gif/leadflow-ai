import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!rateLimit(`auth-check:${ip}`, 20, 60_000)) {
      return NextResponse.json({ error: 'Prea multe încercări. Reveniți într-un minut.' }, { status: 429 })
    }

    const { password } = await req.json() as { role?: string; password?: string }
    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Lipsește parola.' }, { status: 400 })
    }

    const masterPwd = process.env.ADMIN_PASSWORD || process.env.ISJ_PASSWORD || process.env.INSPECTOR_PASSWORD
    if (!masterPwd) {
      console.error('[auth/check] niciun env de parolă setat')
      return NextResponse.json({ error: 'Configurare server incompletă.' }, { status: 500 })
    }
    if (password !== masterPwd) {
      return NextResponse.json({ error: 'Parolă incorectă.' }, { status: 401 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[auth/check]', e)
    return NextResponse.json({ error: 'Eroare internă.' }, { status: 500 })
  }
}
