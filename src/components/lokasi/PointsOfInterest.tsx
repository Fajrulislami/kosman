"use client";

import React, { useEffect, useRef, useState } from "react";
import { BookOpen, Coffee, ShoppingBag, TrainFront, Stethoscope, Briefcase } from "lucide-react";

const pois = [
  {
    category: "Pendidikan",
    icon: BookOpen,
    items: [
      { name: "Universitas Indonesia (UI) Salemba", distance: "1.2 km", time: "5 Menit" },
      { name: "Universitas Y.A.I", distance: "800 m", time: "3 Menit" },
      { name: "Universitas Gunadarma", distance: "1.5 km", time: "7 Menit" }
    ]
  },
  {
    category: "Transportasi Umum",
    icon: TrainFront,
    items: [
      { name: "Stasiun KRL Cikini", distance: "500 m", time: "2 Menit" },
      { name: "Halte TransJakarta Salemba", distance: "800 m", time: "3 Menit" },
      { name: "Stasiun MRT Bundaran HI", distance: "3.5 km", time: "10 Menit" }
    ]
  },
  {
    category: "Gaya Hidup & Belanja",
    icon: ShoppingBag,
    items: [
      { name: "Grand Indonesia", distance: "4.0 km", time: "12 Menit" },
      { name: "Plaza Indonesia", distance: "4.2 km", time: "15 Menit" },
      { name: "Metropole XXI", distance: "1.0 km", time: "4 Menit" }
    ]
  },
  {
    category: "Kuliner & Hiburan",
    icon: Coffee,
    items: [
      { name: "Jalan Sabang (Pusat Kuliner)", distance: "3.0 km", time: "10 Menit" },
      { name: "Cikini Raya (Cafe & Resto)", distance: "1.0 km", time: "4 Menit" },
      { name: "Menteng Wok", distance: "2.5 km", time: "8 Menit" }
    ]
  },
  {
    category: "Kesehatan",
    icon: Stethoscope,
    items: [
      { name: "RSCM (RS Cipto Mangunkusumo)", distance: "1.5 km", time: "6 Menit" },
      { name: "RS St. Carolus", distance: "2.0 km", time: "8 Menit" },
      { name: "Apotek Kimia Farma 24 Jam", distance: "500 m", time: "2 Menit" }
    ]
  },
  {
    category: "Pusat Perkantoran",
    icon: Briefcase,
    items: [
      { name: "CBD Sudirman", distance: "5.5 km", time: "18 Menit" },
      { name: "Thamrin City/Office", distance: "4.5 km", time: "15 Menit" },
      { name: "Kuningan Rasuna Said", distance: "6.0 km", time: "20 Menit" }
    ]
  }
];

const PoiCard = ({ poi, index, isVisible }: { poi: any; index: number; isVisible: boolean }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-2xl border border-[#E5E3DE] bg-white p-6 shadow-sm transition-all duration-700 ease-out hover:shadow-lg hover:border-[#C69C6D]/30 hover:-translate-y-1 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      }`}
      style={{ transitionDelay: isVisible ? `${index * 100}ms` : "0ms" }}
    >
      {/* Spotlight effect */}
      <div
        className="pointer-events-none absolute -inset-px transition duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(198, 156, 109, 0.12), transparent 40%)`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8F7F4]">
            <poi.icon className="h-6 w-6 text-[#1F3D35]" />
          </div>
          <h3 className="text-xl font-bold text-[#202321]">{poi.category}</h3>
        </div>
        
        <ul className="space-y-4">
          {poi.items.map((item: any, idx: number) => (
            <li key={idx} className="flex justify-between items-start border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <span className="text-[15px] font-medium text-[#202321] pr-4">{item.name}</span>
              <div className="flex flex-col items-end shrink-0">
                <span className="text-[13px] font-bold text-[#C69C6D]">{item.time}</span>
                <span className="text-[12px] text-[#6B716D]">{item.distance}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default function PointsOfInterest() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full bg-transparent py-20 md:py-28 relative" ref={ref}>
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <div className={`mb-16 text-center max-w-2xl mx-auto transition-all duration-1000 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}>
          <h2 className="text-3xl md:text-[40px] font-bold text-[#1F3D35] leading-[1.2]">
            Segalanya Dalam Jangkauan
          </h2>
          <p className="mt-6 text-lg text-[#6B716D] leading-relaxed">
            Tidak perlu menghabiskan banyak waktu di jalan. Berbagai kebutuhan utama Anda dapat diakses dengan cepat dari Pondok Rahmat.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pois.map((poi, index) => (
            <PoiCard key={index} poi={poi} index={index} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}
