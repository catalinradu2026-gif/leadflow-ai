import { NextResponse } from 'next/server'
import { hasSupabase, getSupabaseServer } from '@/lib/supabase'

// Endpoint de sănătate pentru monitorizare uptime (ex. UptimeRobot, Better Uptime).
// Verifică aplicația și conexiunea la baza de date. Răspuns rapid, fără date personale.
export const dynamic = 'force-dynamic'

export async function GET() {
  const t0 = Date.now()
  let db: 'ok' | 'down' | 'neconfigurat' = 'neconfigurat'

  if (hasSupabase()) {
    try {
      const sb = getSupabaseServer()
      if (sb) {
        const { error } = await sb.from('formare_progress').select('id', { head: true, count: 'exact' }).limit(1)
        db = error ? 'down' : 'ok'
      }
    } catch {
      db = 'down'
    }
  }

  const status = db === 'down' ? 'degraded' : 'ok'
  return NextResponse.json(
    { status, time: new Date().toISOString(), db, latencyMs: Date.now() - t0 },
    { status: status === 'ok' ? 200 : 503 }
  )
}
