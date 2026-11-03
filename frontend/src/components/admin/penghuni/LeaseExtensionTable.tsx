"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Phone,
  CheckCircle2,
  XCircle,
  FileText,
  AlertTriangle,
  ArrowRight,
  Search,
  MessageSquare,
  Sparkles,
  Receipt,
  Home,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import { createWhatsAppLink } from "@/lib/whatsapp";
import { LeaseExtensionItem } from "@/types/admin";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface LeaseExtensionTableProps {
  extensions: LeaseExtensionItem[];
  loading: boolean;
  onRefresh: () => void;
}

export default function LeaseExtensionTable({
  extensions,
  loading,
  onRefresh,
}: LeaseExtensionTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");

  // State untuk Modal Persetujuan
  const [selectedForApprove, setSelectedForApprove] = useState<LeaseExtensionItem | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  // State untuk Modal Penolakan
  const [selectedForReject, setSelectedForReject] = useState<LeaseExtensionItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  const filtered = extensions.filter((item) => {
    const matchesSearch =
      item.tenant.fullName.toLowerCase().includes(search.toLowerCase()) ||
      item.room.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      item.tenant.phone.includes(search);

    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleApprove = async () => {
    if (!selectedForApprove) return;
    try {
      setIsApproving(true);
      const res = await apiFetch<{ success: boolean; message: string }>(
        `/api/admin/leases/extensions/${selectedForApprove.id}/approve`,
        {
          method: "PUT",
          body: JSON.stringify({ adminNotes: "Disetujui oleh Admin" }),
        }
      );
      toast.success(res.message || "Perpanjangan sewa berhasil disetujui!");
      setSelectedForApprove(null);
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyetujui perpanjangan sewa");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!selectedForReject) return;
    try {
      setIsRejecting(true);
      await apiFetch(`/api/admin/leases/extensions/${selectedForReject.id}/reject`, {
        method: "PUT",
        body: JSON.stringify({ adminNotes: rejectReason.trim() || "Ditolak oleh Admin" }),
      });
      toast.success("Pengajuan perpanjangan sewa telah ditolak.");
      setSelectedForReject(null);
      setRejectReason("");
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Gagal menolak perpanjangan sewa");
    } finally {
      setIsRejecting(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B716D]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari penghuni atau no kamar..."
            className="w-full rounded-xl border border-[#E5E3DE] bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-[#1F3D35] placeholder-[#99A09C] shadow-xs focus:border-[#1F3D35] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((st) => {
            const count =
              st === "ALL"
                ? extensions.length
                : extensions.filter((e) => e.status === st).length;

            const labels = {
              ALL: "Semua",
              PENDING: "Menunggu",
              APPROVED: "Disetujui",
              REJECTED: "Ditolak",
            };

            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === st
                    ? "bg-[#1F3D35] text-white shadow-xs"
                    : "bg-white text-[#6B716D] border border-[#E5E3DE] hover:bg-[#F8F7F4]"
                }`}
              >
                <span>{labels[st]}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    statusFilter === st
                      ? "bg-white/20 text-white"
                      : "bg-[#F8F7F4] text-[#6B716D]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-[#E5E3DE] bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#1F3D35]">
            <thead className="border-b border-[#E5E3DE] bg-[#F8F7F4] text-[11px] font-bold uppercase tracking-wider text-[#6B716D]">
              <tr>
                <th className="px-5 py-3.5">Penghuni & Kamar</th>
                <th className="px-5 py-3.5">Periode & Durasi</th>
                <th className="px-5 py-3.5">Estimasi Tagihan</th>
                <th className="px-5 py-3.5">Catatan Penghuni</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E3DE]/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#6B716D]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Clock className="h-6 w-6 animate-spin text-[#1F3D35]" />
                      <p className="text-xs font-semibold">Memuat daftar pengajuan perpanjangan...</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#6B716D]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F7F4] text-[#C69C6D]">
                        <Clock className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-bold text-[#1F3D35]">Tidak Ada Pengajuan</p>
                      <p className="text-xs text-[#99A09C]">
                        {statusFilter === "ALL"
                          ? "Belum ada penghuni yang mengajukan perpanjangan masa sewa."
                          : `Tidak ada perpanjangan dengan status ${statusFilter}.`}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const currentEnd = formatDate(item.lease.endDate);
                  const proposedEnd = formatDate(item.proposedEndDate);
                  const totalEst = item.lease.rentAmount * item.durationMonths;
                  const waUrl = createWhatsAppLink(
                    item.tenant.phone,
                    `Halo ${item.tenant.fullName}, perihal permohonan perpanjangan sewa Kamar ${item.room.roomNumber} selama ${item.durationMonths} bulan.`
                  );

                  return (
                    <tr key={item.id} className="transition-colors hover:bg-[#F8F7F4]/50">
                      {/* Penghuni & Kamar */}
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#1F3D35]">{item.tenant.fullName}</span>
                            <span className="inline-flex items-center rounded-lg bg-[#1F3D35]/10 px-2 py-0.5 text-xs font-bold text-[#1F3D35]">
                              Kamar {item.room.roomNumber}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-[#6B716D]">
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold transition-colors"
                              title="Hubungi via WhatsApp"
                            >
                              <Phone className="h-3 w-3" />
                              <span>{item.tenant.phone}</span>
                            </a>
                            <span>•</span>
                            <span>Lt. {item.room.floor}</span>
                          </div>
                        </div>
                      </td>

                      {/* Periode & Durasi */}
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-800 border border-amber-200/60">
                            +{item.durationMonths} Bulan
                          </span>
                          <div className="flex items-center gap-1.5 text-xs text-[#6B716D]">
                            <span>{currentEnd}</span>
                            <ArrowRight className="h-3 w-3 text-[#99A09C]" />
                            <strong className="text-[#1F3D35]">{proposedEnd}</strong>
                          </div>
                        </div>
                      </td>

                      {/* Estimasi Tagihan */}
                      <td className="px-5 py-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-[#1F3D35]">{formatRupiah(totalEst)}</p>
                          <p className="text-[11px] text-[#6B716D]">
                            {item.durationMonths} × {formatRupiah(item.lease.rentAmount)}
                          </p>
                        </div>
                      </td>

                      {/* Catatan Penghuni */}
                      <td className="px-5 py-4">
                        {item.notes ? (
                          <p className="max-w-xs text-xs text-[#6B716D] italic line-clamp-2">
                            &ldquo;{item.notes}&rdquo;
                          </p>
                        ) : (
                          <span className="text-xs text-[#99A09C]">- Tidak ada catatan -</span>
                        )}
                        <p className="mt-1 text-[10px] text-[#99A09C]">
                          Diajukan: {formatDate(item.createdAt)}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {item.status === "PENDING" && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">
                            <Clock className="h-3 w-3 text-amber-600 animate-pulse" />
                            <span>Menunggu</span>
                          </span>
                        )}
                        {item.status === "APPROVED" && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            <span>Disetujui</span>
                          </span>
                        )}
                        {item.status === "REJECTED" && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-800" title={item.adminNotes || "Ditolak"}>
                            <XCircle className="h-3 w-3 text-red-600" />
                            <span>Ditolak</span>
                          </span>
                        )}
                        {item.adminNotes && item.status !== "PENDING" && (
                          <p className="mt-1 text-[11px] text-[#6B716D] max-w-xs truncate" title={item.adminNotes}>
                            Catatan: {item.adminNotes}
                          </p>
                        )}
                      </td>

                      {/* Aksi */}
                      <td className="px-5 py-4 text-right">
                        {item.status === "PENDING" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedForApprove(item)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1F3D35] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#152923] active:scale-95 cursor-pointer"
                              title="Setujui perpanjangan & otomatis terbitkan tagihan"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Setujui</span>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedForReject(item);
                                setRejectReason("");
                              }}
                              className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-700 transition-all hover:bg-red-50 active:scale-95 cursor-pointer"
                              title="Tolak permohonan"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              <span>Tolak</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-[#99A09C]">
                            Selesai diproses
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Konfirmasi Persetujuan */}
      {selectedForApprove && (
        <ConfirmModal
          isOpen={true}
          title="Setujui Perpanjangan Sewa?"
          message={`Anda akan menyetujui perpanjangan sewa untuk ${
            selectedForApprove.tenant.fullName
          } (Kamar ${selectedForApprove.room.roomNumber}) selama ${
            selectedForApprove.durationMonths
          } bulan hingga ${formatDate(selectedForApprove.proposedEndDate)}. 
          
Sistem akan otomatis memperbarui masa akhir sewa kamar menjadi AKTIF dan menerbitkan 1 tagihan baru sebesar ${formatRupiah(
            selectedForApprove.lease.rentAmount * selectedForApprove.durationMonths
          )}.`}
          confirmText={isApproving ? "Memproses..." : "Ya, Setujui & Terbitkan Tagihan"}
          cancelText="Batal"
          variant="primary"
          onConfirm={handleApprove}
          onCancel={() => setSelectedForApprove(null)}
        />
      )}

      {/* Modal Dialog Penolakan */}
      {selectedForReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#1F3D35]/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedForReject(null)}
          />
          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6">
              <div className="flex items-center gap-3 text-red-600 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 border border-red-200">
                  <XCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1F3D35]">Tolak Pengajuan Perpanjangan</h3>
                  <p className="text-xs text-[#6B716D]">
                    {selectedForReject.tenant.fullName} - Kamar {selectedForReject.room.roomNumber}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B716D]">
                  Alasan Penolakan (Akan tampil pada portal penghuni)
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Misal: Kamar sudah dijadwalkan untuk renovasi besar atau penghuni memiliki tunggakan sebelumnya..."
                  rows={3}
                  className="w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] p-3 text-sm font-medium text-[#1F3D35] focus:border-[#1F3D35] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 bg-[#F8F7F4] px-6 py-4 border-t border-[#E5E3DE]">
              <button
                type="button"
                onClick={() => setSelectedForReject(null)}
                className="rounded-xl border border-[#E5E3DE] bg-white px-4 py-2.5 text-xs font-bold text-[#6B716D] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={isRejecting}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isRejecting ? "Menolak..." : "Tolak Pengajuan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

