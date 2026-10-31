import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../lib/jwt";

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export function extractToken(req: Request): string | undefined {
  let token: string | undefined;

  // 1. Ambil dari header Authorization: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 2. Fallback: ambil dari header Cookie kostara_admin_session, kostara_tenant_session, atau kostara_session jika ada
  if (!token && req.headers.cookie) {
    const cookies = req.headers.cookie.split(";").reduce((acc, cookieStr) => {
      const idx = cookieStr.indexOf("=");
      if (idx !== -1) {
        const key = cookieStr.substring(0, idx).trim();
        const val = cookieStr.substring(idx + 1).trim();
        acc[key] = val;
      }
      return acc;
    }, {} as Record<string, string>);

    const url = req.originalUrl || req.url || "";
    const referer = (req.headers.referer as string) || "";
    const xRole = (req.headers["x-role"] as string) || (req.query.role as string) || "";

    const isTenantContext = xRole === "tenant" || url.includes("/portal") || referer.includes("/portal");
    const isAdminContext = xRole === "admin" || url.includes("/admin") || referer.includes("/admin");

    if (isTenantContext) {
      token = cookies["kostara_tenant_session"] || cookies["kostara_session"];
    } else if (isAdminContext) {
      token = cookies["kostara_admin_session"] || cookies["kostara_session"];
    } else {
      token = cookies["kostara_session"] || cookies["kostara_tenant_session"] || cookies["kostara_admin_session"];
    }
  }

  return token;
}

export function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      req.user = payload;
    }
  }
  next();
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = extractToken(req);

  if (!token) {
    res.status(401).json({ error: "Sesi tidak ditemukan atau belum login" });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: "Token sesi tidak valid atau telah kedaluwarsa" });
    return;
  }

  req.user = payload;
  next();
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  authMiddleware(req, res, () => {
    if (req.user?.role !== "ADMIN") {
      res.status(403).json({ error: "Akses ditolak: Hanya administrator yang diizinkan" });
      return;
    }
    next();
  });
}

export function requireTenant(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  authMiddleware(req, res, () => {
    if (req.user?.role !== "TENANT") {
      res.status(403).json({ error: "Akses ditolak: Hanya penghuni yang diizinkan" });
      return;
    }
    next();
  });
}
