"use client";

import { X, MapPin, Phone, Mail, Briefcase, FileText, Calendar, CreditCard } from "lucide-react";

interface TenantDetailSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId?: string | null;
}

export default function TenantDetailSlideOver({ isOpen, onClose, tenantId }: TenantDetailSlideOverProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1F3D35]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Slide-over Panel */}
      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="pointer-events-auto w-screen max-w-md transform transition-all ease-in-out duration-500 sm:duration-700">
          <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-2xl">
            {/* Header */}
            <div className="bg-[#1F3D35] px-6 py-8 sm:px-8 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
              
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <img 
                    src="https://i.pravatar.cc/150?u=a042581f4e29026024d" 
                    alt="Budi Santoso" 
                    className="h-16 w-16 rounded-full border-2 border-white object-cover shadow-md"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-white">Budi Santoso</h2>
                    <p className="text-sm font-medium text-[#C69C6D]">Kamar 101 • Premium</p>
                  </div>
                </div>
                <div className="ml-3 flex h-7 items-center">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 focus:outline-none transition-colors"
                  >
                    <span className="sr-only">Tutup panel</span>
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="relative flex-1 px-6 py-6 sm:px-8 bg-[#F8F7F4]">
              {/* Status Badge */}
              <div className="mb-8 flex items-center justify-between rounded-2xl bg-white p-4 shadow-[0_2px_15px_rgb(0,0,0,0.04)]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#99A09C]">Status Sewa</p>
                  <p className="mt-1 text-sm font-semibold text-[#1F3D35]">Aktif (Lunas)</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-[#E6F4EA] flex items-center justify-center">
                  <span className="h-3 w-3 rounded-full bg-[#1E8E3E]"></span>
                </div>
              </div>

              {/* Data Diri */}
              <div className="mb-8">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#99A09C]">Informasi Pribadi</h3>
                <div className="rounded-2xl bg-white p-5 shadow-[0_2px_15px_rgb(0,0,0,0.04)] space-y-4">
                  <div className="flex items-start space-x-3">
                    <Phone className="mt-0.5 h-4 w-4 text-[#C69C6D]" />
                    <div>
                      <p className="text-xs font-medium text-[#99A09C]">No. WhatsApp</p>
                      <p className="text-sm font-semibold text-[#1F3D35]">0812-3456-7890</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Mail className="mt-0.5 h-4 w-4 text-[#C69C6D]" />
                    <div>
                      <p className="text-xs font-medium text-[#99A09C]">Email</p>
                      <p className="text-sm font-semibold text-[#1F3D35]">budi.santoso@email.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Briefcase className="mt-0.5 h-4 w-4 text-[#C69C6D]" />
                    <div>
                      <p className="text-xs font-medium text-[#99A09C]">Pekerjaan</p>
                      <p className="text-sm font-semibold text-[#1F3D35]">Karyawan Swasta</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-[#C69C6D]" />
                    <div>
                      <p className="text-xs font-medium text-[#99A09C]">Alamat Asal (KTP)</p>
                      <p className="text-sm font-semibold text-[#1F3D35]">Jl. Merdeka No. 45, Bandung, Jawa Barat</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Sewa */}
              <div className="mb-8">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#99A09C]">Informasi Sewa</h3>
                <div className="rounded-2xl bg-white p-5 shadow-[0_2px_15px_rgb(0,0,0,0.04)] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-[#C69C6D]" />
                      <span className="text-sm font-medium text-[#99A09C]">Tanggal Masuk</span>
                    </div>
                    <span className="text-sm font-semibold text-[#1F3D35]">12 Jan 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-4 w-4 text-[#C69C6D]" />
                      <span className="text-sm font-medium text-[#99A09C]">Siklus Pembayaran</span>
                    </div>
                    <span className="text-sm font-semibold text-[#1F3D35]">Bulanan (Tgl 12)</span>
                  </div>
                </div>
              </div>

              {/* Dokumen */}
              <div className="mb-8">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#99A09C]">Dokumen</h3>
                <div className="flex space-x-3">
                  <div className="flex flex-1 cursor-pointer items-center justify-center space-x-2 rounded-xl border-2 border-dashed border-[#E5E3DE] bg-white p-4 transition-colors hover:border-[#C69C6D] hover:bg-[#F8F7F4]">
                    <FileText className="h-5 w-5 text-[#C69C6D]" />
                    <span className="text-sm font-semibold text-[#1F3D35]">Foto KTP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-[#E5E3DE] bg-white px-6 py-5 sm:px-8 flex space-x-3">
              <button className="flex-1 rounded-xl bg-[#1F3D35] py-3 text-sm font-bold text-white shadow-sm hover:bg-[#152923] transition-colors">
                Kirim Pesan (WA)
              </button>
              <button className="rounded-xl border border-[#E5E3DE] bg-white px-4 py-3 text-sm font-bold text-[#E54D2E] hover:bg-[#FFF9F9] transition-colors">
                Akhiri Sewa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
