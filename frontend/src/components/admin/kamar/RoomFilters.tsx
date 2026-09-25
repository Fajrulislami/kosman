"use client";

import { useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import AddRoomModal from "./AddRoomModal";

interface RoomFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
  roomTypes: string[];
  onRoomCreated: () => void;
}

export default function RoomFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  roomTypes,
  onRoomCreated,
}: RoomFiltersProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search and Filters */}
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative max-w-md flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-[#99A09C]" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full rounded-xl border-0 py-2.5 pl-10 pr-3 text-[#1F3D35] ring-1 ring-inset ring-[#E5E3DE] placeholder:text-[#99A09C] focus:ring-2 focus:ring-inset focus:ring-[#C69C6D] sm:text-sm sm:leading-6"
              placeholder="Cari nomor kamar atau penghuni..."
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-[#1F3D35] ring-1 ring-inset ring-[#E5E3DE] focus:ring-2 focus:ring-[#C69C6D] sm:text-sm"
            >
              <option value="">Semua Status</option>
              <option value="terisi">Terisi</option>
              <option value="kosong">Kosong</option>
              <option value="perbaikan">Perbaikan</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => onTypeChange(e.target.value)}
              className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-[#1F3D35] ring-1 ring-inset ring-[#E5E3DE] focus:ring-2 focus:ring-[#C69C6D] sm:text-sm"
            >
              <option value="">Semua Tipe</option>
              {roomTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#1F3D35] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#2A5247]"
        >
          <Plus className="h-5 w-5" />
          Tambah Kamar
        </button>
      </div>

      {/* Modal Component */}
      <AddRoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={onRoomCreated}
      />
    </>
  );
}
