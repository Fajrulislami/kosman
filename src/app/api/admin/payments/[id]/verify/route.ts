import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";
import { PaymentStatus, InvoiceStatus } from "@prisma/client";

const verifySchema = z.object({
  action: z.enum(["APPROVE", "REJECT"]),
  rejectReason: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const parsed = verifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Input validasi tidak sesuai" }, { status: 400 });
    }

    const { action, rejectReason } = parsed.data;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { invoice: true },
    });

    if (!payment) {
      return NextResponse.json({ error: "Data pembayaran tidak ditemukan" }, { status: 404 });
    }

    if (action === "APPROVE") {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id },
          data: {
            status: PaymentStatus.VERIFIED,
            verifiedAt: new Date(),
            verifiedBy: admin.name,
          },
        }),
        prisma.invoice.update({
          where: { id: payment.invoiceId },
          data: { status: InvoiceStatus.PAID },
        }),
      ]);

      return NextResponse.json({
        success: true,
        message: "Pembayaran berhasil diverifikasi dan status tagihan telah Lunas",
      });
    } else {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id },
          data: {
            status: PaymentStatus.REJECTED,
            rejectReason: rejectReason || "Bukti transfer tidak valid atau tidak terbaca",
            verifiedAt: new Date(),
            verifiedBy: admin.name,
          },
        }),
        prisma.invoice.update({
          where: { id: payment.invoiceId },
          data: { status: InvoiceStatus.PENDING },
        }),
      ]);

      return NextResponse.json({
        success: true,
        message: "Pembayaran telah ditolak",
      });
    }
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }
    console.error("Payment verify error:", error);
    return NextResponse.json({ error: "Gagal memverifikasi pembayaran" }, { status: 500 });
  }
}
