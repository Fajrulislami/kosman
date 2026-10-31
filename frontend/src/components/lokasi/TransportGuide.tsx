"use client";

import React, { useState, useEffect, useRef } from "react";
import { CarFront, TrainFront, CheckCircle2 } from "lucide-react";

export default function TransportGuide() {
  const [activeTab, setActiveTab] = useState<"private" | "public">("private");
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full bg-transparent py-20 md:py-28 border-t border-[#E5E3DE]" ref={ref}>
      <div className={`mx-auto w-full max-w-[1000px] px-6 transition-all duration-1000 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}`}>
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-[#1F3D35] md:text-[40px] leading-[1.2]">
            Cara Menuju Pondok Rahmat
          </h2>
          <p className="mt-4 text-lg text-[#6B716D]">
            Panduan rute termudah menuju lokasi kami, apa pun moda transportasi Anda.
          </p>
        </div>

        {/* Custom Tabs */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-xl bg-[#F8F7F4] p-1.5 border border-[#E5E3DE]">
            <button
              onClick={() => setActiveTab("private")}
              className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                activeTab === "private"
                  ? "bg-white text-[#1F3D35] shadow-sm"
                  : "text-[#6B716D] hover:text-[#1F3D35]"
              }`}
            >
              <CarFront className="h-5 w-5" />
              Kendaraan Pribadi
            </button>
            <button
              onClick={() => setActiveTab("public")}
              className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                activeTab === "public"
                  ? "bg-white text-[#1F3D35] shadow-sm"
                  : "text-[#6B716D] hover:text-[#1F3D35]"
              }`}
            >
              <TrainFront className="h-5 w-5" />
              Transportasi Umum
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="overflow-hidden rounded-2xl border border-[#E5E3DE] bg-white shadow-lg">
          <div className="p-8 md:p-12">
            {activeTab === "private" ? (
              <div className="animate-fade-in-up">
                <h3 className="mb-6 text-2xl font-bold text-[#202321]">
                  Panduan Berkendara (Mobil / Motor)
                </h3>
                <ul key={activeTab} className="space-y-8 relative z-0">
                  <style>{`
                    @keyframes drawLine {
                      0% { height: 0; }
                      100% { height: 100%; }
                    }
                    .animate-draw-line {
                      animation: drawLine 1.5s ease-out forwards;
                      animation-delay: 0.3s;
                    }
                  `}</style>
                  
                  {/* Decorative drawing line */}
                  <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-[#E5E3DE] rounded-full overflow-hidden -z-10">
                    <div className="absolute top-0 left-0 w-full bg-[#C69C6D] animate-draw-line" style={{ height: "0%" }}></div>
                  </div>

                  <li className="flex gap-4 relative">
                    <div className="z-10 bg-white rounded-full h-fit shadow-sm">
                      <CheckCircle2 className="h-6 w-6 shrink-0 text-[#C69C6D] bg-white rounded-full" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1F3D35] text-lg">Dari Arah Kota Makassar (Pettarani / Alauddin)</p>
                      <p className="mt-1 text-[#6B716D] leading-relaxed">
                        Arahkan kendaraan ke Jl. Sultan Alauddin, lalu masuk ke Jl. H.M. Yasin Limpo (Poros Samata). Lurus terus melewati Bundaran Samata dan Kampus II UIN Alauddin. Gedung Pondok Rahmat berada di kawasan Romangpolong.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4 relative">
                    <div className="z-10 bg-white rounded-full h-fit shadow-sm">
                      <CheckCircle2 className="h-6 w-6 shrink-0 text-[#C69C6D] bg-white rounded-full" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1F3D35] text-lg">Dari Arah Sungguminasa / Poros Malino</p>
                      <p className="mt-1 text-[#6B716D] leading-relaxed">
                        Ambil rute via Jl. Poros Malino menuju Samata. Belok di pertigaan menuju Romangpolong. Akses jalan sudah beraspal halus dan nyaman dilalui mobil maupun motor.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4 relative">
                    <div className="z-10 bg-white rounded-full h-fit shadow-sm">
                      <CheckCircle2 className="h-6 w-6 shrink-0 text-[#C69C6D] bg-white rounded-full" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1F3D35] text-lg">Fasilitas Parkir Luas</p>
                      <p className="mt-1 text-[#6B716D] leading-relaxed">
                        Area parkir aman dan terlindung di dalam pagar untuk motor dan mobil penghuni maupun calon penyewa yang datang berkunjung untuk survey kamar langsung.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="animate-fade-in-up">
                <h3 className="mb-6 text-2xl font-bold text-[#202321]">
                  Panduan Transportasi Umum & Online
                </h3>
                <ul key={activeTab} className="space-y-8 relative z-0">
                  <style>{`
                    @keyframes drawLine {
                      0% { height: 0; }
                    }
                    .animate-draw-line {
                      animation: drawLine 1.5s ease-out forwards;
                      animation-delay: 0.3s;
                    }
                  `}</style>
                  
                  {/* Decorative drawing line */}
                  <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-[#E5E3DE] rounded-full overflow-hidden -z-10">
                    <div className="absolute top-0 left-0 w-full bg-[#C69C6D] animate-draw-line" style={{ height: "0%" }}></div>
                  </div>

                  <li className="flex gap-4 relative">
                    <div className="z-10 bg-white rounded-full h-fit shadow-sm">
                      <CheckCircle2 className="h-6 w-6 shrink-0 text-[#C69C6D] bg-white rounded-full" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1F3D35] text-lg">Menggunakan Ojek Online (Gojek / Grab / Maxim)</p>
                      <p className="mt-1 text-[#6B716D] leading-relaxed">
                        Cukup ketik tujuan <strong>"Pondok Rahmat Samata"</strong> di aplikasi Anda. Titik penjemputan dan pengantaran sangat akurat tepat di depan pagar gerbang kos.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4 relative">
                    <div className="z-10 bg-white rounded-full h-fit shadow-sm">
                      <CheckCircle2 className="h-6 w-6 shrink-0 text-[#C69C6D] bg-white rounded-full" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1F3D35] text-lg">Dari Bandara Sultan Hasanuddin</p>
                      <p className="mt-1 text-[#6B716D] leading-relaxed">
                        Gunakan taksi bandara atau ojek online via Jalan Tol Reformasi ke arah Pettarani, kemudian lanjut ke Poros Samata Gowa (waktu tempuh sekitar 35 - 45 menit).
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4 relative">
                    <div className="z-10 bg-white rounded-full h-fit shadow-sm">
                      <CheckCircle2 className="h-6 w-6 shrink-0 text-[#C69C6D] bg-white rounded-full" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1F3D35] text-lg">Menggunakan Angkutan Kota / Teman Bus</p>
                      <p className="mt-1 text-[#6B716D] leading-relaxed">
                        Naik bus/pete-pete trayek Makassar - Gowa dan turun di Terminal Mallengkeri atau Bundaran Samata, dilanjutkan 3 menit dengan ojek online ke lokasi.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
