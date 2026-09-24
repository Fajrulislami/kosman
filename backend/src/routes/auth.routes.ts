import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { signToken } from "../lib/jwt";
import { authMiddleware, AuthenticatedRequest } from "../middlewares/auth";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

// POST /api/auth/login
authRouter.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validasi gagal", details: parsed.error.flatten().fieldErrors });
      return;
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { tenant: true },
    });

    if (!user) {
      res.status(401).json({ error: "Email atau password salah" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: "Email atau password salah" });
      return;
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenant?.id,
    });

    // Set cookie untuk Next.js proxy/client
    res.cookie("kostara_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    });

    res.json({
      success: true,
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        tenantId: user.tenant?.id,
      },
    });
  } catch (error) {
    console.error("Login route error:", error);
    res.status(500).json({ error: "Terjadi kesalahan internal pada server" });
  }
});

// POST /api/auth/logout
authRouter.post("/logout", (_req: Request, res: Response): void => {
  res.clearCookie("kostara_session");
  res.json({ success: true, message: "Logout berhasil" });
});

// GET /api/auth/me
authRouter.get("/me", authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        tenant: {
          include: {
            leases: {
              where: { status: "ACTIVE" },
              include: { room: { include: { roomType: true } } },
            },
          },
        },
      },
    });

    if (!user) {
      res.status(401).json({ authenticated: false });
      return;
    }

    res.json({ authenticated: true, user });
  } catch (error) {
    console.error("Auth me error:", error);
    res.status(500).json({ error: "Gagal mengambil data profil sesi" });
  }
});
