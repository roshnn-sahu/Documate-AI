import { createClient as createSupabaseClient } from "@supabase/supabase-js";


// Service-role client that BYPASSES Row-Level Security.
// SERVER-ONLY — never import this from client ("use client") code.
// Callers MUST scope every write/read by a verified user_id (from getUser()).
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error(
      "Supabase admin is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to valid values."
    );
  }

  return createSupabaseClient(supabaseUrl, serviceKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
