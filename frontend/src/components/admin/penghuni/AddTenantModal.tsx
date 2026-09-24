"use client";

import { X, User, Phone, Home } from "lucide-react";

interface AddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTenantModal({ isOpen, onClose }: AddTenantModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1F3D35]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Panel */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E3DE] px-6 py-5">
          <div>
            <h3 className="text-lg font-bold text-[#1F3D35]">Tambah Penghuni Cepat</h3>
            <p className="mt-1 text-sm text-[#6B716D]">Penghuni akan menerima link untuk melengkapi data</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#99A09C] hover:bg-[#F8F7F4] hover:text-[#1F3D35] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="px-6 py-6">
          <form className="space-y-5">
            {/* Input Nama */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1F3D35]">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  className="w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-3 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-[#C69C6D] focus:ring-1 focus:ring-[#C69C6D]"
                />
              </div>
            </div>

            {/* Input Kontak */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1F3D35]">No. WhatsApp / Email</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
                <input
                  type="text"
                  placeholder="0812xxx atau email@contoh.com"
                  className="w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-3 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-[#C69C6D] focus:ring-1 focus:ring-[#C69C6D]"
                />
              </div>
            </div>

            {/* Select Kamar */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1F3D35]">Pilih Kamar</label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
                <select
                  className="w-full appearance-none rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-3 pl-10 pr-10 text-sm font-medium text-[#1F3D35] outline-none transition-all focus:border-[#C69C6D] focus:ring-1 focus:ring-[#C69C6D] cursor-pointer"
                >
                  <option value="" disabled selected>Pilih kamar yang tersedia</option>
                  <option value="105">Kamar 105 (Standard)</option>
                  <option value="203">Kamar 203 (Premium)</option>
                  <option value="301">Kamar 301 (Deluxe)</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-[#E5E3DE] bg-[#F8F7F4] px-6 py-5 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-xl bg-[#1F3D35] px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#152923] focus:outline-none sm:ml-3 sm:w-auto transition-colors"
          >
            Kirim Undangan
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1F3D35] shadow-sm ring-1 ring-inset ring-[#E5E3DE] hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
