"use client";

import { MessageSquareWarning, Wrench, CheckCircle2, AlertCircle } from "lucide-react";

interface ComplaintPipelineProps {
  stats?: {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
  };
}

export default function ComplaintPipeline({ stats }: ComplaintPipelineProps) {
  const pendingCount = stats?.pending ?? 0;
  const inProgressCount = stats?.inProgress ?? 0;
  const resolvedCount = stats?.resolved ?? 0;

  return (
    <div className="mb-8 rounded-3xl bg-white p-6 md:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-[#E5E3DE]">
      
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#1F3D35]">Alur Penanganan Keluhan & Fasilitas</h2>
        {pendingCount > 0 ? (
          <div className="flex items-center space-x-2 rounded-full bg-[#FFF4E5] px-3 py-1 text-xs font-bold text-[#F59E0B]">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{pendingCount} Perlu Ditindaklanjuti Segera</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 rounded-full bg-[#E6F4EA] px-3 py-1 text-xs font-bold text-[#1E8E3E]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Semua Laporan Tertangani</span>
          </div>
        )}
      </div>

      {/* Visual Pipeline Container */}
      <div className="relative">
        <div className="absolute left-[16%] right-[16%] top-1/2 -z-10 h-1 -translate-y-1/2 bg-[#F8F7F4]"></div>
        <div 
          className="absolute left-[16%] top-1/2 -z-10 h-1 -translate-y-1/2 bg-[#C69C6D] transition-all duration-700"
          style={{ width: inProgressCount > 0 || resolvedCount > 0 ? "40%" : "5%" }}
        ></div>

        <div className="flex w-full justify-between relative z-10">
          
          {/* Node 1: Masuk (Baru) */}
          <div className="flex flex-col items-center group cursor-default w-1/3">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#1F3D35] text-white shadow-lg ring-4 ring-white transition-transform duration-300 group-hover:scale-110">
              <MessageSquareWarning className="h-6 w-6" />
              {pendingCount > 0 && (
                <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#E54D2E] text-xs font-bold text-white shadow-sm ring-2 ring-white">
                  {pendingCount}
                </div>
              )}
            </div>
            <div className="mt-4 text-center">
              <p className="font-bold text-[#1F3D35]">Laporan Masuk</p>
              <p className="mt-1 text-xs font-medium text-[#6B716D]">{pendingCount} belum direspons</p>
            </div>
          </div>

          {/* Node 2: Sedang Diproses */}
          <div className="flex flex-col items-center group cursor-default w-1/3">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#C69C6D] shadow-md ring-4 ring-[#F8F7F4] border-2 border-[#C69C6D] transition-transform duration-300 group-hover:scale-110">
              <Wrench className="h-6 w-6" />
              {inProgressCount > 0 && (
                <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#C69C6D] text-xs font-bold text-white shadow-sm ring-2 ring-white">
                  {inProgressCount}
                </div>
              )}
            </div>
            <div className="mt-4 text-center">
              <p className="font-bold text-[#1F3D35]">Sedang Dikerjakan</p>
              <p className="mt-1 text-xs font-medium text-[#6B716D]">{inProgressCount} dalam penanganan</p>
            </div>
          </div>

          {/* Node 3: Selesai */}
          <div className="flex flex-col items-center group cursor-default w-1/3">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#F8F7F4] text-[#1E8E3E] shadow-inner ring-4 ring-white border border-[#E5E3DE] transition-transform duration-300 group-hover:scale-110">
              <CheckCircle2 className="h-6 w-6" />
              <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#E6F4EA] text-xs font-bold text-[#1E8E3E] shadow-sm ring-2 ring-white">
                {resolvedCount}
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="font-bold text-[#6B716D] group-hover:text-[#1F3D35] transition-colors">Telah Selesai</p>
              <p className="mt-1 text-xs font-medium text-[#99A09C]">{resolvedCount} terselesaikan</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
