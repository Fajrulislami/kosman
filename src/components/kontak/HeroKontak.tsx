"use client";

import React, { useEffect, useRef, useState } from "react";
import { MessageSquare, PhoneCall } from "lucide-react";

// Komponen Reveal untuk animasi scroll (sama seperti di halaman lain)
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "translate-y-0 opacity-100 rotate-0" : "translate-y-12 opacity-0 rotate-2"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function HeroKontak() {
  return (
    <section className="relative w-full pt-32 pb-10 md:pt-40 md:pb-16 overflow-hidden">
      
      {/* Definisi Animasi Floating */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(-12deg); }
          50% { transform: translateY(-15px) rotate(-8deg); }
        }
        @keyframes float-slow-reverse {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-20px) rotate(8deg); }
        }
        .animate-float-icon-1 { animation: float-slow 5s ease-in-out infinite; }
        .animate-float-icon-2 { animation: float-slow-reverse 6s ease-in-out infinite; }
      `}</style>

      {/* 3D Floating Elements Background (Now continuously moving) */}
      <div className="absolute top-20 left-[10%] z-0 hidden md:block animate-float-icon-1 hover:[animation-play-state:paused]">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-[#E5E3DE]/50 transition-transform duration-700 hover:scale-110">
          <MessageSquare className="h-8 w-8 text-[#1F3D35]" strokeWidth={1.5} />
        </div>
      </div>
      <div className="absolute bottom-10 right-[15%] z-0 hidden md:block animate-float-icon-2 hover:[animation-play-state:paused]">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1F3D35] shadow-[0_20px_40px_rgba(31,61,53,0.15)] transition-transform duration-700 hover:scale-110">
          <PhoneCall className="h-9 w-9 text-[#C69C6D]" strokeWidth={1.5} />
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <Reveal delay={100}>
          {/* Badge konsisten dengan halaman Lokasi */}
          <span className="mb-6 inline-block rounded-full bg-white px-5 py-2 text-[12px] font-bold tracking-[0.2em] text-[#C69C6D] shadow-sm border border-[#E5E3DE]">
            LAYANAN PELANGGAN
          </span>
        </Reveal>
        
        <Reveal delay={200}>
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-[#1F3D35] md:text-7xl leading-[1.1]">
            Selalu Siap <br />
            <span className="relative inline-flex items-center justify-center">
              <span className="relative z-10 text-[#C69C6D]">Mendengar Anda.</span>
              {/* Elegant SVG Underline yang pas ukurannya */}
              <svg className="absolute -bottom-1 left-0 -z-10 w-full h-[12px] text-[#C69C6D]/40" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M2.00021 6.84039C52.6106 1.4878 141.258 -1.74567 197.809 6.84039" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>
        </Reveal>

        <Reveal delay={300}>
          <p className="mx-auto max-w-2xl text-lg text-[#6B716D] leading-relaxed md:text-xl">
            Punya pertanyaan seputar ketersediaan kamar, fasilitas, atau ingin menjadwalkan survey lokasi? Jangan ragu untuk menghubungi kami.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
