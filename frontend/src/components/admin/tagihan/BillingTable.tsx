"use client";

import { Eye, Bell, CheckCircle, Loader2 } from "lucide-react";
import { BillingItem } from "@/types/admin";

export type TabType = "menunggu" | "nunggak" | "lunas";

interface BillingTableProps {
  invoices: BillingItem[];
  activeTab: TabType;
  loading?: boolean;
  onVerify?: (invoice: BillingItem) => void;
}

export default function BillingTable({
  invoices,
  activeTab,
  loading = false,
  onVerify,
}: BillingTableProps) {
  // Filter invoices according to active tab
  const filtered = invoices.filter((item) => {
    if (activeTab === "menunggu") {
      return item.rawStatus === "WAITING_CONFIRMATION";
    }
    if (activeTab === "nunggak") {
      return item.rawStatus === "PENDING" || item.rawStatus === "OVERDUE";
    }
    if (activeTab === "lunas") {
      return item.rawStatus === "PAID";
    }
    return true;
  });

  const handleRemindWhatsApp = (item: BillingItem) => {
    let cleanPhone = item.tenantPhone.replace(/\D/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.slice(1);
    }
    const message = `Halo ${item.tenantName}, ini pengingat tagihan kos kamar ${item.roomNumber} (${item.invoiceNumber}) sejumlah ${item.amount} dengan jatuh tempo ${item.dueDate}. Mohon segera melakukan pembayaran melalui portal penghuni. Terima kasih!`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[2rem] bg-white py-20 shadow-sm border border-[#E5E3DE]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1F3D35]" />
        <p className="mt-3 text-sm text-[#6B716D]">Memuat data tagihan...</p>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[2rem] bg-white py-20 shadow-[0_2px_15px_rgb(0,0,0,0.04)] border border-[#E5E3DE]">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F8F7F4]">
          <CheckCircle className="h-10 w-10 text-[#C69C6D]" />
        </div>
        <h3 className="mt-6 text-lg font-bold text-[#1F3D35]">Semua Aman!</h3>
        <p className="mt-2 text-sm text-[#6B716D]">Tidak ada tagihan di kategori ini.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_2px_15px_rgb(0,0,0,0.04)] border border-[#E5E3DE]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F8F7F4]/80 text-xs uppercase text-[#99A09C]">
            <tr>
              <th className="px-6 py-5 font-bold tracking-wider">No. Invoice & Penghuni</th>
              <th className="px-6 py-5 font-bold tracking-wider">Kamar & Tipe</th>
              <th className="px-6 py-5 font-bold tracking-wider">Nominal</th>
              <th className="px-6 py-5 font-bold tracking-wider">
                {activeTab === "menunggu" && "Tanggal Bayar"}
                {activeTab === "nunggak" && "Jatuh Tempo"}
                {activeTab === "lunas" && "Periode / Tanggal"}
              </th>
              <th className="px-6 py-5 font-bold tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E3DE]">
            {filtered.map((item) => (
              <tr key={item.id} className="group transition-colors hover:bg-[#F8F7F4]/50">
                {/* Profil & Invoice */}
                <td className="px-6 py-5">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1F3D35] text-white font-bold text-xs">
                      {item.tenantName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-[#1F3D35]">{item.tenantName}</p>
                      <p className="text-xs font-semibold text-[#99A09C]">{item.invoiceNumber}</p>
                    </div>
                  </div>
                </td>
                
                {/* Kamar */}
                <td className="px-6 py-5">
                  <span className="inline-flex items-center rounded-lg bg-[#F8F7F4] px-3 py-1 font-bold text-[#1F3D35]">
                    Kamar {item.roomNumber} ({item.roomType})
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
                      {activeTab === "menunggu"
                        ? item.payment?.paidAt ? item.payment.paidAt.split("T")[0] : "-"
                        : item.dueDate}
                    </span>
                    {activeTab === "menunggu" && item.payment && (
                      <span className="text-xs font-medium text-[#C69C6D]">
                        {item.payment.method}
                      </span>
                    )}
                    {activeTab === "nunggak" && (
                      <span className="text-xs font-bold text-[#E54D2E]">
                        Periode: {item.period}
                      </span>
                    )}
                    {activeTab === "lunas" && (
                      <span className="text-xs font-medium text-[#1E8E3E]">
                        Periode: {item.period}
                      </span>
                    )}
                  </div>
                </td>
                
                {/* Aksi */}
                <td className="px-6 py-5 text-right">
                  {activeTab === "menunggu" && (
                    <button 
                      onClick={() => onVerify && onVerify(item)}
                      className="inline-flex items-center justify-center space-x-2 rounded-xl bg-[#FFF4E5] px-4 py-2 text-sm font-bold text-[#F59E0B] transition-colors hover:bg-[#F59E0B] hover:text-white"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Cek Bukti</span>
                    </button>
                  )}
                  {activeTab === "nunggak" && (
                    <button
                      onClick={() => handleRemindWhatsApp(item)}
                      className="inline-flex items-center justify-center space-x-2 rounded-xl bg-[#FFEAEA] px-4 py-2 text-sm font-bold text-[#E54D2E] transition-colors hover:bg-[#E54D2E] hover:text-white"
                    >
                      <Bell className="h-4 w-4" />
                      <span>Ingatkan WA</span>
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
      
      <div className="flex items-center justify-between border-t border-[#E5E3DE] bg-white px-6 py-4">
        <p className="text-sm text-[#6B716D]">
          Menampilkan <span className="font-semibold text-[#1F3D35]">{filtered.length}</span> tagihan
        </p>
      </div>
    </div>
  );
}
