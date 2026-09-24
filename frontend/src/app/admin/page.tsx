import StatCards from "@/components/admin/overview/StatCards";
import RevenueChart from "@/components/admin/overview/RevenueChart";
import RecentActivity from "@/components/admin/overview/RecentActivity";

export const metadata = {
  title: "Overview - Admin Dashboard Pondok Rahmat",
  description: "Overview metrics and recent activity",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F3D35]">
            Dashboard Overview
          </h1>
          <p className="text-sm text-[#6B716D]">
            Ringkasan performa dan aktivitas properti Pondok Rahmat hari ini.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-lg border border-[#E5E3DE] bg-white px-4 py-2 text-sm font-semibold text-[#1F3D35] transition-colors hover:bg-[#F8F7F4]">
            Unduh Laporan
          </button>
          <button className="rounded-lg bg-[#C69C6D] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#A88258]">
            Tambah Penghuni Baru
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <StatCards />

      {/* Main Charts & Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart Area - Takes up 2/3 on large screens */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>

        {/* Activity Area - Takes up 1/3 on large screens */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
