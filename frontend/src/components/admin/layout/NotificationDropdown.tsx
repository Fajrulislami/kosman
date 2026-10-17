"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Calendar,
  CreditCard,
  AlertTriangle,
  Clock,
  FileText,
  CheckCircle2,
  RefreshCw,
  Volume2,
  VolumeX,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

export interface NotificationItem {
  id: string;
  type: "INQUIRY" | "PAYMENT" | "COMPLAINT" | "OVERDUE" | "EXPIRING_LEASE";
  title: string;
  message: string;
  createdAt: string;
  link: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  meta?: Record<string, any>;
}

export interface NotificationCounts {
  inquiries: number;
  pendingPayments: number;
  pendingComplaints: number;
  overdueInvoices: number;
  expiringLeases: number;
}

export interface AdminNotificationsResponse {
  success: boolean;
  totalUnread: number;
  counts: NotificationCounts;
  notifications: NotificationItem[];
}

// Gentle audio chime synthesizer using Web Audio API
function playChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // Nada pertama: D5 (587.33 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
    gain1.gain.setValueAtTime(0.08, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.35);

    // Nada kedua: A5 (880 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
    gain2.gain.setValueAtTime(0.1, ctx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.6);
  } catch {
    // Ignore audio policy restriction before first user click
  }
}

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 60) return "Baru saja";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} mnt lalu`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} jam lalu`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay === 1) return "Kemarin";
    if (diffDay < 7) return `${diffDay} hari lalu`;

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return "Baru saja";
  }
}

