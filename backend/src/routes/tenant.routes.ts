import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middlewares/auth";

export const tenantRouter = Router();

const registerTenantSchema = z.object({
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

// GET /api/admin/tenants
tenantRouter.get("/admin/tenants", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search ? String(req.query.search).toLowerCase() : undefined;

    const tenants = await prisma.tenant.findMany({
      include: {
        user: { select: { email: true } },
        leases: {
          where: { status: "ACTIVE" },
          include: { room: { include: { roomType: true } } },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = tenants
      .map((tenant) => {
        const activeLease = tenant.leases[0];
        return {
          id: tenant.id,
          name: tenant.fullName,
          email: tenant.user?.email || "-",
          phone: tenant.phone,
          nik: tenant.nik,
          occupation: tenant.occupation || "-",
          room: activeLease ? `Kamar ${activeLease.room.roomNumber} (${activeLease.room.roomType.name})` : "Belum Ada",
          roomNumber: activeLease?.room.roomNumber || "-",
          roomId: activeLease?.roomId || null,
          leaseId: activeLease?.id || null,
          startDate: activeLease ? activeLease.startDate.toISOString().split("T")[0] : "-",
          endDate: activeLease ? activeLease.endDate.toISOString().split("T")[0] : "-",
          rentAmount: activeLease ? `Rp ${activeLease.rentAmount.toLocaleString("id-ID")}` : "-",
          status: activeLease ? "Aktif" : "Non-Aktif",
          emergencyContact: {
            name: tenant.emergencyName || "-",
            phone: tenant.emergencyPhone || "-",
            relation: tenant.emergencyRelation || "-",
          },
        };
      })
      .filter((t) => {
        if (!search) return true;
        return (
          t.name.toLowerCase().includes(search) ||
          t.phone.includes(search) ||
          t.roomNumber.toLowerCase().includes(search)
        );
      });

    const totalTenants = await prisma.tenant.count();
    const activeTenants = await prisma.lease.count({ where: { status: "ACTIVE" } });

    res.json({
      data: formatted,
      stats: {
        total: totalTenants,
        active: activeTenants,
        inactive: totalTenants - activeTenants,
      },
    });
  } catch (error) {
    console.error("Admin tenants error:", error);
    res.status(500).json({ error: "Gagal memuat daftar penghuni" });
  }
});

// POST /api/admin/tenants (Registrasi Penghuni & Alokasi Kamar)
tenantRouter.post("/admin/tenants", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = registerTenantSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validasi gagal", details: parsed.error.flatten().fieldErrors });
      return;
    }

    const {
      fullName,
      nik,
      phone,
      email,
      password,
      roomId,
      startDate,
      endDate,
      depositAmount,
      emergencyName,
      emergencyPhone,
      emergencyRelation,
      occupation,
    } = parsed.data;

    const existingNik = await prisma.tenant.findUnique({ where: { nik } });
    if (existingNik) {
      res.status(409).json({ error: `NIK ${nik} sudah terdaftar` });
      return;
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      res.status(409).json({ error: `Email ${email} sudah digunakan` });
      return;
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { roomType: true },
    });

    if (!room) {
      res.status(404).json({ error: "Kamar tidak ditemukan" });
      return;
    }

    if (room.status === "OCCUPIED") {
      res.status(400).json({ error: `Kamar ${room.roomNumber} sedang terisi` });
      return;
    }

    const defaultPassword = password || "kostara123456";
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, name: fullName, passwordHash, role: "TENANT" },
      });

      const tenant = await tx.tenant.create({
        data: {
          userId: user.id,
          fullName,
          nik,
          phone,
          emergencyName,
          emergencyPhone,
          emergencyRelation,
          occupation,
        },
      });

      const lease = await tx.lease.create({
        data: {
          tenantId: tenant.id,
          roomId: room.id,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          rentAmount: room.roomType.basePrice,
          depositAmount: depositAmount || room.roomType.depositPrice,
          status: "ACTIVE",
        },
      });

      await tx.room.update({
        where: { id: room.id },
        data: { status: "OCCUPIED" },
      });

      const invoiceNumber = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${room.roomNumber}`;
      await tx.invoice.create({
        data: {
          invoiceNumber,
          leaseId: lease.id,
          amount: room.roomType.basePrice,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          periodMonth: new Date().getMonth() + 1,
          periodYear: new Date().getFullYear(),
        },
      });

      return { tenant, lease };
    });

    res.status(201).json({
      success: true,
      message: "Penghuni berhasil didaftarkan dan kamar berhasil dialokasikan",
      data: result,
    });
  } catch (error) {
    console.error("Register tenant error:", error);
    res.status(500).json({ error: "Gagal mendaftarkan penghuni baru" });
  }
});

// POST /api/admin/leases/:id/checkout
tenantRouter.post("/admin/leases/:id/checkout", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const lease = await prisma.lease.findUnique({
      where: { id },
      include: { room: true },
    });

    if (!lease) {
      res.status(404).json({ error: "Kontrak sewa tidak ditemukan" });
      return;
    }

    await prisma.$transaction([
      prisma.lease.update({
        where: { id: lease.id },
        data: { status: "TERMINATED", endDate: new Date() },
      }),
      prisma.room.update({
        where: { id: lease.roomId },
        data: { status: "AVAILABLE" },
      }),
    ]);

    res.json({
      success: true,
      message: `Check-out berhasil. Kamar ${lease.room.roomNumber} kini berstatus Kosong.`,
    });
  } catch (error) {
    console.error("Checkout lease error:", error);
    res.status(500).json({ error: "Gagal memproses check-out sewa" });
  }
});
