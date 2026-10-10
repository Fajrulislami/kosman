import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z.string().min(8, "Nomor WhatsApp tidak valid"),
  roomTypeId: z.string().optional(),
  slug: z.string().optional(),
  checkInDate: z.string().optional(),
  notes: z.string().optional(),
});
