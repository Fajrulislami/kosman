import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { InvoiceStatus } from "@prisma/client";

export async function GET(req: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as InvoiceStatus | null;
    const month = searchParams.get("month") ? parseInt(searchParams.get("month")!) : undefined;
    const year = searchParams.get("year") ? parseInt(searchParams.get("year")!) : undefined;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (month) where.periodMonth = month;
    if (year) where.periodYear = year;

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

    // Statistik tagihan
    const totalBills = await prisma.invoice.count();
    const paidBills = await prisma.invoice.count({ where: { status: "PAID" } });
    const pendingBills = await prisma.invoice.count({ where: { status: "PENDING" } });
    const waitingVerificationBills = await prisma.invoice.count({
      where: { status: "WAITING_CONFIRMATION" },
    });

    return NextResponse.json({
      data: formatted,
      stats: {
        total: totalBills,
        paid: paidBills,
        pending: pendingBills,
        waitingVerification: waitingVerificationBills,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }
    console.error("Admin invoices GET error:", error);
    return NextResponse.json({ error: "Gagal memuat data tagihan" }, { status: 500 });
  }
}
