"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  DoorClosed, 
  Users, 
  Receipt, 
  MessageSquareWarning, 
  Settings,
  LogOut
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Manajemen Kamar", href: "/admin/kamar", icon: DoorClosed },
  { name: "Penghuni", href: "/admin/penghuni", icon: Users },
  { name: "Tagihan & Pembayaran", href: "/admin/tagihan", icon: Receipt },
  { name: "Komplain", href: "/admin/komplain", icon: MessageSquareWarning },
  { name: "Pengaturan", href: "/admin/pengaturan", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r border-[#E5E3DE] bg-white lg:flex">
      {/* Logo Area */}
      <div className="flex h-16 items-center justify-center border-b border-[#E5E3DE]">
        <Link href="/admin" className="text-2xl font-black tracking-tighter text-[#1F3D35]">
          pondokrahmat<span className="text-[#C69C6D]">.</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        <p className="mb-4 px-2 text-xs font-bold uppercase tracking-wider text-[#99A09C]">
          Menu Utama
        </p>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-[#1F3D35] text-white shadow-md"
                  : "text-[#6B716D] hover:bg-[#F8F7F4] hover:text-[#1F3D35]"
              }`}
            >
              <Icon
                className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                  isActive ? "text-white" : "text-[#99A09C] group-hover:text-[#1F3D35]"
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Area / Logout */}
      <div className="border-t border-[#E5E3DE] p-4">
        <Link
          href="/"
          className="group flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-semibold text-[#E54D2E] transition-all hover:bg-[#FCECE9]"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-[#E54D2E]" />
          Keluar (Ke Beranda)
        </Link>
      </div>
    </aside>
  );
}
