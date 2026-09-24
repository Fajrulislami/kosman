"use client";

import { Eye, Bell, CheckCircle } from "lucide-react";

export type TabType = "menunggu" | "nunggak" | "lunas";

interface BillingTableProps {
  activeTab: TabType;
  onVerify?: (id: string) => void;
}

// Mock Data
const MOCK_DATA = {
  menunggu: [
    {
      id: "INV-1024-001",
      name: "Budi Santoso",
      room: "101",
      amount: "Rp 1.500.000",
      date: "12 Okt 2026",
      method: "Transfer BCA",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    {
      id: "INV-1024-005",
      name: "Siti Aminah",
      room: "102",
      amount: "Rp 1.200.000",
      date: "13 Okt 2026",
      method: "Transfer Mandiri",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    },
  ],
  nunggak: [
    {
      id: "INV-0924-042",
      name: "Andi Wijaya",
      room: "201",
      amount: "Rp 2.000.000",
      dueDate: "05 Okt 2026",
      daysLate: 8,
      avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    },
  ],
  lunas: [
    {
      id: "INV-1024-012",
      name: "Rina Kumala",
      room: "205",
      amount: "Rp 1.800.000",
      paidDate: "01 Okt 2026",
      method: "QRIS",
      avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
    },
  ],
};

export default function BillingTable({ activeTab, onVerify }: BillingTableProps) {
  const data = MOCK_DATA[activeTab] || [];

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[2rem] bg-white py-20 shadow-[0_2px_15px_rgb(0,0,0,0.04)]">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F8F7F4]">
          <CheckCircle className="h-10 w-10 text-[#C69C6D]" />
        </div>
        <h3 className="mt-6 text-lg font-bold text-[#1F3D35]">Semua Aman!</h3>
        <p className="mt-2 text-sm text-[#6B716D]">Tidak ada tagihan di kategori ini.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_2px_15px_rgb(0,0,0,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F8F7F4]/80 text-xs uppercase text-[#99A09C]">
            <tr>
              <th className="px-6 py-5 font-bold tracking-wider">No. Invoice & Penghuni</th>
              <th className="px-6 py-5 font-bold tracking-wider">Kamar</th>
              <th className="px-6 py-5 font-bold tracking-wider">Nominal</th>
              <th className="px-6 py-5 font-bold tracking-wider">
                {activeTab === "menunggu" && "Tanggal Bayar"}
                {activeTab === "nunggak" && "Jatuh Tempo"}
                {activeTab === "lunas" && "Tanggal Lunas"}
              </th>
              <th className="px-6 py-5 font-bold tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E3DE]">
            {data.map((item: any) => (
              <tr key={item.id} className="group transition-colors hover:bg-[#F8F7F4]/50">
                {/* Profil & Invoice */}
                <td className="px-6 py-5">
                  <div className="flex items-center space-x-4">
                    <img src={item.avatar} alt={item.name} className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-[#1F3D35]">{item.name}</p>
                      <p className="text-xs font-semibold text-[#99A09C]">{item.id}</p>
                    </div>
                  </div>
                </td>
                
                {/* Kamar */}
                <td className="px-6 py-5">
                  <span className="inline-flex items-center rounded-lg bg-[#F8F7F4] px-3 py-1 font-bold text-[#1F3D35]">
                    {item.room}
                  </span>
                </td>
                
                {/* Nominal */}
                <td className="px-6 py-5 font-black text-[#1F3D35]">
                  {item.amount}
                </td>
                
                {/* Tanggal / Status khusus */}
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="font-semibold text-[#6B716D]">
                      {item.date || item.dueDate || item.paidDate}
                    </span>
                    {activeTab === "menunggu" && (
                      <span className="text-xs font-medium text-[#C69C6D]">{item.method}</span>
                    )}
                    {activeTab === "nunggak" && (
                      <span className="text-xs font-bold text-[#E54D2E]">Telat {item.daysLate} hari</span>
                    )}
                  </div>
                </td>
                
                {/* Aksi */}
                <td className="px-6 py-5 text-right">
                  {activeTab === "menunggu" && (
                    <button 
                      onClick={() => onVerify && onVerify(item.id)}
                      className="inline-flex items-center justify-center space-x-2 rounded-xl bg-[#FFF4E5] px-4 py-2 text-sm font-bold text-[#F59E0B] transition-colors hover:bg-[#F59E0B] hover:text-white"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Cek Bukti</span>
                    </button>
                  )}
                  {activeTab === "nunggak" && (
                    <button className="inline-flex items-center justify-center space-x-2 rounded-xl bg-[#FFEAEA] px-4 py-2 text-sm font-bold text-[#E54D2E] transition-colors hover:bg-[#E54D2E] hover:text-white">
                      <Bell className="h-4 w-4" />
                      <span>Ingatkan</span>
                    </button>
                  )}
                  {activeTab === "lunas" && (
                    <span className="inline-flex items-center justify-center rounded-xl bg-[#E6F4EA] px-4 py-2 text-sm font-bold text-[#1E8E3E]">
                      Lunas
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
