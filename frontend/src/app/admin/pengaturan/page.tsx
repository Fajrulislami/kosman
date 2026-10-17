"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import SettingsSidebar, { SettingsMenu } from "@/components/admin/pengaturan/SettingsSidebar";
import ProfileSettings from "@/components/admin/pengaturan/ProfileSettings";
import PaymentSettings from "@/components/admin/pengaturan/PaymentSettings";
import RuleSettings from "@/components/admin/pengaturan/RuleSettings";
import AccountSettings from "@/components/admin/pengaturan/AccountSettings";
import { apiFetch } from "@/lib/api";
import AlertModal from "@/components/ui/AlertModal";

export default function PengaturanPage() {
  const [activeMenu, setActiveMenu] = useState<SettingsMenu>("profil");
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    profile: {
      name: "",
      phone: "",
      address: "",
      description: ""
    },
    paymentMethods: [],
    rules: { text: "" }
  });

  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: "success" | "error" | "warning";
  }>({
    isOpen: false,
    title: "",
    message: "",
    variant: "success",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await apiFetch<{ data: any }>("/api/admin/settings");
        
        // Merge the fetched data with default structure to avoid undefined errors
        setSettings((prev) => ({
          ...prev,
          profile: res.data?.profile || prev.profile,
          paymentMethods: res.data?.paymentMethods || prev.paymentMethods,
          rules: res.data?.rules || prev.rules,
        }));
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleProfileChange = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      profile: { ...prev.profile, [field]: value }
    }));
    setHasChanges(true);
  };

  const handlePaymentChange = (methods: any[]) => {
    setSettings((prev) => ({
      ...prev,
      paymentMethods: methods
    }));
    setHasChanges(true);
  };

  const handleRulesChange = (text: string) => {
    setSettings((prev) => ({
      ...prev,
      rules: { text }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await apiFetch<{ success: boolean; message: string }>("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify(settings),
      });

      setAlertConfig({
        isOpen: true,
        title: "Berhasil",
        message: res.message,
        variant: "success"
      });
      setHasChanges(false);
    } catch (err: any) {
      setAlertConfig({
        isOpen: true,
        title: "Gagal Menyimpan",
        message: err.message || "Terjadi kesalahan saat menyimpan pengaturan",
        variant: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#C69C6D]" />
        </div>
      );
    }

    switch (activeMenu) {
      case "profil": 
        return <ProfileSettings data={settings.profile} onChange={handleProfileChange} />;
      case "rekening": 
        return <PaymentSettings methods={settings.paymentMethods} onChange={handlePaymentChange} />;
      case "aturan": 
        return <RuleSettings data={settings.rules} onChange={handleRulesChange} />;
      case "akun": 
        return <AccountSettings />;
      default: 
        return <ProfileSettings data={settings.profile} onChange={handleProfileChange} />;
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
            disabled={saving}
            onClick={handleSave}
            className="group flex items-center justify-center space-x-2 rounded-full bg-[#C69C6D] px-8 py-4 font-black text-white shadow-[0_10px_30px_rgba(198,156,109,0.3)] transition-all hover:-translate-y-1 hover:bg-[#b08759] hover:shadow-[0_15px_40px_rgba(198,156,109,0.4)] disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5 transition-transform group-hover:scale-110" />}
            <span>{saving ? "Menyimpan..." : "Simpan Perubahan"}</span>
          </button>
        </div>
      )}

      <AlertModal
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        variant={alertConfig.variant}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
      />
    </div>
  );
}
