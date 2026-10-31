"use client";

import Link from "next/link";
import { Users, DoorOpen, Wallet, AlertCircle, ArrowUpRight, ArrowDownRight, ArrowRight, Minus } from "lucide-react";
import { DashboardOverview } from "@/types/admin";

interface StatCardsProps {
  metrics?: DashboardOverview["metrics"];
}

export default function StatCards({ metrics }: StatCardsProps) {
  const occupancyRate = metrics?.occupancyRate ?? 0;
  const availableRooms = metrics?.availableRooms ?? 0;
  const unpaidInvoices = metrics?.unpaidInvoices ?? 0;
  const growth = metrics?.revenueGrowth ?? 0;
  const activeTenants = metrics?.activeTenants ?? metrics?.occupiedRooms ?? 0;

  // 1. Occupancy Trend
  const isHighOccupancy = occupancyRate >= 80;
  const isMidOccupancy = occupancyRate >= 50;
  const occupancyTrendColor = isHighOccupancy
    ? "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-600/20"
    : isMidOccupancy
    ? "text-blue-700 bg-blue-50 ring-1 ring-blue-600/20"
    : "text-amber-700 bg-amber-50 ring-1 ring-amber-600/20";

  // 2. Room Vacancy Trend
  const roomTrend = availableRooms === 0 ? "Kamar Penuh (100%)" : `${availableRooms} Kamar Siap Huni`;
  const roomTrendColor = availableRooms === 0
    ? "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-600/20"
    : "text-blue-700 bg-blue-50 ring-1 ring-blue-600/20";

  // 3. Revenue Growth Trend vs Last Month
  let revenueTrend = `${growth > 0 ? `+${growth}` : growth}% vs bln lalu`;
  let revenueTrendUp = growth >= 0;
  let revenueTrendType: "up" | "down" | "neutral" = growth > 0 ? "up" : growth < 0 ? "down" : "neutral";
  let revenueTrendColor = "text-slate-600 bg-slate-100 ring-1 ring-slate-200";

  if (growth > 0) {
    revenueTrendColor = "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-600/20";
  } else if (growth < 0) {
    revenueTrendColor = "text-rose-700 bg-rose-50 ring-1 ring-rose-600/20";
  } else {
    revenueTrend = "Stabil vs bln lalu";
  }

  // 4. Unpaid Invoices Trend
  const unpaidTrend = unpaidInvoices > 0 ? `${unpaidInvoices} Perlu Ditagih` : "Semua Lunas";
  const unpaidTrendUp = unpaidInvoices === 0;
  const unpaidTrendColor = unpaidInvoices > 0
    ? "text-amber-700 bg-amber-50 ring-1 ring-amber-600/20"
    : "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-600/20";

  const stats = [
    {
      name: "Total Penghuni Aktif",
      value: metrics ? String(activeTenants) : "0",
      trend: `${occupancyRate}% Okupansi`,
      trendUp: isMidOccupancy,
      trendType: "up" as const,
      href: "/admin/penghuni",
      icon: Users,
      color: "bg-blue-100/50 text-blue-600 ring-1 ring-blue-500/20",
      trendColor: occupancyTrendColor,
      actionText: "Kelola Penghuni",
    },
    {
      name: "Kamar Kosong",
      value: metrics ? String(availableRooms) : "0",
      trend: roomTrend,
      trendUp: true,
      trendType: "up" as const,
      href: "/admin/kamar?status=kosong",
      icon: DoorOpen,
      color: "bg-green-100/50 text-green-600 ring-1 ring-green-500/20",
      trendColor: roomTrendColor,
      actionText: "Lihat Kamar Kosong",
    },
    {
      name: "Pendapatan Bulan Ini",
      value: metrics ? metrics.revenueFormatted : "Rp 0",
      trend: revenueTrend,
      trendUp: revenueTrendUp,
      trendType: revenueTrendType,
      href: "/admin/tagihan?tab=lunas",
      icon: Wallet,
      color: "bg-[#FCECE9] text-[#E54D2E] ring-1 ring-[#E54D2E]/20",
      trendColor: revenueTrendColor,
      actionText: "Lihat Transaksi Lunas",
    },
    {
      name: "Tagihan Tertunda",
      value: metrics ? String(unpaidInvoices) : "0",
      trend: unpaidTrend,
      trendUp: unpaidTrendUp,
      trendType: unpaidInvoices > 0 ? ("down" as const) : ("up" as const),
      href: "/admin/tagihan?tab=nunggak",
      icon: AlertCircle,
      color: "bg-amber-100/50 text-amber-600 ring-1 ring-amber-500/20",
      trendColor: unpaidTrendColor,
      actionText: "Lihat Tagihan Tertunda",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Link
          key={stat.name}
          href={stat.href}
          className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#E5E3DE] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-[#1F3D35]/30 block cursor-pointer"
          title={stat.actionText}
        >
          {/* Decorative Background Blob on Hover */}
          <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-gradient-to-br from-transparent to-black/5 opacity-0 transition-all duration-500 group-hover:scale-150 group-hover:opacity-100" />
          
          <div className="relative flex items-start justify-between">
            <div className="flex flex-col">
              <p className="text-sm font-semibold tracking-wide text-[#6B716D]">
                {stat.name}
              </p>
              <p className="mt-2 text-2xl lg:text-3xl font-black tracking-tight text-[#1F3D35]">
                {stat.value}
              </p>
            </div>
            
            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl shadow-inner ${stat.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
              <stat.icon className="h-6 w-6" aria-hidden="true" />
            </div>
          </div>
          
          <div className="relative mt-5 flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${stat.trendColor}`}
            >
              {stat.trendType === "neutral" ? (
                <Minus className="h-3 w-3" />
              ) : stat.trendUp ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {stat.trend}
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#99A09C] group-hover:text-[#1F3D35] transition-colors">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">Buka</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
