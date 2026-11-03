"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Receipt,
  Wrench,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldCheck,
  X,
  CheckCheck,
  CalendarPlus,
} from "lucide-react";
import { usePortalContext, PortalNotification } from "@/context/PortalContext";

export default function PortalNotificationDropdown() {
  const {
    notifications,
    unreadCount,
    readNotificationIds,
    markAsRead,
    markAllAsRead,
  } = usePortalContext();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const hasUrgent = notifications.some(
    (n) => n.variant === "error" && !readNotificationIds.includes(n.id)
  );

  const getNotificationIcon = (n: PortalNotification) => {
    if (n.type === "extension") {
      return <CalendarPlus className="w-4 h-4 text-amber-700" />;
    }
    switch (n.variant) {
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "info":
      default:
        return n.type === "complaint" ? (
          <Wrench className="w-4 h-4 text-blue-600" />
        ) : (
          <Receipt className="w-4 h-4 text-amber-600" />
        );
    }
  };

  const getIconBg = (variant: string) => {
    switch (variant) {
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-amber-50 border-amber-200";
      case "success":
        return "bg-emerald-50 border-emerald-200";
      case "info":
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Tombol Lonceng */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-[#6B716D] hover:bg-[#F8F7F4] hover:text-[#1F3D35] rounded-full relative transition-colors cursor-pointer"
        aria-label="Buka notifikasi"
      >
        <Bell className="w-5 h-5" />

        {unreadCount > 0 && (
          <span
            className={`absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full text-[10px] font-bold text-white border-2 border-white shadow-xs ${
              hasUrgent ? "bg-red-500 animate-pulse" : "bg-[#C69C6D]"
            }`}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-white border border-[#E5E3DE] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header Popover */}
          <div className="p-4 border-b border-[#E5E3DE] bg-[#F8F7F4]/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-[#1F3D35]">Pemberitahuan</h4>
              {unreadCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1F3D35] text-white">
                  {unreadCount} baru
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E5E3DE] text-[#6B716D]">
                  {notifications.length}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C69C6D] hover:text-[#1F3D35] transition-colors cursor-pointer"
                  title="Tandai semua notifikasi sudah dibaca"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Tandai Dibaca</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#99A09C] hover:text-[#1F3D35] p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Daftar Notifikasi */}
          <div className="max-h-84 overflow-y-auto divide-y divide-[#E5E3DE]/60">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-[#6B716D]">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-[#202321]">Semua Terpantau Aman</p>
                <p className="text-xs text-[#99A09C] mt-1 max-w-xs mx-auto">
                  Tidak ada tagihan tertunggak atau permohonan yang membutuhkan perhatian saat ini.
                </p>
              </div>
            ) : (
              notifications.map((n) => {
                const isRead = readNotificationIds.includes(n.id);

                return (
                  <Link
                    key={n.id}
                    href={n.link}
                    onClick={() => {
                      markAsRead(n.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-start gap-3 p-3.5 transition-colors group cursor-pointer ${
                      isRead ? "hover:bg-[#F8F7F4]/60 bg-white" : "bg-[#F8F7F4]/40 hover:bg-[#F8F7F4]"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${getIconBg(
                        n.variant
                      )}`}
                    >
                      {getNotificationIcon(n)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p
                          className={`text-xs transition-colors line-clamp-1 ${
                            isRead
                              ? "font-medium text-[#4A4E4B]"
                              : "font-bold text-[#1F3D35] group-hover:text-[#1F3D35]"
                          }`}
                        >
                          {n.title}
                        </p>
                        {!isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C69C6D] shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#6B716D] mt-0.5 line-clamp-2 leading-relaxed">
                        {n.description}
                      </p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-[#99A09C] group-hover:text-[#1F3D35] shrink-0 mt-2 transition-colors" />
                  </Link>
                );
              })
            )}
          </div>

          {/* Footer Popover */}
          <div className="p-3 border-t border-[#E5E3DE] bg-[#F8F7F4]/60 flex items-center justify-between text-[11px] text-[#6B716D]">
            <span className="flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Portal Penghuni Kostara
            </span>
            <Link
              href="/portal/tagihan"
              onClick={() => setIsOpen(false)}
              className="font-bold text-[#1F3D35] hover:text-[#C69C6D] transition-colors"
            >
              Lihat Tagihan
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
