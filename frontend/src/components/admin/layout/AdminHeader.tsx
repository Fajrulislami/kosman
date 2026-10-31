"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Menu, Settings, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import NotificationDropdown from "./NotificationDropdown";
import { apiFetch } from "@/lib/api";

interface AdminHeaderProps {
  onOpenMobileMenu?: () => void;
  brandName?: string;
}

export default function AdminHeader({
  onOpenMobileMenu,
  brandName = "Kostara",
}: AdminHeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ name: string; email: string }>({
    name: "Admin " + brandName,
    email: "",
  });

  const profileRef = useRef<HTMLDivElement>(null);

  // Ambil data admin yang sedang login
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await apiFetch<{ authenticated: boolean; user: { name: string; email: string } }>("/api/auth/me");
        if (res && res.user) {
          setAdminUser({
            name: res.user.name || "Admin",
            email: res.user.email || "",
          });
        }
      } catch {
        // Fallback to default
      }
    };
    fetchMe();

    const handleUserUpdate = (e: any) => {
      if (e.detail?.name) {
        setAdminUser((prev) => ({
          ...prev,
          name: e.detail.name,
          email: e.detail.email || prev.email,
        }));
      }
    };

    window.addEventListener("kostara_user_updated", handleUserUpdate);
    return () => {
      window.removeEventListener("kostara_user_updated", handleUserUpdate);
    };
  }, []);

  // Tutup dropdown profile saat klik di luar
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    // Smart routing decision
    if (/^(kamar\s*)?\d+$/i.test(q)) {
      const roomNum = q.replace(/kamar\s*/i, "").trim();
      router.push(`/admin/kamar?search=${encodeURIComponent(roomNum)}`);
    } else if (/^inv/i.test(q)) {
      router.push(`/admin/tagihan?search=${encodeURIComponent(q)}`);
    } else {
      router.push(`/admin/penghuni?search=${encodeURIComponent(q)}`);
    }

    setSearchQuery("");
  };

  const handleLogout = async () => {
    try {
      await apiFetch("/api/auth/logout?role=admin", { method: "POST" });
    } catch {
      // Ignore
    } finally {
      localStorage.removeItem("kostara_admin_token");
      localStorage.removeItem("kostara_token");
      document.cookie = "kostara_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "kostara_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      router.push("/login");
      router.refresh();
    }
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center gap-x-4 border-b border-[#E5E3DE] bg-white/90 px-4 shadow-sm backdrop-blur-md sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={onOpenMobileMenu}
        aria-label="Buka navigasi mobile"
        className="-m-2.5 p-2.5 text-[#6B716D] hover:text-[#1F3D35] lg:hidden cursor-pointer"
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator for mobile */}
      <div className="h-6 w-px bg-[#E5E3DE] lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Interactive Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex flex-1">
          <label htmlFor="search-field" className="sr-only">
            Cari sesuatu...
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-[#99A09C]"
            aria-hidden="true"
          />
          <input
            id="search-field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-[#1F3D35] placeholder:text-[#99A09C] focus:ring-0 sm:text-sm font-medium"
            placeholder="Cari penghuni, no kamar (cth: 101), atau invoice (Enter)..."
            type="search"
          />
        </form>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notification Dropdown Component */}
          <NotificationDropdown />

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-[#E5E3DE]" aria-hidden="true" />

          {/* Profile Dropdown Popover */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center p-1.5 rounded-xl hover:bg-[#F8F7F4] transition-colors cursor-pointer"
              aria-label="Menu pengguna"
              aria-expanded={isProfileOpen}
            >
              <div className="h-8 w-8 overflow-hidden rounded-full bg-[#C69C6D] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                {getInitials(adminUser.name)}
              </div>
              <span className="hidden lg:ml-3 lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-[#1F3D35] max-w-[140px] truncate">
                {adminUser.name}
              </span>
            </button>

            {/* Profile Popover Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-2xl border border-[#E5E3DE] z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-[#E5E3DE]">
                  <p className="text-xs font-bold text-[#1F3D35] truncate">{adminUser.name}</p>
                  <p className="text-[11px] text-[#99A09C] truncate">{adminUser.email || "Administrator"}</p>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      router.push("/admin/pengaturan?tab=akun");
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#1F3D35] hover:bg-[#F8F7F4] transition-colors cursor-pointer"
                  >
                    <Settings className="h-4 w-4 text-[#C69C6D]" />
                    <span>Pengaturan Akun</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#E54D2E] hover:bg-[#FCECE9] transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 text-[#E54D2E]" />
                    <span>Keluar Akun</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
