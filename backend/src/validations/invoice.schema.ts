import { z } from "zod";

export const paySchema = z.object({
  proofImageUrl: z.string().min(1, "Bukti transfer wajib disertakan"),
  method: z.enum(["MANUAL_TRANSFER", "CASH", "MIDTRANS_VA", "QRIS"]).default("MANUAL_TRANSFER"),
});

export const verifySchema = z.object({
  action: z.enum(["APPROVE", "REJECT"]),
  rejectReason: z.string().optional(),
});

export const createInvoiceSchema = z.object({
  leaseId: z.string().min(1, "Kontrak sewa wajib dipilih"),
  amount: z.number().positive("Nominal harus lebih dari 0"),
  dueDate: z.string(),
  periodMonth: z.number().int().min(1).max(12),
  periodYear: z.number().int().min(2024),
});
