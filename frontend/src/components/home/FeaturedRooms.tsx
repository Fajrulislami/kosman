"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, ArrowRight } from "lucide-react";
import { rooms as initialRooms, type Room } from "@/data/rooms";
import { apiFetch } from "@/lib/api";

const Reveal = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-[800ms] ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      }`}
    >
      {children}
    </div>
  );
};

export default function FeaturedRooms() {
  const [roomList, setRoomList] = useState<Room[]>(initialRooms);

  useEffect(() => {
    let isMounted = true;
    const fetchRooms = async () => {
      try {
        const res = await apiFetch("/api/public/rooms");
        if (res && res.data && isMounted) {
          const formatted: Room[] = res.data.map((r: any) => ({
            id: r.id,
            slug: r.slug,
            name: r.name,
            price: r.price,
            deposit: r.deposit,
            size: r.size,
            status: r.isAvailable ? "AVAILABLE" : "FULL",
            isAvailable: r.isAvailable,
            totalUnits: r.totalUnits,
            availableUnits: r.availableUnits,
            images:
              Array.isArray(r.images) && r.images.length > 0
                ? r.images
                : ["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800"],
            facilities: Array.isArray(r.facilities) ? r.facilities : [],
            description: r.description || "",
          }));
          setRoomList(formatted);
        }
      } catch {
        // Fallback already set
      }
    };

    fetchRooms();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#F8F7F4] pb-24 md:pb-32">
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 25s linear infinite;
        }
      `}</style>

      {/* Pola Titik Latar Belakang */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E3DE_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>

      {/* Running Text Ticker */}
      <div className="relative z-20 flex w-full overflow-hidden bg-[#1F3D35] py-4 shadow-md">
        <div className="animate-ticker flex w-max items-center whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center">
              <span className="mx-8 text-[13px] font-bold tracking-[0.2em] text-[#C69C6D]">KEAMANAN 24 JAM</span>
              <span className="text-white/20">✦</span>
              <span className="mx-8 text-[13px] font-bold tracking-[0.2em] text-[#C69C6D]">FASILITAS LENGKAP</span>
              <span className="text-white/20">✦</span>
              <span className="mx-8 text-[13px] font-bold tracking-[0.2em] text-[#C69C6D]">LOKASI STRATEGIS</span>
              <span className="text-white/20">✦</span>
              <span className="mx-8 text-[13px] font-bold tracking-[0.2em] text-[#C69C6D]">LINGKUNGAN BERSIH</span>
              <span className="text-white/20">✦</span>
              <span className="mx-8 text-[13px] font-bold tracking-[0.2em] text-[#C69C6D]">HARGA TERJANGKAU</span>
              <span className="text-white/20">✦</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-20 max-w-[1200px] px-6">
        {/* Header Section */}
        <Reveal>
          <div className="mb-20 text-center">
            <span className="mb-4 inline-block text-[13px] font-bold tracking-[0.2em] text-[#C69C6D]">
              PILIHAN KAMAR
            </span>
            <h2 className="text-[32px] font-extrabold tracking-tight text-[#1F3D35] md:text-[42px]">
              Temukan Ruang Pribadimu
            </h2>
          </div>
        </Reveal>

        <div className="flex flex-col gap-28 md:gap-36">
          {roomList.slice(0, 3).map((room, index) => {
            const isEven = index % 2 === 0;
            const isAvailable = room.status === "AVAILABLE" || room.isAvailable === true;

            return (
              <Reveal key={room.id}>
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
                  {/* Bagian Konten Teks */}
                  <div className={`flex flex-col items-start ${isEven ? "order-2 lg:order-1" : "order-2 lg:order-2"}`}>
                    <div className="mb-3 flex items-center gap-2">
                      <div className="inline-block rounded-2xl rounded-bl-sm bg-gradient-to-r from-[#1F3D35] to-[#2A5247] px-6 py-2.5 shadow-md">
                        <span className="text-[17px] font-bold text-white">
                          {room.name}
                        </span>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                        isAvailable ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-700"
                      }`}>
                        {isAvailable ? `Tersedia (${room.availableUnits ?? 1} Unit)` : "Penuh"}
                      </span>
                    </div>

                    {/* Chat Bubble Harga */}
                    <div className="mb-6 inline-block rounded-2xl rounded-bl-sm bg-gradient-to-r from-[#C69C6D] to-[#D5A97A] px-5 py-2.5 shadow-md">
                      <span className="text-[15px] font-bold text-white shadow-sm">
                        Rp {room.price.toLocaleString("id-ID")} / bulan {room.size ? `• Ukuran ${room.size}` : ""}
                      </span>
                    </div>

                    <h3 className="mb-2 text-[20px] font-bold text-[#202321]">Fasilitas Utama</h3>
                    <p className="mb-6 max-w-md text-[15px] leading-relaxed text-[#6B716D]">
                      {room.description}
                    </p>

                    {/* Daftar Fasilitas */}
                    <ul className="flex flex-wrap gap-2.5 text-[14px]">
                      {room.facilities.slice(0, 4).map((fac, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 rounded-xl border border-[#E5E3DE] bg-white px-3.5 py-2 shadow-sm"
                        >
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F8F7F4]">
                            <Check className="h-3 w-3 text-[#1F3D35]" />
                          </div>
                          <span className="font-semibold text-[#6B716D] text-xs">{fac}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8">
                      <Link
                        href={`/kamar/${room.slug}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#1F3D35] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#162E28] hover:shadow-lg"
                      >
                        <span>Lihat Spesifikasi & Pesan</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Jendela Foto Kamar */}
                  <div className={`${isEven ? "order-1 lg:order-2" : "order-1 lg:order-1"}`}>
                    <div className="group/img overflow-hidden rounded-[20px] border border-[#E5E3DE] bg-white shadow-xl transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl">
                      <div className="flex items-center gap-2 border-b border-[#E5E3DE] bg-[#F8F7F4] px-4 py-3">
                        <div className="h-3 w-3 rounded-full bg-[#FF5F56]"></div>
                        <div className="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
                        <div className="h-3 w-3 rounded-full bg-[#27C93F]"></div>
                        <span className="ml-2 text-xs font-mono text-[#99A09C] truncate">
                          pondokrahmat.id/kamar/{room.slug}
                        </span>
                      </div>
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E5E3DE]">
                        <Image
                          src={room.images?.[0] || "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800"}
                          alt={room.name}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-700 ease-out group-hover/img:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-[#1F3D35]/0 transition-all duration-500 group-hover/img:bg-[#1F3D35]/40">
                          <Link
                            href={`/kamar/${room.slug}`}
                            className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-[#1F3D35] opacity-0 shadow-lg transition-all duration-500 hover:bg-[#1F3D35] hover:text-white group-hover/img:opacity-100 group-hover/img:translate-y-0 translate-y-4"
                          >
                            Lihat Detail Kamar
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Tombol Lihat Semua Kamar */}
        <Reveal>
          <div className="mt-20 flex justify-center">
            <Link
              href="/kamar"
              className="inline-flex items-center justify-center rounded-[12px] bg-[#1F3D35] px-[32px] py-[16px] text-[15px] font-semibold text-white transition-all duration-300 hover:bg-[#162E28] hover:text-[#C69C6D] hover:shadow-[0_8px_20px_rgba(31,61,53,0.3)]"
            >
              Lihat Semua Pilihan Kamar
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}