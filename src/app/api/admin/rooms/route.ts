import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";
import { RoomStatus } from "@prisma/client";

const createRoomSchema = z.object({
  roomNumber: z.string().min(1, "Nomor kamar wajib diisi"),
  floor: z.number().int().min(1).default(1),
  roomTypeId: z.string().min(1, "Tipe kamar wajib dipilih"),
  notes: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as RoomStatus | null;
    const roomTypeId = searchParams.get("roomTypeId");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (roomTypeId) where.roomTypeId = roomTypeId;

    const rooms = await prisma.room.findMany({
      where,
      include: {
        roomType: true,
        leases: {
          where: { status: "ACTIVE" },
          include: { tenant: true },
          take: 1,
        },
      },
      orderBy: { roomNumber: "asc" },
    });

    const formatted = rooms.map((room) => {
      const activeLease = room.leases[0];
      return {
        id: room.id,
        number: room.roomNumber,
        floor: room.floor,
        type: room.roomType.name,
        roomTypeId: room.roomTypeId,
        price: `Rp ${room.roomType.basePrice.toLocaleString("id-ID")}`,
        rawPrice: room.roomType.basePrice,
        status:
          room.status === "OCCUPIED"
            ? "Terisi"
            : room.status === "AVAILABLE"
            ? "Kosong"
            : room.status === "MAINTENANCE"
            ? "Perbaikan"
            : "Dipesan",
        rawStatus: room.status,
        tenant: activeLease ? activeLease.tenant.fullName : "-",
        tenantId: activeLease?.tenantId ?? null,
        notes: room.notes,
      };
    });

    // Ringkasan statistik kamar
    const totalRooms = await prisma.room.count();
    const occupiedCount = await prisma.room.count({ where: { status: "OCCUPIED" } });
    const availableCount = await prisma.room.count({ where: { status: "AVAILABLE" } });
    const maintenanceCount = await prisma.room.count({ where: { status: "MAINTENANCE" } });

    return NextResponse.json({
      data: formatted,
      stats: {
        total: totalRooms,
        occupied: occupiedCount,
        available: availableCount,
        maintenance: maintenanceCount,
        occupancyRate: totalRooms > 0 ? Math.round((occupiedCount / totalRooms) * 100) : 0,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sesi tidak valid atau telah berakhir" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Akses khusus admin" }, { status: 403 });
    }
    console.error("Admin rooms API error:", error);
    return NextResponse.json({ error: "Gagal memuat data kamar" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();
    const parsed = createRoomSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { roomNumber, floor, roomTypeId, notes } = parsed.data;

    // Cek apakah nomor kamar sudah ada
    const existing = await prisma.room.findUnique({
      where: { roomNumber },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Kamar dengan nomor ${roomNumber} sudah terdaftar` },
        { status: 409 }
      );
    }

    const newRoom = await prisma.room.create({
      data: {
        roomNumber,
        floor,
        roomTypeId,
        notes,
        status: RoomStatus.AVAILABLE,
      },
      include: { roomType: true },
    });

    return NextResponse.json({
      success: true,
      message: "Unit kamar baru berhasil ditambahkan",
      data: newRoom,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }
    console.error("Create room API error:", error);
    return NextResponse.json({ error: "Gagal menambahkan kamar" }, { status: 500 });
  }
}
