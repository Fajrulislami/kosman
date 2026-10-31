"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CheckCircle2, Loader2, WifiOff, RotateCw, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { PortalInvoiceItem } from "@/types/portal";
import ActiveBillCard from "./ActiveBillCard";
import BankAccountsCard from "./BankAccountsCard";
import PaymentHistoryList from "./PaymentHistoryList";
import PaymentModal from "./PaymentModal";
import ProofPreviewModal from "./ProofPreviewModal";

export default function TagihanContent() {
  const [invoices, setInvoices] = useState<PortalInvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);

  // Modal payment state
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<PortalInvoiceItem | null>(null);
  
  // Modal preview proof state
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<PortalInvoiceItem | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const wasWaitingRef = useRef(false);

  const fetchInvoices = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await apiFetch<{ data: PortalInvoiceItem[] }>("/api/portal/invoices");
      const data = res.data || [];
      
      // Deteksi jika pembayaran baru saja disetujui admin
      const hasWaiting = data.some((b) => b.rawStatus === "WAITING_CONFIRMATION");
      if (wasWaitingRef.current && !hasWaiting) {
        const recentlyPaid = data.find((b) => b.rawStatus === "PAID");
        if (recentlyPaid) {
          setSuccessMessage(`Pembayaran tagihan ${recentlyPaid.month} telah diverifikasi lunas oleh pengelola! Kwitansi resmi kini dapat dicetak.`);
          setTimeout(() => setSuccessMessage(null), 8000);
        }
      }
      wasWaitingRef.current = hasWaiting;

      setInvoices(data);
      setFetchError(null);
    } catch (err) {
      if (!silent) {
        console.error("Failed to load portal invoices:", err);
        setFetchError(err instanceof Error ? err.message : "Gagal memuat data tagihan sewa");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();

    // 1. Auto-refresh saat pengguna beralih kembali ke tab ini
    const handleSync = () => {
      fetchInvoices(true);
    };
    window.addEventListener("focus", handleSync);
    document.addEventListener("visibilitychange", handleSync);

    // 2. Real-time polling setiap 5 detik agar status verifikasi langsung terupdate otomatis
    const interval = setInterval(() => {
      fetchInvoices(true);
    }, 5000);

    // Ambil rekening pembayaran dinamis dari pengaturan kos
    const fetchSettings = async () => {
      try {
        const res = await apiFetch<{ data: { paymentMethods?: any[] } }>("/api/settings");
        if (res?.data?.paymentMethods && Array.isArray(res.data.paymentMethods)) {
          const activeBanks = res.data.paymentMethods.filter((p: any) => p.isActive);
          if (activeBanks.length > 0) {
            setBankAccounts(activeBanks);
          }
        }
      } catch {
        // Fallback ke default di BankAccountsCard
      }
    };
    fetchSettings();

    return () => {
      window.removeEventListener("focus", handleSync);
      document.removeEventListener("visibilitychange", handleSync);
      clearInterval(interval);
    };
  }, [fetchInvoices]);

  // Saring semua tagihan yang membutuhkan tindakan atau belum diverifikasi
  const pendingBills = invoices.filter(
    (b) => b.rawStatus === "OVERDUE" || b.payment?.status === "REJECTED" || b.rawStatus === "WAITING_CONFIRMATION" || b.rawStatus === "PENDING"
  );

  // Tagihan aktif prioritas utama (OVERDUE -> REJECTED -> WAITING_CONFIRMATION -> PENDING)
  const activeBill =
    pendingBills.find((b) => b.rawStatus === "OVERDUE") ||
    pendingBills.find((b) => b.payment?.status === "REJECTED") ||
    pendingBills.find((b) => b.rawStatus === "WAITING_CONFIRMATION") ||
    pendingBills.find((b) => b.rawStatus === "PENDING");

  // Tagihan tertunda lainnya jika ada lebih dari 1 tagihan belum lunas
  const otherPendingBills = activeBill
    ? pendingBills.filter((b) => b.id !== activeBill.id)
    : [];

  const pastBills = invoices.filter((b) => b.rawStatus === "PAID");

  const handleOpenPayModal = (bill: PortalInvoiceItem) => {
    setSelectedInvoice(bill);
    setIsPayModalOpen(true);
  };

  const handleOpenPreviewModal = (bill: PortalInvoiceItem) => {
    setPreviewInvoice(bill);
    setIsPreviewModalOpen(true);
  };

  const handlePaymentSuccess = async () => {
    setSuccessMessage("Bukti pembayaran berhasil dikirim! Tim pengelola akan segera memverifikasi.");
    await fetchInvoices();
    setTimeout(() => setSuccessMessage(null), 6000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-[#6B716D]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1F3D35]" />
        <p className="mt-3 text-sm font-medium">Memuat data tagihan sewa...</p>
      </div>
    );
  }

  // Fallback UI jika terjadi error jaringan saat pertama kali memuat data
  if (fetchError && invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mb-4 shadow-xs">
          <WifiOff className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#202321]">Gagal Menghubungkan ke Server</h2>
        <p className="mt-2 text-sm text-[#6B716D] max-w-md leading-relaxed">
          Terjadi kendala saat mengambil data tagihan sewa. Pastikan koneksi internet Anda lancar dan server backend sedang berjalan.
        </p>
        <button
          onClick={() => fetchInvoices()}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1F3D35] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#1F3D35]/20 hover:bg-[#162E28] transition-all active:scale-95 cursor-pointer"
        >
          <RotateCw className="w-4 h-4" />
          <span>Muat Ulang Tagihan</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#202321]">Tagihan & Pembayaran</h1>
        <p className="text-[#6B716D] mt-1">Kelola tagihan sewa, upload bukti transfer dari perangkat Anda, dan unduh kwitansi resmi kos.</p>
      </div>

      {successMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Kolom Kiri: Tagihan Aktif & Rekening Resmi */}
        <div className="xl:col-span-2 space-y-8">
          <ActiveBillCard 
            activeBill={activeBill} 
            onPayClick={handleOpenPayModal}
            onPreviewProofClick={handleOpenPreviewModal}
          />

          {/* Banner Tagihan Tertunda Lainnya (Jika ada lebih dari 1 tagihan aktif) */}
          {otherPendingBills.length > 0 && (
            <div className="rounded-3xl border border-amber-200 bg-amber-50/80 p-5 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Terdapat {otherPendingBills.length} Tagihan Tertunda Lainnya</span>
              </div>
              <div className="divide-y divide-amber-200/60 bg-white rounded-2xl border border-amber-200/80 overflow-hidden shadow-2xs">
                {otherPendingBills.map((b) => (
                  <div key={b.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs sm:text-sm">
                    <div>
                      <p className="font-bold text-[#1F3D35]">{b.month} ({b.invoiceNumber})</p>
                      <p className="text-[11px] text-[#6B716D] mt-0.5">Jatuh tempo: {b.dueDate}</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <span className="font-extrabold text-[#202321]">Rp {b.amount.toLocaleString("id-ID")}</span>
                      <button
                        onClick={() => handleOpenPayModal(b)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#1F3D35] hover:bg-[#162E28] text-white text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
                      >
                        Bayar Sekarang
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <BankAccountsCard 
            bankAccounts={bankAccounts} 
          />
        </div>

        {/* Kolom Kanan: Riwayat Pembayaran & Cetak Kwitansi */}
        <div className="xl:col-span-1">
          <PaymentHistoryList 
            pastBills={pastBills} 
          />
        </div>
      </div>

      {/* Modal Upload Bukti Transfer */}
      <PaymentModal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        selectedInvoice={selectedInvoice}
        onSuccess={handlePaymentSuccess}
        bankAccounts={bankAccounts}
      />

      {/* Modal Lightbox Pratinjau Bukti Transfer */}
      <ProofPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        proofUrl={previewInvoice?.payment?.proofUrl || null}
        invoiceNumber={previewInvoice?.invoiceNumber || ""}
        amount={previewInvoice?.amount || 0}
        onReuploadClick={() => {
          if (previewInvoice) {
            handleOpenPayModal(previewInvoice);
          }
        }}
      />
    </div>
  );
}

