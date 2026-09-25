"use client";

import { useState } from "react";
import { Trash2, Loader2, AlertCircle } from "lucide-react";
import { RoomItem } from "@/types/admin";

interface RoomTableProps {
  rooms: RoomItem[];
  loading?: boolean;
  onDelete?: (id: string) => Promise<void>;
}

export default function RoomTable({ rooms, loading = false, onDelete }: RoomTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, roomNumber: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kamar ${roomNumber}?`)) {
      return;
    }

    try {
      setDeletingId(id);
      if (onDelete) {
        await onDelete(id);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus kamar");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#E5E3DE]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#E5E3DE] text-left text-sm">
          <thead className="bg-[#F8F7F4]">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 font-semibold text-[#1F3D35] sm:pl-6">
                No. Kamar
              </th>
              <th scope="col" className="px-3 py-3.5 font-semibold text-[#1F3D35]">
                Tipe
              </th>
              <th scope="col" className="px-3 py-3.5 font-semibold text-[#1F3D35]">
                Lantai
              </th>
              <th scope="col" className="px-3 py-3.5 font-semibold text-[#1F3D35]">
                Harga/Bulan
              </th>
              <th scope="col" className="px-3 py-3.5 font-semibold text-[#1F3D35]">
                Penghuni Saat Ini
              </th>
              <th scope="col" className="px-3 py-3.5 font-semibold text-[#1F3D35]">
                Status
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E3DE] bg-white">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#6B716D]">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-[#1F3D35]" />
                    <span>Memuat data kamar...</span>
                  </div>
                </td>
              </tr>
            ) : rooms.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#6B716D]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="h-8 w-8 text-[#99A09C]" />
                    <p className="font-medium text-[#202321]">Tidak ada data kamar ditemukan</p>
                    <p className="text-xs text-[#99A09C]">Coba ubah kata kunci pencarian atau filter status</p>
                  </div>
                </td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr key={room.id} className="transition-colors hover:bg-[#F8F7F4]/50">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 font-bold text-[#1F3D35] sm:pl-6">
                    {room.number}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-[#6B716D]">
                    {room.type}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-[#6B716D]">
                    Lantai {room.floor}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 font-medium text-[#202321]">
                    {room.price}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-[#1F3D35]">
                    {room.tenant}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        room.status === "Terisi"
                          ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                          : room.status === "Kosong"
                          ? "bg-green-50 text-green-700 ring-green-600/20"
                          : "bg-amber-50 text-amber-700 ring-amber-600/20"
                      }`}
                    >
                      {room.status}
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button
                      onClick={() => handleDelete(room.id, room.number)}
                      disabled={deletingId === room.id || room.rawStatus === "OCCUPIED"}
                      title={room.rawStatus === "OCCUPIED" ? "Kamar terisi tidak dapat dihapus" : "Hapus kamar"}
                      className="inline-flex items-center gap-1 rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {deletingId === room.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination / Total count footer */}
      <div className="flex items-center justify-between border-t border-[#E5E3DE] bg-white px-4 py-3 sm:px-6">
        <p className="text-sm text-[#6B716D]">
          Menampilkan <span className="font-semibold text-[#1F3D35]">{rooms.length}</span> kamar
        </p>
      </div>
    </div>
  );
}
