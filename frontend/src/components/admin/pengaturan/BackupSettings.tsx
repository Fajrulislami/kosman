"use client";

import { useState, useEffect } from "react";
import { 
  Database, 
  Download, 
  HardDrive, 
  ShieldCheck, 
  Clock, 
  FileCheck2, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  ExternalLink,
  Info,
  Server
} from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

interface BackupStats {
  databaseType: string;
  isHealthy: boolean;
  fileSize: number;
  fileSizeFormatted: string;
  lastModified: string | null;
  counts: {
    rooms: number;
    tenants: number;
    invoices: number;
    users: number;
  };
}

export default function BackupSettings() {
  const [stats, setStats] = useState<BackupStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await apiFetch<{ success: boolean; data: BackupStats }>("/api/admin/backup/stats");
      if (res && res.data) {
        setStats(res.data);
      }
    } catch (err: any) {
      console.warn("Gagal memuat statistik database:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadBackup = async () => {
    try {
      setDownloading(true);
      
      const response = await fetch("/api/admin/backup/download", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Gagal mengunduh file cadangan dari server");
      }

      // Ambil blob file dari response
      const blob = await response.blob();
      
      // Ambil nama file dari Content-Disposition jika ada, atau gunakan default
      let filename = `kostara-backup-${new Date().toISOString().split("T")[0]}.db`;
      const disposition = response.headers.get("Content-Disposition");
      if (disposition && disposition.indexOf("filename=") !== -1) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, "");
        }
      }

      // Trigger download di browser pengguna
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

      toast.success("File cadangan database berhasil diunduh!");
    } catch (err: any) {
      console.error("Download backup failed:", err);
      toast.error(err.message || "Terjadi kesalahan saat mengunduh cadangan");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header & Status Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-[#E5E3DE] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1F3D35] text-[#C69C6D] shadow-md">
            <Database className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold tracking-tight text-[#1F3D35]">
                Pusat Cadangan Data
              </h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Database Aktif
              </span>
            </div>
            <p className="mt-1 text-sm text-[#6B716D]">
              Amankan dan unduh seluruh data anak kos, transaksi sewa, dan kamar untuk arsip mandiri.
            </p>
          </div>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] px-4 py-2 text-xs font-bold text-[#1F3D35] transition-colors hover:bg-white disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin text-[#C69C6D]" /> : <Clock className="h-4 w-4 text-[#C69C6D]" />}
          <span>Segarkan Status</span>
        </button>
      </div>

      {/* 2. Grid Informasi Status Database */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Mesin Database */}
        <div className="rounded-2xl border border-[#E5E3DE] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-[#6B716D]">
            <Server className="h-5 w-5 text-[#C69C6D]" />
            <span className="text-xs font-bold uppercase tracking-wider">Format Data</span>
          </div>
          <p className="mt-3 text-2xl font-black text-[#1F3D35]">
            {stats?.databaseType || "SQLite"}
          </p>
          <p className="mt-1 text-xs text-[#99A09C]">File database mandiri (.db)</p>
        </div>

        {/* Ukuran File */}
        <div className="rounded-2xl border border-[#E5E3DE] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-[#6B716D]">
            <HardDrive className="h-5 w-5 text-[#C69C6D]" />
            <span className="text-xs font-bold uppercase tracking-wider">Ukuran Database</span>
          </div>
          <p className="mt-3 text-2xl font-black text-[#1F3D35]">
            {loading ? "..." : stats?.fileSizeFormatted || "0 KB"}
          </p>
          <p className="mt-1 text-xs text-[#99A09C]">Kompak & ringan diunduh</p>
        </div>

        {/* Total Kamar & Unit */}
        <div className="rounded-2xl border border-[#E5E3DE] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-[#6B716D]">
            <FileCheck2 className="h-5 w-5 text-[#C69C6D]" />
            <span className="text-xs font-bold uppercase tracking-wider">Total Kamar</span>
          </div>
          <p className="mt-3 text-2xl font-black text-[#1F3D35]">
            {loading ? "..." : `${stats?.counts.rooms || 0} Unit`}
          </p>
          <p className="mt-1 text-xs text-[#99A09C]">{stats?.counts.tenants || 0} Penghuni aktif</p>
        </div>

        {/* Total Tagihan / Transaksi */}
        <div className="rounded-2xl border border-[#E5E3DE] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-[#6B716D]">
            <ShieldCheck className="h-5 w-5 text-[#C69C6D]" />
            <span className="text-xs font-bold uppercase tracking-wider">Data Transaksi</span>
          </div>
          <p className="mt-3 text-2xl font-black text-[#1F3D35]">
            {loading ? "..." : `${stats?.counts.invoices || 0} Invoice`}
          </p>
          <p className="mt-1 text-xs text-[#99A09C]">Termasuk bukti bayar & user</p>
        </div>

      </div>

      {/* 3. Card Aksi Unduh Cadangan Utama */}
      <div className="rounded-3xl border border-[#C69C6D]/40 bg-gradient-to-br from-white to-[#F8F7F4] p-8 shadow-md">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1F3D35]/10 px-3.5 py-1 text-xs font-bold text-[#1F3D35]">
            <CheckCircle2 className="h-4 w-4 text-[#C69C6D]" />
            <span>Cadangan Mandiri 1-Klik</span>
          </div>

          <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-[#1F3D35]">
            Unduh Cadangan Database (.db)
          </h3>
          
          <p className="mt-2 text-[15px] leading-relaxed text-[#6B716D]">
            Mengunduh seluruh isi data operasional Pondok Rahmat dalam 1 file utuh. File ini mencakup akun admin, anak kos, tagihan bulanan, riwayat pembayaran, laporan aduan, dan ketersediaan kamar.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={handleDownloadBackup}
              disabled={downloading}
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#1F3D35] px-8 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hover:bg-[#162E28] hover:text-[#C69C6D] hover:shadow-[0_8px_25px_rgba(31,61,53,0.3)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
            >
              {downloading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-[#C69C6D]" />
                  <span>Sedang Menyiapkan File...</span>
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 text-[#C69C6D]" />
                  <span>Unduh Database Sekarang</span>
                </>
              )}
            </button>

            {stats?.lastModified && (
              <span className="text-xs text-[#99A09C]">
                Pembaruan data server: {new Date(stats.lastModified).toLocaleString("id-ID")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4. Panduan SOP & Praktik Terbaik (Untuk Pemilik Kos & Developer) */}
      <div className="rounded-3xl border border-[#E5E3DE] bg-white p-8 shadow-sm">
        <h4 className="flex items-center gap-2 text-lg font-bold text-[#1F3D35]">
          <Info className="h-5 w-5 text-[#C69C6D]" />
          <span>Panduan Operasional & Pemulihan (SOP)</span>
        </h4>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          
          <div className="flex flex-col justify-between rounded-2xl bg-[#F8F7F4] p-5 border border-[#E5E3DE]/60">
            <div>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1F3D35] text-sm font-bold text-white mb-3">1</span>
              <h5 className="font-bold text-[#1F3D35]">Kapan Sebaiknya Cadangkan?</h5>
              <p className="mt-2 text-xs leading-relaxed text-[#6B716D]">
                Disarankan mengunduh file database ini setiap <strong>awal bulan atau akhir bulan</strong> setelah pembayaran sewa anak kos diverifikasi, atau sebelum melakukan perubahan data kamar berskala besar.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl bg-[#F8F7F4] p-5 border border-[#E5E3DE]/60">
            <div>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1F3D35] text-sm font-bold text-white mb-3">2</span>
              <h5 className="font-bold text-[#1F3D35]">Di Mana Menyimpannya?</h5>
              <p className="mt-2 text-xs leading-relaxed text-[#6B716D]">
                Simpan file <code className="rounded bg-white px-1.5 py-0.5 text-[#1F3D35] border border-[#E5E3DE]">.db</code> di laptop Anda atau unggah ke <strong>Google Drive / Cloud pribadi</strong> pemilik kos. Jangan membagikan file ini ke pihak luar karena memuat data privasi anak kos.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl bg-[#F8F7F4] p-5 border border-[#E5E3DE]/60">
            <div>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1F3D35] text-sm font-bold text-white mb-3">3</span>
              <h5 className="font-bold text-[#1F3D35]">Bagaimana Jika Ganti Server?</h5>
              <p className="mt-2 text-xs leading-relaxed text-[#6B716D]">
                Jika sewaktu-waktu pindah VPS baru, cukup serahkan file cadangan terakhir ini ke developer. Developer tinggal memasukkan file ini ke server baru, dan seluruh data akan langsung pulih seketika.
              </p>
            </div>
          </div>

        </div>

        {/* Catatan Solusi 4 (Oracle Cloud Snapshot) */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-amber-50/80 p-4 border border-amber-200/80 text-amber-900">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold">Tips Keamanan Ganda (Solusi 4): </span>
            Selain mengunduh database mandiri di halaman ini, pastikan juga fitur <strong>Backup Policy (Bronze/Silver)</strong> di console Oracle Cloud sudah diaktifkan pada instance VPS Anda. Dengan begitu, server memiliki perlindungan ganda (level mesin & level file data).
          </div>
        </div>

      </div>

    </div>
  );
}

