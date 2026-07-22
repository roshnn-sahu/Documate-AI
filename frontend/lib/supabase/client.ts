import { createBrowserClient } from "@supabase/ssr";
import {SUPABASE_URL, SUPABASE_ANON_KEY} from "@/config/config"
// Browser-side Supabase client. Safe to use in "use client" components.
export function createClient() {
  const supabaseUrl = SUPABASE_URL;
  const supabaseKey = SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to valid values."
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
