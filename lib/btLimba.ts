// Selector de limbă pentru demo-ul BT — replică pattern-ul din
// evenimente-craiova/lib/limbaManuala.ts (auto-detectare după IP prin
// /api/bt-geo + alegere manuală care are prioritate, persistată în
// localStorage). 35 de limbi, aceeași listă ca proiectul sursă.

const STORAGE_KEY = 'demo-bt-2026:limba-manuala'
const EVENT_NAME = 'demo-bt-2026:limba-manuala-schimbata'

export interface OptiuneLimba {
  nume: string // numele în română — folosit ca parametru `lang` trimis către /api/bt-chat
  eticheta: string // afișat în selector, cu steag
}

export const LIMBI_DISPONIBILE: OptiuneLimba[] = [
  { nume: 'română', eticheta: '🇷🇴 Română' },
  { nume: 'engleză', eticheta: '🇬🇧 English' },
  { nume: 'germană', eticheta: '🇩🇪 Deutsch' },
  { nume: 'franceză', eticheta: '🇫🇷 Français' },
  { nume: 'spaniolă', eticheta: '🇪🇸 Español' },
  { nume: 'italiană', eticheta: '🇮🇹 Italiano' },
  { nume: 'portugheză', eticheta: '🇵🇹 Português' },
  { nume: 'neerlandeză', eticheta: '🇳🇱 Nederlands' },
  { nume: 'poloneză', eticheta: '🇵🇱 Polski' },
  { nume: 'maghiară', eticheta: '🇭🇺 Magyar' },
  { nume: 'bulgară', eticheta: '🇧🇬 Български' },
  { nume: 'greacă', eticheta: '🇬🇷 Ελληνικά' },
  { nume: 'cehă', eticheta: '🇨🇿 Čeština' },
  { nume: 'slovacă', eticheta: '🇸🇰 Slovenčina' },
  { nume: 'suedeză', eticheta: '🇸🇪 Svenska' },
  { nume: 'daneză', eticheta: '🇩🇰 Dansk' },
  { nume: 'finlandeză', eticheta: '🇫🇮 Suomi' },
  { nume: 'croată', eticheta: '🇭🇷 Hrvatski' },
  { nume: 'slovenă', eticheta: '🇸🇮 Slovenščina' },
  { nume: 'estonă', eticheta: '🇪🇪 Eesti' },
  { nume: 'letonă', eticheta: '🇱🇻 Latviešu' },
  { nume: 'lituaniană', eticheta: '🇱🇹 Lietuvių' },
  { nume: 'malteză', eticheta: '🇲🇹 Malti' },
  { nume: 'ucraineană', eticheta: '🇺🇦 Українська' },
  { nume: 'rusă', eticheta: '🇷🇺 Русский' },
  { nume: 'turcă', eticheta: '🇹🇷 Türkçe' },
  { nume: 'chineză', eticheta: '🇨🇳 中文' },
  { nume: 'japoneză', eticheta: '🇯🇵 日本語' },
  { nume: 'coreeană', eticheta: '🇰🇷 한국어' },
  { nume: 'arabă', eticheta: '🇸🇦 العربية' },
  { nume: 'ebraică', eticheta: '🇮🇱 עברית' },
  { nume: 'thailandeză', eticheta: '🇹🇭 ไทย' },
  { nume: 'vietnameză', eticheta: '🇻🇳 Tiếng Việt' },
  { nume: 'indoneziană', eticheta: '🇮🇩 Bahasa Indonesia' },
  { nume: 'malaeziană', eticheta: '🇲🇾 Bahasa Melayu' },
]

export function citesteLimbaManuala(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function scrieLimbaManuala(nume: string | null) {
  if (typeof window === 'undefined') return
  try {
    if (nume) localStorage.setItem(STORAGE_KEY, nume)
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // localStorage indisponibil — alegerea rămâne validă doar pentru sesiunea curentă
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME))
}

export function peLimbaManualaSchimbata(handler: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(EVENT_NAME, handler)
  return () => window.removeEventListener(EVENT_NAME, handler)
}

// Limba efectivă: cea aleasă manual are prioritate; altfel cade pe /api/bt-geo (IP).
export async function determinaLimba(): Promise<string> {
  const manuala = citesteLimbaManuala()
  if (manuala) return manuala
  try {
    const r = await fetch('/api/bt-geo')
    const d = await r.json()
    return d.limba || 'română'
  } catch {
    return 'română'
  }
}
