import { rooms } from "@/data/rooms";
import RoomCard from "@/components/rooms/RoomCard";

export default function RoomCatalog() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      
      {/* Header Katalog */}
      <div className="mb-16 text-center md:mb-24">
        <div className="mb-4 inline-flex items-center rounded-full border border-[#E5E3DE] bg-white px-4 py-1.5 shadow-sm animate-fade-in-up">
          <span className="text-[12px] font-bold tracking-[0.2em] text-[#C69C6D]">
            PILIHAN KAMAR
          </span>
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#202321] md:text-5xl animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          Temukan Kenyamanan<br className="hidden sm:block" /> Sesuai Kebutuhanmu.
        </h1>
        <p className="mx-auto max-w-2xl text-base text-[#6B716D] animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          Semua tipe kamar dirancang dengan standar kualitas tinggi untuk menjamin kenyamanan istirahat dan produktivitas Anda.
        </p>
      </div>

      {/* Grid Katalog Kamar */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room, index) => (
          <RoomCard key={room.id} room={room} index={index + 2} />
        ))}
      </div>

    </section>
  );
}
