"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Log error secara internal untuk debugging
    console.error("Terjadi error pada aplikasi:", error);
  }, [error]);

  return (
    <main className="relative flex min-h-[85vh] w-full items-center justify-center overflow-hidden bg-[#F8F7F4] px-6 py-28 md:py-36">
      {/* Pola Titik Latar Belakang (Dot Grid) */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#E5E3DE_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>

      {/* Ornamen Pendar Cahaya Lembut */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF5F56]/10 blur-[100px] md:h-[500px] md:w-[500px]"></div>

      <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center text-center">
        {/* Badge Error */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/80 px-4 py-1.5 shadow-sm backdrop-blur-sm">
          <AlertTriangle className="h-4 w-4 text-amber-700" />
          <span className="text-[12px] font-bold tracking-[0.15em] text-amber-800 uppercase">
            Terjadi Kendala Sistem
          </span>
        </div>

        {/* Judul Utama */}
        <h1 className="mb-4 text-[28px] font-extrabold tracking-tight text-[#1F3D35] md:text-[38px]">
          Maaf, Terjadi Kesalahan
        </h1>

        {/* Deskripsi */}
        <p className="mb-8 max-w-md text-[15px] leading-relaxed text-[#6B716D]">
          Halaman ini sementara tidak dapat dimuat dengan sempurna. Jangan khawatir, Anda dapat mencoba memuat ulang halaman ini.
        </p>

        {/* Tombol Aksi */}
        <div className="flex w-full flex-col items-center justify-center gap-3.5 sm:w-auto sm:flex-row">
          <button
            onClick={() => reset()}
            className="flex w-full items-center justify-center gap-2 rounded-[12px] bg-[#1F3D35] px-6 py-3.5 text-[14px] font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#162E28] hover:text-[#C69C6D] hover:shadow-xl sm:w-auto"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Coba Lagi</span>
          </button>
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-[#1F3D35] bg-transparent px-6 py-3.5 text-[14px] font-semibold text-[#1F3D35] transition-all duration-300 hover:bg-[#1F3D35] hover:text-white sm:w-auto"
          >
            <Home className="h-4 w-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Accordion Rincian Teknis (Opsional untuk Developer/Admin) */}
        {error && (
          <div className="mt-10 w-full max-w-md">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="mx-auto flex items-center gap-1.5 text-xs text-[#6B716D] transition-colors hover:text-[#1F3D35]"
            >
              <span>{showDetails ? "Sembunyikan detail teknis" : "Lihat detail teknis"}</span>
              {showDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            {showDetails && (
              <div className="mt-3 rounded-xl border border-[#E5E3DE] bg-white p-4 text-left font-mono text-xs text-[#202321] shadow-inner">
                <p className="font-semibold text-red-600 break-words">{error.message || "Unknown error"}</p>
                {error.digest && (
                  <p className="mt-1.5 text-[11px] text-[#6B716D]">
                    Digest ID: <span className="text-[#1F3D35]">{error.digest}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

