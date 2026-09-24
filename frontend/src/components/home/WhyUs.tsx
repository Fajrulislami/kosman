"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldCheck, Sparkles, Users, BedDouble } from "lucide-react";

// Komponen Reveal untuk animasi masuk
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

export default function WhyUs() {
  const advantages = [
    {
      num: "01",
      title: "Keamanan & Privasi 24 Jam",
      desc: "Setiap kamar dilengkapi Smart Lock Keyless. Area publik terpantau CCTV 24/7 dengan akses gerbang eksklusif. Ketenangan Anda adalah prioritas absolut kami.",
      icon: ShieldCheck,
    },
    {
      num: "02",
      title: "Kebersihan Terjadwal",
      desc: "Fokus pada kesibukan Anda, biarkan kami yang mengurus sisanya. Layanan pembersihan kamar profesional tersedia dua kali seminggu secara gratis.",
      icon: Sparkles,
    },
    {
      num: "03",
      title: "Komunitas Berkualitas",
      desc: "Bergabunglah dengan lingkungan yang diisi oleh para profesional dan mahasiswa pilihan. Ruang komunal dirancang khusus untuk memfasilitasi networking yang positif.",
      icon: Users,
    },
    {
      num: "04",
      title: "Fasilitas Standar Hotel",
      desc: "Kasur premium, AC dingin, Wi-Fi berkecepatan tinggi, hingga kamar mandi dalam dengan water heater. Standar hidup tinggi tanpa kompromi.",
      icon: BedDouble,
    }
  ];

  return (
    // Menggunakan bg-transparent agar menyatu dengan background root (#F8F7F4) dan pola titik dari page.tsx
    <section className="relative w-full py-24 md:py-32 bg-transparent">
      
      <div className="relative z-10 mx-auto w-full max-w-[1000px] px-6">
        
        {/* Header Section (Editorial Style) */}
        <Reveal delay={0}>
          <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              {/* Badge konsisten dengan lokasi dan kontak */}
              <span className="mb-6 inline-block rounded-full bg-white px-5 py-2 text-[12px] font-bold tracking-[0.2em] text-[#C69C6D] shadow-sm border border-[#E5E3DE]">
                MENGAPA pondokrahmat
              </span>
              <h2 className="text-4xl font-extrabold tracking-tight text-[#1F3D35] md:text-5xl lg:text-[56px] leading-[1.1]">
                Bukan Sekadar <br />
                <span className="relative inline-flex items-center">
                  <span className="relative z-10 text-[#C69C6D]">Tempat Singgah.</span>
                  {/* SVG Underline hybrid dari HeroKontak */}
                  <svg className="absolute -bottom-1 left-0 -z-10 w-full h-[12px] text-[#C69C6D]/30" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M2.00021 6.84039C52.6106 1.4878 141.258 -1.74567 197.809 6.84039" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                </span>
              </h2>
            </div>
            <p className="text-lg text-[#6B716D] max-w-sm leading-relaxed pb-2">
              Kami meredefinisi standar hunian kos dengan memadukan kenyamanan, privasi, dan layanan premium.
            </p>
          </div>
        </Reveal>

        {/* 
          Editorial List Layout (Meninggalkan gaya "AI Bento Box")
          Menggunakan list raksasa bergaya majalah arsitektur / boutique hotel
        */}
        <div className="flex flex-col border-b border-[#E5E3DE]">
          {advantages.map((item, index) => (
            <Reveal key={index} delay={100 * (index + 1)}>
              <div className="group flex flex-col md:flex-row md:items-center justify-between border-t border-[#E5E3DE] py-10 transition-colors duration-500 hover:bg-white/40 px-4 -mx-4 rounded-3xl">
                
                {/* Kiri: Angka Raksasa & Teks */}
                <div className="flex items-start md:items-center gap-6 md:gap-12 md:w-4/5">
                  <span className="text-5xl md:text-7xl font-black text-[#E5E3DE] transition-colors duration-500 group-hover:text-[#C69C6D]">
                    {item.num}
                  </span>
                  <div>
                    <h3 className="mb-3 text-2xl font-bold tracking-tight text-[#1F3D35] transition-colors duration-300 group-hover:text-[#202321]">
                      {item.title}
                    </h3>
                    <p className="text-[15px] text-[#6B716D] leading-relaxed max-w-xl">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Kanan: Ikon Floating bergaya macOS / 3D */}
                <div className="mt-8 md:mt-0 flex justify-end md:w-1/5">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm border border-[#E5E3DE] transition-transform duration-500 ease-out group-hover:scale-125 group-hover:rotate-12 group-hover:shadow-[0_20px_40px_rgba(31,61,53,0.1)]">
                    <item.icon className="h-7 w-7 text-[#1F3D35] transition-colors duration-500 group-hover:text-[#C69C6D]" strokeWidth={1.5} />
                    
                    {/* Aksen titik warna (Hybrid dari Gallery/Hero) yang muncul saat hover */}
                    <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#27C93F] opacity-0 transition-opacity duration-500 group-hover:opacity-100 shadow-sm"></div>
                  </div>
                </div>

              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
