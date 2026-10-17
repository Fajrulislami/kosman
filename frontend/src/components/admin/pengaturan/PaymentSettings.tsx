"use client";

import { useState } from "react";
import { CreditCard, Plus, Trash2, Building, X, Check } from "lucide-react";

export interface PaymentMethod {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

interface PaymentSettingsProps {
  methods: PaymentMethod[];
  onChange: (methods: PaymentMethod[]) => void;
}

export default function PaymentSettings({ methods, onChange }: PaymentSettingsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newBankName, setNewBankName] = useState("");
  const [newAccountNumber, setNewAccountNumber] = useState("");
  const [newAccountName, setNewAccountName] = useState("");

  const handleAdd = () => {
    if (!newBankName || !newAccountNumber || !newAccountName) return;
    
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      bankName: newBankName,
      accountNumber: newAccountNumber,
      accountName: newAccountName
    };
    
    onChange([...(methods || []), newMethod]);
    setIsAdding(false);
    setNewBankName("");
    setNewAccountNumber("");
    setNewAccountName("");
  };

  const handleRemove = (id: string) => {
    onChange(methods.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#1F3D35]">Rekening Pembayaran</h2>
          <p className="mt-1 text-sm font-medium text-[#6B716D]">
            Daftar rekening bank atau e-Wallet yang bisa digunakan penghuni untuk transfer.
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-[#6B716D] mb-1 block">Nama Bank / e-Wallet</label>
                <input 
                  type="text" 
                  value={newBankName}
                  onChange={(e) => setNewBankName(e.target.value)}
                  placeholder="BCA / Mandiri / GoPay" 
                  className="w-full rounded-xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-2 px-3 text-sm font-bold outline-none focus:border-[#C69C6D]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#6B716D] mb-1 block">Nomor Rekening / HP</label>
                <input 
                  type="text" 
                  value={newAccountNumber}
                  onChange={(e) => setNewAccountNumber(e.target.value)}
                  placeholder="1234567890" 
                  className="w-full rounded-xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-2 px-3 text-sm font-bold outline-none focus:border-[#C69C6D]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[#6B716D] mb-1 block">Atas Nama (A.N)</label>
                <input 
                  type="text" 
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  placeholder="Budi Santoso" 
                  className="w-full rounded-xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-2 px-3 text-sm font-bold outline-none focus:border-[#C69C6D]"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={handleAdd} className="flex items-center space-x-2 rounded-xl bg-[#C69C6D] px-6 py-2 text-sm font-bold text-white hover:bg-[#b08759]">
                <Check className="h-4 w-4" />
                <span>Simpan Rekening</span>
              </button>
            </div>
          </div>
        )}

        {/* Daftar Rekening Aktif */}
        {methods && methods.length > 0 ? methods.map((method) => (
          <div key={method.id} className="group flex items-center justify-between rounded-[2rem] bg-white p-6 shadow-[0_2px_15px_rgb(0,0,0,0.04)] border border-[#E5E3DE] transition-all hover:border-[#C69C6D]/30">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8F7F4] text-[#1F3D35]">
                <Building className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-[#99A09C]">{method.bankName}</p>
                <div className="mt-1 flex items-center space-x-2">
                  <span className="text-lg font-black text-[#1F3D35]">{method.accountNumber}</span>
                  <span className="text-sm font-semibold text-[#6B716D]">- a.n. {method.accountName}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => handleRemove(method.id)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF9F9] text-[#E54D2E] opacity-0 transition-all group-hover:opacity-100 hover:bg-[#FFEAEA]"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )) : (
          !isAdding && (
            <div className="rounded-[2rem] bg-[#F8F7F4] p-8 text-center border-2 border-dashed border-[#E5E3DE]">
              <p className="text-[#99A09C] font-medium text-sm">Belum ada rekening pembayaran yang ditambahkan.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
