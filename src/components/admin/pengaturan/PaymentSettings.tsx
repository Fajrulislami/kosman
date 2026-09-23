"use client";

import { CreditCard, Plus, Trash2, Building } from "lucide-react";

export default function PaymentSettings() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#1F3D35]">Rekening Pembayaran</h2>
          <p className="mt-1 text-sm font-medium text-[#6B716D]">
            Daftar rekening bank atau e-Wallet yang bisa digunakan penghuni untuk transfer.
          </p>
        </div>
        <button className="flex items-center justify-center space-x-2 rounded-2xl bg-[#1F3D35] px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#152923] hover:shadow-xl">
          <Plus className="h-4 w-4" />
          <span>Tambah Rekening</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* Card Bank 1 */}
        <div className="group flex items-center justify-between rounded-[2rem] bg-white p-6 shadow-[0_2px_15px_rgb(0,0,0,0.04)] border border-[#E5E3DE] transition-all hover:border-[#C69C6D]/30">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8F7F4] text-[#1F3D35]">
              <Building className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-[#99A09C]">BCA (Bank Central Asia)</p>
              <div className="mt-1 flex items-center space-x-2">
                <span className="text-lg font-black text-[#1F3D35]">123 456 7890</span>
                <span className="text-sm font-semibold text-[#6B716D]">- a.n. Budi Pondok Rahmat</span>
              </div>
            </div>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF9F9] text-[#E54D2E] opacity-0 transition-all group-hover:opacity-100 hover:bg-[#FFEAEA]">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Card Bank 2 */}
        <div className="group flex items-center justify-between rounded-[2rem] bg-white p-6 shadow-[0_2px_15px_rgb(0,0,0,0.04)] border border-[#E5E3DE] transition-all hover:border-[#C69C6D]/30">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8F7F4] text-[#1F3D35]">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-[#99A09C]">GoPay / QRIS</p>
              <div className="mt-1 flex items-center space-x-2">
                <span className="text-lg font-black text-[#1F3D35]">0812 3456 7890</span>
                <span className="text-sm font-semibold text-[#6B716D]">- a.n. Budi Pondok Rahmat</span>
              </div>
            </div>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF9F9] text-[#E54D2E] opacity-0 transition-all group-hover:opacity-100 hover:bg-[#FFEAEA]">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
