"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Zap, Loader2, Search, Download } from "lucide-react";
import BillingStats from "@/components/admin/tagihan/BillingStats";
import BillingTable, { TabType } from "@/components/admin/tagihan/BillingTable";
import CreateBillModal from "@/components/admin/tagihan/CreateBillModal";
import EditBillModal from "@/components/admin/tagihan/EditBillModal";
import PaymentVerificationSlideOver from "@/components/admin/tagihan/PaymentVerificationSlideOver";
import ConfirmModal from "@/components/ui/ConfirmModal";
import AlertModal from "@/components/ui/AlertModal";
import { apiFetch } from "@/lib/api";
import { BillingItem } from "@/types/admin";

export default function TagihanPage() {
  const [activeTab, setActiveTab] = useState<TabType>("menunggu");
  const [invoices, setInvoices] = useState<BillingItem[]>([]);
  const [stats, setStats] = useState<{ total: number; paid: number; pending: number; waitingVerification: number } | undefined>();
  const [loading, setLoading] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<BillingItem | null>(null);

  // States for Custom Modals
  const [isConfirmGenerateOpen, setIsConfirmGenerateOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmPayCashOpen, setIsConfirmPayCashOpen] = useState(false);
  const [invoiceToEditOrDelete, setInvoiceToEditOrDelete] = useState<BillingItem | null>(null);

  // Filters & Search
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: "success" | "error" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    variant: "info",
  });

  const handleGenerateInvoices = async () => {
    setIsConfirmGenerateOpen(false);
    
    try {
      setIsGenerating(true);
      const res = await apiFetch<{ success: boolean; message: string; generatedCount: number }>("/api/admin/invoices/generate-monthly", {
        method: "POST",
      });
      
      setAlertConfig({
        isOpen: true,
        title: "Berhasil",
        message: res.message,
        variant: "success",
      });

      if (res.generatedCount > 0) {
        await fetchInvoices();
      }
    } catch (err: any) {
      setAlertConfig({
        isOpen: true,
        title: "Terjadi Kesalahan",
        message: err.message || "Gagal membuat tagihan massal",
        variant: "error",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenEdit = (invoice: BillingItem) => {
    setInvoiceToEditOrDelete(invoice);
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (invoice: BillingItem) => {
    setInvoiceToEditOrDelete(invoice);
    setIsConfirmDeleteOpen(true);
  };

  const handleDeleteInvoice = async () => {
    if (!invoiceToEditOrDelete) return;
    setIsConfirmDeleteOpen(false);

    try {
      const res = await apiFetch<{ success: boolean; message: string }>(`/api/admin/invoices/${invoiceToEditOrDelete.id}`, {
        method: "DELETE",
      });
      
      setAlertConfig({
        isOpen: true,
        title: "Berhasil Menghapus",
        message: res.message,
        variant: "success",
      });

      await fetchInvoices();
    } catch (err: any) {
      setAlertConfig({
        isOpen: true,
        title: "Gagal Menghapus",
        message: err.message || "Gagal menghapus tagihan",
        variant: "error",
      });
    }
  };

  const handleOpenPayCash = (invoice: BillingItem) => {
    setInvoiceToEditOrDelete(invoice);
    setIsConfirmPayCashOpen(true);
  };

  const handlePayCash = async () => {
    if (!invoiceToEditOrDelete) return;
    setIsConfirmPayCashOpen(false);

    try {
      const res = await apiFetch<{ success: boolean; message: string }>(`/api/admin/invoices/${invoiceToEditOrDelete.id}/pay-cash`, {
        method: "POST",
      });
      
      setAlertConfig({
        isOpen: true,
        title: "Pembayaran Berhasil",
        message: res.message,
        variant: "success",
      });

      await fetchInvoices();
    } catch (err: any) {
      setAlertConfig({
        isOpen: true,
        title: "Gagal",
        message: err.message || "Gagal memproses pembayaran tunai",
        variant: "error",
      });
    }
  };

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      let url = "/api/admin/invoices";
      const params = new URLSearchParams();
      if (selectedMonth) params.append("month", selectedMonth);
      if (selectedYear) params.append("year", selectedYear);
      if (params.toString()) url += `?${params.toString()}`;
      
      const res = await apiFetch<{ data: BillingItem[]; stats: any }>(url);
      setInvoices(res.data || []);
      setStats(res.stats);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

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

  // Client-side search filtering
  const searchedInvoices = useMemo(() => {
    if (!searchQuery) return invoices;
    const q = searchQuery.toLowerCase();
    return invoices.filter(
      (inv) =>
        inv.tenantName.toLowerCase().includes(q) ||
        inv.roomNumber.toLowerCase().includes(q) ||
        inv.invoiceNumber.toLowerCase().includes(q)
    );
  }, [invoices, searchQuery]);

  const handleExportCSV = () => {
    if (searchedInvoices.length === 0) return;
    
    const headers = ["No. Invoice", "Nama Penghuni", "Kamar", "Periode", "Nominal", "Status", "Jatuh Tempo"];
    const rows = searchedInvoices.map(inv => [
      inv.invoiceNumber,
      inv.tenantName,
      inv.roomNumber,
      inv.period,
      inv.rawAmount.toString(),
      inv.rawStatus,
      inv.dueDate
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Laporan_Tagihan_${selectedMonth || 'Semua'}_${selectedYear || 'Semua'}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsConfirmGenerateOpen(true)}
            disabled={isGenerating}
            className="group flex items-center justify-center space-x-2 rounded-2xl bg-amber-400 px-6 py-3.5 font-bold text-[#1F3D35] shadow-lg transition-all hover:-translate-y-0.5 hover:bg-amber-300 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isGenerating ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Zap className="h-5 w-5 transition-transform group-hover:scale-110" />
            )}
            <span>Generate Bulan Ini</span>
          </button>
          
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="group flex items-center justify-center space-x-2 rounded-2xl bg-[#1F3D35] px-6 py-3.5 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#152923] hover:shadow-xl"
          >
            <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
            <span className="hidden sm:inline">Buat Manual</span>
          </button>
        </div>
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

        {/* Filters & Search */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 rounded-[2rem] bg-white p-4 shadow-[0_2px_15px_rgb(0,0,0,0.04)] border border-[#E5E3DE]">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
              <input
                type="text"
                placeholder="Cari nama atau tagihan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-2.5 pl-12 pr-4 text-sm font-bold outline-none transition-all focus:border-[#C69C6D] focus:bg-white"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full sm:w-auto appearance-none rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-2.5 px-4 text-sm font-bold text-[#1F3D35] outline-none transition-all focus:border-[#C69C6D] focus:bg-white"
            >
              <option value="">Bulan (Semua)</option>
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i + 1} value={String(i + 1)}>
                  {new Date(0, i).toLocaleString('id-ID', { month: 'long' })}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full sm:w-auto appearance-none rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-2.5 px-4 text-sm font-bold text-[#1F3D35] outline-none transition-all focus:border-[#C69C6D] focus:bg-white"
            >
              <option value="">Tahun (Semua)</option>
              {Array.from({ length: 5 }).map((_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={String(year)}>
                    {year}
                  </option>
                );
              })}
            </select>
            <button
              onClick={handleExportCSV}
              title="Export CSV"
              className="group flex items-center justify-center space-x-2 rounded-2xl bg-[#E6F4EA] px-4 py-2.5 font-bold text-[#1E8E3E] transition-all hover:bg-[#D3EADD]"
            >
              <Download className="h-5 w-5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

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
          invoices={searchedInvoices}
          activeTab={activeTab}
          loading={loading}
          onVerify={handleOpenVerify}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onPayCash={handleOpenPayCash}
        />

      </div>

      {/* Modals & Slide-overs */}
      <CreateBillModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchInvoices}
      />

      <EditBillModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchInvoices}
        invoice={invoiceToEditOrDelete}
      />

      <PaymentVerificationSlideOver
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        invoice={selectedInvoice}
        onVerify={handleVerifyPayment}
      />

      <ConfirmModal
        isOpen={isConfirmGenerateOpen}
        title="Generate Tagihan Otomatis"
        message="Sistem akan mengecek seluruh penyewa aktif dan membuatkan tagihan secara otomatis untuk bulan ini. Lanjutkan?"
        confirmText="Ya, Generate Sekarang"
        cancelText="Batal"
        onConfirm={handleGenerateInvoices}
        onCancel={() => setIsConfirmGenerateOpen(false)}
        variant="warning"
      />

      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        title="Hapus Tagihan?"
        message={`Apakah Anda yakin ingin menghapus tagihan ${invoiceToEditOrDelete?.invoiceNumber} untuk ${invoiceToEditOrDelete?.tenantName}?`}
        confirmText="Ya, Hapus Tagihan"
        cancelText="Batal"
        onConfirm={handleDeleteInvoice}
        onCancel={() => setIsConfirmDeleteOpen(false)}
        variant="danger"
      />

      <ConfirmModal
        isOpen={isConfirmPayCashOpen}
        title="Terima Pembayaran Tunai?"
        message={`Anda akan menandai tagihan ${invoiceToEditOrDelete?.invoiceNumber} sebesar Rp ${invoiceToEditOrDelete?.amount} milik ${invoiceToEditOrDelete?.tenantName} sebagai LUNAS. Lanjutkan?`}
        confirmText="Ya, Tandai Lunas"
        cancelText="Batal"
        onConfirm={handlePayCash}
        onCancel={() => setIsConfirmPayCashOpen(false)}
        variant="success"
      />

      <AlertModal
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        variant={alertConfig.variant}
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
