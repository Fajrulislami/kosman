"use client";

import { useState } from "react";
import { Search, Filter, Eye, Loader2, Users } from "lucide-react";
import { TenantItem } from "@/types/admin";

interface TenantTableProps {
  tenants: TenantItem[];
  loading?: boolean;
  onViewDetail?: (tenant: TenantItem) => void;
}

export default function TenantTable({ tenants, loading = false, onViewDetail }: TenantTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");

  // Filter logic
  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.phone.includes(searchTerm) ||
      tenant.nik.includes(searchTerm);

    const matchesStatus =
      statusFilter === "semua" ||
      (statusFilter === "aktif" && tenant.status === "Aktif") ||
      (statusFilter === "nonaktif" && tenant.status !== "Aktif");

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="rounded-3xl bg-white shadow-[0_2px_15px_rgb(0,0,0,0.04)] overflow-hidden">
      {/* Header Actions */}
      <div className="flex flex-col border-b border-[#E5E3DE] p-6 sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold text-[#1F3D35]">Daftar Penghuni</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#99A09C]" />
            <input
              type="text"
              placeholder="Cari nama, kamar, NIK, atau no. HP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#C69C6D] focus:ring-1 focus:ring-[#C69C6D] sm:w-64 transition-all"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#99A09C]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-[#E5E3DE] bg-[#F8F7F4] py-2.5 pl-10 pr-10 text-sm font-medium text-[#6B716D] outline-none focus:border-[#C69C6D] focus:ring-1 focus:ring-[#C69C6D] transition-all cursor-pointer"
            >
              <option value="semua">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Non-Aktif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F8F7F4]/50 text-xs uppercase text-[#99A09C]">
            <tr>
              <th className="px-6 py-4 font-bold tracking-wider">Profil Penghuni</th>
              <th className="px-6 py-4 font-bold tracking-wider">Kamar & Tipe</th>
              <th className="px-6 py-4 font-bold tracking-wider">Masa Sewa</th>
              <th className="px-6 py-4 font-bold tracking-wider">Status</th>
              <th className="px-6 py-4 font-bold tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E3DE]">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[#6B716D]">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-[#1F3D35]" />
                    <span>Memuat data penghuni...</span>
                  </div>
                </td>
              </tr>
            ) : filteredTenants.length > 0 ? (
              filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="group transition-colors hover:bg-[#F8F7F4]/50">
                  {/* Profil */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1F3D35] text-white font-bold text-sm">
                        {tenant.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-[#1F3D35]">{tenant.name}</p>
                        <p className="text-xs text-[#6B716D]">{tenant.phone} • {tenant.email}</p>
                      </div>
                    </div>
                  </td>
                  
                  {/* Kamar */}
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[#1F3D35]">{tenant.room}</p>
                    <p className="text-xs text-[#6B716D]">{tenant.rentAmount}/bln</p>
                  </td>
                  
                  {/* Tanggal */}
                  <td className="px-6 py-4 text-[#6B716D] font-medium text-xs">
                    <p>Mulai: {tenant.startDate}</p>
                    <p>Hingga: {tenant.endDate}</p>
                  </td>
                  
                  {/* Status Badge */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        tenant.status === "Aktif"
                          ? "bg-[#E6F4EA] text-[#1E8E3E]"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tenant.status}
                    </span>
                  </td>
                  
                  {/* Aksi */}
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onViewDetail && onViewDetail(tenant)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E3DE] bg-white px-3 py-1.5 text-xs font-semibold text-[#1F3D35] hover:bg-[#F8F7F4] hover:border-[#C69C6D] transition-all"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Detail</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[#6B716D]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Users className="h-8 w-8 text-[#99A09C]" />
                    <p className="font-medium text-[#202321]">Tidak ada data penghuni</p>
                    <p className="text-xs text-[#99A09C]">Belum ada penghuni yang terdaftar atau hasil filter kosong</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer count */}
      <div className="flex items-center justify-between border-t border-[#E5E3DE] bg-white px-6 py-4">
        <p className="text-sm text-[#6B716D]">
          Menampilkan <span className="font-semibold text-[#1F3D35]">{filteredTenants.length}</span> penghuni
        </p>
      </div>
    </div>
  );
}
