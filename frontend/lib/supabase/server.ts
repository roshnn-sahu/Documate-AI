import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";


// Request-scoped Supabase client bound to the caller's cookies.
// Next 16: cookies() is async — must be awaited.
export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey ) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to valid values."
    );
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — cookie writes are handled by
            // the proxy session refresh instead. Safe to ignore.
          }
        },
      },
    },
  );
}
