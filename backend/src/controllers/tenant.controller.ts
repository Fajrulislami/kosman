import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "../middlewares/auth";
import { registerTenantSchema, updateTenantSchema, extendLeaseSchema, moveRoomSchema } from "../validations/tenant.schema";

export const getAdminTenants = async (req: Request, res: Response): Promise<void> => {
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
};

export const registerTenant = async (req: Request, res: Response): Promise<void> => {
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
      inquiryId,
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

    const defaultPassword = password || "kos12345";
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

      const finalDeposit = depositAmount !== undefined ? depositAmount : room.roomType.depositPrice;

      const lease = await tx.lease.create({
        data: {
          tenantId: tenant.id,
          roomId: room.id,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          rentAmount: room.roomType.basePrice,
          depositAmount: finalDeposit,
          status: "ACTIVE",
        },
      });

      await tx.room.update({
        where: { id: room.id },
        data: { status: "OCCUPIED" },
      });

      // Update inquiry status jika berasal dari alur reservasi
      if (inquiryId) {
        await tx.bookingInquiry.update({
          where: { id: inquiryId },
          data: { status: "CONVERTED" },
        });
      }

      // Generate guaranteed unique invoice number
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const baseInvoiceNumber = `INV-${currentYear}${String(currentMonth).padStart(2, "0")}-${room.roomNumber}`;
      let invoiceNumber = baseInvoiceNumber;
      let counter = 1;

      while (await tx.invoice.findUnique({ where: { invoiceNumber } })) {
        invoiceNumber = `${baseInvoiceNumber}-${String(counter).padStart(2, "0")}`;
        counter++;
        if (counter > 100) {
          invoiceNumber = `${baseInvoiceNumber}-${Date.now().toString().slice(-6)}`;
          break;
        }
      }

      const firstInvoiceAmount = room.roomType.basePrice + finalDeposit;

      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          leaseId: lease.id,
          amount: firstInvoiceAmount,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          periodMonth: currentMonth,
          periodYear: currentYear,
        },
      });


      return {
        tenant,
        lease,
        roomNumber: room.roomNumber,
        roomTypeName: room.roomType.name,
        rentAmount: room.roomType.basePrice,
        depositAmount: finalDeposit,
        totalFirstPayment: firstInvoiceAmount,
        invoiceNumber,
        email,
        rawPassword: defaultPassword,
      };
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
};

export const checkoutLease = async (req: Request, res: Response): Promise<void> => {
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
};

export const updateTenant = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const parsed = updateTenantSchema.safeParse(req.body);
    
    if (!parsed.success) {
      res.status(400).json({ error: "Validasi gagal", details: parsed.error.flatten().fieldErrors });
      return;
    }

    const updated = await prisma.tenant.update({
      where: { id },
      data: parsed.data,
    });

    res.json({ success: true, message: "Data penghuni berhasil diperbarui", data: updated });
  } catch (error) {
    console.error("Update tenant error:", error);
    res.status(500).json({ error: "Gagal memperbarui data penghuni" });
  }
};

export const extendLease = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const parsed = extendLeaseSchema.safeParse(req.body);
    
    if (!parsed.success) {
      res.status(400).json({ error: "Validasi gagal", details: parsed.error.flatten().fieldErrors });
      return;
    }

    const lease = await prisma.lease.findUnique({ where: { id } });
    if (!lease) {
      res.status(404).json({ error: "Kontrak sewa tidak ditemukan" });
      return;
    }

    const updated = await prisma.lease.update({
      where: { id },
      data: { endDate: new Date(parsed.data.endDate) },
    });

    res.json({ success: true, message: "Masa sewa berhasil diperpanjang", data: updated });
  } catch (error) {
    console.error("Extend lease error:", error);
    res.status(500).json({ error: "Gagal memperpanjang sewa" });
  }
};

