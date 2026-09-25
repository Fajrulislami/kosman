"use client";

import { useState, useEffect, useCallback } from "react";
import TenantStats from "@/components/admin/penghuni/TenantStats";
import TenantTable from "@/components/admin/penghuni/TenantTable";
import AddTenantModal from "@/components/admin/penghuni/AddTenantModal";
import TenantDetailSlideOver from "@/components/admin/penghuni/TenantDetailSlideOver";
import { Plus } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { TenantItem } from "@/types/admin";

export default function PenghuniPage() {
  const [tenants, setTenants] = useState<TenantItem[]>([]);
  const [stats, setStats] = useState<{ total: number; active: number; inactive: number } | undefined>();
  const [totalRooms, setTotalRooms] = useState(10);
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<TenantItem | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tenantRes, roomRes] = await Promise.all([
        apiFetch<{ data: TenantItem[]; stats: any }>("/api/admin/tenants"),
        apiFetch<{ stats: { total: number } }>("/api/admin/rooms").catch(() => ({ stats: { total: 10 } })),
      ]);

      setTenants(tenantRes.data || []);
      setStats(tenantRes.stats);
      if (roomRes.stats?.total) {
        setTotalRooms(roomRes.stats.total);
      }
    } catch (err) {
      console.error("Error fetching tenants:", err);
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#1F3D35]">Manajemen Penghuni</h1>
          <p className="mt-1 text-sm text-[#6B716D]">
            Kelola data penghuni terdaftar, alokasi kamar aktif, dan kontak darurat.
          </p>
        </div>
        
        {/* Call to Action */}
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="group flex items-center justify-center space-x-2 rounded-xl bg-[#1F3D35] px-6 py-3 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#152923] hover:shadow-xl"
        >
          <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
          <span>Tambah Penghuni</span>
        </button>
      </div>

      {/* Stats Bento Grid */}
      <TenantStats stats={stats} totalRooms={totalRooms} />

      {/* Data Table */}
      <TenantTable tenants={tenants} loading={loading} onViewDetail={handleViewDetail} />

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
