import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";
import { RoomStatus } from "@prisma/client";

const updateRoomSchema = z.object({
  roomNumber: z.string().min(1).optional(),
  floor: z.number().int().min(1).optional(),
  roomTypeId: z.string().min(1).optional(),
  status: z.nativeEnum(RoomStatus).optional(),
  notes: z.string().optional().nullable(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const parsed = updateRoomSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await prisma.room.update({
      where: { id },
      data: parsed.data,
      include: { roomType: true },
    });

    return NextResponse.json({
      success: true,
      message: "Data kamar berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }
    console.error("Update room error:", error);
    return NextResponse.json({ error: "Gagal memperbarui kamar" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        leases: { where: { status: "ACTIVE" } },
      },
    });

    if (!room) {
      return NextResponse.json({ error: "Kamar tidak ditemukan" }, { status: 404 });
    }

    if (room.leases.length > 0 || room.status === "OCCUPIED") {
      return NextResponse.json(
        { error: "Kamar tidak dapat dihapus karena sedang dihuni oleh penyewa aktif" },
        { status: 400 }
      );
    }

    await prisma.room.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: `Kamar ${room.roomNumber} berhasil dihapus`,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }
    console.error("Delete room error:", error);
    return NextResponse.json({ error: "Gagal menghapus kamar" }, { status: 500 });
  }
}
