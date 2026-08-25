import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'
import { totpEnabled, verifyTotp } from '@/lib/totp'

// Parolă SEPARATĂ de parola de vizitator (DEMO_BT_PASSWORD) — doar pentru
// Catalin/echipa BT care administrează conținutul, nu pentru vizitatorii demo-ului.
const ADMIN_PASSWORD = process.env.DEMO_BT_ADMIN_PASSWORD || 'BTadmin2026x9'

// 2FA TOTP (cod din Google Authenticator/Authy) — al doilea factor real, funcțional,
// nu doar promis. Secret dedicat panoului BT (separat de ADMIN_TOTP_SECRET folosit de
// panoul Formare/ARACIP). Fallback hardcodat ca demo-ul să funcționeze din prima, fără
// configurare manuală pe Vercel — Catalin poate suprascrie cu BT_ADMIN_TOTP_SECRET.
// Cheie de setup (adăugați manual în aplicația de autentificare, "introduceți cheia"):
const BT_TOTP_SECRET = process.env.BT_ADMIN_TOTP_SECRET || 'JMLSGFQHNMODWQQW'

// POST { password, code? } — flux în 2 pași:
//   1. Doar parola → dacă e corectă și 2FA e activ, întoarce { ok:false, twoFactorRequired:true }
//      (parola validă, dar autentificarea NU e completă — clientul arată ecranul de cod).
//   2. Parolă + cod → dacă ambele sunt corecte, întoarce { ok:true }.
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!rateLimit(`bt-admin-auth:${ip}`, 15, 60_000)) {
      return NextResponse.json({ error: 'Prea multe încercări. Reveniți într-un minut.' }, { status: 429 })
    }

    const { password, code } = await req.json() as { password?: string; code?: string }
    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Lipsește parola.' }, { status: 400 })
    }
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Parolă incorectă.' }, { status: 401 })
    }

    if (!totpEnabled(BT_TOTP_SECRET)) {
      // 2FA dezactivat (nu ar trebui să se întâmple — avem fallback hardcodat — dar
      // rămâne grațios dacă cineva golește explicit env-ul).
      return NextResponse.json({ ok: true, twoFactorRequired: false })
    }

    if (!code) {
      // Parola e corectă, dar mai e nevoie de codul din aplicația de autentificare.
      return NextResponse.json({ ok: false, twoFactorRequired: true })
    }

    if (!verifyTotp(code, BT_TOTP_SECRET)) {
      return NextResponse.json({ error: 'Cod de autentificare incorect.', twoFactorRequired: true }, { status: 401 })
    }

    return NextResponse.json({ ok: true, twoFactorRequired: true })
  } catch (e) {
    console.error('[bt-admin-auth]', e)
    return NextResponse.json({ error: 'Eroare internă.' }, { status: 500 })
  }
}
