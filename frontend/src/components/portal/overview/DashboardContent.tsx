"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Home,
  Receipt,
  Wrench,
  ChevronRight,
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  Loader2,
  CheckCircle2,
  CheckCircle,
  X,
  RefreshCw,
  MessageSquare,
  Clock,
  Send,
  CalendarPlus,
} from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { PortalInvoiceItem, PortalComplaintItem, PortalLeaseExtensionItem } from "@/types/portal";
import { createWhatsAppLink } from "@/lib/whatsapp";
import LeaseStatusCard from "./LeaseStatusCard";
import ExtendLeaseModal from "./ExtendLeaseModal";
import StatCard from "./StatCard";

export default function DashboardContent() {
  const [profile, setProfile] = useState<any>(null);
  const [invoices, setInvoices] = useState<PortalInvoiceItem[]>([]);
  const [complaints, setComplaints] = useState<PortalComplaintItem[]>([]);
  const [extensionStatus, setExtensionStatus] = useState<PortalLeaseExtensionItem | null>(null);
  const [propertyPhone, setPropertyPhone] = useState("081122223333");
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [extendSuccessMessage, setExtendSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
        setError(null);
      }
      const [meRes, invRes, compRes, extRes, settingsRes] = await Promise.all([
        apiFetch<{ authenticated: boolean; user: any }>("/api/auth/me"),
        apiFetch<{ data: PortalInvoiceItem[] }>("/api/portal/invoices").catch(() => ({ data: [] })),
        apiFetch<{ data: PortalComplaintItem[] }>("/api/portal/complaints").catch(() => ({ data: [] })),
        apiFetch<{ data: PortalLeaseExtensionItem | null }>("/api/portal/lease/extension-status").catch(() => ({ data: null })),
        apiFetch<{ data: { profile?: { phone?: string } } }>("/api/settings").catch(() => null),
      ]);

      setProfile(meRes.user);
      setInvoices(invRes.data || []);
      // Filter out legacy "Administrasi & Sewa" complaints so they don't pollute maintenance tickets
      setComplaints((compRes.data || []).filter((c) => c.category !== "Administrasi & Sewa"));
      setExtensionStatus(extRes.data || null);

      if (settingsRes?.data?.profile?.phone) {
        setPropertyPhone(settingsRes.data.profile.phone);
      }
    } catch (err) {
      if (!silent) {
        console.error("Failed to load portal dashboard:", err);
        setError("Gagal memuat data dashboard penghuni. Periksa koneksi internet Anda atau coba muat ulang.");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();

    // Auto-refresh saat kembali fokus ke tab atau tab menjadi visible
    const handleSync = () => loadDashboardData(true);
    window.addEventListener("focus", handleSync);
    document.addEventListener("visibilitychange", handleSync);

    // Auto-polling setiap 8 detik
    const interval = setInterval(() => loadDashboardData(true), 8000);

    return () => {
      window.removeEventListener("focus", handleSync);
      document.removeEventListener("visibilitychange", handleSync);
      clearInterval(interval);
    };
  }, [loadDashboardData]);

  // Prioritaskan kontrak yang sedang ACTIVE, jika tidak ada fallback ke kontrak terbaru
  const activeLease = profile?.tenant?.leases?.find((l: any) => l.status === "ACTIVE") || profile?.tenant?.leases?.[0];
  const room = activeLease?.room;

  // Filter khusus keluhan/layanan fasilitas kamar
  const facilityRequests = complaints.filter(
    (r) => r.rawStatus !== "RESOLVED" && r.rawStatus !== "REJECTED"
  );

  // Active bill: prioritaskan tagihan yang paling mendesak (OVERDUE -> REJECTED -> WAITING_CONFIRMATION -> PENDING)
  const currentBill =
    invoices.find((b) => b.rawStatus === "OVERDUE") ||
    invoices.find((b) => b.payment?.status === "REJECTED") ||
    invoices.find((b) => b.rawStatus === "WAITING_CONFIRMATION") ||
    invoices.find((b) => b.rawStatus === "PENDING");

  const isRejected = currentBill?.payment?.status === "REJECTED";
  const isWaiting = currentBill?.rawStatus === "WAITING_CONFIRMATION";
  const isOverdue = currentBill?.rawStatus === "OVERDUE";

  // Perhitungan masa sewa untuk statistik ringkas
  const end = activeLease?.endDate ? new Date(activeLease.endDate).getTime() : 0;
  const now = new Date().getTime();
  const rawDiffDays = activeLease?.endDate ? Math.ceil((end - now) / (1000 * 60 * 60 * 24)) : 0;
  const remainingDays = Math.max(0, rawDiffDays);
  const formattedEndDate = activeLease?.endDate
    ? new Date(activeLease.endDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";
  const isExpired = activeLease && (rawDiffDays <= 0 || activeLease.status === "EXPIRED" || activeLease.status === "TERMINATED");

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-[#6B716D]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1F3D35]" />
        <p className="mt-3 text-sm font-medium">Memuat data dashboard penghuni...</p>
      </div>
    );
  }

  // Tampilan Error State jika API gagal dimuat
  if (error && !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-500 border border-red-200 flex items-center justify-center mb-4 shadow-sm">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#202321]">Gagal Memuat Dashboard</h2>
        <p className="text-sm text-[#6B716D] mt-1.5 max-w-md leading-relaxed">
          {error}
        </p>
        <button
          onClick={() => loadDashboardData()}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1F3D35] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#152923] transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Coba Muat Ulang</span>
        </button>
      </div>
    );
  }

  const waHelpUrl = createWhatsAppLink(
    propertyPhone,
    `Halo Pengelola Kostara, saya ${profile?.name || "Penghuni"}${room ? ` dari Kamar ${room.roomNumber}` : ""}. Saya ingin berkonsultasi perihal layanan kos. Terima kasih!`
  );

  return (
    <div className="space-y-6">
      {/* Banner Notifikasi Pengajuan Perpanjangan Berhasil Dikirim */}
      {extendSuccessMessage && (
        <div className="flex items-start justify-between gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-emerald-900">Pengajuan Berhasil Dikirimkan</p>
              <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">{extendSuccessMessage}</p>
            </div>
          </div>
          <button
            onClick={() => setExtendSuccessMessage(null)}
            className="text-emerald-500 hover:text-emerald-700 p-1 rounded-lg transition-colors cursor-pointer"
            title="Tutup pemberitahuan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Banner Perpanjangan Sedang Ditinjau Admin */}
      {extensionStatus?.status === "PENDING" && !extendSuccessMessage && (
        <div className="flex items-start justify-between gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <p className="font-bold text-sm text-amber-950">
                Pengajuan Perpanjangan Sewa (+{extensionStatus.durationMonths} Bulan) Sedang Ditinjau
              </p>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                Permohonan perpanjangan hingga <strong>{new Date(extensionStatus.proposedEndDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</strong> sedang ditinjau oleh Admin. Setelah disetujui, masa sewa akan otomatis diperpanjang dan invoice tagihan diterbitkan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Baris Ringkasan Metrik Cepat (Quick Stats) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Unit Kamar"
          value={room ? `Kamar ${room.roomNumber}` : "Belum Ada"}
          subtitle={room?.roomType?.name || "Alokasi kamar"}
          icon={Home}
          href="/portal/profil"
          badge={room ? { text: "Terdaftar", variant: "green" } : { text: "Menunggu", variant: "neutral" }}
        />
        <StatCard
          title="Masa Sewa"
          value={!activeLease ? "-" : isExpired ? (extensionStatus?.status === "PENDING" ? "Ditinjau" : "Berakhir") : `${remainingDays} Hari`}
          subtitle={!activeLease ? "Belum ada kontrak" : `Sampai ${formattedEndDate}`}
          icon={Clock}
          href="/portal/profil"
          badge={
            !activeLease
              ? undefined
              : extensionStatus?.status === "PENDING"
              ? { text: "Ditinjau", variant: "amber" }
              : isExpired
              ? { text: "Habis", variant: "red" }
              : remainingDays <= 7
              ? { text: "Kritis", variant: "red" }
              : { text: "Aktif", variant: "green" }
          }
        />
        <StatCard
          title="Tagihan Sewa"
          value={
            !currentBill
              ? "Lunas"
              : isWaiting
              ? "Verifikasi"
              : isRejected
              ? "Ditolak"
              : currentBill.amount >= 1000000
              ? `Rp ${(currentBill.amount / 1000000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} Jt`
              : `Rp ${currentBill.amount.toLocaleString("id-ID")}`
          }
          subtitle={currentBill ? `Jatuh tempo: ${currentBill.dueDate}` : "Tidak ada tunggakan"}
          icon={Receipt}
          href="/portal/tagihan"
          badge={
            !currentBill
              ? { text: "Lunas", variant: "green" }
              : isRejected
              ? { text: "Ditolak", variant: "red" }
              : isWaiting
              ? { text: "Menunggu", variant: "amber" }
              : isOverdue
              ? { text: "Terlambat", variant: "red" }
              : { text: "Belum Lunas", variant: "red" }
          }
        />
        <StatCard
          title="Layanan Kamar"
          value={`${facilityRequests.length} Laporan`}
          subtitle={
            facilityRequests.length === 0
              ? "Fasilitas terpantau aman"
              : facilityRequests[0]?.issue && facilityRequests[0].issue.length > 25
              ? `${facilityRequests[0].issue.slice(0, 25)}...`
              : facilityRequests[0]?.issue || "Kendala fasilitas"
          }
          icon={Wrench}
          href="/portal/komplain"
          badge={facilityRequests.length === 0 ? { text: "Aman", variant: "green" } : { text: "Proses", variant: "amber" }}
        />
      </div>

      {/* Bento Grid Layout Utama */}
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
            
            <div className="flex items-center gap-3">
              <a
                href={waHelpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Bantuan WA</span>
              </a>

              <Link 
                href="/portal/profil"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C69C6D] hover:text-[#1F3D35] bg-[#F8F7F4] border border-[#E5E3DE] px-3.5 py-2 rounded-xl transition-colors"
              >
                <span>Detail Sewa</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Masa Sewa Remaining Card (Reaktif dengan Status Perpanjangan Resmi) */}
        <LeaseStatusCard
          activeLease={activeLease}
          tenantName={profile?.name}
          propertyPhone={propertyPhone}
          extensionStatus={extensionStatus}
          onOpenExtendModal={() => setIsExtendModalOpen(true)}
        />

      </div>

      {/* Row 2: Tagihan & Layanan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Status Tagihan Sewa */}
        <div className="bg-white rounded-3xl p-8 border border-[#E5E3DE] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#F8F7F4] flex items-center justify-center text-[#1F3D35]">
                <Receipt className="w-5 h-5" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                !currentBill 
                  ? "bg-green-50 text-green-700 border-green-200" 
                  : isRejected
                  ? "bg-red-50 text-red-700 border-red-200"
                  : isWaiting
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : isOverdue
                  ? "bg-red-100 text-red-800 border-red-300 font-extrabold"
                  : "bg-red-50 text-red-600 border-red-200"
              }`}>
                {!currentBill 
                  ? "Lunas" 
                  : isRejected
                  ? "Bukti Ditolak Admin"
                  : isWaiting
                  ? "Menunggu Konfirmasi"
                  : isOverdue
                  ? "Lewat Jatuh Tempo" 
                  : "Belum Lunas"}
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#202321]">Tagihan Sewa</h3>
            
            {currentBill ? (
              <div className="mt-4 space-y-3">
                <p className="text-3xl font-extrabold text-[#1F3D35]">
                  Rp {currentBill.amount.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-[#6B716D] flex items-center gap-1.5">
                  <AlertCircle className={`w-4 h-4 ${isOverdue ? "text-red-500 font-bold" : "text-amber-500"}`} />
                  Jatuh tempo: <strong className={isOverdue ? "text-red-700 font-bold" : "text-[#202321]"}>{currentBill.dueDate}</strong>
                </p>

                {/* Banner Peringatan Bukti Ditolak */}
                {isRejected && (
                  <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-red-900">Bukti Pembayaran Ditolak</p>
                      <p className="text-[11px] text-red-700 mt-0.5 leading-relaxed">
                        {currentBill.payment?.rejectReason
                          ? `Alasan: "${currentBill.payment.rejectReason}". Silakan kirimkan ulang bukti yang valid.`
                          : "Bukti transfer tidak dapat diverifikasi admin. Silakan upload ulang struk pembayaran Anda."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Banner Info Menunggu Verifikasi */}
                {isWaiting && !isRejected && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <p className="font-bold text-amber-900">Menunggu Verifikasi Admin</p>
                      <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
                        Bukti transfer Anda telah dikirim dan sedang ditinjau. Anda dapat memantau statusnya di halaman tagihan.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-lg font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Semua Tagihan Lunas
                </p>
                <p className="text-xs text-[#6B716D] mt-1">
                  Terima kasih! Pembayaran sewa kamar Anda tertib dan tidak ada tunggakan berjalan.
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-[#E5E3DE]">
            <Link 
              href="/portal/tagihan"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1F3D35] hover:bg-[#152923] text-white px-5 py-3 text-sm font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>{currentBill ? "Bayar Tagihan Sekarang" : "Riwayat Pembayaran"}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Layanan Fasilitas & Kendala Kamar */}
        <div className="bg-white rounded-3xl p-8 border border-[#E5E3DE] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#F8F7F4] flex items-center justify-center text-[#1F3D35]">
                <Wrench className="w-5 h-5" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                facilityRequests.length === 0
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}>
                {facilityRequests.length === 0 ? "Fasilitas Aman" : `${facilityRequests.length} Diproses`}
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#202321]">Layanan & Perbaikan Fasilitas</h3>
            
            <div className="mt-4 space-y-3">
              {facilityRequests.length === 0 ? (
                <div>
                  <p className="text-sm font-semibold text-[#202321]">Kondisi Kamar Terpantau Baik</p>
                  <p className="text-xs text-[#6B716D] mt-1 leading-relaxed">
                    Tidak ada laporan kendala AC, listrik, atau sanitasi yang sedang berjalan saat ini.
                  </p>
                </div>
              ) : (
                facilityRequests.slice(0, 2).map((req) => (
                  <div key={req.id} className="p-3.5 rounded-2xl bg-[#F8F7F4] border border-[#E5E3DE] flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <p className="font-bold text-[#1F3D35] truncate">{req.issue}</p>
                      <p className="text-[#6B716D] text-[11px] mt-0.5">Tiket #{req.ticketNumber} • {req.date}</p>
                    </div>
                    <span className="shrink-0 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
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

      {/* Modal Ajukan Perpanjangan Sewa */}
      <ExtendLeaseModal
        isOpen={isExtendModalOpen}
        onClose={() => setIsExtendModalOpen(false)}
        activeLease={activeLease}
        tenantName={profile?.name || "Penghuni"}
        propertyPhone={propertyPhone}
        onSuccess={async () => {
          setExtendSuccessMessage(
            "Pengajuan perpanjangan sewa telah berhasil dikirimkan. Tim admin akan segera meninjau permohonan Anda."
          );
          await loadDashboardData(true);
        }}
      />
    </div>
  );
}
