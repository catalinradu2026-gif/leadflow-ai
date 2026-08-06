import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'
import { getSupabaseServer, hasSupabase } from '@/lib/supabase'

// Persistență progres E-Learning (formare).
// FALLBACK grațios: dacă Supabase nu e configurat, răspunde ok (UI merge pe localStorage).

// POST { userId, role, progress, details } → upsert în formare_progress
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!rateLimit(`formare-progress:${ip}`, 60, 60_000)) {
      return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 })
    }

    const body = await req.json() as { userId?: string; role?: string; progress?: number; details?: unknown }
    const userId = (body.userId || '').toString().slice(0, 200) || 'anonim'
    const role = (body.role || 'formabil').toString().slice(0, 40)
    const progress = Math.max(0, Math.min(100, Number(body.progress) || 0))
    const details = body.details && typeof body.details === 'object' ? body.details : {}

    if (!hasSupabase()) {
      // Fără chei: nu e o eroare — pur și simplu nu persistăm în cloud.
      return NextResponse.json({ ok: true, persisted: false })
    }

    const sb = getSupabaseServer()
    if (!sb) return NextResponse.json({ ok: true, persisted: false })

    const { error } = await sb.from('formare_progress').upsert(
      { user_id: userId, role, progress, details, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,role' }
    )
    if (error) {
      console.error('[formare-progress] supabase', error.message)
      return NextResponse.json({ ok: true, persisted: false })
    }
    return NextResponse.json({ ok: true, persisted: true })
  } catch (e) {
    console.error('[formare-progress] POST', e)
    return NextResponse.json({ ok: true, persisted: false })
  }
}

// GET ?userId=..&role=.. → citește progresul persistat (dacă există)
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get('userId')?.slice(0, 200)
    const role = url.searchParams.get('role')?.slice(0, 40) || 'formabil'
    if (!userId) return NextResponse.json({ ok: false, error: 'userId lipsă' }, { status: 400 })

    if (!hasSupabase()) return NextResponse.json({ ok: true, persisted: false, row: null })
    const sb = getSupabaseServer()
    if (!sb) return NextResponse.json({ ok: true, persisted: false, row: null })

    const { data, error } = await sb
      .from('formare_progress')
      .select('progress, details, updated_at')
      .eq('user_id', userId)
      .eq('role', role)
      .maybeSingle()
    if (error) {
      console.error('[formare-progress] GET supabase', error.message)
      return NextResponse.json({ ok: true, persisted: false, row: null })
    }
    return NextResponse.json({ ok: true, persisted: true, row: data })
  } catch (e) {
    console.error('[formare-progress] GET', e)
    return NextResponse.json({ ok: true, persisted: false, row: null })
  }
}
