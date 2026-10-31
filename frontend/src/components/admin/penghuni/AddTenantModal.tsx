"use client";

import { useState, useEffect } from "react";
import {
  X,
  User,
  Phone,
  Home,
  Mail,
  ShieldCheck,
  Briefcase,
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  KeyRound,
  CreditCard,
  Building,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import { RoomItem } from "@/types/admin";
import { InquiryItem } from "./InquiryTable";
import { formatWhatsAppNumber } from "@/lib/whatsapp";

interface AddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialInquiry?: InquiryItem | null;
}

interface PaymentMethod {
  id?: string;
  bankName: string;
  accountNumber: string;
  accountName?: string;
  accountHolder?: string;
  isActive?: boolean;
}

interface CreatedTenantResult {
  fullName: string;
  phone: string;
  email: string;
  rawPassword: string;
  roomNumber: string;
  roomTypeName: string;
  rentAmount: number;
  depositAmount: number;
  totalFirstPayment: number;
  invoiceNumber: string;
}

export default function AddTenantModal({
  isOpen,
  onClose,
  onSuccess,
  initialInquiry,
}: AddTenantModalProps) {
  const [fullName, setFullName] = useState("");
  const [nik, setNik] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("kos12345");
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
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingRooms, setFetchingRooms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State untuk menyimpan hasil pendaftaran sukses dan menampilkan kartu WhatsApp
  const [createdResult, setCreatedResult] = useState<CreatedTenantResult | null>(null);

  // Ambil kamar kosong & rekening pembayaran dari pengaturan
  useEffect(() => {
    if (!isOpen) {
      setCreatedResult(null);
      setError(null);
      return;
    }

    const loadData = async () => {
      try {
        setFetchingRooms(true);
        const [roomsRes, settingsRes] = await Promise.all([
          apiFetch<{ data: RoomItem[] }>("/api/admin/rooms?status=AVAILABLE"),
          apiFetch<{ data: { paymentMethods?: PaymentMethod[] } }>("/api/admin/settings").catch(() => ({ data: { paymentMethods: [] as PaymentMethod[] } })),
        ]);

        const available = (roomsRes.data || []).filter((r) => r.rawStatus === "AVAILABLE");
        setAvailableRooms(available);

        const settingsData = settingsRes?.data as { paymentMethods?: PaymentMethod[] } | undefined;
        if (settingsData?.paymentMethods && Array.isArray(settingsData.paymentMethods)) {
          setPaymentMethods(settingsData.paymentMethods);
        }

        // Auto select kamar yang cocok dengan tipe yang diminta di reservasi
        if (available.length > 0) {
          if (initialInquiry?.roomType?.name) {
            const matched = available.find(
              (r) => r.type.toLowerCase() === initialInquiry.roomType?.name.toLowerCase()
            );
            setRoomId(matched ? matched.id : available[0].id);
          } else {
            setRoomId(available[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch available rooms / settings:", err);
      } finally {
        setFetchingRooms(false);
      }
    };

    loadData();
  }, [isOpen, initialInquiry]);

  // Auto-fill form jika dibuka dari alur "Proses Jadi Penghuni"
  useEffect(() => {
    if (!isOpen) return;

    if (initialInquiry) {
      setFullName(initialInquiry.name || "");
      setPhone(initialInquiry.phone || "");
      if (initialInquiry.checkInDate) {
        setStartDate(initialInquiry.checkInDate.split("T")[0]);
      } else {
        setStartDate(new Date().toISOString().split("T")[0]);
      }
      // Kata sandi awal sederhana sesuai preferensi
      setPassword("kos12345");

      // Gunakan email asli jika diisi calon penghuni saat reservasi web, atau biarkan kosong untuk diisi dari chat WA
      if (initialInquiry.email) {
        setEmail(initialInquiry.email);
      } else {
        setEmail("");
      }

      // Gunakan NIK asli jika ada, atau kosongkan agar diisi dari chat WA
      if (initialInquiry.nik) {
        setNik(initialInquiry.nik);
      } else {
        setNik("");
      }
    } else {
      // Buka form bersih
      setFullName("");
      setNik("");
      setPhone("");
      setEmail("");
      setPassword("kos12345");
      setStartDate(new Date().toISOString().split("T")[0]);
      setOccupation("");
      setEmergencyName("");
      setEmergencyPhone("");
    }
  }, [isOpen, initialInquiry]);

  if (!isOpen) return null;

  const handleGenerateNewPassword = () => {
    const chars = "abcdefhkmnprstuvwxyz23456789";
    let newPass = "kos";
    for (let i = 0; i < 5; i++) {
      newPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPass);
    toast.success(`Password baru di-generate: ${newPass}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId) {
      setError("Silakan pilih kamar yang tersedia terlebih dahulu");
      return;
    }
    // NIK wajib asli (tepat 16 digit sesuai preferensi user)
    if (nik.length !== 16) {
      setError("NIK KTP wajib dimasukkan tepat 16 digit");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch("/api/admin/tenants", {
        method: "POST",
        body: JSON.stringify({
          fullName,
          nik,
          phone,
          email,
          password: password || "kos12345",
          roomId,
          startDate,
          endDate,
          occupation: occupation || undefined,
          emergencyName: emergencyName || undefined,
          emergencyPhone: emergencyPhone || undefined,
          emergencyRelation: emergencyRelation || undefined,
          inquiryId: initialInquiry?.id || undefined,
        }),
      });

      if (onSuccess) onSuccess();
      toast.success("Penghuni baru berhasil didaftarkan!");

      // Tampilkan layar sukses kirim WhatsApp
      const data = res.data || {};
      setCreatedResult({
        fullName,
        phone,
        email,
        rawPassword: password || "kos12345",
        roomNumber: data.roomNumber || "Kamar",
        roomTypeName: data.roomTypeName || "Standar",
        rentAmount: data.rentAmount || 0,
        depositAmount: data.depositAmount || 0,
        totalFirstPayment: data.totalFirstPayment || data.rentAmount || 0,
        invoiceNumber: data.invoiceNumber || `INV-${new Date().getFullYear()}`,
      });
    } catch (err: any) {
      setError(err.message || "Gagal mendaftarkan penghuni baru");
      toast.error(err.message || "Gagal mendaftarkan penghuni baru");
    } finally {
      setLoading(false);
    }
  };

  // Generate Pesan WhatsApp dengan Rincian Pembayaran di Awal
  const generateWhatsAppMessage = (res: CreatedTenantResult) => {
    const banks =
      paymentMethods.length > 0
        ? paymentMethods
            .map((b) => `• Bank ${b.bankName}: *${b.accountNumber}* (a/n ${b.accountName})`)
            .join("\n")
        : `• Bank BCA: *1234567890* (a/n Kostara Management)\n• Bank Mandiri: *0987654321* (a/n Kostara Management)`;

    const msg =
      `Halo *${res.fullName}*, selamat bergabung di Kostara! 🎉\n` +
      `Pendaftaran sewa *Kamar ${res.roomNumber}* (${res.roomTypeName}) Anda telah disetujui.\n\n` +
      `📋 *RINCIAN PEMBAYARAN PERTAMA:*\n` +
      `• No. Invoice: ${res.invoiceNumber}\n` +
      `• Sewa Bulanan: Rp ${res.rentAmount.toLocaleString("id-ID")}\n` +
      `• Uang Jaminan (Deposit): Rp ${res.depositAmount.toLocaleString("id-ID")}\n` +
      `• *TOTAL HARUS DIBAYAR:* *Rp ${res.totalFirstPayment.toLocaleString("id-ID")}*\n\n` +
      `💳 *REKENING TRANSFER RESMI:*\n` +
      `${banks}\n` +
      `_(Silakan simpan & unggah bukti transfer di portal penghuni)_\n\n` +
      `🔐 *INFORMASI AKUN PORTAL PENGHUNI ANDA:*\n` +
      `• Link Portal: http://localhost:3000/login\n` +
      `• Email/Username: *${res.email}*\n` +
      `• Password Sementara: *${res.rawPassword}*\n\n` +
      `Silakan login ke portal penghuni untuk melihat kwitansi resmi sewa dan menyampaikan keluhan fasilitas jika ada kendala. Terima kasih! 🙏`;

    return encodeURIComponent(msg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1F3D35]/40 backdrop-blur-sm transition-opacity"
        onClick={() => {
          if (!loading) onClose();
        }}
      />

      {/* Modal Panel */}
      <div className="relative z-10 flex w-full max-w-xl max-h-[90vh] flex-col transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
        {/* Tampilan Konfirmasi Sukses & Kirim WhatsApp */}
        {createdResult ? (
          <div className="flex flex-col p-6 sm:p-8 overflow-y-auto max-h-[85vh]">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm animate-bounce">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black text-[#1F3D35]">Penghuni Berhasil Didaftarkan!</h3>
              <p className="mt-1 text-sm text-[#6B716D]">
                Kamar <span className="font-bold text-[#1F3D35]">{createdResult.roomNumber}</span> resmi dialokasikan untuk{" "}
                <span className="font-bold text-[#1F3D35]">{createdResult.fullName}</span>.
              </p>
            </div>

            {/* Kotak 1: Rincian Pembayaran Pertama (Prioritas Utama) */}
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
              <div className="flex items-center gap-2 mb-2 text-emerald-900 font-bold text-sm">
                <CreditCard className="h-4 w-4 text-emerald-700" />
                <span>Rincian Pembayaran Pertama</span>
                <span className="ml-auto text-xs font-semibold text-emerald-700 bg-emerald-200/60 px-2 py-0.5 rounded-md">
                  {createdResult.invoiceNumber}
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-emerald-900">
                <div className="flex justify-between">
                  <span className="text-[#6B716D]">Sewa Bulanan:</span>
                  <span className="font-semibold">Rp {createdResult.rentAmount.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B716D]">Uang Jaminan (Deposit):</span>
                  <span className="font-semibold">Rp {createdResult.depositAmount.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between border-t border-emerald-200 pt-2 text-sm font-extrabold text-[#1F3D35]">
                  <span>Total Tagihan Pertama:</span>
                  <span className="text-emerald-700">Rp {createdResult.totalFirstPayment.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>

            {/* Kotak 2: Rekening Pembayaran */}
            <div className="mt-3 rounded-2xl border border-[#E5E3DE] bg-[#F8F7F4] p-4 text-xs">
              <div className="flex items-center gap-2 mb-2 font-bold text-[#1F3D35]">
                <Building className="h-4 w-4 text-[#C69C6D]" />
                <span>Rekening Tujuan Transfer:</span>
              </div>
              <div className="space-y-1 text-[#6B716D]">
                {paymentMethods.length > 0 ? (
                  paymentMethods.map((b, idx) => (
                    <p key={idx} className="font-medium text-[#1F3D35]">
                      • Bank {b.bankName}: <span className="font-bold">{b.accountNumber}</span> (a/n {b.accountHolder || b.accountName || "Pondok Rahmat"})
                    </p>
                  ))
                ) : (
                  <>
                    <p className="font-medium text-[#1F3D35]">• Bank BCA: <span className="font-bold">8271902811</span> (a/n Pondok Rahmat)</p>
                    <p className="font-medium text-[#1F3D35]">• Bank Mandiri: <span className="font-bold">137002938123</span> (a/n Pondok Rahmat)</p>
                  </>
                )}
              </div>
            </div>

            {/* Kotak 3: Akun Login Portal */}
            <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50/70 p-4 text-xs">
              <div className="flex items-center gap-2 mb-2 font-bold text-blue-900">
                <KeyRound className="h-4 w-4 text-blue-700" />
                <span>Akun Portal Penghuni:</span>
              </div>
              <div className="space-y-1 text-blue-950 font-medium">
                <p>• Email: <span className="font-bold">{createdResult.email}</span></p>
                <p>• Password Sementara: <span className="font-bold font-mono bg-blue-100 px-1.5 py-0.5 rounded text-blue-800">{createdResult.rawPassword}</span></p>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="mt-6 flex flex-col gap-2.5">
              <a
                href={`https://wa.me/${formatWhatsAppNumber(createdResult.phone)}?text=${generateWhatsAppMessage(createdResult)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-[#1EBE5D] transition-all cursor-pointer"
              >
                <MessageSquare className="h-5 w-5 fill-current" />
                <span>Kirim Rincian Tagihan & Akun via WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-2xl border border-[#E5E3DE] bg-white py-3 text-sm font-semibold text-[#6B716D] hover:bg-[#F8F7F4] hover:text-[#1F3D35] transition-colors cursor-pointer"
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header Form */}
            <div className="flex flex-shrink-0 items-center justify-between border-b border-[#E5E3DE] px-6 py-5">
              <div>
                <h3 className="text-xl font-bold text-[#1F3D35]">
                  {initialInquiry ? "Proses Reservasi Jadi Penghuni" : "Daftarkan Penghuni Baru"}
                </h3>
                <p className="mt-1 text-sm text-[#6B716D]">
                  {initialInquiry
                    ? `Data otomatis terisi dari pemesanan ${initialInquiry.name}`
                    : "Masukkan identitas penghuni dan alokasikan kamar aktif"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-[#99A09C] hover:bg-[#F8F7F4] hover:text-[#1F3D35] transition-colors cursor-pointer"
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

                {/* NIK (Wajib Asli 16 Digit) & Nomor HP */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-semibold text-[#1F3D35]">
                        NIK KTP (16 Digit Asli) <span className="text-[#E54D2E]">*</span>
                      </label>
                      {initialInquiry?.nik ? (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          ✓ Dari Web
                        </span>
                      ) : initialInquiry ? (
                        <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          Isi dari chat WA
                        </span>
                      ) : null}
                    </div>
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
                    {nik.length > 0 && nik.length < 16 ? (
                      <p className="mt-1 text-[11px] text-amber-600 font-medium">
                        Kurang {16 - nik.length} digit lagi
                      </p>
                    ) : (
                      initialInquiry && !initialInquiry.nik && (
                        <p className="mt-1 text-[11px] text-[#6B716D]">
                          Masukkan 16 digit NIK yang dikirim penyewa di WhatsApp.
                        </p>
                      )
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1F3D35]">
                      Nomor HP / WhatsApp <span className="text-[#E54D2E]">*</span>
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
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-semibold text-[#1F3D35]">
                        Email Akun Portal (Gmail) <span className="text-[#E54D2E]">*</span>
                      </label>
                      {initialInquiry?.email ? (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          ✓ Dari Web
                        </span>
                      ) : initialInquiry ? (
                        <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          Isi dari chat WA
                        </span>
                      ) : null}
                    </div>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="penghuni@gmail.com"
                        className="w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:border-[#C69C6D] focus:ring-1 focus:ring-[#C69C6D]"
                      />
                    </div>
                    {initialInquiry && !initialInquiry.email && (
                      <p className="mt-1 text-[11px] text-[#6B716D]">
                        Calon penyewa belum mengisi Gmail di web. Masukkan alamat Gmail yang diberikan di WhatsApp.
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-semibold text-[#1F3D35]">
                        Password Awal <span className="text-[#E54D2E]">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleGenerateNewPassword}
                        className="flex items-center gap-1 text-[11px] font-semibold text-[#C69C6D] hover:underline cursor-pointer"
                      >
                        <RefreshCw className="h-3 w-3" />
                        <span>Acak</span>
                      </button>
                    </div>
                    <div className="relative mt-1.5">
                      <KeyRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
                      <input
                        type="text"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Misal: kos12345"
                        className="w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:border-[#C69C6D] focus:ring-1 focus:ring-[#C69C6D]"
                      />
                    </div>
                  </div>
                </div>

                {/* Pilih Kamar yang Tersedia */}
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
                      className="w-full appearance-none rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-2.5 pl-10 pr-10 text-sm font-medium outline-none focus:border-[#C69C6D] focus:ring-1 focus:ring-[#C69C6D]"
                    >
                      {availableRooms.length === 0 ? (
                        <option value="">Tidak ada kamar tersedia (Penuh)</option>
                      ) : (
                        availableRooms.map((room) => (
                          <option key={room.id} value={room.id}>
                            Kamar {room.number} - {room.type} (Lantai {room.floor}) - Rp {room.rawPrice.toLocaleString("id-ID")}/bln
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                {/* Periode Sewa (Mulai & Berakhir) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1F3D35]">
                      Tanggal Masuk <span className="text-[#E54D2E]">*</span>
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
                      Tanggal Selesai Kontrak <span className="text-[#E54D2E]">*</span>
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

                {/* Pekerjaan / Instansi */}
                <div>
                  <label className="block text-sm font-semibold text-[#1F3D35]">
                    Pekerjaan / Mahasiswa
                  </label>
                  <div className="relative mt-1.5">
                    <Briefcase className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
                    <input
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      placeholder="Misal: Mahasiswa UNM / Karyawan BUMN"
                      className="w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:border-[#C69C6D] focus:ring-1 focus:ring-[#C69C6D]"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Form */}
              <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t border-[#E5E3DE] bg-[#F8F7F4]/50 px-6 py-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold text-[#6B716D] hover:bg-[#E5E3DE]/50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading || availableRooms.length === 0}
                  className="flex items-center gap-2 rounded-xl bg-[#1F3D35] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#162E28] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{loading ? "Menyimpan..." : "Simpan & Daftarkan Penghuni"}</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
