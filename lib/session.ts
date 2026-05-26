import crypto from 'crypto'
import { NextRequest } from 'next/server'

export type SessionRole = 'admin' | 'isj' | 'inspector' | 'director' | 'diriginte'
export type SessionPayload = { userId: string; role: SessionRole; ts: number }

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000 // 12 ore

function getSecret(): string {
  const s = process.env.SESSION_SECRET
  if (!s) throw new Error('SESSION_SECRET missing')
  return s
}

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function b64urlDecode(s: string): Buffer {
  s = s.replace(/-/g, '+').replace(/_/g, '/')
  while (s.length % 4) s += '='
  return Buffer.from(s, 'base64')
}

export function signSession(payload: SessionPayload): string {
  const body = b64url(JSON.stringify(payload))
  const sig = b64url(crypto.createHmac('sha256', getSecret()).update(body).digest())
  return `${body}.${sig}`
}

export function verifySessionToken(token: string | null | undefined): SessionPayload | null {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [body, sig] = parts
  let expected: string
  try {
    expected = b64url(crypto.createHmac('sha256', getSecret()).update(body).digest())
  } catch (e) {
    console.error('[verifySession]', e)
    return null
  }
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
  try {
    const payload = JSON.parse(b64urlDecode(body).toString('utf8')) as SessionPayload
    if (!payload?.ts || Date.now() - payload.ts > TOKEN_TTL_MS) return null
    return payload
  } catch (e) {
    console.error('[verifySession]', e)
    return null
  }
}

export function verifySessionFromRequest(req: NextRequest): SessionPayload | null {
  return verifySessionToken(req.headers.get('x-user-session'))
}

export function checkPassword(role: SessionRole, password: string): boolean {
  if (role === 'admin') {
    const p = process.env.ADMIN_PASSWORD
    if (!p) { console.error('[checkPassword] ADMIN_PASSWORD missing'); return false }
    return password === p
  }
  if (role === 'isj') {
    const p = process.env.ISJ_PASSWORD
    if (!p) { console.error('[checkPassword] ISJ_PASSWORD missing'); return false }
    return password === p
  }
  if (role === 'inspector') {
    const p = process.env.INSPECTOR_PASSWORD
    if (!p) { console.error('[checkPassword] INSPECTOR_PASSWORD missing'); return false }
    return password === p
  }
  return false
}

export function checkAnyAdminPassword(password: string): boolean {
  return checkPassword('admin', password) || checkPassword('isj', password) || checkPassword('inspector', password)
}
