"use client";

import { useState, useEffect, useCallback, useRef, DragEvent, ChangeEvent } from "react";
import Link from "next/link";
import { 
  Wrench, 
  Plus, 
  UploadCloud, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Loader2, 
  AlertTriangle, 
  Trash2, 
  Link as LinkIcon, 
  ZoomIn, 
  X,
  RefreshCw,
  Home,
  ShieldAlert,
  MessageSquare,
  ArrowRight,
  HelpCircle
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { PortalComplaintItem } from "@/types/portal";
import { usePortalContext } from "@/context/PortalContext";
import { createWhatsAppLink } from "@/lib/whatsapp";

// Kompres gambar otomatis agar hemat bandwidth & penyimpanan tanpa mengurangi keterbacaan foto kerusakan
function compressImage(file: File, maxDimension = 1200, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

export default function KomplainContent() {
  const { profile, propertyPhone, loading: contextLoading } = usePortalContext();
  const [complaints, setComplaints] = useState<PortalComplaintItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Air Conditioner (AC)");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM");
  const [description, setDescription] = useState("");
  
  // Image upload states
  const [photoBase64, setPhotoBase64] = useState<string>("");
  const [photoFileName, setPhotoFileName] = useState<string>("");
  const [photoFileSize, setPhotoFileSize] = useState<string>("");
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [useUrlMode, setUseUrlMode] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lightbox preview state
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string; ticketNumber: string } | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchComplaints = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
        setFetchError(null);
      }
      const res = await apiFetch<{ data: PortalComplaintItem[] }>("/api/portal/complaints");
      setComplaints(res.data || []);
      setFetchError(null);
    } catch (err) {
      if (!silent) {
        console.error("Failed to load complaints:", err);
        setFetchError("Gagal memuat riwayat keluhan fasilitas. Terjadi gangguan koneksi internet atau server.");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();

    // Auto-refresh saat pengguna kembali ke tab ini
    const handleSync = () => {
      fetchComplaints(true);
    };
    window.addEventListener("focus", handleSync);
    document.addEventListener("visibilitychange", handleSync);

    // Polling setiap 10 detik agar pembaruan status admin langsung terupdate otomatis
    const interval = setInterval(() => {
      fetchComplaints(true);
    }, 10000);

    return () => {
      window.removeEventListener("focus", handleSync);
      document.removeEventListener("visibilitychange", handleSync);
      clearInterval(interval);
    };
  }, [fetchComplaints]);

  // Listener tombol ESC untuk menutup lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewImage(null);
    };
    if (previewImage) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewImage]);

  const handleProcessFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setFormError("File yang dipilih harus berupa foto/gambar (JPG, PNG, atau WEBP)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFormError("Ukuran file foto maksimal 10MB");
      return;
    }

    try {
      setIsCompressing(true);
      setFormError(null);
      setPhotoFileName(file.name);
      setPhotoFileSize((file.size / 1024).toFixed(1) + " KB");

      const compressedDataUrl = await compressImage(file);
      setPhotoBase64(compressedDataUrl);
    } catch {
      setFormError("Gagal memproses gambar. Silakan coba file lain.");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoBase64("");
    setPhotoFileName("");
    setPhotoFileSize("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.length < 10) {
      setFormError("Deskripsi detail minimal 10 karakter");
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);

      const finalImage = useUrlMode ? imageUrl.trim() : photoBase64;
      const images = finalImage ? [finalImage] : [];

      await apiFetch("/api/portal/complaints", {
        method: "POST",
        body: JSON.stringify({
          title,
          category,
          priority,
          description,
          images,
        }),
      });

      setSuccessMessage("Laporan keluhan berhasil dikirim! Tim pengelola akan segera menindaklanjuti.");
      setTitle("");
      setDescription("");
      handleRemovePhoto();
      setImageUrl("");
      await fetchComplaints();

      setTimeout(() => setSuccessMessage(null), 6000);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Gagal mengirim laporan keluhan");
    } finally {
      setSubmitting(false);
    }
  };

  const activeLease = profile?.tenant?.leases?.[0];
  const room = activeLease?.room;
  const isExpired = activeLease && (activeLease.status === "EXPIRED" || activeLease.status === "TERMINATED");
  const hasActiveRoom = !!room && activeLease?.status === "ACTIVE";

  // Loading state saat context profile masih dalam proses inisialisasi
  if (contextLoading && !profile) {
    return (
      <div className="space-y-10 max-w-6xl mx-auto py-16 text-center text-[#6B716D]">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#1F3D35]" />
        <p className="mt-3 text-xs font-semibold">Memuat data kamar & keluhan fasilitas...</p>
      </div>
    );
  }

  // Tampilan terkunci penuh jika masa kontrak sewa penghuni telah berakhir (Expired)
  if (!contextLoading && isExpired) {
    const waRenewUrl = createWhatsAppLink(
      propertyPhone,
      `Halo pengelola Kostara, saya ${profile?.name || "penghuni"}${room ? ` (sebelumnya di Kamar ${room.roomNumber})` : ""}. Saya ingin menanyakan terkait perpanjangan sewa atau status masa kontrak saya.`
    );

    return (
      <div className="space-y-10 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-[#202321]">Komplain & Perbaikan</h1>
          <p className="text-[#6B716D] mt-1">Layanan fasilitas dan pelaporan kendala kamar.</p>
        </div>

        <div className="bg-white border border-[#E5E3DE] rounded-3xl p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.03)] text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mb-4">
            Masa Kontrak Berakhir
          </span>

          <h2 className="text-xl sm:text-2xl font-bold text-[#202321]">
            Akses Layanan Fasilitas Dikunci
          </h2>
          <p className="text-[#6B716D] text-sm mt-3 leading-relaxed max-w-md mx-auto">
            Masa sewa kamar Anda di Kostara telah berakhir. Layanan fasilitas dan pelaporan tiket keluhan kamar telah dinonaktifkan untuk akun ini.
          </p>

          {room && (
            <div className="mt-6 inline-block bg-[#F8F7F4] border border-[#E5E3DE] rounded-2xl px-5 py-3 text-xs text-[#202321]">
              <span className="text-[#6B716D]">Unit Kamar Terakhir: </span>
              <strong className="text-[#1F3D35]">Kamar {room.roomNumber} ({room.roomType?.name || "Standar"})</strong>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-[#E5E3DE] flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={waRenewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1F3D35] hover:bg-[#162E28] text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Hubungi Pengelola via WhatsApp</span>
            </a>
            <Link
              href="/portal/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F8F7F4] hover:bg-[#EAE8E3] text-[#202321] border border-[#E5E3DE] px-6 py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <span>Kembali ke Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#6B716D]" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[#202321]">Komplain & Perbaikan</h1>
        <p className="text-[#6B716D] mt-1">Laporkan kendala fasilitas kamar atau area kos Anda secara langsung.</p>
      </div>

      {successMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800 animate-in fade-in slide-in-from-top-1">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Kolom Kiri: Formulir Pengajuan ATAU Edukasi Kamar Belum Aktif */}
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-white border border-[#E5E3DE] rounded-lg flex items-center justify-center text-[#1F3D35] shadow-sm">
              {hasActiveRoom ? <Plus className="w-4 h-4" /> : <Home className="w-4 h-4" />}
            </div>
            <h2 className="text-lg font-bold text-[#202321]">
              {hasActiveRoom ? "Buat Laporan Baru" : "Layanan Fasilitas Kamar"}
            </h2>
          </div>

          {!hasActiveRoom ? (
            <div className="bg-white border border-[#E5E3DE] rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-[#1F3D35] flex items-center justify-center mx-auto shadow-xs">
                  <Home className="w-7 h-7" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F8F7F4] text-[#6B716D] border border-[#E5E3DE]">
                  Penempatan Kamar Belum Aktif
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[#202321]">
                  Fitur Lapor Fasilitas Belum Tersedia
                </h3>
                <p className="text-xs sm:text-sm text-[#6B716D] leading-relaxed max-w-md mx-auto">
                  Fitur lapor fasilitas hanya dapat digunakan oleh penghuni dengan unit kamar aktif. Akun Anda saat ini belum dialokasikan ke unit kamar oleh pengelola kos.
                </p>
              </div>

              <div className="bg-[#F8F7F4] border border-[#E5E3DE] rounded-2xl p-4 sm:p-5 text-left space-y-2.5">
                <p className="text-xs font-bold text-[#202321] flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[#1F3D35]" />
                  Informasi Aktivasi Kamar:
                </p>
                <ul className="text-xs text-[#6B716D] space-y-1.5 list-disc list-inside">
                  <li>Hubungi admin pengelola untuk proses check-in dan aktivasi kamar Anda.</li>
                  <li>Setelah kamar diaktifkan di sistem, formulir lapor kerusakan ini akan langsung terbuka otomatis.</li>
                </ul>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={createWhatsAppLink(
                    propertyPhone,
                    `Halo pengelola Kostara, saya penghuni baru atas nama ${profile?.name || ""}. Saya ingin menanyakan status aktivasi unit kamar saya agar dapat menggunakan portal fasilitas.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1F3D35] hover:bg-[#162E28] text-white px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Hubungi Admin via WhatsApp</span>
                </a>
                <Link
                  href="/portal/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F8F7F4] hover:bg-[#EAE8E3] text-[#202321] border border-[#E5E3DE] px-5 py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>Lihat Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#6B716D]" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-[#E5E3DE] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="p-6 sm:p-8 space-y-6">
                
                {formError && (
                  <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
                    <AlertTriangle className="h-5 w-5 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Info Kamar Aktif */}
                {room && (
                  <div className="flex items-center justify-between p-3.5 bg-[#F8F7F4] border border-[#E5E3DE] rounded-xl text-xs">
                    <span className="text-[#6B716D] font-medium">Unit Kamar Terlapor:</span>
                    <span className="font-bold text-[#1F3D35]">Kamar {room.roomNumber} ({room.roomType?.name || "Standar"})</span>
                  </div>
                )}

              {/* Judul */}
              <div>
                <label className="block text-xs font-bold text-[#6B716D] uppercase tracking-widest mb-2">
                  Judul Masalah <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Misal: AC Bocor, Lampu Mati, Kran Patah"
                  className="w-full bg-[#F8F7F4] border border-[#E5E3DE] rounded-xl px-4 py-3 text-base font-semibold text-[#202321] focus:outline-none focus:border-[#1F3D35] transition-colors"
                />
              </div>

              {/* Kategori & Urgensi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#6B716D] uppercase tracking-widest mb-2">Kategori</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#F8F7F4] border border-[#E5E3DE] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1F3D35] font-semibold text-[#202321]"
                  >
                    <option value="Air Conditioner (AC)">Air Conditioner (AC)</option>
                    <option value="Listrik & Lampu">Listrik & Lampu</option>
                    <option value="Air & Sanitasi">Air & Pipa / Kamar Mandi</option>
                    <option value="Furnitur">Furnitur & Kasur</option>
                    <option value="Kebersihan">Kebersihan & Lingkungan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6B716D] uppercase tracking-widest mb-2">Tingkat Urgensi</label>
                  <select 
                    value={priority}
                    onChange={(e: any) => setPriority(e.target.value)}
                    className="w-full bg-[#F8F7F4] border border-[#E5E3DE] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1F3D35] font-semibold text-[#202321]"
                  >
                    <option value="LOW">Rendah (Bisa kapan saja)</option>
                    <option value="MEDIUM">Sedang (Dalam 1-2 hari)</option>
                    <option value="HIGH">Tinggi (Mendesak)</option>
                    <option value="URGENT">Darurat (Segera)</option>
                  </select>
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-bold text-[#6B716D] uppercase tracking-widest mb-2">
                  Deskripsi Detail <span className="text-red-500">*</span>
                </label>
                <textarea 
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ceritakan detail masalahnya agar tim teknisi dapat membawa perkakas yang tepat..."
                  className="w-full bg-[#F8F7F4] border border-[#E5E3DE] rounded-xl p-4 text-sm focus:outline-none focus:border-[#1F3D35] resize-none font-medium text-[#202321]"
                />
              </div>

              {/* Upload Foto Bukti Kerusakan (Galeri / Kamera / Drag & Drop) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#6B716D] uppercase tracking-widest">
                    Foto Bukti Kerusakan (Opsional)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setUseUrlMode(!useUrlMode);
                      setFormError(null);
                    }}
                    className="text-xs font-semibold text-[#C69C6D] hover:text-[#1F3D35] transition-colors"
                  >
                    {useUrlMode ? "Upload dari Galeri / Kamera" : "Gunakan Tautan / URL"}
                  </button>
                </div>

                {useUrlMode ? (
                  <div>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99A09C]">
                        <LinkIcon className="w-4 h-4" />
                      </div>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/... atau tautan foto bukti"
                        className="w-full bg-[#F8F7F4] border border-[#E5E3DE] rounded-xl pl-10 pr-4 py-3 text-sm text-[#202321] focus:outline-none focus:border-[#1F3D35] transition-colors"
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-[#99A09C]">
                      Masukkan tautan langsung gambar bukti kerusakan yang dapat diakses publik.
                    </p>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileInputChange}
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                    />

                    {!photoBase64 ? (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                          isDragging 
                            ? "border-[#1F3D35] bg-[#1F3D35]/5 scale-[0.99]" 
                            : "border-[#E5E3DE] hover:border-[#C69C6D] bg-[#F8F7F4]/60 hover:bg-[#F8F7F4]"
                        }`}
                      >
                        {isCompressing ? (
                          <div className="py-4">
                            <Loader2 className="w-7 h-7 animate-spin mx-auto text-[#1F3D35] mb-2" />
                            <p className="text-xs font-bold text-[#1F3D35]">Memproses & Mengompres Foto...</p>
                          </div>
                        ) : (
                          <div className="py-2">
                            <div className="w-11 h-11 rounded-2xl bg-white shadow-xs border border-[#E5E3DE] flex items-center justify-center text-[#1F3D35] mx-auto mb-2.5">
                              <UploadCloud className="w-5 h-5 text-[#C69C6D]" />
                            </div>
                            <p className="text-sm font-bold text-[#202321]">
                              Pilih Foto dari Galeri / Kamera
                            </p>
                            <p className="text-xs text-[#6B716D] mt-0.5">
                              atau seret dan lepas file gambar ke sini
                            </p>
                            <span className="inline-block mt-2.5 text-[10px] font-semibold text-[#99A09C] bg-white px-2.5 py-1 rounded-full border border-[#E5E3DE]">
                              JPG, PNG, WEBP (Maks 10MB)
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Preview Foto Terpilih */
                      <div className="relative rounded-2xl border border-[#E5E3DE] bg-[#F8F7F4] p-3 overflow-hidden">
                        <div className="flex items-center gap-3">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-[#E5E3DE] shrink-0">
                            <img
                              src={photoBase64}
                              alt="Foto Bukti Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 text-green-700">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              <p className="text-xs font-bold truncate">Foto Siap Dilampirkan</p>
                            </div>
                            <p className="text-xs font-medium text-[#202321] truncate mt-0.5">{photoFileName || "foto-kerusakan.jpg"}</p>
                            <p className="text-[10px] text-[#99A09C] mt-0.5">{photoFileSize}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="p-2 text-xs font-bold text-[#1F3D35] hover:bg-white rounded-lg transition-colors cursor-pointer"
                              title="Ganti Foto"
                            >
                              Ganti
                            </button>
                            <button
                              type="button"
                              onClick={handleRemovePhoto}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Foto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Action Bar */}
            <div className="bg-[#F8F7F4]/60 p-6 sm:px-8 border-t border-[#E5E3DE] flex justify-end">
              <button 
                type="submit"
                disabled={submitting || isCompressing}
                className="w-full sm:w-auto bg-[#1F3D35] hover:bg-[#162E28] disabled:opacity-50 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-[#1F3D35]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{submitting ? "Mengirim Laporan..." : "Kirim Laporan"}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Kolom Kanan: Timeline Riwayat Komplain */}
      <div className="lg:col-span-5 sticky top-28">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-white border border-[#E5E3DE] rounded-lg flex items-center justify-center text-[#6B716D] shadow-sm">
            <Clock className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-[#202321]">Riwayat & Status Tiket</h2>
        </div>

        {loading ? (
          <div className="py-12 text-center text-[#6B716D]">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#1F3D35]" />
            <p className="mt-2 text-xs">Memuat tiket keluhan...</p>
          </div>
        ) : fetchError && complaints.length === 0 ? (
          <div className="rounded-3xl border border-red-200 bg-red-50/50 p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-[#202321]">Gagal Memuat Riwayat</h3>
            <p className="text-xs text-[#6B716D] mt-1 max-w-xs mx-auto leading-relaxed">
              {fetchError}
            </p>
            <button
              type="button"
              onClick={() => fetchComplaints()}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#1F3D35] hover:bg-[#162E28] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Coba Muat Ulang</span>
            </button>
          </div>
        ) : complaints.length === 0 ? (
          <div className="rounded-3xl border border-[#E5E3DE] bg-white p-8 text-center text-[#6B716D]">
            <CheckCircle2 className="w-8 h-8 mx-auto text-green-600 mb-2 opacity-80" />
            <p className="font-bold text-sm text-[#202321]">
              {hasActiveRoom ? "Tidak ada keluhan aktif" : "Belum Ada Riwayat Keluhan"}
            </p>
            <p className="text-xs mt-1">
              {hasActiveRoom 
                ? "Semua fasilitas kamar Anda dalam kondisi baik."
                : "Riwayat tiket perbaikan fasilitas Anda akan tercatat di sini setelah unit kamar aktif."}
            </p>
          </div>
        ) : (
          <>
            {fetchError && (
              <div className="mb-4 flex items-center justify-between gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Gagal sinkronisasi data terbaru.</span>
                </div>
                <button
                  type="button"
                  onClick={() => fetchComplaints(true)}
                  className="font-bold underline hover:text-amber-900 cursor-pointer shrink-0"
                >
                  Coba Lagi
                </button>
              </div>
            )}
            <div className="relative border-l-2 border-[#E5E3DE] ml-4 space-y-6 pb-4">
              {complaints.map((req) => {
                const isDone = req.rawStatus === "RESOLVED";
                const isProgress = req.rawStatus === "IN_PROGRESS";
                const isRejected = req.rawStatus === "REJECTED";

                let badgeColor = "bg-amber-500";
                if (isDone) badgeColor = "bg-green-600";
                if (isRejected) badgeColor = "bg-red-500";

                return (
                  <div key={req.id} className="relative pl-7 group">
                    <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full ${badgeColor} flex items-center justify-center border-2 border-white shadow-sm`}>
                      {isDone ? (
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      ) : isProgress ? (
                        <Wrench className="w-2.5 h-2.5 text-white" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    
                    <div className="rounded-2xl p-5 border border-[#E5E3DE] bg-white shadow-sm space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[11px] font-bold text-[#99A09C]">{req.ticketNumber} • {req.category}</p>
                          <h3 className="font-bold text-[#202321] text-sm mt-0.5">{req.issue}</h3>
                        </div>
                        <span className="text-xs font-semibold text-[#99A09C] shrink-0">{req.date}</span>
                      </div>
                      
                      <p className="text-xs text-[#6B716D] leading-relaxed">{req.description}</p>
                      
                      {/* Galeri Foto Bukti Kerusakan di Riwayat */}
                      {req.images && req.images.length > 0 && (
                        <div className="pt-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#99A09C] mb-1.5">
                            Foto Bukti Kerusakan:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {req.images.map((imgUrl, imgIdx) => (
                              <button
                                key={imgIdx}
                                type="button"
                                onClick={() => setPreviewImage({ url: imgUrl, title: req.issue, ticketNumber: req.ticketNumber })}
                                className="group/thumb relative w-16 h-16 rounded-xl overflow-hidden border border-[#E5E3DE] bg-[#F8F7F4] hover:border-[#1F3D35] transition-all cursor-pointer shadow-xs"
                                title="Klik untuk memperbesar foto"
                              >
                                <img
                                  src={imgUrl}
                                  alt={`Bukti ${imgIdx + 1}`}
                                  className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
                                />
                                <div className="absolute inset-0 bg-[#1F3D35]/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity text-white">
                                  <ZoomIn className="w-4 h-4" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-2 flex items-center justify-between">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          isDone
                            ? "bg-green-50 text-green-700"
                            : isProgress
                            ? "bg-amber-50 text-amber-700"
                            : isRejected
                            ? "bg-red-50 text-red-700"
                            : "bg-blue-50 text-blue-700"
                        }`}>
                          {req.status}
                        </span>

                        <span className="text-[11px] font-semibold text-[#6B716D]">
                          Prioritas: {req.priority}
                        </span>
                      </div>

                      {/* Catatan Admin / Solusi */}
                      {req.resolutionNote && (
                        <div className="mt-3 pt-3 border-t border-[#E5E3DE]/60">
                          <p className="text-xs text-[#1F3D35] bg-[#F8F7F4] p-3 rounded-xl border border-[#E5E3DE]">
                            <strong>Catatan Pengelola:</strong> "{req.resolutionNote}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      </div>

      {/* Modal Lightbox Pembesar Foto Bukti */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-[#1F3D35]/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setPreviewImage(null)} 
          />
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#E5E3DE] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-[#E5E3DE]">
              <div>
                <h3 className="font-bold text-[#1F3D35] text-base sm:text-lg">{previewImage.title}</h3>
                <p className="text-xs text-[#6B716D]">{previewImage.ticketNumber}</p>
              </div>
              <button 
                onClick={() => setPreviewImage(null)} 
                className="p-2 rounded-full hover:bg-[#F8F7F4] text-[#99A09C] hover:text-[#1F3D35] transition-colors cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-[#F8F7F4] flex items-center justify-center max-h-[65vh] overflow-hidden">
              <img 
                src={previewImage.url} 
                alt={previewImage.title} 
                className="max-h-[60vh] max-w-full rounded-xl object-contain shadow-sm" 
              />
            </div>
            <div className="p-4 border-t border-[#E5E3DE] bg-white flex justify-end">
              <button 
                onClick={() => setPreviewImage(null)} 
                className="px-5 py-2.5 rounded-xl bg-[#1F3D35] text-white text-xs font-bold hover:bg-[#162E28] transition-colors cursor-pointer active:scale-95"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
