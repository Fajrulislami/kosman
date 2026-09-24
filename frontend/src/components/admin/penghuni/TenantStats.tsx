"use client";

import { Users, TrendingUp, AlertCircle, Building2 } from "lucide-react";

export default function TenantStats() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {/* Kartu Utama: Total Penghuni (Span 2 kolom, Desain Gelap/Premium) */}
      <div className="relative overflow-hidden rounded-3xl bg-[#1F3D35] p-6 text-white md:col-span-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        {/* Dekorasi Background */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute -bottom-10 right-20 h-32 w-32 rounded-full bg-[#C69C6D]/20 blur-xl"></div>
        
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-medium text-white/80">Total Penghuni Aktif</h3>
            </div>
            <div className="mt-4 flex items-end space-x-4">
              <span className="text-5xl font-bold tracking-tighter">42</span>
              <span className="mb-1 text-sm font-medium text-[#C69C6D] flex items-center">
                <TrendingUp className="mr-1 h-4 w-4" />
                +3 bulan ini
              </span>
            </div>
          </div>
          
          <div className="mt-8 border-t border-white/20 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Kapasitas Terisi</span>
              <span className="font-semibold text-white">84% (42/50 Kamar)</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-[#C69C6D] transition-all duration-1000 ease-out" style={{ width: '84%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Kartu Standar: Pengajuan Baru */}
      <div className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-[0_2px_15px_rgb(0,0,0,0.04)] transition-transform hover:-translate-y-1">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8F7F4] text-[#1F3D35]">
            <Building2 className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-[#6B716D]">Pengajuan Baru</h3>
        </div>
        <div className="mt-6 flex flex-col">
          <span className="text-4xl font-bold text-[#1F3D35]">5</span>
          <span className="mt-2 text-sm text-[#6B716D]">Menunggu verifikasi admin</span>
        </div>
        <div className="mt-4">
          <button className="text-sm font-semibold text-[#C69C6D] hover:text-[#1F3D35] transition-colors">
            Tinjau Sekarang &rarr;
          </button>
        </div>
      </div>

      {/* Kartu Standar: Jatuh Tempo (Desain Alert) */}
      <div className="flex flex-col justify-between rounded-3xl bg-[#FFF9F9] p-6 border border-[#FFEAEA] shadow-[0_2px_15px_rgb(0,0,0,0.04)] transition-transform hover:-translate-y-1">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFEAEA] text-[#E54D2E]">
            <AlertCircle className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-[#E54D2E]">Jatuh Tempo</h3>
        </div>
        <div className="mt-6 flex flex-col">
          <span className="text-4xl font-bold text-[#E54D2E]">2</span>
          <span className="mt-2 text-sm text-[#6B716D]">Penghuni belum membayar</span>
        </div>
        <div className="mt-4 flex -space-x-2">
          {/* Mockup Avatars */}
          <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-200" style={{ backgroundImage: 'url(https://i.pravatar.cc/100?img=11)', backgroundSize: 'cover' }}></div>
          <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-200" style={{ backgroundImage: 'url(https://i.pravatar.cc/100?img=12)', backgroundSize: 'cover' }}></div>
        </div>
      </div>
    </div>
  );
}
