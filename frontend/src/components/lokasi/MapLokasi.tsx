"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useProperty } from "@/context/PropertyContext";

export default function MapLokasi() {
  const { profile } = useProperty();
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
          <p className="mt-3 text-base text-[#6B716D] max-w-xl">
            Pondok Rahmat berlokasi di kawasan strategis Samata, Romangpolong, Gowa — sangat dekat dengan Kampus II UIN Alauddin Makassar.
          </p>
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
              <MapPin className="h-3.5 w-3.5 text-[#C69C6D]" />
              <span>{profile.name || "Pondok Rahmat"} Samata - Gowa, Sulawesi Selatan</span>
            </div>
            <a
              href={profile.mapsUrl || "https://maps.app.goo.gl/mHwa7ppvN4231RZz5?g_st=aw"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[12px] font-semibold text-[#1F3D35] transition-colors hover:text-[#C69C6D]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Buka Maps</span>
            </a>
          </div>

          <div className="relative aspect-video w-full md:aspect-[21/9]">
            <iframe
              src="https://maps.google.com/maps?q=Pondok+Rahmat+Samata,+Romangpolong,+Gowa&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
              title="Peta Lokasi Pondok Rahmat Samata"
            ></iframe>
          </div>

          {/* Bottom Location Details Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#E5E3DE] bg-[#F8F7F4] p-5">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-[#C69C6D] mt-0.5" />
              <div className="text-left">
                <p className="text-[14px] font-bold text-[#1F3D35]">{profile.name || "Pondok Rahmat"} Samata</p>
                <p className="text-[13px] text-[#6B716D]">
                  {profile.address || "Romangpolong, Kec. Somba Opu, Kabupaten Gowa, Sulawesi Selatan 92113"}
                </p>
              </div>
            </div>
            <a
              href={profile.mapsUrl || "https://maps.app.goo.gl/mHwa7ppvN4231RZz5?g_st=aw"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F3D35] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition-all duration-300 hover:bg-[#162E28] hover:text-[#C69C6D] hover:shadow-md shrink-0"
            >
              <span>Petunjuk Arah Google Maps</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
