import React from "react";
import type { Metadata } from "next";
import HeroLokasi from "@/components/lokasi/HeroLokasi";
import MapLokasi from "@/components/lokasi/MapLokasi";
import PointsOfInterest from "@/components/lokasi/PointsOfInterest";
import TransportGuide from "@/components/lokasi/TransportGuide";
import CtaAbout from "@/components/about/CtaAbout";

export const metadata: Metadata = {
  title: "Lokasi - Pondok Rahmat",
  description: "Lokasi strategis Pondok Rahmat, dekat dengan kampus, pusat perbelanjaan, dan transportasi umum.",
};

export default function LokasiPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between bg-background">
      {/* Pola Titik Latar Belakang (Dot Grid) */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#E5E3DE_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Hero Section */}
        <HeroLokasi />

      {/* Map Section */}
      <MapLokasi />

      {/* Points of Interest Section */}
      <PointsOfInterest />

      {/* Transport Guide Section */}
      <TransportGuide />

      {/* Call to Action Section (Reusing CtaAbout since it fits well) */}
      <CtaAbout />
      </div>
    </main>
  );
}
