"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { apiFetch } from "@/lib/api";
import { PortalInvoiceItem, PortalComplaintItem, PortalLeaseExtensionItem } from "@/types/portal";

export interface PortalNotification {
  id: string;
  title: string;
  description: string;
  type: "invoice" | "complaint" | "extension";
  variant: "info" | "warning" | "error" | "success";
  link: string;
  date?: string;
}

interface PortalContextType {
  profile: any;
  invoices: PortalInvoiceItem[];
  complaints: PortalComplaintItem[];
  extensionStatus: PortalLeaseExtensionItem | null;
  notifications: PortalNotification[];
  readNotificationIds: string[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  activeBillCount: number;
  activeComplaintCount: number;
  propertyPhone: string;
  propertyName: string;
  rulesText: string;
  loading: boolean;
  refreshData: () => Promise<void>;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<any>(null);
  const [invoices, setInvoices] = useState<PortalInvoiceItem[]>([]);
  const [complaints, setComplaints] = useState<PortalComplaintItem[]>([]);
  const [extensionStatus, setExtensionStatus] = useState<PortalLeaseExtensionItem | null>(null);
  const [propertyPhone, setPropertyPhone] = useState("081122223333");
  const [propertyName, setPropertyName] = useState("Pondok Rahmat");
  const [rulesText, setRulesText] = useState("");
  const [loading, setLoading] = useState(true);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);

