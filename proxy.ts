import { NextResponse, type NextRequest } from "next/server";

/**
 * Next 16 renamed `middleware` to `proxy`. The runtime is Node and cannot be
 * configured to edge.
 *
 * THIS IS NOT THE SECURITY BOUNDARY. It only checks that a session cookie is
 * present, so an unauthenticated visit lands on the login page instead of
 * flashing admin chrome. It does not verify the signature, because the real
 * check belongs next to the data.
 *
 * `requireOperator()` in src/lib/auth.ts verifies the token and runs on every
 * admin page and every admin Server Action. Deleting this file would cost UX,
 * not safety.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  if (!request.cookies.has("fma_session")) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
