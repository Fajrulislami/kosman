"use client";

import Link from "next/link";
import { CheckCircle2, AlertTriangle, UserPlus, Clock, ChevronRight } from "lucide-react";
import { DashboardOverview } from "@/types/admin";

interface RecentActivityProps {
  recentActivities?: DashboardOverview["recentActivities"];
}

// Format waktu relatif bahasa Indonesia ramah pengguna
function formatRelativeTime(dateString?: string): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";

  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.max(0, Math.floor(diffInMs / 1000));
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return "Baru saja";
  }
  if (diffInMinutes < 60) {
    return `${diffInMinutes} menit lalu`;
  }
  if (diffInHours < 24) {
    return `${diffInHours} jam lalu`;
  }
  if (diffInDays === 1) {
    const hours = String(date.getHours()).padStart(2, "0");
    const mins = String(date.getMinutes()).padStart(2, "0");
    return `Kemarin, ${hours}:${mins}`;
  }
  if (diffInDays < 7) {
    return `${diffInDays} hari lalu`;
  }

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function RecentActivity({ recentActivities }: RecentActivityProps) {
  const payments = recentActivities?.payments || [];
  const complaints = recentActivities?.complaints || [];
  const inquiries = recentActivities?.inquiries || [];

  // 1. Gabungkan semua event dari ketiga sumber
  const combinedActivities = [
    ...payments.map((p: any) => ({
      id: `pay-${p.id}`,
      type: "payment",
      title: `${p.invoice?.lease?.tenant?.fullName || (p.invoice?.invoiceNumber ? `Tagihan #${p.invoice.invoiceNumber}` : "Penghuni")} (Kamar ${p.invoice?.lease?.room?.roomNumber || "-"})`,
      subtitle: `Membayar tagihan Rp ${Number(p.amount || 0).toLocaleString("id-ID")}`,
      rawDate: p.createdAt,
      time: formatRelativeTime(p.createdAt),
      href: p.invoice?.invoiceNumber ? `/admin/tagihan?search=${encodeURIComponent(p.invoice.invoiceNumber)}&tab=lunas` : "/admin/tagihan?tab=lunas",
      icon: CheckCircle2,
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
      badgeText: "Pembayaran",
      badgeColor: "bg-green-50 text-green-700 border-green-200",
    })),
    ...complaints.map((c: any) => ({
      id: `comp-${c.id}`,
      type: "complaint",
      title: `Komplain Kamar ${c.room?.roomNumber || "-"}`,
      subtitle: c.title,
      rawDate: c.createdAt,
      time: formatRelativeTime(c.createdAt),
      href: c.ticketNumber ? `/admin/komplain?search=${encodeURIComponent(c.ticketNumber)}&tab=masuk` : "/admin/komplain?tab=masuk",
      icon: AlertTriangle,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-50",
      badgeText: "Komplain",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    })),
    ...inquiries.map((inq: any) => ({
      id: `inq-${inq.id}`,
      type: "inquiry",
      title: `Calon Penghuni: ${inq.name}`,
      subtitle: `Minat sewa ${inq.roomType?.name || "Kamar"}`,
      rawDate: inq.createdAt,
      time: formatRelativeTime(inq.createdAt),
      href: "/admin/penghuni",
      icon: UserPlus,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      badgeText: "Prospek Baru",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    })),
  ]
    .filter((item) => !!item.rawDate)
    // 2. Urutkan secara murni kronologis descending (paling baru di atas)
    .sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime())
    // 3. Batasi 5 aktivitas teratas
    .slice(0, 5);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#E5E3DE]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#1F3D35]">Aktivitas Terbaru</h2>
          <p className="text-xs text-[#6B716D]">Transaksi, komplain, & prospek masuk</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Real-time
        </span>
      </div>

      <div className="flow-root">
        {combinedActivities.length === 0 ? (
          <div className="py-10 text-center text-sm text-[#99A09C]">
            <Clock className="mx-auto h-8 w-8 mb-2 opacity-40 text-[#1F3D35]" />
            <p className="font-semibold text-xs text-[#6B716D]">Belum ada aktivitas baru</p>
            <p className="text-[11px] mt-0.5">Transaksi, keluhan, atau calon penghuni akan tercatat di sini.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {combinedActivities.map((activity) => (
              <Link
                key={activity.id}
                href={activity.href}
                className="group flex items-start gap-3 rounded-2xl p-3 transition-all hover:bg-[#F8F7F4] border border-transparent hover:border-[#E5E3DE] cursor-pointer"
                title={`Buka ${activity.badgeText}`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-xs ${activity.bgColor} transition-transform group-hover:scale-105`}
                >
                  <activity.icon className={`h-5 w-5 ${activity.iconColor}`} aria-hidden="true" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border ${activity.badgeColor}`}>
                      {activity.badgeText}
                    </span>
                    <span className="text-[11px] font-medium text-[#99A09C] shrink-0">
                      {activity.time}
                    </span>
                  </div>

                  <p className="mt-1 text-xs font-bold text-[#1F3D35] truncate group-hover:text-[#162E28]">
                    {activity.title}
                  </p>
                  <p className="text-[11px] text-[#6B716D] truncate mt-0.5">
                    {activity.subtitle}
                  </p>
                </div>

                <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity text-[#99A09C] group-hover:text-[#1F3D35]">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
