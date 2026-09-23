"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles } from "lucide-react";

const Reveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ease-out h-full ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    topic: "Ketersediaan Kamar",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const waNumber = "6281234567890";
    const text = `Halo Pondok Rahmat, saya ${formData.name}.\n\nSaya ingin bertanya mengenai *${formData.topic}*.\n\n${formData.message}`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${waNumber}?text=${encodedText}`, "_blank");
  };

  return (
    <Reveal delay={200}>
      <div className="relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[#E5E3DE] bg-white shadow-xl lg:h-[600px] transition-shadow duration-500 hover:shadow-2xl">
        
        {/* Header Jendela macOS (Estetika Variatif) */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#E5E3DE] bg-[#F8F7F4] px-5 py-4">
          <div className="flex gap-2">
            <div className="h-3.5 w-3.5 rounded-full bg-[#FF5F56] shadow-inner transition-transform hover:scale-110"></div>
            <div className="h-3.5 w-3.5 rounded-full bg-[#FFBD2E] shadow-inner transition-transform hover:scale-110"></div>
            <div className="h-3.5 w-3.5 rounded-full bg-[#27C93F] shadow-inner transition-transform hover:scale-110"></div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6B716D] tracking-widest uppercase">
            <Sparkles className="h-3 w-3" /> Secure Message
          </div>
        </div>

        {/* Form Container */}
        <div className="relative flex-1 p-8 md:p-10 bg-white">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-[#1F3D35]">Kirim Pesan Cepat</h2>
            <p className="mt-2 text-[14.5px] text-[#6B716D]">
              Kami akan membalas pesan Anda langsung melalui WhatsApp.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col h-[calc(100%-80px)] justify-between space-y-5">
            
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="name" className="text-[13px] font-bold text-[#1F3D35] uppercase tracking-wide">Nama Lengkap</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="rounded-xl border border-[#E5E3DE] bg-[#F8F7F4]/50 px-4 py-3.5 text-[15px] text-[#202321] transition-all duration-300 focus:border-[#1F3D35] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F3D35]"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="topic" className="text-[13px] font-bold text-[#1F3D35] uppercase tracking-wide">Topik</label>
                <select
                  id="topic"
                  name="topic"
                  required
                  value={formData.topic}
                  onChange={handleChange}
                  className="rounded-xl border border-[#E5E3DE] bg-[#F8F7F4]/50 px-4 py-3.5 text-[15px] text-[#202321] transition-all duration-300 focus:border-[#1F3D35] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F3D35] appearance-none"
                >
                  <option value="Ketersediaan Kamar">Ketersediaan Kamar</option>
                  <option value="Fasilitas Kost">Fasilitas Kost</option>
                  <option value="Harga & Pembayaran">Harga & Pembayaran</option>
                  <option value="Jadwal Survey">Jadwal Survey</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col space-y-1.5 flex-1">
              <label htmlFor="message" className="text-[13px] font-bold text-[#1F3D35] uppercase tracking-wide">Pesan Anda</label>
              <textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Ceritakan apa yang ingin Anda tanyakan..."
                className="resize-none flex-1 rounded-xl border border-[#E5E3DE] bg-[#F8F7F4]/50 px-4 py-3.5 text-[15px] text-[#202321] transition-all duration-300 focus:border-[#1F3D35] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F3D35]"
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F3D35] px-8 py-4 text-[15px] font-semibold text-white transition-all duration-500 ease-out hover:bg-[#162E28] hover:shadow-[0_8px_20px_rgba(31,61,53,0.3)]"
              >
                Kirim via WhatsApp
                <Send className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </Reveal>
  );
}
