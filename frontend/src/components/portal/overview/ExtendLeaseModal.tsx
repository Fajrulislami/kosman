"use client";

import { useState } from "react";
import { X, Calendar, Clock, MessageSquare, Send, Loader2, AlertCircle, ArrowUpRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { createWhatsAppLink } from "@/lib/whatsapp";

interface ExtendLeaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeLease: any;
  tenantName: string;
  propertyPhone?: string;
  onSuccess: () => Promise<void>;
}

export default function ExtendLeaseModal({
  isOpen,
  onClose,
  activeLease,
  tenantName,
  propertyPhone = "081122223333",
  onSuccess,
}: ExtendLeaseModalProps) {
  const [durationMonths, setDurationMonths] = useState<number>(3);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !activeLease) return null;

  const room = activeLease.room;
  const currentEndDate = activeLease.endDate ? new Date(activeLease.endDate) : new Date();

  // Hitung tanggal akhir baru
  const proposedEndDate = new Date(currentEndDate);
  proposedEndDate.setMonth(proposedEndDate.getMonth() + durationMonths);

  const formattedCurrentEnd = currentEndDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedProposedEnd = proposedEndDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const rentPerMonth = activeLease.rentAmount || room?.roomType?.basePrice || 0;
  const estimatedTotal = rentPerMonth * durationMonths;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);
  };

  const handleSystemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);

      await apiFetch("/api/portal/lease/extend-request", {
        method: "POST",
        body: JSON.stringify({
          durationMonths,
          notes: notes.trim(),
        }),
      });

      await onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim pengajuan perpanjangan sewa");
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppSubmit = () => {
    const message = `Halo Pengelola Kos, saya ${tenantName} dari Kamar ${room?.roomNumber || "-"} ingin mengajukan perpanjangan sewa selama ${durationMonths} bulan (hingga ${formattedProposedEnd}).${notes ? `\n\nCatatan tambahan: "${notes}"` : ""}\n\nMohon konfirmasi dan informasinya. Terima kasih!`;
    const waUrl = createWhatsAppLink(propertyPhone, message);
    window.open(waUrl, "_blank");
  };

  const durations = [
    { label: "1 Bulan", value: 1 },
    { label: "3 Bulan", value: 3, badge: "Populer" },
    { label: "6 Bulan", value: 6 },
    { label: "1 Tahun", value: 12, badge: "Hemat" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#1F3D35]/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all border border-[#E5E3DE]">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-[#E5E3DE] p-6 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F8F7F4] flex items-center justify-center text-[#1F3D35]">
              <Calendar className="w-5 h-5 text-[#C69C6D]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1F3D35]">Ajukan Perpanjangan Sewa</h3>
              <p className="text-xs text-[#6B716D] mt-0.5">
                Kamar {room?.roomNumber || "-"} • {room?.roomType?.name || "Standar"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#99A09C] hover:bg-[#F8F7F4] hover:text-[#1F3D35] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSystemSubmit}>
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {error && (
              <div className="flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Info Kontrak Saat Ini */}
            <div className="p-4 rounded-2xl bg-[#F8F7F4] border border-[#E5E3DE]/80 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#6B716D] font-medium block">Selesai Kontrak Saat Ini</span>
                <strong className="text-[#202321] font-bold text-sm mt-0.5 block">{formattedCurrentEnd}</strong>
              </div>
              <div>
                <span className="text-[#6B716D] font-medium block">Tarif Sewa Bulanan</span>
                <strong className="text-[#1F3D35] font-bold text-sm mt-0.5 block">{formatRupiah(rentPerMonth)}</strong>
              </div>
            </div>

            {/* Pilihan Paket Durasi */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B716D] mb-2.5">
                Pilih Durasi Perpanjangan
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {durations.map((d) => {
                  const isSelected = durationMonths === d.value;
                  return (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setDurationMonths(d.value)}
                      className={`relative p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#1F3D35] bg-[#1F3D35] text-white shadow-md shadow-[#1F3D35]/15 scale-[1.02]"
                          : "border-[#E5E3DE] bg-[#F8F7F4]/60 hover:bg-[#F8F7F4] text-[#202321]"
                      }`}
                    >
                      {d.badge && (
                        <span className={`absolute -top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          isSelected ? "bg-[#C69C6D] text-white" : "bg-[#1F3D35] text-white"
                        }`}>
                          {d.badge}
                        </span>
                      )}
                      <p className="font-bold text-sm">{d.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ringkasan Perpanjangan Baru */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Periode Baru Hingga:</span>
                <strong className="font-bold text-sm text-[#1F3D35]">{formattedProposedEnd}</strong>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-amber-200/60">
                <span className="font-medium">Estimasi Biaya ({durationMonths} Bulan):</span>
                <strong className="font-black text-base text-[#1F3D35]">{formatRupiah(estimatedTotal)}</strong>
              </div>
            </div>

            {/* Catatan Penghuni (Opsional) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B716D] mb-2">
                Catatan Tambahan (Opsional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Misal: Saya ingin konfirmasi perpanjangan sewa dan menanyakan pembayaran..."
                className="w-full bg-[#F8F7F4] border border-[#E5E3DE] rounded-2xl p-3.5 text-xs font-medium text-[#202321] focus:outline-none focus:border-[#1F3D35] focus:bg-white transition-all resize-none placeholder:text-[#99A09C]"
              />
            </div>

          </div>

          {/* Footer Action Buttons */}
          <div className="p-5 border-t border-[#E5E3DE] bg-[#F8F7F4] flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleWhatsAppSubmit}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat WhatsApp Admin</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <div className="w-full sm:w-auto flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="rounded-xl border border-[#E5E3DE] bg-white px-4 py-2.5 text-xs font-bold text-[#6B716D] hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#1F3D35] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#152923] disabled:opacity-50 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{submitting ? "Mengirim..." : "Kirim Pengajuan"}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
