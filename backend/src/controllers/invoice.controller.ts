import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "../middlewares/auth";
import { paySchema, verifySchema, createInvoiceSchema, updateInvoiceSchema } from "../validations/invoice.schema";

export const getAdminInvoices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, month, year } = req.query;

    const where: Record<string, unknown> = {};
    if (status && typeof status === "string") where.status = status;
    if (month) where.periodMonth = parseInt(String(month));
    if (year) where.periodYear = parseInt(String(year));

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        lease: {
          include: {
            tenant: true,
            room: { include: { roomType: true } },
          },
        },
        payments: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { dueDate: "desc" },
    });

    const formatted = invoices.map((inv) => {
      const latestPayment = inv.payments[0];
      return {
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        tenantName: inv.lease.tenant.fullName,
        tenantPhone: inv.lease.tenant.phone,
        roomNumber: inv.lease.room.roomNumber,
        roomType: inv.lease.room.roomType.name,
        amount: `Rp ${inv.amount.toLocaleString("id-ID")}`,
        rawAmount: inv.amount,
        dueDate: inv.dueDate.toISOString().split("T")[0],
        period: `${inv.periodMonth}/${inv.periodYear}`,
        status:
          inv.status === "PAID"
            ? "Lunas"
            : inv.status === "WAITING_CONFIRMATION"
            ? "Menunggu Verifikasi"
            : inv.status === "OVERDUE"
            ? "Jatuh Tempo"
            : "Belum Lunas",
        rawStatus: inv.status,
        payment: latestPayment
          ? {
              id: latestPayment.id,
              method: latestPayment.method,
              paidAt: latestPayment.paidAt.toISOString(),
              proofUrl: latestPayment.proofImageUrl,
              status: latestPayment.status,
            }
          : null,
      };
    });

    const totalBills = await prisma.invoice.count();
    const paidBills = await prisma.invoice.count({ where: { status: "PAID" } });
    const pendingBills = await prisma.invoice.count({ where: { status: "PENDING" } });
    const waitingBills = await prisma.invoice.count({ where: { status: "WAITING_CONFIRMATION" } });

    res.json({
      data: formatted,
      stats: {
        total: totalBills,
        paid: paidBills,
        pending: pendingBills,
        waitingVerification: waitingBills,
      },
    });
  } catch (error) {
    console.error("Admin invoices error:", error);
    res.status(500).json({ error: "Gagal memuat data tagihan admin" });
  }
};

export const getPortalInvoices = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { userId: req.user!.userId },
      include: {
        leases: {
          include: {
            room: { include: { roomType: true } },
            invoices: {
              include: {
                payments: {
                  orderBy: { createdAt: "desc" },
                  take: 1,
                },
              },
              orderBy: { dueDate: "desc" },
            },
          },
        },
      },
    });

    if (!tenant) {
      res.status(404).json({ error: "Data penghuni tidak ditemukan" });
      return;
    }

    const allInvoices = tenant.leases.flatMap((lease) =>
      lease.invoices.map((inv) => {
        const latestPayment = inv.payments[0];
        return {
          id: inv.id,
          invoiceNumber: inv.invoiceNumber,
          room: `Kamar ${lease.room.roomNumber} - ${lease.room.roomType.name}`,
          month: `Periode ${inv.periodMonth}/${inv.periodYear}`,
          amount: inv.amount,
          dueDate: inv.dueDate.toISOString().split("T")[0],
          paidDate: latestPayment?.status === "VERIFIED" ? latestPayment.paidAt.toISOString().split("T")[0] : null,
          status:
            inv.status === "PAID"
              ? "Lunas"
              : inv.status === "WAITING_CONFIRMATION"
              ? "Menunggu Konfirmasi"
              : inv.status === "OVERDUE"
              ? "Jatuh Tempo"
              : "Belum Lunas",
          rawStatus: inv.status,
          payment: latestPayment
            ? {
                id: latestPayment.id,
                status: latestPayment.status,
                proofUrl: latestPayment.proofImageUrl,
                rejectReason: latestPayment.rejectReason,
              }
            : null,
        };
      })
    );

    res.json({ data: allInvoices });
  } catch (error) {
    console.error("Portal invoices error:", error);
    res.status(500).json({ error: "Gagal memuat tagihan portal penghuni" });
  }
};

