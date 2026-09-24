"use client";

import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";

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
  DATA TESTIMONI
  =========================================
*/
const reviewsCol1 = [
  {
    text: "Tempatnya sangat bersih dan tenang. Cocok banget buat saya yang sering WFH. Fasilitas lengkap, nggak perlu pusing mikirin apa-apa lagi.",
    name: "Budi Santoso",
    role: "Karyawan Swasta",
  },
  {
    text: "Desain kamarnya modern dan estetik banget. Teman-teman yang main ke kos pada betah. Area komunalnya juga asik buat nongkrong.",
    name: "Nadia Putri",
    role: "Mahasiswi",
  },
  {
    text: "Saya sudah ngekos di 3 tempat berbeda, dan Pondok Rahmat ini yang paling nyaman. Manajemennya responsif kalau ada keluhan.",
    name: "Reza Pahlevi",
    role: "Pekerja Lepas",
  }
];

const reviewsCol2 = [
  {
    text: "Sistem keamanannya top! Pintu akses pakai kartu, CCTV 24 jam. Sebagai mahasiswi, saya merasa sangat aman tinggal di sini.",
    name: "Siti Aisyah",
    role: "Mahasiswi",
  },
  {
    text: "Lokasinya juara! Cuma 5 menit jalan kaki ke kampus. Kalau mau cari makan malam juga banyak banget pilihannya di sekitar sini.",
    name: "Kevin Pratama",
    role: "Mahasiswa",
  },
  {
    text: "Harganya sangat sepadan dengan fasilitas yang didapat. Dapur bersamanya selalu bersih karena ada staf yang bersihin tiap hari.",
    name: "Andi Saputra",
    role: "Karyawan BUMN",
  }
];

const reviewsCol3 = [
  {
    text: "Internetnya kenceng parah. Buat ngerjain tugas atau streaming Netflix nggak pernah buffering. Kamarnya juga kedap suara.",
    name: "Michael Wijaya",
    role: "Software Engineer",
  },
  {
    text: "Suasananya homy banget. Walaupun kosan, tapi berasa tinggal di rumah sendiri. Tetangganya juga pada ramah-ramah.",
    name: "Alya Rahman",
    role: "Karyawan Swasta",
  },
  {
    text: "Fasilitas laundry gratisnya sangat ngebantu! Nggak perlu lagi repot-repot bawa baju kotor ke laundry kiloan.",
    name: "Bima Putra",
    role: "Mahasiswa",
  }
];

// MENGGANDAKAN DATA AGAR SCROLL TERLIHAT TANPA BATAS (INFINITE LOOP)
const baseCol1 = [...reviewsCol1, ...reviewsCol1];
const baseCol2 = [...reviewsCol2, ...reviewsCol2];
const baseCol3 = [...reviewsCol3, ...reviewsCol3];

/* 
  =========================================
  KOMPONEN KARTU TESTIMONI
  =========================================
*/
const ReviewCard = ({ text, name, role }: { text: string, name: string, role: string }) => (
  <div className="rounded-[24px] border border-[#E5E3DE] bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg md:p-8">
    <p className="text-[15px] leading-relaxed text-[#6B716D]">"{text}"</p>
    <div className="mt-6 flex items-center gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#E5E3DE] bg-[#F8F7F4] text-[15px] font-bold text-[#1F3D35]">
        {name.charAt(0)}
      </div>
      <div>
        <h4 className="text-[15px] font-bold text-[#1F3D35]">{name}</h4>
        <p className="text-[12px] font-medium text-[#C69C6D]">{role}</p>
      </div>
    </div>
  </div>
);


export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-[#F8F7F4] py-24 md:py-32">
      
      {/* Pola Titik Latar Belakang (Dot Grid) */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#E5E3DE_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>

      {/* 
        =========================================
        STYLE CSS ANIMASI INFINITE MARQUEE PURE
        Kecepatan diperlambat (durasi detik diperbesar)
        =========================================
      */}
      <style>{`
        /* Animasi Mengalir ke Atas */
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        
        /* Animasi Mengalir ke Bawah (Khusus Kolom Tengah) */
        @keyframes scroll-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        
        /* Durasi diubah dari 35s menjadi 60s (Sangat Pelan) */
        .animate-scroll-up-1 {
          animation: scroll-up 60s linear infinite;
        }
        
        /* Durasi diubah dari 45s menjadi 75s (Sangat Pelan) */
        .animate-scroll-down-2 {
          animation: scroll-down 75s linear infinite;
        }
        
        /* Durasi diubah dari 40s menjadi 65s (Sangat Pelan) */
        .animate-scroll-up-3 {
          animation: scroll-up 65s linear infinite;
        }
      `}</style>

      <div className="relative z-20 mx-auto max-w-[1200px] px-6">
        
        {/* HEADER SECTION */}
        <Reveal>
          <div className="mb-16 flex flex-col items-center text-center">
            <span className="mb-4 inline-block text-[13px] font-bold tracking-[0.2em] text-[#C69C6D]">
              TESTIMONI PENGHUNI
            </span>
            <h2 className="mb-6 text-[32px] font-extrabold tracking-tight text-[#1F3D35] md:text-[46px]">
              Apa Kata Mereka?
            </h2>
            <p className="mb-8 max-w-lg text-[15px] leading-relaxed text-[#6B716D]">
              Ratusan penghuni telah memercayakan kenyamanan harian mereka di Pondok Rahmat. Inilah pengalaman nyata mereka selama tinggal di sini.
            </p>
            
            {/* Rating Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E3DE] bg-white px-5 py-2 shadow-sm">
              <Star className="h-4 w-4 fill-[#FFBD2E] text-[#FFBD2E]" />
              <span className="text-[14px] font-bold text-[#1F3D35]">
                4.9 <span className="font-normal text-[#6B716D]">dari 100+ penghuni</span>
              </span>
            </div>
          </div>
        </Reveal>


        {/* AREA CAROUSEL VERTIKAL */}
        <Reveal delay={200}>
          <div className="relative flex h-[500px] overflow-hidden md:h-[600px] lg:h-[700px]">
            
            {/* Masking Gradient (Efek Memudar Atas & Bawah) */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-[#F8F7F4] to-transparent"></div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-[#F8F7F4] to-transparent"></div>

            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              
              {/* KOLOM 1 (Scroll Ke Atas) */}
              <div className="flex flex-col">
                <div className="animate-scroll-up-1">
                  {[...baseCol1, ...baseCol1].map((rev, i) => (
                    <div key={i} className="pb-6">
                      <ReviewCard {...rev} />
                    </div>
                  ))}
                </div>
              </div>

              {/* KOLOM 2 (Scroll Ke Bawah) - Zig-Zag Offset (pt-16) */}
              <div className="hidden flex-col pt-16 md:flex">
                <div className="animate-scroll-down-2">
                  {[...baseCol2, ...baseCol2].map((rev, i) => (
                    <div key={i} className="pb-6">
                      <ReviewCard {...rev} />
                    </div>
                  ))}
                </div>
              </div>

              {/* KOLOM 3 (Scroll Ke Atas) - Zig-Zag Offset (pt-8) */}
              <div className="hidden flex-col pt-8 lg:flex">
                <div className="animate-scroll-up-3">
                  {[...baseCol3, ...baseCol3].map((rev, i) => (
                    <div key={i} className="pb-6">
                      <ReviewCard {...rev} />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}