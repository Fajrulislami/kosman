"use client";

import { useState } from "react";
import { CreditCard, Plus, Trash2, Building, X, Check, AlertTriangle, Power } from "lucide-react";

export interface PaymentMethod {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  accountHolder: string;
  isActive?: boolean;
}

interface PaymentSettingsProps {
  methods: PaymentMethod[];
  onChange: (methods: PaymentMethod[]) => void;
}

const POPULAR_BANKS = ["BCA", "Mandiri", "BRI", "BNI", "BSI", "QRIS", "DANA", "GoPay"];

export default function PaymentSettings({ methods, onChange }: PaymentSettingsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newBankName, setNewBankName] = useState("");
  const [newAccountNumber, setNewAccountNumber] = useState("");
  const [newAccountName, setNewAccountName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<PaymentMethod | null>(null);

  const handleAdd = () => {
    if (!newBankName.trim() || !newAccountNumber.trim() || !newAccountName.trim()) return;
    
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      bankName: newBankName.trim(),
      accountNumber: newAccountNumber.trim(),
      accountName: newAccountName.trim(),
      accountHolder: newAccountName.trim(),
      isActive: true,
    };
    
    onChange([...(methods || []), newMethod]);
    setIsAdding(false);
    setNewBankName("");
    setNewAccountNumber("");
    setNewAccountName("");
  };

  const handleToggleActive = (id: string) => {
    onChange(
      (methods || []).map((m) => {
        if (m.id === id) {
          const currentStatus = m.isActive !== false;
          return { ...m, isActive: !currentStatus };
        }
        return m;
      })
    );
  };

  const confirmRemove = () => {
    if (!deleteTarget) return;
    onChange((methods || []).filter((m) => m.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#1F3D35]">Rekening Pembayaran</h2>
          <p className="mt-1 text-sm font-medium text-[#6B716D]">
            Daftar rekening bank atau e-Wallet yang tampil di Portal Penghuni untuk transfer tagihan sewa.
          </p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center space-x-2 rounded-2xl bg-[#1F3D35] px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#152923] hover:shadow-xl"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Rekening</span>
        </button>
      </div>

      <div className="space-y-4">
        
        {/* Form Tambah Rekening (Muncul jika isAdding true) */}
        {isAdding && (
          <div className="rounded-[2rem] bg-white p-6 shadow-[0_2px_15px_rgb(0,0,0,0.04)] border-2 border-[#C69C6D] animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1F3D35]">Tambah Rekening Baru</h3>
              <button onClick={() => setIsAdding(false)} className="text-[#99A09C] hover:text-red-500">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Bank Presets */}
            <div className="mb-4">
              <p className="text-xs font-bold text-[#6B716D] mb-2">Pilih Cepat Bank / e-Wallet:</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_BANKS.map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => setNewBankName(bank)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                      newBankName.toUpperCase() === bank.toUpperCase()
                        ? "bg-[#1F3D35] text-white shadow-sm"
                        : "bg-[#F8F7F4] text-[#6B716D] hover:bg-[#E5E3DE] hover:text-[#1F3D35]"
                    }`}
                  >
                    {bank}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-[#6B716D] mb-1 block">Nama Bank / Metode</label>
                <input 
                  type="text" 
                  value={newBankName}
                  onChange={(e) => setNewBankName(e.target.value)}
                  placeholder="Contoh: BCA / Mandiri / QRIS" 
                  className="w-full rounded-xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-2 px-3 text-sm font-bold outline-none focus:border-[#C69C6D]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#6B716D] mb-1 block">Nomor Rekening / No. HP</label>
                <input 
                  type="text" 
                  value={newAccountNumber}
                  onChange={(e) => setNewAccountNumber(e.target.value)}
                  placeholder="Contoh: 8271902811" 
                  className="w-full rounded-xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-2 px-3 text-sm font-bold outline-none focus:border-[#C69C6D]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[#6B716D] mb-1 block">Atas Nama Pemilik Rekening (A.N)</label>
                <input 
                  type="text" 
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  placeholder="Contoh: Kostara Management / Budi Santoso" 
                  className="w-full rounded-xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-2 px-3 text-sm font-bold outline-none focus:border-[#C69C6D]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button 
                type="button"
                onClick={() => setIsAdding(false)} 
                className="rounded-xl px-4 py-2 text-sm font-semibold text-[#6B716D] hover:bg-[#F8F7F4]"
              >
                Batal
              </button>
              <button 
                type="button"
                onClick={handleAdd} 
                className="flex items-center space-x-2 rounded-xl bg-[#C69C6D] px-6 py-2 text-sm font-bold text-white hover:bg-[#b08759] transition-all shadow-md"
              >
                <Check className="h-4 w-4" />
                <span>Simpan Rekening</span>
              </button>
            </div>
          </div>
        )}

        {/* Daftar Rekening Aktif */}
        {methods && methods.length > 0 ? (
          methods.map((method) => {
            const isActive = method.isActive !== false;
            const holderName = method.accountHolder || method.accountName || "-";

            return (
              <div 
                key={method.id} 
                className={`group flex items-center justify-between rounded-[2rem] bg-white p-6 shadow-[0_2px_15px_rgb(0,0,0,0.04)] border transition-all ${
                  isActive ? "border-[#E5E3DE] hover:border-[#C69C6D]/50" : "border-gray-200 bg-gray-50/70 opacity-75"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                    isActive ? "bg-[#F8F7F4] text-[#1F3D35]" : "bg-gray-200 text-gray-500"
                  }`}>
                    <Building className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold uppercase tracking-wider text-[#99A09C]">{method.bankName}</p>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-600"
                      }`}>
                        {isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-lg font-black text-[#1F3D35]">{method.accountNumber}</span>
                      <span className="text-sm font-semibold text-[#6B716D]">- a.n. {holderName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Toggle Aktif / Nonaktif */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(method.id)}
                    title={isActive ? "Nonaktifkan rekening ini" : "Aktifkan rekening ini"}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all border ${
                      isActive 
                        ? "border-[#E5E3DE] bg-[#F8F7F4] text-[#1F3D35] hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200" 
                        : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    <Power className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{isActive ? "Matikan" : "Aktifkan"}</span>
                  </button>

                  {/* Tombol Hapus */}
                  <button 
                    type="button"
                    onClick={() => setDeleteTarget(method)}
                    title="Hapus rekening"
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF9F9] text-[#E54D2E] border border-transparent transition-all hover:border-[#E54D2E]/20 hover:bg-[#FFEAEA]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          !isAdding && (
            <div className="rounded-[2rem] bg-[#F8F7F4] p-8 text-center border-2 border-dashed border-[#E5E3DE]">
              <p className="text-[#99A09C] font-medium text-sm">Belum ada rekening pembayaran yang ditambahkan.</p>
            </div>
          )
        )}
      </div>

      {/* Modal Konfirmasi Hapus Rekening */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl border border-[#E5E3DE] animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-black text-[#1F3D35]">Hapus Rekening?</h3>
            </div>
            <p className="text-sm text-[#6B716D] leading-relaxed mb-6">
              Apakah Anda yakin ingin menghapus rekening <strong>{deleteTarget.bankName} - {deleteTarget.accountNumber}</strong> (a.n. {deleteTarget.accountHolder || deleteTarget.accountName})? Rekening ini tidak akan lagi muncul di Portal Penghuni.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl px-5 py-2.5 text-sm font-bold text-[#6B716D] hover:bg-[#F8F7F4] transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmRemove}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition-colors shadow-md"
              >
                Ya, Hapus Rekening
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
