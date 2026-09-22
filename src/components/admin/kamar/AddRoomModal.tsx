"use client";

import { X } from "lucide-react";

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddRoomModal({ isOpen, onClose }: AddRoomModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#1F3D35]/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div className="relative z-10 flex w-full max-w-lg max-h-[90vh] flex-col transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-2xl transition-all">
        
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-[#E5E3DE] p-6 pb-4 sm:px-8 sm:pt-8">
          <h3 className="text-xl font-bold text-[#1F3D35]">
            Tambah Kamar Baru
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#99A09C] transition-colors hover:bg-[#F8F7F4] hover:text-[#1F3D35]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body - Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:px-8">
          <div className="space-y-5">
            {/* Section 1: Identitas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="roomNumber" className="block text-sm font-semibold text-[#1F3D35]">
                  Nomor Kamar <span className="text-[#E54D2E]">*</span>
                </label>
                <input
                  type="text"
                  id="roomNumber"
                  placeholder="Misal: 101"
                  className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 text-[#1F3D35] ring-1 ring-inset ring-[#E5E3DE] placeholder:text-[#99A09C] focus:ring-2 focus:ring-inset focus:ring-[#C69C6D] sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="floor" className="block text-sm font-semibold text-[#1F3D35]">
                  Lantai
                </label>
                <select
                  id="floor"
                  className="mt-2 block w-full rounded-xl border-0 py-2.5 pl-3 pr-10 text-[#1F3D35] ring-1 ring-inset ring-[#E5E3DE] focus:ring-2 focus:ring-[#C69C6D] sm:text-sm"
                >
                  <option value="1">Lantai 1</option>
                  <option value="2">Lantai 2</option>
                  <option value="3">Lantai 3</option>
                </select>
              </div>
            </div>

            {/* Section 2: Kategori & Harga */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="roomType" className="block text-sm font-semibold text-[#1F3D35]">
                  Tipe Kamar <span className="text-[#E54D2E]">*</span>
                </label>
                <select
                  id="roomType"
                  className="mt-2 block w-full rounded-xl border-0 py-2.5 pl-3 pr-10 text-[#1F3D35] ring-1 ring-inset ring-[#E5E3DE] focus:ring-2 focus:ring-[#C69C6D] sm:text-sm"
                >
                  <option value="standar">Standar</option>
                  <option value="premium">Premium</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
              <div>
                <label htmlFor="capacity" className="block text-sm font-semibold text-[#1F3D35]">
                  Kapasitas Maksimal
                </label>
                <div className="mt-2 flex items-center">
                  <input
                    type="number"
                    id="capacity"
                    defaultValue={1}
                    min={1}
                    max={4}
                    className="block w-full rounded-l-xl border-0 py-2.5 px-3 text-[#1F3D35] ring-1 ring-inset ring-[#E5E3DE] focus:ring-2 focus:ring-inset focus:ring-[#C69C6D] sm:text-sm"
                  />
                  <span className="flex items-center rounded-r-xl border border-l-0 border-[#E5E3DE] bg-[#F8F7F4] px-3 py-2.5 text-sm text-[#6B716D]">
                    Orang
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-semibold text-[#1F3D35]">
                Harga Sewa (per Bulan) <span className="text-[#E54D2E]">*</span>
              </label>
              <div className="relative mt-2 rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-[#6B716D] sm:text-sm font-semibold">Rp</span>
                </div>
                <input
                  type="text"
                  id="price"
                  placeholder="1.500.000"
                  className="block w-full rounded-xl border-0 py-2.5 pl-10 pr-12 text-[#1F3D35] ring-1 ring-inset ring-[#E5E3DE] placeholder:text-[#99A09C] focus:ring-2 focus:ring-inset focus:ring-[#C69C6D] sm:text-sm"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-[#99A09C] sm:text-sm">/bln</span>
                </div>
              </div>
            </div>

            {/* Section 3: Status & Catatan */}
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-[#1F3D35]">
                Status Awal
              </label>
              <select
                id="status"
                className="mt-2 block w-full rounded-xl border-0 py-2.5 pl-3 pr-10 text-[#1F3D35] ring-1 ring-inset ring-[#E5E3DE] focus:ring-2 focus:ring-[#C69C6D] sm:text-sm"
              >
                <option value="kosong">Kosong (Tersedia)</option>
                <option value="terisi">Terisi</option>
                <option value="perbaikan">Sedang Perbaikan</option>
              </select>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-semibold text-[#1F3D35]">
                Catatan Khusus <span className="text-[#99A09C] font-normal">(Opsional)</span>
              </label>
              <textarea
                id="notes"
                rows={3}
                placeholder="Tambahkan catatan internal tentang kamar ini..."
                className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 text-[#1F3D35] ring-1 ring-inset ring-[#E5E3DE] placeholder:text-[#99A09C] focus:ring-2 focus:ring-inset focus:ring-[#C69C6D] sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t border-[#E5E3DE] bg-[#F8F7F4] p-6 sm:px-8">
          <button
            onClick={onClose}
            className="rounded-xl border border-[#E5E3DE] bg-white px-5 py-2.5 text-sm font-semibold text-[#6B716D] transition-colors hover:bg-gray-50 hover:text-[#1F3D35]"
          >
            Batal
          </button>
          <button
            onClick={onClose} // For now it just closes the modal
            className="rounded-xl bg-[#1F3D35] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#2A5247]"
          >
            Simpan Kamar
          </button>
        </div>
      </div>
    </div>
  );
}
