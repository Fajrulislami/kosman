"use client";

import { Building2, CreditCard, ShieldAlert, User, ChevronRight } from "lucide-react";

export type SettingsMenu = "profil" | "rekening" | "aturan" | "akun";

interface SettingsSidebarProps {
  activeMenu: SettingsMenu;
  onMenuChange: (menu: SettingsMenu) => void;
}

const MENU_ITEMS = [
  { id: "profil", label: "Profil Properti", icon: Building2, desc: "Info dasar & kontak" },
  { id: "rekening", label: "Rekening & Pembayaran", icon: CreditCard, desc: "Bank & QRIS" },
  { id: "aturan", label: "Aturan Kos", icon: ShieldAlert, desc: "Tata tertib & kebijakan" },
  { id: "akun", label: "Akun Admin", icon: User, desc: "Keamanan & login" },
] as const;

export default function SettingsSidebar({ activeMenu, onMenuChange }: SettingsSidebarProps) {
  return (
    <div className="flex flex-col space-y-2">
      {MENU_ITEMS.map((item) => {
        const isActive = activeMenu === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => onMenuChange(item.id)}
            className={`group relative flex w-full items-center justify-between rounded-2xl p-4 text-left transition-all ${
              isActive 
                ? "bg-white shadow-[0_2px_15px_rgb(0,0,0,0.04)] border border-[#E5E3DE]" 
                : "hover:bg-white/50 border border-transparent"
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                isActive ? "bg-[#1F3D35] text-white" : "bg-white text-[#99A09C] shadow-sm group-hover:text-[#1F3D35]"
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className={`font-bold transition-colors ${isActive ? "text-[#1F3D35]" : "text-[#6B716D] group-hover:text-[#1F3D35]"}`}>
                  {item.label}
                </p>
                <p className="text-xs font-medium text-[#99A09C]">{item.desc}</p>
              </div>
            </div>
            
            <ChevronRight className={`h-5 w-5 transition-transform ${
              isActive ? "text-[#C69C6D] translate-x-1" : "text-transparent group-hover:text-[#E5E3DE]"
            }`} />
          </button>
        );
      })}
    </div>
  );
}
