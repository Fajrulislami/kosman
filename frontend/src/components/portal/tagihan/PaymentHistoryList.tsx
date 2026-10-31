"use client";

import Link from "next/link";
import { Receipt, CheckCircle2, Printer } from "lucide-react";
import { PortalInvoiceItem } from "@/types/portal";

interface PaymentHistoryListProps {
  pastBills: PortalInvoiceItem[];
}

export default function PaymentHistoryList({ pastBills }: PaymentHistoryListProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E5E3DE] shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-28">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#202321]">Riwayat Pembayaran</h3>
        <span className="text-xs font-semibold text-[#6B716D] bg-[#F8F7F4] px-2.5 py-1 rounded-full border border-[#E5E3DE]">
          {pastBills.length} Tagihan
        </span>
      </div>

      <div className="space-y-3">
        {pastBills.length > 0 ? (
          pastBills.map((bill) => (
            <div 
              key={bill.id} 
              className="p-4 rounded-2xl border border-[#E5E3DE] bg-[#F8F7F4]/50 hover:border-[#1F3D35]/30 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-sm text-[#202321]">{bill.month}</p>
                  <p className="text-xs text-[#6B716D] mt-0.5">{bill.invoiceNumber}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                  <CheckCircle2 className="w-3 h-3" /> Lunas
                </span>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E5E3DE]/60">
                <div>
                  <span className="text-[11px] text-[#6B716D] block">Nominal Lunas</span>
                  <p className="font-extrabold text-sm text-[#1F3D35]">
                    Rp {bill.amount.toLocaleString("id-ID")}
                  </p>
                </div>
                <Link
                  href={`/portal/tagihan/${bill.id}/kwitansi`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-[#E5E3DE] hover:border-[#1F3D35] px-3.5 py-2 text-xs font-bold text-[#1F3D35] hover:bg-[#1F3D35] hover:text-white transition-all shadow-sm group active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5 text-[#C69C6D] group-hover:text-white transition-colors" />
                  <span>Kwitansi</span>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-[#6B716D]">
            <div className="w-12 h-12 rounded-full bg-[#F8F7F4] flex items-center justify-center mx-auto mb-3 text-[#99A09C]">
              <Receipt className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-[#202321]">Belum Ada Riwayat Pembayaran</p>
            <p className="text-xs text-[#99A09C] mt-1 max-w-xs mx-auto">
              Kwitansi resmi akan otomatis terbit di sini setelah pembayaran sewa Anda diverifikasi admin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
