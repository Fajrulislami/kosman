import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAdmin, requireTenant, AuthenticatedRequest } from "../middlewares/auth";

export const invoiceRouter = Router();

const paySchema = z.object({
  proofImageUrl: z.string().min(1, "Bukti transfer wajib disertakan"),
  method: z.enum(["MANUAL_TRANSFER", "CASH", "MIDTRANS_VA", "QRIS"]).default("MANUAL_TRANSFER"),
});

const verifySchema = z.object({
  action: z.enum(["APPROVE", "REJECT"]),
  rejectReason: z.string().optional(),
});

// GET /api/admin/invoices
invoiceRouter.get("/admin/invoices", requireAdmin, async (req: Request, res: Response): Promise<void> => {
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
});

// GET /api/portal/invoices (Tagihan Milik Penghuni yang Sedang Login)
invoiceRouter.get("/portal/invoices", requireTenant, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
});

// POST /api/portal/invoices/:id/pay
invoiceRouter.post("/portal/invoices/:id/pay", requireTenant, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
});

// POST /api/admin/payments/:id/verify
invoiceRouter.post("/admin/payments/:id/verify", requireAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
});
