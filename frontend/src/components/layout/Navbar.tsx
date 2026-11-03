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
    { name: "Kontak", href: "/kontak" },
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
    <header className="fixed left-0 right-0 top-2.5 sm:top-3.5 z-50 flex w-full justify-center px-3 sm:px-6 pointer-events-none">
      <div className="relative w-full max-w-4xl flex justify-center">
        {/* Kapsul Tunggal Ramping (Compact Frosted Glass Navbar) */}
        <nav className="pointer-events-auto flex w-full items-center justify-between gap-3 sm:gap-6 rounded-full border border-white/80 bg-white/75 px-3.5 sm:px-5 py-1.5 sm:py-2 shadow-[0_8px_30px_rgba(31,61,53,0.08)] backdrop-blur-xl transition-all">
          
          {/* Logo Brand + Badge Mini */}
          <Link href="/" className="flex items-center gap-2 transition-opacity duration-300 hover:opacity-85 shrink-0 pl-1">
            <span className="text-[15px] sm:text-base font-extrabold tracking-tight text-[#1F3D35]">
              {profile.name || "Pondok Rahmat"}<span className="text-[#C69C6D]">.</span>
            </span>
            <span className="hidden sm:inline-flex items-center rounded-full bg-[#1F3D35]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1F3D35]">
              Kost Putri
            </span>
          </Link>

          {/* Navigasi Desktop dengan Sliding Pill Ringkas */}
          <ul className="hidden md:flex items-center relative gap-0.5">
            {/* Sliding Pill Indicator */}
            <div 
              className="absolute top-0 bottom-0 my-auto h-full rounded-full bg-white shadow-sm border border-[#E5E3DE]/70 transition-all duration-300 ease-out z-0 pointer-events-none"
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
                    className={`relative block whitespace-nowrap px-3 lg:px-3.5 py-1.5 text-[13px] font-semibold transition-colors duration-200 ${
                      isActive ? "text-[#1F3D35]" : "text-[#6B716D] hover:text-[#1F3D35]"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Bagian Kanan: Tombol Masuk Desktop & Menu Mobile */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* CTA Desktop Ringkas */}
            <Link
              href="/login"
              className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-[#1F3D35] px-3.5 py-1.5 text-[12px] font-semibold text-white transition-all duration-300 hover:bg-[#162E28] hover:text-[#C69C6D] hover:shadow-sm"
            >
              <LogIn size={13} />
              <span>Masuk</span>
            </Link>

            {/* Tombol Masuk Cepat Mobile */}
            <Link
              href="/login"
              className="flex md:hidden items-center gap-1 rounded-full bg-[#1F3D35]/10 px-2.5 py-1 text-[11px] font-bold text-[#1F3D35] hover:bg-[#1F3D35]/15 transition-colors"
            >
              <LogIn size={12} />
              <span>Masuk</span>
            </Link>

            {/* Tombol Hamburger Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1F3D35]/10 text-[#1F3D35] transition-colors hover:bg-[#1F3D35]/15 md:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </nav>

        {/* Floating Sheet Frosted Glass Menu (Mobile Dropdown) */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="pointer-events-auto absolute top-[calc(100%+8px)] left-0 right-0 z-50 mx-auto w-full max-w-sm rounded-2xl border border-white/90 bg-white/95 p-3.5 shadow-[0_16px_40px_rgba(31,61,53,0.15)] backdrop-blur-2xl md:hidden animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = activePath === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[14px] font-semibold transition-all ${
                        isActive
                          ? "bg-[#1F3D35] text-white shadow-sm"
                          : "text-[#202321] hover:bg-[#F8F7F4] hover:text-[#1F3D35]"
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronRight
                        size={15}
                        className={isActive ? "text-[#C69C6D]" : "text-[#99A09C]"}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-2.5 pt-2.5 border-t border-[#E5E3DE]">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F3D35] px-4 py-2.5 text-[13px] font-bold text-white shadow-sm transition-all hover:bg-[#162E28] hover:text-[#C69C6D]"
              >
                <LogIn size={15} />
                <span>Masuk Akun Penghuni / Admin</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
