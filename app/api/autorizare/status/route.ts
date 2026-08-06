import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'
import { getSupabaseServer, hasSupabase } from '@/lib/supabase'

// Verificare publică a stadiului unei cereri de autorizare.
// „Autentificare” ușoară fără cont: numărul de înregistrare + emailul folosit la depunere.
// Nu expune date decât dacă perechea nr+email se potrivește exact.
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!rateLimit(`aut-status:${ip}`, 30, 60_000)) {
    return NextResponse.json({ ok: false, error: 'Prea multe verificări. Reveniți într-un minut.' }, { status: 429 })
  }

  const url = new URL(req.url)
  const nr = (url.searchParams.get('nr') || '').trim().toUpperCase()
  const email = (url.searchParams.get('email') || '').trim().toLowerCase()
  if (!nr || !email) {
    return NextResponse.json({ ok: false, error: 'Introduceți numărul cererii și emailul.' }, { status: 400 })
  }

  if (!hasSupabase()) return NextResponse.json({ ok: false, error: 'Serviciu indisponibil.' }, { status: 503 })
  const sb = getSupabaseServer()
  if (!sb) return NextResponse.json({ ok: false, error: 'Serviciu indisponibil.' }, { status: 503 })

  try {
    const { data, error } = await sb
      .from('cereri_autorizare')
      .select('nr_inregistrare, denumire, cui, judet, nivel, email, status, motiv, decizie_at, created_at')
      .eq('nr_inregistrare', nr)
      .limit(1)
      .maybeSingle()

    if (error) { console.error('[autorizare/status]', error.message); return NextResponse.json({ ok: false, error: 'Eroare la interogare.' }, { status: 500 }) }
    // Nu confirmăm existența cererii dacă emailul nu se potrivește (anti-enumerare).
    if (!data || (data.email || '').toLowerCase() !== email) {
      return NextResponse.json({ ok: false, error: 'Nu am găsit nicio cerere cu acest număr și email. Verificați datele.' }, { status: 404 })
    }

    return NextResponse.json({
      ok: true,
      cerere: {
        nr_inregistrare: data.nr_inregistrare,
        denumire: data.denumire,
        cui: data.cui,
        judet: data.judet,
        nivel: data.nivel,
        status: data.status,
        motiv: data.motiv,
        decizie_at: data.decizie_at,
        created_at: data.created_at,
      },
    })
  } catch (e) {
    console.error('[autorizare/status] GET', e)
    return NextResponse.json({ ok: false, error: 'Eroare internă.' }, { status: 500 })
  }
}
