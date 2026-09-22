"use client";

import Image from "next/image";
import Link from "next/link";
import { Bed, Wifi, Car } from "lucide-react";
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
        className={`flex cursor-grab items-center gap-2 rounded-full border border-white/60 bg-white/80 px-5 py-2.5 shadow-lg backdrop-blur-md transition-transform duration-300 active:cursor-grabbing hover:scale-110 hover:border-[#C69C6D] hover:bg-white ${rotationClass}`}
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
<<<<<<< HEAD
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F8F7F4] pt-20">
=======
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F8F7F4] pt-28 md:pt-20">
>>>>>>> development
      
      {/* Pola Titik Latar Belakang */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E3DE_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>

      {/* 
        =========================================
        FLOATING ELEMENTS: GAMBAR
        Posisinya didorong jauh ke pinggir (2% hingga 8%) agar aman dari teks.
        =========================================
      */}
      <div className="pointer-events-none absolute inset-0 z-10">
        
        {/* Gambar Kiri Atas */}
        <div className="pointer-events-auto absolute left-[2%] top-20 hidden w-40 -rotate-6 cursor-pointer overflow-hidden rounded-2xl border-4 border-white/80 bg-white/50 shadow-xl backdrop-blur-sm transition-all duration-500 ease-out hover:z-40 hover:rotate-0 hover:scale-110 hover:border-white hover:bg-white md:block md:w-48 lg:left-[5%] xl:left-[8%]">
          <div className="aspect-[4/3] w-full bg-[#E5E3DE]"></div>
        </div>

        {/* Gambar Kanan Atas */}
        <div className="pointer-events-auto absolute right-[2%] top-24 hidden w-44 rotate-3 cursor-pointer overflow-hidden rounded-2xl border-4 border-white/80 bg-white/50 shadow-xl backdrop-blur-sm transition-all duration-500 ease-out hover:z-40 hover:rotate-0 hover:scale-110 hover:border-white hover:bg-white md:block md:w-56 lg:right-[5%] xl:right-[8%]">
          <div className="aspect-[3/2] w-full bg-[#E5E3DE]"></div>
        </div>

        {/* Gambar Kiri Bawah */}
        <div className="pointer-events-auto absolute bottom-12 left-[3%] hidden w-44 -rotate-3 cursor-pointer overflow-hidden rounded-2xl border-4 border-white/80 bg-white/50 shadow-xl backdrop-blur-sm transition-all duration-500 ease-out hover:z-40 hover:rotate-0 hover:scale-110 hover:border-white hover:bg-white md:block md:w-52 lg:left-[8%] xl:left-[12%]">
          <div className="aspect-[3/2] w-full bg-[#E5E3DE]"></div>
        </div>

        {/* Gambar Kanan Bawah */}
        <div className="pointer-events-auto absolute bottom-20 right-[3%] hidden w-40 rotate-6 cursor-pointer overflow-hidden rounded-2xl border-4 border-white/80 bg-white/50 shadow-xl backdrop-blur-sm transition-all duration-500 ease-out hover:z-40 hover:rotate-0 hover:scale-110 hover:border-white hover:bg-white md:block md:w-48 lg:right-[10%] xl:right-[15%]">
          <div className="aspect-[4/3] w-full bg-[#E5E3DE]"></div>
        </div>
      </div>

      {/* 
        =========================================
        KONTEN UTAMA (Tengah)
        Diberikan z-20 agar PASTI berada di atas gambar, sehingga deskripsi tidak akan tertimpa lagi.
        =========================================
      */}
      <div className="relative z-20 mx-auto max-w-2xl px-6 text-center">
        
        <div className="mb-6 inline-flex items-center rounded-full border border-[#E5E3DE] bg-white px-4 py-1.5 shadow-sm">
          <span className="text-[12px] font-bold tracking-[0.2em] text-[#C69C6D]">
            NYAMAN &bull; STRATEGIS &bull; AMAN
          </span>
        </div>

        <h1 className="mb-6 text-[36px] font-bold leading-[1.1] tracking-tight text-[#202321] md:text-[56px]">
          Temukan Tempat Tinggal <br className="hidden md:block" />
          yang Nyaman untukmu.
        </h1>

        <p className="mx-auto mb-10 max-w-lg text-[16px] leading-[1.7] text-[#6B716D]">
          Hunian modern dengan fasilitas lengkap dan lokasi strategis untuk mendukung aktivitas sehari-hari.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link 
            href="/kamar" 
            className="flex w-full items-center justify-center rounded-[10px] bg-[#1F3D35] px-[22px] py-[14px] text-[14px] font-semibold text-white transition-all duration-300 hover:bg-[#162E28] hover:text-[#C69C6D] hover:shadow-[0_8px_20px_rgba(31,61,53,0.3)] sm:w-auto"
          >
            Lihat Kamar
          </Link>
          <Link 
            href="/kontak" 
            className="flex w-full items-center justify-center rounded-[10px] border border-[#1F3D35] bg-transparent px-[22px] py-[14px] text-[14px] font-semibold text-[#1F3D35] transition-all duration-300 hover:bg-[#1F3D35] hover:text-white hover:shadow-[0_8px_20px_rgba(31,61,53,0.2)] sm:w-auto"
          >
            Hubungi Admin
          </Link>
        </div>
<<<<<<< HEAD
=======

        {/* Mobile-Only Visual Card */}
        <div className="mt-10 flex w-full max-w-sm flex-col items-center md:hidden">
          <div className="w-full overflow-hidden rounded-[20px] border border-[#E5E3DE] bg-white shadow-lg">
            <div className="flex items-center gap-2 border-b border-[#E5E3DE] bg-[#F8F7F4] px-4 py-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-[#27C93F]"></div>
            </div>
            <div className="aspect-[16/9] w-full bg-gradient-to-br from-[#E5E3DE] to-[#D5D3CC]">
              {/* Placeholder untuk gambar hero */}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full border border-[#E5E3DE] bg-white px-3 py-1.5 shadow-sm">
              <Bed className="h-3.5 w-3.5 text-[#C69C6D]" />
              <span className="text-[12px] font-semibold text-[#6B716D]">Furnished</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-[#E5E3DE] bg-white px-3 py-1.5 shadow-sm">
              <Wifi className="h-3.5 w-3.5 text-[#C69C6D]" />
              <span className="text-[12px] font-semibold text-[#6B716D]">WiFi</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-[#E5E3DE] bg-white px-3 py-1.5 shadow-sm">
              <Car className="h-3.5 w-3.5 text-[#C69C6D]" />
              <span className="text-[12px] font-semibold text-[#6B716D]">Parking</span>
            </div>
          </div>
        </div>
>>>>>>> development
      </div>

      {/* 
        =========================================
        DRAGGABLE PILLS (Kapsul Interaktif)
        Bisa diklik, ditahan, dan digeser ke mana saja!
        Posisinya dipastikan jauh dari teks utama pada saat dimuat.
        =========================================
      */}
      <DraggablePill initialPositionClass="left-[8%] top-[30%] lg:left-[14%]" rotationClass="rotate-12">
        <Bed className="h-4 w-4 text-[#C69C6D]" />
        <span className="pointer-events-none text-[13px] font-bold text-[#6B716D]">Fully Furnished</span>
      </DraggablePill>

      <DraggablePill initialPositionClass="right-[6%] top-[50%] lg:right-[12%]" rotationClass="-rotate-6">
        <Car className="h-4 w-4 text-[#C69C6D]" />
        <span className="pointer-events-none text-[13px] font-bold text-[#6B716D]">Luas Parking</span>
      </DraggablePill>

      <DraggablePill initialPositionClass="left-[15%] bottom-[20%] lg:left-[22%]" rotationClass="-rotate-12">
        <Wifi className="h-4 w-4 text-[#C69C6D]" />
        <span className="pointer-events-none text-[13px] font-bold text-[#6B716D]">Free WiFi</span>
      </DraggablePill>

    </section>
  );
}