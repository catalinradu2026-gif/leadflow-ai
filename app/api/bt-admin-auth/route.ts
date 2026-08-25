import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'

// Parolă SEPARATĂ de parola de vizitator (DEMO_BT_PASSWORD) — doar pentru
// Catalin/echipa BT care administrează conținutul, nu pentru vizitatorii demo-ului.
const ADMIN_PASSWORD = process.env.DEMO_BT_ADMIN_PASSWORD || 'BTadmin2026x9'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!rateLimit(`bt-admin-auth:${ip}`, 15, 60_000)) {
      return NextResponse.json({ error: 'Prea multe încercări. Reveniți într-un minut.' }, { status: 429 })
    }

    const { password } = await req.json() as { password?: string }
    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Lipsește parola.' }, { status: 400 })
    }
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Parolă incorectă.' }, { status: 401 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[bt-admin-auth]', e)
    return NextResponse.json({ error: 'Eroare internă.' }, { status: 500 })
  }
}
