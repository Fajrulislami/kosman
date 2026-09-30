"use client";

import { useState, useEffect, useCallback } from "react";
import TenantStats from "@/components/admin/penghuni/TenantStats";
import TenantTable from "@/components/admin/penghuni/TenantTable";
import AddTenantModal from "@/components/admin/penghuni/AddTenantModal";
import TenantDetailSlideOver from "@/components/admin/penghuni/TenantDetailSlideOver";
import InquiryTable, { InquiryItem } from "@/components/admin/penghuni/InquiryTable";
import { Plus, Users, CalendarCheck } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { TenantItem } from "@/types/admin";

export default function PenghuniPage() {
  const [tenants, setTenants] = useState<TenantItem[]>([]);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [stats, setStats] = useState<{ total: number; active: number; inactive: number } | undefined>();
  const [totalRooms, setTotalRooms] = useState(10);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"tenants" | "inquiries">("tenants");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<TenantItem | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tenantRes, roomRes, inquiryRes] = await Promise.all([
        apiFetch<{ data: TenantItem[]; stats: any }>("/api/admin/tenants"),
        apiFetch<{ stats: { total: number } }>("/api/admin/rooms").catch(() => ({ stats: { total: 10 } })),
        apiFetch<{ data: InquiryItem[] }>("/api/admin/inquiries").catch(() => ({ data: [] })),
      ]);

      setTenants(tenantRes.data || []);
      setStats(tenantRes.stats);
      setInquiries(inquiryRes.data || []);
      if (roomRes.stats?.total) {
        setTotalRooms(roomRes.stats.total);
      }
    } catch (err) {
      console.error("Error fetching tenants & inquiries:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleViewDetail = (tenant: TenantItem) => {
    setSelectedTenant(tenant);
    setIsDetailOpen(true);
  };

  const handleCheckout = async (leaseId: string) => {
    await apiFetch(`/api/admin/leases/${leaseId}/checkout`, { method: "POST" });
    await fetchData();
  };

  const newInquiriesCount = inquiries.filter((i) => i.status === "NEW").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#1F3D35]">Manajemen Penghuni</h1>
          <p className="mt-1 text-sm text-[#6B716D]">
            Kelola data penghuni kos aktif, alokasi kamar, dan calon penyewa dari website publik.
          </p>
        </div>

        {/* Call to Action */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="group flex items-center justify-center space-x-2 rounded-xl bg-[#1F3D35] px-6 py-3 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#152923] hover:shadow-xl cursor-pointer"
        >
          <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
          <span>Tambah Penghuni</span>
        </button>
      </div>

      {/* Stats Bento Grid */}
      <TenantStats stats={stats} totalRooms={totalRooms} />

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-[#E5E3DE] pb-2">
        <button
          onClick={() => setActiveTab("tenants")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all cursor-pointer ${
            activeTab === "tenants"
              ? "bg-[#1F3D35] text-white shadow-sm"
              : "text-[#6B716D] hover:bg-[#F8F7F4] hover:text-[#1F3D35]"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Penghuni Terdaftar ({tenants.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("inquiries")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all cursor-pointer ${
            activeTab === "inquiries"
              ? "bg-[#1F3D35] text-white shadow-sm"
              : "text-[#6B716D] hover:bg-[#F8F7F4] hover:text-[#1F3D35]"
          }`}
        >
          <CalendarCheck className="h-4 w-4" />
          <span>Reservasi Masuk ({inquiries.length})</span>
          {newInquiriesCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-extrabold text-white">
              {newInquiriesCount}
            </span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "tenants" ? (
        <TenantTable tenants={tenants} loading={loading} onViewDetail={handleViewDetail} />
      ) : (
        <InquiryTable inquiries={inquiries} loading={loading} onRefresh={fetchData} />
      )}

      {/* Modals & Slide-overs */}
      <AddTenantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchData}
      />

      <TenantDetailSlideOver
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        tenant={selectedTenant}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
