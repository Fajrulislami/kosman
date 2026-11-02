"use client";

import React, { useEffect, useRef, useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { useProperty } from "@/context/PropertyContext";

const Reveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-700 ease-out h-full ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function ContactInfo() {
  const { profile, waUrl } = useProperty();

  const contactDetails = [
    {
      title: "WhatsApp Pengelola (Rahmat)",
      value: profile.phone || "+62 853-9740-3115",
      description: "Fast response info ketersediaan & jadwal survey",
      icon: Phone,
      link: waUrl("Halo Pak Rahmat, saya ingin bertanya mengenai info kamar dan survey Pondok Rahmat."),
      delay: 100
    },
    {
      title: "WhatsApp Pengelola (Fadiya)",
      value: profile.secondaryPhone || "+62 831-2350-1171",
      description: "Layanan informasi penghuni & administrasi",
      icon: Phone,
      link: "https://wa.me/6283123501171?text=" + encodeURIComponent("Halo Ibu Fadiya, saya ingin bertanya seputar info kamar kos Pondok Rahmat."),
      delay: 200
    },
    {
      title: `Alamat ${profile.name || "Pondok Rahmat"} (Kost Putri)`,
      value: profile.address || "Romangpolong, Samata (Samping UIN Samata dekat Pintu II), Kec. Somba Opu, Kab. Gowa",
      description: "Samping persis Kampus II UIN Alauddin Samata (dekat Pintu II). Sangat strategis untuk mahasiswi.",
      icon: MapPin,
      link: profile.mapsUrl || "https://maps.app.goo.gl/mHwa7ppvN4231RZz5?g_st=aw",
      delay: 300
    }
  ];

  return (
    <div className="flex h-full flex-col gap-6">
      {contactDetails.map((item, index) => {
        const Icon = item.icon;
        
        const content = (
          <div className="flex flex-col p-6 h-full justify-between">
            <div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F7F4] shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                <Icon className="h-5 w-5 text-[#1F3D35] transition-colors duration-300 group-hover:text-[#C69C6D]" />
              </div>
              <h3 className="mb-1 text-[13px] font-semibold tracking-wide text-[#6B716D] uppercase">{item.title}</h3>
              <p className="mb-2 text-xl font-bold tracking-tight text-[#1F3D35]">{item.value}</p>
            </div>
            <p className="text-[13.5px] text-[#6B716D] leading-relaxed">{item.description}</p>
          </div>
        );

        // Gaya Card 3D dengan hover effect
        const containerClass = `group relative overflow-hidden rounded-[24px] border border-[#E5E3DE] bg-white shadow-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-xl hover:border-transparent h-full flex flex-col`;

        return (
          <Reveal key={index} delay={item.delay}>
            {item.link ? (
              <a href={item.link} target="_blank" rel="noopener noreferrer" className={containerClass}>
                {content}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#1F3D35]/0 to-[#1F3D35]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </a>
            ) : (
              <div className={containerClass}>
                {content}
              </div>
            )}
          </Reveal>
        );
      })}
    </div>
  );
}
