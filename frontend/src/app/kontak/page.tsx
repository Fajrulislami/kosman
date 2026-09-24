import React from "react";
import type { Metadata } from "next";
import HeroKontak from "@/components/kontak/HeroKontak";
import ContactInfo from "@/components/kontak/ContactInfo";
import ContactForm from "@/components/kontak/ContactForm";

export const metadata: Metadata = {
  title: "Hubungi Kami - Pondok Rahmat",
  description: "Hubungi Pondok Rahmat untuk informasi lebih lanjut mengenai kamar, fasilitas, dan harga. Kami siap melayani Anda.",
};

export default function KontakPage() {
  return (
    <main className="relative flex min-h-screen flex-col bg-[#F8F7F4]">
      {/* Pola Titik Latar Belakang (Dot Grid) */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#E5E3DE_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>
      
      <div className="relative z-10 w-full flex-grow flex flex-col items-center">
        {/* Hero Section */}
        <HeroKontak />

        {/* Layout Asimetris (Info di Kiri, Form di Kanan) */}
        <section className="w-full pb-24 md:pb-32">
          <div className="mx-auto w-full max-w-[1200px] px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              
              {/* Kolom Kiri: Contact Info (Bento Grid Internal) */}
              <div className="lg:col-span-5 h-full">
                <ContactInfo />
              </div>

              {/* Kolom Kanan: Contact Form (Card Style dengan 3D Touch) */}
              <div className="lg:col-span-7 h-full">
                <ContactForm />
              </div>

            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
