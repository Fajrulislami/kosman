import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "../middlewares/auth";
import { createComplaintSchema, updateComplaintSchema } from "../validations/complaint.schema";

export const getPortalComplaints = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!tenant) {
      res.status(404).json({ error: "Data penghuni tidak ditemukan" });
      return;
    }

    const complaints = await prisma.complaint.findMany({
      where: { tenantId: tenant.id },
      include: { room: true },
      orderBy: { createdAt: "desc" },
    });

    const formatted = complaints.map((c) => ({
      id: c.id,
      ticketNumber: c.ticketNumber,
      category: c.category,
      issue: c.title,
      description: c.description,
      images: JSON.parse(c.images || "[]"),
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

    res.json({ data: formatted });
  } catch (error) {
    console.error("Portal complaints error:", error);
    res.status(500).json({ error: "Gagal memuat daftar keluhan portal" });
  }
};

export const submitComplaint = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parsed = createComplaintSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Input validasi tidak sesuai", details: parsed.error.flatten() });
      return;
    }

    const tenant = await prisma.tenant.findUnique({
      where: { userId: req.user!.userId },
      include: {
        leases: { where: { status: "ACTIVE" }, take: 1 },
      },
    });

    if (!tenant || tenant.leases.length === 0) {
      res.status(400).json({ error: "Anda tidak memiliki kamar aktif saat ini" });
      return;
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
        images: JSON.stringify(images),
        priority,
        status: "PENDING",
      },
    });

    res.status(201).json({
      success: true,
      message: "Laporan keluhan berhasil dikirim. Teknisi kami akan segera menindaklanjuti.",
      data: complaint,
    });
  } catch (error) {
    console.error("Submit complaint error:", error);
    res.status(500).json({ error: "Gagal mengirim laporan keluhan" });
  }
};

export const getAdminComplaints = async (req: Request, res: Response): Promise<void> => {
  try {
    const status = req.query.status ? String(req.query.status) : undefined;
    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const complaints = await prisma.complaint.findMany({
      where,
      include: { tenant: true, room: true },
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
      images: JSON.parse(c.images || "[]"),
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

    res.json({
      data: formatted,
      stats: { total, pending, inProgress, resolved },
    });
  } catch (error) {
    console.error("Admin complaints error:", error);
    res.status(500).json({ error: "Gagal memuat tiket komplain admin" });
  }
};

export const updateComplaintStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const parsed = updateComplaintSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: "Data validasi tidak sesuai" });
      return;
    }

    const { status, resolutionNote } = parsed.data;

    const updated = await prisma.complaint.update({
      where: { id },
      data: {
        status,
        resolutionNote: resolutionNote !== undefined ? resolutionNote : undefined,
        resolvedAt: status === "RESOLVED" ? new Date() : null,
      },
    });

    res.json({
      success: true,
      message: `Status tiket perbaikan diperbarui menjadi ${status}`,
      data: updated,
    });
  } catch (error) {
    console.error("Update complaint status error:", error);
    res.status(500).json({ error: "Gagal memperbarui status komplain" });
  }
};
