import Link from "next/link";
import { ArrowLeft, Home, Bed, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[85vh] w-full items-center justify-center overflow-hidden bg-[#F8F7F4] px-6 py-28 md:py-36">
      {/* Pola Titik Latar Belakang (Dot Grid) */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#E5E3DE_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>

      {/* Ornamen Pendar Cahaya Lembut */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C69C6D]/15 blur-[100px] md:h-[500px] md:w-[500px]"></div>

      <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center text-center">
        {/* Badge 404 */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E5E3DE] bg-white px-4 py-1.5 shadow-sm">
          <span className="text-[12px] font-bold tracking-[0.2em] text-[#C69C6D]">
            ERROR 404 &bull; TIDAK DITEMUKAN
          </span>
        </div>

        {/* Angka 404 Tipografi Raksasa */}
        <div className="mb-4 select-none text-[84px] font-black leading-none tracking-tighter text-[#1F3D35]/15 md:text-[120px]">
          404
        </div>

        {/* Judul Utama */}
        <h1 className="-mt-6 mb-4 text-[28px] font-extrabold tracking-tight text-[#1F3D35] md:text-[38px]">
          Sepertinya Anda Tersesat
        </h1>

        {/* Deskripsi */}
        <p className="mb-10 max-w-md text-[15px] leading-relaxed text-[#6B716D]">
          Halaman yang Anda tuju tidak tersedia, telah berganti alamat, atau tautan yang Anda klik keliru. Mari kembali ke hunian yang nyaman.
        </p>

        {/* Tombol Aksi */}
        <div className="flex w-full flex-col items-center justify-center gap-3.5 sm:w-auto sm:flex-row">
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-[12px] bg-[#1F3D35] px-6 py-3.5 text-[14px] font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#162E28] hover:text-[#C69C6D] hover:shadow-xl sm:w-auto"
          >
            <Home className="h-4 w-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <Link
            href="/kamar"
            className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-[#1F3D35] bg-transparent px-6 py-3.5 text-[14px] font-semibold text-[#1F3D35] transition-all duration-300 hover:bg-[#1F3D35] hover:text-white sm:w-auto"
          >
            <Bed className="h-4 w-4" />
            <span>Lihat Pilihan Kamar</span>
          </Link>
        </div>

        {/* Link Bantuan Kontak */}
        <div className="mt-12 flex items-center gap-2 text-xs text-[#6B716D]">
          <HelpCircle className="h-4 w-4 text-[#C69C6D]" />
          <span>
            Mengalami kesulitan?{" "}
            <Link href="/kontak" className="font-semibold text-[#1F3D35] underline hover:text-[#C69C6D]">
              Hubungi Tim Kami
            </Link>
          </span>
        </div>
      </div>
    </main>
  );
}