export const moveRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const parsed = moveRoomSchema.safeParse(req.body);
    
    if (!parsed.success) {
      res.status(400).json({ error: "Validasi gagal", details: parsed.error.flatten().fieldErrors });
      return;
    }

    const lease = await prisma.lease.findUnique({ where: { id } });
    if (!lease) {
      res.status(404).json({ error: "Kontrak sewa tidak ditemukan" });
      return;
    }

    const newRoom = await prisma.room.findUnique({ 
      where: { id: parsed.data.newRoomId },
      include: { roomType: true }
    });
    
    if (!newRoom) {
      res.status(404).json({ error: "Kamar baru tidak ditemukan" });
      return;
    }

    if (newRoom.status === "OCCUPIED") {
      res.status(400).json({ error: "Kamar baru sudah terisi" });
      return;
    }

    // Execute move transaction
    await prisma.$transaction([
      // 1. Free old room
      prisma.room.update({
        where: { id: lease.roomId },
        data: { status: "AVAILABLE" }
      }),
      // 2. Occupy new room
      prisma.room.update({
        where: { id: newRoom.id },
        data: { status: "OCCUPIED" }
      }),
      // 3. Update lease room and rent amount based on new room type
      prisma.lease.update({
        where: { id },
        data: { 
          roomId: newRoom.id,
          rentAmount: newRoom.roomType.basePrice
        }
      })
    ]);

    res.json({ success: true, message: `Berhasil pindah ke Kamar ${newRoom.roomNumber}` });
  } catch (error) {
    console.error("Move room error:", error);
    res.status(500).json({ error: "Gagal memproses pindah kamar" });
  }
};

export const requestLeaseExtension = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Sesi tidak ditemukan atau belum login" });
      return;
    }

    const tenant = await prisma.tenant.findUnique({
      where: { userId },
      include: {
        leases: {
          where: { status: "ACTIVE" },
          include: { 
            room: {
              include: { roomType: true }
            } 
          },
          take: 1,
        },
      },
    });

    if (!tenant || tenant.leases.length === 0) {
      res.status(400).json({ error: "Anda tidak memiliki kontrak sewa kamar aktif saat ini" });
      return;
    }

    const activeLease = tenant.leases[0];
    const { durationMonths, notes } = req.body;

    const months = parseInt(String(durationMonths), 10);
    if (isNaN(months) || months < 1 || months > 24) {
      res.status(400).json({ error: "Durasi perpanjangan harus antara 1 sampai 24 bulan" });
      return;
    }

    // Hitung tanggal akhir baru
    const currentEnd = new Date(activeLease.endDate);
    const proposedEnd = new Date(currentEnd);
    proposedEnd.setMonth(proposedEnd.getMonth() + months);

    const formattedCurrentEnd = currentEnd.toISOString().split("T")[0];
    const formattedProposedEnd = proposedEnd.toISOString().split("T")[0];

    // Buat tiket komplain/administrasi agar otomatis masuk ke notifikasi & daftar tugas admin
    const ticketNumber = `EXT-${Date.now().toString().slice(-6)}`;
    const complaint = await prisma.complaint.create({
      data: {
        ticketNumber,
        tenantId: tenant.id,
        roomId: activeLease.roomId,
        category: "Administrasi & Sewa",
        title: `Pengajuan Perpanjangan Sewa Kamar ${activeLease.room.roomNumber} (${months} Bulan)`,
        description: `Pengajuan perpanjangan sewa kamar ${activeLease.room.roomNumber} selama ${months} bulan (dari ${formattedCurrentEnd} s/d ${formattedProposedEnd}). ${notes ? `Catatan penghuni: "${notes}"` : ""}`,
        priority: "HIGH",
        status: "PENDING",
      },
    });

    res.json({
      success: true,
      message: "Pengajuan perpanjangan sewa berhasil dikirim ke pengelola",
      data: {
        ticketNumber: complaint.ticketNumber,
        proposedEndDate: formattedProposedEnd,
        durationMonths: months,
      },
    });
  } catch (error) {
    console.error("Request lease extension error:", error);
    res.status(500).json({ error: "Gagal mengirim pengajuan perpanjangan sewa" });
  }
};
