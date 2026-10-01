"use client";

import { useState, useEffect } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { RoomItem } from "@/types/admin";

interface EditRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  room: RoomItem | null;
}

interface RoomTypeOption {
  id: string;
  name: string;
  price: number;
  yearlyPrice: number;
}

export default function EditRoomModal({ isOpen, onClose, onSuccess, room }: EditRoomModalProps) {
  const [roomNumber, setRoomNumber] = useState("");
  const [floor, setFloor] = useState("1");
  const [roomTypeId, setRoomTypeId] = useState("");
  const [status, setStatus] = useState("AVAILABLE");
  const [notes, setNotes] = useState("");
  
  const [roomTypes, setRoomTypes] = useState<RoomTypeOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingTypes, setFetchingTypes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (room) {
      setRoomNumber(room.number || "");
      setFloor(room.floor ? room.floor.toString() : "1");
      setRoomTypeId(room.roomTypeId || "");
      setStatus(room.rawStatus || "AVAILABLE");
      setNotes(room.notes || "");
    }
  }, [room]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchTypes = async () => {
      try {
        setFetchingTypes(true);
        const res = await apiFetch<{ data: any[] }>("/api/public/rooms");
        if (res.data && res.data.length > 0) {
          setRoomTypes(res.data);
          if (!roomTypeId) {
            setRoomTypeId(res.data[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch room types:", err);
      } finally {
        setFetchingTypes(false);
      }
    };

    fetchTypes();
  }, [isOpen, roomTypeId]);

  if (!isOpen || !room) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiFetch(`/api/admin/rooms/${room.id}`, {
        method: "PUT",
        body: JSON.stringify({
          roomNumber,
          floor: parseInt(floor),
          roomTypeId,
          status,
          notes: notes || null,
        }),
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memperbarui kamar");
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
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div className="relative z-10 flex w-full max-w-lg max-h-[90vh] flex-col transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all">
        
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-[#E5E3DE] p-6 pb-4 sm:px-8 sm:pt-8">
          <h3 className="text-xl font-bold text-[#1F3D35]">
            Edit Kamar {room.number}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#99A09C] transition-colors hover:bg-[#F8F7F4] hover:text-[#1F3D35]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 sm:px-8 space-y-5">
            {error && (
              <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Nomor Kamar & Lantai */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="editRoomNumber" className="block text-sm font-semibold text-[#1F3D35]">
                  Nomor Kamar <span className="text-[#E54D2E]">*</span>
                </label>
                <input
                  type="text"
                  id="editRoomNumber"
                  required
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 text-[#1F3D35] ring-1 ring-inset ring-[#E5E3DE] placeholder:text-[#99A09C] focus:ring-2 focus:ring-inset focus:ring-[#C69C6D] sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="editFloor" className="block text-sm font-semibold text-[#1F3D35]">
                  Lantai
                </label>
                <select
                  id="editFloor"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="mt-2 block w-full rounded-xl border-0 py-2.5 pl-3 pr-10 text-[#1F3D35] ring-1 ring-inset ring-[#E5E3DE] focus:ring-2 focus:ring-[#C69C6D] sm:text-sm"
                >
                  <option value="1">Lantai 1</option>
                  <option value="2">Lantai 2</option>
                </select>
              </div>
            </div>

            {/* Tipe Kamar & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="editRoomType" className="block text-sm font-semibold text-[#1F3D35]">
                  Tipe Kamar <span className="text-[#E54D2E]">*</span>
                </label>
                <select
                  id="editRoomType"
                  disabled={fetchingTypes}
                  value={roomTypeId}
                  onChange={(e) => setRoomTypeId(e.target.value)}
                  className="mt-2 block w-full rounded-xl border-0 py-2.5 pl-3 pr-10 text-[#1F3D35] ring-1 ring-inset ring-[#E5E3DE] focus:ring-2 focus:ring-[#C69C6D] sm:text-sm"
                >
                  {roomTypes.map((rt) => (
                    <option key={rt.id} value={rt.id}>
                      {rt.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="editStatus" className="block text-sm font-semibold text-[#1F3D35]">
                  Status Kamar
                </label>
                <select
                  id="editStatus"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-2 block w-full rounded-xl border-0 py-2.5 pl-3 pr-10 text-[#1F3D35] ring-1 ring-inset ring-[#E5E3DE] focus:ring-2 focus:ring-[#C69C6D] sm:text-sm"
                >
                  <option value="AVAILABLE">Tersedia (Kosong)</option>
                  <option value="OCCUPIED">Terisi</option>
                  <option value="MAINTENANCE">Perbaikan</option>
                  <option value="RESERVED">Dipesan</option>
                </select>
              </div>
            </div>

            {/* Catatan Khusus */}
            <div>
              <label htmlFor="editNotes" className="block text-sm font-semibold text-[#1F3D35]">
                Catatan Khusus <span className="text-[#99A09C] font-normal">(Opsional)</span>
              </label>
              <textarea
                id="editNotes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tambahkan catatan internal tentang unit kamar ini..."
                className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 text-[#1F3D35] ring-1 ring-inset ring-[#E5E3DE] placeholder:text-[#99A09C] focus:ring-2 focus:ring-inset focus:ring-[#C69C6D] sm:text-sm"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t border-[#E5E3DE] bg-[#F8F7F4] p-6 sm:px-8">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#E5E3DE] bg-white px-5 py-2.5 text-sm font-semibold text-[#6B716D] transition-colors hover:bg-gray-50 hover:text-[#1F3D35]"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-[#1F3D35] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#2A5247] disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
