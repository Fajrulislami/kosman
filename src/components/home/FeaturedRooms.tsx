"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

/* 
  =========================================
  KOMPONEN SUB: SCROLL REVEAL (Serempak)
  Tidak ada lagi delay, semuanya muncul bersamaan
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
      { threshold: 0.15 } // Muncul saat 15% elemen terlihat di layar
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-[800ms] ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      }`}
    >
      {children}
    </div>
  );
};


export default function FeaturedRooms() {
  return (
    // Latar Belakang Cream + Dot Grid
    <section className="relative overflow-hidden bg-[#F8F7F4] pb-24 md:pb-32">
      
      {/* 
        =========================================
        STYLE CSS KHUSUS ANIMASI TEKS BERJALAN
        =========================================
      */}
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 25s linear infinite;
        }
      `}</style>

      {/* Pola Titik Latar Belakang */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E3DE_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>

      {/* 
        =========================================
        RUNNING TEXT BANNER (PENGISI RUANG KOSONG)
        Ditempatkan di posisi paling atas section ini
        =========================================
      */}
      <div className="relative z-20 flex w-full overflow-hidden bg-[#1F3D35] py-4 shadow-md">
        <div className="animate-ticker flex w-max items-center whitespace-nowrap">
          {/* Di-loop 2 kali agar animasinya tidak pernah putus */}
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center">
              <span className="mx-8 text-[13px] font-bold tracking-[0.2em] text-[#C69C6D]">KEAMANAN 24 JAM</span>
              <span className="text-white/20">✦</span>
              <span className="mx-8 text-[13px] font-bold tracking-[0.2em] text-[#C69C6D]">FASILITAS LENGKAP</span>
              <span className="text-white/20">✦</span>
              <span className="mx-8 text-[13px] font-bold tracking-[0.2em] text-[#C69C6D]">LOKASI STRATEGIS</span>
              <span className="text-white/20">✦</span>
              <span className="mx-8 text-[13px] font-bold tracking-[0.2em] text-[#C69C6D]">LINGKUNGAN BERSIH</span>
              <span className="text-white/20">✦</span>
              <span className="mx-8 text-[13px] font-bold tracking-[0.2em] text-[#C69C6D]">HARGA TERJANGKAU</span>
              <span className="text-white/20">✦</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-20 max-w-[1200px] px-6">
        
        {/* Header Section */}
        <Reveal>
          <div className="mb-20 text-center">
            <span className="mb-4 inline-block text-[13px] font-bold tracking-[0.2em] text-[#C69C6D]">
              PILIHAN KAMAR
            </span>
            <h2 className="text-[32px] font-extrabold tracking-tight text-[#1F3D35] md:text-[42px]">
              Temukan Ruang Pribadimu
            </h2>
          </div>
        </Reveal>

        <div className="flex flex-col gap-32">
          
          {/* 
            =========================================
            KAMAR 1: STANDARD ROOM
            Semua elemen dibungkus 1 Reveal agar serempak
            =========================================
          */}
          <Reveal>
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
              
              <div className="order-2 flex flex-col items-start lg:order-1">
                {/* Chat Bubble Nama */}
                <div className="mb-3 inline-block rounded-2xl rounded-bl-sm bg-gradient-to-r from-[#1F3D35] to-[#2A5247] px-6 py-3 shadow-md">
                  <span className="text-[18px] font-bold text-white shadow-sm">
                    Standard Room
                  </span>
                </div>

                {/* Chat Bubble Harga */}
                <div className="mb-8 inline-block rounded-2xl rounded-bl-sm bg-gradient-to-r from-[#C69C6D] to-[#D5A97A] px-5 py-2.5 shadow-md">
                  <span className="text-[16px] font-bold text-white shadow-sm">
                    Rp 800.000 / bulan
                  </span>
                </div>

                <h3 className="mb-3 text-[20px] font-bold text-[#202321]">Fasilitas Esensial</h3>
                <p className="mb-6 max-w-sm text-[15px] leading-relaxed text-[#6B716D]">
                  Pilihan tepat bagi Anda yang mengutamakan fungsi dan kenyamanan dasar dengan harga terjangkau.
                </p>
                
                {/* Daftar Fasilitas */}
                <ul className="flex flex-col gap-3 text-[14px]">
                  <li className="flex w-fit items-center gap-3 rounded-xl border border-[#E5E3DE] bg-white px-4 py-2.5 shadow-sm transition-colors hover:border-[#C69C6D]">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F8F7F4]">
                      <Check className="h-3.5 w-3.5 text-[#1F3D35]" />
                    </div>
                    <span className="font-semibold text-[#6B716D]">Kasur & Bantal</span>
                  </li>
                  <li className="flex w-fit items-center gap-3 rounded-xl border border-[#E5E3DE] bg-white px-4 py-2.5 shadow-sm transition-colors hover:border-[#C69C6D]">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F8F7F4]">
                      <Check className="h-3.5 w-3.5 text-[#1F3D35]" />
                    </div>
                    <span className="font-semibold text-[#6B716D]">Lemari Pakaian</span>
                  </li>
                  <li className="flex w-fit items-center gap-3 rounded-xl border border-[#E5E3DE] bg-white px-4 py-2.5 shadow-sm transition-colors hover:border-[#C69C6D]">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F8F7F4]">
                      <Check className="h-3.5 w-3.5 text-[#1F3D35]" />
                    </div>
                    <span className="font-semibold text-[#6B716D]">Koneksi WiFi Gratis</span>
                  </li>
                </ul>
              </div>

              {/* Jendela Foto Kamar */}
              <div className="order-1 lg:order-2">
                <div className="overflow-hidden rounded-[16px] border border-[#E5E3DE] bg-white shadow-xl transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl">
                  <div className="flex items-center gap-2 border-b border-[#E5E3DE] bg-[#F8F7F4] px-4 py-3">
                    <div className="h-3 w-3 rounded-full bg-[#FF5F56]"></div>
                    <div className="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
                    <div className="h-3 w-3 rounded-full bg-[#27C93F]"></div>
                  </div>
                  <div className="aspect-[4/3] w-full bg-[#E5E3DE]">
                    {/* <Image src="/images/kamar/standard.jpg" alt="Standard Room" fill className="object-cover" /> */}
                  </div>
                </div>
              </div>

            </div>
          </Reveal>


          {/* 
            =========================================
            KAMAR 2: EXCLUSIVE ROOM
            =========================================
          */}
          <Reveal>
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
              
              <div className="order-1">
                <div className="overflow-hidden rounded-[16px] border border-[#E5E3DE] bg-white shadow-xl transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl">
                  <div className="flex items-center gap-2 border-b border-[#E5E3DE] bg-[#F8F7F4] px-4 py-3">
                    <div className="h-3 w-3 rounded-full bg-[#FF5F56]"></div>
                    <div className="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
                    <div className="h-3 w-3 rounded-full bg-[#27C93F]"></div>
                  </div>
                  <div className="aspect-[4/3] w-full bg-[#E5E3DE]">
                    {/* <Image src="/images/kamar/exclusive.jpg" alt="Exclusive Room" fill className="object-cover" /> */}
                  </div>
                </div>
              </div>

              <div className="order-2 flex flex-col items-start lg:items-end lg:text-right">
                <div className="mb-3 inline-block rounded-2xl rounded-br-sm bg-gradient-to-r from-[#1F3D35] to-[#2A5247] px-6 py-3 shadow-md">
                  <span className="text-[18px] font-bold text-white shadow-sm">
                    Exclusive Room
                  </span>
                </div>

                <div className="mb-8 inline-block rounded-2xl rounded-br-sm bg-gradient-to-r from-[#C69C6D] to-[#D5A97A] px-5 py-2.5 shadow-md">
                  <span className="text-[16px] font-bold text-white shadow-sm">
                    Rp 1.200.000 / bulan
                  </span>
                </div>

                <h3 className="mb-3 text-[20px] font-bold text-[#202321]">Kenyamanan Premium</h3>
                <p className="mb-6 max-w-sm text-[15px] leading-relaxed text-[#6B716D]">
                  Nikmati fasilitas ekstra untuk menunjang gaya hidup modern Anda tanpa kompromi.
                </p>
                
                <ul className="flex flex-col items-start gap-3 text-[14px] lg:items-end">
                  <li className="flex w-fit items-center gap-3 rounded-xl border border-[#E5E3DE] bg-white px-4 py-2.5 shadow-sm transition-colors hover:border-[#C69C6D] lg:flex-row-reverse">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F8F7F4]">
                      <Check className="h-3.5 w-3.5 text-[#1F3D35]" />
                    </div>
                    <span className="font-semibold text-[#6B716D]">Kamar Mandi Dalam & AC</span>
                  </li>
                  <li className="flex w-fit items-center gap-3 rounded-xl border border-[#E5E3DE] bg-white px-4 py-2.5 shadow-sm transition-colors hover:border-[#C69C6D] lg:flex-row-reverse">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F8F7F4]">
                      <Check className="h-3.5 w-3.5 text-[#1F3D35]" />
                    </div>
                    <span className="font-semibold text-[#6B716D]">Kasur Springbed & Meja Kerja</span>
                  </li>
                  <li className="flex w-fit items-center gap-3 rounded-xl border border-[#E5E3DE] bg-white px-4 py-2.5 shadow-sm transition-colors hover:border-[#C69C6D] lg:flex-row-reverse">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F8F7F4]">
                      <Check className="h-3.5 w-3.5 text-[#1F3D35]" />
                    </div>
                    <span className="font-semibold text-[#6B716D]">Koneksi WiFi Gratis</span>
                  </li>
                </ul>
              </div>

            </div>
          </Reveal>
          
        </div>
        
        {/* Tombol Lihat Semua Kamar */}
        <Reveal>
          <div className="mt-20 flex justify-center">
            <Link 
              href="/kamar" 
              className="inline-flex items-center justify-center rounded-[10px] bg-[#1F3D35] px-[28px] py-[14px] text-[15px] font-semibold text-white transition-all duration-300 hover:bg-[#162E28] hover:text-[#C69C6D] hover:shadow-[0_8px_20px_rgba(31,61,53,0.3)]"
            >
              Lihat Seluruh Tipe Kamar
            </Link>
          </div>
        </Reveal>

      </div>
    </section>
  );
}