import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";
import { ComplaintStatus } from "@prisma/client";

const updateStatusSchema = z.object({
  status: z.nativeEnum(ComplaintStatus),
  resolutionNote: z.string().optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const parsed = updateStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Data validasi tidak sesuai" }, { status: 400 });
    }

    const { status, resolutionNote } = parsed.data;

    const updated = await prisma.complaint.update({
      where: { id },
      data: {
        status,
        resolutionNote: resolutionNote !== undefined ? resolutionNote : undefined,
        resolvedAt: status === ComplaintStatus.RESOLVED ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Status tiket perbaikan diperbarui menjadi ${status}`,
      data: updated,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }
    console.error("Update complaint status error:", error);
    return NextResponse.json({ error: "Gagal memperbarui status komplain" }, { status: 500 });
  }
}
