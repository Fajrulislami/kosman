"use client";

import { Users, DoorOpen, Wallet, AlertCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { DashboardOverview } from "@/types/admin";

interface StatCardsProps {
  metrics?: DashboardOverview["metrics"];
}

export default function StatCards({ metrics }: StatCardsProps) {
  const stats = [
    {
      name: "Total Penghuni Aktif",
      value: metrics ? String(metrics.occupiedRooms) : "0",
      trend: `${metrics?.occupancyRate ?? 0}% Okupansi`,
      trendUp: true,
      icon: Users,
      color: "bg-blue-100/50 text-blue-600 ring-1 ring-blue-500/20",
      trendColor: "text-blue-600 bg-blue-50",
    },
    {
      name: "Kamar Kosong",
      value: metrics ? String(metrics.availableRooms) : "0",
      trend: `${metrics?.totalRooms ?? 0} Total Unit`,
      trendUp: true,
      icon: DoorOpen,
      color: "bg-green-100/50 text-green-600 ring-1 ring-green-500/20",
      trendColor: "text-green-600 bg-green-50",
    },
    {
      name: "Pendapatan Bulan Ini",
      value: metrics ? metrics.revenueFormatted : "Rp 0",
      trend: "Terverifikasi",
      trendUp: true,
      icon: Wallet,
      color: "bg-[#FCECE9] text-[#E54D2E] ring-1 ring-[#E54D2E]/20",
      trendColor: "text-green-600 bg-green-50",
    },
    {
      name: "Tagihan Tertunda",
      value: metrics ? String(metrics.unpaidInvoices) : "0",
      trend: metrics && metrics.unpaidInvoices > 0 ? "Perlu Ditagih" : "Aman",
      trendUp: false,
      icon: AlertCircle,
      color: "bg-amber-100/50 text-amber-600 ring-1 ring-amber-500/20",
      trendColor: metrics && metrics.unpaidInvoices > 0 ? "text-amber-600 bg-amber-50" : "text-green-600 bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#E5E3DE] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-[#C69C6D]/30"
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
          
          <div className="relative mt-5 flex items-center">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${stat.trendColor}`}
            >
              {stat.trendUp ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {stat.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
