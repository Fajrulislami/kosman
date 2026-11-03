"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { LogIn, Menu, X, ChevronRight } from "lucide-react";
import { useProperty } from "@/context/PropertyContext";

export default function Navbar() {
  const pathname = usePathname();
  const { profile } = useProperty();
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: "Beranda", href: "/" },
    { name: "Tentang", href: "/tentang" },
    { name: "Kamar", href: "/kamar" },
    { name: "Fasilitas", href: "/fasilitas" },
    { name: "Lokasi", href: "/lokasi" },
    { name: "Hubungi Kami", href: "/kontak" },
  ];

  const activePath = pathname;

  // Tutup menu mobile saat rute halaman berganti
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Tutup menu saat klik di luar
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [mobileMenuOpen]);

  // Update sliding pill indicator pada layar desktop
  useEffect(() => {
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
    window.addEventListener("resize", updatePill);
    return () => window.removeEventListener("resize", updatePill);
  }, [activePath]);

  if (pathname.startsWith("/portal") || pathname.startsWith("/admin") || pathname === "/login") {
    return null;
  }

  return (
    <header className="fixed left-0 right-0 top-5 z-50 flex w-full flex-col items-center justify-center px-4 sm:px-6">
      <div className="relative flex w-full max-w-5xl items-center justify-between sm:justify-center gap-3">
        {/* Kapsul Utama Frosted Glass */}
        <nav className="flex w-full sm:w-auto items-center justify-between gap-4 sm:gap-8 lg:gap-10 rounded-full border border-white/70 bg-white/65 px-5 sm:px-8 py-3 shadow-[0_8px_32px_rgba(31,61,53,0.08)] backdrop-blur-xl">
          
          {/* Logo Pondok Rahmat + Badge Kost Putri */}
          <Link href="/" className="flex items-center gap-2.5 transition-opacity duration-300 hover:opacity-85">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tighter text-[#1F3D35]">
              {profile.name || "Pondok Rahmat"}<span className="text-[#C69C6D]">.</span>
            </span>
            <span className="inline-flex items-center rounded-full bg-[#1F3D35]/10 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#1F3D35]">
              Kost Putri
            </span>
          </Link>

          {/* Navigasi Desktop dengan Sliding Pill */}
          <ul className="hidden items-center relative md:flex">
            {/* Sliding Pill Indicator */}
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
                    className={`relative block whitespace-nowrap px-4 lg:px-5 py-2.5 text-[14px] lg:text-[15px] font-semibold transition-colors duration-300 ease-out ${
                      isActive ? "text-[#1F3D35]" : "text-[#6B716D] hover:text-[#1F3D35]"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Tombol Hamburger Khusus Mobile (Muncul pada layar < md) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1F3D35]/10 text-[#1F3D35] transition-colors hover:bg-[#1F3D35]/15 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* CTA Button Desktop */}
        <div className="hidden md:flex items-center rounded-full border border-white/70 bg-white/65 p-1.5 shadow-[0_8px_32px_rgba(31,61,53,0.08)] backdrop-blur-xl">
          <Link
            href="/login"
            className="group flex items-center gap-2 rounded-full bg-[#1F3D35] px-6 py-2.5 text-[14px] font-semibold text-white transition-all duration-500 ease-out hover:bg-[#162E28] hover:text-[#C69C6D] hover:shadow-[0_8px_20px_rgba(31,61,53,0.3)] hover:-translate-y-0.5"
          >
            <LogIn size={17} className="transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Masuk Akun</span>
          </Link>
        </div>

        {/* Floating Sheet Frosted Glass Menu (Mobile Dropdown) */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="absolute top-[calc(100%+10px)] left-0 right-0 z-50 mx-auto w-full max-w-sm rounded-3xl border border-white/80 bg-white/90 p-5 shadow-[0_20px_50px_rgba(31,61,53,0.2)] backdrop-blur-2xl md:hidden animate-in fade-in slide-in-from-top-3 duration-300"
          >
            <ul className="flex flex-col gap-1.5">
              {navItems.map((item) => {
                const isActive = activePath === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] font-semibold transition-all ${
                        isActive
                          ? "bg-[#1F3D35] text-white shadow-sm"
                          : "text-[#202321] hover:bg-[#F8F7F4] hover:text-[#1F3D35]"
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronRight
                        size={16}
                        className={isActive ? "text-[#C69C6D]" : "text-[#99A09C]"}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 pt-4 border-t border-[#E5E3DE]">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1F3D35] px-5 py-3.5 text-[15px] font-bold text-white shadow-md transition-all hover:bg-[#162E28] hover:text-[#C69C6D]"
              >
                <LogIn size={18} />
                <span>Masuk Akun Penghuni / Admin</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
