"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

export default function MapLokasi() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full bg-transparent py-16 md:py-24" ref={ref}>
      <div className={`mx-auto w-full max-w-[1200px] px-6 transition-all duration-1000 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}`}>
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E3DE] bg-[#F8F7F4] px-4 py-1.5 shadow-sm">
            <MapPin className="h-4 w-4 text-[#C69C6D]" />
            <span className="text-[12px] font-bold tracking-widest text-[#1F3D35] uppercase">Peta Lokasi</span>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-[#202321] md:text-[40px] leading-[1.2]">
            Kunjungi Kami Secara Langsung
          </h2>
        </div>

        {/* Map Container */}
        <div className="relative w-full overflow-hidden rounded-[24px] border border-[#E5E3DE] bg-gray-100 shadow-[0_20px_60px_rgba(31,61,53,0.06)]">
          
          {/* Top Bar macOS Style */}
          <div className="flex items-center justify-between border-b border-[#E5E3DE] bg-[#F8F7F4] px-5 py-3.5 relative z-10">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#FF5F56]"></div>
              <div className="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
              <div className="h-3 w-3 rounded-full bg-[#27C93F]"></div>
            </div>
            <div className="flex items-center gap-2 text-[12px] font-semibold text-[#6B716D]">
              <span>maps.google.com</span>
            </div>
            <div className="w-12"></div> {/* Spacer for centering */}
          </div>

          <div className="relative aspect-video w-full md:aspect-[21/9]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.24075196162!2d106.7594778150499!3d-6.229740112469956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x100c5e82dd4b820!2sJakarta%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            ></iframe>
          </div>

        </div>
      </div>
    </section>
  );
}
