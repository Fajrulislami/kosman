"use client";

import { useState } from "react";
import { Search, Filter, MoreVertical, Eye, Edit, Trash2 } from "lucide-react";

// Mock Data
const MOCK_TENANTS = [
  {
    id: "T-101",
    name: "Budi Santoso",
    phone: "081234567890",
    room: "101",
    roomType: "Premium",
    joinDate: "12 Jan 2024",
    status: "aktif",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
  {
    id: "T-102",
    name: "Siti Aminah",
    phone: "089876543210",
    room: "102",
    roomType: "Standard",
    joinDate: "05 Feb 2024",
    status: "nunggak",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  {
    id: "T-103",
    name: "Andi Wijaya",
    phone: "081122334455",
    room: "201",
    roomType: "Premium",
    joinDate: "20 Mar 2024",
    status: "aktif",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
  },
  {
    id: "T-104",
    name: "Rina Kumala",
    phone: "087766554433",
    room: "205",
    roomType: "Deluxe",
    joinDate: "01 Sep 2024",
    status: "baru",
    avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
  },
];

interface TenantTableProps {
  onViewDetail?: (id: string) => void;
}

export default function TenantTable({ onViewDetail }: TenantTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");

  // Filter logic
  const filteredTenants = MOCK_TENANTS.filter((tenant) => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tenant.room.includes(searchTerm);
    const matchesStatus = statusFilter === "semua" || tenant.status === statusFilter;
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
              placeholder="Cari nama atau no. kamar..."
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
              <option value="baru">Baru</option>
              <option value="nunggak">Nunggak</option>
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
              <th className="px-6 py-4 font-bold tracking-wider">Kamar</th>
              <th className="px-6 py-4 font-bold tracking-wider">Tanggal Masuk</th>
              <th className="px-6 py-4 font-bold tracking-wider">Status</th>
              <th className="px-6 py-4 font-bold tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E3DE]">
            {filteredTenants.length > 0 ? (
              filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="group transition-colors hover:bg-[#F8F7F4]/50">
                  {/* Profil */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img src={tenant.avatar} alt={tenant.name} className="h-10 w-10 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-[#1F3D35]">{tenant.name}</p>
                        <p className="text-xs text-[#6B716D]">{tenant.phone}</p>
                      </div>
                    </div>
                  </td>
                  
                  {/* Kamar */}
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[#1F3D35]">Kamar {tenant.room}</p>
                    <p className="text-xs text-[#6B716D]">{tenant.roomType}</p>
                  </td>
                  
                  {/* Tanggal */}
                  <td className="px-6 py-4 text-[#6B716D] font-medium">
                    {tenant.joinDate}
                  </td>
                  
                  {/* Status Badge */}
                  <td className="px-6 py-4">
                    {tenant.status === 'aktif' && (
                      <span className="inline-flex items-center rounded-full bg-[#E6F4EA] px-2.5 py-1 text-xs font-semibold text-[#1E8E3E]">
                        Aktif
                      </span>
                    )}
                    {tenant.status === 'nunggak' && (
                      <span className="inline-flex items-center rounded-full bg-[#FCE8E6] px-2.5 py-1 text-xs font-semibold text-[#D93025]">
                        Nunggak
                      </span>
                    )}
                    {tenant.status === 'baru' && (
                      <span className="inline-flex items-center rounded-full bg-[#E8F0FE] px-2.5 py-1 text-xs font-semibold text-[#1A73E8]">
                        Baru
                      </span>
                    )}
                  </td>
                  
                  {/* Aksi */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button 
                        onClick={() => onViewDetail && onViewDetail(tenant.id)}
                        className="rounded-lg p-2 text-[#6B716D] hover:bg-white hover:text-[#1F3D35] hover:shadow-sm transition-all"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg p-2 text-[#6B716D] hover:bg-white hover:text-[#C69C6D] hover:shadow-sm transition-all">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg p-2 text-[#6B716D] hover:bg-white hover:text-[#E54D2E] hover:shadow-sm transition-all">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[#6B716D]">
                  Tidak ada penghuni yang sesuai dengan pencarian Anda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
