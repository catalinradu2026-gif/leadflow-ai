import { NextRequest, NextResponse } from 'next/server'

const COUNTRY_LANG: Record<string, string> = {
  RO: 'ro', MD: 'ro',
  IT: 'it',
  DE: 'de', AT: 'de',
  FR: 'fr', BE: 'fr',
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es',
  CN: 'zh', TW: 'zh', HK: 'zh', SG: 'zh', MO: 'zh',
}

export async function GET(req: NextRequest) {
  const country = req.headers.get('x-vercel-ip-country')?.toUpperCase() || ''
  const lang = COUNTRY_LANG[country] || 'en'
  return NextResponse.json({ lang, country })
}
