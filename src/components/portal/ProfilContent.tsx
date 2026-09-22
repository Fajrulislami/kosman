import { tenantProfile } from "@/data/portal";
import { 
  User, Mail, Phone, MapPin, Key, ShieldCheck, 
  Car, Contact, Home, Calendar, Camera, HeartPulse
} from "lucide-react";

export default function ProfilContent() {
  return (
    <div className="max-w-3xl mx-auto pb-16 pt-4">
      
      {/* --- HEADER PROFIL (Seamless, Tanpa Kotak) --- */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="relative group cursor-pointer mb-4">
          <div className="w-28 h-28 bg-[#1F3D35] rounded-full shadow-lg flex items-center justify-center text-white text-4xl font-light tracking-widest overflow-hidden transition-transform duration-300 group-hover:scale-105">
            {tenantProfile.name.charAt(0)}
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
            <Camera className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-[#202321] tracking-tight">{tenantProfile.name}</h1>
        <p className="text-[#6B716D] mt-1">{tenantProfile.email}</p>
        
        <span className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          Tenant Terverifikasi
        </span>
      </div>

      <div className="space-y-10">

        {/* --- SECTION 1: Detail Kos (Read Only) --- */}
        <section>
          <h2 className="text-sm font-bold text-[#6B716D] uppercase tracking-widest mb-3 px-4">Informasi Sewa</h2>
          <div className="bg-white border border-[#E5E3DE] rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E5E3DE]/60 bg-[#F8F7F4]/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E3DE] flex items-center justify-center text-[#1F3D35] shadow-sm">
                  <Home className="w-4 h-4" />
                </div>
                <span className="font-semibold text-[#202321]">Kamar Saat Ini</span>
              </div>
              <span className="text-[#6B716D] font-medium text-right">{tenantProfile.room}</span>
            </div>

            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E3DE] flex items-center justify-center text-[#1F3D35] shadow-sm">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="font-semibold text-[#202321]">Tanggal Masuk</span>
              </div>
              <span className="text-[#6B716D] font-medium text-right">{tenantProfile.joinDate}</span>
            </div>

          </div>
        </section>

        {/* --- SECTION 2: Data Diri (Editable List Style) --- */}
        <section>
          <h2 className="text-sm font-bold text-[#6B716D] uppercase tracking-widest mb-3 px-4">Data Pribadi</h2>
          <div className="bg-white border border-[#E5E3DE] rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            
            <label className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E5E3DE]/60 hover:bg-[#F8F7F4]/50 transition-colors group cursor-text">
              <div className="flex items-center gap-3 w-1/3 min-w-[120px]">
                <User className="w-4 h-4 text-[#C69C6D]" />
                <span className="font-semibold text-[#202321] text-sm">Nama</span>
              </div>
              <input type="text" defaultValue={tenantProfile.name} className="w-full text-right bg-transparent text-[#6B716D] focus:text-[#1F3D35] font-medium outline-none" />
            </label>

            <label className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E5E3DE]/60 hover:bg-[#F8F7F4]/50 transition-colors group cursor-text">
              <div className="flex items-center gap-3 w-1/3 min-w-[120px]">
                <Mail className="w-4 h-4 text-[#C69C6D]" />
                <span className="font-semibold text-[#202321] text-sm">Email</span>
              </div>
              <input type="email" defaultValue={tenantProfile.email} className="w-full text-right bg-transparent text-[#6B716D] focus:text-[#1F3D35] font-medium outline-none" />
            </label>

            <label className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E5E3DE]/60 hover:bg-[#F8F7F4]/50 transition-colors group cursor-text">
              <div className="flex items-center gap-3 w-1/3 min-w-[120px]">
                <Phone className="w-4 h-4 text-[#C69C6D]" />
                <span className="font-semibold text-[#202321] text-sm">Telepon</span>
              </div>
              <input type="tel" defaultValue={tenantProfile.phone} className="w-full text-right bg-transparent text-[#6B716D] focus:text-[#1F3D35] font-medium outline-none" />
            </label>

            <label className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E5E3DE]/60 hover:bg-[#F8F7F4]/50 transition-colors group cursor-text">
              <div className="flex items-center gap-3 w-1/3 min-w-[120px]">
                <Car className="w-4 h-4 text-[#C69C6D]" />
                <span className="font-semibold text-[#202321] text-sm">Kendaraan</span>
              </div>
              <input type="text" placeholder="Plat Nomor (Opsional)" className="w-full text-right bg-transparent text-[#6B716D] focus:text-[#1F3D35] font-medium outline-none uppercase" />
            </label>

            <label className="flex items-start justify-between p-4 sm:p-5 hover:bg-[#F8F7F4]/50 transition-colors group cursor-text">
              <div className="flex items-center gap-3 w-1/3 min-w-[120px] pt-1">
                <MapPin className="w-4 h-4 text-[#C69C6D]" />
                <span className="font-semibold text-[#202321] text-sm">Alamat KTP</span>
              </div>
              <textarea rows={2} placeholder="Masukkan alamat asal..." className="w-full text-right bg-transparent text-[#6B716D] focus:text-[#1F3D35] font-medium outline-none resize-none"></textarea>
            </label>

          </div>
        </section>

        {/* --- SECTION 3: Kontak Darurat --- */}
        <section>
          <h2 className="text-sm font-bold text-[#6B716D] uppercase tracking-widest mb-3 px-4 flex items-center gap-2">
            Kontak Darurat <HeartPulse className="w-4 h-4 text-red-400" />
          </h2>
          <div className="bg-white border border-red-100/50 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            
            <label className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E5E3DE]/60 hover:bg-[#F8F7F4]/50 transition-colors group cursor-text">
              <div className="flex items-center gap-3 w-1/3 min-w-[120px]">
                <Contact className="w-4 h-4 text-red-400" />
                <span className="font-semibold text-[#202321] text-sm">Nama</span>
              </div>
              <input type="text" defaultValue={tenantProfile.emergencyContact.name} className="w-full text-right bg-transparent text-[#6B716D] focus:text-[#1F3D35] font-medium outline-none" />
            </label>

            <label className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E5E3DE]/60 hover:bg-[#F8F7F4]/50 transition-colors group cursor-text">
              <div className="flex items-center gap-3 w-1/3 min-w-[120px]">
                <User className="w-4 h-4 text-red-400" />
                <span className="font-semibold text-[#202321] text-sm">Hubungan</span>
              </div>
              <input type="text" defaultValue={tenantProfile.emergencyContact.relation} className="w-full text-right bg-transparent text-[#6B716D] focus:text-[#1F3D35] font-medium outline-none" />
            </label>

            <label className="flex items-center justify-between p-4 sm:p-5 hover:bg-[#F8F7F4]/50 transition-colors group cursor-text">
              <div className="flex items-center gap-3 w-1/3 min-w-[120px]">
                <Phone className="w-4 h-4 text-red-400" />
                <span className="font-semibold text-[#202321] text-sm">Telepon</span>
              </div>
              <input type="tel" defaultValue={tenantProfile.emergencyContact.phone} className="w-full text-right bg-transparent text-[#6B716D] focus:text-[#1F3D35] font-medium outline-none" />
            </label>

          </div>
        </section>

        {/* --- SECTION 4: Keamanan --- */}
        <section>
          <h2 className="text-sm font-bold text-[#6B716D] uppercase tracking-widest mb-3 px-4">Keamanan Akun</h2>
          <div className="bg-white border border-[#E5E3DE] rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            
            <label className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E5E3DE]/60 hover:bg-[#F8F7F4]/50 transition-colors group cursor-text">
              <div className="flex items-center gap-3 w-1/3 min-w-[120px]">
                <Key className="w-4 h-4 text-[#6B716D]" />
                <span className="font-semibold text-[#202321] text-sm">Password Lama</span>
              </div>
              <input type="password" placeholder="••••••••" className="w-full text-right bg-transparent text-[#6B716D] focus:text-[#1F3D35] font-medium outline-none tracking-widest placeholder:tracking-normal" />
            </label>

            <label className="flex items-center justify-between p-4 sm:p-5 hover:bg-[#F8F7F4]/50 transition-colors group cursor-text">
              <div className="flex items-center gap-3 w-1/3 min-w-[120px]">
                <Key className="w-4 h-4 text-[#6B716D]" />
                <span className="font-semibold text-[#202321] text-sm">Password Baru</span>
              </div>
              <input type="password" placeholder="Minimal 8 karakter" className="w-full text-right bg-transparent text-[#6B716D] focus:text-[#1F3D35] font-medium outline-none" />
            </label>

          </div>
        </section>

        {/* --- ACTION BUTTONS --- */}
        <div className="pt-6 flex flex-col-reverse sm:flex-row gap-4 justify-end">
          <button className="px-8 py-3.5 rounded-xl font-bold text-[#6B716D] hover:bg-white hover:text-[#202321] transition-colors border border-transparent hover:border-[#E5E3DE]">
            Batalkan
          </button>
          <button className="px-8 py-3.5 bg-[#1F3D35] text-white rounded-xl font-bold shadow-lg shadow-[#1F3D35]/20 hover:-translate-y-0.5 hover:bg-[#162E28] transition-all">
            Simpan Perubahan
          </button>
        </div>

      </div>
    </div>
  );
}