export default function NotificationDropdown() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [totalUnread, setTotalUnread] = useState(0);
  const [counts, setCounts] = useState<NotificationCounts>({
    inquiries: 0,
    pendingPayments: 0,
    pendingComplaints: 0,
    overdueInvoices: 0,
    expiringLeases: 0,
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filterType, setFilterType] = useState<"ALL" | "INQUIRY" | "PAYMENT" | "COMPLAINT" | "REMINDER">("ALL");

  const prevCountRef = useRef<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ambil data notifikasi
  const fetchNotifications = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const res = await apiFetch<AdminNotificationsResponse>("/api/admin/notifications");

      if (res && res.success) {
        setNotifications(res.notifications || []);
        setTotalUnread(res.totalUnread || 0);
        if (res.counts) setCounts(res.counts);

        // Mainkan audio chime jika ada notifikasi baru yang bertambah
        if (
          prevCountRef.current !== null &&
          res.totalUnread > prevCountRef.current &&
          soundEnabled
        ) {
          playChime();
        }

        prevCountRef.current = res.totalUnread;
      }
    } catch (err) {
      console.error("Gagal mengambil notifikasi admin:", err);
    } finally {
      setLoading(false);
    }
  }, [soundEnabled]);

  // Initial fetch & Polling berkala
  useEffect(() => {
    fetchNotifications(false);

    // Polling setiap 20 detik di latar belakang
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 20000);

    // Refresh saat window kembali fokus
    const handleFocus = () => {
      fetchNotifications(true);
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchNotifications]);

  // Tutup dropdown saat klik di luar atau tekan Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleItemClick = (link: string) => {
    setIsOpen(false);
    router.push(link);
  };

  // Filter notifikasi sesuai tab aktif
  const filteredNotifications = notifications.filter((item) => {
    if (filterType === "ALL") return true;
    if (filterType === "INQUIRY") return item.type === "INQUIRY";
    if (filterType === "PAYMENT") return item.type === "PAYMENT";
    if (filterType === "COMPLAINT") return item.type === "COMPLAINT";
    if (filterType === "REMINDER") return item.type === "OVERDUE" || item.type === "EXPIRING_LEASE";
    return true;
  });

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Tombol Lonceng Notifikasi */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications(true);
        }}
        aria-expanded={isOpen}
        aria-label="Lihat notifikasi"
        className={`relative -m-2.5 p-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
          isOpen
            ? "bg-[#1F3D35]/10 text-[#1F3D35]"
            : "text-[#6B716D] hover:bg-[#F8F7F4] hover:text-[#1F3D35]"
        }`}
      >
        <Bell className="h-5 w-5 sm:h-6 sm:w-6" />

        {/* Badge Angka Dinamis */}
        {totalUnread > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E54D2E] px-1 text-[11px] font-extrabold text-white shadow-sm ring-2 ring-white animate-pulse">
            {totalUnread > 99 ? "99+" : totalUnread}
          </span>
        ) : null}
      </button>

      {/* Floating Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-[340px] sm:w-[420px] rounded-2xl bg-white shadow-2xl border border-[#E5E3DE] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header Popover */}
          <div className="flex items-center justify-between border-b border-[#E5E3DE] bg-[#F8F7F4]/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#1F3D35]">Notifikasi Admin</span>
              {totalUnread > 0 && (
                <span className="rounded-full bg-[#E54D2E]/10 px-2 py-0.5 text-xs font-bold text-[#E54D2E]">
                  {totalUnread} Tugas Baru
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {/* Tombol Toggle Suara */}
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? "Nonaktifkan Suara" : "Aktifkan Suara"}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  soundEnabled
                    ? "text-[#1F3D35] hover:bg-white"
                    : "text-gray-400 hover:bg-white hover:text-gray-600"
                }`}
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>

              {/* Tombol Refresh Manual */}
              <button
                type="button"
                onClick={() => fetchNotifications(false)}
                disabled={loading}
                title="Segarkan Notifikasi"
                className="p-1.5 rounded-lg text-[#6B716D] hover:bg-white hover:text-[#1F3D35] transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-[#C69C6D]" : ""}`} />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 overflow-x-auto border-b border-[#E5E3DE] px-3 py-2 scrollbar-none bg-white">
            <button
              type="button"
              onClick={() => setFilterType("ALL")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterType === "ALL"
                  ? "bg-[#1F3D35] text-white"
                  : "text-[#6B716D] hover:bg-[#F8F7F4] hover:text-[#1F3D35]"
              }`}
            >
              Semua ({totalUnread})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("INQUIRY")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterType === "INQUIRY"
                  ? "bg-[#1F3D35] text-white"
                  : "text-[#6B716D] hover:bg-[#F8F7F4] hover:text-[#1F3D35]"
              }`}
            >
              Reservasi {counts.inquiries > 0 ? `(${counts.inquiries})` : ""}
            </button>
            <button
              type="button"
              onClick={() => setFilterType("PAYMENT")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterType === "PAYMENT"
                  ? "bg-[#1F3D35] text-white"
                  : "text-[#6B716D] hover:bg-[#F8F7F4] hover:text-[#1F3D35]"
              }`}
            >
              Pembayaran {counts.pendingPayments > 0 ? `(${counts.pendingPayments})` : ""}
            </button>
            <button
              type="button"
              onClick={() => setFilterType("COMPLAINT")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterType === "COMPLAINT"
                  ? "bg-[#1F3D35] text-white"
                  : "text-[#6B716D] hover:bg-[#F8F7F4] hover:text-[#1F3D35]"
              }`}
            >
              Komplain {counts.pendingComplaints > 0 ? `(${counts.pendingComplaints})` : ""}
            </button>
            <button
              type="button"
              onClick={() => setFilterType("REMINDER")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterType === "REMINDER"
                  ? "bg-[#1F3D35] text-white"
                  : "text-[#6B716D] hover:bg-[#F8F7F4] hover:text-[#1F3D35]"
              }`}
            >
              Pengingat {counts.overdueInvoices + counts.expiringLeases > 0 ? `(${counts.overdueInvoices + counts.expiringLeases})` : ""}
            </button>
          </div>

          {/* Daftar Notifikasi */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-[#E5E3DE]/60">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-3">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <p className="text-sm font-bold text-[#1F3D35]">Semua Beres!</p>
                <p className="mt-1 text-xs text-[#6B716D] max-w-[240px]">
                  Tidak ada tugas atau pemberitahuan baru yang membutuhkan tindakan saat ini.
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => {
                let IconComponent = Bell;
                let iconBg = "bg-gray-100 text-gray-700";
                let badgeLabel = "";

                if (item.type === "INQUIRY") {
                  IconComponent = Calendar;
                  iconBg = "bg-amber-100 text-amber-800";
                  badgeLabel = "Reservasi";
                } else if (item.type === "PAYMENT") {
                  IconComponent = CreditCard;
                  iconBg = "bg-emerald-100 text-emerald-800";
                  badgeLabel = "Bayar";
                } else if (item.type === "COMPLAINT") {
                  IconComponent = AlertTriangle;
                  iconBg = "bg-rose-100 text-rose-800";
                  badgeLabel = "Komplain";
                } else if (item.type === "OVERDUE") {
                  IconComponent = Clock;
                  iconBg = "bg-red-100 text-red-800";
                  badgeLabel = "Jatuh Tempo";
                } else if (item.type === "EXPIRING_LEASE") {
                  IconComponent = FileText;
                  iconBg = "bg-blue-100 text-blue-800";
                  badgeLabel = "Kontrak Habis";
                }

                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item.link)}
                    className="group flex items-start gap-3 p-3.5 hover:bg-[#F8F7F4] transition-colors cursor-pointer"
                  >
                    {/* Ikon Kategori */}
                    <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${iconBg} mt-0.5 shadow-sm`}>
                      <IconComponent className="h-4 w-4" />
                    </div>

                    {/* Konten Notifikasi */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#1F3D35] truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-[#99A09C] flex-shrink-0 whitespace-nowrap">
                          {formatRelativeTime(item.createdAt)}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-[#6B716D] line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="inline-block rounded-md bg-[#E5E3DE]/60 px-1.5 py-0.5 text-[10px] font-semibold text-[#1F3D35]">
                          {badgeLabel}
                        </span>
                        {item.priority === "URGENT" && (
                          <span className="inline-block rounded-md bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
                            Penting
                          </span>
                        )}
                        <span className="text-[11px] font-medium text-[#C69C6D] group-hover:underline ml-auto flex items-center gap-0.5">
                          Tindak lanjuti
                          <ChevronRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Popover */}
          <div className="border-t border-[#E5E3DE] bg-[#F8F7F4]/60 px-4 py-2.5 text-center">
            <p className="text-[11px] text-[#99A09C]">
              Tersinkronisasi otomatis dengan status database Kostara
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
