import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middlewares/auth";

export const roomRouter = Router();

const createRoomSchema = z.object({
  roomNumber: z.string().min(1, "Nomor kamar wajib diisi"),
  floor: z.number().int().min(1).default(1),
  roomTypeId: z.string().min(1, "Tipe kamar wajib dipilih"),
  notes: z.string().optional(),
});

const updateRoomSchema = z.object({
  roomNumber: z.string().min(1).optional(),
  floor: z.number().int().min(1).optional(),
  roomTypeId: z.string().min(1).optional(),
  status: z.enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE", "RESERVED"]).optional(),
  notes: z.string().optional().nullable(),
});

// GET /api/public/rooms (Untuk Landing Page)
roomRouter.get("/public/rooms", async (_req: Request, res: Response): Promise<void> => {
  try {
    const roomTypes = await prisma.roomType.findMany({
      include: {
        rooms: {
          select: { id: true, roomNumber: true, status: true },
        },
      },
      orderBy: { basePrice: "asc" },
    });

    const formatted = roomTypes.map((rt) => {
      const totalUnits = rt.rooms.length;
      const availableUnits = rt.rooms.filter((r) => r.status === "AVAILABLE").length;

      return {
        id: rt.id,
        slug: rt.slug,
        name: rt.name,
        price: rt.basePrice,
        deposit: rt.depositPrice,
        size: rt.size,
        description: rt.description,
        facilities: JSON.parse(rt.facilities || "[]"),
        images: JSON.parse(rt.images || "[]"),
        totalUnits,
        availableUnits,
        isAvailable: availableUnits > 0,
      };
    });

    res.json({ data: formatted });
  } catch (error) {
    console.error("Public rooms error:", error);
    res.status(500).json({ error: "Gagal memuat katalog kamar publik" });
  }
});

// GET /api/public/rooms/:slug (Detail Kamar Publik)
roomRouter.get("/public/rooms/:slug", async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const roomType = await prisma.roomType.findUnique({
      where: { slug },
      include: {
        rooms: {
          select: { id: true, roomNumber: true, status: true, floor: true },
        },
      },
    });

    if (!roomType) {
      res.status(404).json({ error: "Tipe kamar tidak ditemukan" });
      return;
    }

    const totalUnits = roomType.rooms.length;
    const availableUnits = roomType.rooms.filter((r) => r.status === "AVAILABLE").length;

    res.json({
      data: {
        id: roomType.id,
        slug: roomType.slug,
        name: roomType.name,
        price: roomType.basePrice,
        deposit: roomType.depositPrice,
        size: roomType.size,
        description: roomType.description,
        facilities: JSON.parse(roomType.facilities || "[]"),
        images: JSON.parse(roomType.images || "[]"),
        totalUnits,
        availableUnits,
        isAvailable: availableUnits > 0,
        status: availableUnits > 0 ? "AVAILABLE" : "FULL",
        availableRoomNumbers: roomType.rooms.filter((r) => r.status === "AVAILABLE").map((r) => r.roomNumber),
        rules: [
          "Dilarang membawa tamu lawan jenis menginap tanpa izin pengelola",
          "Menjaga ketenangan, keamanan, dan kebersihan lingkungan kos bersama",
          "Pembayaran sewa tepat waktu setiap awal periode",
          "Dilarang membawa barang berbahaya atau terlarang",
        ],
      },
    });
  } catch (error) {
    console.error("Public room detail error:", error);
    res.status(500).json({ error: "Gagal memuat detail kamar" });
  }
});

const inquirySchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z.string().min(8, "Nomor WhatsApp tidak valid"),
  roomTypeId: z.string().optional(),
  slug: z.string().optional(),
  checkInDate: z.string().optional(),
  notes: z.string().optional(),
});

// POST /api/public/inquiries (Formulir Pemesanan / Tanya Kamar)
roomRouter.post("/public/inquiries", async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = inquirySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validasi gagal", details: parsed.error.flatten().fieldErrors });
      return;
    }

    let roomTypeId = parsed.data.roomTypeId;
    let roomTypeName = "Kamar";

    if (!roomTypeId && parsed.data.slug) {
      const foundType = await prisma.roomType.findUnique({ where: { slug: parsed.data.slug } });
      if (foundType) {
        roomTypeId = foundType.id;
        roomTypeName = foundType.name;
      }
    } else if (roomTypeId) {
      const foundType = await prisma.roomType.findUnique({ where: { id: roomTypeId } });
      if (foundType) {
        roomTypeName = foundType.name;
      }
    }

    const checkIn = parsed.data.checkInDate ? new Date(parsed.data.checkInDate) : null;

    const inquiry = await prisma.bookingInquiry.create({
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone,
        roomTypeId: roomTypeId || null,
        checkInDate: checkIn,
        notes: parsed.data.notes || null,
        status: "NEW",
      },
    });

    // Generate WhatsApp text for direct chat with Kos Owner
    const adminPhone = "6281234567890";
    const waText = encodeURIComponent(
      `Halo Pengelola Kostara, saya ${parsed.data.name} (${parsed.data.phone}) ingin menanyakan ketersediaan/reservasi untuk ${roomTypeName}.\n` +
      (checkIn ? `Rencana masuk: ${checkIn.toLocaleDateString("id-ID")}\n` : "") +
      (parsed.data.notes ? `Catatan: ${parsed.data.notes}` : "")
    );
    const whatsappUrl = `https://wa.me/${adminPhone}?text=${waText}`;

    res.status(201).json({
      success: true,
      message: "Permintaan pemesanan berhasil dicatat",
      data: inquiry,
      whatsappUrl,
    });
  } catch (error) {
    console.error("Booking inquiry error:", error);
    res.status(500).json({ error: "Gagal memproses pemesanan kamar" });
  }
});

