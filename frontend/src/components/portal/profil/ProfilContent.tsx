"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  User, Mail, Phone, MapPin, Key, ShieldCheck, 
  Home, Calendar, CreditCard, HeartPulse, Loader2, Contact, Briefcase,
  AlertTriangle, RefreshCw, CheckCircle2
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import ChangePasswordModal from "./ChangePasswordModal";

export default function ProfilContent() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiFetch<{ authenticated: boolean; user: any }>("/api/auth/me");
      setProfile(res.user);
    } catch (err) {
      console.error("Failed to load tenant profile:", err);
      setError("Gagal memuat informasi profil penghuni. Periksa koneksi internet Anda.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const tenant = profile?.tenant;
  const activeLease = tenant?.leases?.find((l: any) => l.status === "ACTIVE") || tenant?.leases?.[0];
  const room = activeLease?.room;

  // Format tanggal bahasa Indonesia
  const formatDateIndo = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Perhitungan status sewa
  const end = activeLease?.endDate ? new Date(activeLease.endDate).getTime() : 0;
  const now = new Date().getTime();
  const rawDiffDays = activeLease?.endDate ? Math.ceil((end - now) / (1000 * 60 * 60 * 24)) : 0;
  const isExpired = activeLease && (rawDiffDays <= 0 || activeLease.status === "EXPIRED" || activeLease.status === "TERMINATED");

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-[#6B716D]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1F3D35]" />
        <p className="mt-3 text-sm font-medium">Memuat profil penghuni...</p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-500 border border-red-200 flex items-center justify-center mb-4 shadow-sm">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#202321]">Gagal Memuat Profil</h2>
        <p className="text-sm text-[#6B716D] mt-1.5 max-w-md">{error}</p>
        <button
          onClick={fetchProfile}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1F3D35] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#152923] transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Coba Muat Ulang</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-16 pt-4">
      
      {/* Header Profil */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="relative w-24 h-24 rounded-full shadow-lg overflow-hidden border-2 border-white mb-4 flex items-center justify-center bg-[#1F3D35] text-white text-3xl font-bold">
          {profile?.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name || "Foto Profil"}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          ) : (
            profile?.name ? profile.name.charAt(0).toUpperCase() : "U"
          )}
        </div>
        
        <h1 className="text-2xl font-bold text-[#202321] tracking-tight">{profile?.name || "Penghuni"}</h1>
        <p className="text-sm text-[#6B716D] mt-0.5">{profile?.email || "-"}</p>
        
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Penghuni Terverifikasi Kostara
          </span>

          <button
            onClick={() => setIsChangePasswordOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white hover:bg-[#F8F7F4] text-[#1F3D35] text-xs font-bold rounded-full border border-[#E5E3DE] hover:border-[#1F3D35] shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-[#C69C6D]" />
            <span>Ubah Kata Sandi</span>
          </button>
        </div>
      </div>

      <div className="space-y-8">

        {/* SECTION 1: Detail Kamar & Kontrak */}
        <section>
          <div className="flex items-center justify-between mb-3 px-2">
            <h2 className="text-xs font-bold text-[#6B716D] uppercase tracking-widest">Informasi Sewa Kamar</h2>
            {activeLease && (
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                isExpired 
                  ? "bg-red-50 text-red-700 border-red-200" 
                  : rawDiffDays <= 7 
                  ? "bg-amber-50 text-amber-700 border-amber-200" 
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}>
                {isExpired ? "Masa Sewa Berakhir" : rawDiffDays <= 7 ? "Mendekati Berakhir" : "Kontrak Aktif"}
              </span>
            )}
          </div>

          <div className="bg-white border border-[#E5E3DE] rounded-2xl overflow-hidden shadow-sm divide-y divide-[#E5E3DE]">
            
            <div className="flex items-center justify-between p-4 sm:p-5 bg-[#F8F7F4]/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E3DE] flex items-center justify-center text-[#1F3D35]">
                  <Home className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm text-[#202321]">Unit Kamar</span>
              </div>
              <span className="text-[#1F3D35] font-bold text-sm">
                {room ? `Kamar ${room.roomNumber} - ${room.roomType?.name || "Standar"}` : "Belum Ada Kamar Aktif"}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E3DE] flex items-center justify-center text-[#1F3D35]">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm text-[#202321]">Tarif Sewa Bulanan</span>
              </div>
              <span className="text-[#202321] font-bold text-sm">
                {activeLease ? `Rp ${activeLease.rentAmount?.toLocaleString("id-ID")}` : "-"}
              </span>
            </div>

            {/* Uang Jaminan / Deposit */}
            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E3DE] flex items-center justify-center text-[#1F3D35]">
                  <ShieldCheck className="w-4 h-4 text-[#C69C6D]" />
                </div>
                <span className="font-semibold text-sm text-[#202321]">Uang Jaminan (Deposit)</span>
              </div>
              <span className="text-[#202321] font-bold text-sm">
                {activeLease?.depositAmount && activeLease.depositAmount > 0
                  ? `Rp ${activeLease.depositAmount.toLocaleString("id-ID")}`
                  : "Tidak Ada Deposit"}
              </span>
            </div>

            {/* Periode Kontrak dengan Format Tanggal Indonesia */}
            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E3DE] flex items-center justify-center text-[#1F3D35]">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm text-[#202321]">Periode Kontrak</span>
              </div>
              <span className="text-[#6B716D] font-medium text-xs sm:text-sm text-right">
                {activeLease ? `${formatDateIndo(activeLease.startDate)} s/d ${formatDateIndo(activeLease.endDate)}` : "-"}
              </span>
            </div>

          </div>
        </section>

        {/* SECTION 2: Data Pribadi */}
        <section>
          <h2 className="text-xs font-bold text-[#6B716D] uppercase tracking-widest mb-3 px-2">Data Pribadi</h2>
          <div className="bg-white border border-[#E5E3DE] rounded-2xl overflow-hidden shadow-sm divide-y divide-[#E5E3DE]">
            
            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-[#C69C6D]" />
                <span className="font-semibold text-sm text-[#202321]">Nama Lengkap</span>
              </div>
              <span className="text-sm font-medium text-[#6B716D]">{tenant?.fullName || profile?.name}</span>
            </div>

            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#C69C6D]" />
                <span className="font-semibold text-sm text-[#202321]">NIK KTP</span>
              </div>
              <span className="text-sm font-medium text-[#6B716D]">{tenant?.nik || "-"}</span>
            </div>

            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C69C6D]" />
                <span className="font-semibold text-sm text-[#202321]">Email Akun</span>
              </div>
              <span className="text-sm font-medium text-[#6B716D]">{profile?.email}</span>
            </div>

            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C69C6D]" />
                <span className="font-semibold text-sm text-[#202321]">Nomor HP / WhatsApp</span>
              </div>
              <span className="text-sm font-medium text-[#6B716D]">{tenant?.phone || "-"}</span>
            </div>

            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-[#C69C6D]" />
                <span className="font-semibold text-sm text-[#202321]">Pekerjaan</span>
              </div>
              <span className="text-sm font-medium text-[#6B716D]">{tenant?.occupation || "-"}</span>
            </div>

          </div>
        </section>

        {/* SECTION 3: Kontak Darurat */}
        {tenant && (tenant.emergencyName || tenant.emergencyPhone) && (
          <section>
            <h2 className="text-xs font-bold text-[#6B716D] uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
              Kontak Darurat <HeartPulse className="w-4 h-4 text-red-500" />
            </h2>
            <div className="bg-white border border-[#E5E3DE] rounded-2xl overflow-hidden shadow-sm divide-y divide-[#E5E3DE]">
              
              <div className="flex items-center justify-between p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <Contact className="w-4 h-4 text-red-500" />
                  <span className="font-semibold text-sm text-[#202321]">Nama Kontak</span>
                </div>
                <span className="text-sm font-medium text-[#6B716D]">{tenant.emergencyName || "-"}</span>
              </div>

              <div className="flex items-center justify-between p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-red-500" />
                  <span className="font-semibold text-sm text-[#202321]">Hubungan</span>
                </div>
                <span className="text-sm font-medium text-[#6B716D]">{tenant.emergencyRelation || "-"}</span>
              </div>

              <div className="flex items-center justify-between p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-red-500" />
                  <span className="font-semibold text-sm text-[#202321]">Nomor HP</span>
                </div>
                <span className="text-sm font-medium text-[#6B716D]">{tenant.emergencyPhone || "-"}</span>
              </div>

            </div>
          </section>
        )}

      </div>

      {/* Modal Dialog Ganti Kata Sandi */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
}
