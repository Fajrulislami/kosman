"use client";

import { useEffect, useRef, useState } from "react";
import { PanelLeft, CheckCircle2 } from "lucide-react";

/* 
  =========================================
  DATA CERITA (JURNAL KOS)
  =========================================
*/
const storyList = [
  {
    title: "Filosofi Awal.",
    text: "Berawal dari visi sederhana untuk menciptakan ruang yang bukan sekadar tempat singgah, melainkan sebuah 'rumah' bagi para perantau. Kami menyadari bahwa kenyamanan ruang privat sangat memengaruhi produktivitas dan ketenangan pikiran harian."
  },
  {
    title: "Harmoni Desain.",
    text: "Kami memadukan elemen modern minimalis dengan sentuhan warna alam yang hangat. Sirkulasi udara yang baik dan masuknya cahaya matahari alami menjadi prioritas utama di setiap sudut kamar serta area komunal kami."
  },
  {
    title: "Membangun Komunitas.",
    text: "Lebih dari sekadar fasilitas bangunan fisik, Pondok Rahmat dirancang untuk membentuk lingkungan sosial yang positif. Area komunal dibuat agar penghuni dapat berinteraksi secara natural tanpa mengganggu ranah privasi masing-masing."
  },
  {
    title: "Komitmen Pelayanan.",
    text: "Standar kebersihan dan keamanan dijaga sangat ketat 24/7. Tim pengelola selalu siap sedia merespons kebutuhan penghuni, memastikan Anda merasa tenang, aman, dan selalu memiliki alasan untuk pulang."
  }
];

export default function Story() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Memicu animasi saat kartu masuk ke layar
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Penghitung untuk jeda ketikan per kata
  let wordDelayIndex = 0;
  const SPEED_MS = 15; // Kecepatan super kilat per kata

  return (
    <section className="relative overflow-hidden bg-[#F8F7F4] py-24 md:py-32">
      
      {/* Pola Titik Latar Belakang (Dot Grid Root) */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#E5E3DE_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>

      {/* 
        =========================================
        STYLE CSS KHUSUS CUSTOM SCROLLBAR
        =========================================
      */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #E5E3DE;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #C69C6D;
        }
      `}</style>

      <div className="relative z-10 mx-auto w-full max-w-[900px] px-6">
        
        {/* 
          Wrapper Kartu Jurnal
          PERBAIKAN: max-h dikurangi drastis menjadi 450px agar tidak menjebak scroll 
        */}
        <div 
          ref={ref}
          className={`flex max-h-[450px] w-full flex-col overflow-hidden rounded-[16px] border border-[#E5E3DE] bg-white shadow-[0_20px_60px_rgba(31,61,53,0.08)] transition-all duration-1000 ease-out sm:rounded-[20px] ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
          }`}
        >
          
          {/* Top Bar macOS (Gaya Bersih tanpa kotak) */}
          <div className="flex shrink-0 items-center gap-4 border-b border-[#E5E3DE] bg-[#F8F7F4] px-5 py-3.5">
            {/* Tombol macOS */}
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#FF5F56]"></div>
              <div className="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
              <div className="h-3 w-3 rounded-full bg-[#27C93F]"></div>
            </div>
            
            {/* Ikon Layout & Label */}
            <div className="flex items-center gap-2 text-[#6B716D] opacity-80">
              <PanelLeft className="h-4 w-4" strokeWidth={2} />
              <span className="text-[11px] font-extrabold tracking-widest">
                STORY US
              </span>
            </div>
          </div>

          {/* Body Konten (Bisa Di-Scroll jika tinggi berlebih) */}
          <div className="custom-scrollbar flex-1 overflow-y-auto px-6 py-6 sm:px-10 sm:py-8">
            
            {/* PERBAIKAN: gap dirapatkan dari 10 ke 6 agar lebih padat di ruang yang kecil */}
            <ol className="flex flex-col gap-6 text-[14px] leading-relaxed sm:gap-8 sm:text-[15px]">
              {storyList.map((item, idx) => {
                const titleWords = item.title.split(" ");
                const textWords = item.text.split(" ");

                return (
                  <li key={idx} className="flex gap-4 sm:gap-6">
                    {/* Nomor Urut */}
                    <span 
                      className={`mt-0.5 shrink-0 text-[14px] font-bold text-[#C69C6D] transition-opacity duration-300 sm:text-[15px] ${
                        isVisible ? "opacity-100" : "opacity-0"
                      }`}
                      style={{ transitionDelay: `${wordDelayIndex * SPEED_MS}ms` }}
                    >
                      {idx + 1}.
                    </span>

                    {/* Teks dengan Efek Ketik per Kata */}
                    <p className="text-[#6B716D]">
                      
                      {/* Bagian Judul (Bold) */}
                      <strong className="font-bold text-[#1F3D35]">
                        {titleWords.map((word, wIdx) => {
                          wordDelayIndex++;
                          return (
                            <span 
                              key={`t-${wIdx}`} 
                              className="inline-block transition-opacity duration-150"
                              style={{ 
                                opacity: isVisible ? 1 : 0, 
                                transitionDelay: `${wordDelayIndex * SPEED_MS}ms` 
                              }}
                            >
                              {word}&nbsp;
                            </span>
                          );
                        })}
                      </strong>

                      {/* Bagian Teks Deskripsi */}
                      {textWords.map((word, wIdx) => {
                        wordDelayIndex++;
                        return (
                          <span 
                            key={`d-${wIdx}`} 
                            className="inline-block transition-opacity duration-150"
                            style={{ 
                              opacity: isVisible ? 1 : 0, 
                              transitionDelay: `${wordDelayIndex * SPEED_MS}ms` 
                            }}
                          >
                            {word}&nbsp;
                          </span>
                        );
                      })}
                    </p>
                  </li>
                );
              })}
            </ol>

            {/* Bottom Area (Stempel Tanda Tangan) */}
            <div 
              className={`mt-10 flex items-center justify-between border-t border-[#E5E3DE] pt-6 transition-all duration-700 ease-out sm:mt-12 sm:pt-8 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${(wordDelayIndex * SPEED_MS) + 300}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1F3D35]">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
                <span className="text-[13px] font-medium text-[#6B716D]">
                  Catatan Manajemen Pondok Rahmat
                </span>
              </div>
              <span className="text-[11px] font-bold tracking-widest text-[#C69C6D]">
                SEJAK 2024
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}