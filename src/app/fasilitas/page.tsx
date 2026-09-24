import React from "react";
import type { Metadata } from "next";
import HeroFacilities from "@/components/fasilitas/HeroFacilities";
import FacilitiesGrid from "@/components/fasilitas/FacilitiesGrid";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Fasilitas - Pondok Rahmat",
  description: "Fasilitas premium yang dirancang untuk kenyamanan maksimal Anda.",
};

export default function FasilitasPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Hero Section */}
      <HeroFacilities />

      {/* Main Grid Content */}
      <FacilitiesGrid />

      {/* Call to Action Section */}
      <section className="w-full bg-[#1F3D35] py-20 md:py-28 relative overflow-hidden">
        <div className="mx-auto w-full max-w-[1200px] px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-[40px] font-bold text-white leading-[1.2]">
              Tertarik menikmati semua fasilitas ini?
            </h2>
            <p className="text-lg text-white/80 leading-relaxed">
              Jadikan Pondok Rahmat tempat tinggal Anda berikutnya. Lihat pilihan kamar yang tersedia dan amankan posisi Anda hari ini.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                href="/kamar"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-[10px] bg-white px-8 text-base font-semibold text-[#1F3D35] transition-transform hover:scale-105"
              >
                Lihat Kamar Kami
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link 
                href="/kontak"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-[10px] border border-white/30 bg-transparent px-8 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                Hubungi Admin
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-[#2A5247] blur-[100px] opacity-60" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-[#162E28] blur-[100px] opacity-60" />
      </section>
    </main>
  );
}
