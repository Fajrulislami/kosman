"use client";

import { X, Calendar, Receipt, CreditCard, User, AlertCircle } from "lucide-react";

interface PaymentVerificationSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId?: string | null;
}

export default function PaymentVerificationSlideOver({ isOpen, onClose, invoiceId }: PaymentVerificationSlideOverProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1F3D35]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Slide-over Panel */}
      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="pointer-events-auto w-screen max-w-lg transform transition-all ease-in-out duration-500">
          <div className="flex h-full flex-col overflow-y-scroll bg-[#F8F7F4] shadow-2xl">
            
            {/* Header */}
            <div className="bg-white px-6 py-6 border-b border-[#E5E3DE] sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#1F3D35]">Verifikasi Pembayaran</h2>
                  <p className="text-sm font-medium text-[#6B716D] mt-1">Invoice {invoiceId || "INV-1024-001"}</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full bg-[#F8F7F4] p-2 text-[#99A09C] hover:bg-[#E5E3DE] hover:text-[#1F3D35] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 space-y-6">
              
              {/* Alert */}
              <div className="rounded-2xl bg-[#FFF4E5] p-4 flex items-start space-x-3 border border-[#FDE68A]">
                <AlertCircle className="h-5 w-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-[#B45309]">
                  Mohon periksa kecocokan nominal transfer di struk dengan tagihan sebelum menyetujui.
                </p>
              </div>

              {/* Bukti Transfer */}
              <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#99A09C]">Bukti Transfer</h3>
                <div className="overflow-hidden rounded-[2rem] bg-white p-2 shadow-sm border border-[#E5E3DE]">
                  {/* Mockup Struk */}
                  <div className="relative aspect-[3/4] w-full rounded-3xl bg-gray-100 overflow-hidden group cursor-pointer">
                    <img 
                      src="https://images.unsplash.com/photo-1620601550275-c9a17532a826?q=80&w=600&auto=format&fit=crop" 
                      alt="Bukti Transfer" 
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="font-bold">Dikirim 12 Okt 2026</p>
                      <p className="text-xs text-white/80">Klik untuk memperbesar gambar</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rincian Tagihan */}
              <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#99A09C]">Rincian Tagihan</h3>
                <div className="rounded-[2rem] bg-white p-6 shadow-sm border border-[#E5E3DE] space-y-4">
                  
                  <div className="flex items-center justify-between pb-4 border-b border-[#F8F7F4]">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8F7F4]">
                        <User className="h-5 w-5 text-[#1F3D35]" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#99A09C]">Penghuni</p>
                        <p className="text-sm font-bold text-[#1F3D35]">Budi Santoso (Kamar 101)</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-2 text-[#6B716D]">
                      <Receipt className="h-4 w-4" />
                      <span className="text-sm font-medium">Sewa Bulanan</span>
                    </div>
                    <span className="text-sm font-bold text-[#1F3D35]">Rp 1.500.000</span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-2 text-[#6B716D]">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm font-medium">Bulan</span>
                    </div>
                    <span className="text-sm font-bold text-[#1F3D35]">Oktober 2026</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-2 text-[#6B716D]">
                      <CreditCard className="h-4 w-4" />
                      <span className="text-sm font-medium">Metode</span>
                    </div>
                    <span className="text-sm font-bold text-[#1F3D35]">Transfer BCA</span>
                  </div>

                  <div className="pt-4 border-t border-[#F8F7F4] flex justify-between items-center">
                    <span className="font-bold text-[#1F3D35]">Total Tagihan</span>
                    <span className="text-2xl font-black text-[#1F3D35]">Rp 1.500.000</span>
                  </div>

                </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="bg-white px-6 py-5 border-t border-[#E5E3DE] flex space-x-3 sticky bottom-0 z-10">
              <button className="flex-1 rounded-2xl bg-white border-2 border-[#E5E3DE] py-3.5 text-sm font-bold text-[#E54D2E] transition-all hover:bg-[#FFF9F9] hover:border-[#FFEAEA]">
                Tolak
              </button>
              <button className="flex-[2] rounded-2xl bg-[#1F3D35] py-3.5 text-sm font-black text-white shadow-lg transition-all hover:bg-[#152923] hover:-translate-y-0.5 hover:shadow-xl">
                Terima Pembayaran
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
