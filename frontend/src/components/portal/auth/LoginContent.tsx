"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, Loader2, AlertCircle } from "lucide-react";

export default function LoginContent() {
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
        throw new Error(data.error || "Gagal masuk");
      }

      if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/portal/dashboard");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      
      {/* Sisi Kiri: Visual / Branding (Hanya muncul di Desktop) */}
      <div className="hidden lg:flex w-[55%] relative bg-[#1F3D35] flex-col justify-between overflow-hidden">
        {/* Background Image Placeholder */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop')" }}
        ></div>
        
        {/* Dekorasi Aksent (Pola cahaya) */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-transparent to-[#1F3D35]/90 z-0"></div>

        <div className="relative z-10 p-12 lg:p-20">
          <Link href="/" className="inline-block transition-opacity hover:opacity-80">
            <span className="text-3xl font-extrabold tracking-tighter text-white">
              Kostara<span className="text-[#C69C6D]">.</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 p-12 lg:p-20 mb-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl max-w-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <h1 className="text-4xl font-bold text-white leading-tight mb-4 tracking-tight">
              Selamat Datang di <br/> Rumah Baru Anda.
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Kelola tagihan, ajukan komplain, dan akses seluruh fasilitas kamar Anda melalui Portal Tenant kami dengan mudah.
            </p>
          </div>
        </div>
      </div>

      {/* Sisi Kanan: Formulir Login */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-16 lg:px-24 relative bg-[#F8F7F4] lg:bg-white">
        
        {/* Mobile Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#E5E3DE_1px,transparent_1px)] [background-size:24px_24px] opacity-50 lg:hidden"></div>
        
        {/* Tombol Back to Home (Khusus Mobile) */}
        <Link href="/" className="lg:hidden absolute top-8 left-8 text-2xl font-extrabold tracking-tighter text-[#1F3D35]">
          Kostara<span className="text-[#C69C6D]">.</span>
        </Link>

        <div className="max-w-[400px] w-full mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#202321] tracking-tight mb-2">Masuk ke Portal</h2>
            <p className="text-[#6B716D]">Silakan gunakan email dan password yang terdaftar untuk mengakses akun Anda.</p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#6B716D] uppercase tracking-widest ml-1">Email</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A4A1]">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="budi.santoso@example.com"
                  className="w-full bg-[#F8F7F4] border-none rounded-2xl pl-12 pr-4 py-4 text-[#202321] font-medium focus:outline-none focus:ring-2 focus:ring-[#1F3D35] focus:shadow-[0_0_0_4px_rgba(31,61,53,0.1)] transition-all placeholder:font-normal placeholder:text-[#A0A4A1]"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-bold text-[#6B716D] uppercase tracking-widest">Password</label>
                <a href="#" className="text-xs font-semibold text-[#C69C6D] hover:underline">Lupa Password?</a>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A4A1]">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F8F7F4] border-none rounded-2xl pl-12 pr-4 py-4 text-[#202321] font-medium focus:outline-none focus:ring-2 focus:ring-[#1F3D35] focus:shadow-[0_0_0_4px_rgba(31,61,53,0.1)] transition-all tracking-widest placeholder:tracking-normal placeholder:text-[#A0A4A1]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#1F3D35] hover:bg-[#162E28] disabled:opacity-70 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-[0_8px_20px_rgba(31,61,53,0.2)] hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk Sekarang</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Footer Info */}
          <div className="mt-12 text-center text-sm text-[#6B716D]">
            Belum memiliki akun? <br className="sm:hidden"/>
            <span className="font-semibold text-[#202321]">Silakan hubungi Admin untuk proses registrasi.</span>
          </div>

        </div>
      </div>
    </div>
  );
}
