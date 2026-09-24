"use client";

import { useEffect, useRef, useState } from "react";
import { Leaf, Sofa } from "lucide-react";

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
        isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function Environment() {
  return (
    <section className="relative overflow-hidden bg-[#F8F7F4] py-24 md:py-32">
      
      {/* Pola Titik Latar Belakang */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#E5E3DE_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>

      {/* 
        =========================================
        STYLE CSS: ANIMASI BACKGROUND
        =========================================
      */}
      <style>{`
        /* Animasi Gambar Bergerak (Cinematic Pan) */
        @keyframes cinematic-pan-1 {
          0% { transform: scale(1.05) translate(0, 0); }
          50% { transform: scale(1.15) translate(-2%, -2%); }
          100% { transform: scale(1.05) translate(0, 0); }
        }
        @keyframes cinematic-pan-2 {
          0% { transform: scale(1.05) translate(0, 0); }
          50% { transform: scale(1.15) translate(2%, 1%); }
          100% { transform: scale(1.05) translate(0, 0); }
        }
        .animate-pan-1 { animation: cinematic-pan-1 30s ease-in-out infinite; }
        .animate-pan-2 { animation: cinematic-pan-2 35s ease-in-out infinite; }

        /* Animasi Melintasi Halaman */
        @keyframes cross-screen-fast {
          0% { transform: translateX(-30vw); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(120vw); opacity: 0; }
        }
        @keyframes cross-screen-slow {
          0% { transform: translateX(-50vw) rotate(0deg); }
          100% { transform: translateX(150vw) rotate(180deg); }
        }
        .animate-cross-beam { animation: cross-screen-fast 15s ease-in-out infinite; }
        .animate-cross-orb { animation: cross-screen-slow 35s linear infinite; }
      `}</style>

      {/* 
        =========================================
        ANIMASI BACKGROUND MELINTAS
        =========================================
      */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        
        {/* Awan Cahaya Emas Besar */}
        <div className="animate-cross-beam absolute top-[35%] h-[200px] w-[400px] rounded-full bg-[#C69C6D]/15 blur-[60px] md:top-[25%] md:w-[600px]"></div>
        
        {/* Garis Cahaya Komet Emas Tajam */}
        <div className="animate-cross-beam absolute top-[40%] h-[2px] w-[300px] bg-gradient-to-r from-transparent via-[#C69C6D] to-transparent shadow-[0_0_15px_rgba(198,156,109,0.8)] md:top-[30%] md:w-[700px]"></div>
        
        {/* 
          Cincin Raksasa Berputar (Garis SOLID, bukan putus-putus) 
          Kelas border-dashed dihapus, diganti border-solid
        */}
        <div className="animate-cross-orb absolute top-[10%] h-[500px] w-[500px] rounded-full border-[2px] border-solid border-[#1F3D35]/15 md:h-[900px] md:w-[900px]"></div>
      </div>


      {/* KONTEN UTAMA */}
      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6">
        
        {/* METADATA BAR */}
        <Reveal>
          <div className="mb-12 flex w-full items-center justify-between border-b border-[#E5E3DE] pb-4 md:mb-16">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#C69C6D] md:text-[12px]">
              SUASANA & LINGKUNGAN
            </span>
            <span className="text-[10px] font-bold tracking-widest text-[#6B716D] opacity-60 md:text-[11px]">
              pondokrahmat RESIDENCE
            </span>
          </div>
        </Reveal>

        {/* HEADER LAYOUT */}
        <Reveal delay={100}>
          <div className="mb-16 flex flex-col md:mb-20">
            <h2 className="text-[42px] font-bold leading-[1.05] tracking-tight md:text-[56px] lg:text-[72px]">
              <span className="text-[#1F3D35]">Tempat tinggal yang</span><br />
              <span className="text-[#8e9591]">membuat kamu betah</span><br />
              <span className="text-[#8e9591]">pulang.</span>
            </h2>
            <p className="mt-8 max-w-[650px] text-[16px] leading-relaxed text-[#6B716D] md:text-[18px]">
              Kami merancang setiap sudut ruang untuk memulihkan energi Anda. Sebuah harmoni sempurna antara desain modern minimalis dan kenyamanan esensial sehari-hari.
            </p>
          </div>
        </Reveal>

        {/* GAMBAR DI DALAM KARTU (MAC-OS STYLE) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:gap-10">
          
          {/* KARTU 1 (Kiri) */}
          <Reveal delay={200}>
            <div className="group relative flex w-full flex-col overflow-hidden rounded-[24px] border border-[#E5E3DE] bg-white p-4 shadow-sm transition-shadow duration-500 hover:shadow-lg md:p-6">
              
              <div className="mb-4 flex items-center justify-between px-2">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-[#27C93F]"></div>
                </div>
                <div className="flex items-center gap-2 text-[#C69C6D]">
                  <Leaf className="h-4 w-4" strokeWidth={2} />
                  <span className="text-[10px] font-extrabold tracking-widest opacity-80">
                    Sirkulasi Alami
                  </span>
                </div>
              </div>

              <div className="relative h-[300px] w-full overflow-hidden rounded-[16px] border border-[#E5E3DE]/50 sm:h-[400px]">
                <img 
                  src="http://googleusercontent.com/image_collection/image_retrieval/3788642309966322548_0" 
                  alt="Ruang Privat Nyaman" 
                  className="animate-pan-1 absolute inset-0 h-full w-full object-cover"
                />
              </div>
              
              <div className="mt-6 px-2 md:mt-8">
                <h3 className="mb-2 text-[22px] font-bold tracking-tight text-[#1F3D35] md:mb-3 md:text-[26px]">
                  Ruang Privat
                </h3>
                <p className="text-[15px] leading-relaxed text-[#6B716D]">
                  Kamar dengan sirkulasi udara optimal dan cahaya alami yang menenangkan untuk istirahat maksimal.
                </p>
              </div>

            </div>
          </Reveal>

          {/* KARTU 2 (Kanan) */}
          <Reveal delay={300}>
            <div className="group relative mt-0 flex w-full flex-col overflow-hidden rounded-[24px] border border-[#E5E3DE] bg-white p-4 shadow-sm transition-shadow duration-500 hover:shadow-lg md:mt-16 md:p-6">
              
              <div className="mb-4 flex items-center justify-between px-2">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-[#27C93F]"></div>
                </div>
                <div className="flex items-center gap-2 text-[#C69C6D]">
                  <Sofa className="h-4 w-4" strokeWidth={2} />
                  <span className="text-[10px] font-extrabold tracking-widest opacity-80">
                    Area Bersama
                  </span>
                </div>
              </div>

              <div className="relative h-[300px] w-full overflow-hidden rounded-[16px] border border-[#E5E3DE]/50 sm:h-[400px]">
                <img 
                  src="http://googleusercontent.com/image_collection/image_retrieval/11818257539044468086_0" 
                  alt="Ruang Kerja dan Komunal" 
                  className="animate-pan-2 absolute inset-0 h-full w-full object-cover"
                />
              </div>
              
              <div className="mt-6 px-2 md:mt-8">
                <h3 className="mb-2 text-[22px] font-bold tracking-tight text-[#1F3D35] md:mb-3 md:text-[26px]">
                  Area Beraktivitas
                </h3>
                <p className="text-[15px] leading-relaxed text-[#6B716D]">
                  Lingkungan bersih dan tenang yang mendukung Anda untuk fokus bekerja, belajar, atau bersantai.
                </p>
              </div>

            </div>
          </Reveal>

        </div>

      </div>
    </section>
  );
}