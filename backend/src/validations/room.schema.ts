import { z } from "zod";

export const createRoomSchema = z.object({
  roomNumber: z.string().min(1, "Nomor kamar wajib diisi"),
  floor: z.number().int().min(1).default(1),
  roomTypeId: z.string().min(1, "Tipe kamar wajib dipilih"),
  notes: z.string().optional(),
});

export const updateRoomSchema = z.object({
  roomNumber: z.string().min(1).optional(),
  floor: z.number().int().min(1).optional(),
  roomTypeId: z.string().min(1).optional(),
  status: z.enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE", "RESERVED"]).optional(),
  notes: z.string().optional().nullable(),
});
