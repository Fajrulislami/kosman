"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Plus, Circle } from "lucide-react"; // Menambahkan ikon simpel untuk ornamen

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


export default function CTA() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-[#F8F7F4] py-32 md:py-48">
      
      {/* Pola Titik Latar Belakang (Dot Grid) */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#E5E3DE_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>

      {/* 
        =========================================
        STYLE CSS KHUSUS ANIMASI BLOB & ORNAMEN
        =========================================
      */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        .animate-blob {
          animation: blob 10s infinite alternate;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 8s ease-in-out infinite 2s;
        }
        
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>

      {/* 
        =========================================
        ANIMASI BACKGROUND (GLOWING ORBS & ORNAMEN)
        =========================================
      */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        {/* Blob Hijau Gelap */}
        <div className="animate-blob absolute h-[300px] w-[300px] rounded-full bg-[#1F3D35] opacity-10 mix-blend-multiply blur-[80px] md:h-[500px] md:w-[500px]"></div>
        {/* Blob Emas (Tertunda 2 detik) */}
        <div className="animate-blob animation-delay-2000 absolute right-1/4 top-1/4 h-[250px] w-[250px] rounded-full bg-[#C69C6D] opacity-15 mix-blend-multiply blur-[80px] md:h-[400px] md:w-[400px]"></div>
        {/* Blob Abu-abu hangat (Tertunda 4 detik) */}
        <div className="animate-blob animation-delay-4000 absolute bottom-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-[#E5E3DE] opacity-40 mix-blend-multiply blur-[80px] md:h-[450px] md:w-[450px]"></div>
        
        {/* Ornamen Ekstra: Sangat tipis dan melayang pelan agar tidak polos */}
        <div className="animate-float absolute left-[15%] top-[20%] text-[#C69C6D]/30 md:left-[20%]">
          <Plus className="h-8 w-8 md:h-12 md:w-12" strokeWidth={1.5} />
        </div>
        <div className="animate-float-delayed absolute bottom-[20%] right-[15%] text-[#1F3D35]/20 md:right-[20%]">
          <Circle className="h-10 w-10 md:h-16 md:w-16" strokeWidth={1.5} />
        </div>
      </div>


      {/* 
        =========================================
        KONTEN UTAMA (TYPOGRAPHY RAKSASA)
        =========================================
      */}
      <div className="relative z-20 mx-auto w-full max-w-[1200px] px-6 text-center">
        
        <Reveal>
          {/* Label Super Tipis */}
          <span className="mb-6 inline-block font-medium tracking-[0.3em] text-[#C69C6D] md:text-[14px]">
            TUNGGU APA LAGI?
          </span>

          {/* Headline Raksasa */}
          <h2 className="mx-auto mb-8 max-w-[1000px] text-[48px] font-black uppercase leading-[0.95] tracking-tighter text-[#1F3D35] sm:text-[72px] md:text-[96px] lg:text-[110px]">
            KENYAMANAN <br />
            YANG <span className="text-[#C69C6D]">SEBENARNYA</span>
          </h2>
        </Reveal>

        <Reveal delay={100}>
          {/* Teks Sub-heading pendukung */}
          <p className="mx-auto mb-12 max-w-[500px] text-[16px] leading-relaxed text-[#6B716D] md:text-[18px]">
            Jangan biarkan hari-hari sibuk Anda dihabiskan di tempat yang salah. Berikan diri Anda hunian premium, aman, dan tenang di Pondok Rahmat hari ini juga.
          </p>

          {/* 
            Tombol Aksi Utama (CTA)
            DISEDERHANAKAN: Tanpa panah, tanpa efek melompat. 
            Hanya transisi warna teks (emas) dan background (hijau gelap).
          */}
          <div className="flex justify-center">
            <Link 
              href="https://wa.me/6281234567890" // Ganti dengan nomor WhatsApp admin yang asli
              target="_blank"
              className="inline-flex items-center justify-center rounded-full bg-[#1F3D35] px-8 py-4 text-[16px] font-bold text-white shadow-xl transition-colors duration-300 hover:bg-[#162E28] hover:text-[#C69C6D] md:px-10 md:py-5 md:text-[18px]"
            >
              Pesan Kamar Sekarang
            </Link>
          </div>
        </Reveal>

      </div>
    </section>
  );
}