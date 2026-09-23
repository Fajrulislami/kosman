"use client";

import { User, Mail, Lock } from "lucide-react";

export default function AccountSettings() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-black text-[#1F3D35]">Keamanan & Akun Admin</h2>
        <p className="mt-1 text-sm font-medium text-[#6B716D]">
          Ubah informasi login dan kata sandi akun administrator Anda.
        </p>
      </div>

      <div className="rounded-[2rem] bg-white p-6 sm:p-8 shadow-[0_2px_15px_rgb(0,0,0,0.04)] border border-[#E5E3DE] space-y-6">
        
        {/* Nama Lengkap */}
        <div>
          <label className="mb-2 block text-sm font-bold text-[#1F3D35]">Nama Lengkap</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
            <input 
              type="text" 
              defaultValue="Admin Pondok Rahmat"
              className="w-full rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-3.5 pl-12 pr-4 text-sm font-bold text-[#1F3D35] outline-none transition-all focus:border-[#C69C6D] focus:bg-white"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-bold text-[#1F3D35]">Email Login</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
            <input 
              type="email" 
              defaultValue="admin@pondokrahmat.id"
              className="w-full rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-3.5 pl-12 pr-4 text-sm font-bold text-[#1F3D35] outline-none transition-all focus:border-[#C69C6D] focus:bg-white"
            />
          </div>
        </div>
        
        <hr className="border-[#E5E3DE] my-6" />

        {/* Password Lama */}
        <div>
          <label className="mb-2 block text-sm font-bold text-[#1F3D35]">Kata Sandi Lama</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
            <input 
              type="password" 
              placeholder="Masukkan kata sandi lama"
              className="w-full rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-3.5 pl-12 pr-4 text-sm font-bold text-[#1F3D35] outline-none transition-all focus:border-[#C69C6D] focus:bg-white"
            />
          </div>
        </div>

        {/* Password Baru */}
        <div>
          <label className="mb-2 block text-sm font-bold text-[#1F3D35]">Kata Sandi Baru</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
            <input 
              type="password" 
              placeholder="Minimal 8 karakter"
              className="w-full rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-3.5 pl-12 pr-4 text-sm font-bold text-[#1F3D35] outline-none transition-all focus:border-[#C69C6D] focus:bg-white"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
