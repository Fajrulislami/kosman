"use client";

import { MessageSquareWarning, Wrench, CheckCircle2, AlertCircle } from "lucide-react";

export default function ComplaintPipeline() {
  return (
    <div className="mb-8 rounded-3xl bg-white p-6 md:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-[#E5E3DE]">
      
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#1F3D35]">Alur Penanganan Laporan</h2>
        <div className="flex items-center space-x-2 rounded-full bg-[#FFF4E5] px-3 py-1 text-xs font-bold text-[#F59E0B]">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>2 Perlu Tindakan Segera</span>
        </div>
      </div>

      {/* Visual Pipeline Container */}
      <div className="relative">
        {/* Garis Koneksi Background (Abu-abu) */}
        <div className="absolute left-1/6 right-1/6 top-1/2 -z-10 h-1 -translate-y-1/2 bg-[#F8F7F4] md:left-[16%] md:right-[16%]"></div>
        {/* Garis Progress (Hijau) */}
        <div className="absolute left-1/6 top-1/2 -z-10 h-1 w-1/3 -translate-y-1/2 bg-[#C69C6D] md:left-[16%]"></div>

        <div className="flex w-full justify-between relative z-10">
          
          {/* Node 1: Masuk (Baru) */}
          <div className="flex flex-col items-center group cursor-default w-1/3">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#1F3D35] text-white shadow-lg ring-4 ring-white transition-transform duration-300 group-hover:scale-110">
              <MessageSquareWarning className="h-6 w-6" />
              {/* Badge Angka */}
              <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#E54D2E] text-xs font-bold text-white shadow-sm ring-2 ring-white">
                3
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="font-bold text-[#1F3D35]">Laporan Masuk</p>
              <p className="mt-1 text-xs font-medium text-[#6B716D]">Menunggu respons</p>
            </div>
          </div>

          {/* Node 2: Sedang Diproses */}
          <div className="flex flex-col items-center group cursor-default w-1/3">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#C69C6D] shadow-md ring-4 ring-[#F8F7F4] border-2 border-[#C69C6D] transition-transform duration-300 group-hover:scale-110">
              <Wrench className="h-6 w-6" />
              <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#1F3D35] text-xs font-bold text-white shadow-sm ring-2 ring-white">
                5
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="font-bold text-[#1F3D35]">Sedang Dikerjakan</p>
              <p className="mt-1 text-xs font-medium text-[#6B716D]">Tukang / staff di lokasi</p>
            </div>
          </div>

          {/* Node 3: Selesai */}
          <div className="flex flex-col items-center group cursor-default w-1/3">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#F8F7F4] text-[#99A09C] shadow-inner ring-4 ring-white border border-[#E5E3DE] transition-transform duration-300 group-hover:scale-110 group-hover:text-[#1E8E3E] group-hover:border-[#1E8E3E]">
              <CheckCircle2 className="h-6 w-6" />
              <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#E5E3DE] text-xs font-bold text-[#6B716D] shadow-sm ring-2 ring-white">
                12
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="font-bold text-[#6B716D] group-hover:text-[#1F3D35] transition-colors">Telah Selesai</p>
              <p className="mt-1 text-xs font-medium text-[#99A09C]">Bulan ini</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
