"use client";

import { useState, useEffect, useCallback } from "react";
import ComplaintPipeline from "@/components/admin/komplain/ComplaintPipeline";
import ComplaintList, { ComplaintTab } from "@/components/admin/komplain/ComplaintList";
import ComplaintDetailSlideOver from "@/components/admin/komplain/ComplaintDetailSlideOver";
import { apiFetch } from "@/lib/api";
import { ComplaintItem } from "@/types/admin";

export default function KomplainPage() {
  const [activeTab, setActiveTab] = useState<ComplaintTab>("masuk");
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [stats, setStats] = useState<{ total: number; pending: number; inProgress: number; resolved: number } | undefined>();
  const [loading, setLoading] = useState(true);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch<{ data: ComplaintItem[]; stats: any }>("/api/admin/complaints");
      setComplaints(res.data || []);
      setStats(res.stats);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleOpenDetail = (complaint: ComplaintItem) => {
    setSelectedComplaint(complaint);
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = async (
    id: string,
    status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED",
    note?: string
  ) => {
    await apiFetch(`/api/admin/complaints/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, resolutionNote: note }),
    });
    await fetchComplaints();
  };

  const pendingCount = complaints.filter((c) => c.status === "PENDING").length;
  const inProgressCount = complaints.filter((c) => c.status === "IN_PROGRESS").length;
  const resolvedCount = complaints.filter((c) => c.status === "RESOLVED" || c.status === "REJECTED").length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-[#1F3D35]">Laporan Kendala (Komplain)</h1>
        <p className="mt-1 text-sm font-medium text-[#6B716D]">
          Pantau, tindak lanjuti perbaikan fasilitas, dan tangani keluhan penghuni secara terorganisir.
        </p>
      </div>

      {/* Visual Pipeline */}
      <ComplaintPipeline stats={stats} />

      {/* Main Content Area (Tabs & Ticket List) */}
      <div className="space-y-6">
        
        {/* Custom Tab Navigation */}
        <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide border-b border-[#E5E3DE]">
          <button
            onClick={() => setActiveTab("masuk")}
            className={`whitespace-nowrap px-6 py-4 text-sm font-bold transition-all relative ${
              activeTab === "masuk" 
                ? "text-[#1F3D35]" 
                : "text-[#99A09C] hover:text-[#1F3D35]"
            }`}
          >
            <span>Menunggu Respons</span>
            {activeTab === "masuk" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full bg-[#1F3D35]"></div>
            )}
            {pendingCount > 0 && (
              <span className={`ml-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs ${
                activeTab === "masuk" ? "bg-[#FFEAEA] text-[#E54D2E]" : "bg-[#F8F7F4] text-[#99A09C]"
              }`}>
                {pendingCount}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab("proses")}
            className={`whitespace-nowrap px-6 py-4 text-sm font-bold transition-all relative ${
              activeTab === "proses" 
                ? "text-[#C69C6D]" 
                : "text-[#99A09C] hover:text-[#1F3D35]"
            }`}
          >
            <span>Sedang Dikerjakan</span>
            {activeTab === "proses" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full bg-[#C69C6D]"></div>
            )}
            {inProgressCount > 0 && (
              <span className={`ml-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs ${
                activeTab === "proses" ? "bg-[#FFF4E5] text-[#F59E0B]" : "bg-[#F8F7F4] text-[#99A09C]"
              }`}>
                {inProgressCount}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab("selesai")}
            className={`whitespace-nowrap px-6 py-4 text-sm font-bold transition-all relative ${
              activeTab === "selesai" 
                ? "text-[#1E8E3E]" 
                : "text-[#99A09C] hover:text-[#1F3D35]"
            }`}
          >
            <span>Selesai ({resolvedCount})</span>
            {activeTab === "selesai" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full bg-[#1E8E3E]"></div>
            )}
          </button>
        </div>

        {/* Dynamic Ticket List based on Active Tab */}
        <ComplaintList
          complaints={complaints}
          activeTab={activeTab}
          loading={loading}
          onOpenDetail={handleOpenDetail}
        />
        
      </div>

      {/* Slide-over untuk eksekusi komplain */}
      <ComplaintDetailSlideOver 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        complaint={selectedComplaint}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
