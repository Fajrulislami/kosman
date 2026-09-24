"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import BillingStats from "@/components/admin/tagihan/BillingStats";
import BillingTable, { TabType } from "@/components/admin/tagihan/BillingTable";
import CreateBillModal from "@/components/admin/tagihan/CreateBillModal";
import PaymentVerificationSlideOver from "@/components/admin/tagihan/PaymentVerificationSlideOver";

export default function TagihanPage() {
  const [activeTab, setActiveTab] = useState<TabType>("menunggu");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  const handleVerify = (id: string) => {
    setSelectedInvoiceId(id);
    setIsVerifyOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-end sm:space-y-0">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#1F3D35]">Tagihan & Pembayaran</h1>
          <p className="mt-1 text-sm font-medium text-[#6B716D]">
            Pantau arus kas, tagih yang nunggak, dan verifikasi bukti transfer.
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
      <BillingStats />

      {/* Main Content Area (Tabs & Table) */}
      <div className="space-y-6">

        {/* Custom Tab Navigation */}
        <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          <button
            onClick={() => setActiveTab("menunggu")}
            className={`whitespace-nowrap rounded-2xl px-6 py-3 text-sm font-bold transition-all ${activeTab === "menunggu"
                ? "bg-[#1F3D35] text-white shadow-md"
                : "bg-white text-[#6B716D] hover:bg-[#F8F7F4] hover:text-[#1F3D35]"
              }`}
          >
            Menunggu Verifikasi
            {activeTab !== "menunggu" && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-[#FFF4E5] px-2 py-0.5 text-xs text-[#F59E0B]">
                3
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("nunggak")}
            className={`whitespace-nowrap rounded-2xl px-6 py-3 text-sm font-bold transition-all ${activeTab === "nunggak"
                ? "bg-[#E54D2E] text-white shadow-md"
                : "bg-white text-[#6B716D] hover:bg-[#FFF9F9] hover:text-[#E54D2E]"
              }`}
          >
            Belum Lunas
            {activeTab !== "nunggak" && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-[#FFEAEA] px-2 py-0.5 text-xs text-[#E54D2E]">
                5
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("lunas")}
            className={`whitespace-nowrap rounded-2xl px-6 py-3 text-sm font-bold transition-all ${activeTab === "lunas"
                ? "bg-[#1F3D35] text-white shadow-md"
                : "bg-white text-[#6B716D] hover:bg-[#F8F7F4] hover:text-[#1F3D35]"
              }`}
          >
            Riwayat Lunas
          </button>
        </div>

        {/* Dynamic Table based on Active Tab */}
        <BillingTable activeTab={activeTab} onVerify={handleVerify} />

      </div>

      {/* Modals & Slide-overs */}
      <CreateBillModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <PaymentVerificationSlideOver
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        invoiceId={selectedInvoiceId}
      />
    </div>
  );
}
