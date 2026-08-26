import { NextRequest, NextResponse } from 'next/server'

// Aceeași hartă țară → limbă (35 de limbi) ca în proiectul evenimente-craiova
// (app/api/geo/route.ts de acolo) — replicată aici pentru demo-ul BT, cu cheie
// proprie de rută ca să nu depindă de/interfereze cu /api/geo existent (folosit
// deja de Ava/ARA cu o hartă mai restrânsă, 6 limbi).
const COUNTRY_LANG: Record<string, string> = {
  RO: 'română', MD: 'română',
  DE: 'germană', AT: 'germană', CH: 'germană', LU: 'germană',
  IT: 'italiană',
  FR: 'franceză', BE: 'franceză',
  ES: 'spaniolă',
  PT: 'portugheză',
  NL: 'neerlandeză',
  PL: 'poloneză',
  HU: 'maghiară',
  BG: 'bulgară',
  GR: 'greacă', CY: 'greacă',
  CZ: 'cehă',
  SK: 'slovacă',
  SE: 'suedeză',
  DK: 'daneză',
  FI: 'finlandeză',
  IE: 'engleză',
  HR: 'croată',
  SI: 'slovenă',
  EE: 'estonă',
  LV: 'letonă',
  LT: 'lituaniană',
  MT: 'malteză',
  GB: 'engleză',

  US: 'engleză', CA: 'engleză', AU: 'engleză', NZ: 'engleză', IN: 'engleză', PK: 'engleză', ZA: 'engleză',
  MX: 'spaniolă', AR: 'spaniolă', CO: 'spaniolă', CL: 'spaniolă', PE: 'spaniolă', VE: 'spaniolă', EC: 'spaniolă', UY: 'spaniolă', PY: 'spaniolă', BO: 'spaniolă', CR: 'spaniolă', PA: 'spaniolă', DO: 'spaniolă', GT: 'spaniolă',
  BR: 'portugheză',
  CN: 'chineză', TW: 'chineză', HK: 'chineză', SG: 'chineză',
  JP: 'japoneză',
  KR: 'coreeană',
  SA: 'arabă', AE: 'arabă', EG: 'arabă', QA: 'arabă', KW: 'arabă', OM: 'arabă', BH: 'arabă', JO: 'arabă', LB: 'arabă', IQ: 'arabă', MA: 'arabă', DZ: 'arabă', TN: 'arabă',
  RU: 'rusă', BY: 'rusă', KZ: 'rusă',
  TR: 'turcă',
  IL: 'ebraică',
  TH: 'thailandeză',
  VN: 'vietnameză',
  ID: 'indoneziană',
  MY: 'malaeziană',
  PH: 'engleză',
  UA: 'ucraineană',
}

export async function GET(req: NextRequest) {
  const country = req.headers.get('x-vercel-ip-country')?.toUpperCase() || ''
  const limba = COUNTRY_LANG[country] || 'română'
  return NextResponse.json({ limba, country })
}
