"use client";

import { useState } from "react";
import { MessageSquare, Calendar, Phone, CheckCircle2, XCircle, Clock } from "lucide-react";
import { apiFetch } from "@/lib/api";

export interface InquiryItem {
  id: string;
  name: string;
  phone: string;
  checkInDate: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
  roomType?: {
    name: string;
    basePrice: number;
  } | null;
}

interface InquiryTableProps {
  inquiries: InquiryItem[];
  loading: boolean;
  onRefresh: () => void;
}

export default function InquiryTable({ inquiries, loading, onRefresh }: InquiryTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      setUpdatingId(id);
      await apiFetch(`/api/admin/inquiries/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      onRefresh();
    } catch (err: any) {
      alert(err.message || "Gagal memperbarui status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#E5E3DE] bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-[#6B716D]">Memuat data reservasi & calon penyewa...</p>
      </div>
    );
  }

  if (inquiries.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E5E3DE] bg-white p-12 text-center shadow-sm">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F8F7F4] text-[#1F3D35]">
          <Calendar className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-[#202321]">Belum Ada Permintaan Reservasi Baru</h3>
        <p className="mt-1 text-xs text-[#6B716D]">
          Calon penghuni yang memesan atau menjadwalkan survey melalui website publik akan muncul di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E3DE] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#E5E3DE] bg-[#F8F7F4] text-xs font-bold text-[#6B716D]">
            <tr>
              <th className="px-6 py-4">Calon Penghuni</th>
              <th className="px-6 py-4">Kamar Diminati</th>
              <th className="px-6 py-4">Rencana Masuk</th>
              <th className="px-6 py-4">Catatan / Kebutuhan</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E3DE]">
            {inquiries.map((item) => {
              const waText = encodeURIComponent(
                `Halo ${item.name}, saya dari Pengelola Kostara. Menindaklanjuti permintaan reservasi kamar ${
                  item.roomType?.name || ""
                } Anda di website kami.`
              );
              const cleanPhone = item.phone.replace(/^0/, "62");
              const waUrl = `https://wa.me/${cleanPhone}?text=${waText}`;

              return (
                <tr key={item.id} className="hover:bg-[#F8F7F4]/60 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#202321]">{item.name}</p>
                    <p className="flex items-center gap-1 text-xs text-[#6B716D]">
                      <Phone className="h-3 w-3" />
                      <span>{item.phone}</span>
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-semibold text-[#1F3D35]">
                      {item.roomType?.name || "Tipe Umum"}
                    </span>
                    {item.roomType?.basePrice && (
                      <p className="text-xs text-[#6B716D]">
                        Rp {item.roomType.basePrice.toLocaleString("id-ID")}/bln
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-4 text-[#6B716D]">
                    {item.checkInDate ? (
                      <span className="font-medium text-[#202321]">
                        {new Date(item.checkInDate).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    ) : (
                      <span className="text-xs text-[#99A09C]">Fleksibel</span>
                    )}
                  </td>

                  <td className="px-6 py-4 max-w-xs text-xs text-[#6B716D]">
                    {item.notes ? (
                      <p className="truncate" title={item.notes}>
                        {item.notes}
                      </p>
                    ) : (
                      <span className="text-[#99A09C]">-</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                        item.status === "NEW"
                          ? "bg-amber-100 text-amber-800"
                          : item.status === "CONTACTED"
                          ? "bg-blue-100 text-blue-800"
                          : item.status === "CONVERTED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.status === "NEW" && <Clock className="h-3 w-3" />}
                      {item.status === "CONVERTED" && <CheckCircle2 className="h-3 w-3" />}
                      {item.status === "CANCELLED" && <XCircle className="h-3 w-3" />}
                      {item.status === "NEW"
                        ? "Baru"
                        : item.status === "CONTACTED"
                        ? "Sudah Dihubungi"
                        : item.status === "CONVERTED"
                        ? "Deal / Jadi Penyewa"
                        : "Batal"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Chat WA</span>
                      </a>

                      {item.status === "NEW" && (
                        <button
                          disabled={updatingId === item.id}
                          onClick={() => handleUpdateStatus(item.id, "CONTACTED")}
                          className="rounded-xl border border-[#E5E3DE] px-3 py-1.5 text-xs font-semibold text-[#1F3D35] hover:bg-[#F8F7F4]"
                        >
                          Tandai Dihubungi
                        </button>
                      )}

                      {item.status === "CONTACTED" && (
                        <button
                          disabled={updatingId === item.id}
                          onClick={() => handleUpdateStatus(item.id, "CONVERTED")}
                          className="rounded-xl bg-[#1F3D35] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#162E28]"
                        >
                          Tandai Deal
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
