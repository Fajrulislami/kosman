import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "../lib/prisma";
import { signToken } from "../lib/jwt";
import { AuthenticatedRequest } from "../middlewares/auth";
import { loginSchema, updateProfileSchema, changePasswordSchema } from "../validations/auth.schema";

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

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    };

    // Set cookie spesifik role agar sesi admin & tenant tidak bentrok
    if (user.role === "ADMIN") {
      res.cookie("kostara_admin_session", token, cookieOptions);
    } else {
      res.cookie("kostara_tenant_session", token, cookieOptions);
    }
    res.cookie("kostara_session", token, cookieOptions);

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

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    if (user.role === "ADMIN") {
      res.cookie("kostara_admin_session", jwtToken, cookieOptions);
    } else {
      res.cookie("kostara_tenant_session", jwtToken, cookieOptions);
    }
    res.cookie("kostara_session", jwtToken, cookieOptions);

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

export const logout = (req: Request, res: Response): void => {
  const role = req.query.role as string;
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };

  if (role === "admin") {
    res.clearCookie("kostara_admin_session", cookieOptions);
  } else if (role === "tenant") {
    res.clearCookie("kostara_tenant_session", cookieOptions);
  } else {
    res.clearCookie("kostara_admin_session", cookieOptions);
    res.clearCookie("kostara_tenant_session", cookieOptions);
  }
  res.clearCookie("kostara_session", cookieOptions);
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
              orderBy: [{ status: "asc" }, { endDate: "desc" }],
              take: 5,
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

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validasi gagal", details: parsed.error.flatten().fieldErrors });
      return;
    }

    const { name, email } = parsed.data;
    const userId = req.user!.userId;

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: userId },
      },
    });

    if (existingUser) {
      res.status(409).json({ error: "Email sudah digunakan oleh akun lain" });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
      },
    });

    const jwtToken = signToken({
      userId: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      tenantId: req.user!.tenantId,
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    if (updatedUser.role === "ADMIN") {
      res.cookie("kostara_admin_session", jwtToken, cookieOptions);
    } else {
      res.cookie("kostara_tenant_session", jwtToken, cookieOptions);
    }
    res.cookie("kostara_session", jwtToken, cookieOptions);

    res.json({
      success: true,
      message: "Profil berhasil diperbarui",
      token: jwtToken,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Gagal memperbarui profil pengguna" });
  }
};

export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validasi gagal", details: parsed.error.flatten().fieldErrors });
      return;
    }

    const { currentPassword, newPassword } = parsed.data;
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ error: "Kata sandi lama yang Anda masukkan tidak sesuai" });
      return;
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    res.json({
      success: true,
      message: "Kata sandi berhasil diubah",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Gagal mengubah kata sandi" });
  }
};

