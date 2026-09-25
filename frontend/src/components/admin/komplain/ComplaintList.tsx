"use client";

import { Clock, MessageSquare, ArrowRight, Loader2 } from "lucide-react";
import { ComplaintItem } from "@/types/admin";

export type ComplaintTab = "masuk" | "proses" | "selesai";

interface ComplaintListProps {
  complaints: ComplaintItem[];
  activeTab: ComplaintTab;
  loading?: boolean;
  onOpenDetail: (complaint: ComplaintItem) => void;
}

export default function ComplaintList({
  complaints,
  activeTab,
  loading = false,
  onOpenDetail,
}: ComplaintListProps) {
  // Filter according to active tab
  const filtered = complaints.filter((item) => {
    if (activeTab === "masuk") return item.status === "PENDING";
    if (activeTab === "proses") return item.status === "IN_PROGRESS";
    if (activeTab === "selesai") return item.status === "RESOLVED" || item.status === "REJECTED";
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl bg-white py-20 border border-[#E5E3DE]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1F3D35]" />
        <p className="mt-3 text-sm text-[#6B716D]">Memuat laporan keluhan...</p>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl bg-white py-24 shadow-[0_2px_20px_rgb(0,0,0,0.04)] text-center border border-[#E5E3DE]">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F8F7F4] mb-6">
          <MessageSquare className="h-10 w-10 text-[#C69C6D]" />
        </div>
        <h3 className="text-xl font-bold text-[#1F3D35]">Tidak ada laporan</h3>
        <p className="mt-2 text-[#6B716D] max-w-sm">
          Semua kendali aman terkendali. Tidak ada laporan kendala pada tab ini saat ini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filtered.map((ticket) => (
        <div 
          key={ticket.id}
          onClick={() => onOpenDetail(ticket)}
          className="group relative flex cursor-pointer flex-col sm:flex-row items-start sm:items-center justify-between overflow-hidden rounded-2xl bg-white p-5 shadow-[0_2px_15px_rgb(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:shadow-lg border border-[#E5E3DE] hover:border-[#C69C6D]/40"
        >
          {/* Info Utama */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-1.5 flex-wrap gap-y-1">
              <span className="font-bold text-[#1F3D35]">Kamar {ticket.roomNumber}</span>
              <span className="text-[#E5E3DE]">|</span>
              <span className="text-sm font-semibold text-[#6B716D]">{ticket.tenantName}</span>
              <span className="text-[#E5E3DE]">|</span>
              <span className="text-xs font-semibold text-[#C69C6D]">{ticket.category}</span>
              
              {/* Badge Prioritas */}
              {(ticket.priority === "HIGH" || ticket.priority === "URGENT") && (
                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-700">
                  {ticket.priority === "URGENT" ? "Darurat" : "Mendesak"}
                </span>
              )}
            </div>
            
            <h3 className="text-lg font-bold text-[#1F3D35] group-hover:text-[#C69C6D] transition-colors line-clamp-1">
              {ticket.title}
            </h3>
            <p className="mt-1 text-sm font-medium text-[#6B716D] line-clamp-1 sm:line-clamp-2 max-w-3xl">
              {ticket.description}
            </p>
          </div>

          {/* Info Waktu & Aksi */}
          <div className="mt-4 sm:mt-0 flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto sm:pl-6 border-t sm:border-t-0 sm:border-l border-[#F8F7F4] pt-4 sm:pt-0">
            <div className="flex items-center space-x-1.5 text-[#99A09C]">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold whitespace-nowrap">
                {ticket.createdAt.split("T")[0]}
              </span>
            </div>
            
            <div className="sm:mt-4 flex items-center text-sm font-bold text-[#1F3D35] group-hover:text-[#C69C6D] transition-colors">
              <span>{ticket.status === "RESOLVED" ? "Lihat Solusi" : "Tindak Lanjuti"}</span>
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
