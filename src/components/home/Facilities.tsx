"use client";

import { useEffect, useRef, useState } from "react";
import { Wifi, Car, Video, Utensils, Shirt, Sofa, Sparkles } from "lucide-react";

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

/* 
  =========================================
  KOMPONEN SUB: ICON AWAN (SVG)
  =========================================
*/
const CloudIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
    <path d="M405.333,234.667c-6.241,0-12.285,0.732-18.156,2.029C376.621,180.702,324.966,138.667,266.667,138.667 c-55.856,0-104.536,36.577-121.737,87.352c-5.467-0.89-11.096-1.352-16.93-1.352c-58.911,0-106.667,47.756-106.667,106.667 S68.423,438.001,128,438.001h277.333c58.911,0,106.667-47.756,106.667-106.667S464.244,234.667,405.333,234.667z"/>
  </svg>
);

/* 
  =========================================
  DATA FASILITAS
  =========================================
*/
const facilitiesData = [
  {
    title: "WiFi",
    description: "Koneksi internet super cepat 24 jam untuk menunjang kerja dan hiburan Anda.",
    icon: Wifi,
  },
  {
    title: "Parking",
    description: "Area parkir kendaraan yang luas, aman, dan mudah diakses penghuni.",
    icon: Car,
  },
  {
    title: "CCTV",
    description: "Sistem keamanan terintegrasi untuk memastikan ketenangan Anda setiap saat.",
    icon: Video,
  },
  {
    title: "Kitchen",
    description: "Fasilitas memasak lengkap dengan kebersihan yang dirawat setiap hari.",
    icon: Utensils,
  },
  {
    title: "Laundry",
    description: "Kemudahan mencuci dan menyetrika pakaian dengan mesin cuci mandiri.",
    icon: Shirt,
  },
  {
    title: "Common Area",
    description: "Ruang santai komunal yang nyaman untuk bersosialisasi dan bekerja.",
    icon: Sofa,
  }
];


export default function Facilities() {
  return (
    <section className="relative overflow-hidden bg-[#F8F7F4] pb-24 pt-4 md:pb-32 md:pt-8">
      
      {/* 
        =========================================
        STYLE CSS KHUSUS ANIMASI
        Termasuk animasi awan dan animasi efek gelombang emas (Ripple)
        =========================================
      */}
      <style>{`
        @keyframes drift-clouds {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-clouds {
          animation: drift-clouds 35s linear infinite;
          width: 200%;
        }
        
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .animate-ripple {
          animation: ripple 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-ripple-delayed {
          animation: ripple 3s cubic-bezier(0, 0, 0.2, 1) 1.5s infinite;
        }
      `}</style>

      {/* Pola Titik (Dot Grid) di Latar Paling Belakang */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#E5E3DE_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>

      {/* Latar Bergerak Awan */}
      <div className="absolute top-[15%] z-0 flex h-[80%] w-[200%] pointer-events-none opacity-15">
        <div className="animate-clouds flex items-center justify-around w-full">
          <div className="flex w-1/2 items-center justify-around">
            <CloudIcon className="w-48 text-[#DFDDD6] -mt-20" />
            <CloudIcon className="w-72 text-[#DFDDD6] mt-32" />
            <CloudIcon className="w-56 text-[#DFDDD6] -mt-10" />
            <CloudIcon className="w-64 text-[#DFDDD6] mt-24" />
          </div>
          <div className="flex w-1/2 items-center justify-around">
            <CloudIcon className="w-48 text-[#DFDDD6] -mt-20" />
            <CloudIcon className="w-72 text-[#DFDDD6] mt-32" />
            <CloudIcon className="w-56 text-[#DFDDD6] -mt-10" />
            <CloudIcon className="w-64 text-[#DFDDD6] mt-24" />
          </div>
        </div>
      </div>


      {/* 
        =========================================
        VISUAL BRIDGE (WOW FACTOR)
        Lencana Emas Berdenyut untuk mengisi ruang kosong
        =========================================
      */}
      <div className="relative z-10 mx-auto mb-16 flex w-full flex-col items-center justify-center md:mb-20">
        <Reveal delay={100}>
          <div className="group relative flex h-24 w-24 items-center justify-center">
            
            {/* Gelombang Animasi (Ripple Effect) */}
            <div className="animate-ripple absolute h-14 w-14 rounded-full border-[1.5px] border-[#C69C6D]"></div>
            <div className="animate-ripple-delayed absolute h-14 w-14 rounded-full border-[1.5px] border-[#C69C6D]"></div>
            
            {/* Lencana Utama (Interaktif) */}
            <div className="relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-[#1F3D35] to-[#162E28] shadow-[0_10px_20px_rgba(31,61,53,0.3)] transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_15px_30px_rgba(198,156,109,0.3)]">
              {/* Garis batas dalam lencana */}
              <div className="absolute inset-0 m-[2px] rounded-full border border-[#C69C6D]/40"></div>
              {/* Ikon Bintang Berputar saat Hover */}
              <Sparkles className="h-6 w-6 text-[#C69C6D] transition-transform duration-700 group-hover:rotate-180" />
            </div>
            
          </div>
        </Reveal>
      </div>


      {/* 
        =========================================
        KONTEN UTAMA
        =========================================
      */}
      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        
        {/* Header Section */}
        <Reveal>
          <div className="mb-16 text-center md:mb-24">
            <span className="mb-4 inline-block text-[13px] font-bold tracking-[0.2em] text-[#C69C6D]">
              FASILITAS
            </span>
            <h2 className="text-[32px] font-extrabold tracking-tight text-[#1F3D35] md:text-[42px]">
              Semua yang Kamu Butuhkan <br className="hidden md:block" />
              Ada di Sini
            </h2>
          </div>
        </Reveal>

        {/* Grid Layout Fasilitas */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {facilitiesData.map((facility, index) => (
            <Reveal key={index} delay={index * 100}>
              
              <div className="group relative h-full overflow-hidden rounded-[16px] border border-[#E5E3DE] bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-transparent">
                
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#C69C6D]/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                <div className="relative z-10 flex items-center gap-2 border-b border-[#E5E3DE] bg-[#F8F7F4] px-4 py-3 transition-colors group-hover:border-transparent">
                  <div className="h-3 w-3 rounded-full bg-[#FF5F56] shadow-sm"></div>
                  <div className="h-3 w-3 rounded-full bg-[#FFBD2E] shadow-sm"></div>
                  <div className="h-3 w-3 rounded-full bg-[#27C93F] shadow-sm"></div>
                </div>
                
                <div className="relative z-10 flex flex-col items-center p-8 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F8F7F4] shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:bg-white">
                    <facility.icon className="h-7 w-7 text-[#1F3D35] transition-colors duration-300 group-hover:text-[#C69C6D]" />
                  </div>
                  <h3 className="mb-3 text-[20px] font-bold tracking-tight text-[#202321]">
                    {facility.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-[#6B716D]">
                    {facility.description}
                  </p>
                </div>

              </div>

            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}