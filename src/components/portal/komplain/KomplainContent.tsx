import { Wrench, Plus, UploadCloud, Clock, CheckCircle2, AlertCircle, Send } from "lucide-react";
import { maintenanceRequests } from "@/data/portal";

export default function KomplainContent() {
  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[#202321]">Komplain & Perbaikan</h1>
        <p className="text-[#6B716D] mt-1">Laporkan masalah fasilitas kamar atau area kos dengan cepat.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Kolom Kiri: Formulir Pengajuan (Seamless List View Style) */}
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-white border border-[#E5E3DE] rounded-lg flex items-center justify-center text-[#1F3D35] shadow-sm">
              <Plus className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-[#202321]">Buat Laporan Baru</h2>
          </div>

          <form className="bg-white border border-[#E5E3DE] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            
            <div className="p-6 sm:p-8 space-y-8">
              
              {/* Judul & Kategori */}
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-[#6B716D] uppercase tracking-widest mb-3">Judul Masalah</label>
                  <input 
                    type="text" 
                    placeholder="Misal: AC Bocor, Lampu Mati"
                    className="w-full bg-transparent border-b-2 border-[#E5E3DE] focus:border-[#1F3D35] px-2 py-2 text-lg font-medium text-[#202321] focus:outline-none transition-colors placeholder:font-normal placeholder:text-[#A0A4A1]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-bold text-[#6B716D] uppercase tracking-widest mb-3">Kategori</label>
                    <select className="w-full bg-[#F8F7F4] border-none rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3D35] transition-shadow appearance-none cursor-pointer font-medium text-[#202321]">
                      <option value="">Pilih Kategori</option>
                      <option value="ac">Air Conditioner (AC)</option>
                      <option value="listrik">Listrik & Lampu</option>
                      <option value="air">Air & Pipa</option>
                      <option value="furnitur">Furnitur</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6B716D] uppercase tracking-widest mb-3">Urgensi</label>
                    <select className="w-full bg-[#F8F7F4] border-none rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3D35] transition-shadow appearance-none cursor-pointer font-medium text-[#202321]">
                      <option value="biasa">Biasa (1-2 Hari)</option>
                      <option value="mendesak">Mendesak (Darurat)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-bold text-[#6B716D] uppercase tracking-widest mb-3">Deskripsi Detail</label>
                <textarea 
                  rows={4}
                  placeholder="Ceritakan detail masalahnya agar teknisi kami dapat mempersiapkan alat yang tepat..."
                  className="w-full bg-[#F8F7F4] border-none rounded-xl px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3D35] transition-shadow resize-none font-medium text-[#202321]"
                ></textarea>
              </div>

              {/* Upload */}
              <div>
                <label className="block text-xs font-bold text-[#6B716D] uppercase tracking-widest mb-3">Upload Foto (Opsional)</label>
                <div className="border-2 border-dashed border-[#E5E3DE] rounded-2xl p-8 text-center hover:bg-[#F8F7F4]/50 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-[#E5E3DE] group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-5 h-5 text-[#C69C6D]" />
                  </div>
                  <p className="text-sm font-semibold text-[#202321]">Klik atau seret foto ke sini</p>
                  <p className="text-xs text-[#6B716D] mt-2">Maksimal 5MB (Format JPG/PNG)</p>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="bg-[#F8F7F4]/50 p-6 sm:px-8 border-t border-[#E5E3DE] flex justify-end">
              <button type="button" className="w-full sm:w-auto bg-[#1F3D35] hover:bg-[#162E28] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-[#1F3D35]/20 hover:-translate-y-0.5 flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Kirim Laporan
              </button>
            </div>

          </form>
        </div>

        {/* Kolom Kanan: Timeline Riwayat (Floating / Organic Style) */}
        <div className="lg:col-span-5 sticky top-28">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-white border border-[#E5E3DE] rounded-lg flex items-center justify-center text-[#6B716D] shadow-sm">
              <Clock className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-[#202321]">Status & Riwayat</h2>
          </div>

          <div className="relative border-l-2 border-[#E5E3DE]/80 ml-4 space-y-8 pb-4">
            
            {maintenanceRequests.map((req, idx) => {
              let icon;
              let badgeColor;
              let isDone = req.status === "Selesai";
              
              if (isDone) {
                icon = <CheckCircle2 className="w-3.5 h-3.5 text-white" />;
                badgeColor = "bg-green-500";
              } else if (req.status === "Diproses") {
                icon = <Wrench className="w-3.5 h-3.5 text-white" />;
                badgeColor = "bg-[#C69C6D]";
              } else {
                icon = <AlertCircle className="w-3.5 h-3.5 text-white" />;
                badgeColor = "bg-yellow-500";
              }

              return (
                <div key={req.id} className="relative pl-8 group">
                  {/* Timeline Dot (Kecil & Rapi) */}
                  <div className={`absolute -left-[13px] w-6 h-6 rounded-full ${badgeColor} flex items-center justify-center border-4 border-[#F8F7F4] shadow-sm transition-transform group-hover:scale-110`}>
                    {icon}
                  </div>
                  
                  {/* Konten Timeline (Floating Bubble Style) */}
                  <div className={`rounded-2xl p-5 border ${isDone ? 'bg-white/50 border-transparent' : 'bg-white border-[#E5E3DE] shadow-[0_4px_20px_rgba(0,0,0,0.02)]'}`}>
                    <div className="flex items-start justify-between mb-1">
                      <h3 className={`font-bold ${isDone ? 'text-[#6B716D]' : 'text-[#202321]'}`}>{req.issue}</h3>
                      <span className="text-xs font-semibold text-[#6B716D]">{req.date}</span>
                    </div>
                    <p className="text-sm text-[#6B716D] mb-4 leading-relaxed">{req.description}</p>
                    
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${isDone ? 'bg-green-50/50 border-green-100' : 'bg-[#F8F7F4] border-[#E5E3DE]'}`}>
                      {!isDone && (
                        <span className="relative flex h-2 w-2">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${badgeColor}`}></span>
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${badgeColor}`}></span>
                        </span>
                      )}
                      <span className={`text-xs font-semibold ${isDone ? 'text-green-700' : 'text-[#202321]'}`}>
                        {req.status}
                      </span>
                    </div>

                    {req.status === "Diproses" && (
                      <div className="mt-4 pt-4 border-t border-[#E5E3DE]">
                        <p className="text-sm text-[#202321] italic bg-[#F8F7F4] p-3 rounded-xl border border-[#E5E3DE]/50">
                          "Tim teknisi kami akan mengecek kamar Anda pada jam 14:00 siang ini." 
                          <span className="block mt-1 text-xs text-[#6B716D] font-semibold not-italic">— Admin Pondok Rahmat</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

          </div>
        </div>

      </div>
    </div>
  );
}
