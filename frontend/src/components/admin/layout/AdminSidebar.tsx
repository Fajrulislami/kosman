"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  DoorClosed, 
  Users, 
  Receipt, 
  MessageSquareWarning, 
  Settings, 
  LogOut,
  X
} from "lucide-react";
import { apiFetch } from "@/lib/api";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Manajemen Kamar", href: "/admin/kamar", icon: DoorClosed },
  { name: "Penghuni", href: "/admin/penghuni", icon: Users },
  { name: "Tagihan & Pembayaran", href: "/admin/tagihan", icon: Receipt },
  { name: "Komplain", href: "/admin/komplain", icon: MessageSquareWarning },
  { name: "Pengaturan", href: "/admin/pengaturan", icon: Settings },
];

interface AdminSidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
  brandName?: string;
}

export default function AdminSidebar({
  isMobile = false,
  onClose,
  brandName = "Kostara",
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [counts, setCounts] = useState<{
    inquiries: number;
    pendingPayments: number;
    pendingComplaints: number;
    overdueInvoices: number;
  }>({
    inquiries: 0,
    pendingPayments: 0,
    pendingComplaints: 0,
    overdueInvoices: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await apiFetch<{
          success: boolean;
          counts: {
            inquiries: number;
            pendingPayments: number;
            pendingComplaints: number;
            overdueInvoices: number;
          };
        }>("/api/admin/notifications");
        if (res && res.counts) {
          setCounts(res.counts);
        }
      } catch {
        // silent fail on network error
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 20000);
    const handleFocus = () => fetchCounts();
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

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

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <aside
      className={`flex flex-col border-r border-[#E5E3DE] bg-white ${
        isMobile ? "h-full w-72 shadow-2xl" : "hidden w-64 lg:flex"
      }`}
    >
      {/* Logo & Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-[#E5E3DE] px-6">
        <Link
          href="/admin"
          onClick={handleLinkClick}
          className="text-2xl font-black tracking-tighter text-[#1F3D35] truncate"
        >
          {brandName}<span className="text-[#C69C6D]">.</span>
        </Link>
        {isMobile && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#99A09C] hover:bg-[#F8F7F4] hover:text-[#1F3D35] cursor-pointer"
            aria-label="Tutup navigasi"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        <p className="mb-4 px-2 text-xs font-bold uppercase tracking-wider text-[#99A09C]">
          Menu Utama
        </p>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          // Hitung badge untuk menu tertentu
          let badgeCount = 0;
          if (item.href === "/admin/penghuni") {
            badgeCount = counts.inquiries;
          } else if (item.href === "/admin/tagihan") {
            badgeCount = counts.pendingPayments + counts.overdueInvoices;
          } else if (item.href === "/admin/komplain") {
            badgeCount = counts.pendingComplaints;
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleLinkClick}
              className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-[#1F3D35] text-white shadow-md"
                  : "text-[#6B716D] hover:bg-[#F8F7F4] hover:text-[#1F3D35]"
              }`}
            >
              <div className="flex items-center">
                <Icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                    isActive ? "text-white" : "text-[#99A09C] group-hover:text-[#1F3D35]"
                  }`}
                />
                <span>{item.name}</span>
              </div>

              {badgeCount > 0 && (
                <span
                  className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-extrabold shadow-sm ${
                    isActive
                      ? "bg-white text-[#1F3D35]"
                      : "bg-[#E54D2E] text-white animate-pulse"
                  }`}
                >
                  {badgeCount > 99 ? "99+" : badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Area / Logout */}
      <div className="border-t border-[#E5E3DE] p-4">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-semibold text-[#E54D2E] transition-all hover:bg-[#FCECE9] cursor-pointer"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-[#E54D2E]" />
          Keluar Akun
        </button>
      </div>
    </aside>
  );
}