export const payInvoice = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const parsed = paySchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: "Input tidak valid", details: parsed.error.flatten() });
      return;
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { lease: { include: { tenant: true } } },
    });

    if (!invoice) {
      res.status(404).json({ error: "Tagihan tidak ditemukan" });
      return;
    }

    if (invoice.lease.tenant.userId !== req.user!.userId) {
      res.status(403).json({ error: "Akses ditolak: Tagihan bukan milik akun Anda" });
      return;
    }

    if (invoice.status === "PAID") {
      res.status(400).json({ error: "Tagihan ini sudah lunas" });
      return;
    }

    const { proofImageUrl, method } = parsed.data;

    await prisma.$transaction([
      prisma.payment.create({
        data: {
          invoiceId: invoice.id,
          amount: invoice.amount + invoice.penaltyAmount,
          method,
          proofImageUrl,
          status: "PENDING",
        },
      }),
      prisma.invoice.update({
        where: { id: invoice.id },
        data: { status: "WAITING_CONFIRMATION" },
      }),
    ]);

    res.json({
      success: true,
      message: "Bukti pembayaran berhasil dikirim. Menunggu verifikasi dari admin.",
    });
  } catch (error) {
    console.error("Pay invoice error:", error);
    res.status(500).json({ error: "Gagal memproses pembayaran" });
  }
};

export const verifyPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const parsed = verifySchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: "Input verifikasi tidak sesuai" });
      return;
    }

    const { action, rejectReason } = parsed.data;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { invoice: true },
    });

    if (!payment) {
      res.status(404).json({ error: "Data pembayaran tidak ditemukan" });
      return;
    }

    if (action === "APPROVE") {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id },
          data: {
            status: "VERIFIED",
            verifiedAt: new Date(),
            verifiedBy: req.user!.name,
          },
        }),
        prisma.invoice.update({
          where: { id: payment.invoiceId },
          data: { status: "PAID" },
        }),
      ]);

      res.json({ success: true, message: "Pembayaran telah disetujui (Lunas)" });
    } else {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id },
          data: {
            status: "REJECTED",
            rejectReason: rejectReason || "Bukti transfer tidak valid",
            verifiedAt: new Date(),
            verifiedBy: req.user!.name,
          },
        }),
        prisma.invoice.update({
          where: { id: payment.invoiceId },
          data: { status: "PENDING" },
        }),
      ]);

      res.json({ success: true, message: "Pembayaran telah ditolak" });
    }
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ error: "Gagal memverifikasi pembayaran" });
  }
};

export const createInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = createInvoiceSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validasi gagal", details: parsed.error.flatten() });
      return;
    }

    const { leaseId, amount, dueDate, periodMonth, periodYear } = parsed.data;

    const lease = await prisma.lease.findUnique({
      where: { id: leaseId },
      include: { room: true },
    });

    if (!lease) {
      res.status(404).json({ error: "Kontrak sewa penghuni tidak ditemukan" });
      return;
    }

    const invoiceNumber = `INV-${periodYear}${String(periodMonth).padStart(2, "0")}-${lease.room.roomNumber}-${Date.now().toString().slice(-4)}`;

    const newInvoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        leaseId,
        amount,
        dueDate: new Date(dueDate),
        periodMonth,
        periodYear,
        status: "PENDING",
      },
    });

    res.status(201).json({
      success: true,
      message: "Tagihan baru berhasil dibuat",
      data: newInvoice,
    });
  } catch (error) {
    console.error("Create invoice error:", error);
    res.status(500).json({ error: "Gagal membuat tagihan baru" });
  }
};

export const generateMonthlyInvoices = async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Temukan semua kontrak aktif
    const activeLeases = await prisma.lease.findMany({
      where: { status: "ACTIVE" },
      include: { room: true },
    });

    if (activeLeases.length === 0) {
      res.json({ success: true, message: "Tidak ada penyewa aktif saat ini.", generatedCount: 0 });
      return;
    }

    // Temukan tagihan yang sudah ada bulan ini untuk mencegah duplikasi
    const existingInvoices = await prisma.invoice.findMany({
      where: {
        periodMonth: currentMonth,
        periodYear: currentYear,
      },
      select: { leaseId: true },
    });

    const existingLeaseIds = new Set(existingInvoices.map((inv) => inv.leaseId));

    // Saring kontrak yang belum punya tagihan
    const leasesToInvoice = activeLeases.filter((lease) => !existingLeaseIds.has(lease.id));

    if (leasesToInvoice.length === 0) {
      res.json({ success: true, message: "Semua penyewa aktif sudah memiliki tagihan bulan ini.", generatedCount: 0 });
      return;
    }

    // Siapkan data tagihan baru
    const newInvoicesData = leasesToInvoice.map((lease) => {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 5); // Jatuh tempo 5 hari dari sekarang

      return {
        invoiceNumber: `INV-${currentYear}${String(currentMonth).padStart(2, "0")}-${lease.room.roomNumber}-${Math.floor(1000 + Math.random() * 9000)}`,
        leaseId: lease.id,
        amount: lease.rentAmount,
        dueDate: dueDate,
        periodMonth: currentMonth,
        periodYear: currentYear,
        status: "PENDING",
      };
    });

    // Bulk insert menggunakan createMany
    const result = await prisma.invoice.createMany({
      data: newInvoicesData,
    });

    res.json({
      success: true,
      message: `Berhasil membuat ${result.count} tagihan baru untuk bulan ini.`,
      generatedCount: result.count,
    });
  } catch (error) {
    console.error("Generate monthly invoices error:", error);
    res.status(500).json({ error: "Gagal membuat tagihan otomatis" });
  }
};

