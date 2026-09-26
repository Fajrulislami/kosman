"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, Loader2, AlertCircle, ShieldCheck, UserCheck, KeyRound } from "lucide-react";

export default function UnifiedLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Email atau password yang Anda masukkan tidak sesuai");
      }

      if (data.token) {
        localStorage.setItem("kostara_token", data.token);
        document.cookie = `kostara_session=${data.token}; path=/; max-age=604800; SameSite=Lax`;
      }

      // Otomatis arahkan sesuai hak akses (Role-Based Routing)
      if (data.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/portal/dashboard");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat masuk");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (type: "admin" | "tenant") => {
    setError(null);
    if (type === "admin") {
      setEmail("admin@kostara.id");
      setPassword("adminpassword123");
    } else {
      setEmail("budi.santoso@example.com");
      setPassword("tenantpassword123");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      
      {/* Sisi Kiri: Branding & Visual Showcase (Desktop) */}
      <div className="hidden lg:flex w-[50%] relative bg-[#1F3D35] flex-col justify-between overflow-hidden p-12 lg:p-16">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop')" }}
        />
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C69C6D]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-block transition-opacity hover:opacity-80">
            <span className="text-3xl font-extrabold tracking-tighter text-white">
              Kostara<span className="text-[#C69C6D]">.</span>
            </span>
          </Link>
          <p className="text-white/60 text-xs mt-1 tracking-wider uppercase font-semibold">
            Integrated Property Management & Tenant Portal
          </p>
        </div>

        {/* Middle Feature Highlights */}
        <div className="relative z-10 my-auto py-12 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-[#C69C6D] backdrop-blur-md border border-white/10">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Satu Akses untuk Seluruh Pengguna</span>
          </div>
          
          <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
            Akses Mudah untuk Penghuni & Manajemen Properti.
          </h1>
          
          <p className="text-white/80 text-base leading-relaxed">
            Sistem autentikasi otomatis mengarahkan Anda ke dashboard yang tepat. Cukup masukkan email dan password akun Anda.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="rounded-2xl bg-white/10 p-4 border border-white/10 backdrop-blur-sm">
              <UserCheck className="w-5 h-5 text-[#C69C6D] mb-2" />
              <p className="text-sm font-bold text-white">Portal Penghuni</p>
              <p className="text-xs text-white/70 mt-1">Cek sewa, bayar tagihan, dan laporkan kendala fasilitas.</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 border border-white/10 backdrop-blur-sm">
              <ShieldCheck className="w-5 h-5 text-[#C69C6D] mb-2" />
              <p className="text-sm font-bold text-white">Admin PMS</p>
              <p className="text-xs text-white/70 mt-1">Kelola kamar, data sewa, verifikasi pembayaran, & analitik.</p>
            </div>
          </div>
        </div>

        {/* Bottom Footer Note */}
        <div className="relative z-10 text-xs text-white/50">
          &copy; {new Date().getFullYear()} Kostara Property Management. All rights reserved.
        </div>
      </div>

      {/* Sisi Kanan: Formulir Login Tunggal */}
      <div className="w-full lg:w-[50%] flex flex-col justify-center px-6 sm:px-14 lg:px-20 relative bg-[#F8F7F4] lg:bg-white py-12">
        
        {/* Mobile Header Branding */}
        <div className="lg:hidden mb-8">
          <Link href="/" className="text-2xl font-extrabold tracking-tighter text-[#1F3D35]">
            Kostara<span className="text-[#C69C6D]">.</span>
          </Link>
          <p className="text-xs text-[#6B716D] mt-0.5">Satu Pintu Masuk Akun</p>
        </div>

        <div className="max-w-[420px] w-full mx-auto">
          
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#202321] tracking-tight">Masuk ke Akun Anda</h2>
            <p className="text-[#6B716D] text-sm mt-2">
              Masukkan kredensial terdaftar untuk mengakses akun Penghuni atau Admin Anda.
            </p>
          </div>

          {/* Quick Demo Fill Buttons (Sangat Membantu untuk Pengujian & Audit) */}
          <div className="mb-6 rounded-2xl border border-[#E5E3DE] bg-[#F8F7F4] p-3.5 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B716D]">
              ⚡ Akses Pengujian Cepat (1-Klik Isi):
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo("admin")}
                className="flex-1 rounded-xl bg-white border border-[#E5E3DE] py-2 px-3 text-xs font-bold text-[#1F3D35] hover:bg-[#1F3D35] hover:text-white transition-all shadow-sm"
              >
                Isi Akun Admin
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo("tenant")}
                className="flex-1 rounded-xl bg-white border border-[#E5E3DE] py-2 px-3 text-xs font-bold text-[#C69C6D] hover:bg-[#C69C6D] hover:text-white transition-all shadow-sm"
              >
                Isi Akun Penghuni
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Input Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#6B716D] uppercase tracking-wider">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99A09C]">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full bg-[#F8F7F4] border border-[#E5E3DE] rounded-2xl pl-12 pr-4 py-3.5 text-[#202321] text-sm font-medium focus:outline-none focus:border-[#1F3D35] focus:bg-white transition-all placeholder:text-[#99A09C]"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#6B716D] uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99A09C]">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F8F7F4] border border-[#E5E3DE] rounded-2xl pl-12 pr-4 py-3.5 text-[#202321] text-sm font-medium focus:outline-none focus:border-[#1F3D35] focus:bg-white transition-all tracking-wider placeholder:tracking-normal placeholder:text-[#99A09C]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#1F3D35] hover:bg-[#162E28] disabled:opacity-60 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-[0_8px_20px_rgba(31,61,53,0.2)] hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Mengotentikasi Akun...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Akun</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Footer Back */}
          <div className="mt-8 text-center">
            <Link 
              href="/"
              className="text-xs font-semibold text-[#6B716D] hover:text-[#1F3D35] transition-colors"
            >
              &larr; Kembali ke Beranda Utama
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
