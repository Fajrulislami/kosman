"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Download, Loader2 } from "lucide-react";
import StatCards from "@/components/admin/overview/StatCards";
import RevenueChart from "@/components/admin/overview/RevenueChart";
import RecentActivity from "@/components/admin/overview/RecentActivity";
import { apiFetch } from "@/lib/api";
import { DashboardOverview } from "@/types/admin";

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const res = await apiFetch<DashboardOverview>("/api/admin/analytics/overview");
        setData(res);
      } catch (err) {
        console.error("Failed to load dashboard overview:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F3D35]">
            Dashboard Overview
          </h1>
          <p className="text-sm text-[#6B716D]">
            Ringkasan performa finansial, okupansi, dan aktivitas properti Kostara hari ini.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/penghuni"
            className="flex items-center gap-1.5 rounded-xl bg-[#1F3D35] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#2A5247]"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Penghuni Baru</span>
          </Link>
        </div>
      </div>

      {/* Top Stats */}
      <StatCards metrics={data?.metrics} />

      {/* Main Charts & Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart Area - Takes up 2/3 on large screens */}
        <div className="lg:col-span-2">
          <RevenueChart chartData={data?.chartData} />
        </div>

        {/* Activity Area - Takes up 1/3 on large screens */}
        <div className="lg:col-span-1">
          <RecentActivity recentActivities={data?.recentActivities} />
        </div>
      </div>
    </div>
  );
}
