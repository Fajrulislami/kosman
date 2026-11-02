"use client";

import Image from "next/image";
import Link from "next/link";
import { Bed, Wifi, ShieldCheck, Sparkles, Utensils } from "lucide-react";
import { useState, useRef } from "react";

/* 
  =========================================
  KOMPONEN SUB: Kapsul yang Bisa Digeser (Draggable Pill)
  Murni menggunakan React Pointer Events agar tidak perlu library eksternal.
  =========================================
*/
const DraggablePill = ({
  children,
  initialPositionClass,
  rotationClass,
}: {
  children: React.ReactNode;
  initialPositionClass: string;
  rotationClass: string;
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = true;
    startPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    setPosition({
      x: e.clientX - startPos.current.x,
      y: e.clientY - startPos.current.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      className={`absolute z-30 hidden touch-none md:block ${initialPositionClass}`}
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        className={`flex cursor-grab items-center gap-2 rounded-full border border-white/60 bg-white/85 px-5 py-2.5 shadow-lg backdrop-blur-md transition-transform duration-300 active:cursor-grabbing hover:scale-110 hover:border-[#C69C6D] hover:bg-white ${rotationClass}`}
      >
        {children}
      </div>
    </div>
  );
};


/* 
  =========================================
  KOMPONEN UTAMA: HERO SECTION
  =========================================
*/
export default function Hero() {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F8F7F4] pt-28 md:pt-20">
      
      {/* Pola Titik Latar Belakang */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E3DE_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>

      {/* 
        =========================================
        FLOATING ELEMENTS: GAMBAR ASLI KOS
        Posisinya didorong ke pinggir (2% hingga 8%) agar aman dari teks.
        =========================================
      */}
      <div className="pointer-events-none absolute inset-0 z-10">
        
        {/* Gambar Kiri Atas - Kamar & Kasur Asli */}
        <div className="pointer-events-auto absolute left-[2%] top-20 hidden w-40 -rotate-6 cursor-pointer overflow-hidden rounded-2xl border-4 border-white/90 bg-white shadow-xl backdrop-blur-sm transition-all duration-500 ease-out hover:z-40 hover:rotate-0 hover:scale-110 hover:border-white hover:shadow-2xl md:block md:w-48 lg:left-[5%] xl:left-[8%]">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E5E3DE]">
            <Image
              src="/images/kamar-kasur.jpg"
              alt="Kasur Kamar Kos Putri"
              fill
              className="object-cover transition-transform duration-700 ease-out hover:scale-105"
              sizes="200px"
            />
          </div>
        </div>

        {/* Gambar Kanan Atas - Gedung Depan / Fasad Asli */}
        <div className="pointer-events-auto absolute right-[2%] top-24 hidden w-44 rotate-3 cursor-pointer overflow-hidden rounded-2xl border-4 border-white/90 bg-white shadow-xl backdrop-blur-sm transition-all duration-500 ease-out hover:z-40 hover:rotate-0 hover:scale-110 hover:border-white hover:shadow-2xl md:block md:w-56 lg:right-[5%] xl:right-[8%]">
          <div className="relative aspect-[3/2] w-full overflow-hidden bg-[#E5E3DE]">
            <Image
              src="/images/gedung-depan.jpg"
              alt="Fasad Tampak Depan Pondok Rahmat"
              fill
              className="object-cover transition-transform duration-700 ease-out hover:scale-105"
              sizes="250px"
            />
          </div>
        </div>

        {/* Gambar Kiri Bawah - Lorong Kos Bersih & Aman */}
        <div className="pointer-events-auto absolute bottom-12 left-[3%] hidden w-44 -rotate-3 cursor-pointer overflow-hidden rounded-2xl border-4 border-white/90 bg-white shadow-xl backdrop-blur-sm transition-all duration-500 ease-out hover:z-40 hover:rotate-0 hover:scale-110 hover:border-white hover:shadow-2xl md:block md:w-52 lg:left-[8%] xl:left-[12%]">
          <div className="relative aspect-[3/2] w-full overflow-hidden bg-[#E5E3DE]">
            <Image
              src="/images/lorong-kos.jpg"
              alt="Lorong Bersih & Rapi Pondok Rahmat"
              fill
              className="object-cover transition-transform duration-700 ease-out hover:scale-105"
              sizes="220px"
            />
          </div>
        </div>

        {/* Gambar Kanan Bawah - Kamar Mandi Dalam & Kamar */}
        <div className="pointer-events-auto absolute bottom-20 right-[3%] hidden w-40 rotate-6 cursor-pointer overflow-hidden rounded-2xl border-4 border-white/90 bg-white shadow-xl backdrop-blur-sm transition-all duration-500 ease-out hover:z-40 hover:rotate-0 hover:scale-110 hover:border-white hover:shadow-2xl md:block md:w-48 lg:right-[10%] xl:right-[15%]">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E5E3DE]">
            <Image
              src="/images/kamar-standar-1.jpg"
              alt="Kamar Mandi Dalam Pondok Rahmat"
              fill
              className="object-cover transition-transform duration-700 ease-out hover:scale-105"
              sizes="200px"
            />
          </div>
        </div>
      </div>

      {/* 
        =========================================
        KONTEN UTAMA (Tengah)
        =========================================
      */}
      <div className="relative z-20 mx-auto max-w-2xl px-6 text-center">
        
        {/* Badge Identitas: Kost Putri Samata */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E5E3DE] bg-white px-4 py-1.5 shadow-sm">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[12px] font-bold tracking-[0.2em] text-[#C69C6D]">
            KOST KHUSUS PUTRI &bull; SAMATA GOWA
          </span>
        </div>

        <h1 className="mb-6 text-[36px] font-bold leading-[1.1] tracking-tight text-[#202321] md:text-[56px]">
          Temukan Tempat Tinggal <br className="hidden md:block" />
          yang Nyaman untukmu.
        </h1>

        <p className="mx-auto mb-10 max-w-lg text-[16px] leading-[1.7] text-[#6B716D]">
          Hunian tenang, bersih, dan aman khusus mahasiswi & putri di samping kampus II UIN Samata (dekat Pintu II). Fasilitas kamar mandi dalam, kasur, dapur umum, WiFi, dan CCTV 24 jam.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link 
            href="/kamar" 
            className="flex w-full items-center justify-center rounded-[10px] bg-[#1F3D35] px-[22px] py-[14px] text-[14px] font-semibold text-white transition-all duration-300 hover:bg-[#162E28] hover:text-[#C69C6D] hover:shadow-[0_8px_20px_rgba(31,61,53,0.3)] sm:w-auto"
          >
            Lihat Pilihan Kamar
          </Link>
          <Link 
            href="/kontak" 
            className="flex w-full items-center justify-center rounded-[10px] border border-[#1F3D35] bg-transparent px-[22px] py-[14px] text-[14px] font-semibold text-[#1F3D35] transition-all duration-300 hover:bg-[#1F3D35] hover:text-white hover:shadow-[0_8px_20px_rgba(31,61,53,0.2)] sm:w-auto"
          >
            Hubungi Pengelola
          </Link>
        </div>

        {/* Mobile-Only Visual Card */}
        <div className="mt-10 flex w-full max-w-sm flex-col items-center md:hidden">
          <div className="w-full overflow-hidden rounded-[20px] border border-[#E5E3DE] bg-white shadow-lg">
            <div className="flex items-center gap-2 border-b border-[#E5E3DE] bg-[#F8F7F4] px-4 py-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-[#27C93F]"></div>
              <span className="ml-2 text-xs font-mono text-[#99A09C]">pondokrahmat.id</span>
            </div>
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#E5E3DE]">
              <Image
                src="/images/gedung-depan.jpg"
                alt="Fasad Gedung Pondok Rahmat"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 380px"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full border border-[#E5E3DE] bg-white px-3 py-1.5 shadow-sm">
              <Bed className="h-3.5 w-3.5 text-[#C69C6D]" />
              <span className="text-[12px] font-semibold text-[#6B716D]">KM Dalam & Kasur</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-[#E5E3DE] bg-white px-3 py-1.5 shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-[#C69C6D]" />
              <span className="text-[12px] font-semibold text-[#6B716D]">CCTV 24 Jam</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-[#E5E3DE] bg-white px-3 py-1.5 shadow-sm">
              <Wifi className="h-3.5 w-3.5 text-[#C69C6D]" />
              <span className="text-[12px] font-semibold text-[#6B716D]">WiFi</span>
            </div>
          </div>
        </div>
      </div>

      {/* 
        =========================================
        DRAGGABLE PILLS (Kapsul Interaktif)
        =========================================
      */}
      <DraggablePill initialPositionClass="left-[8%] top-[30%] lg:left-[14%]" rotationClass="rotate-12">
        <Bed className="h-4 w-4 text-[#C69C6D]" />
        <span className="pointer-events-none text-[13px] font-bold text-[#6B716D]">Kamar Mandi Dalam</span>
      </DraggablePill>

      <DraggablePill initialPositionClass="right-[6%] top-[50%] lg:right-[12%]" rotationClass="-rotate-6">
        <ShieldCheck className="h-4 w-4 text-[#C69C6D]" />
        <span className="pointer-events-none text-[13px] font-bold text-[#6B716D]">CCTV 24 Jam</span>
      </DraggablePill>

      <DraggablePill initialPositionClass="left-[15%] bottom-[20%] lg:left-[22%]" rotationClass="-rotate-12">
        <Wifi className="h-4 w-4 text-[#C69C6D]" />
        <span className="pointer-events-none text-[13px] font-bold text-[#6B716D]">Free WiFi</span>
      </DraggablePill>

    </section>
  );
}
