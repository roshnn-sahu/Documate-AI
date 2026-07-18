import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client that BYPASSES Row-Level Security.
// SERVER-ONLY — never import this from client ("use client") code.
// Callers MUST scope every write/read by a verified user_id (from getUser()).
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
