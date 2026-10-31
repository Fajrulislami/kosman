"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  MessageSquare,
  ChevronDown,
  User,
  Key,
  LogOut,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { usePortalContext } from "@/context/PortalContext";
import { createWhatsAppLink } from "@/lib/whatsapp";
import { apiFetch } from "@/lib/api";
import PortalNotificationDropdown from "./PortalNotificationDropdown";
import ChangePasswordModal from "../profil/ChangePasswordModal";
import RulesModal from "./RulesModal";

export default function PortalHeader({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const router = useRouter();
  const { profile, propertyPhone, propertyName, rulesText } = usePortalContext();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  const activeLease = profile?.tenant?.leases?.[0];
  const room = activeLease?.room;
  const userName = profile?.name || "Penghuni";
  const userEmail = profile?.email || "";
  const avatarUrl = profile?.avatarUrl;

  const waHelpUrl = createWhatsAppLink(
    propertyPhone,
    `Halo Pengelola Kostara, saya ${userName}${room ? ` dari Kamar ${room.roomNumber}` : ""}. Saya ingin bertanya perihal layanan kos. Terima kasih!`
  );

  const handleLogout = async () => {
    try {
      await apiFetch("/api/auth/logout?role=tenant", { method: "POST" });
    } catch {
      // Ignore
    } finally {
      localStorage.removeItem("kostara_tenant_token");
      localStorage.removeItem("kostara_token");
      document.cookie = "kostara_tenant_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "kostara_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <>
      <header className="bg-white/85 backdrop-blur-md border-b border-[#E5E3DE] sticky top-0 z-30 print:hidden">
        <div className="flex items-center justify-between px-6 py-3.5">
          
          {/* Kiri: Tombol Menu Mobile & Branding Singkat */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onMenuToggle}
              className="md:hidden p-2 text-[#6B716D] hover:bg-[#F8F7F4] rounded-xl transition-colors active:scale-95 cursor-pointer"
              title="Buka menu navigasi"
            >
              <Menu className="w-5 h-5 text-[#1F3D35]" />
            </button>
            
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-[#6B716D]">
                {room ? `Unit Kamar ${room.roomNumber} (${room.roomType?.name || "Standar"})` : "Kostara Tenant Portal"}
              </span>
            </div>
          </div>

          {/* Kanan: Bantuan WA (Opsi B), Lonceng Notifikasi Interaktif, dan Profil Avatar Dropdown */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Tombol Pintas WhatsApp Pengelola (Opsi B) */}
            <a
              href={waHelpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-all active:scale-95 cursor-pointer"
              title="Hubungi pengelola kos via WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Bantuan WA</span>
            </a>

            {/* Tombol Tata Tertib Kos */}
            <button
              type="button"
              onClick={() => setIsRulesModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F7F4] hover:bg-[#E5E3DE] text-[#1F3D35] text-xs font-bold border border-[#E5E3DE] transition-all active:scale-95 cursor-pointer"
              title="Baca Tata Tertib & Kebijakan Kos"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C69C6D]" />
              <span className="hidden sm:inline">Tata Tertib</span>
            </button>

            {/* Lonceng Notifikasi Interaktif */}
            <PortalNotificationDropdown />
            
            {/* Dropdown Profil Pengguna */}
            <div className="relative pl-3 border-l border-[#E5E3DE]" ref={profileDropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 p-1 rounded-2xl hover:bg-[#F8F7F4] transition-all cursor-pointer group"
                aria-label="Menu akun penghuni"
              >
                <div className="hidden md:block text-right">
                  <p className="font-bold text-[#202321] text-xs group-hover:text-[#1F3D35] transition-colors max-w-[130px] truncate">
                    {userName}
                  </p>
                  <p className="text-[#6B716D] text-[10px] font-medium">
                    {room ? `Kamar ${room.roomNumber}` : "Penghuni Aktif"}
                  </p>
                </div>

                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#1F3D35] text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-[#E5E3DE] group-hover:ring-[#1F3D35] transition-all">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={userName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    userName.charAt(0).toUpperCase()
                  )}
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-[#99A09C] group-hover:text-[#1F3D35] transition-transform duration-200" />
              </button>

              {/* Popover Menu Akun */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-white border border-[#E5E3DE] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 divide-y divide-[#E5E3DE]/60">
                  
                  {/* Header Popover Akun */}
                  <div className="p-4 bg-[#F8F7F4]/60">
                    <p className="font-bold text-sm text-[#202321] truncate">{userName}</p>
                    <p className="text-xs text-[#6B716D] truncate mt-0.5">{userEmail}</p>
                    <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>{room ? `Kamar ${room.roomNumber}` : "Terverifikasi"}</span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2 space-y-1">
                    <Link
                      href="/portal/profil"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#202321] hover:bg-[#F8F7F4] hover:text-[#1F3D35] rounded-xl transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-[#C69C6D]" />
                      <span>Profil Saya</span>
                    </Link>

                    {/* Tata Tertib Kos */}
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsRulesModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#202321] hover:bg-[#F8F7F4] hover:text-[#1F3D35] rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#C69C6D]" />
                      <span>Tata Tertib Kos</span>
                    </button>

                    {/* Ubah Sandi Instan (Opsi A) */}
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsChangePasswordOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#202321] hover:bg-[#F8F7F4] hover:text-[#1F3D35] rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <Key className="w-4 h-4 text-[#C69C6D]" />
                      <span>Ubah Kata Sandi</span>
                    </button>
                  </div>

                  {/* Logout Button */}
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar Akun</span>
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Modal Ubah Kata Sandi */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

      {/* Modal Tata Tertib Kos */}
      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        rulesText={rulesText}
        propertyName={propertyName}
      />
    </>
  );
}
