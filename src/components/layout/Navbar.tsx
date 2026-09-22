"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
<<<<<<< HEAD
=======
import { LogIn } from "lucide-react";
>>>>>>> development

export default function Navbar() {
  const pathname = usePathname();
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});

  const navItems = [
    { name: "Beranda", href: "/" },
    { name: "Tentang", href: "/tentang" },
    { name: "Kamar", href: "/kamar" },
    { name: "Fasilitas", href: "/fasilitas" },
    { name: "Lokasi", href: "/lokasi" },
<<<<<<< HEAD
=======
    { name: "Hubungi Kami", href: "/kontak" },
>>>>>>> development
  ];

  // Path yang sedang aktif (posisi halaman saat ini)
  const activePath = pathname;

  useEffect(() => {
    // Fungsi untuk memperbarui posisi indikator pill
    const updatePill = () => {
      const activeEl = navRefs.current[activePath];
      if (activeEl) {
        setPillStyle({
          left: activeEl.offsetLeft,
          width: activeEl.offsetWidth,
          opacity: 1,
        });
      } else {
        setPillStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    updatePill();
    
    // Update posisi saat window di-resize untuk menjaga presisi
    window.addEventListener("resize", updatePill);
    return () => window.removeEventListener("resize", updatePill);
  }, [activePath]);

<<<<<<< HEAD
  return (
    <header className="fixed left-0 right-0 top-6 z-50 flex w-full justify-center px-6">
=======
  if (pathname.startsWith("/portal") || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="fixed left-0 right-0 top-6 z-50 flex w-full items-center justify-center gap-4 px-6">
>>>>>>> development
      
      {/* 
        EFEK FROSTED GLASS:
        - bg-white/40 : Putih transparan (bening)
        - backdrop-blur-lg : Efek kaca buram (blur) pada background di belakangnya
        - border border-white/60 : Garis pinggir putih tipis agar bentuk kaca lebih tegas
        - px-8 py-4.5 : Ukuran background tetap dijaga lebih besar dan lega
      */}
<<<<<<< HEAD
      <nav className="flex w-full max-w-[860px] items-center justify-between rounded-full border border-white/60 bg-white/40 px-8 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.03)] backdrop-blur-lg">
=======
      <nav className="flex w-auto items-center gap-10 rounded-full border border-white/60 bg-white/40 px-8 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.03)] backdrop-blur-lg">
>>>>>>> development
        
        {/* Logo Kostara */}
        <Link href="/" className="flex items-center transition-opacity duration-300 hover:opacity-70">
          <span className="text-2xl font-extrabold tracking-tighter text-[#1F3D35]">
            Kostara<span className="text-[#C69C6D]">.</span>
          </span>
        </Link>

        {/* Navigasi Utama dengan Efek Animasi Sliding Pill (Mirip Apple/Vercel) */}
        <ul className="hidden items-center relative md:flex">
          {/* Animated Sliding Background (The Pill) */}
          <div 
            className="absolute top-0 bottom-0 my-auto h-full rounded-full bg-white shadow-sm transition-all duration-500 ease-out z-0"
            style={{ 
              left: `${pillStyle.left}px`, 
              width: `${pillStyle.width}px`, 
              opacity: pillStyle.opacity 
            }} 
          />

          {navItems.map((item) => {
            const isActive = activePath === item.href;
            
            return (
              <li 
                key={item.name} 
                ref={(el) => {
                  navRefs.current[item.href] = el;
                }}
                className="relative z-10"
              >
                <Link
                  href={item.href}
<<<<<<< HEAD
                  className={`relative block px-5 py-2.5 text-[15px] font-semibold transition-colors duration-300 ease-out ${
=======
                  className={`relative block whitespace-nowrap px-5 py-2.5 text-[15px] font-semibold transition-colors duration-300 ease-out ${
>>>>>>> development
                    isActive ? "text-[#1F3D35]" : "text-[#6B716D] hover:text-[#1F3D35]"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
<<<<<<< HEAD

        {/* Call to Action (CTA) Button */}
        <div className="hidden md:block">
          <Link
            href="/kontak"
            className="block rounded-full bg-[#1F3D35] px-7 py-3 text-[15px] font-semibold text-white transition-all duration-500 ease-out hover:bg-[#162E28] hover:shadow-[0_8px_20px_rgba(31,61,53,0.3)] hover:-translate-y-0.5"
          >
            Hubungi Kami
          </Link>
        </div>

      </nav>
=======
      </nav>

      {/* Call to Action (CTA) & Login Button */}
      <div className="hidden md:flex items-center rounded-full border border-white/60 bg-white/40 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.03)] backdrop-blur-lg">
        <Link
          href="/portal/login"
          className="group flex items-center gap-2 rounded-full bg-[#1F3D35] px-6 py-2 text-[15px] font-semibold text-white transition-all duration-500 ease-out hover:bg-[#162E28] hover:shadow-[0_8px_20px_rgba(31,61,53,0.3)] hover:-translate-y-0.5"
        >
          <LogIn size={18} className="transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Masuk Portal</span>
        </Link>
      </div>

>>>>>>> development
    </header>
  );
}