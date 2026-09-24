import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// 1. Import komponen Navbar yang baru saja dibuat
// (Sesuaikan path-nya jika Tuan Puteri menggunakan relative path seperti "../components/...")
import Navbar from "@/components/layout/Navbar"; 
import Footer from "@/components/layout/Footer";

// Mengatur font utama sesuai pedoman desain
const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pondok Rahmat — Hunian Nyaman dan Strategis",
  description: "Temukan kos nyaman dengan fasilitas lengkap dan lokasi strategis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      {/* Menerapkan background utama (#F8F7F4) dan font Plus Jakarta Sans ke seluruh web */}
      <body className={`${plusJakartaSans.className} bg-[#F8F7F4] text-[#202321] antialiased`}>
        
        {/* 2. Panggil Navbar di sini */}
        <Navbar />

        <main>{children}</main>

        {/* 3. Panggil Footer di sini */}
        <Footer />
        
      </body>
    </html>
  );
}