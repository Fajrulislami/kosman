import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/layout/Navbar"; 
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import { PropertyProvider } from "@/context/PropertyContext";

// Mengatur font utama sesuai pedoman desain
const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pondok Rahmat — Kost Putri Nyaman & Strategis Samata Gowa",
  description: "Kost khusus putri nyaman, bersih, dan aman di samping Kampus II UIN Alauddin Samata (dekat Pintu II). Dilengkapi kamar mandi dalam, kasur, dapur umum, WiFi, dan CCTV 24 jam.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${plusJakartaSans.className} bg-[#F8F7F4] text-[#202321] antialiased`}>
        <PropertyProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster position="top-right" />
        </PropertyProvider>
      </body>
    </html>
  );
}
