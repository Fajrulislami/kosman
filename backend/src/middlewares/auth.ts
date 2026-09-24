import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../lib/jwt";

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  let token: string | undefined;

  // 1. Ambil dari header Authorization: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 2. Fallback: ambil dari header Cookie kostara_session jika ada
  if (!token && req.headers.cookie) {
    const cookies = req.headers.cookie.split(";").reduce((acc, cookieStr) => {
      const [key, val] = cookieStr.trim().split("=");
      acc[key] = val;
      return acc;
    }, {} as Record<string, string>);
    token = cookies["kostara_session"];
  }

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
