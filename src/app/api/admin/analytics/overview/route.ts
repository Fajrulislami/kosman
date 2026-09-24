import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // 1. Pendapatan bulan ini (dari tagihan yang PAID)
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

    // 3. Tagihan Tertunda & Belum Lunas
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
        pendapatan: (rev._sum.amount || 0) / 1000000, // Dalam jutaan untuk chart
        fullAmount: rev._sum.amount || 0,
      });
    }

    // 6. Aktivitas Terbaru (Pembayaran, komplain, tenant baru)
    const recentPayments = await prisma.payment.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        invoice: {
          include: {
            lease: {
              include: { tenant: true, room: true },
            },
          },
        },
      },
    });

    const recentComplaints = await prisma.complaint.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: { tenant: true, room: true },
    });

    return NextResponse.json({
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
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }
    console.error("Analytics overview API error:", error);
    return NextResponse.json({ error: "Gagal memuat analitik dashboard" }, { status: 500 });
  }
}
