import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

import { inquirySchema } from "../validations/inquiry.schema";

export const createInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = inquirySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validasi gagal", details: parsed.error.flatten().fieldErrors });
      return;
    }

    let roomTypeId = parsed.data.roomTypeId;
    let roomTypeName = "Kamar";

    if (!roomTypeId && parsed.data.slug) {
      const foundType = await prisma.roomType.findUnique({ where: { slug: parsed.data.slug } });
      if (foundType) {
        roomTypeId = foundType.id;
        roomTypeName = foundType.name;
      }
    } else if (roomTypeId) {
      const foundType = await prisma.roomType.findUnique({ where: { id: roomTypeId } });
      if (foundType) {
        roomTypeName = foundType.name;
      }
    }

    const checkIn = parsed.data.checkInDate ? new Date(parsed.data.checkInDate) : null;

    const inquiry = await prisma.bookingInquiry.create({
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone,
        roomTypeId: roomTypeId || null,
        checkInDate: checkIn,
        notes: parsed.data.notes || null,
        status: "NEW",
      },
    });

    const adminPhone = "6281234567890";
    const waText = encodeURIComponent(
      `Halo Pengelola Kostara, saya ${parsed.data.name} (${parsed.data.phone}) ingin menanyakan ketersediaan/reservasi untuk ${roomTypeName}.\n` +
      (checkIn ? `Rencana masuk: ${checkIn.toLocaleDateString("id-ID")}\n` : "") +
      (parsed.data.notes ? `Catatan: ${parsed.data.notes}` : "")
    );
    const whatsappUrl = `https://wa.me/${adminPhone}?text=${waText}`;

    res.status(201).json({
      success: true,
      message: "Permintaan pemesanan berhasil dicatat",
      data: inquiry,
      whatsappUrl,
    });
  } catch (error) {
    console.error("Booking inquiry error:", error);
    res.status(500).json({ error: "Gagal memproses pemesanan kamar" });
  }
};

export const getAdminInquiries = async (_req: Request, res: Response): Promise<void> => {
  try {
    const inquiries = await prisma.bookingInquiry.findMany({
      include: { roomType: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: inquiries });
  } catch (error) {
    console.error("Admin inquiries error:", error);
    res.status(500).json({ error: "Gagal memuat daftar pemesanan kamar" });
  }
};

export const updateInquiryStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status, notes } = req.body;

    const updated = await prisma.bookingInquiry.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
      include: { roomType: true },
    });

    res.json({ success: true, message: "Status reservasi berhasil diperbarui", data: updated });
  } catch (error) {
    console.error("Update inquiry error:", error);
    res.status(500).json({ error: "Gagal memperbarui status reservasi" });
  }
};

export const deleteInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.bookingInquiry.delete({
      where: { id },
    });
    res.json({ success: true, message: "Reservasi berhasil dihapus permanen" });
  } catch (error) {
    console.error("Delete inquiry error:", error);
    res.status(500).json({ error: "Gagal menghapus reservasi" });
  }
};
