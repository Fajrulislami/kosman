"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Mail, Lock, Loader2, AlertCircle, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
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
        throw new Error(data.error || "Gagal masuk sebagai admin");
      }

      if (data.user.role !== "ADMIN") {
        throw new Error("Akun ini tidak memiliki hak akses Administrator");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7] px-4 py-12 font-sans sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        
        {/* Card Header & Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <span className="text-3xl font-extrabold tracking-tight text-[#1F3D35]">
              Kostara<span className="text-[#C69C6D]">.</span>
            </span>
          </Link>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1F3D35]/10 px-3 py-1 text-xs font-semibold text-[#1F3D35]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Property Management System</span>
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#202321]">
            Login Back-Office
          </h2>
          <p className="mt-1 text-sm text-[#6B716D]">
            Khusus pemilik dan staf pengelola properti Kostara
          </p>
        </div>

        {/* Card Box (Apple-like design) */}
        <div className="rounded-3xl border border-[#E5E3DE] bg-white p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B716D] mb-2">
                Email Administrator
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#99A09C]">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kostara.id"
                  className="w-full rounded-2xl border border-[#E5E3DE] bg-[#F8F7F4]/60 py-3.5 pl-11 pr-4 text-sm text-[#202321] placeholder-[#99A09C] transition-all focus:border-[#1F3D35] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1F3D35]/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B716D] mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#99A09C]">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-[#E5E3DE] bg-[#F8F7F4]/60 py-3.5 pl-11 pr-4 text-sm text-[#202321] placeholder-[#99A09C] transition-all focus:border-[#1F3D35] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1F3D35]/10"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#1F3D35] py-3.5 px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#162E28] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F3D35] disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Otentikasi...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-[#E5E3DE] pt-4 text-center">
            <Link
              href="/"
              className="text-xs font-medium text-[#6B716D] transition-colors hover:text-[#1F3D35]"
            >
              &larr; Kembali ke Landing Page
            </Link>
          </div>
        </div>

        {/* Demo Credentials hint for development */}
        <div className="mt-6 text-center text-xs text-[#99A09C]">
          Kredensial Default: <span className="font-mono text-[#6B716D]">admin@kostara.id</span> / <span className="font-mono text-[#6B716D]">adminpassword123</span>
        </div>
      </div>
    </div>
  );
}
