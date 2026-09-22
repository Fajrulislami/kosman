import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShieldCheck } from "lucide-react";

export default function About() {
  return (
    <section className="relative w-full bg-[#F8F7F4] pb-24 pt-16 md:pb-32 md:pt-20">
      
      {/* Pola Titik Latar Belakang */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E3DE_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-20">
          
          {/* KOLOM KIRI: TEKS (STICKY SCROLL) */}
          <div className="flex h-fit flex-col lg:sticky lg:top-32 lg:col-span-5">
            
            <span className="mb-6 text-[13px] font-bold tracking-[0.2em] text-[#C69C6D]">
              TENTANG KAMI
            </span>

            <h2 className="mb-6 text-[32px] font-extrabold leading-[1.2] tracking-tight text-[#1F3D35] md:text-[42px]">
              Lebih dari sekadar <br className="hidden md:block" />
              tempat singgah.
            </h2>

            <div className="mb-8 flex flex-col gap-4 text-[16px] leading-[1.8] text-[#6B716D]">
              <p>
                Kami memahami bahwa kos bukan sekadar tempat untuk tidur setelah seharian beraktivitas. Ini adalah ruang privasi Anda, tempat mengembalikan energi, dan rumah kedua yang harus selalu terasa aman.
              </p>
              <p>
                Oleh karena itu, kami menghadirkan konsep hunian modern yang mengutamakan <strong>kebersihan, keamanan, dan ketenangan</strong>, agar Anda dapat fokus mengejar produktivitas setiap hari.
              </p>
            </div>

            {/* CTA - Efek Hover disamakan dengan tombol "Lihat Kamar" */}
            <Link 
              href="/tentang" 
              className="mt-4 inline-flex w-fit items-center justify-center rounded-[10px] bg-[#1F3D35] px-[22px] py-[14px] text-[14px] font-semibold text-white transition-all duration-300 hover:bg-[#162E28] hover:text-[#C69C6D] hover:shadow-[0_8px_20px_rgba(31,61,53,0.3)]"
            >
              Ketahui Lebih Lanjut
            </Link>
          </div>

          {/* KOLOM KANAN: GAMBAR */}
          <div className="flex flex-col gap-12 lg:col-span-7 lg:gap-24 lg:pt-10">
            
            {/* Gambar 1 - Ukuran Landscape */}
            <div className="group relative w-full md:w-[90%]">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-[16px] bg-[#E5E3DE] shadow-sm transition-shadow duration-500 hover:shadow-md">
                {/* <Image src="/images/tentang/kamar.jpg" alt="Suasana Kamar" fill className="object-cover" /> */}
              </div>
              
              {/* Kartu Info 1 */}
<<<<<<< HEAD
              <div className="absolute -bottom-6 -right-4 hidden items-center gap-4 rounded-xl border border-[#E5E3DE] bg-white px-6 py-4 shadow-sm md:flex lg:-right-8">
=======
              <div className="absolute -bottom-6 -right-4 flex items-center gap-4 rounded-xl border border-[#E5E3DE] bg-white px-4 py-3 shadow-sm md:px-6 md:py-4 lg:-right-8">
>>>>>>> development
                <Sparkles className="h-5 w-5 text-[#C69C6D]" />
                <div>
                  <p className="text-[14px] font-bold text-[#1F3D35]">Privasi Terjaga</p>
                  <p className="text-[13px] text-[#6B716D]">Desain interior tenang</p>
                </div>
              </div>
            </div>

            {/* Gambar 2 - Diubah menjadi aspect-[4/3] agar ukurannya seragam dengan Gambar 1 */}
            <div className="group relative w-full md:ml-auto md:w-[90%]">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-[16px] bg-[#E5E3DE] shadow-sm transition-shadow duration-500 hover:shadow-md">
                {/* <Image src="/images/tentang/fasilitas.jpg" alt="Fasilitas Bersih" fill className="object-cover" /> */}
              </div>
              
              {/* Kartu Info 2 */}
<<<<<<< HEAD
              <div className="absolute -left-6 bottom-12 hidden items-center gap-4 rounded-xl border border-[#E5E3DE] bg-white px-6 py-4 shadow-sm md:flex lg:-left-12">
=======
              <div className="absolute -left-2 bottom-8 flex items-center gap-4 rounded-xl border border-[#E5E3DE] bg-white px-4 py-3 shadow-sm md:-left-6 md:bottom-12 md:px-6 md:py-4 lg:-left-12">
>>>>>>> development
                <ShieldCheck className="h-5 w-5 text-[#C69C6D]" />
                <div>
                  <p className="text-[14px] font-bold text-[#1F3D35]">Lingkungan Bersih</p>
                  <p className="text-[13px] text-[#6B716D]">Perawatan harian</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}