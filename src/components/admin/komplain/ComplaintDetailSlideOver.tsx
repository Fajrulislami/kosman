"use client";

import { X, Clock, MapPin, AlertCircle, Image as ImageIcon, Send, CheckCircle2, Wrench } from "lucide-react";

interface ComplaintDetailSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId?: string | null;
}

export default function ComplaintDetailSlideOver({ isOpen, onClose, ticketId }: ComplaintDetailSlideOverProps) {
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
        <div className="pointer-events-auto w-screen max-w-xl transform transition-all ease-in-out duration-500">
          <div className="flex h-full flex-col overflow-y-scroll bg-[#F8F7F4] shadow-2xl">
            
            {/* Header */}
            <div className="bg-white px-6 py-6 sm:px-8 border-b border-[#E5E3DE] sticky top-0 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="inline-flex items-center rounded-full bg-[#FFEAEA] px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-[#E54D2E]">
                      Urgent
                    </span>
                    <span className="text-sm font-bold text-[#99A09C]">{ticketId || "TKT-101"}</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#1F3D35] line-clamp-2">AC Bocor dan Kurang Dingin</h2>
                </div>
                <div className="ml-3 flex h-7 items-center">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full bg-[#F8F7F4] p-2 text-[#99A09C] hover:bg-[#E5E3DE] hover:text-[#1F3D35] transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 px-6 py-8 sm:px-8 space-y-8">
              
              {/* Info Pelapor */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-5 rounded-2xl shadow-sm border border-[#E5E3DE]">
                <div className="flex items-center space-x-4">
                  <img src="https://i.pravatar.cc/150?u=a04258a2462d826712d" alt="Pelapor" className="h-12 w-12 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#99A09C]">Pelapor</p>
                    <p className="font-bold text-[#1F3D35]">Rina Kumala</p>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col gap-4 sm:gap-1 text-sm">
                  <div className="flex items-center space-x-2 text-[#6B716D]">
                    <MapPin className="h-4 w-4 text-[#C69C6D]" />
                    <span className="font-semibold text-[#1F3D35]">Kamar 205</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[#6B716D]">
                    <Clock className="h-4 w-4 text-[#C69C6D]" />
                    <span className="font-semibold text-[#1F3D35]">2 jam lalu</span>
                  </div>
                </div>
              </div>

              {/* Isi Pesan (Pesan Penghuni) */}
              <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#99A09C]">Deskripsi Laporan</h3>
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E5E3DE] relative">
                  {/* Decorative quote mark */}
                  <div className="absolute top-4 right-4 text-[#F8F7F4] opacity-50">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.017 21L16.41 14.593H10.82V3H21.5V14.593L19.09 21H14.017ZM3.197 21L5.59 14.593H0V3H10.68V14.593L8.27 21H3.197Z" />
                    </svg>
                  </div>
                  
                  <p className="text-[#1F3D35] leading-relaxed relative z-10 font-medium">
                    Malam min, AC di kamar saya tiba-tiba netes air cukup deras dekat lemari, dan udaranya jadi tidak dingin sama sekali sejak kemarin. Mohon segera dicek ya karena kasur saya agak basah kecipratan.
                  </p>
                </div>
              </div>

              {/* Foto Bukti */}
              <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#99A09C]">Foto Bukti Keluhan</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative aspect-video rounded-2xl bg-gray-200 overflow-hidden group cursor-pointer border border-[#E5E3DE]">
                    <img 
                      src="https://images.unsplash.com/photo-1599427301099-cce401037748?q=80&w=600&auto=format&fit=crop" 
                      alt="Bukti AC Rusak" 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Internal Notes / Balasan */}
              <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#99A09C]">Pembaruan Status / Balasan</h3>
                <div className="relative">
                  <textarea 
                    rows={4}
                    placeholder="Tulis balasan untuk penghuni atau catatan internal (Misal: Sedang dicek teknisi)..."
                    className="w-full rounded-2xl border-2 border-[#E5E3DE] bg-white p-5 text-sm font-medium outline-none transition-all focus:border-[#C69C6D] resize-none"
                  ></textarea>
                  <button className="absolute bottom-4 right-4 rounded-xl bg-[#1F3D35] p-2.5 text-white shadow-md hover:bg-[#152923] transition-colors">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Footer Actions (Sticky Bottom) */}
            <div className="bg-white px-6 py-5 sm:px-8 border-t border-[#E5E3DE] flex space-x-3 sticky bottom-0 z-10">
              <button className="flex-1 rounded-2xl bg-white border-2 border-[#E5E3DE] py-3.5 text-sm font-bold text-[#1F3D35] transition-all hover:bg-[#F8F7F4]">
                Tunda (Pending)
              </button>
              <button className="flex-[2] flex items-center justify-center space-x-2 rounded-2xl bg-[#C69C6D] py-3.5 text-sm font-black text-white shadow-lg transition-all hover:bg-[#b08759] hover:-translate-y-0.5 hover:shadow-xl">
                <Wrench className="h-4 w-4" />
                <span>Mulai Dikerjakan</span>
              </button>
              {/* Note: Jika status sudah dikerjakan, tombol akan berubah menjadi "Tandai Selesai" */}
              {/* <button className="flex-[2] flex items-center justify-center space-x-2 rounded-2xl bg-[#1E8E3E] py-3.5 text-sm font-black text-white shadow-lg transition-all hover:bg-[#177a33] hover:-translate-y-0.5 hover:shadow-xl">
                <CheckCircle2 className="h-4 w-4" />
                <span>Tandai Selesai</span>
              </button> */}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
