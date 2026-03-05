import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.cran_SUPABASE_URL!
const supabaseServiceKey = process.env.cran_SUPABASE_SERVICE_ROLE_KEY!

// Use the service role key to bypass RLS and manage storage buckets from the server
export const supabase = createClient(supabaseUrl, supabaseServiceKey)
