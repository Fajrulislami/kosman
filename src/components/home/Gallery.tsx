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
      className={`transition-all duration-700 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};


export default function Gallery() {
  return (
    <section className="relative overflow-hidden bg-[#F8F7F4] py-24 md:py-32">
      
      {/* Pola Titik Latar Belakang (Dot Grid) */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#E5E3DE_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        
        {/* Header Section */}
        <Reveal>
          <div className="mb-16 text-center md:mb-20">
            <span className="mb-4 inline-block text-[13px] font-bold tracking-[0.2em] text-[#C69C6D]">
              GALERI KOS
            </span>
            <h2 className="text-[32px] font-extrabold tracking-tight text-[#1F3D35] md:text-[42px]">
              Eksplorasi Suasana Kostara
            </h2>
          </div>
        </Reveal>

        {/* 
          =========================================
          LAYOUT 3 KOLOM GALERI (KONSISTEN & RAPI)
          Ketiganya menjadi kartu visual yang setara
          =========================================
        */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          
          {/* 1. KARTU GALERI: KAMAR TIDUR */}
          <Reveal delay={100}>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[#E5E3DE] bg-white shadow-sm transition-shadow hover:shadow-md lg:h-[420px]">
              
              {/* Header Jendela macOS */}
              <div className="flex shrink-0 items-center gap-2 border-b border-[#E5E3DE] bg-[#F8F7F4] px-5 py-3.5">
                <div className="h-3 w-3 rounded-full bg-[#FF5F56]"></div>
                <div className="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
                <div className="h-3 w-3 rounded-full bg-[#27C93F]"></div>
              </div>

              {/* Wadah Foto Statis */}
              <div className="relative flex flex-1 flex-col justify-end overflow-hidden bg-[#E5E3DE] p-6">
                {/* <Image src="/images/gallery/kamar.jpg" alt="Kamar Tidur" fill className="object-cover" /> */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                
                <div className="relative z-10">
                  <span className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                    Ruang Privasi
                  </span>
                  <h4 className="mb-1 text-[20px] font-bold text-white">Kamar Tidur</h4>
                  <p className="text-[13px] text-white/80">Desain modern untuk istirahat yang berkualitas.</p>
                </div>
              </div>

            </div>
          </Reveal>


          {/* 2. KARTU GALERI: AREA KOMUNAL */}
          <Reveal delay={200}>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[#E5E3DE] bg-white shadow-sm transition-shadow hover:shadow-md lg:h-[420px]">
              
              <div className="flex shrink-0 items-center gap-2 border-b border-[#E5E3DE] bg-[#F8F7F4] px-5 py-3.5">
                <div className="h-3 w-3 rounded-full bg-[#FF5F56]"></div>
                <div className="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
                <div className="h-3 w-3 rounded-full bg-[#27C93F]"></div>
              </div>

              <div className="relative flex flex-1 flex-col justify-end overflow-hidden bg-[#E5E3DE] p-6">
                {/* <Image src="/images/gallery/komunal.jpg" alt="Area Komunal" fill className="object-cover" /> */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                
                <div className="relative z-10">
                  <span className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                    Fasilitas Bersama
                  </span>
                  <h4 className="mb-1 text-[20px] font-bold text-white">Area Komunal</h4>
                  <p className="text-[13px] text-white/80">Ruang interaksi, bersantai, dan bekerja yang nyaman.</p>
                </div>
              </div>

            </div>
          </Reveal>


          {/* 3. KARTU GALERI: LINGKUNGAN / KEAMANAN */}
          <Reveal delay={300}>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[#E5E3DE] bg-white shadow-sm transition-shadow hover:shadow-md lg:h-[420px]">
              
              <div className="flex shrink-0 items-center gap-2 border-b border-[#E5E3DE] bg-[#F8F7F4] px-5 py-3.5">
                <div className="h-3 w-3 rounded-full bg-[#FF5F56]"></div>
                <div className="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
                <div className="h-3 w-3 rounded-full bg-[#27C93F]"></div>
              </div>

              <div className="relative flex flex-1 flex-col justify-end overflow-hidden bg-[#E5E3DE] p-6">
                {/* <Image src="/images/gallery/lingkungan.jpg" alt="Lingkungan Kostara" fill className="object-cover" /> */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                
                <div className="relative z-10">
                  <span className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                    Akses & Keamanan
                  </span>
                  <h4 className="mb-1 text-[20px] font-bold text-white">Lingkungan Asri</h4>
                  <p className="text-[13px] text-white/80">Parkir luas dengan pengawasan CCTV 24 Jam.</p>
                </div>
              </div>

            </div>
          </Reveal>

        </div>



      </div>
    </section>
  );
}