// GET /api/admin/rooms (Manajemen Kamar)
roomRouter.get("/admin/rooms", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, roomTypeId } = req.query;

    const where: Record<string, unknown> = {};
    if (status && typeof status === "string") where.status = status;
    if (roomTypeId && typeof roomTypeId === "string") where.roomTypeId = roomTypeId;

    const rooms = await prisma.room.findMany({
      where,
      include: {
        roomType: true,
        leases: {
          where: { status: "ACTIVE" },
          include: { tenant: true },
          take: 1,
        },
      },
      orderBy: { roomNumber: "asc" },
    });

    const formatted = rooms.map((room) => {
      const activeLease = room.leases[0];
      return {
        id: room.id,
        number: room.roomNumber,
        floor: room.floor,
        type: room.roomType.name,
        roomTypeId: room.roomTypeId,
        price: `Rp ${room.roomType.basePrice.toLocaleString("id-ID")}`,
        rawPrice: room.roomType.basePrice,
        status:
          room.status === "OCCUPIED"
            ? "Terisi"
            : room.status === "AVAILABLE"
            ? "Kosong"
            : room.status === "MAINTENANCE"
            ? "Perbaikan"
            : "Dipesan",
        rawStatus: room.status,
        tenant: activeLease ? activeLease.tenant.fullName : "-",
        tenantId: activeLease?.tenantId ?? null,
        notes: room.notes,
      };
    });

    const totalRooms = await prisma.room.count();
    const occupiedCount = await prisma.room.count({ where: { status: "OCCUPIED" } });
    const availableCount = await prisma.room.count({ where: { status: "AVAILABLE" } });
    const maintenanceCount = await prisma.room.count({ where: { status: "MAINTENANCE" } });

    res.json({
      data: formatted,
      stats: {
        total: totalRooms,
        occupied: occupiedCount,
        available: availableCount,
        maintenance: maintenanceCount,
        occupancyRate: totalRooms > 0 ? Math.round((occupiedCount / totalRooms) * 100) : 0,
      },
    });
  } catch (error) {
    console.error("Admin rooms error:", error);
    res.status(500).json({ error: "Gagal memuat data unit kamar" });
  }
});

// POST /api/admin/rooms
roomRouter.post("/admin/rooms", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = createRoomSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validasi gagal", details: parsed.error.flatten().fieldErrors });
      return;
    }

    const { roomNumber, floor, roomTypeId, notes } = parsed.data;

    const existing = await prisma.room.findUnique({ where: { roomNumber } });
    if (existing) {
      res.status(409).json({ error: `Kamar nomor ${roomNumber} sudah terdaftar` });
      return;
    }

    const newRoom = await prisma.room.create({
      data: { roomNumber, floor, roomTypeId, notes, status: "AVAILABLE" },
      include: { roomType: true },
    });

    res.status(201).json({ success: true, message: "Kamar baru berhasil ditambahkan", data: newRoom });
  } catch (error) {
    console.error("Create room error:", error);
    res.status(500).json({ error: "Gagal menambahkan kamar baru" });
  }
});

// PUT /api/admin/rooms/:id
roomRouter.put("/admin/rooms/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const parsed = updateRoomSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validasi gagal", details: parsed.error.flatten().fieldErrors });
      return;
    }

    const updated = await prisma.room.update({
      where: { id },
      data: parsed.data,
      include: { roomType: true },
    });

    res.json({ success: true, message: "Kamar berhasil diperbarui", data: updated });
  } catch (error) {
    console.error("Update room error:", error);
    res.status(500).json({ error: "Gagal memperbarui kamar" });
  }
});

// DELETE /api/admin/rooms/:id
roomRouter.delete("/admin/rooms/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const room = await prisma.room.findUnique({
      where: { id },
      include: { leases: { where: { status: "ACTIVE" } } },
    });

    if (!room) {
      res.status(404).json({ error: "Kamar tidak ditemukan" });
      return;
    }

    if (room.leases.length > 0 || room.status === "OCCUPIED") {
      res.status(400).json({ error: "Kamar tidak dapat dihapus karena masih berpenghuni aktif" });
      return;
    }

    await prisma.room.delete({ where: { id } });
    res.json({ success: true, message: `Kamar ${room.roomNumber} berhasil dihapus` });
  } catch (error) {
    console.error("Delete room error:", error);
    res.status(500).json({ error: "Gagal menghapus kamar" });
  }
});

// GET /api/admin/inquiries (Daftar Calon Penyewa / Booking Baru)
roomRouter.get("/admin/inquiries", requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  try {
    const inquiries = await prisma.bookingInquiry.findMany({
      include: { roomType: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: inquiries });
  } catch (error) {
    console.error("Admin inquiries error:", error);
    res.status(500).json({ error: "Gagal memuat daftar pemesanan kamar" });
  }
});

// PUT /api/admin/inquiries/:id (Update status inquiry: CONTACTED, CONVERTED, CANCELLED)
roomRouter.put("/admin/inquiries/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status, notes } = req.body;

    const updated = await prisma.bookingInquiry.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
      include: { roomType: true },
    });

    res.json({ success: true, message: "Status reservasi berhasil diperbarui", data: updated });
  } catch (error) {
    console.error("Update inquiry error:", error);
    res.status(500).json({ error: "Gagal memperbarui status reservasi" });
  }
});

