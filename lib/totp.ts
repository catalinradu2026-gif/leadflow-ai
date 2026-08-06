import { authenticator } from 'otplib'

// 2FA TOTP (compatibil Google Authenticator) pentru panoul admin Formare.
// Secretul se ține în env ADMIN_TOTP_SECRET. Dacă lipsește → 2FA DEZACTIVAT grațios
// (nu blochează demo-ul; login-ul rămâne doar pe parolă).

/** true dacă 2FA e configurat (env prezent). */
export function totpEnabled(): boolean {
  return !!(process.env.ADMIN_TOTP_SECRET && process.env.ADMIN_TOTP_SECRET.trim().length >= 8)
}

/**
 * Verifică un cod TOTP de 6 cifre contra secretului din env.
 * Dacă 2FA nu e configurat → returnează true (grațios, nu blochează).
 */
export function verifyTotp(token: string): boolean {
  const secret = process.env.ADMIN_TOTP_SECRET?.trim()
  if (!secret) return true // 2FA dezactivat → nu blocăm
  const code = (token || '').toString().replace(/\s/g, '')
  if (!/^\d{6}$/.test(code)) return false
  try {
    // fereastră ±1 pas (30s) pentru toleranță la desincronizarea ceasului
    authenticator.options = { window: 1 }
    return authenticator.verify({ token: code, secret })
  } catch {
    return false
  }
}
