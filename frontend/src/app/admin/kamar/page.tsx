"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import RoomStats from "@/components/admin/kamar/RoomStats";
import RoomFilters from "@/components/admin/kamar/RoomFilters";
import RoomTable from "@/components/admin/kamar/RoomTable";
import { apiFetch } from "@/lib/api";
import { RoomItem, RoomStatsData } from "@/types/admin";

export default function ManajemenKamarPage() {
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [stats, setStats] = useState<RoomStatsData | undefined>();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch<{ data: RoomItem[]; stats: RoomStatsData }>("/api/admin/rooms");
      setRooms(res.data || []);
      setStats(res.stats);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleDeleteRoom = async (id: string) => {
    await apiFetch(`/api/admin/rooms/${id}`, { method: "DELETE" });
    await fetchRooms();
  };

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      const matchSearch =
        search === "" ||
        r.number.toLowerCase().includes(search.toLowerCase()) ||
        r.tenant.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "" ||
        (statusFilter === "terisi" && r.rawStatus === "OCCUPIED") ||
        (statusFilter === "kosong" && r.rawStatus === "AVAILABLE") ||
        (statusFilter === "perbaikan" && r.rawStatus === "MAINTENANCE");

      const matchType = typeFilter === "" || r.type.toLowerCase() === typeFilter.toLowerCase();

      return matchSearch && matchStatus && matchType;
    });
  }, [rooms, search, statusFilter, typeFilter]);

  // Unique room types for dropdown filter
  const roomTypes = useMemo(() => {
    const set = new Set<string>();
    rooms.forEach((r) => {
      if (r.type) set.add(r.type);
    });
    return Array.from(set);
  }, [rooms]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-[#1F3D35]">
          Manajemen Kamar
        </h1>
        <p className="text-sm text-[#6B716D]">
          Pantau status ketersediaan, perbarui informasi harga, dan kelola unit fisik kamar kos.
        </p>
      </div>

      <RoomStats stats={stats} />
      
      <div className="flex flex-col gap-4">
        <RoomFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          roomTypes={roomTypes}
          onRoomCreated={fetchRooms}
        />
        <RoomTable rooms={filteredRooms} loading={loading} onDelete={handleDeleteRoom} />
      </div>
    </div>
  );
}
