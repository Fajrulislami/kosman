"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Receipt, Wrench, User, X, ArrowLeft } from "lucide-react";

export default function PortalSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/portal/dashboard", icon: LayoutDashboard },
    { name: "Tagihan", href: "/portal/tagihan", icon: Receipt },
    { name: "Komplain", href: "/portal/komplain", icon: Wrench },
    { name: "Profil", href: "/portal/profil", icon: User },
  ];

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-[#E5E3DE] flex flex-col h-screen
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-auto
      `}>
        {/* Header */}
        <div className="p-6 border-b border-[#E5E3DE] flex items-center justify-between">
          <div>
            <Link href="/" className="text-2xl font-bold text-[#1F3D35]">
              Kostara<span className="text-[#C69C6D]">.</span>
            </Link>
            <p className="text-sm text-[#6B716D] mt-1">Tenant Portal</p>
          </div>
          {/* Close Button (Mobile Only) */}
          <button 
            onClick={onClose}
            className="md:hidden p-2 text-[#6B716D] hover:bg-[#F8F7F4] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
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
                {item.name}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C69C6D]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#E5E3DE]">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-[#6B716D] hover:bg-[#F8F7F4] hover:text-[#1F3D35] rounded-xl transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Website
          </Link>
        </div>
      </aside>
    </>
  );
}
