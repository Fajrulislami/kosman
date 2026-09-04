import Link from "next/link";
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  ShieldCheck, 
  Wifi, 
  Bed 
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear(); 

  return (
    <footer className="relative overflow-hidden bg-[#162E28] pb-8 pt-20 text-white">
      
      {/* 
        Elemen Visual Pendukung (Poin 4)
        Efek pendaran cahaya (glow) abstrak di sudut kiri untuk mengisi ruang kosong.
        Visual ini murni abstrak dan hangat, tanpa elemen arsitektur/gedung perkantoran.
      */}
      <div className="absolute -left-20 top-10 z-0 h-64 w-64 rounded-full bg-[#C69C6D] opacity-5 blur-[100px]"></div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          
          {/* Kolom 1: Brand & Value Proposition (Poin 3 & 4 Digabung) */}
          <div className="md:col-span-5 lg:col-span-4">
            <Link href="/" className="group mb-4 inline-block transition-transform duration-300 hover:scale-[1.02]">
              <span className="text-3xl font-extrabold tracking-tighter text-white">
                Kostara<span className="text-[#C69C6D] transition-colors duration-300 group-hover:text-white">.</span>
              </span>
            </Link>
            
            <p className="mb-8 text-[15px] leading-relaxed text-white/70">
              Hunian nyaman untuk hidup lebih produktif.
            </p>

            {/* Value Proposition dengan Ikon (Poin 3) */}
            <div className="flex flex-col gap-3 border-l-2 border-[#C69C6D]/30 pl-4">
              <div className="group flex items-center gap-3 text-white/60 transition-colors duration-300 hover:text-white">
                <ShieldCheck className="h-4 w-4 text-[#C69C6D] transition-transform duration-300 group-hover:scale-125" />
                <span className="text-[14px]">Keamanan Terjamin 24/7</span>
              </div>
              <div className="group flex items-center gap-3 text-white/60 transition-colors duration-300 hover:text-white">
                <Wifi className="h-4 w-4 text-[#C69C6D] transition-transform duration-300 group-hover:scale-125" />
                <span className="text-[14px]">Internet Berkecepatan Tinggi</span>
              </div>
              <div className="group flex items-center gap-3 text-white/60 transition-colors duration-300 hover:text-white">
                <Bed className="h-4 w-4 text-[#C69C6D] transition-transform duration-300 group-hover:scale-125" />
                <span className="text-[14px]">Kamar Fully Furnished</span>
              </div>
            </div>
          </div>

          {/* Kolom 2: Navigasi */}
          <div className="md:col-span-3 lg:col-span-2 lg:col-start-6">
            <h3 className="mb-6 text-[16px] font-bold tracking-wide text-white">NAVIGASI</h3>
            <ul className="flex flex-col gap-4">
              {['Beranda', 'Kamar', 'Fasilitas', 'Lokasi'].map((item) => (
                <li key={item}>
                  <Link 
                    href={item === 'Beranda' ? '/' : `/${item.toLowerCase()}`}
                    className="inline-block text-[15px] text-white/70 transition-all duration-300 ease-out hover:translate-x-1.5 hover:text-[#C69C6D]"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Kontak & CTA */}
          <div className="md:col-span-4 lg:col-span-4">
            <h3 className="mb-6 text-[16px] font-bold tracking-wide text-white">KONTAK</h3>
            <ul className="mb-8 flex flex-col gap-5">
              <li className="group flex items-start gap-3 text-[15px] text-white/70 transition-colors duration-300 hover:text-white">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#C69C6D] transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110" />
                <span>Jl. Perintis Kemerdekaan, Makassar<br />Sulawesi Selatan, Indonesia</span>
              </li>
              <li className="group flex items-center gap-3 text-[15px] text-white/70 transition-colors duration-300 hover:text-white">
                <Phone className="h-5 w-5 shrink-0 text-[#C69C6D] transition-transform duration-300 ease-out group-hover:rotate-12 group-hover:scale-110" />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="group flex items-center gap-3 text-[15px] text-white/70 transition-colors duration-300 hover:text-white">
                <Mail className="h-5 w-5 shrink-0 text-[#C69C6D] transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110" />
                <span>halo@kostara.com</span>
              </li>
            </ul>

            <a 
              href="https://wa.me/6281234567890" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-transparent px-6 py-2.5 text-[14px] font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:border-[#C69C6D] hover:bg-[#C69C6D] hover:text-[#162E28] hover:shadow-[0_8px_20px_rgba(198,156,109,0.2)]"
            >
              <MessageCircle className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              Hubungi via WhatsApp
            </a>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-12 border-white/10" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-[14px] text-white/50">
            © {currentYear} Kostara. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="relative text-[14px] text-white/50 transition-colors duration-300 hover:text-white after:absolute after:bottom-[-2px] after:left-0 after:h-[1px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full">
              Privacy Policy
            </Link>
            <Link href="/terms" className="relative text-[14px] text-white/50 transition-colors duration-300 hover:text-white after:absolute after:bottom-[-2px] after:left-0 after:h-[1px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}