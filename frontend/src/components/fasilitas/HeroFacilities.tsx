"use client";

import React, { useEffect, useRef, useState } from "react";
import { Wifi, Coffee, Dumbbell, ShieldCheck, CarFront, UtensilsCrossed } from "lucide-react";

/* 
  =========================================
  KOMPONEN SUB: FLOATING ICON
  =========================================
*/
const FloatingIcon = ({
  icon: Icon,
  className,
  animationClass
}: {
  icon: any,
  className: string,
  animationClass: string
}) => {
  return (
    <div className={`absolute pointer-events-none ${animationClass} ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/60 bg-white/80 text-[#1F3D35] shadow-lg backdrop-blur-md sm:h-16 sm:w-16">
        <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-[#C69C6D]" />
      </div>
    </div>
  );
};

export default function HeroFacilities() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true); // Langsung trigger saat mount karena ini Hero (selalu di atas)
  }, []);

  return (
    <section className="relative w-full bg-[#F8F7F4] pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden min-h-[70vh] md:min-h-[80vh] flex flex-col justify-center">
      {/* Pola Titik Latar Belakang (Dot Grid) */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#E5E3DE_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>

      {/* STYLE CSS ANIMASI MELAYANG */}
      <style>{`
        @keyframes float-icon-1 {
          0% { transform: translateY(0px) rotate(-5deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(-5deg); }
        }
        @keyframes float-icon-2 {
          0% { transform: translateY(0px) rotate(10deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
          100% { transform: translateY(0px) rotate(10deg); }
        }
        @keyframes float-icon-3 {
          0% { transform: translateY(0px) rotate(-15deg) scale(0.9); }
          50% { transform: translateY(20px) rotate(0deg) scale(0.9); }
          100% { transform: translateY(0px) rotate(-15deg) scale(0.9); }
        }

        .animate-float-icon-1 { animation: float-icon-1 6s ease-in-out infinite; }
        .animate-float-icon-2 { animation: float-icon-2 8s ease-in-out infinite both; }
        .animate-float-icon-3 { animation: float-icon-3 7s ease-in-out infinite both; }
      `}</style>

      {/* 
        AREA ICON MELAYANG
      */}
      <div className="absolute inset-0 z-10 mx-auto flex w-full max-w-[1100px] items-center justify-center overflow-hidden pointer-events-none">
        <div className="relative h-full w-full">
          <FloatingIcon icon={Wifi} animationClass="animate-float-icon-1" className="left-[5%] top-[15%] blur-[1px] md:left-[15%] md:top-[20%]" />
          <FloatingIcon icon={Coffee} animationClass="animate-float-icon-2" className="bottom-[10%] left-[10%] md:bottom-[20%] md:left-[20%]" />
          <FloatingIcon icon={Dumbbell} animationClass="animate-float-icon-1" className="right-[10%] top-[20%] md:right-[20%] md:top-[25%]" />
          <FloatingIcon icon={CarFront} animationClass="animate-float-icon-3" className="bottom-[15%] right-[5%] blur-[1px] md:bottom-[25%] md:right-[15%]" />
          <FloatingIcon icon={ShieldCheck} animationClass="animate-float-icon-3" className="left-[-2%] top-[45%] opacity-40 md:left-[2%]" />
          <FloatingIcon icon={UtensilsCrossed} animationClass="animate-float-icon-2" className="right-[-2%] top-[40%] opacity-40 md:right-[5%]" />
        </div>
      </div>

      <div className="relative z-20 mx-auto w-full max-w-[1200px] px-6">
        <div
          ref={ref}
          className={`flex flex-col items-center text-center max-w-3xl mx-auto space-y-6 transition-all duration-1000 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
            }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E3DE] bg-white px-4 py-1.5 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#C69C6D] animate-pulse"></span>
            <span className="text-[12px] font-extrabold tracking-widest text-[#C69C6D] uppercase">Fasilitas Premium</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-[#202321] md:text-5xl lg:text-[64px] leading-[1.1]">
            Kenyamanan Ekstra,{" "}
            <span className="text-[#1F3D35] block mt-2">Untuk Hidup Maksimal</span>
          </h1>

          <p className="text-base md:text-lg text-[#6B716D] leading-relaxed max-w-2xl delay-300 transition-all duration-1000">
            Dari dapur modern hingga ruang santai yang hangat, setiap fasilitas kami rancang secara teliti untuk mendukung produktivitas dan kualitas istirahat Anda setiap hari.
          </p>
        </div>
      </div>

      {/* Decorative Blur */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/60 blur-[100px] rounded-[100%] pointer-events-none z-0 transition-all duration-1500 delay-500 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
      />
    </section>
  );
}
