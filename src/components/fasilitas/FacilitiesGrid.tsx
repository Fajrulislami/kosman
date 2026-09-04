"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { facilities } from "@/data/facilities";
import { PanelLeft } from "lucide-react";

// Sub-komponen agar setiap item memiliki state animasi (IntersectionObserver) masing-masing
function FacilityCard({ 
  facility, 
  index 
}: { 
  facility: typeof facilities[0], 
  index: number 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  const isReversed = index % 2 !== 0;
  const Icon = facility.icon;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 } // Animasi terpicu saat 20% elemen masuk layar
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref}
      className={`flex flex-col gap-8 md:gap-16 items-center transition-all duration-1000 ease-out ${
        isReversed ? "md:flex-row-reverse" : "md:flex-row"
      } ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      }`}
    >
      {/* Image Section (macOS Window Style) */}
      <div className="w-full md:w-1/2 relative">
        <div className="relative w-full overflow-hidden rounded-[20px] border border-[#E5E3DE] bg-white shadow-[0_20px_60px_rgba(31,61,53,0.06)] group">
          
          {/* Top Bar macOS */}
          <div className="flex shrink-0 items-center justify-between border-b border-[#E5E3DE] bg-[#F8F7F4] px-4 py-3 relative z-10">
            {/* Tombol macOS (Merah, Kuning, Hijau) */}
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#FF5F56]"></div>
              <div className="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
              <div className="h-3 w-3 rounded-full bg-[#27C93F]"></div>
            </div>
            
            <div className="flex items-center gap-2 text-[#6B716D] opacity-80">
              <PanelLeft className="h-3.5 w-3.5" strokeWidth={2} />
              <span className="text-[10px] font-extrabold tracking-widest uppercase">
                {facility.id}
              </span>
            </div>
          </div>

          {/* Image Container */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
            <Image
              src={facility.image}
              alt={facility.title}
              fill
              className="object-cover transition-transform duration-1000 ease-in-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Subtle overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Text Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6">
        <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F7F4] text-[#1F3D35] shadow-sm mb-2 transition-all duration-700 delay-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
          <Icon className="h-6 w-6" />
        </div>
        
        <h2 className="text-3xl md:text-[40px] font-bold text-[#202321] leading-[1.2]">
          {facility.title}
        </h2>
        
        <p className="text-lg text-[#6B716D] leading-[1.7] max-w-lg">
          {facility.description}
        </p>
      </div>
    </div>
  );
}

export default function FacilitiesGrid() {
  return (
    <section className="w-full bg-[#FFFFFF] py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-6 space-y-24 md:space-y-32">
        {facilities.map((facility, index) => (
          <FacilityCard key={facility.id} facility={facility} index={index} />
        ))}
      </div>
    </section>
  );
}
