import { z } from "zod";

export const createComplaintSchema = z.object({
  category: z.string().min(1),
  title: z.string().min(3, "Judul keluhan minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi keluhan minimal 10 karakter"),
  images: z.array(z.string()).default([]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
});

export const updateComplaintSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"]),
  resolutionNote: z.string().optional(),
});
