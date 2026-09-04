"use client";

import Image from "next/image";
import Link from "next/link";
import { BedDouble, CheckCircle2, XCircle } from "lucide-react";
import type { Room } from "@/data/rooms";

interface RoomCardProps {
  room: Room;
  index: number;
}

export default function RoomCard({ room, index }: RoomCardProps) {
  const isAvailable = room.status === "AVAILABLE";

  return (
    <div 
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-[#E5E3DE]/50 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] animate-fade-in-up"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Mac OS Window Header */}
      <div className="flex items-center gap-2 border-b border-[#E5E3DE] bg-[#F8F7F4] px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-[#FF5F56]"></div>
        <div className="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
        <div className="h-3 w-3 rounded-full bg-[#27C93F]"></div>
      </div>

      {/* Bagian Gambar (Atas) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <Image
          src={room.images[0]}
          alt={room.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Status Badge */}
        <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold backdrop-blur-md">
          {isAvailable ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
              <span className="text-green-700">Tersedia</span>
            </>
          ) : (
            <>
              <XCircle className="h-3.5 w-3.5 text-gray-500" />
              <span className="text-gray-600">Penuh</span>
            </>
          )}
        </div>
      </div>

      {/* Bagian Konten (Bawah) */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tight text-[#202321]">
            {room.name}
          </h3>
        </div>
        
        <p className="mb-4 text-sm text-[#6B716D] line-clamp-2">
          {room.description}
        </p>

        {/* Fasilitas Utama (Icon bar) */}
        <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#6B716D]">
          <div className="flex items-center gap-1.5">
            <BedDouble className="h-4 w-4 text-[#C69C6D]" />
            <span className="truncate max-w-[120px]">{room.facilities[0]}</span>
          </div>
          {room.facilities.length > 1 && (
            <div className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F8F7F4] text-[10px] font-bold text-[#1F3D35]">
                +{room.facilities.length - 1}
              </span>
              <span className="text-xs">Fasilitas Lain</span>
            </div>
          )}
        </div>

        {/* Harga & Tombol (Bawah) */}
        <div className="mt-auto flex items-center justify-between border-t border-[#E5E3DE]/50 pt-5">
          <div>
            <p className="text-xs font-medium text-[#6B716D]">Mulai dari</p>
            <p className="text-lg font-bold text-[#1F3D35]">
              Rp {room.price.toLocaleString("id-ID")} <span className="text-xs font-normal text-[#6B716D]">/bln</span>
            </p>
          </div>
          
          <Link 
            href={`/kamar/${room.slug}`}
            className="flex items-center justify-center rounded-xl bg-[#F8F7F4] px-4 py-2.5 text-sm font-semibold text-[#1F3D35] transition-colors duration-300 group-hover:bg-[#1F3D35] group-hover:text-white"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
