"use client";

import { Clock, AlertTriangle, AlertCircle, Home, MessageSquare, CalendarPlus, ChevronRight, Hourglass, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createWhatsAppLink } from "@/lib/whatsapp";
import { PortalLeaseExtensionItem } from "@/types/portal";

interface LeaseStatusCardProps {
  activeLease?: any;
  tenantName?: string;
  propertyPhone?: string;
  extensionStatus?: PortalLeaseExtensionItem | null;
  onOpenExtendModal: () => void;
}

export default function LeaseStatusCard({
  activeLease,
  tenantName = "Penghuni",
  propertyPhone = "081122223333",
  extensionStatus,
  onOpenExtendModal,
}: LeaseStatusCardProps) {
  // 1. Kondisi: Belum ada kamar / sewa aktif dalam riwayat
  if (!activeLease) {
    const waMessage = `Halo Pengelola Kos, saya ${tenantName}. Saya telah mendaftar di portal kos, mohon informasi terkait alokasi kamar aktif saya. Terima kasih!`;
    const waUrl = createWhatsAppLink(propertyPhone, waMessage);

    return (
      <div className="rounded-3xl p-8 border border-[#E5E3DE] bg-[#F8F7F4] flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B716D]">Status Kamar</span>
            <div className="w-8 h-8 rounded-xl bg-white border border-[#E5E3DE] flex items-center justify-center text-[#1F3D35]">
              <Home className="w-4 h-4 text-[#C69C6D]" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-[#202321] tracking-tight">Belum Ada Kamar Aktif</h3>
            <p className="text-xs text-[#6B716D] mt-2 leading-relaxed">
              Akun Anda belum dialokasikan ke unit kamar aktif oleh pengelola. Silakan hubungi admin kos untuk konfirmasi penempatan kamar.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#E5E3DE]">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Hubungi Pengelola via WA</span>
          </a>
        </div>
      </div>
    );
  }

  // Hitung sisa hari
  const end = activeLease.endDate ? new Date(activeLease.endDate).getTime() : 0;
  const now = new Date().getTime();
  const rawDiffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  const remainingDays = Math.max(0, rawDiffDays);
  const formattedEndDate = activeLease.endDate
    ? new Date(activeLease.endDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  const isExpired = rawDiffDays <= 0 || activeLease.status === "EXPIRED" || activeLease.status === "TERMINATED";
  const isPendingExtension = extensionStatus?.status === "PENDING";

  const renderActionSection = (isMinimal = false) => {
    if (isPendingExtension) {
      return (
        <div className="flex items-center justify-between gap-2 w-full">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 bg-amber-100/90 px-3 py-2.5 rounded-xl flex-1 justify-center border border-amber-200">
            <Hourglass className="w-4 h-4 animate-pulse text-amber-700" />
            <span className="truncate">Perpanjangan Sedang Ditinjau Admin</span>
          </div>
        </div>
      );
    }

    if (isMinimal) {
      return (
        <button
          onClick={onOpenExtendModal}
          className="font-semibold text-[#C69C6D] hover:text-[#1F3D35] inline-flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Perpanjang</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      );
    }

    return (
      <button
        onClick={onOpenExtendModal}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1F3D35] hover:bg-[#152923] text-white px-4 py-3 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
      >
        <CalendarPlus className="w-4 h-4 text-[#C69C6D]" />
        <span>Ajukan Perpanjangan Sewa</span>
      </button>
    );
  };

  const renderExtensionBanner = () => {
    if (!extensionStatus) return null;

    if (extensionStatus.status === "PENDING") {
      const proposedFormatted = new Date(extensionStatus.proposedEndDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      return (
        <div className="mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <Hourglass className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Pengajuan Perpanjangan (+{extensionStatus.durationMonths} Bulan)</span>
          </div>
          <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
            Menunggu persetujuan admin hingga <strong>{proposedFormatted}</strong>. Tagihan sewa akan otomatis diterbitkan begitu disetujui.
          </p>
        </div>
      );
    }

    if (extensionStatus.status === "REJECTED") {
      return (
        <div className="mt-3 p-3 rounded-2xl bg-red-50 border border-red-200/80 text-xs text-red-900">
          <div className="flex items-center gap-2 font-bold text-red-950">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            <span>Pengajuan Sebelumnya Ditolak</span>
          </div>
          {extensionStatus.adminNotes && (
            <p className="text-[11px] text-red-800 mt-1 italic">
              &ldquo;{extensionStatus.adminNotes}&rdquo;
            </p>
          )}
        </div>
      );
    }

    return null;
  };

  // 2. Kondisi: Kontrak Habis (expired)
  if (isExpired) {
    return (
      <div className="rounded-3xl p-8 border border-red-200 bg-red-50/70 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-700">Status Masa Sewa</span>
            <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-red-700 tracking-tight">Masa Sewa Berakhir</h3>
            <p className="text-xs text-red-600/80 mt-1.5 leading-relaxed">
              Kontrak {activeLease.room?.roomNumber ? `Kamar ${activeLease.room.roomNumber}` : "kamar Anda"} telah selesai pada <strong className="font-bold text-red-900">{formattedEndDate}</strong>.
            </p>
            {renderExtensionBanner()}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-red-200/60">
          {renderActionSection()}
        </div>
      </div>
    );
  }

  // 3. Kondisi: Kritis (<= 7 Hari)
  if (remainingDays <= 7) {
    return (
      <div className="rounded-3xl p-8 border border-red-200 bg-red-50/80 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-700">Sisa Masa Sewa</span>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <div className="mt-4">
            <span className="text-5xl font-extrabold tracking-tight text-red-600">
              {remainingDays}
            </span>
            <span className="text-sm font-semibold text-red-700 ml-2">Hari lagi</span>
            <p className="text-xs text-red-600/80 mt-2">
              Segera berakhir pada <strong className="font-bold text-red-900">{formattedEndDate}</strong>.
            </p>
            {renderExtensionBanner()}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-red-200/60">
          {renderActionSection()}
        </div>
      </div>
    );
  }

  // 4. Kondisi: Peringatan (8 - 14 Hari)
  if (remainingDays <= 14) {
    return (
      <div className="rounded-3xl p-8 border border-amber-200 bg-amber-50/80 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Sisa Masa Sewa</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="mt-4">
            <span className="text-5xl font-extrabold tracking-tight text-amber-700">
              {remainingDays}
            </span>
            <span className="text-sm font-semibold text-amber-800 ml-2">Hari lagi</span>
            <p className="text-xs text-amber-700/80 mt-2">
              Berakhir pada <strong className="font-bold text-amber-950">{formattedEndDate}</strong>.
            </p>
            {renderExtensionBanner()}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-amber-200/60">
          {renderActionSection()}
        </div>
      </div>
    );
  }

  // 5. Kondisi: Masih Panjang (> 14 Hari)
  return (
    <div className="rounded-3xl p-8 border border-[#E5E3DE] bg-[#F8F7F4] flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B716D]">Sisa Masa Sewa</span>
          <Clock className="w-5 h-5 text-[#1F3D35]" />
        </div>
        <div className="mt-4">
          <span className="text-5xl font-extrabold tracking-tight text-[#1F3D35]">
            {remainingDays}
          </span>
          <span className="text-sm font-medium text-[#6B716D] ml-2">Hari lagi</span>
          {renderExtensionBanner()}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#E5E3DE]/60 flex items-center justify-between text-xs text-[#6B716D]">
        <p>Berakhir: <strong className="text-[#202321]">{formattedEndDate}</strong></p>
        {renderActionSection(true)}
      </div>
    </div>
  );
}
