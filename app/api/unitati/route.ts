import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'
import { getSupabaseServer, hasSupabase } from '@/lib/supabase'

// Lanțul calității LIVE: depuneri reale de la unități (Școală) → vizibile la ISJ (județ) + ARACIP (național).
// Toate din aceeași tabelă `unitati_calitate`. FALLBACK grațios fără Supabase (liste goale, nu eroare).

const STATUSURI = ['autoevaluare_depusa', 'in_evaluare', 'acreditat', 'periodica'] as const
const CALIFICATIVE = ['Nesatisfăcător', 'Satisfăcător', 'Bine', 'Foarte bine', 'Excelent']
const TIPURI = ['Grădiniță', 'Școală', 'Gimnaziu', 'Liceu', 'Colegiu', 'Special', 'Alt tip']

type UnitateRow = {
  id?: string
  nume_unitate: string
  judet: string
  tip_unitate: string
  localitate: string | null
  status: string
  calificativ_general: string | null
  calificative_domenii: Record<string, string>
  calificative_indicatori: Record<string, string>
  rezumat: string | null
  contact_email: string | null
  created_at?: string
  updated_at?: string
}

function s(v: unknown, max = 200): string {
  return (v ?? '').toString().trim().slice(0, max)
}

// POST { nume_unitate, judet, tip_unitate, localitate, status, calificativ_general,
//        calificative_domenii, calificative_indicatori, rezumat, contact_email }
// → insert în unitati_calitate (depunere de la unitate).
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!rateLimit(`unitati:${ip}`, 20, 60_000)) {
      return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 })
    }

    const body = await req.json() as Record<string, unknown>
    const nume_unitate = s(body.nume_unitate, 300)
    const judet = s(body.judet, 80)
    if (!nume_unitate || !judet) {
      return NextResponse.json({ ok: false, error: 'nume_unitate și judet sunt obligatorii' }, { status: 400 })
    }

    let tip_unitate = s(body.tip_unitate, 40) || 'Școală'
    if (!TIPURI.includes(tip_unitate)) tip_unitate = 'Școală'

    let status = s(body.status, 40) || 'autoevaluare_depusa'
    if (!STATUSURI.includes(status as typeof STATUSURI[number])) status = 'autoevaluare_depusa'

    let calificativ_general: string | null = s(body.calificativ_general, 40) || null
    if (calificativ_general && !CALIFICATIVE.includes(calificativ_general)) calificativ_general = null

    const domeniiRaw = (body.calificative_domenii && typeof body.calificative_domenii === 'object')
      ? body.calificative_domenii as Record<string, unknown> : {}
    const calificative_domenii: Record<string, string> = {}
    for (const k of ['A', 'B', 'C']) {
      const val = s(domeniiRaw[k], 40)
      if (val && CALIFICATIVE.includes(val)) calificative_domenii[k] = val
    }

    const indicatoriRaw = (body.calificative_indicatori && typeof body.calificative_indicatori === 'object')
      ? body.calificative_indicatori as Record<string, unknown> : {}
    const calificative_indicatori: Record<string, string> = {}
    for (const [k, v] of Object.entries(indicatoriRaw).slice(0, 30)) {
      const key = s(k, 10)
      const val = s(v, 40)
      if (key && val) calificative_indicatori[key] = val
    }

    const row: UnitateRow = {
      nume_unitate,
      judet,
      tip_unitate,
      localitate: s(body.localitate, 120) || null,
      status,
      calificativ_general,
      calificative_domenii,
      calificative_indicatori,
      rezumat: s(body.rezumat, 4000) || null,
      contact_email: s(body.contact_email, 200) || null,
    }

    if (!hasSupabase()) {
      // Fără chei: nu e o eroare — nu persistăm în cloud, dar confirmăm fluxul UI.
      return NextResponse.json({ ok: true, persisted: false, unitate: { ...row, id: 'local-' + Date.now() } })
    }
    const sb = getSupabaseServer()
    if (!sb) return NextResponse.json({ ok: true, persisted: false, unitate: { ...row, id: 'local-' + Date.now() } })

    const { data, error } = await sb.from('unitati_calitate')
      .insert({ ...row, updated_at: new Date().toISOString() })
      .select()
      .maybeSingle()
    if (error) {
      console.error('[unitati] POST supabase', error.message)
      return NextResponse.json({ ok: true, persisted: false, unitate: { ...row, id: 'local-' + Date.now() } })
    }
    return NextResponse.json({ ok: true, persisted: true, unitate: data })
  } catch (e) {
    console.error('[unitati] POST', e)
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 })
  }
}

// GET ?judet=..&status=.. → listă unități depuse + agregate (pe județ, status, calificativ, domenii).
export async function GET(req: NextRequest) {
  const empty = {
    ok: true,
    persisted: false,
    unitati: [] as UnitateRow[],
    total: 0,
    aggregates: {
      pe_judet: {} as Record<string, number>,
      pe_status: {} as Record<string, number>,
      pe_calificativ: {} as Record<string, number>,
      pe_domenii: { A: {}, B: {}, C: {} } as Record<string, Record<string, number>>,
    },
  }

  try {
    const url = new URL(req.url)
    const fJudet = url.searchParams.get('judet')?.slice(0, 80) || ''
    const fStatus = url.searchParams.get('status')?.slice(0, 40) || ''

    if (!hasSupabase()) return NextResponse.json(empty)
    const sb = getSupabaseServer()
    if (!sb) return NextResponse.json(empty)

    let q = sb.from('unitati_calitate')
      .select('id, nume_unitate, judet, tip_unitate, localitate, status, calificativ_general, calificative_domenii, calificative_indicatori, rezumat, contact_email, created_at, updated_at')
      .order('created_at', { ascending: false })
      .limit(2000)
    if (fJudet) q = q.eq('judet', fJudet)
    if (fStatus) q = q.eq('status', fStatus)

    const { data, error } = await q
    if (error) {
      // Tabela poate lipsi încă (înainte de a rula SQL-ul) — fallback grațios.
      console.error('[unitati] GET supabase', error.message)
      return NextResponse.json(empty)
    }

    const unitati = (data || []) as UnitateRow[]
    const pe_judet: Record<string, number> = {}
    const pe_status: Record<string, number> = {}
    const pe_calificativ: Record<string, number> = {}
    const pe_domenii: Record<string, Record<string, number>> = { A: {}, B: {}, C: {} }

    for (const u of unitati) {
      pe_judet[u.judet] = (pe_judet[u.judet] || 0) + 1
      pe_status[u.status] = (pe_status[u.status] || 0) + 1
      if (u.calificativ_general) pe_calificativ[u.calificativ_general] = (pe_calificativ[u.calificativ_general] || 0) + 1
      const dom = u.calificative_domenii || {}
      for (const d of ['A', 'B', 'C']) {
        const cal = (dom as Record<string, string>)[d]
        if (cal) pe_domenii[d][cal] = (pe_domenii[d][cal] || 0) + 1
      }
    }

    return NextResponse.json({
      ok: true,
      persisted: true,
      unitati,
      total: unitati.length,
      aggregates: { pe_judet, pe_status, pe_calificativ, pe_domenii },
    })
  } catch (e) {
    console.error('[unitati] GET', e)
    return NextResponse.json(empty)
  }
}
