"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, BedDouble, LayoutList, ShieldCheck, Wallet, UserCheck, Plus } from "lucide-react";

/* 
  =========================================
  KOMPONEN SUB: SCROLL REVEAL
  =========================================
*/
const Reveal = ({ children }: { children: React.ReactNode }) => {
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
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      }`}
    >
      {children}
    </div>
  );
};

/* 
  =========================================
  DATA KEUNGGULAN
  =========================================
*/
const advantagesData = [
  {
    id: "01",
    title: "Lokasi Strategis",
    desc: "Akses sangat dekat ke kampus, area perkantoran, dan pusat kuliner. Menghemat waktu komuter harian Anda secara signifikan.",
    icon: MapPin
  },
  {
    id: "02",
    title: "Kamar Nyaman",
    desc: "Desain interior modern minimalis dengan sirkulasi udara optimal dan furnitur ergonomis untuk istirahat yang maksimal.",
    icon: BedDouble
  },
  {
    id: "03",
    title: "Fasilitas Lengkap",
    desc: "Dari Wi-Fi berkecepatan tinggi, dapur bersama yang bersih, hingga layanan pembersihan kamar reguler untuk Anda.",
    icon: LayoutList
  },
  {
    id: "04",
    title: "Lingkungan Aman",
    desc: "Dilengkapi sistem pengawasan CCTV 24/7 dan akses pintu pintar (smart lock) demi ketenangan dan keamanan privasi.",
    icon: ShieldCheck
  },
  {
    id: "05",
    title: "Harga Transparan",
    desc: "Tidak ada biaya tersembunyi atau tagihan kejutan. Semua fasilitas standar telah tercakup dalam satu harga sewa yang jelas.",
    icon: Wallet
  },
  {
    id: "06",
    title: "Pengelolaan Profesional",
    desc: "Tim manajemen yang responsif dan berdedikasi, siap membantu menyelesaikan segala kendala operasional Anda kapan saja.",
    icon: UserCheck
  }
];

export default function Advantages() {
  return (
    <section className="relative overflow-hidden bg-[#F8F7F4] py-24 md:py-32">
      
      {/* Pola Titik Latar Belakang (Dot Grid Root) */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#E5E3DE_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>

      {/* STYLE CSS KHUSUS ANIMASI OBJEK GEOMETRIS */}
      <style>{`
        @keyframes float-obj-1 {
          0% { transform: translateY(0px) rotate(15deg); }
          50% { transform: translateY(-25px) rotate(20deg); }
          100% { transform: translateY(0px) rotate(15deg); }
        }
        @keyframes float-obj-2 {
          0% { transform: translateY(0px) rotate(-10deg); }
          50% { transform: translateY(-20px) rotate(-15deg); }
          100% { transform: translateY(0px) rotate(-10deg); }
        }
        .animate-floating-1 {
          animation: float-obj-1 6s ease-in-out infinite;
        }
        .animate-floating-2 {
          animation: float-obj-2 8s ease-in-out infinite;
        }
      `}</style>

      {/* ANIMASI BACKGROUND (OBJEK GEOMETRIS JELAS) */}
      <div className="pointer-events-none absolute inset-0 z-0 mx-auto w-full max-w-[1400px] overflow-hidden">
        {/* Objek 1: Kapsul Emas (Kanan Atas) */}
        <div className="animate-floating-1 absolute right-[5%] top-[10%] flex h-[180px] w-[80px] items-center justify-center rounded-full border-4 border-[#C69C6D]/20 bg-[#C69C6D]/5 backdrop-blur-[2px] md:right-[8%] md:h-[220px] md:w-[100px]">
          <div className="h-[60%] w-[2px] rounded-full bg-[#C69C6D]/20"></div>
        </div>

        {/* Objek 2: Kubus Melengkung Hijau (Kiri Bawah) */}
        <div className="animate-floating-2 absolute bottom-[10%] left-[3%] h-[120px] w-[120px] rounded-[32px] border-4 border-[#1F3D35]/15 bg-[#1F3D35]/5 backdrop-blur-[2px] md:left-[6%] md:h-[160px] md:w-[160px]">
          <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1F3D35]/15"></div>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6">
        
        {/* HEADER SECTION */}
        <Reveal>
          <div className="mb-16 flex flex-col items-center text-center md:mb-24">
            <span className="mb-4 inline-block text-[13px] font-bold tracking-[0.2em] text-[#C69C6D]">
              KENAPA MEMILIH KAMI?
            </span>
            <h2 className="max-w-2xl text-[32px] font-extrabold tracking-tight text-[#1F3D35] md:text-[46px]">
              Kenapa saya harus memilih kos ini?
            </h2>
          </div>
        </Reveal>

        {/* 
          =========================================
          KUMPULAN KARTU DENGAN BINGKAI BLUEPRINT
          =========================================
        */}
        <Reveal>
          <div className="relative mx-auto max-w-[1100px] md:p-8">
            
            {/* 
              GARIS ASET & ORNAMEN DI SEKITAR CARD (Sesuai Permintaan)
              Bingkai putus-putus dengan ikon Plus (+) di setiap sudutnya.
            */}
            <div className="pointer-events-none absolute inset-0 hidden rounded-[32px] border-2 border-dashed border-[#E5E3DE]/80 md:block"></div>
            <Plus className="absolute -left-3 -top-3 hidden h-6 w-6 text-[#C69C6D] md:block" strokeWidth={2} />
            <Plus className="absolute -right-3 -top-3 hidden h-6 w-6 text-[#C69C6D] md:block" strokeWidth={2} />
            <Plus className="absolute -bottom-3 -left-3 hidden h-6 w-6 text-[#C69C6D] md:block" strokeWidth={2} />
            <Plus className="absolute -bottom-3 -right-3 hidden h-6 w-6 text-[#C69C6D] md:block" strokeWidth={2} />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {advantagesData.map((item, idx) => {
                const Icon = item.icon;
                
                return (
                  /* 
                     MINI macOS WINDOW CARD
                  */
                  <div 
                    key={idx} 
                    className="group relative flex h-full flex-col overflow-hidden rounded-[16px] border border-[#E5E3DE] bg-white shadow-[0_4px_20px_rgba(31,61,53,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C69C6D] hover:shadow-[0_20px_40px_rgba(31,61,53,0.06)]"
                  >
                    
                    {/* 
                      HEADER macOS (Merah, Kuning, Hijau)
                    */}
                    <div className="flex shrink-0 items-center gap-3 border-b border-[#E5E3DE] bg-[#F8F7F4] px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]"></div>
                        <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]"></div>
                        <div className="h-2.5 w-2.5 rounded-full bg-[#27C93F]"></div>
                      </div>
                      <span className="text-[10px] font-extrabold tracking-widest text-[#6B716D] opacity-70">
                        INFO-{item.id}
                      </span>
                    </div>

                    {/* Konten Teks & Ikon */}
                    <div className="flex flex-1 flex-col p-6 md:p-8">
                      {/* Ikon Elegan */}
                      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] text-[#C69C6D] transition-colors duration-300 group-hover:bg-[#1F3D35] group-hover:text-white">
                        <Icon className="h-5 w-5" strokeWidth={1.5} />
                      </div>

                      <h3 className="mb-3 text-[18px] font-bold text-[#1F3D35] md:text-[20px]">
                        {item.title}
                      </h3>
                      
                      <p className="text-[14px] leading-relaxed text-[#6B716D]">
                        {item.desc}
                      </p>
                    </div>

                  </div>
                );
              })}
            </div>
            
          </div>
        </Reveal>

      </div>
    </section>
  );
}