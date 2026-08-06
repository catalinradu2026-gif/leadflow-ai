import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'
import { totpEnabled, verifyTotp } from '@/lib/totp'

// Verificare cod 2FA (TOTP) pentru panoul admin Formare — SERVER-SIDE.
// POST { password, code } → { ok, twoFactor }.
// Dacă 2FA nu e configurat (env lipsă) → ok:true grațios (nu blochează demo-ul).

function adminPassword(): string | undefined {
  return process.env.ADMIN_PASSWORD || process.env.ISJ_PASSWORD || process.env.INSPECTOR_PASSWORD
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!rateLimit(`verify-2fa:${ip}`, 15, 60_000)) {
      return NextResponse.json({ ok: false, error: 'Prea multe încercări. Reveniți într-un minut.' }, { status: 429 })
    }

    const { password, code } = await req.json() as { password?: string; code?: string }
    const expected = adminPassword()
    if (!expected || password !== expected) {
      return NextResponse.json({ ok: false, error: 'Neautorizat.' }, { status: 401 })
    }

    if (!totpEnabled()) {
      // 2FA dezactivat → validare doar pe parolă.
      return NextResponse.json({ ok: true, twoFactor: false })
    }

    if (!verifyTotp(code || '')) {
      return NextResponse.json({ ok: false, error: 'Cod 2FA invalid.', twoFactor: true }, { status: 401 })
    }
    return NextResponse.json({ ok: true, twoFactor: true })
  } catch (e) {
    console.error('[verify-2fa] POST', e)
    return NextResponse.json({ ok: false, error: 'Eroare internă.' }, { status: 500 })
  }
}
