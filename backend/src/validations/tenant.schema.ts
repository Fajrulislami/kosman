import { z } from "zod";

export const registerTenantSchema = z.object({
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  nik: z.string().min(16, "NIK harus 16 digit").max(16, "NIK harus 16 digit"),
  phone: z.string().min(10, "Nomor HP minimal 10 digit"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6).optional(),
  roomId: z.string().min(1, "Kamar wajib dipilih"),
  startDate: z.string(),
  endDate: z.string(),
  depositAmount: z.number().nonnegative().default(0),
  emergencyName: z.string().optional(),
  emergencyPhone: z.string().optional(),
  emergencyRelation: z.string().optional(),
  occupation: z.string().optional(),
});

export const updateTenantSchema = z.object({
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter").optional(),
  phone: z.string().min(10, "Nomor HP minimal 10 digit").optional(),
  nik: z.string().min(16, "NIK harus 16 digit").max(16).optional(),
  occupation: z.string().optional(),
  emergencyName: z.string().optional(),
  emergencyPhone: z.string().optional(),
  emergencyRelation: z.string().optional(),
});

export const extendLeaseSchema = z.object({
  endDate: z.string().min(1, "Tanggal berakhir wajib diisi"),
});

export const moveRoomSchema = z.object({
  newRoomId: z.string().min(1, "Kamar baru wajib dipilih"),
});
