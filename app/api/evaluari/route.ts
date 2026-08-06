import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'
import { getSupabaseServer, hasSupabase } from '@/lib/supabase'
import { emailConfirmareEvaluare, emailDecizieEvaluare } from '@/lib/email'

// Cereri de ACREDITARE și EVALUARE PERIODICĂ (depuse de directori) → decizie ARACIP.
// POST (depunere) · GET (?judet=&tip=) · PATCH (decizie accept/respinge, x-password=ADMIN).

function adminPassword(): string | undefined {
  return process.env.ADMIN_PASSWORD || process.env.ISJ_PASSWORD || process.env.INSPECTOR_PASSWORD
}
function numarInreg(tip: string): string {
  const an = new Date().getFullYear()
  const rnd = Math.floor(1000 + Math.random() * 9000)
  const pre = tip === 'evaluare_periodica' ? 'EVP' : 'ACR'
  return `${pre}-${an}-${rnd}`
}
const TIP_VALID = new Set(['acreditare', 'evaluare_periodica'])

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!rateLimit(`evaluari:${ip}`, 10, 60_000)) return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 })
    const b = await req.json().catch(() => ({})) as Record<string, unknown>
    const denumire = (b.denumire || '').toString().trim().slice(0, 200)
    const tip = TIP_VALID.has((b.tip || '').toString()) ? (b.tip as string) : 'acreditare'
    if (!denumire) return NextResponse.json({ ok: false, error: 'Denumirea unității este obligatorie.' }, { status: 400 })
    const nr = numarInreg(tip)
    const documente = Array.isArray(b.documente) ? b.documente.slice(0, 20) : []
    const email = (b.email || '').toString().trim().slice(0, 160) || null

    // Confirmare pe email (dacă serviciul de email e configurat; altfel no-op grațios).
    if (email) emailConfirmareEvaluare(email, nr, denumire, tip).catch(() => {})

    if (!hasSupabase()) return NextResponse.json({ ok: true, persisted: false, nr_inregistrare: nr })
    const sb = getSupabaseServer()
    if (!sb) return NextResponse.json({ ok: true, persisted: false, nr_inregistrare: nr })
    const { error } = await sb.from('cereri_evaluare').insert({
      nr_inregistrare: nr, tip, denumire,
      cui: (b.cui || '').toString().trim().slice(0, 40) || null,
      judet: (b.judet || '').toString().trim().slice(0, 60) || null,
      nivel: (b.nivel || '').toString().trim().slice(0, 60) || null,
      calificativ: (b.calificativ || '').toString().trim().slice(0, 40) || null,
      email,
      documente,
    })
    if (error) { console.error('[evaluari] insert', error.message); return NextResponse.json({ ok: true, persisted: false, nr_inregistrare: nr }) }
    return NextResponse.json({ ok: true, persisted: true, nr_inregistrare: nr })
  } catch (e) {
    console.error('[evaluari] POST', e)
    return NextResponse.json({ ok: true, persisted: false, nr_inregistrare: numarInreg('acreditare') })
  }
}

export async function GET(req: NextRequest) {
  const empty = { ok: true, persisted: false, total: 0, recent: [] as unknown[] }
  if (!hasSupabase()) return NextResponse.json(empty)
  const sb = getSupabaseServer()
  if (!sb) return NextResponse.json(empty)
  const u = new URL(req.url)
  const judet = u.searchParams.get('judet')?.trim()
  const tip = u.searchParams.get('tip')?.trim()
  try {
    let q = sb.from('cereri_evaluare')
      .select('id, nr_inregistrare, tip, denumire, cui, judet, nivel, calificativ, status, created_at')
      .order('created_at', { ascending: false })
    if (judet) q = q.eq('judet', judet)
    if (tip && TIP_VALID.has(tip)) q = q.eq('tip', tip)
    const { data, error } = await q
    if (error) { console.error('[evaluari] GET', error.message); return NextResponse.json(empty) }
    const rows = data || []
    return NextResponse.json({ ok: true, persisted: true, total: rows.length, recent: rows.slice(0, 30) })
  } catch (e) { console.error('[evaluari] GET', e); return NextResponse.json(empty) }
}

const STATUS_VALIDE = new Set(['depusa', 'in_analiza', 'aprobat', 'respinsa'])
export async function PATCH(req: NextRequest) {
  const pass = req.headers.get('x-password') || ''
  const expected = adminPassword()
  if (!expected || pass !== expected) return NextResponse.json({ ok: false, error: 'Neautorizat.' }, { status: 401 })
  const b = await req.json().catch(() => ({})) as { id?: string; status?: string; motiv?: string }
  const id = (b.id || '').toString(); const status = (b.status || '').toString()
  const motiv = (b.motiv || '').toString().trim().slice(0, 500) || null
  if (!id || !STATUS_VALIDE.has(status)) return NextResponse.json({ ok: false, error: 'Date invalide.' }, { status: 400 })
  if (!hasSupabase()) return NextResponse.json({ ok: true, persisted: false })
  const sb = getSupabaseServer(); if (!sb) return NextResponse.json({ ok: true, persisted: false })
  const esteDecizie = status === 'aprobat' || status === 'respinsa'
  const patch: Record<string, unknown> = { status }
  if (esteDecizie) patch.decizie_at = new Date().toISOString()
  if (motiv) patch.motiv = motiv
  const { data, error } = await sb.from('cereri_evaluare').update(patch).eq('id', id).select('email, denumire, nr_inregistrare, tip').maybeSingle()
  if (error) { console.error('[evaluari] PATCH', error.message); return NextResponse.json({ ok: false, error: error.message }, { status: 500 }) }
  if (esteDecizie && data?.email) {
    emailDecizieEvaluare(data.email as string, (data.nr_inregistrare as string) || '', (data.denumire as string) || 'unitatea dvs.', (data.tip as string) || 'acreditare', status === 'aprobat', motiv).catch(() => {})
  }
  return NextResponse.json({ ok: true, persisted: true })
}
