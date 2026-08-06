import { NextResponse } from 'next/server'
import { getSupabaseServer, hasSupabase } from '@/lib/supabase'

// Statistici AGREGATE de formare pentru tabloul central ARACIP (Inspector Național).
// Returnează DOAR cifre (fără nume/emailuri/date personale) → sigur de afișat pe board,
// fără parolă. Panoul admin complet (cu date personale) rămâne separat și parolat.
// FALLBACK grațios: fără Supabase → zerouri + persisted:false.

interface Details { cursuri?: Record<string, boolean> | string[]; role?: string; [k: string]: unknown }

function numModule(c: Details['cursuri']): number {
  if (!c) return 0
  if (Array.isArray(c)) return c.length
  if (typeof c === 'object') return Object.values(c).filter(Boolean).length
  return 0
}

export async function GET() {
  const empty = {
    ok: true, persisted: false,
    summary: { totalFormabili: 0, totalEvaluatori: 0, medieProgres: 0, finalizati: 0, certificate: 0, total: 0 },
  }
  if (!hasSupabase()) return NextResponse.json(empty)
  const sb = getSupabaseServer()
  if (!sb) return NextResponse.json(empty)

  try {
    const [progRes, autoRes, evalRes] = await Promise.all([
      sb.from('formare_progress').select('user_id, role, progress, details'),
      sb.from('autoevaluare_reports').select('user_id, role'),
      sb.from('evaluare_reports').select('user_id, role'),
    ])

    // Agregare per utilizator (anonim — doar pe user_id, fără a expune identitatea).
    const map = new Map<string, { rol: string; progress: number; hasReport: boolean }>()
    const getU = (id: string) => {
      const k = id || 'anonim'
      let u = map.get(k)
      if (!u) { u = { rol: '', progress: 0, hasReport: false }; map.set(k, u) }
      return u
    }

    for (const r of progRes.data || []) {
      const u = getU(r.user_id as string)
      u.progress = Math.max(u.progress, Math.round(Number(r.progress) || 0))
      const role = r.role as string
      if (role && role !== 'admin' && role !== 'toate' && !u.rol) u.rol = role
      // module terminate nu e necesar pt sumar, dar păstrăm consistența
      void numModule((r.details as Details)?.cursuri)
    }
    for (const r of autoRes.data || []) {
      const u = getU(r.user_id as string); u.hasReport = true
      if (!u.rol) u.rol = (r.role as string) || 'formabil'
    }
    for (const r of evalRes.data || []) {
      const u = getU(r.user_id as string); u.hasReport = true
      u.rol = 'evaluator' // cine a făcut evaluare externă = evaluator
    }

    const users = Array.from(map.values()).map(u => {
      if (!u.rol) u.rol = 'formabil'
      return u
    })

    const totalFormabili = users.filter(u => u.rol === 'formabil').length
    const totalEvaluatori = users.filter(u => u.rol === 'evaluator').length
    const finalizati = users.filter(u => u.progress >= 100).length
    // Certificat disponibil = progres 100% SAU are cel puțin un raport de simulare.
    const certificate = users.filter(u => u.progress >= 100 || u.hasReport).length
    const medieProgres = users.length
      ? Math.round(users.reduce((s, u) => s + u.progress, 0) / users.length)
      : 0

    return NextResponse.json({
      ok: true, persisted: true,
      summary: { totalFormabili, totalEvaluatori, medieProgres, finalizati, certificate, total: users.length },
    })
  } catch (e) {
    console.error('[formare-stats] GET', e)
    return NextResponse.json(empty)
  }
}
