import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getAnalyticsOverview = async (_req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // 1. Pendapatan bulan ini & perbandingan bulan lalu (Termasuk denda keterlambatan)
    const paidInvoicesThisMonth = await prisma.invoice.aggregate({
      where: {
        periodMonth: currentMonth,
        periodYear: currentYear,
        status: "PAID",
      },
      _sum: { amount: true, penaltyAmount: true },
    });
    const revenueThisMonth = (paidInvoicesThisMonth._sum.amount || 0) + (paidInvoicesThisMonth._sum.penaltyAmount || 0);

    const lastMonthDate = new Date(currentYear, currentMonth - 2, 1);
    const paidInvoicesLastMonth = await prisma.invoice.aggregate({
      where: {
        periodMonth: lastMonthDate.getMonth() + 1,
        periodYear: lastMonthDate.getFullYear(),
        status: "PAID",
      },
      _sum: { amount: true, penaltyAmount: true },
    });
    const revenueLastMonth = (paidInvoicesLastMonth._sum.amount || 0) + (paidInvoicesLastMonth._sum.penaltyAmount || 0);

    let revenueGrowth = 0;
    if (revenueLastMonth > 0) {
      revenueGrowth = Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100);
    } else if (revenueThisMonth > 0) {
      revenueGrowth = 100;
    }

    // 2. Statistik Kamar & Okupansi
    const totalRooms = await prisma.room.count();
    const occupiedRooms = await prisma.room.count({ where: { status: "OCCUPIED" } });
    const availableRooms = await prisma.room.count({ where: { status: "AVAILABLE" } });
    const activeTenants = await prisma.lease.count({ where: { status: "ACTIVE" } });
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
        _sum: { amount: true, penaltyAmount: true },
      });

      const totalPeriodRevenue = (rev._sum.amount || 0) + (rev._sum.penaltyAmount || 0);

      monthsData.push({
        month: monthNames[m - 1],
        pendapatan: totalPeriodRevenue / 1000000,
        fullAmount: totalPeriodRevenue,
      });
    }

    // 6. Aktivitas Terbaru (Pembayaran, Komplain, & Calon Penghuni Baru)
    const recentPayments = await prisma.payment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        invoice: {
          include: { lease: { include: { tenant: true, room: true } } },
        },
      },
    });

    const recentComplaints = await prisma.complaint.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { tenant: true, room: true },
    });

    const recentInquiries = await prisma.bookingInquiry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { roomType: true },
    });

    res.json({
      metrics: {
        revenueThisMonth,
        revenueLastMonth,
        revenueGrowth,
        revenueFormatted: `Rp ${revenueThisMonth.toLocaleString("id-ID")}`,
        totalRooms,
        occupiedRooms,
        availableRooms,
        activeTenants,
        occupancyRate,
        unpaidInvoices,
        activeComplaints,
      },
      chartData: monthsData,
      recentActivities: {
        payments: recentPayments,
        complaints: recentComplaints,
        inquiries: recentInquiries,
      },
    });
  } catch (error) {
    console.error("Analytics overview error:", error);
    res.status(500).json({ error: "Gagal memuat analitik dashboard admin" });
  }
};
