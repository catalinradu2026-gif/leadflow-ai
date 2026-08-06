// Autentificare pentru API-ul public ARACIP (`/api/v1/...`).
// Cheia se ține în env PUBLIC_API_KEY. Se trimite ca header `x-api-key` sau query `?api_key=`.
import type { NextRequest } from 'next/server'

export function apiKeyConfigured(): boolean {
  return !!process.env.PUBLIC_API_KEY
}

export function checkApiKey(req: NextRequest): boolean {
  const expected = process.env.PUBLIC_API_KEY
  if (!expected) return false
  const key = req.headers.get('x-api-key') || new URL(req.url).searchParams.get('api_key') || ''
  return key === expected
}