  // Muat status dibaca dari localStorage
  useEffect(() => {
    try {
      const storageKey = profile?.id ? `kostara_read_notifs_${profile.id}` : "kostara_read_notifs_guest";
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setReadNotificationIds(JSON.parse(saved));
      }
    } catch {
      // localStorage may fail in private mode
    }
  }, [profile?.id]);

  const saveReadIds = (newIds: string[]) => {
    setReadNotificationIds(newIds);
    try {
      const storageKey = profile?.id ? `kostara_read_notifs_${profile.id}` : "kostara_read_notifs_guest";
      localStorage.setItem(storageKey, JSON.stringify(newIds));
    } catch {
      // ignore
    }
  };

  const markAsRead = (id: string) => {
    if (!readNotificationIds.includes(id)) {
      saveReadIds([...readNotificationIds, id]);
    }
  };

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    saveReadIds(Array.from(new Set([...readNotificationIds, ...allIds])));
  };

  const fetchData = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [meRes, invRes, compRes, extRes, settingsRes] = await Promise.all([
        apiFetch<{ authenticated: boolean; user: any }>("/api/auth/me").catch(() => ({ authenticated: false, user: null })),
        apiFetch<{ data: PortalInvoiceItem[] }>("/api/portal/invoices").catch(() => ({ data: [] })),
        apiFetch<{ data: PortalComplaintItem[] }>("/api/portal/complaints").catch(() => ({ data: [] })),
        apiFetch<{ data: PortalLeaseExtensionItem | null }>("/api/portal/lease/extension-status").catch(() => ({ data: null })),
        apiFetch<{ data: { profile?: { phone?: string; name?: string }; rules?: { text?: string } } }>("/api/settings").catch(() => null),
      ]);

      setProfile(meRes.user);
      setInvoices(invRes.data || []);
      // Filter out legacy "Administrasi & Sewa" from regular complaints
      setComplaints((compRes.data || []).filter((c) => c.category !== "Administrasi & Sewa"));
      setExtensionStatus(extRes.data || null);

      if (settingsRes?.data?.profile?.phone) {
        setPropertyPhone(settingsRes.data.profile.phone);
      }
      if (settingsRes?.data?.profile?.name) {
        setPropertyName(settingsRes.data.profile.name);
      }
      if (settingsRes?.data?.rules?.text) {
        setRulesText(settingsRes.data.rules.text);
      }
    } catch (err) {
      if (!silent) console.error("PortalContext fetch error:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const handleSync = () => fetchData(true);
    window.addEventListener("focus", handleSync);
    document.addEventListener("visibilitychange", handleSync);

    // Refresh berkala setiap 10 detik
    const interval = setInterval(() => fetchData(true), 10000);

    return () => {
      window.removeEventListener("focus", handleSync);
      document.removeEventListener("visibilitychange", handleSync);
      clearInterval(interval);
    };
  }, [fetchData]);

  // Hitung jumlah tagihan yang butuh aksi
  const activeBillCount = invoices.filter(
    (b) => b.rawStatus === "PENDING" || b.rawStatus === "OVERDUE" || b.payment?.status === "REJECTED"
  ).length;

  // Hitung komplain yang sedang aktif berjalan
  const activeComplaintCount = complaints.filter(
    (c) => c.category !== "Administrasi & Sewa" && (c.rawStatus === "PENDING" || c.rawStatus === "IN_PROGRESS")
  ).length;

  // Susun notifikasi real-time
  const notifications = useMemo(() => {
    const list: PortalNotification[] = [];

    // 1. Notifikasi Perpanjangan Sewa Resmi
    if (extensionStatus) {
      if (extensionStatus.status === "PENDING") {
        list.push({
          id: `ext-pend-${extensionStatus.id}`,
          title: "Perpanjangan Sewa Ditinjau",
          description: `Pengajuan perpanjangan sewa ${extensionStatus.durationMonths} bulan sedang ditinjau oleh pihak pengelola.`,
          type: "extension",
          variant: "warning",
          link: "/portal",
          date: extensionStatus.createdAt,
        });
      } else if (extensionStatus.status === "APPROVED") {
        list.push({
          id: `ext-appr-${extensionStatus.id}`,
          title: "Perpanjangan Sewa Disetujui!",
          description: `Masa sewa Anda telah diperpanjang ${extensionStatus.durationMonths} bulan. Tagihan baru telah diterbitkan.`,
          type: "extension",
          variant: "success",
          link: "/portal/tagihan",
          date: extensionStatus.createdAt,
        });
      } else if (extensionStatus.status === "REJECTED") {
        list.push({
          id: `ext-rej-${extensionStatus.id}`,
          title: "Perpanjangan Sewa Ditolak",
          description: extensionStatus.adminNotes
            ? `Alasan: "${extensionStatus.adminNotes}"`
            : "Pengajuan perpanjangan sewa belum dapat disetujui pengelola saat ini.",
          type: "extension",
          variant: "error",
          link: "/portal",
          date: extensionStatus.createdAt,
        });
      }
    }

    // 2. Notifikasi Tagihan
    invoices.forEach((inv) => {
      if (inv.payment?.status === "REJECTED") {
        list.push({
          id: `inv-rej-${inv.id}`,
          title: "Bukti Pembayaran Ditolak",
          description: inv.payment.rejectReason
            ? `Alasan: "${inv.payment.rejectReason}". Silakan kirim ulang bukti bayar.`
            : `Bukti transfer tagihan ${inv.month} ditolak admin. Silakan upload ulang.`,
          type: "invoice",
          variant: "error",
          link: "/portal/tagihan",
        });
      } else if (inv.rawStatus === "OVERDUE") {
        list.push({
          id: `inv-due-${inv.id}`,
          title: "Tagihan Lewat Jatuh Tempo",
          description: `Tagihan sewa bulan ${inv.month} (${inv.dueDate}) telah jatuh tempo. Mohon segera lunasi.`,
          type: "invoice",
          variant: "error",
          link: "/portal/tagihan",
        });
      } else if (inv.rawStatus === "WAITING_CONFIRMATION") {
        list.push({
          id: `inv-wait-${inv.id}`,
          title: "Pembayaran Sedang Diverifikasi",
          description: `Bukti transfer bulan ${inv.month} telah diterima dan sedang ditinjau admin.`,
          type: "invoice",
          variant: "warning",
          link: "/portal/tagihan",
        });
      } else if (inv.rawStatus === "PENDING") {
        list.push({
          id: `inv-pen-${inv.id}`,
          title: `Tagihan Baru: ${inv.month}`,
          description: `Tagihan sewa sebesar Rp ${inv.amount.toLocaleString("id-ID")} jatuh tempo pada ${inv.dueDate}.`,
          type: "invoice",
          variant: "warning",
          link: "/portal/tagihan",
        });
      }
    });

    // 3. Notifikasi Komplain & Fasilitas
    complaints.forEach((comp) => {
      if (comp.rawStatus === "IN_PROGRESS") {
        list.push({
          id: `comp-prog-${comp.id}`,
          title: "Laporan Sedang Ditangani",
          description: `Tiket ${comp.ticketNumber} (${comp.issue}) saat ini sedang ditangani oleh teknisi.`,
          type: "complaint",
          variant: "info",
          link: "/portal/komplain",
          date: comp.date,
        });
      } else if (comp.rawStatus === "RESOLVED") {
        list.push({
          id: `comp-res-${comp.id}`,
          title: "Laporan Kerusakan Selesai",
          description: `Tiket ${comp.ticketNumber} (${comp.issue}) telah diselesaikan oleh tim pengelola.`,
          type: "complaint",
          variant: "success",
          link: "/portal/komplain",
          date: comp.resolvedDate || comp.date,
        });
      } else if (comp.rawStatus === "REJECTED") {
        list.push({
          id: `comp-rej-${comp.id}`,
          title: "Laporan Kerusakan Ditolak",
          description: `Tiket ${comp.ticketNumber} (${comp.issue}): ${comp.resolutionNote || "Laporan tidak dapat diproses."}`,
          type: "complaint",
          variant: "error",
          link: "/portal/komplain",
          date: comp.date,
        });
      }
    });

    return list;
  }, [extensionStatus, invoices, complaints]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !readNotificationIds.includes(n.id)).length;
  }, [notifications, readNotificationIds]);

  return (
    <PortalContext.Provider
      value={{
        profile,
        invoices,
        complaints,
        extensionStatus,
        notifications,
        readNotificationIds,
        unreadCount,
        markAsRead,
        markAllAsRead,
        activeBillCount,
        activeComplaintCount,
        propertyPhone,
        propertyName,
        rulesText,
        loading,
        refreshData: () => fetchData(true),
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}

export function usePortalContext() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error("usePortalContext must be used within a PortalProvider");
  }
  return context;
}
