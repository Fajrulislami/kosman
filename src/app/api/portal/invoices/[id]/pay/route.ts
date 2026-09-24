import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/auth";
import { z } from "zod";
import { InvoiceStatus, PaymentMethod, PaymentStatus } from "@prisma/client";

const paySchema = z.object({
  proofImageUrl: z.string().min(1, "Bukti transfer wajib disertakan"),
  method: z.nativeEnum(PaymentMethod).default(PaymentMethod.MANUAL_TRANSFER),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireTenant();
    const { id } = await params;
    const body = await req.json();

    const parsed = paySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Input tidak valid", details: parsed.error.flatten() }, { status: 400 });
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { lease: { include: { tenant: true } } },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Tagihan tidak ditemukan" }, { status: 404 });
    }

    // Pastikan tagihan ini milik penghuni yang sedang login
    if (invoice.lease.tenant.userId !== session.userId) {
      return NextResponse.json({ error: "Akses tidak diizinkan" }, { status: 403 });
    }

    if (invoice.status === InvoiceStatus.PAID) {
      return NextResponse.json({ error: "Tagihan ini sudah lunas" }, { status: 400 });
    }

    const { proofImageUrl, method } = parsed.data;

    // Buat record pembayaran baru dan ubah status invoice ke WAITING_CONFIRMATION
    await prisma.$transaction([
      prisma.payment.create({
        data: {
          invoiceId: invoice.id,
          amount: invoice.amount + invoice.penaltyAmount,
          method,
          proofImageUrl,
          status: PaymentStatus.PENDING,
        },
      }),
      prisma.invoice.update({
        where: { id: invoice.id },
        data: { status: InvoiceStatus.WAITING_CONFIRMATION },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Bukti pembayaran berhasil dikirim. Menunggu verifikasi dari admin.",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }
    console.error("Pay invoice error:", error);
    return NextResponse.json({ error: "Gagal memproses pengiriman pembayaran" }, { status: 500 });
  }
}
