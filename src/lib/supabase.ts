import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let adminClient: SupabaseClient | null = null

/**
 * Server-only Supabase client (service role). Lazily created so missing env fails at upload time with a clear error.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (adminClient) return adminClient

  const url = process.env.cran_SUPABASE_URL?.trim()
  const key = process.env.cran_SUPABASE_SERVICE_ROLE_KEY?.trim()

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured: set cran_SUPABASE_URL and cran_SUPABASE_SERVICE_ROLE_KEY (e.g. in .env.local or Vercel env)."
    )
  }

  adminClient = createClient(url, key)
  return adminClient
}
