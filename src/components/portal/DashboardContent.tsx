import { Home, Receipt, Wrench, Clock, ChevronRight, AlertCircle, Phone, ArrowUpRight } from "lucide-react";
import { tenantProfile, billingHistory, maintenanceRequests } from "@/data/portal";
import Link from "next/link";

export default function DashboardContent() {
  const currentBill = billingHistory.find((bill) => bill.status === "Belum Lunas");
  const activeRequests = maintenanceRequests.filter((req) => req.status !== "Selesai");

  // Sisa hari sewa — nanti bisa diambil dari API
  const remainingDays = 24;
  
  // Warna dinamis berdasarkan urgensi
  const getUrgencyStyle = (days: number) => {
    if (days <= 7) return { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", icon: "text-red-500" };
    if (days <= 14) return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: "text-amber-500" };
    return { bg: "bg-[#F8F7F4]", text: "text-[#202321]", border: "border-[#E5E3DE]", icon: "text-[#1F3D35]" };
  };
  
  const urgency = getUrgencyStyle(remainingDays);

  return (
    <div className="space-y-6">
      
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Hero Greeting Card (Spans 2 columns) */}
        <div className="md:col-span-2 relative overflow-hidden bg-white rounded-3xl p-8 border border-[#E5E3DE] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <Home className="w-64 h-64 -mt-12 -mr-12" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-[#202321] tracking-tight">
              Halo, {tenantProfile.name.split(" ")[0]}!
            </h2>
            <p className="text-[#6B716D] mt-2 max-w-md leading-relaxed">
              Selamat datang kembali di portal Kostara. Semoga hari Anda menyenangkan dan nyaman berada di kos kami.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-[#E5E3DE]/50">
            <div className="flex items-center gap-3 bg-[#F8F7F4] px-4 py-2.5 rounded-xl border border-[#E5E3DE]">
              <Home className="w-5 h-5 text-[#C69C6D]" />
              <span className="font-semibold text-[#202321] text-sm">{tenantProfile.room}</span>
            </div>
            <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${urgency.bg} ${urgency.border}`}>
              <Clock className={`w-5 h-5 ${urgency.icon}`} />
              <span className={`font-semibold text-sm ${urgency.text}`}>Sisa Sewa: {remainingDays} Hari</span>
            </div>
          </div>
        </div>

        {/* 2. Urgent Action Card (Spans 1 column, Prominent Color) */}
        <div className="relative overflow-hidden bg-[#1F3D35] rounded-3xl p-8 shadow-[0_20px_40px_-15px_rgba(31,61,53,0.3)] flex flex-col justify-between group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-150"></div>
          
          <div>
            <div className="flex items-center justify-between text-white/80 mb-6">
              <span className="text-sm font-semibold tracking-wider uppercase">Tagihan Aktif</span>
              <Receipt className="w-5 h-5" />
            </div>
            
            {currentBill ? (
              <div>
                <p className="text-4xl font-bold text-white mb-2">
                  Rp {currentBill.amount.toLocaleString("id-ID")}
                </p>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <AlertCircle className="w-4 h-4 text-[#C69C6D]" />
                  <span>Jatuh tempo: {currentBill.dueDate}</span>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-3xl font-bold text-white mb-2">Semua Lunas!</p>
                <p className="text-white/80 text-sm">Terima kasih atas pembayaran Anda.</p>
              </div>
            )}
          </div>

          <Link
            href="/portal/tagihan"
            className="mt-8 bg-white text-[#1F3D35] px-4 py-3 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2 hover:bg-[#F8F7F4] transition-colors"
          >
            Lihat Detail Tagihan <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3. Maintenance Status (1 column) */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5E3DE] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#202321] flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#6B716D]" /> Komplain Anda
            </h3>
            <span className="bg-[#F8F7F4] text-[#1F3D35] text-xs font-bold px-3 py-1 rounded-full border border-[#E5E3DE]">
              {activeRequests.length} Aktif
            </span>
          </div>

          <div className="flex-1 space-y-4">
            {activeRequests.length > 0 ? (
              activeRequests.map((req) => (
                <div key={req.id} className="relative pl-4 border-l-2 border-[#C69C6D]">
                  <p className="font-semibold text-[#202321] text-sm">{req.issue}</p>
                  <p className="text-xs text-[#6B716D] mt-1">{req.status} • {req.date}</p>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                <Wrench className="w-8 h-8 mb-2" />
                <p className="text-sm">Tidak ada komplain aktif.</p>
              </div>
            )}
          </div>

          <Link href="/portal/komplain" className="mt-4 text-[#C69C6D] text-sm font-semibold hover:underline flex items-center gap-1">
            Ajukan Komplain <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4. Quick Links / Contacts (1 column) */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5E3DE] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#202321] mb-6 flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#6B716D]" /> Bantuan Cepat
            </h3>
            <div className="space-y-3">
              <a href="#" className="flex items-center justify-between p-3 rounded-xl border border-[#E5E3DE] hover:border-[#1F3D35] hover:bg-[#F8F7F4] transition-all group">
                <span className="text-sm font-semibold text-[#202321]">Hubungi Admin</span>
                <ChevronRight className="w-4 h-4 text-[#6B716D] group-hover:text-[#1F3D35]" />
              </a>
              <a href="#" className="flex items-center justify-between p-3 rounded-xl border border-[#E5E3DE] hover:border-[#1F3D35] hover:bg-[#F8F7F4] transition-all group">
                <span className="text-sm font-semibold text-[#202321]">Peraturan Kos</span>
                <ChevronRight className="w-4 h-4 text-[#6B716D] group-hover:text-[#1F3D35]" />
              </a>
            </div>
          </div>
        </div>

        {/* 5. Riwayat Singkat (1 column) */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5E3DE] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#202321] mb-6 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#6B716D]" /> Pembayaran Terakhir
            </h3>
            <div className="space-y-4">
              {billingHistory.filter(b => b.status === "Lunas").slice(0, 2).map((bill) => (
                <div key={bill.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-[#202321]">{bill.month}</p>
                    <p className="text-xs text-[#6B716D]">{bill.paidDate}</p>
                  </div>
                  <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-md border border-green-200">
                    Lunas
                  </span>
                </div>
              ))}
            </div>
          </div>
          <Link href="/portal/tagihan" className="mt-6 text-[#C69C6D] text-sm font-semibold hover:underline flex items-center gap-1">
            Lihat Semua <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
