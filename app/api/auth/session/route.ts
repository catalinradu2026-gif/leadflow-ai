import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'
import { checkPassword, signSession, SessionRole } from '@/lib/session'
import crypto from 'crypto'

// POST /api/auth/session
// Body: { role: 'admin'|'isj'|'inspector'|'director'|'diriginte', password?: string, email?: string }
// Pentru admin/isj/inspector: necesită parolă demo. Emite token HMAC.
// Pentru director/diriginte: acceptă orice email (autentificare demo soft) și emite token.
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!rateLimit(`auth-session:${ip}`, 20, 60_000)) {
      return NextResponse.json({ error: 'Prea multe încercări. Reveniți într-un minut.' }, { status: 429 })
    }

    if (!process.env.SESSION_SECRET) {
      console.error('[auth/session] SESSION_SECRET missing')
      return NextResponse.json({ error: 'Configurare server incompletă.' }, { status: 500 })
    }

    const { role, password, email } = await req.json() as { role?: SessionRole; password?: string; email?: string }
    if (!role) return NextResponse.json({ error: 'Rol lipsă.' }, { status: 400 })

    if (role === 'admin' || role === 'isj' || role === 'inspector') {
      if (!password || typeof password !== 'string') {
        return NextResponse.json({ error: 'Parolă lipsă.' }, { status: 400 })
      }
      try {
        if (!checkPassword(role, password)) {
          return NextResponse.json({ error: 'Parolă incorectă.' }, { status: 401 })
        }
      } catch (e) {
        console.error('[auth/session] env missing', e)
        return NextResponse.json({ error: 'Configurare server incompletă.' }, { status: 500 })
      }
    } else if (role === 'director' || role === 'diriginte') {
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        return NextResponse.json({ error: 'Email invalid.' }, { status: 400 })
      }
    } else {
      return NextResponse.json({ error: 'Rol invalid.' }, { status: 400 })
    }

    const userId = email
      ? crypto.createHash('sha256').update(email.toLowerCase()).digest('hex').slice(0, 16)
      : crypto.randomBytes(8).toString('hex')

    const token = signSession({ userId, role, ts: Date.now() })
    return NextResponse.json({ ok: true, token, role, userId })
  } catch (e) {
    console.error('[auth/session]', e)
    return NextResponse.json({ error: 'Eroare internă.' }, { status: 500 })
  }
}
