import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from "@/config/config";

// Service-role client that BYPASSES Row-Level Security.
// SERVER-ONLY — never import this from client ("use client") code.
// Callers MUST scope every write/read by a verified user_id (from getUser()).
export function createAdminClient() {
  const supabaseUrl = SUPABASE_URL;
  const serviceKey = SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error(
      "Supabase admin is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to valid values.",
    );
  }

  return createSupabaseClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
