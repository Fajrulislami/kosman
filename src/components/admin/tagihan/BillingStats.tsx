"use client";

import { Wallet, CheckCircle2, AlertCircle, TrendingUp, ArrowUpRight } from "lucide-react";

export default function BillingStats() {
  // Mendapatkan bulan dan tahun saat ini secara real-time
  const currentMonthYear = new Intl.DateTimeFormat('id-ID', { 
    month: 'long', 
    year: 'numeric' 
  }).format(new Date());

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-12">
      {/* Kartu Utama: Pemasukan (Span 8 kolom, Besar & Dinamis) */}
      <div className="relative overflow-hidden rounded-[2rem] bg-[#1F3D35] p-8 text-white md:col-span-8 shadow-[0_20px_40px_rgb(31,61,53,0.15)] group">
        {/* Dekorasi Dinamis (Glow & Shapes) */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#C69C6D]/20 blur-3xl transition-transform duration-700 group-hover:scale-110"></div>
        <div className="absolute bottom-0 right-10 h-32 w-32 rounded-full bg-white/5 blur-2xl"></div>
        
        {/* Konten */}
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold tracking-wide text-white/80">Pemasukan Bulan Ini</h3>
            </div>
            
            <span className="flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
              <TrendingUp className="mr-1.5 h-3 w-3 text-[#C69C6D]" />
              {currentMonthYear}
            </span>
          </div>
          
          <div className="mt-8">
            <p className="text-sm font-medium text-[#C69C6D]">Total Lunas</p>
            <div className="mt-1 flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-white/80">Rp</span>
              <span className="text-6xl font-black tracking-tighter">42.500.000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Kolom Kanan: 2 Kartu Kecil Bertumpuk */}
      <div className="flex flex-col gap-6 md:col-span-4">
        
        {/* Kartu: Menunggu Verifikasi */}
        <div className="group relative flex-1 overflow-hidden rounded-[2rem] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#FFF4E5]/50 blur-xl"></div>
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#6B716D]">Perlu Verifikasi</h3>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF4E5] text-[#F59E0B]">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-black tracking-tight text-[#1F3D35]">3</span>
              <span className="ml-2 text-sm font-medium text-[#6B716D]">tagihan</span>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-[#F59E0B]">
              <span className="flex-1">Rp 4.500.000 menunggu dicek</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
          </div>
        </div>

        {/* Kartu: Belum Lunas */}
        <div className="group relative flex-1 overflow-hidden rounded-[2rem] bg-[#FFF9F9] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(229,77,46,0.08)] border border-[#FFEAEA]">
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#E54D2E]">Belum Lunas</h3>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFEAEA] text-[#E54D2E]">
                <AlertCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-black tracking-tight text-[#E54D2E]">5</span>
              <span className="ml-2 text-sm font-medium text-[#E54D2E]/80">penghuni</span>
            </div>
            <div className="mt-4 text-xs font-semibold text-[#E54D2E]/80">
              Potensi: Rp 6.750.000
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
