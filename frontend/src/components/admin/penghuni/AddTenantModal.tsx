"use client";

import { useState, useEffect } from "react";
import { X, User, Phone, Home, Mail, ShieldCheck, Briefcase, Calendar, Loader2, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { RoomItem } from "@/types/admin";

interface AddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddTenantModal({ isOpen, onClose, onSuccess }: AddTenantModalProps) {
  const [fullName, setFullName] = useState("");
  const [nik, setNik] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roomId, setRoomId] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  
  // Set default end date to 1 year ahead
  const defaultEndDate = new Date();
  defaultEndDate.setFullYear(defaultEndDate.getFullYear() + 1);
  const [endDate, setEndDate] = useState(defaultEndDate.toISOString().split("T")[0]);

  const [occupation, setOccupation] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyRelation, setEmergencyRelation] = useState("Orang Tua");

  const [availableRooms, setAvailableRooms] = useState<RoomItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingRooms, setFetchingRooms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchRooms = async () => {
      try {
        setFetchingRooms(true);
        const res = await apiFetch<{ data: RoomItem[] }>("/api/admin/rooms?status=AVAILABLE");
        const available = (res.data || []).filter((r) => r.rawStatus === "AVAILABLE");
        setAvailableRooms(available);
        if (available.length > 0) {
          setRoomId(available[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch available rooms:", err);
      } finally {
        setFetchingRooms(false);
      }
    };

    fetchRooms();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId) {
      setError("Silakan pilih kamar yang tersedia terlebih dahulu");
      return;
    }
    if (nik.length !== 16) {
      setError("NIK harus tepat 16 digit");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiFetch("/api/admin/tenants", {
        method: "POST",
        body: JSON.stringify({
          fullName,
          nik,
          phone,
          email,
          password: password || undefined,
          roomId,
          startDate,
          endDate,
          occupation: occupation || undefined,
          emergencyName: emergencyName || undefined,
          emergencyPhone: emergencyPhone || undefined,
          emergencyRelation: emergencyRelation || undefined,
        }),
      });

      // Reset
      setFullName("");
      setNik("");
      setPhone("");
      setEmail("");
      setPassword("");
      setOccupation("");
      setEmergencyName("");
      setEmergencyPhone("");

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mendaftarkan penghuni baru");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1F3D35]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="relative z-10 flex w-full max-w-xl max-h-[90vh] flex-col transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-[#E5E3DE] px-6 py-5">
          <div>
            <h3 className="text-xl font-bold text-[#1F3D35]">Daftarkan Penghuni Baru</h3>
            <p className="mt-1 text-sm text-[#6B716D]">Masukkan identitas penghuni dan alokasikan kamar aktif</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#99A09C] hover:bg-[#F8F7F4] hover:text-[#1F3D35] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Nama Lengkap */}
            <div>
              <label className="block text-sm font-semibold text-[#1F3D35]">
                Nama Lengkap <span className="text-[#E54D2E]">*</span>
              </label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Misal: Budi Santoso"
                  className="w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:border-[#C69C6D] focus:ring-1 focus:ring-[#C69C6D]"
                />
              </div>
            </div>

            {/* NIK & Kontak HP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1F3D35]">
                  NIK (16 Digit) <span className="text-[#E54D2E]">*</span>
                </label>
                <div className="relative mt-1.5">
                  <ShieldCheck className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={nik}
                    onChange={(e) => setNik(e.target.value.replace(/\D/g, ""))}
                    placeholder="3201xxxxxxxxxxxx"
                    className="w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:border-[#C69C6D] focus:ring-1 focus:ring-[#C69C6D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F3D35]">
                  Nomor HP / WA <span className="text-[#E54D2E]">*</span>
                </label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="081234567890"
                    className="w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:border-[#C69C6D] focus:ring-1 focus:ring-[#C69C6D]"
                  />
                </div>
              </div>
            </div>

            {/* Email & Password Akun Portal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1F3D35]">
                  Email Akun Portal <span className="text-[#E54D2E]">*</span>
                </label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="penghuni@email.com"
                    className="w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:border-[#C69C6D] focus:ring-1 focus:ring-[#C69C6D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F3D35]">
                  Password Awal <span className="text-xs text-[#99A09C]">(Default: kostara123456)</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="mt-1.5 w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-2.5 px-3 text-sm font-medium outline-none focus:border-[#C69C6D] focus:ring-1 focus:ring-[#C69C6D]"
                />
              </div>
            </div>

            {/* Pilih Kamar */}
            <div>
              <label className="block text-sm font-semibold text-[#1F3D35]">
                Pilih Kamar yang Tersedia <span className="text-[#E54D2E]">*</span>
              </label>
              <div className="relative mt-1.5">
                <Home className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
                <select
                  required
                  disabled={fetchingRooms || availableRooms.length === 0}
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-2.5 pl-10 pr-10 text-sm font-medium text-[#1F3D35] outline-none focus:border-[#C69C6D] focus:ring-1 focus:ring-[#C69C6D]"
                >
                  {availableRooms.length === 0 ? (
                    <option value="">Tidak ada kamar kosong yang tersedia</option>
                  ) : (
                    availableRooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        Kamar {r.number} - {r.type} ({r.price}/bulan)
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Periode Sewa */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1F3D35]">
                  Mulai Sewa <span className="text-[#E54D2E]">*</span>
                </label>
                <div className="relative mt-1.5">
                  <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:border-[#C69C6D] focus:ring-1 focus:ring-[#C69C6D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F3D35]">
                  Selesai Sewa <span className="text-[#E54D2E]">*</span>
                </label>
                <div className="relative mt-1.5">
                  <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:border-[#C69C6D] focus:ring-1 focus:ring-[#C69C6D]"
                  />
                </div>
              </div>
            </div>

            {/* Pekerjaan */}
            <div>
              <label className="block text-sm font-semibold text-[#1F3D35]">
                Pekerjaan / Instansi <span className="text-[#99A09C] font-normal">(Opsional)</span>
              </label>
              <div className="relative mt-1.5">
                <Briefcase className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="Misal: Mahasiswa / Software Engineer"
                  className="w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:border-[#C69C6D] focus:ring-1 focus:ring-[#C69C6D]"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t border-[#E5E3DE] bg-[#F8F7F4] p-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#E5E3DE] bg-white px-5 py-2.5 text-sm font-semibold text-[#6B716D] hover:bg-gray-50 hover:text-[#1F3D35]"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || availableRooms.length === 0}
              className="flex items-center gap-2 rounded-xl bg-[#1F3D35] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#2A5247] disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Simpan & Alokasikan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
