import { Bell, Menu, Search } from "lucide-react";
import { tenantProfile } from "@/data/portal";

export default function PortalHeader({ onMenuToggle }: { onMenuToggle?: () => void }) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-[#E5E3DE] sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Kiri: Menu Mobile & Pencarian */}
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={onMenuToggle}
            className="md:hidden p-2 text-[#6B716D] hover:bg-[#F8F7F4] rounded-lg transition-colors active:scale-95"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="hidden md:flex items-center gap-2 bg-[#F8F7F4] border border-[#E5E3DE] rounded-full px-4 py-2 w-64 focus-within:border-[#1F3D35] focus-within:w-80 transition-all duration-300">
            <Search className="w-4 h-4 text-[#6B716D]" />
            <input 
              type="text" 
              placeholder="Cari fitur..." 
              className="bg-transparent text-sm w-full focus:outline-none text-[#202321]"
            />
          </div>
        </div>

        {/* Kanan: Notifikasi & Mini Profil */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-[#6B716D] hover:bg-[#F8F7F4] rounded-full relative transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C69C6D] rounded-full border border-white"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-[#E5E3DE]">
            <div className="hidden md:block text-right">
              <p className="font-semibold text-[#202321] text-sm">{tenantProfile.name}</p>
              <p className="text-[#6B716D] text-xs">Tenant</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#1F3D35] text-white flex items-center justify-center font-bold text-sm shadow-md">
              {tenantProfile.name.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
