import { Metadata } from "next";
import RoomCatalog from "@/components/rooms/RoomCatalog";

export const metadata: Metadata = {
  title: "Kamar - Pondok Rahmat",
  description: "Daftar pilihan kamar kos yang nyaman dan fasilitas lengkap di Pondok Rahmat.",
};

export default function KamarPage() {
  return (
    <main className="relative flex min-h-screen flex-col bg-[#F8F7F4] pt-24">
      {/* Pola Titik Latar Belakang (Dot Grid) */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#E5E3DE_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>
      
      <div className="relative z-10 w-full flex-grow">
        <RoomCatalog />
      </div>
    </main>
  );
}
