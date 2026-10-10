"use client";

import { useState, useEffect } from "react";
import { X, User, Phone, ShieldCheck, Briefcase, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import { TenantItem } from "@/types/admin";

interface EditTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: TenantItem | null;
  onSuccess?: () => void;
}

export default function EditTenantModal({ isOpen, onClose, tenant, onSuccess }: EditTenantModalProps) {
  const [fullName, setFullName] = useState("");
  const [nik, setNik] = useState("");
  const [phone, setPhone] = useState("");
  const [occupation, setOccupation] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyRelation, setEmergencyRelation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && tenant) {
      setFullName(tenant.name || "");
      setNik(tenant.nik || "");
      setPhone(tenant.phone || "");
      setOccupation(tenant.occupation && tenant.occupation !== "-" ? tenant.occupation : "");
      setEmergencyName(tenant.emergencyContact?.name && tenant.emergencyContact.name !== "-" ? tenant.emergencyContact.name : "");
      setEmergencyPhone(tenant.emergencyContact?.phone && tenant.emergencyContact.phone !== "-" ? tenant.emergencyContact.phone : "");
      setEmergencyRelation(tenant.emergencyContact?.relation && tenant.emergencyContact.relation !== "-" ? tenant.emergencyContact.relation : "");
    }
  }, [isOpen, tenant]);

  if (!isOpen || !tenant) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nik.length !== 16) {
      setError("NIK harus tepat 16 digit");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiFetch(`/api/admin/tenants/${tenant.id}`, {
        method: "PUT",
        body: JSON.stringify({
          fullName,
          nik,
          phone,
          occupation: occupation || undefined,
          emergencyName: emergencyName || undefined,
          emergencyPhone: emergencyPhone || undefined,
          emergencyRelation: emergencyRelation || undefined,
        }),
      });

      toast.success("Data penghuni berhasil diperbarui!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Gagal memperbarui data penghuni");
      toast.error(err.message || "Gagal memperbarui data penghuni");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#1F3D35]/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative z-10 flex w-full max-w-xl max-h-[90vh] flex-col transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
        <div className="flex flex-shrink-0 items-center justify-between border-b border-[#E5E3DE] px-6 py-5">
          <div>
            <h3 className="text-xl font-bold text-[#1F3D35]">Edit Data Penghuni</h3>
            <p className="mt-1 text-sm text-[#6B716D]">Perbarui informasi profil {tenant.name}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-[#99A09C] hover:bg-[#F8F7F4] hover:text-[#1F3D35]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-[#1F3D35]">Nama Lengkap <span className="text-[#E54D2E]">*</span></label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:border-[#C69C6D] focus:ring-1 focus:ring-[#C69C6D]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1F3D35]">NIK (16 Digit) <span className="text-[#E54D2E]">*</span></label>
                <div className="relative mt-1.5">
                  <ShieldCheck className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
                  <input type="text" required maxLength={16} value={nik} onChange={(e) => setNik(e.target.value.replace(/\D/g, ""))} className="w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:border-[#C69C6D] focus:ring-1 focus:ring-[#C69C6D]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F3D35]">Nomor HP / WA <span className="text-[#E54D2E]">*</span></label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
                  <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:border-[#C69C6D] focus:ring-1 focus:ring-[#C69C6D]" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1F3D35]">Pekerjaan / Instansi <span className="text-[#99A09C] font-normal">(Opsional)</span></label>
              <div className="relative mt-1.5">
                <Briefcase className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
                <input type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} className="w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:border-[#C69C6D] focus:ring-1 focus:ring-[#C69C6D]" />
              </div>
            </div>
            
            <div className="pt-4 border-t border-[#E5E3DE]">
              <h4 className="text-sm font-bold text-[#1F3D35] mb-4">Kontak Darurat (Opsional)</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1F3D35]">Nama Kontak</label>
                  <input type="text" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} className="mt-1.5 w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-2.5 px-3 text-sm font-medium outline-none focus:border-[#C69C6D] focus:ring-1 focus:ring-[#C69C6D]" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1F3D35]">No. HP Darurat</label>
                    <input type="text" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} className="mt-1.5 w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-2.5 px-3 text-sm font-medium outline-none focus:border-[#C69C6D] focus:ring-1 focus:ring-[#C69C6D]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1F3D35]">Hubungan</label>
                    <input type="text" value={emergencyRelation} onChange={(e) => setEmergencyRelation(e.target.value)} placeholder="Contoh: Orang Tua, Kakak" className="mt-1.5 w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-2.5 px-3 text-sm font-medium outline-none focus:border-[#C69C6D] focus:ring-1 focus:ring-[#C69C6D]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t border-[#E5E3DE] bg-[#F8F7F4] p-5">
            <button type="button" onClick={onClose} className="rounded-xl border border-[#E5E3DE] bg-white px-5 py-2.5 text-sm font-semibold text-[#6B716D] hover:bg-gray-50">Batal</button>
            <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-xl bg-[#1F3D35] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#2A5247] disabled:opacity-50">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
