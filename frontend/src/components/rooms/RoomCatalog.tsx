"use client";

import { useEffect, useState } from "react";
import { rooms as initialRooms, type Room } from "@/data/rooms";
import RoomCard from "@/components/rooms/RoomCard";
import { apiFetch } from "@/lib/api";
import { Sparkles, CheckCircle2, Filter } from "lucide-react";

export default function RoomCatalog() {
  const [roomList, setRoomList] = useState<Room[]>(initialRooms);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "AVAILABLE">("ALL");

  useEffect(() => {
    let isMounted = true;
    const loadRooms = async () => {
      try {
        setLoading(true);
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
      } catch (err) {
        console.error("Gagal memuat katalog dinamis, memakai fallback:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadRooms();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredRooms = roomList.filter((room) => {
    if (filter === "AVAILABLE") {
      return room.status === "AVAILABLE" || room.isAvailable === true;
    }
    return true;
  });

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      {/* Header Katalog */}
      <div className="mb-12 text-center md:mb-16">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E5E3DE] bg-white px-4 py-1.5 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-[#C69C6D]" />
          <span className="text-[12px] font-bold tracking-[0.2em] text-[#C69C6D]">
            PILIHAN KAMAR TERBAIK
          </span>
        </div>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-[#1F3D35] md:text-5xl">
          Temukan Ruang Nyaman<br className="hidden sm:block" /> Sesuai Gaya Hidupmu
        </h1>
        <p className="mx-auto max-w-2xl text-base text-[#6B716D]">
          Setiap kamar dirancang dengan ventilasi udara segar, pencahayaan alami, dan fasilitas modern untuk istirahat optimal dan produktivitas tinggi.
        </p>

        {/* Filter Controls */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setFilter("ALL")}
            className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold transition-all ${
              filter === "ALL"
                ? "bg-[#1F3D35] text-white shadow-md"
                : "border border-[#E5E3DE] bg-white text-[#6B716D] hover:bg-[#F8F7F4]"
            }`}
          >
            <Filter className="h-3 w-3" />
            <span>Semua Tipe ({roomList.length})</span>
          </button>
          <button
            onClick={() => setFilter("AVAILABLE")}
            className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold transition-all ${
              filter === "AVAILABLE"
                ? "bg-[#1F3D35] text-white shadow-md"
                : "border border-[#E5E3DE] bg-white text-[#6B716D] hover:bg-[#F8F7F4]"
            }`}
          >
            <CheckCircle2 className="h-3 w-3 text-green-500" />
            <span>
              Siap Huni ({roomList.filter((r) => r.isAvailable || r.status === "AVAILABLE").length})
            </span>
          </button>
        </div>
      </div>

      {/* Grid Katalog Kamar */}
      {loading && roomList.length === 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-96 animate-pulse rounded-3xl border border-[#E5E3DE] bg-white p-6 shadow-sm"
            >
              <div className="h-48 w-full rounded-2xl bg-gray-200" />
              <div className="mt-4 h-6 w-3/4 rounded bg-gray-200" />
              <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
              <div className="mt-6 h-10 w-full rounded-xl bg-gray-200" />
            </div>
          ))}
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="mx-auto max-w-md rounded-3xl border border-[#E5E3DE] bg-white p-12 text-center shadow-sm">
          <p className="text-base font-semibold text-[#202321]">
            Saat ini belum ada kamar dengan filter yang dipilih.
          </p>
          <p className="mt-2 text-sm text-[#6B716D]">
            Silakan ganti filter atau hubungi admin untuk reservasi waiting list.
          </p>
          <button
            onClick={() => setFilter("ALL")}
            className="mt-6 rounded-full bg-[#1F3D35] px-6 py-2.5 text-xs font-semibold text-white"
          >
            Tampilkan Semua Kamar
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredRooms.map((room, index) => (
            <RoomCard key={room.id} room={room} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
