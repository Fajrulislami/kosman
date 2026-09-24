import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, hashPassword } from "@/lib/auth";
import { registerTenantSchema } from "@/lib/validations/auth";
import { Role, RoomStatus, LeaseStatus } from "@prisma/client";

export async function GET(req: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase();

    const tenants = await prisma.tenant.findMany({
      include: {
        user: { select: { email: true } },
        leases: {
          where: { status: "ACTIVE" },
          include: {
            room: { include: { roomType: true } },
          },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = tenants
      .map((tenant) => {
        const activeLease = tenant.leases[0];
        return {
          id: tenant.id,
          name: tenant.fullName,
          email: tenant.user?.email || "-",
          phone: tenant.phone,
          nik: tenant.nik,
          occupation: tenant.occupation || "-",
          room: activeLease ? `Kamar ${activeLease.room.roomNumber} (${activeLease.room.roomType.name})` : "Belum Ada",
          roomNumber: activeLease?.room.roomNumber || "-",
          roomId: activeLease?.roomId || null,
          leaseId: activeLease?.id || null,
          startDate: activeLease ? activeLease.startDate.toISOString().split("T")[0] : "-",
          endDate: activeLease ? activeLease.endDate.toISOString().split("T")[0] : "-",
          rentAmount: activeLease ? `Rp ${activeLease.rentAmount.toLocaleString("id-ID")}` : "-",
          status: activeLease ? "Aktif" : "Non-Aktif",
          emergencyContact: {
            name: tenant.emergencyName || "-",
            phone: tenant.emergencyPhone || "-",
            relation: tenant.emergencyRelation || "-",
          },
        };
      })
      .filter((t) => {
        if (!search) return true;
        return (
          t.name.toLowerCase().includes(search) ||
          t.phone.includes(search) ||
          t.roomNumber.toLowerCase().includes(search)
        );
      });

    const totalTenants = await prisma.tenant.count();
    const activeTenants = await prisma.lease.count({ where: { status: "ACTIVE" } });

    return NextResponse.json({
      data: formatted,
      stats: {
        total: totalTenants,
        active: activeTenants,
        inactive: totalTenants - activeTenants,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }
    console.error("Admin tenants GET error:", error);
    return NextResponse.json({ error: "Gagal memuat data penghuni" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();
    const parsed = registerTenantSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      fullName,
      nik,
      phone,
      email,
      password,
      roomId,
      startDate,
      endDate,
      depositAmount,
      emergencyName,
      emergencyPhone,
      emergencyRelation,
      occupation,
    } = parsed.data;

    // 1. Cek duplikasi NIK atau Email
    const existingNik = await prisma.tenant.findUnique({ where: { nik } });
    if (existingNik) {
      return NextResponse.json({ error: `NIK ${nik} sudah terdaftar` }, { status: 409 });
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json({ error: `Email ${email} sudah digunakan` }, { status: 409 });
    }

    // 2. Cek ketersediaan kamar
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { roomType: true },
    });

    if (!room) {
      return NextResponse.json({ error: "Kamar tidak ditemukan" }, { status: 404 });
    }

    if (room.status === RoomStatus.OCCUPIED) {
      return NextResponse.json({ error: `Kamar ${room.roomNumber} sedang terisi` }, { status: 400 });
    }

    // 3. Eksekusi Transaksi Database (User + Tenant + Lease + Update Room Status)
    const result = await prisma.$transaction(async (tx) => {
      // Buat akun User untuk login portal
      const defaultPassword = password || "kostara123456";
      const passwordHash = await hashPassword(defaultPassword);

      const user = await tx.user.create({
        data: {
          email,
          name: fullName,
          passwordHash,
          role: Role.TENANT,
        },
      });

      // Buat data Tenant
      const tenant = await tx.tenant.create({
        data: {
          userId: user.id,
          fullName,
          nik,
          phone,
          emergencyName,
          emergencyPhone,
          emergencyRelation,
          occupation,
        },
      });

      // Buat Kontrak Sewa (Lease)
      const lease = await tx.lease.create({
        data: {
          tenantId: tenant.id,
          roomId: room.id,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          rentAmount: room.roomType.basePrice,
          depositAmount: depositAmount || room.roomType.depositPrice,
          status: LeaseStatus.ACTIVE,
        },
      });

      // Update status kamar fisik menjadi OCCUPIED
      await tx.room.update({
        where: { id: room.id },
        data: { status: RoomStatus.OCCUPIED },
      });

      // Generate invoice pertama
      const invoiceNumber = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${room.roomNumber}`;
      await tx.invoice.create({
        data: {
          invoiceNumber,
          leaseId: lease.id,
          amount: room.roomType.basePrice,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 hari dari sekarang
          periodMonth: new Date().getMonth() + 1,
          periodYear: new Date().getFullYear(),
        },
      });

      return { tenant, lease };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Penghuni baru berhasil didaftarkan dan kamar berhasil dialokasikan",
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }
    console.error("Admin tenants POST error:", error);
    return NextResponse.json({ error: "Gagal mendaftarkan penghuni baru" }, { status: 500 });
  }
}
