import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'
import { getSupabaseServer, hasSupabase } from '@/lib/supabase'

// RAEI generate de directori → salvare în Supabase și agregare pentru tabloul central ARACIP.
// FALLBACK grațios: fără Supabase → răspunde ok, fără a persista.

// POST { nume_unitate, judet?, localitate?, nivel?, an_scolar?, nr_elevi?, details? }
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!rateLimit(`raei:${ip}`, 20, 60_000)) {
      return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 })
    }
    const b = await req.json().catch(() => ({})) as Record<string, unknown>
    const nume = (b.nume_unitate || '').toString().trim().slice(0, 200)
    if (!nume) return NextResponse.json({ ok: false, error: 'nume lipsă' }, { status: 400 })

    if (!hasSupabase()) return NextResponse.json({ ok: true, persisted: false })
    const sb = getSupabaseServer()
    if (!sb) return NextResponse.json({ ok: true, persisted: false })

    const nrElevi = Number(b.nr_elevi)
    const { error } = await sb.from('raei_generate').insert({
      nume_unitate: nume,
      judet: (b.judet || '').toString().trim().slice(0, 60) || null,
      localitate: (b.localitate || '').toString().trim().slice(0, 120) || null,
      nivel: (b.nivel || '').toString().trim().slice(0, 40) || null,
      an_scolar: (b.an_scolar || '').toString().trim().slice(0, 20) || null,
      nr_elevi: Number.isFinite(nrElevi) ? Math.max(0, Math.round(nrElevi)) : null,
      details: b.details && typeof b.details === 'object' ? b.details : {},
    })
    if (error) {
      console.error('[raei] insert', error.message)
      return NextResponse.json({ ok: true, persisted: false })
    }
    return NextResponse.json({ ok: true, persisted: true })
  } catch (e) {
    console.error('[raei] POST', e)
    return NextResponse.json({ ok: true, persisted: false })
  }
}

// GET (?judet=..) → { total, pe_judet, recent: [...] } pentru tabloul central / ISJ
export async function GET(req: NextRequest) {
  const empty = { ok: true, persisted: false, total: 0, pe_judet: {} as Record<string, number>, recent: [] as unknown[] }
  if (!hasSupabase()) return NextResponse.json(empty)
  const sb = getSupabaseServer()
  if (!sb) return NextResponse.json(empty)
  const judetFiltru = new URL(req.url).searchParams.get('judet')?.trim()
  try {
    let q = sb
      .from('raei_generate')
      .select('nume_unitate, judet, localitate, nivel, an_scolar, nr_elevi, created_at')
      .order('created_at', { ascending: false })
    if (judetFiltru) q = q.eq('judet', judetFiltru)
    const { data, error } = await q
    if (error) { console.error('[raei] GET', error.message); return NextResponse.json(empty) }
    const rows = data || []
    const pe_judet: Record<string, number> = {}
    for (const r of rows) { const j = (r.judet as string) || 'Nespecificat'; pe_judet[j] = (pe_judet[j] || 0) + 1 }
    return NextResponse.json({ ok: true, persisted: true, total: rows.length, pe_judet, recent: rows.slice(0, 20) })
  } catch (e) {
    console.error('[raei] GET', e)
    return NextResponse.json(empty)
  }
}
