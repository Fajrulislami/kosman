"use client";

import { useEffect, useRef, useState } from "react";
import { GraduationCap, Briefcase, Play, Pause, VolumeX } from "lucide-react";

/* 
  =========================================
  KOMPONEN SUB: SCROLL REVEAL
  =========================================
*/
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/* 
  =========================================
  DATA TARGET PENGHUNI
  =========================================
*/
const targetData = [
  {
    id: "01",
    title: "Mahasiswa & Pelajar",
    desc: "Suasana tenang yang kondusif. Dilengkapi meja belajar ergonomis dan Wi-Fi berkecepatan tinggi, mendukung penuh kelancaran tugas kuliah dan persiapan ujian Anda.",
    icon: GraduationCap,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000",
    videoDuration: "01:24",
    animation: "animate-video-pan-1"
  },
  {
    id: "02",
    title: "Profesional & Karyawan",
    desc: "Akses 24 jam dengan Smart Lock dan sistem keamanan tinggi. Memberikan privasi serta ketenangan mutlak setelah seharian lelah bekerja di pusat bisnis.",
    icon: Briefcase,
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1000",
    videoDuration: "02:15",
    animation: "animate-video-pan-2"
  }
];

/* 
  =========================================
  KOMPONEN SUB: KARTU VIDEO INTERAKTIF
  Memiliki fitur Play & Pause menggunakan State
  =========================================
*/
const VideoCard = ({ item, index }: { item: any; index: number }) => {
  // State untuk mengontrol jalannya video (Default: Berjalan / true)
  const [isPlaying, setIsPlaying] = useState(true);
  const Icon = item.icon;

  return (
    <Reveal delay={200 + (index * 100)}>
      <div className="group relative flex w-full flex-col overflow-hidden rounded-[24px] border border-[#E5E3DE] bg-white p-4 shadow-sm transition-shadow duration-500 hover:shadow-lg md:p-6">
        
        {/* Dekorasi macOS Buttons */}
        <div className="mb-4 flex items-center justify-between px-2">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]"></div>
            <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]"></div>
            <div className="h-2.5 w-2.5 rounded-full bg-[#27C93F]"></div>
          </div>
          <div className="flex items-center gap-2 text-[#C69C6D]">
            <Icon className="h-4 w-4" strokeWidth={2} />
            <span className="text-[10px] font-extrabold uppercase tracking-widest opacity-80">
              Kostara
            </span>
          </div>
        </div>

        {/* 
          AREA SIMULASI PEMUTAR VIDEO 
          Klik area ini untuk play/pause
        */}
        <div 
          className="relative h-[250px] w-full cursor-pointer overflow-hidden rounded-[16px] border border-[#E5E3DE]/50 bg-[#1F3D35] sm:h-[350px]"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          
          {/* Media Visual (Gambar Beranimasi Slow-Mo dengan kontrol Pause CSS) */}
          <img 
            src={item.image} 
            alt={item.title} 
            className={`${item.animation} absolute inset-0 h-full w-full object-cover opacity-90`}
            style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
          />
          
          {/* Overlay Gelap */}
          <div className="absolute inset-0 bg-black/20 transition-colors duration-500 hover:bg-black/10"></div>

          {/* UI Video: Indikator REC (Berhenti berkedip saat di-pause) */}
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 backdrop-blur-md">
            <div 
              className="h-2 w-2 animate-pulse rounded-full bg-red-500"
              style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
            ></div>
            <span className="text-[10px] font-bold tracking-widest text-white">REC</span>
          </div>

          {/* UI Video: Icon Mute */}
          <div className="absolute right-4 top-4 rounded-full bg-black/40 p-2 backdrop-blur-md">
            <VolumeX className="h-3 w-3 text-white" />
          </div>

          {/* UI Video: Tombol Play Tengah (Hanya muncul saat PAUSED) */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/50 pl-1 backdrop-blur-md transition-transform duration-300 hover:scale-110">
              <Play className="h-6 w-6 text-white" fill="white" />
            </div>
          </div>

          {/* UI Video: Controller Bawah */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
            <div className="flex items-center gap-3">
              
              {/* Ikon Play/Pause dinamis di ujung kiri */}
              {isPlaying ? (
                <Pause className="h-4 w-4 text-white" fill="white" />
              ) : (
                <Play className="h-4 w-4 text-white" fill="white" />
              )}
              
              {/* Progress Bar Video (Berhenti bergerak saat di-pause) */}
              <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/30">
                <div 
                  className="animate-progress absolute bottom-0 left-0 top-0 bg-[#C69C6D]"
                  style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
                ></div>
              </div>
              
              <span className="text-[10px] font-medium text-white">{item.videoDuration}</span>
            </div>
          </div>

        </div>
        
        {/* AREA TEKS KETERANGAN */}
        <div className="mt-6 flex flex-1 flex-col px-2 md:mt-8">
          <h3 className="mb-3 text-[20px] font-bold tracking-tight text-[#1F3D35] md:text-[24px]">
            {item.title}
          </h3>
          <p className="text-[14px] leading-relaxed text-[#6B716D] md:text-[15px]">
            {item.desc}
          </p>
        </div>

      </div>
    </Reveal>
  );
};


export default function TargetAudience() {
  return (
    <section className="relative overflow-hidden bg-[#F8F7F4] py-24 md:py-32">
      
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#E5E3DE_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>

      <style>{`
        @keyframes video-pan-1 {
          0% { transform: scale(1.05) translate(0, 0); }
          50% { transform: scale(1.2) translate(-2%, 3%); }
          100% { transform: scale(1.05) translate(0, 0); }
        }
        @keyframes video-pan-2 {
          0% { transform: scale(1.05) translate(0, 0); }
          50% { transform: scale(1.2) translate(3%, -2%); }
          100% { transform: scale(1.05) translate(0, 0); }
        }
        .animate-video-pan-1 { animation: video-pan-1 25s ease-in-out infinite; }
        .animate-video-pan-2 { animation: video-pan-2 30s ease-in-out infinite; }

        @keyframes play-progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress { animation: play-progress 15s linear infinite; }
      `}</style>

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6">
        
        <Reveal>
          <div className="mb-12 flex w-full items-center justify-between border-b border-[#E5E3DE] pb-4 md:mb-16">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#C69C6D] md:text-[12px]">
              UNTUK SIAPA KOS INI?
            </span>
            <span className="text-[10px] font-bold tracking-widest text-[#6B716D] opacity-60 md:text-[11px]">
              PROFIL PENGHUNI
            </span>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mb-16 flex flex-col md:mb-20">
            <h2 className="max-w-3xl text-[36px] font-extrabold leading-[1.1] tracking-tight text-[#1F3D35] md:text-[48px] lg:text-[56px]">
              Ruang yang menyesuaikan <br className="hidden sm:block" />
              <span className="text-[#8e9591]">dengan gaya hidup Anda.</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {targetData.map((item, idx) => (
            // Menggunakan komponen terpisah agar masing-masing memiliki tombol pause sendiri
            <VideoCard key={idx} item={item} index={idx} />
          ))}
        </div>

      </div>
    </section>
  );
}