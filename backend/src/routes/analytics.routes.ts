import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middlewares/auth";

export const analyticsRouter = Router();

// GET /api/admin/analytics/overview
analyticsRouter.get("/admin/analytics/overview", requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // 1. Pendapatan bulan ini
    const paidInvoicesThisMonth = await prisma.invoice.aggregate({
      where: {
        periodMonth: currentMonth,
        periodYear: currentYear,
        status: "PAID",
      },
      _sum: { amount: true },
    });
    const revenueThisMonth = paidInvoicesThisMonth._sum.amount || 0;

    // 2. Statistik Kamar & Okupansi
    const totalRooms = await prisma.room.count();
    const occupiedRooms = await prisma.room.count({ where: { status: "OCCUPIED" } });
    const availableRooms = await prisma.room.count({ where: { status: "AVAILABLE" } });
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    // 3. Tagihan Tertunda
    const unpaidInvoices = await prisma.invoice.count({
      where: {
        status: { in: ["PENDING", "WAITING_CONFIRMATION", "OVERDUE"] },
      },
    });

    // 4. Komplain Aktif
    const activeComplaints = await prisma.complaint.count({
      where: { status: { in: ["PENDING", "IN_PROGRESS"] } },
    });

    // 5. Tren Pendapatan 6 Bulan Terakhir untuk Recharts
    const monthsData = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1 - i, 1);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();

      const rev = await prisma.invoice.aggregate({
        where: {
          periodMonth: m,
          periodYear: y,
          status: "PAID",
        },
        _sum: { amount: true },
      });

      monthsData.push({
        month: monthNames[m - 1],
        pendapatan: (rev._sum.amount || 0) / 1000000,
        fullAmount: rev._sum.amount || 0,
      });
    }

    // 6. Aktivitas Terbaru
    const recentPayments = await prisma.payment.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        invoice: {
          include: { lease: { include: { tenant: true, room: true } } },
        },
      },
    });

    const recentComplaints = await prisma.complaint.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: { tenant: true, room: true },
    });

    res.json({
      metrics: {
        revenueThisMonth,
        revenueFormatted: `Rp ${revenueThisMonth.toLocaleString("id-ID")}`,
        totalRooms,
        occupiedRooms,
        availableRooms,
        occupancyRate,
        unpaidInvoices,
        activeComplaints,
      },
      chartData: monthsData,
      recentActivities: {
        payments: recentPayments,
        complaints: recentComplaints,
      },
    });
  } catch (error) {
    console.error("Analytics overview error:", error);
    res.status(500).json({ error: "Gagal memuat analitik dashboard admin" });
  }
});
