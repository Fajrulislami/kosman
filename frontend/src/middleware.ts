import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow next internals and static files
  if (
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

  const decodeTokenRole = (tok?: string): string | null => {
    if (!tok) return null;
    try {
      const payloadBase64Url = tok.split(".")[1];
      if (!payloadBase64Url) return null;
      const base64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");
      const pad = base64.length % 4;
      const paddedBase64 = pad ? base64 + "=".repeat(4 - pad) : base64;
      const decodedPayload = JSON.parse(atob(paddedBase64));

      // Jika token memiliki tanggal kedaluwarsa dan sudah lewat, anggap tidak valid
      if (decodedPayload.exp && decodedPayload.exp * 1000 < Date.now()) {
        return null;
      }

      return decodedPayload.role || null;
    } catch {
      return null;
    }
  };

  const adminCookie = req.cookies.get("kostara_admin_session")?.value;
  const tenantCookie = req.cookies.get("kostara_tenant_session")?.value;
  const legacyCookie = req.cookies.get("kostara_session")?.value;

  const adminRole = decodeTokenRole(adminCookie) || (decodeTokenRole(legacyCookie) === "ADMIN" ? "ADMIN" : null);
  const tenantRole = decodeTokenRole(tenantCookie) || (decodeTokenRole(legacyCookie) === "TENANT" ? "TENANT" : null);

  // Auto-redirect jika pengguna SUDAH memiliki sesi aktif saat membuka /login
  if (pathname === "/login") {
    const redirectParam = req.nextUrl.searchParams.get("redirect");

    if (adminRole === "ADMIN") {
      const url = req.nextUrl.clone();
      if (redirectParam && redirectParam.startsWith("/admin")) {
        url.pathname = redirectParam;
        url.searchParams.delete("redirect");
      } else {
        url.pathname = "/admin";
      }
      return NextResponse.redirect(url);
    }

    if (tenantRole === "TENANT") {
      const url = req.nextUrl.clone();
      if (redirectParam && redirectParam.startsWith("/portal")) {
        url.pathname = redirectParam;
        url.searchParams.delete("redirect");
      } else {
        url.pathname = "/portal/dashboard";
      }
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    if (adminRole === "ADMIN") {
      return NextResponse.next();
    }
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Protect /portal routes
  if (pathname.startsWith("/portal")) {
    if (tenantRole === "TENANT") {
      return NextResponse.next();
    }
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
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
