"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

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
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-12 opacity-0 scale-95"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function CtaAbout() {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-[#F8F7F4] py-32 md:min-h-[80vh] md:py-48">
      
      {/* Pola Titik Latar Belakang (Dot Grid Root) */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#E5E3DE_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>

      {/* 
        =========================================
        STYLE CSS KHUSUS ANIMASI (Hanya untuk tombol)
        =========================================
      */}
      <style>{`
        @keyframes float-key {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .animate-float-key {
          animation: float-key 4s ease-in-out infinite;
        }
      `}</style>

      {/* 
        =========================================
        LATAR BELAKANG HALUS (TIDAK BERGERAK)
        Pendaran cahaya statis yang sangat tipis agar tidak sakit mata
        =========================================
      */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        <div className="absolute h-[400px] w-[400px] rounded-full bg-[#C69C6D]/10 blur-[100px] md:h-[600px] md:w-[600px]"></div>
      </div>

      {/* KONTEN UTAMA */}
      <div className="relative z-20 mx-auto flex w-full max-w-[800px] flex-col items-center px-6 text-center">
        
        <Reveal>
          {/* IKON TOMBOL 3D MELAYANG HALUS */}
          <div className="animate-float-key relative mx-auto mb-10 flex h-20 w-20 items-center justify-center rounded-[18px] border border-[#E5E3DE] border-b-[6px] border-r-[2px] bg-white shadow-[0_15px_40px_rgba(31,61,53,0.08)] md:mb-12 md:h-24 md:w-24 md:rounded-[22px] md:border-b-[8px]">
            <span className="text-[32px] font-black text-[#1F3D35] md:text-[40px]">
              K
            </span>
            <div className="absolute left-2 top-2 h-4 w-4 rounded-full bg-gradient-to-br from-white to-transparent opacity-80 md:h-6 md:w-6"></div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          {/* Judul */}
          <h2 className="mb-6 text-[40px] font-extrabold leading-[1.05] tracking-tight text-[#1F3D35] sm:text-[52px] md:text-[64px] lg:text-[72px]">
            Rasakan Kostara. <br />
            <span className="text-[#C69C6D]">Pesan sekarang.</span>
          </h2>
        </Reveal>

        <Reveal delay={200}>
          {/* Teks Pendukung */}
          <p className="mx-auto mb-12 max-w-[500px] text-[16px] leading-relaxed text-[#6B716D] md:text-[18px]">
            Jangan biarkan keseharian Anda terbebani oleh lingkungan yang salah. Jadikan Kostara sebagai titik pulang Anda hari ini.
          </p>

          {/* Tombol Aksi */}
          <div className="flex justify-center">
            <Link 
              href="https://wa.me/6281234567890" // Ganti dengan nomor WA admin
              target="_blank"
              className="inline-flex items-center justify-center rounded-full bg-[#1F3D35] px-8 py-4 text-[16px] font-bold text-white shadow-xl transition-colors duration-300 hover:bg-[#162E28] hover:text-[#C69C6D] md:px-10 md:py-5 md:text-[18px]"
            >
              Hubungi Kami
            </Link>
          </div>
        </Reveal>

      </div>
    </section>
  );
}