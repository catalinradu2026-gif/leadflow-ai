import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'
import { getSupabaseServer, hasSupabase } from '@/lib/supabase'
import { emailConfirmareDepunere, emailDecizie } from '@/lib/email'

function adminPassword(): string | undefined {
  return process.env.ADMIN_PASSWORD || process.env.ISJ_PASSWORD || process.env.INSPECTOR_PASSWORD
}

// Cereri de autorizare de funcționare provizorie (fondatori de unități noi).
// POST → salvează dosarul + generează număr de înregistrare. GET (?judet=) → listă pt dashboard.
// FALLBACK grațios: fără Supabase → răspunde ok cu număr generat, fără a persista.

function numarInregistrare(): string {
  const an = new Date().getFullYear()
  const rnd = Math.floor(1000 + Math.random() * 9000)
  return `AUT-${an}-${rnd}`
}

const toInt = (v: unknown) => {
  const n = Number(v)
  return Number.isFinite(n) ? Math.max(0, Math.round(n)) : null
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!rateLimit(`autorizare:${ip}`, 10, 60_000)) {
      return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 })
    }
    const b = await req.json().catch(() => ({})) as Record<string, unknown>
    const denumire = (b.denumire || '').toString().trim().slice(0, 200)
    if (!denumire) return NextResponse.json({ ok: false, error: 'Denumirea unității este obligatorie.' }, { status: 400 })

    const nr = numarInregistrare()
    const documente = Array.isArray(b.documente) ? b.documente.slice(0, 20) : []
    const email = (b.email || '').toString().trim().slice(0, 160) || null

    // Confirmare pe email (dacă serviciul de email e configurat; altfel no-op grațios).
    if (email) emailConfirmareDepunere(email, nr, denumire).catch(() => {})

    if (!hasSupabase()) return NextResponse.json({ ok: true, persisted: false, nr_inregistrare: nr })
    const sb = getSupabaseServer()
    if (!sb) return NextResponse.json({ ok: true, persisted: false, nr_inregistrare: nr })

    const { error } = await sb.from('cereri_autorizare').insert({
      nr_inregistrare: nr,
      denumire,
      tip_solicitant: (b.tip_solicitant || '').toString() === 'existenta' ? 'existenta' : 'noua',
      cui: (b.cui || '').toString().trim().slice(0, 40) || null,
      judet: (b.judet || '').toString().trim().slice(0, 60) || null,
      adresa: (b.adresa || '').toString().trim().slice(0, 300) || null,
      reprezentant: (b.reprezentant || '').toString().trim().slice(0, 160) || null,
      nivel: (b.nivel || '').toString().trim().slice(0, 60) || null,
      profil: (b.profil || '').toString().trim().slice(0, 120) || null,
      capacitate: toInt(b.capacitate),
      sali: toInt(b.sali),
      suprafata: toInt(b.suprafata),
      email,
      telefon: (b.telefon || '').toString().trim().slice(0, 40) || null,
      documente,
    })
    if (error) {
      console.error('[autorizare] insert', error.message)
      return NextResponse.json({ ok: true, persisted: false, nr_inregistrare: nr })
    }
    return NextResponse.json({ ok: true, persisted: true, nr_inregistrare: nr })
  } catch (e) {
    console.error('[autorizare] POST', e)
    return NextResponse.json({ ok: true, persisted: false, nr_inregistrare: numarInregistrare() })
  }
}

export async function GET(req: NextRequest) {
  const empty = { ok: true, persisted: false, total: 0, pe_judet: {} as Record<string, number>, recent: [] as unknown[] }
  if (!hasSupabase()) return NextResponse.json(empty)
  const sb = getSupabaseServer()
  if (!sb) return NextResponse.json(empty)
  const judetFiltru = new URL(req.url).searchParams.get('judet')?.trim()
  try {
    let q = sb
      .from('cereri_autorizare')
      .select('id, nr_inregistrare, denumire, cui, judet, nivel, capacitate, status, documente, created_at')
      .order('created_at', { ascending: false })
    if (judetFiltru) q = q.eq('judet', judetFiltru)
    const { data, error } = await q
    if (error) { console.error('[autorizare] GET', error.message); return NextResponse.json(empty) }
    const rows = data || []
    const pe_judet: Record<string, number> = {}
    for (const r of rows) { const j = (r.judet as string) || 'Nespecificat'; pe_judet[j] = (pe_judet[j] || 0) + 1 }
    return NextResponse.json({ ok: true, persisted: true, total: rows.length, pe_judet, recent: rows.slice(0, 30) })
  } catch (e) {
    console.error('[autorizare] GET', e)
    return NextResponse.json(empty)
  }
}

// PATCH { id, status } — decizia ARACIP (accept/respinge). Protejat cu parola ARACIP (x-password).
const STATUS_VALIDE = new Set(['depusa', 'in_analiza', 'autorizat', 'respinsa'])
export async function PATCH(req: NextRequest) {
  const pass = req.headers.get('x-password') || ''
  const expected = adminPassword()
  if (!expected || pass !== expected) {
    return NextResponse.json({ ok: false, error: 'Neautorizat.' }, { status: 401 })
  }
  const b = await req.json().catch(() => ({})) as { id?: string; status?: string; motiv?: string }
  const id = (b.id || '').toString()
  const status = (b.status || '').toString()
  const motiv = (b.motiv || '').toString().trim().slice(0, 500) || null
  if (!id || !STATUS_VALIDE.has(status)) {
    return NextResponse.json({ ok: false, error: 'Date invalide.' }, { status: 400 })
  }
  if (!hasSupabase()) return NextResponse.json({ ok: true, persisted: false })
  const sb = getSupabaseServer()
  if (!sb) return NextResponse.json({ ok: true, persisted: false })
  const patch: Record<string, unknown> = { status }
  const esteDecizie = status === 'autorizat' || status === 'respinsa'
  if (esteDecizie) patch.decizie_at = new Date().toISOString()
  if (motiv) patch.motiv = motiv
  const { data, error } = await sb.from('cereri_autorizare').update(patch).eq('id', id).select('email, denumire, nr_inregistrare').maybeSingle()
  if (error) {
    console.error('[autorizare] PATCH', error.message)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
  // Notificare pe email la decizie (dacă e configurat serviciul; altfel no-op grațios).
  if (esteDecizie && data?.email) {
    emailDecizie(data.email as string, (data.nr_inregistrare as string) || '', (data.denumire as string) || 'unitatea dvs.', status === 'autorizat', motiv).catch(() => {})
  }
  return NextResponse.json({ ok: true, persisted: true })
}
