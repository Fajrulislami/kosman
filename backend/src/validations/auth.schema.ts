import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Kata sandi lama wajib diisi"),
  newPassword: z.string().min(8, "Kata sandi baru minimal 8 karakter"),
  confirmPassword: z.string().min(8, "Konfirmasi kata sandi minimal 8 karakter"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Konfirmasi kata sandi tidak cocok",
  path: ["confirmPassword"],
});

