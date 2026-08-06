// Helper client-side pentru aria Formare.
// Rolul + identificatorul utilizatorului sunt setate la login (pe /aracip) și
// citite aici. Persistența în cloud e fire-and-forget: dacă pică, UX-ul nu se rupe.

export type FormareRol = 'formabil' | 'evaluator' | 'toate'

export function getFormareRol(): FormareRol {
  if (typeof window === 'undefined') return 'toate'
  try {
    const r = localStorage.getItem('aracip_formare_rol')
    if (r === 'formabil' || r === 'evaluator' || r === 'toate') return r
  } catch { /* ignore */ }
  return 'toate'
}

/** Identificator utilizator pentru persistență (email introdus la login, altfel token/anon). */
export function getFormareUserId(): string {
  if (typeof window === 'undefined') return 'anonim'
  try {
    return localStorage.getItem('aracip_formare_user') || 'anonim'
  } catch { return 'anonim' }
}

/** Numele complet al participantului (introdus obligatoriu la login). */
export function getFormareNume(): string {
  if (typeof window === 'undefined') return ''
  try { return localStorage.getItem('aracip_formare_nume') || '' } catch { return '' }
}

/** Unitatea de învățământ (opțional). */
export function getFormareUnitate(): string {
  if (typeof window === 'undefined') return ''
  try { return localStorage.getItem('aracip_formare_unitate') || '' } catch { return '' }
}

/** Județul (opțional). */
export function getFormareJudet(): string {
  if (typeof window === 'undefined') return ''
  try { return localStorage.getItem('aracip_formare_judet') || '' } catch { return '' }
}

/** Identitatea completă a participantului, inclusă în `details` pentru fiecare push. */
function identityDetails() {
  return {
    nume: getFormareNume(),
    email: getFormareUserId(),
    unitate: getFormareUnitate(),
    judet: getFormareJudet(),
  }
}

/** true dacă există o sesiune validă pentru aria Formare. */
export function hasFormareSession(): boolean {
  if (typeof window === 'undefined') return false
  try { return !!localStorage.getItem('aracip_formare_ok') } catch { return false }
}

/** Trimite progresul E-Learning în cloud (non-blocant). */
export function pushElearningProgress(progressPct: number, details: Record<string, boolean>) {
  const rol = getFormareRol()
  const role = rol === 'toate' ? 'admin' : rol
  try {
    fetch('/api/formare-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: getFormareUserId(), role, progress: progressPct, details: { ...identityDetails(), ...details } }),
      keepalive: true,
    }).catch(() => { /* fallback silent — localStorage rămâne sursa locală */ })
  } catch { /* noop */ }
}

/** Trimite un raport de simulare în cloud (non-blocant). type: 'autoevaluare' | 'evaluare'. */
export function pushFormareReport(type: 'autoevaluare' | 'evaluare', scor: number | null, details: Record<string, unknown>) {
  const role = type === 'evaluare' ? 'evaluator' : 'formabil'
  try {
    fetch('/api/formare-reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, userId: getFormareUserId(), role, scor, details: { ...identityDetails(), ...details } }),
      keepalive: true,
    }).catch(() => { /* fallback silent */ })
  } catch { /* noop */ }
}
