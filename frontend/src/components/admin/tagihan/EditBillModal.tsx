"use client";

import { useState, useEffect } from "react";
import { X, Receipt, Calendar, Loader2, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { BillingItem } from "@/types/admin";

interface EditBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  invoice: BillingItem | null;
}

export default function EditBillModal({ isOpen, onClose, onSuccess, invoice }: EditBillModalProps) {
  const [amount, setAmount] = useState("");
  const [periodMonth, setPeriodMonth] = useState(new Date().getMonth() + 1);
  const [periodYear, setPeriodYear] = useState(new Date().getFullYear());
  const [dueDate, setDueDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && invoice) {
      setAmount(formatNumber(invoice.rawAmount.toString()));
      setDueDate(invoice.dueDate);
      
      const [m, y] = invoice.period.split("/");
      if (m && y) {
        setPeriodMonth(parseInt(m));
        setPeriodYear(parseInt(y));
      }
      setError(null);
    }
  }, [isOpen, invoice]);

  const formatNumber = (val: string) => {
    const num = val.replace(/\D/g, "");
    if (!num) return "";
    return new Intl.NumberFormat("id-ID").format(parseInt(num, 10));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(formatNumber(e.target.value));
  };

  if (!isOpen || !invoice) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseInt(amount.replace(/\D/g, ""));
    
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Nominal tagihan harus berupa angka positif");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiFetch(`/api/admin/invoices/${invoice.id}`, {
        method: "PUT",
        body: JSON.stringify({
          amount: numAmount,
          dueDate,
          periodMonth: Number(periodMonth),
          periodYear: Number(periodYear),
        }),
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengupdate tagihan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#1F3D35]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="relative z-10 w-full max-w-md transform overflow-hidden rounded-[2rem] bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E3DE] px-8 py-6">
          <div>
            <h3 className="text-xl font-black text-[#1F3D35]">Edit Tagihan</h3>
            <p className="mt-1 text-sm font-medium text-[#6B716D]">
              {invoice.tenantName} - Kamar {invoice.roomNumber}
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#F8F7F4] p-2 text-[#99A09C] transition-colors hover:bg-[#E5E3DE] hover:text-[#1F3D35]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-8 py-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Nominal */}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#1F3D35]">Nominal Tagihan (Rp)</label>
              <div className="relative">
                <Receipt className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
                <input 
                  type="text" 
                  required
                  value={amount}
                  onChange={handleAmountChange}
                  className="w-full rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-3 pl-12 pr-4 text-sm font-bold outline-none transition-all focus:border-[#C69C6D] focus:bg-white"
                />
              </div>
            </div>

            {/* Periode Bulan & Tahun */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#1F3D35]">Bulan Periode</label>
                <select
                  value={periodMonth}
                  onChange={(e) => setPeriodMonth(parseInt(e.target.value))}
                  className="w-full rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-3 px-3 text-sm font-bold text-[#1F3D35] outline-none focus:border-[#C69C6D]"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Bulan {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#1F3D35]">Tahun</label>
                <input
                  type="number"
                  required
                  value={periodYear}
                  onChange={(e) => setPeriodYear(parseInt(e.target.value))}
                  className="w-full rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-3 px-4 text-sm font-bold outline-none focus:border-[#C69C6D]"
                />
              </div>
            </div>

            {/* Tanggal Jatuh Tempo */}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#1F3D35]">Tanggal Jatuh Tempo</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
                <input 
                  type="date" 
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-3 pl-12 pr-4 text-sm font-bold outline-none transition-all focus:border-[#C69C6D] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-[#F8F7F4] px-8 py-5 flex flex-row-reverse gap-3 border-t border-[#E5E3DE]">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-2xl bg-[#C69C6D] px-6 py-3 text-sm font-black text-white shadow-lg transition-all hover:bg-[#b0875e] disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Simpan Perubahan</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-[#1F3D35] border border-[#E5E3DE] hover:bg-gray-50 transition-all"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
