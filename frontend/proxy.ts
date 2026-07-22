import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refreshes the Supabase auth session on every request and (once auth pages
// exist) redirects unauthenticated users away from protected routes.
//
// NOTE: Next.js 16+ deprecated the "middleware.ts" convention in favour of
// "proxy.ts".  The exported function must be named "proxy".
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Until Supabase is configured, skip auth entirely so the app still runs.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: use getUser() (revalidates JWT), never getSession(), for authz.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Route gating — active now that /login and /signup exist.
  const { pathname } = request.nextUrl;
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/signup");
  // Public marketing landing page stays accessible without login.
  const isPublic = pathname === "/";

  if (!user && !isAuthPage && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/chat/new";
    return NextResponse.redirect(url);
  }

  // Must return the same response whose cookies were mutated above.
  return response;
}

export const config = {
  matcher: [
    // Everything except Next internals, static assets, and the auth callback.
    "/((?!_next/static|_next/image|favicon.ico|auth|api/auth|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)",
  ],
};
