// 1. Import komponen Hero yang sudah kita buat
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import FeaturedRooms from "@/components/home/FeaturedRooms";
import Facilities from "@/components/home/Facilities";
import Gallery from "@/components/home/Gallery";
import Location from "@/components/home/Location";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import CTA from "@/components/home/CTA";


// 2. Nanti Tuan Puteri bisa meng-import komponen lainnya di sini setelah dibuat
import WhyUs from "@/components/home/WhyUs";

export default function Home() {
  return (
    // Tambahkan flex dan flex-col agar section di bawahnya nanti tersusun rapi ke bawah
    <main className="flex min-h-screen flex-col bg-background">

      {/* Section Utama */}
      <Hero />

      {/* Section Tentang Kos */}
      <About />

      {/* Section Keunggulan (Why Us) */}
      <WhyUs />

      <FeaturedRooms />

      <Facilities />

      <Gallery />

      <Location />

      <Testimonials />

      <FAQ />

      <CTA />


    </main>
  );
}