import { Receipt, CheckCircle2, AlertCircle, CreditCard, Download, Upload, ChevronRight } from "lucide-react";
import { billingHistory } from "@/data/portal";

export default function TagihanContent() {
  const activeBill = billingHistory.find((bill) => bill.status === "Belum Lunas");
  const pastBills = billingHistory.filter((bill) => bill.status === "Lunas");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#202321]">Tagihan & Pembayaran</h1>
        <p className="text-[#6B716D] mt-1">Kelola tagihan sewa dan riwayat pembayaran Anda.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Tagihan Aktif & Instruksi (Lebih Lebar) */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Card Tagihan Aktif (Highlight Utama) */}
          <div className="relative overflow-hidden bg-white rounded-3xl border border-[#E5E3DE] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
            {/* Dekorasi Latar */}
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Receipt className="w-48 h-48" />
            </div>

            <div className="relative p-8 md:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-[#F8F7F4] rounded-full flex items-center justify-center text-[#1F3D35]">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-sm font-bold tracking-wider text-[#6B716D] uppercase">Tagihan Bulan Ini</h2>
                  <p className="text-lg font-semibold text-[#202321]">{activeBill ? activeBill.month : "Tidak Ada Tagihan"}</p>
                </div>
              </div>

              {activeBill ? (
                <>
                  <div className="mb-10">
                    <p className="text-sm text-[#6B716D] mb-2">Total Pembayaran</p>
                    <div className="flex items-baseline gap-4">
                      <span className="text-5xl font-extrabold tracking-tighter text-[#202321]">
                        Rp {activeBill.amount.toLocaleString("id-ID")}
                      </span>
                      <span className="flex items-center gap-1 text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
                        <AlertCircle className="w-4 h-4" /> Belum Lunas
                      </span>
                    </div>
                    <p className="text-[#6B716D] mt-4 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> Jatuh tempo pada <span className="font-semibold text-[#202321]">{activeBill.dueDate}</span>
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 border-t border-[#E5E3DE] pt-8">
                    <button className="flex-1 bg-[#1F3D35] hover:bg-[#162E28] text-white px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#1F3D35]/20 hover:-translate-y-0.5">
                      <CreditCard className="w-5 h-5" />
                      Bayar Sekarang (Virtual Account)
                    </button>
                    <button className="flex-1 bg-white border border-[#E5E3DE] text-[#202321] hover:bg-[#F8F7F4] px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
                      <Upload className="w-5 h-5" />
                      Upload Bukti Transfer
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-10">
                  <div className="flex items-center gap-3 text-green-600 mb-2">
                    <CheckCircle2 className="w-8 h-8" />
                    <span className="text-2xl font-bold">Semua Lunas!</span>
                  </div>
                  <p className="text-[#6B716D]">Anda tidak memiliki tagihan aktif saat ini. Terima kasih telah membayar tepat waktu.</p>
                </div>
              )}
            </div>
          </div>

          {/* Card Instruksi Pembayaran Transfer Manual */}
          <div className="bg-white rounded-2xl p-8 border border-[#E5E3DE] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="text-lg font-bold text-[#202321] mb-6">Informasi Transfer Manual</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-[#F8F7F4] border border-[#E5E3DE]">
                <p className="text-sm font-semibold text-[#6B716D] mb-1">Bank BCA</p>
                <p className="text-xl font-bold tracking-wider text-[#202321] mb-2">1234 5678 90</p>
                <p className="text-sm text-[#6B716D]">a.n. PT Pondok Rahmat Nusantara</p>
              </div>
              <div className="p-5 rounded-xl bg-[#F8F7F4] border border-[#E5E3DE]">
                <p className="text-sm font-semibold text-[#6B716D] mb-1">Bank Mandiri</p>
                <p className="text-xl font-bold tracking-wider text-[#202321] mb-2">098 7654 321</p>
                <p className="text-sm text-[#6B716D]">a.n. PT Pondok Rahmat Nusantara</p>
              </div>
            </div>
            <p className="text-sm text-[#6B716D] mt-6 leading-relaxed">
              Jika melakukan transfer manual, pastikan nominal sesuai hingga 3 digit terakhir. Setelah transfer, gunakan tombol <strong>"Upload Bukti Transfer"</strong> pada kartu tagihan di atas agar pembayaran Anda dapat segera kami proses.
            </p>
          </div>
        </div>

        {/* Kolom Kanan: Riwayat Pembayaran */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-[#E5E3DE] shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-28">
            <h3 className="text-lg font-bold text-[#202321] mb-6">Riwayat Pembayaran</h3>
            
            <div className="space-y-4">
              {pastBills.length > 0 ? (
                pastBills.map((bill) => (
                  <div key={bill.id} className="group relative p-4 rounded-xl border border-[#E5E3DE] hover:border-[#C69C6D]/50 hover:bg-[#F8F7F4] transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-[#202321]">{bill.month}</p>
                        <p className="text-xs text-[#6B716D] mt-1">Dibayar: {bill.paidDate}</p>
                      </div>
                      <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-md border border-green-200">
                        <CheckCircle2 className="w-3 h-3" /> Lunas
                      </span>
                    </div>
                    
                    <div className="flex items-end justify-between">
                      <p className="font-bold text-[#202321]">Rp {bill.amount.toLocaleString("id-ID")}</p>
                      <button className="text-[#C69C6D] p-1.5 rounded-lg opacity-0 group-hover:opacity-100 group-hover:bg-white transition-all shadow-sm">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-[#6B716D]">
                  <Receipt className="w-8 h-8 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Belum ada riwayat pembayaran.</p>
                </div>
              )}
            </div>

            {pastBills.length > 0 && (
              <button className="w-full mt-6 py-3 text-sm font-semibold text-[#6B716D] hover:text-[#1F3D35] flex items-center justify-center gap-1 transition-colors">
                Lihat Semua Riwayat <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
