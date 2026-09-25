"use client";

import { useState } from "react";
import { X, Calendar, Receipt, CreditCard, User, AlertCircle, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { BillingItem } from "@/types/admin";

interface PaymentVerificationSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: BillingItem | null;
  onVerify?: (paymentId: string, action: "APPROVE" | "REJECT", reason?: string) => Promise<void>;
}

export default function PaymentVerificationSlideOver({
  isOpen,
  onClose,
  invoice,
  onVerify,
}: PaymentVerificationSlideOverProps) {
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !invoice) return null;

  const handleAction = async (action: "APPROVE" | "REJECT") => {
    if (!invoice.payment) {
      alert("Data pembayaran tidak valid");
      return;
    }

    try {
      setLoading(true);
      if (onVerify) {
        await onVerify(invoice.payment.id, action, action === "REJECT" ? rejectReason : undefined);
      }
      setRejectMode(false);
      setRejectReason("");
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal memproses verifikasi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1F3D35]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="pointer-events-auto w-screen max-w-lg transform transition-all ease-in-out duration-300">
          <div className="flex h-full flex-col overflow-y-scroll bg-[#F8F7F4] shadow-2xl">
            
            {/* Header */}
            <div className="bg-white px-6 py-6 border-b border-[#E5E3DE] sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#1F3D35]">Verifikasi Pembayaran</h2>
                  <p className="text-sm font-medium text-[#6B716D] mt-1">Invoice: {invoice.invoiceNumber}</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full bg-[#F8F7F4] p-2 text-[#99A09C] hover:bg-[#E5E3DE] hover:text-[#1F3D35] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 space-y-6">
              
              {/* Alert */}
              <div className="rounded-2xl bg-[#FFF4E5] p-4 flex items-start space-x-3 border border-[#FDE68A]">
                <AlertCircle className="h-5 w-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-[#B45309]">
                  Mohon periksa kesesuaian struk transfer dengan nominal tagihan sebelum menyetujui.
                </p>
              </div>

              {/* Bukti Transfer */}
              <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#99A09C]">Bukti Transfer</h3>
                <div className="overflow-hidden rounded-[2rem] bg-white p-2 shadow-sm border border-[#E5E3DE]">
                  {invoice.payment?.proofUrl ? (
                    <div className="relative aspect-[3/4] w-full rounded-3xl bg-gray-100 overflow-hidden group">
                      <img 
                        src={invoice.payment.proofUrl} 
                        alt="Bukti Transfer" 
                        className="h-full w-full object-contain"
                      />
                      <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-black/60 p-3 text-white backdrop-blur-sm">
                        <p className="font-bold text-sm">Dikirim: {invoice.payment.paidAt ? invoice.payment.paidAt.split("T")[0] : "-"}</p>
                        <p className="text-xs text-white/80">Metode: {invoice.payment.method}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-[#99A09C]">
                      <AlertCircle className="h-10 w-10" />
                      <p className="mt-2 text-sm">Bukti transfer belum diunggah</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Rincian Tagihan */}
              <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#99A09C]">Rincian Tagihan</h3>
                <div className="rounded-[2rem] bg-white p-6 shadow-sm border border-[#E5E3DE] space-y-4">
                  
                  <div className="flex items-center justify-between pb-4 border-b border-[#F8F7F4]">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8F7F4]">
                        <User className="h-5 w-5 text-[#1F3D35]" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#99A09C]">Penghuni</p>
                        <p className="text-sm font-bold text-[#1F3D35]">{invoice.tenantName} (Kamar {invoice.roomNumber})</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-1.5">
                    <div className="flex items-center space-x-2 text-[#6B716D]">
                      <Receipt className="h-4 w-4" />
                      <span className="text-sm font-medium">Tipe Kamar</span>
                    </div>
                    <span className="text-sm font-bold text-[#1F3D35]">{invoice.roomType}</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5">
                    <div className="flex items-center space-x-2 text-[#6B716D]">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm font-medium">Periode Sewa</span>
                    </div>
                    <span className="text-sm font-bold text-[#1F3D35]">{invoice.period}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-1.5">
                    <div className="flex items-center space-x-2 text-[#6B716D]">
                      <CreditCard className="h-4 w-4" />
                      <span className="text-sm font-medium">Metode Pembayaran</span>
                    </div>
                    <span className="text-sm font-bold text-[#1F3D35]">{invoice.payment?.method || "Manual Transfer"}</span>
                  </div>

                  <div className="pt-4 border-t border-[#F8F7F4] flex justify-between items-center">
                    <span className="font-bold text-[#1F3D35]">Total Tagihan</span>
                    <span className="text-2xl font-black text-[#1F3D35]">{invoice.amount}</span>
                  </div>

                </div>
              </div>

              {/* Mode Input Alasan Penolakan */}
              {rejectMode && (
                <div className="rounded-2xl bg-white p-5 border border-red-200 space-y-3">
                  <label className="block text-sm font-bold text-red-700">
                    Alasan Penolakan Bukti Transfer
                  </label>
                  <textarea
                    rows={2}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Contoh: Nominal transfer kurang atau bukti buram..."
                    className="w-full rounded-xl border border-red-200 bg-red-50/50 p-3 text-sm font-medium outline-none focus:border-red-400"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setRejectMode(false)}
                      className="px-4 py-2 text-xs font-semibold text-[#6B716D] hover:text-[#1F3D35]"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      disabled={loading || !rejectReason.trim()}
                      onClick={() => handleAction("REJECT")}
                      className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {loading ? "Memproses..." : "Konfirmasi Tolak"}
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Footer Actions */}
            {!rejectMode && (
              <div className="bg-white px-6 py-5 border-t border-[#E5E3DE] flex space-x-3 sticky bottom-0 z-10">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setRejectMode(true)}
                  className="flex-1 rounded-2xl bg-white border-2 border-[#E5E3DE] py-3.5 text-sm font-bold text-[#E54D2E] transition-all hover:bg-[#FFF9F9] hover:border-[#FFEAEA] disabled:opacity-50"
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <XCircle className="h-4 w-4" />
                    <span>Tolak</span>
                  </span>
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleAction("APPROVE")}
                  className="flex-[2] rounded-2xl bg-[#1F3D35] py-3.5 text-sm font-black text-white shadow-lg transition-all hover:bg-[#152923] hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Memproses...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Terima & Lunaskan</span>
                    </span>
                  )}
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
