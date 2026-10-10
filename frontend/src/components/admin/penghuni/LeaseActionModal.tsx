"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Home, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import { TenantItem, RoomItem } from "@/types/admin";

interface LeaseActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: TenantItem | null;
  onSuccess?: () => void;
}

export default function LeaseActionModal({ isOpen, onClose, tenant, onSuccess }: LeaseActionModalProps) {
  const [activeTab, setActiveTab] = useState<"extend" | "move">("extend");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extend Lease State
  const [endDate, setEndDate] = useState("");

  // Move Room State
  const [availableRooms, setAvailableRooms] = useState<RoomItem[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [fetchingRooms, setFetchingRooms] = useState(false);

  useEffect(() => {
    if (isOpen && tenant) {
      if (tenant.endDate && tenant.endDate !== "-") {
        // Convert yyyy-mm-dd format safely
        setEndDate(tenant.endDate);
      } else {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        setEndDate(date.toISOString().split("T")[0]);
      }
      
      if (activeTab === "move") {
        fetchRooms();
      }
    }
  }, [isOpen, tenant, activeTab]);

  const fetchRooms = async () => {
    try {
      setFetchingRooms(true);
      const res = await apiFetch<{ data: RoomItem[] }>("/api/admin/rooms?status=AVAILABLE");
      const available = (res.data || []).filter((r) => r.rawStatus === "AVAILABLE");
      setAvailableRooms(available);
      if (available.length > 0) {
        setSelectedRoomId(available[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch available rooms:", err);
    } finally {
      setFetchingRooms(false);
    }
  };

  if (!isOpen || !tenant) return null;
  
  if (!tenant.leaseId) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-[#1F3D35]/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-bold text-[#1F3D35]">Penghuni Tidak Aktif</h3>
          <p className="mt-2 text-sm text-[#6B716D]">Penghuni ini tidak memiliki kontrak sewa yang aktif sehingga tidak dapat diperpanjang atau dipindah kamar.</p>
          <button onClick={onClose} className="mt-6 w-full rounded-xl bg-[#F8F7F4] py-2.5 font-bold text-[#1F3D35] hover:bg-[#E5E3DE]">Tutup</button>
        </div>
      </div>
    );
  }

  const handleExtend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiFetch(`/api/admin/leases/${tenant.leaseId}/extend`, {
        method: "PUT",
        body: JSON.stringify({ endDate }),
      });
      toast.success("Masa sewa berhasil diperpanjang!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Gagal memperpanjang sewa");
      toast.error(err.message || "Gagal memperpanjang sewa");
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomId) {
      setError("Pilih kamar tujuan terlebih dahulu");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      await apiFetch(`/api/admin/leases/${tenant.leaseId}/move`, {
        method: "PUT",
        body: JSON.stringify({ newRoomId: selectedRoomId }),
      });
      toast.success("Berhasil memindahkan penghuni ke kamar baru!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Gagal memproses pindah kamar");
      toast.error(err.message || "Gagal memproses pindah kamar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#1F3D35]/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative z-10 flex w-full max-w-md flex-col transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
        <div className="flex items-center justify-between border-b border-[#E5E3DE] px-6 py-5">
          <h3 className="text-xl font-bold text-[#1F3D35]">Aksi Sewa</h3>
          <button onClick={onClose} className="rounded-full p-2 text-[#99A09C] hover:bg-[#F8F7F4] hover:text-[#1F3D35]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex border-b border-[#E5E3DE]">
          <button
            onClick={() => setActiveTab("extend")}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === "extend" ? "border-b-2 border-[#1F3D35] text-[#1F3D35]" : "text-[#99A09C] hover:bg-[#F8F7F4]"}`}
          >
            Perpanjang
          </button>
          <button
            onClick={() => setActiveTab("move")}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === "move" ? "border-b-2 border-[#1F3D35] text-[#1F3D35]" : "text-[#99A09C] hover:bg-[#F8F7F4]"}`}
          >
            Pindah Kamar
          </button>
        </div>

        {error && (
          <div className="m-6 mb-0 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {activeTab === "extend" ? (
          <form onSubmit={handleExtend} className="flex flex-col p-6">
            <div className="mb-6 rounded-xl bg-[#F8F7F4] p-4 text-sm">
              <p className="text-[#6B716D]">Kamar saat ini: <span className="font-bold text-[#1F3D35]">{tenant.room}</span></p>
              <p className="text-[#6B716D]">Berakhir pada: <span className="font-bold text-[#1F3D35]">{tenant.endDate}</span></p>
            </div>

            <label className="block text-sm font-semibold text-[#1F3D35] mb-1.5">Pilih Tanggal Berakhir Baru <span className="text-[#E54D2E]">*</span></label>
            <div className="relative mb-6">
              <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
              <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:border-[#C69C6D] focus:ring-1 focus:ring-[#C69C6D]" />
            </div>

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1F3D35] py-3 text-sm font-bold text-white shadow-sm hover:bg-[#2A5247] disabled:opacity-50">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Simpan Perpanjangan</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleMove} className="flex flex-col p-6">
            <div className="mb-6 rounded-xl bg-[#F8F7F4] p-4 text-sm">
              <p className="text-[#6B716D]">Kamar lama: <span className="font-bold text-[#1F3D35]">{tenant.room}</span></p>
              <p className="text-xs text-[#99A09C] mt-1">Kamar ini akan diubah statusnya menjadi Kosong.</p>
            </div>

            <label className="block text-sm font-semibold text-[#1F3D35] mb-1.5">Pilih Kamar Tujuan <span className="text-[#E54D2E]">*</span></label>
            <div className="relative mb-6">
              <Home className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
              <select
                required
                disabled={fetchingRooms || availableRooms.length === 0}
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-2.5 pl-10 pr-10 text-sm font-medium text-[#1F3D35] outline-none focus:border-[#C69C6D] focus:ring-1 focus:ring-[#C69C6D]"
              >
                {availableRooms.length === 0 ? (
                  <option value="">Tidak ada kamar kosong</option>
                ) : (
                  availableRooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      Kamar {r.number} - {r.type} ({r.price}/bulan)
                    </option>
                  ))
                )}
              </select>
            </div>

            <button type="submit" disabled={loading || availableRooms.length === 0} className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1F3D35] py-3 text-sm font-bold text-white shadow-sm hover:bg-[#2A5247] disabled:opacity-50">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Pindahkan Kamar</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
