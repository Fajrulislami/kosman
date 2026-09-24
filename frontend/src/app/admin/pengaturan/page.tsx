"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import SettingsSidebar, { SettingsMenu } from "@/components/admin/pengaturan/SettingsSidebar";
import ProfileSettings from "@/components/admin/pengaturan/ProfileSettings";
import PaymentSettings from "@/components/admin/pengaturan/PaymentSettings";
import RuleSettings from "@/components/admin/pengaturan/RuleSettings";
import AccountSettings from "@/components/admin/pengaturan/AccountSettings";

export default function PengaturanPage() {
  const [activeMenu, setActiveMenu] = useState<SettingsMenu>("profil");
  const [hasChanges, setHasChanges] = useState(true); // Simulasi ada perubahan untuk memunculkan tombol Save

  const renderContent = () => {
    switch (activeMenu) {
      case "profil": return <ProfileSettings />;
      case "rekening": return <PaymentSettings />;
      case "aturan": return <RuleSettings />;
      case "akun": return <AccountSettings />;
      default: return <ProfileSettings />;
    }
  };

  return (
    <div className="relative min-h-[80vh] pb-24">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-[#1F3D35]">Pengaturan</h1>
        <p className="mt-1 text-sm font-medium text-[#6B716D]">
          Kelola profil properti, rekening, aturan kos, dan preferensi akun Anda.
        </p>
      </div>

      {/* Split View Layout */}
      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        
        {/* Kolom Kiri: Sidebar Menu */}
        <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
          <SettingsSidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        </div>

        {/* Kolom Kanan: Konten Aktif */}
        <div className="flex-1 w-full max-w-3xl">
          {renderContent()}
        </div>
      </div>

      {/* Floating Save Button (Muncul jika ada perubahan) */}
      {hasChanges && (
        <div className="fixed bottom-8 right-8 z-40 animate-in slide-in-from-bottom-8 duration-500">
          <button 
            onClick={() => setHasChanges(false)}
            className="group flex items-center justify-center space-x-2 rounded-full bg-[#C69C6D] px-8 py-4 font-black text-white shadow-[0_10px_30px_rgba(198,156,109,0.3)] transition-all hover:-translate-y-1 hover:bg-[#b08759] hover:shadow-[0_15px_40px_rgba(198,156,109,0.4)]"
          >
            <Save className="h-5 w-5 transition-transform group-hover:scale-110" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      )}
    </div>
  );
}
