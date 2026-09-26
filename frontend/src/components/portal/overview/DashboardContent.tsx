"use client";

import { useState, useEffect } from "react";
import { Home, Receipt, Wrench, Clock, ChevronRight, AlertCircle, Phone, ArrowUpRight, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { PortalInvoiceItem, PortalComplaintItem } from "@/types/portal";

export default function DashboardContent() {
  const [profile, setProfile] = useState<any>(null);
  const [invoices, setInvoices] = useState<PortalInvoiceItem[]>([]);
  const [complaints, setComplaints] = useState<PortalComplaintItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [meRes, invRes, compRes] = await Promise.all([
          apiFetch<{ authenticated: boolean; user: any }>("/api/auth/me"),
          apiFetch<{ data: PortalInvoiceItem[] }>("/api/portal/invoices").catch(() => ({ data: [] })),
          apiFetch<{ data: PortalComplaintItem[] }>("/api/portal/complaints").catch(() => ({ data: [] })),
        ]);

        setProfile(meRes.user);
        setInvoices(invRes.data || []);
        setComplaints(compRes.data || []);
      } catch (err) {
        console.error("Failed to load portal dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const activeLease = profile?.tenant?.leases?.[0];
  const room = activeLease?.room;

  // Calculate days remaining
  let remainingDays = 0;
  if (activeLease?.endDate) {
    const end = new Date(activeLease.endDate).getTime();
    const now = new Date().getTime();
    remainingDays = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
  }

  // Active bill (unpaid or waiting confirmation)
  const currentBill = invoices.find(
    (b) => b.rawStatus === "PENDING" || b.rawStatus === "OVERDUE" || b.rawStatus === "WAITING_CONFIRMATION"
  );

  // Active complaints
  const activeRequests = complaints.filter((r) => r.rawStatus !== "RESOLVED" && r.rawStatus !== "REJECTED");

  const getUrgencyStyle = (days: number) => {
    if (days <= 7) return { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", icon: "text-red-500" };
    if (days <= 14) return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: "text-amber-500" };
    return { bg: "bg-[#F8F7F4]", text: "text-[#202321]", border: "border-[#E5E3DE]", icon: "text-[#1F3D35]" };
  };

  const urgency = getUrgencyStyle(remainingDays);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-[#6B716D]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1F3D35]" />
        <p className="mt-3 text-sm font-medium">Memuat data dashboard penghuni...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Hero Greeting Card (Spans 2 columns) */}
        <div className="md:col-span-2 relative overflow-hidden bg-white rounded-3xl p-8 border border-[#E5E3DE] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <Home className="w-64 h-64 -mt-12 -mr-12" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-[#202321] tracking-tight">
              Halo, {profile?.name?.split(" ")[0] || "Penghuni"}! 👋
            </h2>
            <p className="text-[#6B716D] mt-2 max-w-md leading-relaxed">
              Selamat datang di portal Kostara. Semoga hari Anda menyenangkan dan nyaman berada di kamar Anda.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E5E3DE] flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B716D]">Unit Kamar Anda</span>
              <p className="text-lg font-bold text-[#1F3D35]">
                {room ? `Kamar ${room.roomNumber} (${room.roomType?.name || "Standar"})` : "Belum Ada Kamar Terdaftar"}
              </p>
            </div>
            
            <Link 
              href="/portal/profil"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C69C6D] hover:text-[#1F3D35] transition-colors"
            >
              Lihat Detail Sewa <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 2. Masa Sewa Remaining Card */}
        <div className={`rounded-3xl p-8 border ${urgency.border} ${urgency.bg} flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.02)]`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B716D]">Sisa Masa Sewa</span>
              <Clock className={`w-5 h-5 ${urgency.icon}`} />
            </div>
            <div className="mt-4">
              <span className={`text-5xl font-extrabold tracking-tight ${urgency.text}`}>
                {remainingDays}
              </span>
              <span className="text-sm font-medium text-[#6B716D] ml-2">Hari lagi</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E5E3DE]/60 text-xs text-[#6B716D]">
            {activeLease?.endDate ? (
              <p>Berakhir pada: <strong className="text-[#202321]">{activeLease.endDate.split("T")[0]}</strong></p>
            ) : (
              <p>Masa sewa aktif</p>
            )}
          </div>
        </div>

      </div>

      {/* Row 2: Tagihan & Layanan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Status Tagihan */}
        <div className="bg-white rounded-3xl p-8 border border-[#E5E3DE] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#F8F7F4] flex items-center justify-center text-[#1F3D35]">
                <Receipt className="w-5 h-5" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                !currentBill 
                  ? "bg-green-50 text-green-700" 
                  : currentBill.rawStatus === "WAITING_CONFIRMATION"
                  ? "bg-amber-50 text-amber-700"
                  : "bg-red-50 text-red-600"
              }`}>
                {!currentBill 
                  ? "Lunas" 
                  : currentBill.rawStatus === "WAITING_CONFIRMATION" 
                  ? "Menunggu Konfirmasi" 
                  : "Belum Lunas"}
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#202321]">Tagihan Sewa</h3>
            
            {currentBill ? (
              <div className="mt-4 space-y-2">
                <p className="text-3xl font-extrabold text-[#1F3D35]">
                  Rp {currentBill.amount.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-[#6B716D] flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  Jatuh tempo: <strong className="text-[#202321]">{currentBill.dueDate}</strong>
                </p>
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold text-sm">Semua tagihan sewa Anda sudah lunas.</span>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-[#E5E3DE]">
            <Link
              href="/portal/tagihan"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1F3D35] px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#152923] transition-colors"
            >
              <span>{currentBill ? "Bayar / Upload Bukti" : "Lihat Riwayat Tagihan"}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Layanan Perbaikan / Komplain */}
        <div className="bg-white rounded-3xl p-8 border border-[#E5E3DE] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#F8F7F4] flex items-center justify-center text-[#1F3D35]">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-[#6B716D]">
                {activeRequests.length} Laporan Aktif
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#202321]">Layanan & Perbaikan</h3>
            
            <div className="mt-4 space-y-3">
              {activeRequests.length === 0 ? (
                <p className="text-sm text-[#6B716D]">
                  Tidak ada laporan kerusakan aktif. Semua fasilitas kamar Anda terpantau aman.
                </p>
              ) : (
                activeRequests.slice(0, 2).map((req) => (
                  <div key={req.id} className="rounded-xl border border-[#E5E3DE] p-3.5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#1F3D35] line-clamp-1">{req.issue}</p>
                      <p className="text-xs text-[#6B716D]">{req.category} • {req.date}</p>
                    </div>
                    <span className="rounded-md bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-700">
                      {req.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E5E3DE]">
            <Link
              href="/portal/komplain"
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#E5E3DE] bg-white px-5 py-3 text-sm font-bold text-[#1F3D35] hover:bg-[#F8F7F4] transition-colors"
            >
              <span>Ajukan Kendala Fasilitas</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
