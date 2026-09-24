import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { ComplaintStatus } from "@prisma/client";

export async function GET(req: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as ComplaintStatus | null;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const complaints = await prisma.complaint.findMany({
      where,
      include: {
        tenant: true,
        room: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = complaints.map((c) => ({
      id: c.id,
      ticketNumber: c.ticketNumber,
      tenantName: c.tenant.fullName,
      tenantPhone: c.tenant.phone,
      roomNumber: c.room.roomNumber,
      category: c.category,
      title: c.title,
      description: c.description,
      images: c.images,
      priority: c.priority,
      status: c.status,
      createdAt: c.createdAt.toISOString(),
      resolvedAt: c.resolvedAt?.toISOString() || null,
      resolutionNote: c.resolutionNote,
    }));

    const total = await prisma.complaint.count();
    const pending = await prisma.complaint.count({ where: { status: "PENDING" } });
    const inProgress = await prisma.complaint.count({ where: { status: "IN_PROGRESS" } });
    const resolved = await prisma.complaint.count({ where: { status: "RESOLVED" } });

    return NextResponse.json({
      data: formatted,
      stats: { total, pending, inProgress, resolved },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }
    console.error("Admin complaints GET error:", error);
    return NextResponse.json({ error: "Gagal memuat tiket komplain" }, { status: 500 });
  }
}
