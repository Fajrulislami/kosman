"use client";

import { Building2, MapPin, Phone, AlignLeft, Navigation, ExternalLink } from "lucide-react";

interface ProfileSettingsProps {
  data: {
    name: string;
    phone: string;
    address: string;
    description: string;
    mapsUrl?: string;
  };
  onChange: (field: string, value: string) => void;
}

export default function ProfileSettings({ data, onChange }: ProfileSettingsProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-black text-[#1F3D35]">Profil Properti</h2>
        <p className="mt-1 text-sm font-medium text-[#6B716D]">
          Informasi ini akan ditampilkan di halaman depan (Landing Page) dan kwitansi untuk dilihat oleh calon penghuni.
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
              value={data.name || ""}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="Contoh: Pondok Rahmat Samata"
              className="w-full rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-3.5 pl-12 pr-4 text-sm font-bold text-[#1F3D35] outline-none transition-all focus:border-[#C69C6D] focus:bg-white"
            />
          </div>
        </div>

        {/* Nomor WhatsApp */}
        <div>
          <label className="mb-2 block text-sm font-bold text-[#1F3D35]">Nomor WhatsApp Resmi Pengelola</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
            <input 
              type="tel" 
              value={data.phone || ""}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="Contoh: 081234567890 / +62 812-3456-7890"
              className="w-full rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-3.5 pl-12 pr-4 text-sm font-bold text-[#1F3D35] outline-none transition-all focus:border-[#C69C6D] focus:bg-white"
            />
          </div>
        </div>

        {/* Tautan Google Maps */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-bold text-[#1F3D35]">Tautan Google Maps Lokasi</label>
            {data.mapsUrl && (
              <a
                href={data.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#C69C6D] hover:underline"
              >
                <span>Uji Buka Peta</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          <div className="relative">
            <Navigation className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
            <input 
              type="url" 
              value={data.mapsUrl || ""}
              onChange={(e) => onChange("mapsUrl", e.target.value)}
              placeholder="Contoh: https://maps.app.goo.gl/mHwa7ppvN4231RZz5?g_st=aw"
              className="w-full rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-3.5 pl-12 pr-4 text-sm font-medium text-[#1F3D35] outline-none transition-all focus:border-[#C69C6D] focus:bg-white"
            />
          </div>
          <p className="mt-1.5 text-xs text-[#99A09C]">
            Tautan ini digunakan oleh tombol &ldquo;Buka di Google Maps&rdquo; pada seluruh halaman publik dan halaman rute.
          </p>
        </div>

        {/* Alamat Lengkap */}
        <div>
          <label className="mb-2 block text-sm font-bold text-[#1F3D35]">Alamat Lengkap</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-4 h-5 w-5 text-[#99A09C]" />
            <textarea 
              rows={2}
              value={data.address || ""}
              onChange={(e) => onChange("address", e.target.value)}
              placeholder="Contoh: Romangpolong, Kec. Somba Opu, Kabupaten Gowa, Sulawesi Selatan 92113"
              className="w-full rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-3.5 pl-12 pr-4 text-sm font-medium text-[#1F3D35] outline-none transition-all focus:border-[#C69C6D] focus:bg-white resize-none"
            ></textarea>
          </div>
        </div>

        {/* Deskripsi Singkat */}
        <div>
          <label className="mb-2 block text-sm font-bold text-[#1F3D35]">Deskripsi / Slogan Properti</label>
          <div className="relative">
            <AlignLeft className="absolute left-4 top-4 h-5 w-5 text-[#99A09C]" />
            <textarea 
              rows={3}
              value={data.description || ""}
              onChange={(e) => onChange("description", e.target.value)}
              placeholder="Deskripsi hunian kos..."
              className="w-full rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-3.5 pl-12 pr-4 text-sm font-medium text-[#1F3D35] outline-none transition-all focus:border-[#C69C6D] focus:bg-white resize-none"
            ></textarea>
          </div>
        </div>

      </div>
    </div>
  );
}
