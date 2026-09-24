import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/auth";
import { z } from "zod";
import { ComplaintCategory, ComplaintPriority, ComplaintStatus } from "@prisma/client";

const createComplaintSchema = z.object({
  category: z.nativeEnum(ComplaintCategory),
  title: z.string().min(3, "Judul keluhan minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi keluhan minimal 10 karakter"),
  images: z.array(z.string()).default([]),
  priority: z.nativeEnum(ComplaintPriority).default(ComplaintPriority.MEDIUM),
});

export async function GET() {
  try {
    const session = await requireTenant();

    const tenant = await prisma.tenant.findUnique({
      where: { userId: session.userId },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Data penghuni tidak ditemukan" }, { status: 404 });
    }

    const complaints = await prisma.complaint.findMany({
      where: { tenantId: tenant.id },
      include: {
        room: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = complaints.map((c) => ({
      id: c.id,
      ticketNumber: c.ticketNumber,
      category: c.category,
      issue: c.title,
      description: c.description,
      images: c.images,
      priority: c.priority,
      status:
        c.status === "RESOLVED"
          ? "Selesai"
          : c.status === "IN_PROGRESS"
          ? "Diproses"
          : c.status === "REJECTED"
          ? "Ditolak"
          : "Menunggu",
      rawStatus: c.status,
      date: c.createdAt.toISOString().split("T")[0],
      resolvedDate: c.resolvedAt ? c.resolvedAt.toISOString().split("T")[0] : null,
      resolutionNote: c.resolutionNote,
    }));

    return NextResponse.json({ data: formatted });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Akses khusus penghuni" }, { status: 403 });
    }
    console.error("Portal complaints GET error:", error);
    return NextResponse.json({ error: "Gagal memuat daftar keluhan" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireTenant();
    const body = await req.json();

    const parsed = createComplaintSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Input validasi tidak sesuai", details: parsed.error.flatten() }, { status: 400 });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { userId: session.userId },
      include: {
        leases: {
          where: { status: "ACTIVE" },
          take: 1,
        },
      },
    });

    if (!tenant || tenant.leases.length === 0) {
      return NextResponse.json({ error: "Anda tidak memiliki kamar aktif saat ini" }, { status: 400 });
    }

    const activeRoomId = tenant.leases[0].roomId;
    const ticketCount = await prisma.complaint.count();
    const ticketNumber = `REQ-${String(ticketCount + 1).padStart(3, "0")}`;

    const { category, title, description, images, priority } = parsed.data;

    const complaint = await prisma.complaint.create({
      data: {
        ticketNumber,
        tenantId: tenant.id,
        roomId: activeRoomId,
        category,
        title,
        description,
        images,
        priority,
        status: ComplaintStatus.PENDING,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Laporan keluhan berhasil dikirim. Teknisi kami akan segera menindaklanjuti.",
        data: complaint,
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
    console.error("Portal complaints POST error:", error);
    return NextResponse.json({ error: "Gagal mengirim laporan keluhan" }, { status: 500 });
  }
}
