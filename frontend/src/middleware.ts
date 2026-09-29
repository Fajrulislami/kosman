import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow next internals, static files, and login page
  if (
    pathname === "/login" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Redirect legacy login endpoints to unified /login
  if (pathname === "/admin/login" || pathname === "/portal/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const token = req.cookies.get("kostara_session")?.value;
  let userRole: string | null = null;

  if (token) {
    try {
      // Decode JWT payload (format: header.payload.signature)
      const payloadBase64Url = token.split(".")[1];
      if (payloadBase64Url) {
        const base64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
        const pad = base64.length % 4;
        const paddedBase64 = pad ? base64 + '='.repeat(4 - pad) : base64;
        const decodedPayload = JSON.parse(atob(paddedBase64));
        userRole = decodedPayload.role;
      }
    } catch (error) {
      console.error("Gagal mendecode token di middleware:", error);
    }
  }

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    // Redirect if role is not ADMIN
    if (userRole !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = userRole === "TENANT" ? "/portal" : "/";
      return NextResponse.redirect(url);
    }
  }

  // Protect /portal routes
  if (pathname.startsWith("/portal")) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    // Redirect if role is not TENANT
    if (userRole !== "TENANT") {
      const url = req.nextUrl.clone();
      url.pathname = userRole === "ADMIN" ? "/admin" : "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
