"use client";

import { useState } from "react";
import { MessageSquare, Calendar, Phone, CheckCircle2, XCircle, Clock, Trash2, UserPlus, Mail } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { apiFetch } from "@/lib/api";
import { createWhatsAppLink } from "@/lib/whatsapp";

export interface InquiryItem {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  nik?: string | null;
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
  onConvertToTenant?: (inquiry: InquiryItem) => void;
}

export default function InquiryTable({ inquiries, loading, onRefresh, onConvertToTenant }: InquiryTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      setUpdatingId(id);
      await apiFetch(`/api/admin/inquiries/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      onRefresh();
      toast.success(`Status berhasil diubah menjadi ${status === "CONTACTED" ? "Sudah Dihubungi" : "Deal"}`);
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      setUpdatingId(deletingId);
      await apiFetch(`/api/admin/inquiries/${deletingId}`, {
        method: "DELETE",
      });
      onRefresh();
      toast.success("Data reservasi berhasil dihapus permanen");
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus data reservasi");
    } finally {
      setUpdatingId(null);
      setDeletingId(null);
      setIsConfirmOpen(false);
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
              const waMessage = 
                `Halo Kak *${item.name}*, salam dari Pengelola Kostara! 👋\n` +
                `Menindaklanjuti permintaan reservasi kamar *${item.roomType?.name || "Kostara"}* Anda di website kami.\n\n` +
                `Untuk memproses pendaftaran resmi sebagai penghuni kos & pembuatan akun portal, mohon melengkapi data berikut ya Kak:\n` +
                `• Email (Gmail aktif): ${item.email || "[Mohon infokan Gmail Kakak di sini]"}\n` +
                `• NIK KTP (16 Digit): [Mohon kirimkan 16 digit NIK KTP Kakak di sini]\n\n` +
                `Data ini diperlukan untuk penerbitan kwitansi/invoice sewa resmi serta akses portal penghuni Kostara. Terima kasih! 🙏`;
              const waUrl = createWhatsAppLink(item.phone, waMessage);


              return (
                <tr key={item.id} className="hover:bg-[#F8F7F4]/60 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#202321]">{item.name}</p>
                    <p className="flex items-center gap-1 text-xs text-[#6B716D]">
                      <Phone className="h-3 w-3" />
                      <span>{item.phone}</span>
                    </p>
                    {item.email ? (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-[#1F3D35] font-medium">
                        <Mail className="h-3 w-3 text-[#C69C6D]" />
                        <span>{item.email}</span>
                      </p>
                    ) : (
                      <span className="mt-1 inline-block text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Gmail belum diisi (minta via WA)
                      </span>
                    )}
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
                        <>
                          <button
                            disabled={updatingId === item.id}
                            onClick={() => handleUpdateStatus(item.id, "CANCELLED")}
                            className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 cursor-pointer"
                          >
                            Tolak
                          </button>
                          <button
                            disabled={updatingId === item.id}
                            onClick={() => handleUpdateStatus(item.id, "CONTACTED")}
                            className="rounded-xl border border-[#E5E3DE] px-3 py-1.5 text-xs font-semibold text-[#1F3D35] hover:bg-[#F8F7F4] cursor-pointer"
                          >
                            Tandai Dihubungi
                          </button>
                          <button
                            disabled={updatingId === item.id}
                            onClick={() => {
                              if (onConvertToTenant) {
                                onConvertToTenant(item);
                              }
                            }}
                            className="flex items-center gap-1.5 rounded-xl bg-[#1F3D35] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#162E28] shadow-sm cursor-pointer"
                          >
                            <UserPlus className="h-3.5 w-3.5 text-[#C69C6D]" />
                            <span>Proses Jadi Penghuni</span>
                          </button>
                        </>
                      )}

                      {item.status === "CONTACTED" && (
                        <>
                          <button
                            disabled={updatingId === item.id}
                            onClick={() => handleUpdateStatus(item.id, "CANCELLED")}
                            className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 cursor-pointer"
                          >
                            Batal
                          </button>
                          <button
                            disabled={updatingId === item.id}
                            onClick={() => {
                              if (onConvertToTenant) {
                                onConvertToTenant(item);
                              } else {
                                handleUpdateStatus(item.id, "CONVERTED");
                              }
                            }}
                            className="flex items-center gap-1.5 rounded-xl bg-[#1F3D35] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#162E28] shadow-sm cursor-pointer"
                          >
                            <UserPlus className="h-3.5 w-3.5 text-[#C69C6D]" />
                            <span>Proses Jadi Penghuni</span>
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => {
                          setDeletingId(item.id);
                          setIsConfirmOpen(true);
                        }}
                        title="Hapus Permanen"
                        disabled={updatingId === item.id}
                        className="ml-2 flex items-center justify-center rounded-xl p-2 text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Hapus Data Reservasi"
        message="Apakah Anda yakin ingin menghapus data reservasi ini secara permanen? Data yang sudah dihapus tidak dapat dikembalikan."
        confirmText={updatingId === deletingId ? "Menghapus..." : "Ya, Hapus Permanen"}
        cancelText="Batal"
        onConfirm={handleDelete}
        onCancel={() => {
          if (updatingId === deletingId) return;
          setIsConfirmOpen(false);
          setDeletingId(null);
        }}
        variant="danger"
      />
    </div>
  );
}
