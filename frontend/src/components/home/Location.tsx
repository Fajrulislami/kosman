"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MapPin, Navigation, Coffee, BookOpen, UserCircle2 } from "lucide-react";

/* 
  =========================================
  KOMPONEN SUB: SCROLL REVEAL
  =========================================
*/
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.15 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};


export default function Location() {
    return (
        // Latar dikembalikan ke Cream (#F8F7F4) agar menyatu dengan root
        <section className="relative overflow-hidden bg-[#F8F7F4] py-24 md:py-32">

            {/* Pola Titik Latar Belakang (Dot Grid) */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(#E5E3DE_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>

            <style>{`
        @keyframes float-soft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-1 { animation: float-soft 4s ease-in-out infinite; }
        .animate-float-2 { animation: float-soft 5s ease-in-out 1s infinite; }
        .animate-float-3 { animation: float-soft 4.5s ease-in-out 2s infinite; }
      `}</style>


            <div className="relative z-20 mx-auto max-w-[1200px] px-6">

                {/* Header Section */}
                <Reveal>
                    <div className="mb-12 flex flex-col items-center text-center">
                        <span className="mb-6 inline-block rounded-full bg-white px-5 py-2 text-[12px] font-bold tracking-[0.2em] text-[#C69C6D] shadow-sm border border-[#E5E3DE]">
                            LOKASI STRATEGIS
                        </span>
                        <h2 className="mb-6 text-[36px] font-black uppercase leading-[1.05] tracking-tighter text-[#1F3D35] md:text-[56px] lg:text-[72px]">
                            STRATEGIS. MUDAH. <br className="hidden md:block" />
                            KE MANA SAJA.
                        </h2>
                        <p className="max-w-md text-[16px] text-[#6B716D]">
                            Semua kebutuhan harian Anda, mulai dari kampus hingga kuliner, hanya selangkah dari pintu depan.
                        </p>
                    </div>
                </Reveal>


                {/* 
          =========================================
          GELEMBUNG PERTANYAAN (RAPI & TIDAK OVERLAP)
          Ditempatkan di atas kartu dengan animasi mengapung lembut
          tanpa menggunakan emoticon, murni elegan.
          =========================================
        */}
                <Reveal delay={100}>
                    <div className="pointer-events-none mx-auto mb-8 flex max-w-[900px] flex-wrap justify-center gap-4 sm:mb-12">

                        <div className="animate-float-1 flex items-center gap-2.5 rounded-full border border-[#E5E3DE] bg-white px-5 py-2.5 shadow-sm">
                            <UserCircle2 className="h-4 w-4 text-[#C69C6D]" />
                            <span className="text-[13px] font-bold text-[#1F3D35]">Jarak ke kampus dekat?</span>
                        </div>

                        <div className="animate-float-2 flex items-center gap-2.5 rounded-full border border-[#E5E3DE] bg-white px-5 py-2.5 shadow-sm">
                            <UserCircle2 className="h-4 w-4 text-[#C69C6D]" />
                            <span className="text-[13px] font-bold text-[#1F3D35]">Cari makan malam gampang?</span>
                        </div>

                        <div className="animate-float-3 flex items-center gap-2.5 rounded-full border border-[#E5E3DE] bg-white px-5 py-2.5 shadow-sm">
                            <UserCircle2 className="h-4 w-4 text-[#C69C6D]" />
                            <span className="text-[13px] font-bold text-[#1F3D35]">Akses transportasi aman?</span>
                        </div>

                    </div>
                </Reveal>


                {/* 
          =========================================
          KARTU LOKASI UTAMA
          =========================================
        */}
                <Reveal delay={200}>
                    <div className="mx-auto w-full max-w-[900px] overflow-hidden rounded-[24px] border border-[#E5E3DE] bg-white shadow-xl transition-shadow duration-500 hover:shadow-2xl">

                        {/* Top Bar Aplikasi */}
                        <div className="flex items-center justify-between border-b border-[#E5E3DE] bg-[#F8F7F4] px-5 py-3.5">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-[#FF5F56]"></div>
                                <div className="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
                                <div className="h-3 w-3 rounded-full bg-[#27C93F]"></div>
                            </div>
                            <div className="flex items-center gap-2 text-[12px] font-semibold text-[#6B716D]">
                                <MapPin className="h-3.5 w-3.5 text-[#C69C6D]" />
                                <span>Titik Pusat Pondok Rahmat</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#27C93F] opacity-75"></span>
                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#27C93F]"></span>
                                </span>
                                <span className="hidden text-[12px] font-bold text-[#1F3D35] sm:block">Akses Prima</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2">

                            {/* Sisi Kiri: Peta Abstrak */}
                            <div className="relative aspect-square w-full border-b border-[#E5E3DE] bg-[#F8F7F4] md:border-b-0 md:border-r">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] opacity-20"></div>

                                {/* Pin Tengah Peta */}
                                <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/40 backdrop-blur-md">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1F3D35] shadow-lg">
                                            <MapPin className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="mt-4 rounded-full border border-[#E5E3DE] bg-white px-4 py-2 text-[12px] font-bold text-[#1F3D35] shadow-sm">
                                        Pondok Rahmat Residence
                                    </div>
                                </div>
                            </div>

                            {/* 
                =========================================
                SISI KANAN: INFORMASI LOKASI
                Desain judul menggunakan Indikator Angka Kotak, tanpa garis coret
                =========================================
              */}
                            <div className="flex flex-col p-6 sm:p-10">

                                {/* Item 1 */}
                                <div className="mb-10">
                                    <div className="mb-4 flex items-center gap-3">
                                        {/* Indikator Angka Pengganti Garis */}
                                        <div className="flex h-6 w-6 items-center justify-center rounded bg-[#C69C6D]/10 text-[11px] font-bold text-[#C69C6D]">
                                            01
                                        </div>
                                        <span className="text-[11px] font-bold tracking-[0.15em] text-[#C69C6D]">
                                            PENDIDIKAN
                                        </span>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F8F7F4]">
                                            <BookOpen className="h-4 w-4 text-[#1F3D35]" />
                                        </div>
                                        <div>
                                            <h4 className="text-[16px] font-bold text-[#1F3D35]">Universitas Utama</h4>
                                            <p className="mt-1.5 text-[13px] leading-relaxed text-[#6B716D]">
                                                Hanya <strong>5 Menit Jalan Kaki</strong>. Sangat menghemat waktu dan biaya transportasi Anda setiap hari.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Item 2 */}
                                <div className="mb-10">
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded bg-[#C69C6D]/10 text-[11px] font-bold text-[#C69C6D]">
                                            02
                                        </div>
                                        <span className="text-[11px] font-bold tracking-[0.15em] text-[#C69C6D]">
                                            KULINER & BELANJA
                                        </span>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F8F7F4]">
                                            <Coffee className="h-4 w-4 text-[#1F3D35]" />
                                        </div>
                                        <div>
                                            <h4 className="text-[16px] font-bold text-[#1F3D35]">Minimarket & Cafe</h4>
                                            <p className="mt-1.5 text-[13px] leading-relaxed text-[#6B716D]">
                                                Sekitar <strong>2 Menit Berkendara</strong>. Tidak perlu khawatir lapar tengah malam atau kehabisan barang harian.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Item 3 */}
                                <div>
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded bg-[#C69C6D]/10 text-[11px] font-bold text-[#C69C6D]">
                                            03
                                        </div>
                                        <span className="text-[11px] font-bold tracking-[0.15em] text-[#C69C6D]">
                                            TRANSPORTASI
                                        </span>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F8F7F4]">
                                            <Navigation className="h-4 w-4 text-[#1F3D35]" />
                                        </div>
                                        <div>
                                            <h4 className="text-[16px] font-bold text-[#1F3D35]">Halte Bus & Stasiun</h4>
                                            <p className="mt-1.5 text-[13px] leading-relaxed text-[#6B716D]">
                                                Akses transportasi publik terpadu berjarak <strong>10 Menit</strong>. Memudahkan mobilitas akhir pekan Anda.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </Reveal>

                {/* Tombol Aksi Bawah */}
                <Reveal delay={300}>
                    <div className="mt-16 flex justify-center">
                        <Link
                            href="https://maps.google.com"
                            target="_blank"
                            className="inline-flex items-center justify-center rounded-[10px] bg-[#1F3D35] px-[28px] py-[14px] text-[15px] font-semibold text-white transition-all duration-300 hover:bg-[#162E28] hover:text-[#C69C6D] hover:shadow-[0_8px_20px_rgba(31,61,53,0.3)]"
                        >
                            Buka di Google Maps
                        </Link>
                    </div>
                </Reveal>

            </div>
        </section>
    );
}