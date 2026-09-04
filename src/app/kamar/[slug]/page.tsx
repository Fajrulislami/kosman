import { notFound } from "next/navigation";
import { getRoomBySlug, rooms } from "@/data/rooms";
import RoomGallery from "@/components/rooms/RoomGallery";
import BookingSticky from "@/components/rooms/BookingSticky";
import { CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate metadata dinamis berdasarkan nama kamar
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const room = getRoomBySlug(resolvedParams.slug);
  
  if (!room) {
    return { title: "Kamar Tidak Ditemukan" };
  }
  
  return {
    title: `${room.name} - Kostara`,
    description: room.description,
  };
}

// Generate static params untuk performa maksimal (Next.js SSG)
export function generateStaticParams() {
  return rooms.map((room) => ({
    slug: room.slug,
  }));
}

export default async function KamarDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const room = getRoomBySlug(resolvedParams.slug);

  if (!room) {
    notFound();
  }

  return (
    <main className="relative min-h-screen bg-[#F8F7F4] pt-24 pb-20">
      {/* Pola Titik Latar Belakang (Dot Grid) */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#E5E3DE_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>
      
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Back Link */}
        <div className="mb-6">
          <Link 
            href="/kamar" 
            className="inline-flex items-center text-sm font-medium text-[#6B716D] transition-colors hover:text-[#1F3D35]"
          >
            &larr; Kembali ke Daftar Kamar
          </Link>
        </div>

        {/* Nama Kamar (Header) */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-[#202321] md:text-5xl">
            {room.name}
          </h1>
        </div>

        {/* Bento Gallery dengan Parallax */}
        <RoomGallery images={room.images} />

        {/* Layout Konten 2 Kolom (Desktop) */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          
          {/* Kiri: Detail Lengkap */}
          <div className="lg:col-span-2">
            
            {/* Deskripsi */}
            <section className="mb-12">
              <h2 className="mb-4 text-2xl font-bold text-[#202321]">Tentang Kamar Ini</h2>
              <p className="text-lg leading-relaxed text-[#6B716D]">
                {room.description}
              </p>
            </section>

            <hr className="mb-12 border-[#E5E3DE]" />

            {/* Fasilitas */}
            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-[#202321]">Fasilitas Lengkap</h2>
              <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2">
                {room.facilities.map((facility, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#C69C6D]" />
                    <span className="text-base text-[#202321]">{facility}</span>
                  </div>
                ))}
              </div>
            </section>

            {room.rules && room.rules.length > 0 && (
              <>
                <hr className="mb-12 border-[#E5E3DE]" />
                {/* Aturan Khusus */}
                <section>
                  <h2 className="mb-6 text-2xl font-bold text-[#202321]">Aturan Kamar</h2>
                  <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                    <ul className="space-y-4">
                      {room.rules.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                          <span className="text-base text-[#6B716D]">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              </>
            )}

          </div>

          {/* Kanan: Sticky Booking Box */}
          <div className="relative">
            <BookingSticky room={room} />
          </div>

        </div>

      </div>
    </main>
  );
}
