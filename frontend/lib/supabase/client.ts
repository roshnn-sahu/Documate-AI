import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client. Safe to use in "use client" components.
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to valid values."
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
