"use client";

import { useState, useRef } from "react";
import { CheckCircle2, MessageSquare } from "lucide-react";
import type { Room } from "@/data/rooms";

interface BookingStickyProps {
  room: Room;
}

export default function BookingSticky({ room }: BookingStickyProps) {
  const isAvailable = room.status === "AVAILABLE";
  
  // State untuk efek Magnetic Button
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!buttonRef.current) return;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Bergerak max 15px dari titik tengah untuk efek subtle
    const maxMove = 15;
    const moveX = ((e.clientX - centerX) / (width / 2)) * maxMove;
    const moveY = ((e.clientY - centerY) / (height / 2)) * maxMove;
    
    setPosition({ x: moveX, y: moveY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const whatsappMessage = encodeURIComponent(`Halo, saya tertarik untuk menyewa ${room.name}. Apakah masih tersedia?`);
  const whatsappNumber = "6281234567890"; // Ganti dengan nomor asli
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="sticky top-24 rounded-3xl border border-[#E5E3DE]/50 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      
      {/* Harga */}
      <div className="mb-6">
        <p className="text-sm font-medium text-[#6B716D]">Harga Sewa</p>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-3xl font-bold tracking-tight text-[#202321]">
            Rp {room.price.toLocaleString("id-ID")}
          </span>
          <span className="text-[#6B716D]">/ bulan</span>
        </div>
      </div>

      {/* Ketersediaan */}
      <div className="mb-8 rounded-2xl bg-[#F8F7F4] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
            {isAvailable ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <div className="h-2 w-2 rounded-full bg-gray-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-[#202321]">
              {isAvailable ? "Tersedia" : "Penuh"}
            </p>
            <p className="text-xs text-[#6B716D]">
              {isAvailable ? "Kamar siap dihuni bulan ini" : "Silakan tanya admin untuk waiting list"}
            </p>
          </div>
        </div>
      </div>

      {/* Magnetic CTA Button */}
      {isAvailable ? (
        <a
          ref={buttonRef}
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1F3D35] px-6 py-4 font-semibold text-white transition-all duration-300 ease-out hover:bg-[#162E28] hover:shadow-[0_8px_20px_rgba(31,61,53,0.3)]"
          style={{ 
            transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
            transition: position.x === 0 ? "transform 0.5s ease-out" : "none" 
          }}
        >
          <MessageSquare className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          Tanya Admin
        </a>
      ) : (
        <button
          disabled
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-gray-200 px-6 py-4 font-semibold text-gray-500"
        >
          Kamar Penuh
        </button>
      )}

      <p className="mt-4 text-center text-xs text-[#6B716D]">
        Pemesanan via WhatsApp tidak mengikat
      </p>
    </div>
  );
}
