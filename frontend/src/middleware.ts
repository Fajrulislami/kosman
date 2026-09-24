import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/portal/login") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("kostara_session")?.value;

  if (pathname.startsWith("/admin") && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/portal") && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/portal/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};
