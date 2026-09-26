"use client";

import { useState, useEffect, useCallback } from "react";
import { Wrench, Plus, UploadCloud, Clock, CheckCircle2, AlertCircle, Send, Loader2, AlertTriangle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { PortalComplaintItem } from "@/types/portal";

export default function KomplainContent() {
  const [complaints, setComplaints] = useState<PortalComplaintItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Air Conditioner (AC)");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch<{ data: PortalComplaintItem[] }>("/api/portal/complaints");
      setComplaints(res.data || []);
    } catch (err) {
      console.error("Failed to load complaints:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.length < 10) {
      setFormError("Deskripsi detail minimal 10 karakter");
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);

      const images = imageUrl.trim() ? [imageUrl.trim()] : [];

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
      setImageUrl("");
      await fetchComplaints();

      setTimeout(() => setSuccessMessage(null), 6000);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Gagal mengirim laporan keluhan");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[#202321]">Komplain & Perbaikan</h1>
        <p className="text-[#6B716D] mt-1">Laporkan kendala fasilitas kamar atau area kos Anda secara langsung.</p>
      </div>

      {successMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Kolom Kiri: Formulir Pengajuan */}
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-white border border-[#E5E3DE] rounded-lg flex items-center justify-center text-[#1F3D35] shadow-sm">
              <Plus className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-[#202321]">Buat Laporan Baru</h2>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-[#E5E3DE] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="p-6 sm:p-8 space-y-6">
              
              {formError && (
                <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <span>{formError}</span>
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

              {/* Tautan Foto Bukti */}
              <div>
                <label className="block text-xs font-bold text-[#6B716D] uppercase tracking-widest mb-2">
                  Tautan Foto Bukti (Opsional)
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... atau tautan gambar bukti"
                  className="w-full bg-[#F8F7F4] border border-[#E5E3DE] rounded-xl px-4 py-3 text-sm text-[#202321] focus:outline-none focus:border-[#1F3D35]"
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="bg-[#F8F7F4]/60 p-6 sm:px-8 border-t border-[#E5E3DE] flex justify-end">
              <button 
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto bg-[#1F3D35] hover:bg-[#162E28] disabled:opacity-50 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-[#1F3D35]/20 flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Kirim Laporan</span>
              </button>
            </div>
          </form>
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
          ) : complaints.length === 0 ? (
            <div className="rounded-3xl border border-[#E5E3DE] bg-white p-8 text-center text-[#6B716D]">
              <CheckCircle2 className="w-8 h-8 mx-auto text-green-600 mb-2 opacity-80" />
              <p className="font-bold text-sm text-[#202321]">Tidak ada keluhan aktif</p>
              <p className="text-xs mt-1">Semua fasilitas kamar Anda dalam kondisi baik.</p>
            </div>
          ) : (
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
          )}
        </div>

      </div>
    </div>
  );
}
