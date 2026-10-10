import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "../lib/prisma";
import { signToken } from "../lib/jwt";
import { AuthenticatedRequest } from "../middlewares/auth";
import { loginSchema } from "../validations/auth.schema";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const login = async (req: Request, res: Response): Promise<void> => {
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
};

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(400).json({ error: "Token Google tidak ditemukan" });
      return;
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      res.status(400).json({ error: "Gagal memverifikasi token Google" });
      return;
    }

    const email = payload.email;
    const user = await prisma.user.findUnique({
      where: { email },
      include: { tenant: true },
    });

    if (!user) {
      res.status(401).json({ error: "Email belum terdaftar. Hubungi Admin Kos." });
      return;
    }

    const jwtToken = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenant?.id,
    });

    res.cookie("kostara_session", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login dengan Google berhasil",
      token: jwtToken,
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
    console.error("Google login error:", error);
    res.status(500).json({ error: "Terjadi kesalahan internal saat verifikasi Google" });
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie("kostara_session");
  res.json({ success: true, message: "Logout berhasil" });
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
};
