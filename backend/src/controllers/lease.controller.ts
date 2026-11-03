import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "../middlewares/auth";

/**
 * Endpoint Tenant: Mengajukan perpanjangan sewa
 * POST /api/portal/lease/extend-request
 */
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
              include: { roomType: true },
            },
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

    // Periksa apakah sudah ada permohonan PENDING untuk sewa ini
    const existingPending = await prisma.leaseExtensionRequest.findFirst({
      where: {
        leaseId: activeLease.id,
        status: "PENDING",
      },
    });

    if (existingPending) {
      res.status(400).json({
        error: "Anda sudah memiliki permohonan perpanjangan sewa yang sedang ditinjau oleh Admin.",
      });
      return;
    }

    // Hitung tanggal akhir baru yang diusulkan
    const currentEnd = new Date(activeLease.endDate);
    const proposedEnd = new Date(currentEnd);
    proposedEnd.setMonth(proposedEnd.getMonth() + months);

    // Simpan ke tabel dedicated LeaseExtensionRequest
    const extensionRequest = await prisma.leaseExtensionRequest.create({
      data: {
        leaseId: activeLease.id,
        tenantId: tenant.id,
        roomId: activeLease.roomId,
        durationMonths: months,
        proposedEndDate: proposedEnd,
        notes: notes ? String(notes).trim() : null,
        status: "PENDING",
      },
      include: {
        room: true,
      },
    });

    res.status(201).json({
      success: true,
      message: `Pengajuan perpanjangan sewa ${months} bulan berhasil dikirimkan ke Admin`,
      data: {
        id: extensionRequest.id,
        durationMonths: months,
        proposedEndDate: proposedEnd.toISOString(),
        roomNumber: extensionRequest.room.roomNumber,
        status: extensionRequest.status,
      },
    });
  } catch (error) {
    console.error("Request lease extension error:", error);
    res.status(500).json({ error: "Gagal mengirim pengajuan perpanjangan sewa" });
  }
};

/**
 * Endpoint Tenant: Cek status pengajuan perpanjangan sewa aktif
 * GET /api/portal/lease/extension-status
 */
export const getTenantExtensionStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Sesi tidak ditemukan" });
      return;
    }

    const tenant = await prisma.tenant.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!tenant) {
      res.json({ data: null });
      return;
    }

    const latestRequest = await prisma.leaseExtensionRequest.findFirst({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: "desc" },
      include: {
        room: { select: { roomNumber: true } },
      },
    });

    res.json({ data: latestRequest });
  } catch (error) {
    console.error("Get extension status error:", error);
    res.status(500).json({ error: "Gagal memuat status perpanjangan sewa" });
  }
};

/**
 * Endpoint Admin: Daftar pengajuan perpanjangan sewa
 * GET /api/admin/leases/extensions
 */
export const getAdminLeaseExtensions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const where: any = {};
    if (status && typeof status === "string") {
      where.status = status;
    }

    const requests = await prisma.leaseExtensionRequest.findMany({
      where,
      include: {
        tenant: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        },
        room: {
          select: {
            id: true,
            roomNumber: true,
            floor: true,
            roomType: { select: { name: true, basePrice: true } },
          },
        },
        lease: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            rentAmount: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ data: requests });
  } catch (error) {
    console.error("Get admin lease extensions error:", error);
    res.status(500).json({ error: "Gagal memuat daftar pengajuan perpanjangan sewa" });
  }
};

/**
 * Endpoint Admin: Menyetujui perpanjangan sewa
 * PUT /api/admin/leases/extensions/:id/approve
 */
export const approveLeaseExtension = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { adminNotes } = req.body;

    const extensionReq = await prisma.leaseExtensionRequest.findUnique({
      where: { id },
      include: {
        lease: true,
        tenant: true,
        room: true,
      },
    });

    if (!extensionReq) {
      res.status(404).json({ error: "Pengajuan perpanjangan sewa tidak ditemukan" });
      return;
    }

    if (extensionReq.status !== "PENDING") {
      res.status(400).json({ error: `Pengajuan ini sudah berstatus ${extensionReq.status}` });
      return;
    }

    const { lease, durationMonths, proposedEndDate } = extensionReq;

    // 1 Invoice total sesuai Opsi 1 (Disetujui User: misal 3 x Rp 650.000 = Rp 1.950.000)
    const totalAmount = lease.rentAmount * durationMonths;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const invoiceNumber = `INV-${currentYear}${String(currentMonth).padStart(2, "0")}-${Date.now().toString().slice(-4)}`;

    // Jatuh tempo: 7 hari dari sekarang
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update status permohonan
      const updatedReq = await tx.leaseExtensionRequest.update({
        where: { id },
        data: {
          status: "APPROVED",
          adminNotes: adminNotes ? String(adminNotes).trim() : "Disetujui oleh Admin",
        },
      });

      // 2. Perpanjang tanggal akhir sewa dan aktifkan kontrak
      const updatedLease = await tx.lease.update({
        where: { id: lease.id },
        data: {
          endDate: proposedEndDate,
          status: "ACTIVE",
        },
      });

      // 3. Terbitkan 1 Invoice Total Perpanjangan Sewa
      const newInvoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          leaseId: lease.id,
          amount: totalAmount,
          penaltyAmount: 0,
          dueDate,
          periodMonth: currentMonth,
          periodYear: currentYear,
          status: "PENDING",
        },
      });

      return { updatedReq, updatedLease, newInvoice };
    });

    res.json({
      success: true,
      message: `Perpanjangan sewa ${durationMonths} bulan berhasil disetujui. Invoice ${result.newInvoice.invoiceNumber} sebesar Rp ${totalAmount.toLocaleString("id-ID")} telah diterbitkan.`,
      data: result,
    });
  } catch (error) {
    console.error("Approve lease extension error:", error);
    res.status(500).json({ error: "Gagal menyetujui perpanjangan sewa" });
  }
};

/**
 * Endpoint Admin: Menolak perpanjangan sewa
 * PUT /api/admin/leases/extensions/:id/reject
 */
export const rejectLeaseExtension = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { adminNotes } = req.body;

    const extensionReq = await prisma.leaseExtensionRequest.findUnique({
      where: { id },
    });

    if (!extensionReq) {
      res.status(404).json({ error: "Pengajuan perpanjangan sewa tidak ditemukan" });
      return;
    }

    if (extensionReq.status !== "PENDING") {
      res.status(400).json({ error: `Pengajuan ini sudah berstatus ${extensionReq.status}` });
      return;
    }

    const updated = await prisma.leaseExtensionRequest.update({
      where: { id },
      data: {
        status: "REJECTED",
        adminNotes: adminNotes ? String(adminNotes).trim() : "Ditolak oleh Admin",
      },
    });

    res.json({
      success: true,
      message: "Pengajuan perpanjangan sewa telah ditolak",
      data: updated,
    });
  } catch (error) {
    console.error("Reject lease extension error:", error);
    res.status(500).json({ error: "Gagal menolak perpanjangan sewa" });
  }
};

