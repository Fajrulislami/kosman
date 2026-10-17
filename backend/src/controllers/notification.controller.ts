import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export interface AdminNotificationItem {
  id: string;
  type: "INQUIRY" | "PAYMENT" | "COMPLAINT" | "OVERDUE" | "EXPIRING_LEASE";
  title: string;
  message: string;
  createdAt: string;
  link: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  meta?: Record<string, any>;
}

export const getAdminNotifications = async (_req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // 1. Inquiries yang baru (NEW)
    const inquiries = await prisma.bookingInquiry.findMany({
      where: { status: "NEW" },
      include: { roomType: true },
      orderBy: { createdAt: "desc" },
      take: 15,
    });

    // 2. Pembayaran menunggu verifikasi (PENDING)
    const payments = await prisma.payment.findMany({
      where: { status: "PENDING" },
      include: {
        invoice: {
          include: {
            lease: {
              include: {
                tenant: true,
                room: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 15,
    });

    // 3. Komplain belum ditangani (PENDING)
    const complaints = await prisma.complaint.findMany({
      where: { status: "PENDING" },
      include: {
        room: true,
        tenant: true,
      },
      orderBy: { createdAt: "desc" },
      take: 15,
    });

    // 4. Tagihan yang jatuh tempo (OVERDUE atau dueDate < now dan status PENDING)
    const overdueInvoices = await prisma.invoice.findMany({
      where: {
        OR: [
          { status: "OVERDUE" },
          {
            status: "PENDING",
            dueDate: { lt: now },
          },
        ],
      },
      include: {
        lease: {
          include: {
            tenant: true,
            room: true,
          },
        },
      },
      orderBy: { dueDate: "asc" },
      take: 10,
    });

    // 5. Masa sewa hampir habis (aktif dan berakhir dalam 7 hari)
    const expiringLeases = await prisma.lease.findMany({
      where: {
        status: "ACTIVE",
        endDate: {
          gte: now,
          lte: sevenDaysLater,
        },
      },
      include: {
        tenant: true,
        room: true,
      },
      orderBy: { endDate: "asc" },
      take: 10,
    });

    // Normalisasi dan bangun daftar seragam
    const notifications: AdminNotificationItem[] = [];

    // Inquiries
    for (const inq of inquiries) {
      notifications.push({
        id: `inquiry-${inq.id}`,
        type: "INQUIRY",
        title: "Reservasi Kamar Baru",
        message: `${inq.name} mengajukan survey/booking kamar ${inq.roomType?.name || "Kamar"}. No HP: ${inq.phone}`,
        createdAt: inq.createdAt.toISOString(),
        link: "/admin/penghuni?tab=inquiries",
        priority: "HIGH",
        meta: {
          inquiryId: inq.id,
          name: inq.name,
          phone: inq.phone,
          roomType: inq.roomType?.name,
        },
      });
    }

    // Payments
    for (const p of payments) {
      const tenantName = p.invoice?.lease?.tenant?.fullName || "Penghuni";
      const roomNum = p.invoice?.lease?.room?.roomNumber || "-";
      const invNum = p.invoice?.invoiceNumber || "-";
      const formattedAmount = `Rp ${p.amount.toLocaleString("id-ID")}`;

      notifications.push({
        id: `payment-${p.id}`,
        type: "PAYMENT",
        title: "Konfirmasi Pembayaran Masuk",
        message: `${tenantName} (Kamar ${roomNum}) mengunggah bukti transfer untuk ${invNum} (${formattedAmount}). Menunggu verifikasi.`,
        createdAt: p.createdAt.toISOString(),
        link: "/admin/tagihan",
        priority: "URGENT",
        meta: {
          paymentId: p.id,
          invoiceId: p.invoiceId,
          amount: p.amount,
          proofImageUrl: p.proofImageUrl,
        },
      });
    }

    // Complaints
    for (const c of complaints) {
      const roomNum = c.room?.roomNumber || "-";
      const tenantName = c.tenant?.fullName || "Penghuni";

      notifications.push({
        id: `complaint-${c.id}`,
        type: "COMPLAINT",
        title: `Keluhan Baru • Kamar ${roomNum}`,
        message: `${c.title} (${c.category}) dilaporkan oleh ${tenantName}. Prioritas: ${c.priority}.`,
        createdAt: c.createdAt.toISOString(),
        link: "/admin/komplain",
        priority: c.priority === "URGENT" || c.priority === "HIGH" ? "URGENT" : "HIGH",
        meta: {
          complaintId: c.id,
          roomNumber: roomNum,
          ticketNumber: c.ticketNumber,
          category: c.category,
        },
      });
    }

    // Overdue Invoices
    for (const inv of overdueInvoices) {
      const tenantName = inv.lease?.tenant?.fullName || "Penghuni";
      const roomNum = inv.lease?.room?.roomNumber || "-";
      const formattedAmount = `Rp ${inv.amount.toLocaleString("id-ID")}`;
      const dueDateFormatted = new Date(inv.dueDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      notifications.push({
        id: `overdue-${inv.id}`,
        type: "OVERDUE",
        title: "Tagihan Jatuh Tempo",
        message: `Tagihan ${inv.invoiceNumber} (${formattedAmount}) milik ${tenantName} (Kamar ${roomNum}) telah jatuh tempo sejak ${dueDateFormatted}.`,
        createdAt: inv.dueDate.toISOString(),
        link: "/admin/tagihan",
        priority: "MEDIUM",
        meta: {
          invoiceId: inv.id,
          invoiceNumber: inv.invoiceNumber,
          amount: inv.amount,
        },
      });
    }

    // Expiring Leases
    for (const l of expiringLeases) {
      const tenantName = l.tenant?.fullName || "Penghuni";
      const roomNum = l.room?.roomNumber || "-";
      const daysLeft = Math.ceil((new Date(l.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const endFormatted = new Date(l.endDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      notifications.push({
        id: `lease-${l.id}`,
        type: "EXPIRING_LEASE",
        title: "Masa Sewa Hampir Berakhir",
        message: `Masa sewa ${tenantName} (Kamar ${roomNum}) akan berakhir dalam ${daysLeft} hari (${endFormatted}). Perlu konfirmasi perpanjangan atau checkout.`,
        createdAt: l.endDate.toISOString(),
        link: "/admin/penghuni",
        priority: "MEDIUM",
        meta: {
          leaseId: l.id,
          tenantName,
          roomNumber: roomNum,
          daysLeft,
        },
      });
    }

    // Urutkan notifikasi: yang paling baru di atas
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      success: true,
      totalUnread: notifications.length,
      counts: {
        inquiries: inquiries.length,
        pendingPayments: payments.length,
        pendingComplaints: complaints.length,
        overdueInvoices: overdueInvoices.length,
        expiringLeases: expiringLeases.length,
      },
      notifications,
    });
  } catch (error) {
    console.error("Get admin notifications error:", error);
    res.status(500).json({ error: "Gagal memuat notifikasi admin" });
  }
};
