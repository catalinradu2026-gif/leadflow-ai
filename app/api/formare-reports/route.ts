import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'
import { getSupabaseServer, hasSupabase } from '@/lib/supabase'

// Persistență rapoarte simulare: autoevaluare (A.2) și evaluare externă (A.3).
// FALLBACK grațios: fără Supabase răspunde ok (UI merge pe localStorage).

const TABLE: Record<string, string> = {
  autoevaluare: 'autoevaluare_reports',
  evaluare: 'evaluare_reports',
}

// POST { type: 'autoevaluare'|'evaluare', userId, role, scor?, details? }
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!rateLimit(`formare-reports:${ip}`, 60, 60_000)) {
      return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 })
    }

    const body = await req.json() as { type?: string; userId?: string; role?: string; scor?: number; details?: unknown }
    const type = (body.type || '').toString()
    const table = TABLE[type]
    if (!table) return NextResponse.json({ ok: false, error: 'type invalid' }, { status: 400 })

    const userId = (body.userId || '').toString().slice(0, 200) || 'anonim'
    const role = (body.role || (type === 'evaluare' ? 'evaluator' : 'formabil')).toString().slice(0, 40)
    const scor = body.scor == null ? null : Number(body.scor)
    const details = body.details && typeof body.details === 'object' ? body.details : {}

    if (!hasSupabase()) return NextResponse.json({ ok: true, persisted: false })
    const sb = getSupabaseServer()
    if (!sb) return NextResponse.json({ ok: true, persisted: false })

    const { error } = await sb.from(table).insert({ user_id: userId, role, scor, details })
    if (error) {
      console.error('[formare-reports] supabase', error.message)
      return NextResponse.json({ ok: true, persisted: false })
    }
    return NextResponse.json({ ok: true, persisted: true })
  } catch (e) {
    console.error('[formare-reports] POST', e)
    return NextResponse.json({ ok: true, persisted: false })
  }
}

// GET ?type=..&userId=.. → citește rapoartele persistate
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const type = url.searchParams.get('type') || ''
    const table = TABLE[type]
    if (!table) return NextResponse.json({ ok: false, error: 'type invalid' }, { status: 400 })
    const userId = url.searchParams.get('userId')?.slice(0, 200)
    if (!userId) return NextResponse.json({ ok: false, error: 'userId lipsă' }, { status: 400 })

    if (!hasSupabase()) return NextResponse.json({ ok: true, persisted: false, rows: [] })
    const sb = getSupabaseServer()
    if (!sb) return NextResponse.json({ ok: true, persisted: false, rows: [] })

    const { data, error } = await sb
      .from(table)
      .select('scor, details, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) {
      console.error('[formare-reports] GET supabase', error.message)
      return NextResponse.json({ ok: true, persisted: false, rows: [] })
    }
    return NextResponse.json({ ok: true, persisted: true, rows: data || [] })
  } catch (e) {
    console.error('[formare-reports] GET', e)
    return NextResponse.json({ ok: true, persisted: false, rows: [] })
  }
}
