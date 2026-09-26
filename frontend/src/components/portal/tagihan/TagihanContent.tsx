"use client";

import { useState, useEffect, useCallback } from "react";
import { Receipt, CheckCircle2, AlertCircle, CreditCard, Upload, ChevronRight, Loader2, X, AlertTriangle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { PortalInvoiceItem } from "@/types/portal";

export default function TagihanContent() {
  const [invoices, setInvoices] = useState<PortalInvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Payment modal state
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<PortalInvoiceItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"MANUAL_TRANSFER" | "MIDTRANS_VA" | "QRIS">("MANUAL_TRANSFER");
  const [proofUrl, setProofUrl] = useState("");
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch<{ data: PortalInvoiceItem[] }>("/api/portal/invoices");
      setInvoices(res.data || []);
    } catch (err) {
      console.error("Failed to load portal invoices:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const activeBill = invoices.find(
    (b) => b.rawStatus === "PENDING" || b.rawStatus === "OVERDUE" || b.rawStatus === "WAITING_CONFIRMATION"
  );
  const pastBills = invoices.filter((b) => b.rawStatus === "PAID");

  const handleOpenPayModal = (bill: PortalInvoiceItem) => {
    setSelectedInvoice(bill);
    setProofUrl("");
    setModalError(null);
    setIsPayModalOpen(true);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    if (!proofUrl.trim()) {
      setModalError("Mohon masukkan tautan atau nama file bukti transfer");
      return;
    }

    try {
      setSubmittingPayment(true);
      setModalError(null);

      await apiFetch(`/api/portal/invoices/${selectedInvoice.id}/pay`, {
        method: "POST",
        body: JSON.stringify({
          proofImageUrl: proofUrl,
          method: paymentMethod,
        }),
      });

      setSuccessMessage("Bukti pembayaran berhasil dikirim! Menunggu verifikasi dari pengelola.");
      setIsPayModalOpen(false);
      await fetchInvoices();

      setTimeout(() => setSuccessMessage(null), 6000);
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Gagal mengirim bukti pembayaran");
    } finally {
      setSubmittingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-[#6B716D]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1F3D35]" />
        <p className="mt-3 text-sm font-medium">Memuat data tagihan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#202321]">Tagihan & Pembayaran</h1>
        <p className="text-[#6B716D] mt-1">Kelola tagihan sewa dan riwayat pembayaran kamar kos Anda.</p>
      </div>

      {successMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Tagihan Aktif & Instruksi */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Card Tagihan Aktif */}
          <div className="relative overflow-hidden bg-white rounded-3xl border border-[#E5E3DE] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Receipt className="w-48 h-48" />
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
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                        activeBill.rawStatus === "WAITING_CONFIRMATION"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-50 text-red-700"
                      }`}>
                        {activeBill.rawStatus === "WAITING_CONFIRMATION" ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Menunggu Verifikasi Admin
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3.5 h-3.5" />
                            Belum Lunas
                          </>
                        )}
                      </span>
                    </div>

                    <p className="text-[#6B716D] text-sm mt-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      Jatuh tempo pada <strong className="text-[#202321]">{activeBill.dueDate}</strong>
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 border-t border-[#E5E3DE] pt-6">
                    <button
                      onClick={() => handleOpenPayModal(activeBill)}
                      className="flex-1 bg-[#1F3D35] hover:bg-[#162E28] text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#1F3D35]/20 hover:-translate-y-0.5"
                    >
                      <Upload className="w-5 h-5" />
                      {activeBill.rawStatus === "WAITING_CONFIRMATION" ? "Kirim Ulang Bukti" : "Upload Bukti Transfer"}
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
                    Kamar Anda tidak memiliki tagihan tertunda saat ini. Terima kasih telah membayar tepat waktu.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Card Rekening Kos */}
          <div className="bg-white rounded-3xl p-8 border border-[#E5E3DE] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="text-lg font-bold text-[#202321] mb-6">Rekening Pembayaran Resmi Kostara</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-[#F8F7F4] border border-[#E5E3DE]">
                <p className="text-xs font-bold uppercase tracking-wider text-[#6B716D] mb-1">Bank BCA</p>
                <p className="text-2xl font-black tracking-wider text-[#1F3D35] mb-1">8271 9028 11</p>
                <p className="text-xs text-[#6B716D]">a.n. Kostara Property Management</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#F8F7F4] border border-[#E5E3DE]">
                <p className="text-xs font-bold uppercase tracking-wider text-[#6B716D] mb-1">Bank Mandiri</p>
                <p className="text-2xl font-black tracking-wider text-[#1F3D35] mb-1">137 00 2938 123</p>
                <p className="text-xs text-[#6B716D]">a.n. Kostara Property Management</p>
              </div>
            </div>
            <p className="text-xs text-[#6B716D] mt-6 leading-relaxed">
              Setelah transfer, simpan struk/tangkapan layar transfer Anda, lalu klik tombol <strong>"Upload Bukti Transfer"</strong> di atas. Admin kami akan segera memverifikasi pembayaran Anda.
            </p>
          </div>
        </div>

        {/* Kolom Kanan: Riwayat Pembayaran */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-3xl p-6 border border-[#E5E3DE] shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-28">
            <h3 className="text-lg font-bold text-[#202321] mb-4">Riwayat Pembayaran</h3>
            
            <div className="space-y-3">
              {pastBills.length > 0 ? (
                pastBills.map((bill) => (
                  <div key={bill.id} className="p-4 rounded-2xl border border-[#E5E3DE] bg-[#F8F7F4]/50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-sm text-[#202321]">{bill.month}</p>
                        <p className="text-xs text-[#6B716D] mt-0.5">{bill.invoiceNumber}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                        <CheckCircle2 className="w-3 h-3" /> Lunas
                      </span>
                    </div>
                    
                    <div className="flex items-end justify-between mt-2 pt-2 border-t border-[#E5E3DE]/60">
                      <span className="text-xs text-[#6B716D]">Nominal</span>
                      <p className="font-extrabold text-sm text-[#1F3D35]">
                        Rp {bill.amount.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-[#6B716D]">
                  <Receipt className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Belum ada riwayat pembayaran yang lunas.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Modal Upload Bukti Transfer */}
      {isPayModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-[#1F3D35]/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsPayModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-lg transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
            <div className="flex items-center justify-between border-b border-[#E5E3DE] p-6">
              <div>
                <h3 className="text-xl font-bold text-[#1F3D35]">Konfirmasi Pembayaran</h3>
                <p className="text-xs text-[#6B716D] mt-0.5">{selectedInvoice.invoiceNumber} • Rp {selectedInvoice.amount.toLocaleString("id-ID")}</p>
              </div>
              <button 
                onClick={() => setIsPayModalOpen(false)}
                className="rounded-full p-2 text-[#99A09C] hover:bg-[#F8F7F4] hover:text-[#1F3D35]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPayment}>
              <div className="p-6 space-y-4">
                {modalError && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <AlertTriangle className="h-5 w-5 shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}

                {/* Pilih Metode Transfer */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B716D] mb-1.5">
                    Metode Pembayaran
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e: any) => setPaymentMethod(e.target.value)}
                    className="w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] p-3 text-sm font-semibold text-[#1F3D35] outline-none focus:border-[#C69C6D]"
                  >
                    <option value="MANUAL_TRANSFER">Transfer Bank BCA (Manual)</option>
                    <option value="MIDTRANS_VA">Transfer Bank Mandiri (Manual)</option>
                    <option value="QRIS">QRIS / E-Wallet</option>
                  </select>
                </div>

                {/* Bukti Transfer URL */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B716D] mb-1.5">
                    Bukti Transfer / Tautan Gambar Struk <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    placeholder="Contoh: https://i.imgur.com/... atau nomor referensi transfer"
                    className="w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] p-3 text-sm font-medium text-[#1F3D35] outline-none focus:border-[#C69C6D]"
                  />
                  <p className="mt-1 text-[11px] text-[#99A09C]">
                    Anda dapat memasukkan tautan gambar struk ATM / m-Banking atau nomor referensi transfer.
                  </p>
                </div>

                {/* Info preview */}
                <div className="rounded-xl bg-amber-50 p-3.5 border border-amber-200 text-xs text-amber-800">
                  Pastikan nominal yang Anda transfer tepat <strong className="font-bold">Rp {selectedInvoice.amount.toLocaleString("id-ID")}</strong>.
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-[#E5E3DE] bg-[#F8F7F4] p-5">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="rounded-xl border border-[#E5E3DE] bg-white px-5 py-2.5 text-sm font-semibold text-[#6B716D] hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submittingPayment}
                  className="flex items-center gap-2 rounded-xl bg-[#1F3D35] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#152923] disabled:opacity-50"
                >
                  {submittingPayment && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Kirim Bukti Pembayaran</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
