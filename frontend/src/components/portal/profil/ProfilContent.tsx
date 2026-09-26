"use client";

import { useState, useEffect } from "react";
import { 
  User, Mail, Phone, MapPin, Key, ShieldCheck, 
  Home, Calendar, CreditCard, HeartPulse, Loader2, Contact, Briefcase
} from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function ProfilContent() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await apiFetch<{ authenticated: boolean; user: any }>("/api/auth/me");
        setProfile(res.user);
      } catch (err) {
        console.error("Failed to load tenant profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const tenant = profile?.tenant;
  const activeLease = tenant?.leases?.[0];
  const room = activeLease?.room;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-[#6B716D]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1F3D35]" />
        <p className="mt-3 text-sm font-medium">Memuat profil penghuni...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-16 pt-4">
      
      {/* Header Profil */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-24 h-24 bg-[#1F3D35] rounded-full shadow-lg flex items-center justify-center text-white text-3xl font-bold mb-4">
          {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
        </div>
        <h1 className="text-2xl font-bold text-[#202321] tracking-tight">{profile?.name || "Penghuni"}</h1>
        <p className="text-sm text-[#6B716D] mt-0.5">{profile?.email || "-"}</p>
        
        <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          Penghuni Terverifikasi Kostara
        </span>
      </div>

      <div className="space-y-8">

        {/* SECTION 1: Detail Kamar & Kontrak */}
        <section>
          <h2 className="text-xs font-bold text-[#6B716D] uppercase tracking-widest mb-3 px-2">Informasi Sewa Kamar</h2>
          <div className="bg-white border border-[#E5E3DE] rounded-2xl overflow-hidden shadow-sm divide-y divide-[#E5E3DE]">
            
            <div className="flex items-center justify-between p-4 sm:p-5 bg-[#F8F7F4]/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E3DE] flex items-center justify-center text-[#1F3D35]">
                  <Home className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm text-[#202321]">Unit Kamar</span>
              </div>
              <span className="text-[#1F3D35] font-bold text-sm">
                {room ? `Kamar ${room.roomNumber} - ${room.roomType?.name || "Standar"}` : "-"}
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

            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E3DE] flex items-center justify-center text-[#1F3D35]">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm text-[#202321]">Periode Kontrak</span>
              </div>
              <span className="text-[#6B716D] font-medium text-xs sm:text-sm text-right">
                {activeLease ? `${activeLease.startDate?.split("T")[0]} s/d ${activeLease.endDate?.split("T")[0]}` : "-"}
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
    </div>
  );
}
