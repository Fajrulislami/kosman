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
