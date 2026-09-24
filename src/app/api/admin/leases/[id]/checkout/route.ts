import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { LeaseStatus, RoomStatus } from "@prisma/client";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const lease = await prisma.lease.findUnique({
      where: { id },
      include: { room: true },
    });

    if (!lease) {
      return NextResponse.json({ error: "Kontrak sewa tidak ditemukan" }, { status: 404 });
    }

    if (lease.status !== LeaseStatus.ACTIVE) {
      return NextResponse.json({ error: "Kontrak sewa ini sudah tidak aktif" }, { status: 400 });
    }

    // Eksekusi checkout transaksi
    await prisma.$transaction(async (tx) => {
      // 1. Update lease menjadi TERMINATED
      await tx.lease.update({
        where: { id: lease.id },
        data: { status: LeaseStatus.TERMINATED, endDate: new Date() },
      });

      // 2. Kembalikan status kamar menjadi AVAILABLE
      await tx.room.update({
        where: { id: lease.roomId },
        data: { status: RoomStatus.AVAILABLE },
      });
    });

    return NextResponse.json({
      success: true,
      message: `Proses check-out berhasil. Kamar ${lease.room.roomNumber} kini berstatus Kosong.`,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }
    console.error("Checkout lease error:", error);
    return NextResponse.json({ error: "Gagal memproses check-out sewa" }, { status: 500 });
  }
}