export const updateInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const parsed = updateInvoiceSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: "Input tidak valid", details: parsed.error.flatten() });
      return;
    }

    const invoice = await prisma.invoice.findUnique({ where: { id } });

    if (!invoice) {
      res.status(404).json({ error: "Tagihan tidak ditemukan" });
      return;
    }

    if (invoice.status === "PAID" || invoice.status === "WAITING_CONFIRMATION") {
      res.status(400).json({ error: "Tidak dapat mengubah tagihan yang sudah dibayar atau menunggu verifikasi" });
      return;
    }

    const updatedData: any = {};
    if (parsed.data.amount !== undefined) updatedData.amount = parsed.data.amount;
    if (parsed.data.penaltyAmount !== undefined) updatedData.penaltyAmount = parsed.data.penaltyAmount;
    if (parsed.data.dueDate !== undefined) updatedData.dueDate = new Date(parsed.data.dueDate);
    if (parsed.data.periodMonth !== undefined) updatedData.periodMonth = parsed.data.periodMonth;
    if (parsed.data.periodYear !== undefined) updatedData.periodYear = parsed.data.periodYear;

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: updatedData,
    });

    res.json({ success: true, message: "Tagihan berhasil diperbarui", data: updatedInvoice });
  } catch (error) {
    console.error("Update invoice error:", error);
    res.status(500).json({ error: "Gagal memperbarui tagihan" });
  }
};

export const deleteInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    
    const invoice = await prisma.invoice.findUnique({ where: { id } });

    if (!invoice) {
      res.status(404).json({ error: "Tagihan tidak ditemukan" });
      return;
    }

    if (invoice.status === "PAID" || invoice.status === "WAITING_CONFIRMATION") {
      res.status(400).json({ error: "Tidak dapat menghapus tagihan yang sudah dibayar atau menunggu verifikasi" });
      return;
    }

    await prisma.invoice.delete({ where: { id } });

    res.json({ success: true, message: "Tagihan berhasil dihapus" });
  } catch (error) {
    console.error("Delete invoice error:", error);
    res.status(500).json({ error: "Gagal menghapus tagihan" });
  }
};

export const getAdminInvoiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        lease: {
          include: {
            tenant: true,
            room: true,
          }
        },
        payments: {
          where: { status: "VERIFIED" },
          orderBy: { paidAt: "desc" },
          take: 1
        }
      }
    });

    if (!invoice) {
      res.status(404).json({ error: "Tagihan tidak ditemukan" });
      return;
    }

    res.json({ data: invoice });
  } catch (error) {
    console.error("Get invoice detail error:", error);
    res.status(500).json({ error: "Gagal mengambil detail tagihan" });
  }
};

export const payCash = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    
    const invoice = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      res.status(404).json({ error: "Tagihan tidak ditemukan" });
      return;
    }

    if (invoice.status === "PAID") {
      res.status(400).json({ error: "Tagihan sudah berstatus lunas" });
      return;
    }

    const result = await prisma.$transaction(async (tx) => {
      // Buat record pembayaran tunai
      const payment = await tx.payment.create({
        data: {
          invoiceId: invoice.id,
          amount: invoice.amount,
          method: "CASH",
          status: "VERIFIED",
          verifiedBy: (req as AuthenticatedRequest).user?.id || "admin",
          verifiedAt: new Date(),
        },
      });

      // Update status tagihan jadi PAID
      await tx.invoice.update({
        where: { id: invoice.id },
        data: { status: "PAID" },
      });

      return payment;
    });

    res.json({ success: true, message: "Berhasil menandai tagihan sebagai lunas (Tunai)", data: result });
  } catch (error) {
    console.error("Pay cash error:", error);
    res.status(500).json({ error: "Gagal memproses pembayaran tunai" });
  }
};
