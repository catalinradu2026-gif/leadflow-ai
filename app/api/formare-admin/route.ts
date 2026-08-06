import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer, hasSupabase } from '@/lib/supabase'
import { totpEnabled, verifyTotp } from '@/lib/totp'

// Panou admin Formare — agregare per participant din:
//   formare_progress, autoevaluare_reports, evaluare_reports.
// Protejat prin header `x-password` === ADMIN_PASSWORD (fallback ISJ/INSPECTOR).
// 2FA opțional: dacă ADMIN_TOTP_SECRET e setat, e nevoie și de header `x-totp` (6 cifre).
// FALLBACK grațios: fără Supabase → liste goale + persisted:false (nu eroare).

function adminPassword(): string | undefined {
  return process.env.ADMIN_PASSWORD || process.env.ISJ_PASSWORD || process.env.INSPECTOR_PASSWORD
}

interface Details {
  nume?: string
  email?: string
  unitate?: string
  judet?: string
  cursuri?: Record<string, boolean> | string[]
  [k: string]: unknown
}

interface Participant {
  userId: string
  nume: string
  email: string
  unitate: string
  judet: string
  rol: string
  progress: number
  moduleTerminate: number
  nrAutoevaluare: number
  nrEvaluare: number
  ultimaActivitate: string | null
}

function numModuleTerminate(cursuri: Details['cursuri']): number {
  if (!cursuri) return 0
  if (Array.isArray(cursuri)) return cursuri.length
  if (typeof cursuri === 'object') return Object.values(cursuri).filter(Boolean).length
  return 0
}

function newer(a: string | null, b: string | null): string | null {
  if (!a) return b
  if (!b) return a
  return new Date(a) > new Date(b) ? a : b
}

export async function GET(req: NextRequest) {
  // Meta: clientul întreabă dacă 2FA e activat (fără a expune secretul).
  if (new URL(req.url).searchParams.get('meta') === '1') {
    return NextResponse.json({ ok: true, twoFactor: totpEnabled() })
  }

  const pass = req.headers.get('x-password') || ''
  const expected = adminPassword()
  if (!expected || pass !== expected) {
    return NextResponse.json({ ok: false, error: 'Neautorizat.' }, { status: 401 })
  }

  // 2FA: dacă e configurat, codul TOTP din header e obligatoriu și verificat server-side.
  if (totpEnabled()) {
    const totp = req.headers.get('x-totp') || ''
    if (!verifyTotp(totp)) {
      return NextResponse.json({ ok: false, error: 'Cod 2FA invalid.', need2fa: true }, { status: 401 })
    }
  }

  const empty = {
    ok: true,
    persisted: false,
    participants: [] as Participant[],
    summary: { totalFormabili: 0, totalEvaluatori: 0, medieProgres: 0, finalizati: 0, cuRapoarte: 0, total: 0 },
  }

  if (!hasSupabase()) return NextResponse.json(empty)
  const sb = getSupabaseServer()
  if (!sb) return NextResponse.json(empty)

  try {
    const [progRes, autoRes, evalRes] = await Promise.all([
      sb.from('formare_progress').select('user_id, role, progress, details, updated_at'),
      sb.from('autoevaluare_reports').select('user_id, role, details, created_at'),
      sb.from('evaluare_reports').select('user_id, role, details, created_at'),
    ])

    if (progRes.error) console.error('[formare-admin] formare_progress', progRes.error.message)
    if (autoRes.error) console.error('[formare-admin] autoevaluare_reports', autoRes.error.message)
    if (evalRes.error) console.error('[formare-admin] evaluare_reports', evalRes.error.message)

    const map = new Map<string, Participant>()

    function get(userId: string): Participant {
      const id = userId || 'anonim'
      let p = map.get(id)
      if (!p) {
        p = {
          userId: id, nume: '', email: id === 'anonim' ? '' : id,
          unitate: '', judet: '', rol: '',
          progress: 0, moduleTerminate: 0,
          nrAutoevaluare: 0, nrEvaluare: 0, ultimaActivitate: null,
        }
        map.set(id, p)
      }
      return p
    }

    function applyIdentity(p: Participant, d: Details | null, role?: string) {
      if (d) {
        if (d.nume && !p.nume) p.nume = String(d.nume)
        if (d.email && !p.email) p.email = String(d.email)
        if (d.unitate && !p.unitate) p.unitate = String(d.unitate)
        if (d.judet && !p.judet) p.judet = String(d.judet)
      }
      if (role && !p.rol && role !== 'admin' && role !== 'toate') p.rol = role
    }

    for (const row of progRes.data || []) {
      const d = (row.details || {}) as Details
      const p = get(row.user_id as string)
      applyIdentity(p, d, row.role as string)
      p.progress = Math.max(p.progress, Math.round(Number(row.progress) || 0))
      p.moduleTerminate = Math.max(p.moduleTerminate, numModuleTerminate(d.cursuri))
      p.ultimaActivitate = newer(p.ultimaActivitate, row.updated_at as string)
    }

    for (const row of autoRes.data || []) {
      const d = (row.details || {}) as Details
      const p = get(row.user_id as string)
      applyIdentity(p, d, (row.role as string) || 'formabil')
      p.nrAutoevaluare += 1
      p.ultimaActivitate = newer(p.ultimaActivitate, row.created_at as string)
    }

    for (const row of evalRes.data || []) {
      const d = (row.details || {}) as Details
      const p = get(row.user_id as string)
      applyIdentity(p, d, (row.role as string) || 'evaluator')
      p.nrEvaluare += 1
      p.ultimaActivitate = newer(p.ultimaActivitate, row.created_at as string)
    }

    const participants = Array.from(map.values()).map(p => {
      // Inferență rol dacă lipsește: cine a făcut evaluare = evaluator, altfel formabil.
      if (!p.rol) p.rol = p.nrEvaluare > 0 ? 'evaluator' : 'formabil'
      return p
    }).sort((a, b) => (a.nume || a.email).localeCompare(b.nume || b.email, 'ro'))

    const totalFormabili = participants.filter(p => p.rol === 'formabil').length
    const totalEvaluatori = participants.filter(p => p.rol === 'evaluator').length
    const finalizati = participants.filter(p => p.progress >= 100).length
    const cuRapoarte = participants.filter(p => p.nrAutoevaluare > 0 || p.nrEvaluare > 0).length
    const medieProgres = participants.length
      ? Math.round(participants.reduce((s, p) => s + p.progress, 0) / participants.length)
      : 0

    return NextResponse.json({
      ok: true,
      persisted: true,
      participants,
      summary: { totalFormabili, totalEvaluatori, medieProgres, finalizati, cuRapoarte, total: participants.length },
    })
  } catch (e) {
    console.error('[formare-admin] GET', e)
    return NextResponse.json(empty)
  }
}
