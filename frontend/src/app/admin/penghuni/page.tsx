"use client";

import { useState } from "react";
import TenantStats from "@/components/admin/penghuni/TenantStats";
import TenantTable from "@/components/admin/penghuni/TenantTable";
import AddTenantModal from "@/components/admin/penghuni/AddTenantModal";
import TenantDetailSlideOver from "@/components/admin/penghuni/TenantDetailSlideOver";
import { Plus } from "lucide-react";

export default function PenghuniPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);

  const handleViewDetail = (id: string) => {
    setSelectedTenantId(id);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#1F3D35]">Manajemen Penghuni</h1>
          <p className="mt-1 text-sm text-[#6B716D]">
            Kelola data penghuni, tagihan, dan pengajuan sewa baru.
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
      <TenantStats />

      {/* Data Table */}
      <TenantTable onViewDetail={handleViewDetail} />

      {/* Modals & Slide-overs */}
      <AddTenantModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      
      <TenantDetailSlideOver 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        tenantId={selectedTenantId}
      />
    </div>
  );
}
