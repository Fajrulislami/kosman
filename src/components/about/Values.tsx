"use client";

import { useEffect, useRef, useState } from "react";
import { Coffee, ShieldCheck, Zap, Users } from "lucide-react";

/* 
  =========================================
  KOMPONEN SUB: SCROLL REVEAL (Untuk Judul)
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
  DATA NILAI / PRINSIP KOS
  =========================================
*/
const valuesData = [
  {
    id: "01",
    title: "Kenyamanan",
    desc: "Menciptakan lingkungan tinggal yang bersih dan nyaman untuk aktivitas sehari-hari tanpa gangguan.",
    icon: Coffee
  },
  {
    id: "02",
    title: "Keamanan",
    desc: "Memberikan lingkungan hunian yang aman dengan sistem keamanan cerdas dan pengawasan yang terjaga 24/7.",
    icon: ShieldCheck
  },
  {
    id: "03",
    title: "Kemudahan",
    desc: "Menyediakan fasilitas lengkap dan lokasi strategis yang mendukung seluruh mobilitas dan kebutuhan penghuni.",
    icon: Zap
  },
  {
    id: "04",
    title: "Kebersamaan",
    desc: "Membangun lingkungan hunian komunal yang hangat, nyaman, dan saling menghargai ranah privasi satu sama lain.",
    icon: Users
  }
];

export default function Values() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* SENSOR SCROLL PRESISI TINGGI */
  useEffect(() => {
    const handleScroll = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestIndex = 0;
      let minDistance = Infinity;

      sectionRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const elementCenter = rect.top + rect.height / 2;
          const distance = Math.abs(viewportCenter - elementCenter);

          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        }
      });

      setActiveIndex((prev) => (prev !== closestIndex ? closestIndex : prev));
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); 

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // FIX: Reduced bottom padding drastically (pb-12 md:pb-16 instead of pb-32 md:pb-48)
    <section className="relative bg-[#F8F7F4] pt-24 pb-12 md:pt-32 md:pb-16">
      
      {/* Pola Titik Latar Belakang (Dot Grid Root) */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#E5E3DE_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>

      {/* HEADER SECTION (JUDUL UTAMA) */}
      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6">
        <Reveal>
          <div className="mb-8 flex flex-col items-center text-center md:mb-10">
            <span className="mb-4 inline-block text-[13px] font-bold tracking-[0.2em] text-[#C69C6D]">
              PRINSIP KAMI
            </span>
            <h2 className="mb-6 text-[32px] font-extrabold tracking-tight text-[#1F3D35] md:text-[46px]">
              Landasan Kostara
            </h2>
            <p className="max-w-xl text-[15px] leading-relaxed text-[#6B716D]">
              Setiap sudut dan layanan yang kami bangun berakar pada empat pilar utama demi memastikan pengalaman menetap yang sempurna.
            </p>
          </div>
        </Reveal>
      </div>

      {/* AREA STICKY SCROLL */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1100px] flex-col md:flex-row">
        
        {/* KOLOM KIRI (DIAM DI TEMPAT) */}
        <div className="sticky top-0 flex h-[30vh] w-full items-center justify-center md:h-[80vh] md:w-5/12 md:justify-start lg:pl-10">
          <div className="flex items-center gap-6 md:gap-8">
            
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#FFBD2E] md:h-20 md:w-20">
              <div className="absolute -inset-2 rounded-full border border-[#FFBD2E]/30"></div>
            </div>
            
            <div className="overflow-hidden">
              <span 
                key={activeIndex} 
                className="inline-block animate-[slideUp_0.4s_ease-out] text-[64px] font-black tracking-tighter text-[#1F3D35] md:text-[96px] lg:text-[120px]"
              >
                {valuesData[activeIndex].id}
              </span>
            </div>

          </div>
        </div>

        {/* 
          KOLOM KANAN (SCROLLING TEKS) 
        */}
        <div className="w-full px-6 md:w-7/12 md:py-16">
          {valuesData.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeIndex === idx;
            // Determine if it's the last item to remove extra bottom padding
            const isLast = idx === valuesData.length - 1;

            return (
              <div 
                key={idx} 
                ref={(el) => { sectionRefs.current[idx] = el; }} 
                // FIX: Reduced spacing between items and removed bottom padding for the last item
                className={`flex flex-col justify-center pt-16 md:pt-32 ${isLast ? 'pb-16' : 'pb-16 md:pb-32'}`}
              >
                <div 
                  className={`transition-all duration-700 ease-out ${
                    isActive ? "scale-100 opacity-100" : "scale-95 opacity-30 blur-[1px]"
                  }`}
                >
                  
                  <div 
                    className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border transition-colors duration-700 md:h-16 md:w-16 ${
                      isActive ? "border-[#C69C6D] bg-[#F8F7F4] text-[#C69C6D]" : "border-[#E5E3DE] bg-transparent text-[#6B716D]"
                    }`}
                  >
                    <Icon className="h-5 w-5 md:h-7 md:w-7" strokeWidth={1.5} />
                  </div>

                  <h3 className="mb-4 text-[28px] font-extrabold tracking-tight text-[#1F3D35] sm:text-[36px] md:text-[42px]">
                    {item.title}
                  </h3>
                  
                  <p className="max-w-md text-[15px] leading-relaxed text-[#6B716D] md:text-[18px]">
                    {item.desc}
                  </p>
                  
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50%); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </section>
  );
}