"use client";

import { Building2, MapPin, Phone, AlignLeft } from "lucide-react";

export default function ProfileSettings() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-black text-[#1F3D35]">Profil Properti</h2>
        <p className="mt-1 text-sm font-medium text-[#6B716D]">
          Informasi ini akan ditampilkan di halaman depan (Landing Page) untuk dilihat oleh calon penghuni.
        </p>
      </div>

      <div className="rounded-[2rem] bg-white p-6 sm:p-8 shadow-[0_2px_15px_rgb(0,0,0,0.04)] border border-[#E5E3DE] space-y-6">
        
        {/* Nama Kos */}
        <div>
          <label className="mb-2 block text-sm font-bold text-[#1F3D35]">Nama Properti / Kos</label>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
            <input 
              type="text" 
              defaultValue="Pondok Rahmat Eksklusif"
              className="w-full rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-3.5 pl-12 pr-4 text-sm font-bold text-[#1F3D35] outline-none transition-all focus:border-[#C69C6D] focus:bg-white"
            />
          </div>
        </div>

        {/* Nomor WhatsApp */}
        <div>
          <label className="mb-2 block text-sm font-bold text-[#1F3D35]">Nomor WhatsApp Resmi</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
            <input 
              type="tel" 
              defaultValue="081234567890"
              className="w-full rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-3.5 pl-12 pr-4 text-sm font-bold text-[#1F3D35] outline-none transition-all focus:border-[#C69C6D] focus:bg-white"
            />
          </div>
        </div>

        {/* Alamat Lengkap */}
        <div>
          <label className="mb-2 block text-sm font-bold text-[#1F3D35]">Alamat Lengkap</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-4 h-5 w-5 text-[#99A09C]" />
            <textarea 
              rows={2}
              defaultValue="Jl. Sudirman No. 123, Jakarta Selatan, 12190"
              className="w-full rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-3.5 pl-12 pr-4 text-sm font-medium text-[#1F3D35] outline-none transition-all focus:border-[#C69C6D] focus:bg-white resize-none"
            ></textarea>
          </div>
        </div>

        {/* Deskripsi Singkat */}
        <div>
          <label className="mb-2 block text-sm font-bold text-[#1F3D35]">Deskripsi / Slogan</label>
          <div className="relative">
            <AlignLeft className="absolute left-4 top-4 h-5 w-5 text-[#99A09C]" />
            <textarea 
              rows={3}
              defaultValue="Kost eksklusif modern dengan fasilitas lengkap dan keamanan 24 jam untuk kenyamanan istirahat Anda."
              className="w-full rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-3.5 pl-12 pr-4 text-sm font-medium text-[#1F3D35] outline-none transition-all focus:border-[#C69C6D] focus:bg-white resize-none"
            ></textarea>
          </div>
        </div>

      </div>
    </div>
  );
}
