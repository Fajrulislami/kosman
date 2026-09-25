"use client";

import { useState } from "react";
import { X, Phone, Mail, Briefcase, Calendar, CreditCard, ShieldCheck, Loader2 } from "lucide-react";
import { TenantItem } from "@/types/admin";

interface TenantDetailSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: TenantItem | null;
  onCheckout?: (leaseId: string) => Promise<void>;
}

export default function TenantDetailSlideOver({
  isOpen,
  onClose,
  tenant,
  onCheckout,
}: TenantDetailSlideOverProps) {
  const [checkingOut, setCheckingOut] = useState(false);

  if (!isOpen || !tenant) return null;

  const handleCheckout = async () => {
    if (!tenant.leaseId) {
      alert("Penghuni tidak memiliki kontrak sewa aktif saat ini.");
      return;
    }

    if (!confirm(`Apakah Anda yakin ingin memproses check-out untuk ${tenant.name} dari ${tenant.room}? Kamar akan otomatis diubah statusnya menjadi Kosong.`)) {
      return;
    }

    try {
      setCheckingOut(true);
      if (onCheckout) {
        await onCheckout(tenant.leaseId);
      }
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal memproses check-out sewa");
    } finally {
      setCheckingOut(false);
    }
  };

  const handleOpenWA = () => {
    let cleanPhone = tenant.phone.replace(/\D/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.slice(1);
    }
    window.open(`https://wa.me/${cleanPhone}?text=Halo%20${encodeURIComponent(tenant.name)},%20kami%20dari%20Pengelola%20Kostara...`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1F3D35]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="pointer-events-auto w-screen max-w-md transform transition-all ease-in-out duration-300">
          <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-2xl">
            {/* Header */}
            <div className="bg-[#1F3D35] px-6 py-8 relative overflow-hidden text-white">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
              
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-white/10 text-2xl font-bold">
                    {tenant.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{tenant.name}</h2>
                    <p className="text-sm font-medium text-[#C69C6D]">{tenant.room}</p>
                  </div>
                </div>
                <div className="ml-3 flex h-7 items-center">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="relative flex-1 px-6 py-6 bg-[#F8F7F4] space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#99A09C]">Status Sewa</p>
                  <p className="mt-1 text-sm font-semibold text-[#1F3D35]">{tenant.status}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-[#E6F4EA] flex items-center justify-center">
                  <span className={`h-3 w-3 rounded-full ${tenant.status === "Aktif" ? "bg-[#1E8E3E]" : "bg-gray-400"}`}></span>
                </div>
              </div>

              {/* Data Diri */}
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#99A09C]">Informasi Pribadi</h3>
                <div className="rounded-2xl bg-white p-5 shadow-sm space-y-3.5">
                  <div className="flex items-start space-x-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-[#C69C6D]" />
                    <div>
                      <p className="text-xs font-medium text-[#99A09C]">NIK KTP</p>
                      <p className="text-sm font-semibold text-[#1F3D35]">{tenant.nik}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="mt-0.5 h-4 w-4 text-[#C69C6D]" />
                    <div>
                      <p className="text-xs font-medium text-[#99A09C]">No. WhatsApp</p>
                      <p className="text-sm font-semibold text-[#1F3D35]">{tenant.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Mail className="mt-0.5 h-4 w-4 text-[#C69C6D]" />
                    <div>
                      <p className="text-xs font-medium text-[#99A09C]">Email Portal</p>
                      <p className="text-sm font-semibold text-[#1F3D35]">{tenant.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Briefcase className="mt-0.5 h-4 w-4 text-[#C69C6D]" />
                    <div>
                      <p className="text-xs font-medium text-[#99A09C]">Pekerjaan</p>
                      <p className="text-sm font-semibold text-[#1F3D35]">{tenant.occupation}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Sewa */}
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#99A09C]">Informasi Sewa</h3>
                <div className="rounded-2xl bg-white p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-[#C69C6D]" />
                      <span className="text-sm font-medium text-[#99A09C]">Masa Sewa</span>
                    </div>
                    <span className="text-sm font-semibold text-[#1F3D35]">{tenant.startDate} s/d {tenant.endDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-4 w-4 text-[#C69C6D]" />
                      <span className="text-sm font-medium text-[#99A09C]">Tarif Sewa</span>
                    </div>
                    <span className="text-sm font-semibold text-[#1F3D35]">{tenant.rentAmount}/bulan</span>
                  </div>
                </div>
              </div>

              {/* Kontak Darurat */}
              {tenant.emergencyContact && tenant.emergencyContact.name !== "-" && (
                <div>
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#99A09C]">Kontak Darurat</h3>
                  <div className="rounded-2xl bg-white p-4 shadow-sm text-sm">
                    <p className="font-semibold text-[#1F3D35]">{tenant.emergencyContact.name} ({tenant.emergencyContact.relation})</p>
                    <p className="text-xs text-[#6B716D] mt-1">{tenant.emergencyContact.phone}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="border-t border-[#E5E3DE] bg-white px-6 py-5 flex space-x-3">
              <button
                onClick={handleOpenWA}
                className="flex-1 rounded-xl bg-[#1F3D35] py-3 text-sm font-bold text-white shadow-sm hover:bg-[#152923] transition-colors"
              >
                Kirim WA
              </button>
              {tenant.status === "Aktif" && tenant.leaseId && (
                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="rounded-xl border border-[#E54D2E] bg-white px-4 py-3 text-sm font-bold text-[#E54D2E] hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                  {checkingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : "Akhiri Sewa"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
