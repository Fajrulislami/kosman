"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus } from "lucide-react";
import BillingStats from "@/components/admin/tagihan/BillingStats";
import BillingTable, { TabType } from "@/components/admin/tagihan/BillingTable";
import CreateBillModal from "@/components/admin/tagihan/CreateBillModal";
import PaymentVerificationSlideOver from "@/components/admin/tagihan/PaymentVerificationSlideOver";
import { apiFetch } from "@/lib/api";
import { BillingItem } from "@/types/admin";

export default function TagihanPage() {
  const [activeTab, setActiveTab] = useState<TabType>("menunggu");
  const [invoices, setInvoices] = useState<BillingItem[]>([]);
  const [stats, setStats] = useState<{ total: number; paid: number; pending: number; waitingVerification: number } | undefined>();
  const [loading, setLoading] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<BillingItem | null>(null);

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch<{ data: BillingItem[]; stats: any }>("/api/admin/invoices");
      setInvoices(res.data || []);
      setStats(res.stats);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Aggregate amounts
  const { totalRevenue, waitingAmount, unpaidAmount } = useMemo(() => {
    let rev = 0;
    let wait = 0;
    let unp = 0;

    invoices.forEach((inv) => {
      if (inv.rawStatus === "PAID") rev += inv.rawAmount;
      else if (inv.rawStatus === "WAITING_CONFIRMATION") wait += inv.rawAmount;
      else if (inv.rawStatus === "PENDING" || inv.rawStatus === "OVERDUE") unp += inv.rawAmount;
    });

    return { totalRevenue: rev, waitingAmount: wait, unpaidAmount: unp };
  }, [invoices]);

  const handleOpenVerify = (invoice: BillingItem) => {
    setSelectedInvoice(invoice);
    setIsVerifyOpen(true);
  };

  const handleVerifyPayment = async (paymentId: string, action: "APPROVE" | "REJECT", reason?: string) => {
    await apiFetch(`/api/admin/payments/${paymentId}/verify`, {
      method: "POST",
      body: JSON.stringify({ action, rejectReason: reason }),
    });
    await fetchInvoices();
  };

  const waitingCount = invoices.filter((i) => i.rawStatus === "WAITING_CONFIRMATION").length;
  const unpaidCount = invoices.filter((i) => i.rawStatus === "PENDING" || i.rawStatus === "OVERDUE").length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-end sm:space-y-0">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#1F3D35]">Tagihan & Pembayaran</h1>
          <p className="mt-1 text-sm font-medium text-[#6B716D]">
            Pantau arus kas sewa, ingatkan tagihan tertunda, dan verifikasi bukti transfer pembayaran.
          </p>
        </div>

        {/* Call to Action */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="group flex items-center justify-center space-x-2 rounded-2xl bg-[#1F3D35] px-6 py-3.5 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#152923] hover:shadow-xl"
        >
          <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
          <span>Buat Tagihan</span>
        </button>
      </div>

      {/* Stats Bento Grid */}
      <BillingStats
        stats={stats}
        totalRevenue={totalRevenue}
        waitingAmount={waitingAmount}
        unpaidAmount={unpaidAmount}
      />

      {/* Main Content Area (Tabs & Table) */}
      <div className="space-y-6">

        {/* Custom Tab Navigation */}
        <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          <button
            onClick={() => setActiveTab("menunggu")}
            className={`whitespace-nowrap rounded-2xl px-6 py-3 text-sm font-bold transition-all flex items-center ${
              activeTab === "menunggu"
                ? "bg-[#1F3D35] text-white shadow-md"
                : "bg-white text-[#6B716D] hover:bg-[#F8F7F4] hover:text-[#1F3D35]"
            }`}
          >
            <span>Menunggu Verifikasi</span>
            {waitingCount > 0 && (
              <span className={`ml-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold ${
                activeTab === "menunggu" ? "bg-amber-400 text-[#1F3D35]" : "bg-[#FFF4E5] text-[#F59E0B]"
              }`}>
                {waitingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("nunggak")}
            className={`whitespace-nowrap rounded-2xl px-6 py-3 text-sm font-bold transition-all flex items-center ${
              activeTab === "nunggak"
                ? "bg-[#E54D2E] text-white shadow-md"
                : "bg-white text-[#6B716D] hover:bg-[#FFF9F9] hover:text-[#E54D2E]"
            }`}
          >
            <span>Belum Lunas</span>
            {unpaidCount > 0 && (
              <span className={`ml-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold ${
                activeTab === "nunggak" ? "bg-white text-[#E54D2E]" : "bg-[#FFEAEA] text-[#E54D2E]"
              }`}>
                {unpaidCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("lunas")}
            className={`whitespace-nowrap rounded-2xl px-6 py-3 text-sm font-bold transition-all ${
              activeTab === "lunas"
                ? "bg-[#1F3D35] text-white shadow-md"
                : "bg-white text-[#6B716D] hover:bg-[#F8F7F4] hover:text-[#1F3D35]"
            }`}
          >
            Riwayat Lunas
          </button>
        </div>

        {/* Dynamic Table based on Active Tab */}
        <BillingTable
          invoices={invoices}
          activeTab={activeTab}
          loading={loading}
          onVerify={handleOpenVerify}
        />

      </div>

      {/* Modals & Slide-overs */}
      <CreateBillModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchInvoices}
      />

      <PaymentVerificationSlideOver
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        invoice={selectedInvoice}
        onVerify={handleVerifyPayment}
      />
    </div>
  );
}
