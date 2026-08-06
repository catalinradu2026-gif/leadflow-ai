import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Configurare Supabase cu FALLBACK grațios.
// Cheile pot lipsi (proiectul funcționează pe localStorage). Când sunt prezente,
// datele se persistă în Postgres (EU / GDPR) și sunt citibile între dispozitive.

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

/** true dacă avem minimul necesar (URL + service role key) pentru scriere server-side. */
export function hasSupabase(): boolean {
  return !!(SUPABASE_URL && (SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY))
}

let _server: SupabaseClient | null = null

/**
 * Client server-side (folosește service role key dacă există, altfel anon key).
 * Returnează null dacă lipsesc cheile — apelantul trebuie să facă fallback.
 */
export function getSupabaseServer(): SupabaseClient | null {
  if (!SUPABASE_URL) return null
  const key = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY
  if (!key) return null
  if (_server) return _server
  _server = createClient(SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return _server
}
