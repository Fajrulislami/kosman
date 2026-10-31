"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Receipt, Wrench, User, X, LogOut, ArrowLeft } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { usePortalContext } from "@/context/PortalContext";

export default function PortalSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { activeBillCount, activeComplaintCount } = usePortalContext();

  const navItems = [
    { name: "Dashboard", href: "/portal/dashboard", icon: LayoutDashboard },
    { name: "Tagihan", href: "/portal/tagihan", icon: Receipt },
    { name: "Komplain", href: "/portal/komplain", icon: Wrench },
    { name: "Profil", href: "/portal/profil", icon: User },
  ];

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
      {/* Mobile Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden print:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-[#E5E3DE] flex flex-col h-screen
        transform transition-transform duration-300 ease-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:z-auto print:hidden
      `}>
        {/* Header */}
        <div className="p-6 border-b border-[#E5E3DE] flex items-center justify-between">
          <div>
            <Link href="/" className="text-2xl font-bold text-[#1F3D35]">
              Kostara<span className="text-[#C69C6D]">.</span>
            </Link>
            <p className="text-xs text-[#6B716D] mt-0.5">Portal Penghuni</p>
          </div>
          {/* Close Button (Mobile Only) */}
          <button 
            onClick={onClose}
            className="md:hidden p-2 text-[#6B716D] hover:bg-[#F8F7F4] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            const renderBadge = () => {
              if (item.name === "Tagihan" && activeBillCount > 0) {
                return (
                  <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white shadow-xs">
                    {activeBillCount}
                  </span>
                );
              }
              if (item.name === "Komplain" && activeComplaintCount > 0) {
                return (
                  <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs">
                    {activeComplaintCount}
                  </span>
                );
              }
              if (isActive) {
                return <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C69C6D]" />;
              }
              return null;
            };

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive
                    ? "bg-[#1F3D35] text-white shadow-lg shadow-[#1F3D35]/15"
                    : "text-[#6B716D] hover:bg-[#F8F7F4] hover:text-[#1F3D35]"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-[#C69C6D]" : ""}`} />
                <span>{item.name}</span>
                {renderBadge()}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#E5E3DE] space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#6B716D] hover:bg-[#F8F7F4] hover:text-[#1F3D35] rounded-xl transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Website Utama
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            Keluar Akun
          </button>
        </div>
      </aside>
    </>
  );
}
