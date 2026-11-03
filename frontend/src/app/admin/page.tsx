"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Loader2, RefreshCw, AlertCircle, AlertTriangle, Wrench, ArrowRight, Receipt, CalendarPlus } from "lucide-react";
import StatCards from "@/components/admin/overview/StatCards";
import RevenueChart from "@/components/admin/overview/RevenueChart";
import RecentActivity from "@/components/admin/overview/RecentActivity";
import { apiFetch } from "@/lib/api";
import { DashboardOverview } from "@/types/admin";

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOverview = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
        setFetchError(null);
      } else {
        setIsRefreshing(true);
      }

      const res = await apiFetch<DashboardOverview>("/api/admin/analytics/overview");
      setData(res);
      setFetchError(null);
    } catch (err) {
      console.error("Failed to load dashboard overview:", err);
      setFetchError("Gagal memuat ringkasan data dashboard. Periksa koneksi internet atau server backend Anda.");
    } finally {
      if (!silent) setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();

    // Auto-refresh setiap 20 detik
    const interval = setInterval(() => {
      fetchOverview(true);
    }, 20000);

    // Auto-refresh saat kembali fokus ke tab browser
    const handleFocus = () => {
      fetchOverview(true);
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchOverview]);

  // Loading Screen awal jika belum ada data sama sekali
  if (loading && !data) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#1F3D35]" />
        <p className="text-sm font-bold text-[#6B716D]">Memuat ringkasan performa Kostara...</p>
      </div>
    );
  }

  // Fallback Error Screen jika gagal memuat data di awal
  if (fetchError && !data) {
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mb-4 shadow-sm">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#1F3D35]">Gagal Memuat Dashboard</h2>
        <p className="text-sm text-[#6B716D] mt-2 max-w-md leading-relaxed">
          {fetchError}
        </p>
        <button
          type="button"
          onClick={() => fetchOverview()}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1F3D35] hover:bg-[#162E28] text-white px-5 py-2.5 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Coba Muat Ulang</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Dashboard & Quick Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F3D35]">
            Dashboard Overview
          </h1>
          <p className="text-sm text-[#6B716D]">
            Ringkasan performa finansial, okupansi, dan aktivitas properti Kostara hari ini.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => fetchOverview(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 rounded-xl border border-[#E5E3DE] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#1F3D35] shadow-xs hover:bg-[#F8F7F4] transition-colors cursor-pointer disabled:opacity-50"
            title="Segarkan data dashboard"
          >
            <RefreshCw className={`h-4 w-4 text-[#1F3D35] ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{isRefreshing ? "Menyegarkan..." : "Segarkan"}</span>
          </button>

          <Link
            href="/admin/tagihan"
            className="flex items-center gap-1.5 rounded-xl border border-[#1F3D35]/30 bg-white px-4 py-2.5 text-sm font-semibold text-[#1F3D35] shadow-xs hover:bg-[#F8F7F4] transition-colors cursor-pointer"
          >
            <Receipt className="h-4 w-4 text-[#1F3D35]" />
            <span>Buat Tagihan</span>
          </Link>

          <Link
            href="/admin/penghuni"
            className="flex items-center gap-1.5 rounded-xl bg-[#1F3D35] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#162E28]"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Penghuni</span>
          </Link>
        </div>
      </div>

      {/* Peringatan jika polling background sempat gagal saat data lama sudah ada */}
      {fetchError && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-800 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>Koneksi terganggu saat memperbarui data terbaru. Menampilkan data tersimpan.</span>
          </div>
          <button
            type="button"
            onClick={() => fetchOverview(true)}
            className="font-bold underline hover:text-amber-900 cursor-pointer shrink-0"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Banner Perhatian Khusus jika ada Komplain Aktif yang belum selesai */}
      {data?.metrics && data.metrics.activeComplaints > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50/90 via-orange-50/40 to-white p-5 shadow-xs animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 shadow-xs ring-1 ring-amber-300/50">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-amber-200/80 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-900">
                  Perhatian Khusus
                </span>
                <span className="text-xs font-semibold text-[#6B716D]">
                  Layanan & Fasilitas Kamar
                </span>
              </div>
              <p className="text-sm font-bold text-[#1F3D35] mt-0.5">
                Terdapat <span className="text-amber-800 font-extrabold">{data.metrics.activeComplaints} keluhan fasilitas</span> yang memerlukan penanganan atau tindak lanjut teknisi.
              </p>
            </div>
          </div>

          <Link
            href="/admin/komplain?tab=masuk"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0 self-end sm:self-auto cursor-pointer"
          >
            <span>Tinjau Komplain Sekarang</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Banner Pengajuan Perpanjangan Sewa yang Menunggu Persetujuan */}
      {data?.metrics && (data.metrics.pendingExtensions || 0) > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-amber-300 bg-gradient-to-r from-amber-100/90 via-amber-50 to-white p-5 shadow-xs animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#1F3D35] text-[#C69C6D] shadow-xs">
              <CalendarPlus className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-amber-500 text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                  Perpanjangan Sewa
                </span>
                <span className="text-xs font-semibold text-[#6B716D]">
                  Menunggu Persetujuan Admin
                </span>
              </div>
              <p className="text-sm font-bold text-[#1F3D35] mt-0.5">
                Terdapat <span className="text-amber-800 font-extrabold">{data.metrics.pendingExtensions} pengajuan perpanjangan sewa</span> yang menunggu peninjauan dan persetujuan tagihan Anda.
              </p>
            </div>
          </div>

          <Link
            href="/admin/penghuni?tab=extensions"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1F3D35] hover:bg-[#162E28] text-white px-4 py-2 text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0 self-end sm:self-auto cursor-pointer"
          >
            <span>Tinjau & Setujui</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Top Stats Cards */}
      <StatCards metrics={data?.metrics} />

      {/* Main Charts & Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart Area - Mengambil 2/3 layar lebar */}
        <div className="lg:col-span-2">
          <RevenueChart chartData={data?.chartData} />
        </div>

        {/* Activity Area - Mengambil 1/3 layar lebar */}
        <div className="lg:col-span-1">
          <RecentActivity recentActivities={data?.recentActivities} />
        </div>
      </div>
    </div>
  );
}
