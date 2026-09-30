"use client";

import { useState } from "react";
import { CheckCircle2, MessageSquare, Calendar, User, Phone, FileText, Send, X, Loader2 } from "lucide-react";
import type { Room } from "@/data/rooms";
import { apiFetch } from "@/lib/api";

interface BookingStickyProps {
  room: Room;
}

export default function BookingSticky({ room }: BookingStickyProps) {
  const isAvailable = room.status === "AVAILABLE" || room.isAvailable === true;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    checkInDate: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const directWaMessage = encodeURIComponent(
    `Halo Pengelola Kostara, saya tertarik untuk menyewa ${room.name} (Rp ${room.price.toLocaleString("id-ID")}/bln). Apakah masih tersedia?`
  );
  const adminPhone = "6281234567890";
  const directWaUrl = `https://wa.me/${adminPhone}?text=${directWaMessage}`;

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    try {
      setSubmitting(true);
      const res = await apiFetch("/api/public/inquiries", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          slug: room.slug,
          roomTypeId: room.id,
          checkInDate: formData.checkInDate || undefined,
          notes: formData.notes || undefined,
        }),
      });

      setSubmitted(true);
      // Buka WhatsApp otomatis
      if (res && res.whatsappUrl) {
        window.open(res.whatsappUrl, "_blank");
      }
    } catch (err: any) {
      alert(err.message || "Gagal mengirim data pemesanan, silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="sticky top-24 rounded-3xl border border-[#E5E3DE]/50 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {/* Harga */}
        <div className="mb-6">
          <p className="text-sm font-medium text-[#6B716D]">Harga Sewa Bulanan</p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold tracking-tight text-[#1F3D35]">
              Rp {room.price.toLocaleString("id-ID")}
            </span>
            <span className="text-[#6B716D]">/ bulan</span>
          </div>
          {room.deposit ? (
            <p className="mt-1 text-xs text-[#99A09C]">
              + Uang Jaminan (Deposit): Rp {room.deposit.toLocaleString("id-ID")}
            </p>
          ) : null}
        </div>

        {/* Ketersediaan */}
        <div className="mb-6 rounded-2xl bg-[#F8F7F4] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
              {isAvailable ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <div className="h-3 w-3 rounded-full bg-gray-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-[#202321]">
                {isAvailable ? "Tersedia" : "Penuh"}
              </p>
              <p className="text-xs text-[#6B716D]">
                {isAvailable
                  ? room.availableUnits !== undefined
                    ? `${room.availableUnits} unit siap dihuni sekarang`
                    : "Kamar siap dihuni bulan ini"
                  : "Silakan hubungi admin untuk antrean"}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {isAvailable ? (
            <>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setIsModalOpen(true);
                }}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1F3D35] px-6 py-4 font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#162E28] hover:shadow-lg cursor-pointer"
              >
                <Calendar className="h-5 w-5 text-[#C69C6D]" />
                <span>Pesan / Jadwalkan Survey</span>
              </button>

              <a
                href={directWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#E5E3DE] bg-white px-6 py-3.5 text-sm font-semibold text-[#1F3D35] transition-all hover:bg-[#F8F7F4]"
              >
                <MessageSquare className="h-4 w-4 text-[#25D366]" />
                <span>Tanya via WhatsApp</span>
              </a>
            </>
          ) : (
            <>
              <button
                disabled
                className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-gray-200 px-6 py-4 font-semibold text-gray-500"
              >
                Kamar Penuh
              </button>
              <a
                href={directWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#E5E3DE] bg-white px-6 py-3.5 text-sm font-semibold text-[#1F3D35] transition-all hover:bg-[#F8F7F4]"
              >
                <MessageSquare className="h-4 w-4 text-[#25D366]" />
                <span>Tanya Jadwal Kosong</span>
              </a>
            </>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-[#99A09C]">
          Reservasi & survey bebas biaya komitmen
        </p>
      </div>

      {/* Booking / Survey Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 md:p-8 shadow-2xl animate-fade-in-up">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
            >
              <X className="h-5 w-5" />
            </button>

            {submitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold text-[#1F3D35]">Permintaan Diterima!</h3>
                <p className="mt-2 text-sm text-[#6B716D]">
                  Data Anda telah kami simpan. Halaman WhatsApp pengelola kos telah dibuka untuk melanjutkan konfirmasi langsung.
                </p>
                <div className="mt-6 flex flex-col gap-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full rounded-2xl bg-[#1F3D35] py-3 text-sm font-semibold text-white hover:bg-[#162E28]"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="text-xs font-bold tracking-wider text-[#C69C6D] uppercase">
                    Formulir Reservasi & Survey
                  </span>
                  <h3 className="text-2xl font-bold text-[#1F3D35]">{room.name}</h3>
                  <p className="text-xs text-[#6B716D]">
                    Isi formulir singkat di bawah untuk terhubung langsung dengan pengelola kos.
                  </p>
                </div>

                <form onSubmit={handleSubmitInquiry} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#202321]">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Contoh: Rian Pratama"
                        className="w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-2.5 pl-10 pr-4 text-sm text-[#202321] focus:border-[#1F3D35] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#202321]">
                      Nomor WhatsApp / HP <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Contoh: 08123456789"
                        className="w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-2.5 pl-10 pr-4 text-sm text-[#202321] focus:border-[#1F3D35] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#202321]">
                      Rencana Tanggal Masuk
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                      <input
                        type="date"
                        value={formData.checkInDate}
                        onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                        className="w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-2.5 pl-10 pr-4 text-sm text-[#202321] focus:border-[#1F3D35] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#202321]">
                      Catatan / Pertanyaan Khusus
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                      <textarea
                        rows={2}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Contoh: Mau survey besok siang jam 2 atau tanya parkir mobil"
                        className="w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-2.5 pl-10 pr-4 text-sm text-[#202321] focus:border-[#1F3D35] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1F3D35] py-3.5 px-4 text-sm font-semibold text-white shadow-md hover:bg-[#162E28] disabled:opacity-60 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Memproses...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 text-[#C69C6D]" />
                          <span>Kirim Permintaan & Buka WhatsApp</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
