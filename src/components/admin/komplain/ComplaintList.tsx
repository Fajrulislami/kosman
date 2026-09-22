"use client";

import { Clock, MessageSquare, ArrowRight } from "lucide-react";

export type ComplaintTab = "masuk" | "proses" | "selesai";

interface ComplaintListProps {
  activeTab: ComplaintTab;
  onOpenDetail: (id: string) => void;
}

// Mock Data
const MOCK_TICKETS = {
  masuk: [
    {
      id: "TKT-101",
      room: "Kamar 205",
      name: "Rina Kumala",
      title: "AC Bocor dan Kurang Dingin",
      desc: "Malam min, AC di kamar saya tiba-tiba netes air cukup deras dekat lemari, dan udaranya jadi tidak dingin sama sekali sejak kemarin.",
      time: "2 jam yang lalu",
      priority: "high", // high = red
    },
    {
      id: "TKT-102",
      room: "Kamar 102",
      name: "Siti Aminah",
      title: "Lampu Kamar Mandi Mati",
      desc: "Lampu kamar mandi tiba-tiba mati tadi pagi saat saya mau berangkat kerja. Tolong segera diganti ya, terima kasih.",
      time: "5 jam yang lalu",
      priority: "medium", // medium = yellow/orange
    },
    {
      id: "TKT-103",
      room: "Area Parkir",
      name: "Andi Wijaya",
      title: "Ada motor parkir sembarangan",
      desc: "Ada motor tamu yang parkir nutupin jalan keluar motor saya. Sudah dari jam 7 malam.",
      time: "Kemarin, 20:15",
      priority: "low", // low = green/gray
    },
  ],
  proses: [
    {
      id: "TKT-099",
      room: "Kamar 301",
      name: "Budi Santoso",
      title: "Keran Wastafel Mampet",
      desc: "Air di wastafel menggenang dan lama turunnya. Sepertinya saluran pipanya mampet.",
      time: "2 Hari yang lalu",
      priority: "medium",
    }
  ],
  selesai: [
    {
      id: "TKT-080",
      room: "Kamar 101",
      name: "Budi Santoso",
      title: "WiFi Putus Nyambung",
      desc: "Koneksi WiFi di kamar saya sering putus kalau malam hari.",
      time: "1 Minggu yang lalu",
      priority: "medium",
    }
  ]
};

export default function ComplaintList({ activeTab, onOpenDetail }: ComplaintListProps) {
  const tickets = MOCK_TICKETS[activeTab] || [];

  const getPriorityText = (priority: string) => {
    return priority === "high" ? "Mendesak" : "Biasa";
  };

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl bg-white py-24 shadow-[0_2px_20px_rgb(0,0,0,0.04)] text-center border border-[#E5E3DE]">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F8F7F4] mb-6">
          <MessageSquare className="h-10 w-10 text-[#C69C6D]" />
        </div>
        <h3 className="text-xl font-bold text-[#1F3D35]">Tidak ada laporan</h3>
        <p className="mt-2 text-[#6B716D] max-w-sm">
          Semua kendali ada di tangan Anda. Saat ini tidak ada laporan pada kategori ini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <div 
          key={ticket.id}
          onClick={() => onOpenDetail(ticket.id)}
          className="group relative flex cursor-pointer flex-col sm:flex-row items-start sm:items-center justify-between overflow-hidden rounded-2xl bg-white p-5 shadow-[0_2px_15px_rgb(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:shadow-lg border border-[#E5E3DE] hover:border-[#C69C6D]/30"
        >
          {/* Info Utama */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-1.5">
              <span className="font-bold text-[#1F3D35]">{ticket.room}</span>
              <span className="text-[#E5E3DE]">|</span>
              <span className="text-sm font-semibold text-[#6B716D]">{ticket.name}</span>
              
              {/* Badge Mendesak (Hitam/Putih Tanpa Warna Mencolok) */}
              {ticket.priority === "high" && (
                <span className="hidden sm:inline-flex items-center rounded-full border border-[#1F3D35] bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1F3D35]">
                  Mendesak
                </span>
              )}
            </div>
            
            <h3 className="text-lg font-bold text-[#1F3D35] group-hover:text-[#C69C6D] transition-colors line-clamp-1">
              {ticket.title}
            </h3>
            <p className="mt-1 text-sm font-medium text-[#6B716D] line-clamp-1 sm:line-clamp-2 max-w-3xl">
              {ticket.desc}
            </p>
          </div>

          {/* Info Waktu & Aksi */}
          <div className="mt-4 sm:mt-0 flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto sm:pl-6 border-t sm:border-t-0 sm:border-l border-[#F8F7F4] pt-4 sm:pt-0">
            <div className="flex items-center space-x-1.5 text-[#99A09C]">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold whitespace-nowrap">{ticket.time}</span>
            </div>
            
            <div className="sm:mt-4 flex items-center text-sm font-bold text-[#1F3D35] group-hover:text-[#C69C6D] transition-colors">
              <span>Proses</span>
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
