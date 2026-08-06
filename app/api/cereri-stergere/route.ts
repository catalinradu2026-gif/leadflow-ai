import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'
import { getSupabaseServer, hasSupabase } from '@/lib/supabase'

// Cereri „dreptul la ștergere" (art. 17 GDPR).
// POST { email, motiv? } → salvează în Supabase tabela `cereri_stergere`.
// FALLBACK grațios: fără Supabase → răspunde ok (cererea e logată pe server), nu blochează UI-ul.

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!rateLimit(`cereri-stergere:${ip}`, 5, 60_000)) {
      return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 })
    }

    const body = await req.json() as { email?: string; motiv?: string }
    const email = (body.email || '').toString().trim().toLowerCase().slice(0, 200)
    const motiv = (body.motiv || '').toString().trim().slice(0, 2000) || null

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!emailOk) {
      return NextResponse.json({ ok: false, error: 'Email invalid.' }, { status: 400 })
    }

    if (!hasSupabase()) {
      // Fără chei: nu e o eroare — logăm cererea pe server pentru procesare manuală.
      console.log(`[cereri-stergere] (fără Supabase) cerere ștergere: ${email} — motiv: ${motiv || '—'}`)
      return NextResponse.json({ ok: true, persisted: false })
    }

    const sb = getSupabaseServer()
    if (!sb) {
      console.log(`[cereri-stergere] (client indisponibil) cerere ștergere: ${email}`)
      return NextResponse.json({ ok: true, persisted: false })
    }

    const { error } = await sb.from('cereri_stergere').insert({
      email,
      motiv,
      status: 'noua',
      ip: ip.slice(0, 64),
    })
    if (error) {
      console.error('[cereri-stergere] supabase', error.message)
      // Fallback grațios: nu expunem eroarea, dar logăm cererea pentru procesare manuală.
      console.log(`[cereri-stergere] (fallback) cerere ștergere: ${email} — motiv: ${motiv || '—'}`)
      return NextResponse.json({ ok: true, persisted: false })
    }

    return NextResponse.json({ ok: true, persisted: true })
  } catch (e) {
    console.error('[cereri-stergere] POST', e)
    return NextResponse.json({ ok: false, error: 'Eroare internă.' }, { status: 500 })
  }
}
