import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'
import { checkApiKey, apiKeyConfigured } from '@/lib/apiAuth'
import { getSupabaseServer, hasSupabase } from '@/lib/supabase'

// ============================================================================
// API PUBLIC ARACIP · /api/v1/{resource}
// Read-only, autentificat cu cheie API (header x-api-key sau ?api_key=).
// Resurse: unitati, autorizari, evaluari, raei, formare.
// Nu expune date cu caracter personal (doar date instituționale + agregate).
// ============================================================================
export const dynamic = 'force-dynamic'

type Cfg = { table: string; select: string; judet: boolean; tip?: string[] }
const RESURSE: Record<string, Cfg> = {
  unitati:    { table: 'unitati_calitate',  select: 'nume_unitate, judet, tip_unitate, localitate, status, calificativ_general, calificative_domenii, created_at', judet: true },
  autorizari: { table: 'cereri_autorizare', select: 'nr_inregistrare, denumire, tip_solicitant, judet, nivel, capacitate, status, created_at', judet: true },
  evaluari:   { table: 'cereri_evaluare',    select: 'nr_inregistrare, tip, denumire, judet, nivel, calificativ, status, created_at', judet: true, tip: ['acreditare', 'evaluare_periodica'] },
  raei:       { table: 'raei_generate',      select: 'nume_unitate, judet, localitate, nivel, an_scolar, nr_elevi, created_at', judet: true },
}

function jsonError(status: number, error: string) {
  return NextResponse.json({ ok: false, error }, { status })
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ resource: string }> }) {
  const { resource } = await ctx.params

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!rateLimit(`apiv1:${ip}`, 120, 60_000)) return jsonError(429, 'Prea multe cereri. Reveniți într-un minut.')

  if (!apiKeyConfigured()) return jsonError(503, 'API-ul nu este configurat pe server (lipsește cheia).')
  if (!checkApiKey(req)) return jsonError(401, 'Cheie API lipsă sau invalidă. Trimiteți header „x-api-key".')

  // Resursă agregată specială: formare (doar cifre, fără date personale)
  if (resource === 'formare') {
    if (!hasSupabase()) return NextResponse.json({ ok: true, resource, data: null })
    const sb = getSupabaseServer(); if (!sb) return NextResponse.json({ ok: true, resource, data: null })
    try {
      const [prog, auto, evl] = await Promise.all([
        sb.from('formare_progress').select('user_id, role, progress'),
        sb.from('autoevaluare_reports').select('user_id'),
        sb.from('evaluare_reports').select('user_id'),
      ])
      const users = new Map<string, { rol: string; progress: number; hasReport: boolean }>()
      for (const r of prog.data || []) { const u = users.get(r.user_id as string) || { rol: '', progress: 0, hasReport: false }; u.progress = Math.max(u.progress, Number(r.progress) || 0); if ((r.role as string) && !['admin', 'toate'].includes(r.role as string) && !u.rol) u.rol = r.role as string; users.set(r.user_id as string, u) }
      for (const r of auto.data || []) { const u = users.get(r.user_id as string) || { rol: 'formabil', progress: 0, hasReport: false }; u.hasReport = true; users.set(r.user_id as string, u) }
      for (const r of evl.data || []) { const u = users.get(r.user_id as string) || { rol: 'evaluator', progress: 0, hasReport: false }; u.rol = 'evaluator'; u.hasReport = true; users.set(r.user_id as string, u) }
      const arr = [...users.values()].map(u => ({ ...u, rol: u.rol || 'formabil' }))
      return NextResponse.json({
        ok: true, resource,
        data: {
          total: arr.length,
          formabili: arr.filter(u => u.rol === 'formabil').length,
          evaluatori: arr.filter(u => u.rol === 'evaluator').length,
          finalizati: arr.filter(u => u.progress >= 100).length,
          certificate: arr.filter(u => u.progress >= 100 || u.hasReport).length,
        },
      })
    } catch { return NextResponse.json({ ok: true, resource, data: null }) }
  }

  const cfg = RESURSE[resource]
  if (!cfg) return jsonError(404, `Resursă necunoscută. Disponibile: ${[...Object.keys(RESURSE), 'formare'].join(', ')}.`)

  if (!hasSupabase()) return NextResponse.json({ ok: true, resource, count: 0, data: [] })
  const sb = getSupabaseServer(); if (!sb) return NextResponse.json({ ok: true, resource, count: 0, data: [] })

  const url = new URL(req.url)
  const judet = url.searchParams.get('judet')?.trim()
  const tip = url.searchParams.get('tip')?.trim()
  const limit = Math.min(500, Math.max(1, Number(url.searchParams.get('limit')) || 100))

  try {
    let q = sb.from(cfg.table).select(cfg.select).order('created_at', { ascending: false }).limit(limit)
    if (cfg.judet && judet) q = q.eq('judet', judet)
    if (cfg.tip && tip && cfg.tip.includes(tip)) q = q.eq('tip', tip)
    const { data, error } = await q
    if (error) { console.error('[api/v1]', resource, error.message); return jsonError(500, 'Eroare la interogare.') }
    return NextResponse.json({ ok: true, resource, count: (data || []).length, data: data || [] })
  } catch (e) {
    console.error('[api/v1] GET', e)
    return jsonError(500, 'Eroare internă.')
  }
}
