"use client";

import { useEffect, useRef, useState } from "react";

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
      className={`transition-all duration-1000 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
        }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/* 
  =========================================
  KOMPONEN SUB: BALOK HURUF 3D (GAYA KEYBOARD)
  =========================================
*/
const FloatingLetter = ({
  char,
  className,
  animationClass
}: {
  char: string,
  className: string,
  animationClass: string
}) => {
  return (
    <div className={`absolute select-none ${animationClass} ${className}`}>
      {/* Efek 3D menggunakan border-b tebal dan warna solid putih */}
      <div className="flex h-full w-full items-center justify-center rounded-[10px] border border-[#E5E3DE] border-b-[4px] border-r-[2px] bg-white text-[16px] font-black text-[#1F3D35] shadow-sm sm:rounded-[14px] sm:text-[20px]">
        {char}
      </div>
    </div>
  );
};

export default function HeroAbout() {
  return (
    // Padding Top (pt-40 md:pt-48) diperbesar agar teks tidak tertutup Navbar!
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-[#F8F7F4] pt-40 pb-24 md:min-h-[85vh] md:pt-48">

      {/* Pola Titik Latar Belakang (Dot Grid) */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#E5E3DE_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>

      {/* STYLE CSS ANIMASI MELAYANG */}
      <style>{`
        @keyframes float-1 {
          0% { transform: translateY(0px) rotate(-10deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
          100% { transform: translateY(0px) rotate(-10deg); }
        }
        @keyframes float-2 {
          0% { transform: translateY(0px) rotate(15deg); }
          50% { transform: translateY(-20px) rotate(25deg); }
          100% { transform: translateY(0px) rotate(15deg); }
        }
        @keyframes float-3 {
          0% { transform: translateY(0px) rotate(-25deg) scale(0.9); }
          50% { transform: translateY(15px) rotate(-15deg) scale(0.9); }
          100% { transform: translateY(0px) rotate(-25deg) scale(0.9); }
        }

        .animate-float-1 { animation: float-1 6s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 8s ease-in-out infinite 1s; }
        .animate-float-3 { animation: float-3 7s ease-in-out infinite 2s; }
      `}</style>

      {/* 
        AREA HURUF MELAYANG (Dibatasi di tengah)
        Menggunakan max-w-[1000px] agar huruf-hurufnya tidak lari ke ujung layar
      */}
      <div className="pointer-events-none absolute inset-0 z-10 mx-auto flex w-full max-w-[1100px] items-center justify-center overflow-hidden">
        <div className="relative h-full w-full">
          {/* Huruf K (Kiri Atas, sedikit blur) */}
          <FloatingLetter char="K" animationClass="animate-float-1" className="left-[5%] top-[20%] h-10 w-10 blur-[1px] sm:left-[15%] sm:h-12 sm:w-12 md:top-[25%] md:h-14 md:w-14" />

          {/* Huruf O (Kiri Bawah, tajam) */}
          <FloatingLetter char="O" animationClass="animate-float-2" className="bottom-[15%] left-[10%] h-12 w-12 sm:left-[20%] md:bottom-[25%] md:h-16 md:w-16" />

          {/* Huruf S (Kiri Tengah, sangat blur / jauh) */}
          <FloatingLetter char="S" animationClass="animate-float-3" className="left-[-5%] top-[45%] h-8 w-8 blur-[3px] sm:left-[5%] md:h-10 md:w-10" />

          {/* Huruf T (Kanan Atas, tajam) */}
          <FloatingLetter char="T" animationClass="animate-float-1" className="right-[10%] top-[15%] h-10 w-10 sm:right-[15%] md:top-[20%] md:h-14 md:w-14" />

          {/* Huruf A (Kanan Bawah, tajam) */}
          <FloatingLetter char="A" animationClass="animate-float-2" className="bottom-[20%] right-[5%] h-12 w-12 sm:right-[20%] md:bottom-[30%] md:h-16 md:w-16" />

          {/* Huruf R (Kanan Tengah, blur medium) */}
          <FloatingLetter char="R" animationClass="animate-float-3" className="right-[-5%] top-[50%] h-10 w-10 blur-[2px] sm:right-[5%] md:h-12 md:w-12" />
        </div>
      </div>

      {/* 
        KONTEN TEKS UTAMA
        Berada di atas huruf melayang (z-20)
      */}
      <div className="relative z-20 mx-auto w-full max-w-[900px] px-6 text-center">

        <Reveal>
          <span className="mb-4 inline-block text-[13px] font-bold tracking-[0.2em] text-[#C69C6D]">
            TENTANG KAMI
          </span>
          <h1 className="mx-auto mb-6 max-w-[700px] text-[36px] font-extrabold leading-[1.1] tracking-tight text-[#1F3D35] md:text-[52px] lg:text-[64px]">
            Lebih dari Sekadar <br /> Tempat Tinggal
          </h1>
        </Reveal>

        <Reveal delay={150}>
          <p className="mx-auto max-w-[600px] text-[16px] leading-relaxed text-[#6B716D] md:text-[18px]">
            Mengenal lebih dekat Pondok Rahmat, hunian yang dirancang untuk memberikan kenyamanan, keamanan, dan kemudahan dalam kehidupan sehari-hari Anda.
          </p>
        </Reveal>

      </div>
    </section>
  );
}