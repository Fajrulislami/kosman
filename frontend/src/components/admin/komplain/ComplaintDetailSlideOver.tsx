"use client";

import { useState } from "react";
import { X, Clock, MapPin, User, Phone, CheckCircle2, Wrench, XCircle, Loader2 } from "lucide-react";
import { ComplaintItem } from "@/types/admin";

interface ComplaintDetailSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: ComplaintItem | null;
  onUpdateStatus?: (
    id: string,
    status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED",
    note?: string
  ) => Promise<void>;
}

export default function ComplaintDetailSlideOver({
  isOpen,
  onClose,
  complaint,
  onUpdateStatus,
}: ComplaintDetailSlideOverProps) {
  const [resolutionNote, setResolutionNote] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !complaint) return null;

  const handleAction = async (status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED") => {
    try {
      setLoading(true);
      if (onUpdateStatus) {
        await onUpdateStatus(complaint.id, status, resolutionNote || undefined);
      }
      setResolutionNote("");
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal memperbarui status komplain");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenWA = () => {
    let cleanPhone = complaint.tenantPhone.replace(/\D/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.slice(1);
    }
    const msg = `Halo ${complaint.tenantName}, terkait laporan "${complaint.title}" di kamar ${complaint.roomNumber}...`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
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
        <div className="pointer-events-auto w-screen max-w-xl transform transition-all ease-in-out duration-300">
          <div className="flex h-full flex-col overflow-y-scroll bg-[#F8F7F4] shadow-2xl">
            
            {/* Header */}
            <div className="bg-white px-6 py-6 sm:px-8 border-b border-[#E5E3DE] sticky top-0 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                        complaint.priority === "URGENT" || complaint.priority === "HIGH"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      Prioritas: {complaint.priority}
                    </span>
                    <span className="text-sm font-bold text-[#99A09C]">{complaint.ticketNumber}</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#1F3D35]">{complaint.title}</h2>
                </div>
                <div className="ml-3 flex h-7 items-center">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full bg-[#F8F7F4] p-2 text-[#99A09C] hover:bg-[#E5E3DE] hover:text-[#1F3D35] transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 px-6 py-6 sm:px-8 space-y-6">
              
              {/* Info Pelapor */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-5 rounded-2xl shadow-sm border border-[#E5E3DE]">
                <div className="flex items-center space-x-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1F3D35] text-white font-bold text-sm">
                    {complaint.tenantName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#99A09C]">Pelapor</p>
                    <p className="font-bold text-[#1F3D35]">{complaint.tenantName}</p>
                    <p className="text-xs text-[#6B716D]">{complaint.tenantPhone}</p>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col gap-4 sm:gap-1 text-sm justify-between sm:text-right">
                  <div className="flex items-center sm:justify-end space-x-1.5 text-[#6B716D]">
                    <MapPin className="h-4 w-4 text-[#C69C6D]" />
                    <span className="font-semibold text-[#1F3D35]">Kamar {complaint.roomNumber}</span>
                  </div>
                  <div className="flex items-center sm:justify-end space-x-1.5 text-[#6B716D]">
                    <Clock className="h-4 w-4 text-[#C69C6D]" />
                    <span className="font-medium text-xs text-[#6B716D]">{complaint.createdAt.split("T")[0]}</span>
                  </div>
                  <button
                    onClick={handleOpenWA}
                    className="text-xs font-semibold text-green-600 hover:underline flex items-center gap-1 sm:justify-end"
                  >
                    <Phone className="h-3 w-3" />
                    <span>Hubungi WA</span>
                  </button>
                </div>
              </div>

              {/* Status Badge */}
              <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#E5E3DE] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#99A09C]">Status Tiket Saat Ini</p>
                  <p className="mt-1 text-sm font-bold text-[#1F3D35]">
                    {complaint.status === "RESOLVED"
                      ? "Selesai Ditangani"
                      : complaint.status === "IN_PROGRESS"
                      ? "Sedang Dalam Pengerjaan"
                      : complaint.status === "REJECTED"
                      ? "Laporan Ditolak"
                      : "Menunggu Tindakan"}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center rounded-xl px-3 py-1 text-xs font-bold ${
                    complaint.status === "RESOLVED"
                      ? "bg-green-100 text-green-700"
                      : complaint.status === "IN_PROGRESS"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {complaint.status}
                </span>
              </div>

              {/* Deskripsi Laporan */}
              <div>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#99A09C]">Deskripsi Laporan</h3>
                <div className="rounded-2xl bg-white p-5 shadow-sm border border-[#E5E3DE]">
                  <p className="text-[#1F3D35] leading-relaxed font-medium text-sm">
                    {complaint.description}
                  </p>
                </div>
              </div>

              {/* Foto Bukti */}
              {complaint.images && complaint.images.length > 0 && (
                <div>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#99A09C]">Foto Bukti Keluhan</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {complaint.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-video rounded-2xl bg-gray-100 overflow-hidden border border-[#E5E3DE]">
                        <img 
                          src={img} 
                          alt={`Bukti ${idx + 1}`} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Catatan Penyelesaian Sebelumnya (jika ada) */}
              {complaint.resolutionNote && (
                <div className="rounded-2xl bg-green-50 p-4 border border-green-200">
                  <p className="text-xs font-bold uppercase tracking-wider text-green-800">Catatan Penyelesaian:</p>
                  <p className="mt-1 text-sm font-medium text-green-900">{complaint.resolutionNote}</p>
                </div>
              )}

              {/* Pembaruan Status / Catatan */}
              {complaint.status !== "RESOLVED" && (
                <div>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#99A09C]">
                    Catatan Solusi / Tindak Lanjut
                  </h3>
                  <textarea 
                    rows={3}
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    placeholder="Tulis catatan penanganan teknisi (misal: pipa sudah diganti)..."
                    className="w-full rounded-2xl border-2 border-[#E5E3DE] bg-white p-4 text-sm font-medium outline-none transition-all focus:border-[#C69C6D] resize-none"
                  />
                </div>
              )}

            </div>

            {/* Footer Actions */}
            {complaint.status !== "RESOLVED" && (
              <div className="bg-white px-6 py-4 sm:px-8 border-t border-[#E5E3DE] flex flex-wrap gap-2 sticky bottom-0 z-10">
                {complaint.status === "PENDING" && (
                  <button
                    disabled={loading}
                    onClick={() => handleAction("IN_PROGRESS")}
                    className="flex-1 flex items-center justify-center space-x-2 rounded-xl bg-[#C69C6D] py-3 text-sm font-bold text-white shadow-md hover:bg-[#b08759] transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wrench className="h-4 w-4" />}
                    <span>Mulai Kerjakan</span>
                  </button>
                )}

                <button
                  disabled={loading}
                  onClick={() => handleAction("RESOLVED")}
                  className="flex-1 flex items-center justify-center space-x-2 rounded-xl bg-[#1F3D35] py-3 text-sm font-bold text-white shadow-md hover:bg-[#152923] transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  <span>Tandai Selesai</span>
                </button>

                {complaint.status === "PENDING" && (
                  <button
                    disabled={loading}
                    onClick={() => handleAction("REJECTED")}
                    className="rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
