import { authenticator } from 'otplib'

// 2FA TOTP (compatibil Google Authenticator/Authy) — folosit inițial doar de panoul
// admin Formare (secret în env ADMIN_TOTP_SECRET), acum parametrizat ca să poată fi
// reutilizat și de alte panouri (ex. demo BT) cu propriul lor secret, fără să
// amestece codurile între panouri diferite.
// Dacă secretul lipsește → 2FA DEZACTIVAT grațios (nu blochează demo-ul; login-ul
// rămâne doar pe parolă).

/** true dacă 2FA e configurat (secret dat explicit, sau ADMIN_TOTP_SECRET din env). */
export function totpEnabled(secret?: string): boolean {
  const s = (secret ?? process.env.ADMIN_TOTP_SECRET)?.trim()
  return !!(s && s.length >= 8)
}

/**
 * Verifică un cod TOTP de 6 cifre contra secretului dat (sau ADMIN_TOTP_SECRET din env
 * dacă niciun secret nu e pasat explicit — compatibilitate cu apelurile existente).
 * Dacă 2FA nu e configurat → returnează true (grațios, nu blochează).
 */
export function verifyTotp(token: string, secret?: string): boolean {
  const s = (secret ?? process.env.ADMIN_TOTP_SECRET)?.trim()
  if (!s) return true // 2FA dezactivat → nu blocăm
  const code = (token || '').toString().replace(/\s/g, '')
  if (!/^\d{6}$/.test(code)) return false
  try {
    // fereastră ±1 pas (30s) pentru toleranță la desincronizarea ceasului
    authenticator.options = { window: 1 }
    return authenticator.verify({ token: code, secret: s })
  } catch {
    return false
  }
}
