"use client";

import { useState } from "react";
import ComplaintPipeline from "@/components/admin/komplain/ComplaintPipeline";
import ComplaintList, { ComplaintTab } from "@/components/admin/komplain/ComplaintList";
import ComplaintDetailSlideOver from "@/components/admin/komplain/ComplaintDetailSlideOver";

export default function KomplainPage() {
  const [activeTab, setActiveTab] = useState<ComplaintTab>("masuk");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const handleOpenDetail = (id: string) => {
    setSelectedTicketId(id);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-[#1F3D35]">Laporan Kendala (Komplain)</h1>
        <p className="mt-1 text-sm font-medium text-[#6B716D]">
          Pantau dan tangani keluhan dari penghuni dengan cepat.
        </p>
      </div>

      {/* Visual Pipeline (Pengganti Stats Card) */}
      <ComplaintPipeline />

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
            Menunggu Respons
            {activeTab === "masuk" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full bg-[#1F3D35]"></div>
            )}
            <span className={`ml-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs ${
              activeTab === "masuk" ? "bg-[#FFEAEA] text-[#E54D2E]" : "bg-[#F8F7F4] text-[#99A09C]"
            }`}>
              3
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab("proses")}
            className={`whitespace-nowrap px-6 py-4 text-sm font-bold transition-all relative ${
              activeTab === "proses" 
                ? "text-[#C69C6D]" 
                : "text-[#99A09C] hover:text-[#1F3D35]"
            }`}
          >
            Sedang Dikerjakan
            {activeTab === "proses" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full bg-[#C69C6D]"></div>
            )}
            <span className={`ml-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs ${
              activeTab === "proses" ? "bg-[#FFF4E5] text-[#F59E0B]" : "bg-[#F8F7F4] text-[#99A09C]"
            }`}>
              1
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab("selesai")}
            className={`whitespace-nowrap px-6 py-4 text-sm font-bold transition-all relative ${
              activeTab === "selesai" 
                ? "text-[#1E8E3E]" 
                : "text-[#99A09C] hover:text-[#1F3D35]"
            }`}
          >
            Selesai
            {activeTab === "selesai" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full bg-[#1E8E3E]"></div>
            )}
          </button>
        </div>

        {/* Dynamic Ticket List based on Active Tab */}
        <ComplaintList activeTab={activeTab} onOpenDetail={handleOpenDetail} />
        
      </div>

      {/* Slide-over untuk eksekusi komplain */}
      <ComplaintDetailSlideOver 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        ticketId={selectedTicketId}
      />
    </div>
  );
}
