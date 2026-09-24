import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/auth";

export async function GET() {
  try {
    const session = await requireTenant();

    const tenant = await prisma.tenant.findUnique({
      where: { userId: session.userId },
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
      return NextResponse.json({ error: "Data penghuni tidak ditemukan" }, { status: 404 });
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

    return NextResponse.json({ data: allInvoices });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Akses khusus penghuni" }, { status: 403 });
    }
    console.error("Portal invoices GET error:", error);
    return NextResponse.json({ error: "Gagal memuat tagihan" }, { status: 500 });
  }
}
