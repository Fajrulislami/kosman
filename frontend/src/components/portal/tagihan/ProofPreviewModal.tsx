"use client";

import { useEffect } from "react";
import { X, Loader2, Upload, AlertCircle } from "lucide-react";

interface ProofPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  proofUrl: string | null;
  invoiceNumber: string;
  amount: number;
  onReuploadClick?: () => void;
}

export default function ProofPreviewModal({
  isOpen,
  onClose,
  proofUrl,
  invoiceNumber,
  amount,
  onReuploadClick,
}: ProofPreviewModalProps) {
  // Tutup modal jika tombol ESC ditekan
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !proofUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1F3D35]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all border border-[#E5E3DE] animate-in fade-in zoom-in-95">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-[#E5E3DE] p-5 sm:p-6 bg-white">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#1F3D35]">
              Pratinjau Bukti Pembayaran
            </h3>
            <p className="text-xs text-[#6B716D] mt-0.5">
              {invoiceNumber} • Rp {amount.toLocaleString("id-ID")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#99A09C] hover:bg-[#F8F7F4] hover:text-[#1F3D35] transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Isi Modal: Foto Struk */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Status: Sedang Ditinjau Admin
            </span>
            <span className="text-[#6B716D]">Foto Bukti Transfer</span>
          </div>

          <div className="relative rounded-2xl border border-[#E5E3DE] bg-[#F8F7F4] p-2 flex items-center justify-center overflow-hidden max-h-[60vh]">
            <img
              src={proofUrl}
              alt="Bukti Transfer yang Dikirim"
              className="max-h-[55vh] w-auto max-w-full rounded-xl object-contain shadow-sm"
            />
          </div>

          <p className="text-[11px] text-[#6B716D] text-center leading-relaxed">
            Foto ini adalah bukti transfer resmi yang telah Anda serahkan ke pengelola kos. Jika foto terpotong atau salah, Anda dapat mengunggah ulang di bawah.
          </p>
        </div>

        {/* Footer Aksi */}
        <div className="flex items-center justify-between border-t border-[#E5E3DE] bg-[#F8F7F4] p-4 sm:p-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#E5E3DE] bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#6B716D] hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Tutup
          </button>

          {onReuploadClick && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onReuploadClick();
              }}
              className="flex items-center gap-2 rounded-xl bg-[#1F3D35] px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#152923] transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Ganti / Unggah Ulang Bukti</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
