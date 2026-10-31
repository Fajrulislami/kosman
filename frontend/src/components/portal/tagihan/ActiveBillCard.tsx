"use client";

import { Receipt, AlertCircle, Upload, CheckCircle2, Loader2, XCircle, AlertTriangle, Eye } from "lucide-react";
import { PortalInvoiceItem } from "@/types/portal";

interface ActiveBillCardProps {
  activeBill: PortalInvoiceItem | undefined;
  onPayClick: (bill: PortalInvoiceItem) => void;
  onPreviewProofClick?: (bill: PortalInvoiceItem) => void;
}

function getDaysOverdue(dueDateStr?: string): number {
  if (!dueDateStr) return 0;
  try {
    const due = new Date(dueDateStr);
    const today = new Date();
    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  } catch {
    return 0;
  }
}

export default function ActiveBillCard({ activeBill, onPayClick, onPreviewProofClick }: ActiveBillCardProps) {
  const isRejected = activeBill?.payment?.status === "REJECTED";
  const isWaiting = activeBill?.rawStatus === "WAITING_CONFIRMATION";
  const daysOverdue = activeBill ? getDaysOverdue(activeBill.dueDate) : 0;
  const isOverdue = activeBill?.rawStatus === "OVERDUE" || (activeBill?.rawStatus === "PENDING" && daysOverdue > 0);

  return (
    <div className="relative overflow-hidden bg-white rounded-3xl border border-[#E5E3DE] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <Receipt className="w-48 h-48 text-[#1F3D35]" />
      </div>

      <div className="relative p-8 md:p-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-[#F8F7F4] rounded-full flex items-center justify-center text-[#1F3D35]">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xs font-bold tracking-wider text-[#6B716D] uppercase">Tagihan Aktif</h2>
            <p className="text-lg font-semibold text-[#202321]">
              {activeBill ? `${activeBill.month} (${activeBill.invoiceNumber})` : "Tidak Ada Tagihan Tertunda"}
            </p>
          </div>
        </div>

        {activeBill ? (
          <>
            <div className="mb-8">
              <p className="text-sm text-[#6B716D] mb-1">Total Pembayaran</p>
              <div className="flex flex-wrap items-baseline gap-4">
                <span className="text-4xl sm:text-5xl font-black tracking-tight text-[#202321]">
                  Rp {activeBill.amount.toLocaleString("id-ID")}
                </span>
                
                {/* Status Badges */}
                {isWaiting ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Menunggu Verifikasi Admin
                  </span>
                ) : isRejected ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-800 border border-red-200">
                    <XCircle className="w-3.5 h-3.5 text-red-600" />
                    Bukti Ditolak Admin
                  </span>
                ) : isOverdue ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-red-600 text-white shadow-sm shadow-red-600/30 animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {daysOverdue > 0 ? `Lewat Jatuh Tempo (${daysOverdue} Hari)` : "Jatuh Tempo Hari Ini"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-red-50 text-red-700">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Belum Lunas
                  </span>
                )}
              </div>

              <p className={`text-sm mt-3 flex items-center gap-2 font-medium ${isOverdue ? "text-red-700" : "text-[#6B716D]"}`}>
                <AlertCircle className={`w-4 h-4 shrink-0 ${isOverdue ? "text-red-600" : "text-amber-500"}`} />
                <span>
                  Jatuh tempo pada <strong className={isOverdue ? "text-red-900 font-bold" : "text-[#202321]"}>{activeBill.dueDate}</strong>
                  {isOverdue && daysOverdue > 0 && (
                    <span className="ml-1.5 font-bold text-red-600">(Terlambat {daysOverdue} hari)</span>
                  )}
                </span>
              </p>
            </div>

            {/* Banner Khusus: Peringatan Keterlambatan Jatuh Tempo (OVERDUE) */}
            {isOverdue && !isRejected && !isWaiting && (
              <div className="mb-6 rounded-2xl border border-red-300 bg-red-50/95 p-4 sm:p-5 text-sm animate-in fade-in slide-in-from-top-1 shadow-xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-red-900 text-sm">
                      Batas Waktu Pembayaran Telah Terlewat
                    </h4>
                    <p className="text-xs text-red-800 mt-1 leading-relaxed">
                      Tagihan sewa kamar ini telah melewati jatuh tempo {daysOverdue > 0 ? <strong className="font-bold text-red-950">{daysOverdue} hari</strong> : "hari ini"}. Mohon segera lakukan pembayaran dan unggah bukti transfer ke rekening pengelola kos untuk menghindari sanksi atau denda keterlambatan sewa.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Banner Khusus: Bukti Pembayaran Ditolak Admin */}
            {isRejected && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50/90 p-4 sm:p-5 text-sm animate-in fade-in slide-in-from-top-1">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-red-900 text-sm">
                      Bukti Pembayaran Sebelumnya Ditolak
                    </h4>
                    <div className="mt-1.5 rounded-xl bg-white/80 border border-red-200/80 p-3 text-xs text-red-900">
                      <span className="font-semibold text-red-800">Alasan dari Pengelola:</span>{" "}
                      <span className="font-medium italic">
                        &ldquo;{activeBill.payment?.rejectReason || "Bukti transfer tidak valid atau foto tidak terbaca jelas."}&rdquo;
                      </span>
                    </div>
                    <p className="text-xs text-red-700 mt-2 font-medium">
                      Silakan periksa kembali mutasi/rekening Anda dan unggah ulang bukti transfer yang sah dan jelas.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Banner Informasi: Sedang Menunggu Verifikasi */}
            {isWaiting && (
              <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-amber-700 animate-spin shrink-0" />
                  <span>Bukti pembayaran sedang ditinjau oleh tim pengelola kos.</span>
                </div>
                {activeBill.payment?.proofUrl && (
                  <button
                    type="button"
                    onClick={() => onPreviewProofClick?.(activeBill)}
                    className="inline-flex items-center gap-1.5 font-bold text-amber-900 hover:text-amber-950 bg-white border border-amber-300 px-3 py-1.5 rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-700" />
                    <span>Lihat Bukti yang Dikirim</span>
                  </button>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 border-t border-[#E5E3DE] pt-6">
              <button
                onClick={() => onPayClick(activeBill)}
                className={`flex-1 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:-translate-y-0.5 active:scale-95 cursor-pointer ${
                  isOverdue
                    ? "bg-red-600 hover:bg-red-700 shadow-red-600/25"
                    : isRejected 
                    ? "bg-red-700 hover:bg-red-800 shadow-red-700/20" 
                    : "bg-[#1F3D35] hover:bg-[#162E28] shadow-[#1F3D35]/20"
                }`}
              >
                <Upload className="w-5 h-5" />
                <span>
                  {isWaiting 
                    ? "Kirim Ulang Bukti Transfer" 
                    : isRejected 
                    ? "Unggah Ulang Bukti Transfer" 
                    : isOverdue
                    ? "Bayar Sekarang (Lewat Jatuh Tempo)"
                    : "Upload Bukti Transfer"}
                </span>
              </button>
            </div>
          </>
        ) : (
          <div className="py-6">
            <div className="flex items-center gap-3 text-green-600 mb-2">
              <CheckCircle2 className="w-8 h-8" />
              <span className="text-2xl font-bold">Semua Tagihan Lunas!</span>
            </div>
            <p className="text-[#6B716D] text-sm">
              Kamar Anda tidak memiliki tagihan tertunda saat ini. Terima kasih telah membayar sewa tepat waktu.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

