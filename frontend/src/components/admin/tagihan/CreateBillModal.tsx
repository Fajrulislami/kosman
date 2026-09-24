"use client";

import { X, User, Receipt, FileText } from "lucide-react";

interface CreateBillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateBillModal({ isOpen, onClose }: CreateBillModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1F3D35]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Panel */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-[2rem] bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E3DE] px-8 py-6">
          <div>
            <h3 className="text-xl font-black text-[#1F3D35]">Buat Tagihan</h3>
            <p className="mt-1 text-sm font-medium text-[#6B716D]">Tambahkan tagihan baru untuk penghuni</p>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full bg-[#F8F7F4] p-2 text-[#99A09C] transition-colors hover:bg-[#E5E3DE] hover:text-[#1F3D35]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="px-8 py-6">
          <form className="space-y-6">
            {/* Penghuni */}
            <div>
              <label className="mb-2 block text-sm font-bold text-[#1F3D35]">Pilih Penghuni / Kamar</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
                <select 
                  defaultValue=""
                  className="w-full appearance-none rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-3.5 pl-12 pr-10 text-sm font-bold text-[#1F3D35] outline-none transition-all focus:border-[#C69C6D] focus:bg-white cursor-pointer"
                >
                  <option value="" disabled>Pilih penghuni</option>
                  <option value="101">Kamar 101 - Budi Santoso</option>
                  <option value="102">Kamar 102 - Siti Aminah</option>
                  <option value="201">Kamar 201 - Andi Wijaya</option>
                </select>
              </div>
            </div>

            {/* Nominal */}
            <div>
              <label className="mb-2 block text-sm font-bold text-[#1F3D35]">Nominal Tagihan (Rp)</label>
              <div className="relative">
                <Receipt className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
                <input 
                  type="number" 
                  placeholder="Contoh: 1500000"
                  className="w-full rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-3.5 pl-12 pr-4 text-sm font-bold outline-none transition-all focus:border-[#C69C6D] focus:bg-white"
                />
              </div>
            </div>

            {/* Keterangan */}
            <div>
              <label className="mb-2 block text-sm font-bold text-[#1F3D35]">Keterangan</label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 h-5 w-5 text-[#99A09C]" />
                <textarea 
                  rows={3}
                  placeholder="Contoh: Tagihan sewa bulan November 2026"
                  className="w-full rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-3.5 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-[#C69C6D] focus:bg-white resize-none"
                ></textarea>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#F8F7F4] px-8 py-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-2xl bg-[#1F3D35] px-6 py-3.5 text-sm font-black text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#152923] hover:shadow-xl sm:ml-3 sm:w-auto"
          >
            Kirim Tagihan
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 inline-flex w-full justify-center rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-[#1F3D35] shadow-sm ring-2 ring-inset ring-[#E5E3DE] transition-all hover:bg-gray-50 sm:mt-0 sm:w-auto"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
