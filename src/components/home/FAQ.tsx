"use client";

import { useState } from "react";
import { Plus, Minus, Square } from "lucide-react";

/* 
  =========================================
  DATA PERTANYAAN FAQ
  =========================================
*/
const faqs = [
  {
    label: "SISTEM-SEWA.FRAME",
    question: "Bagaimana sistem pembayaran sewa di Pondok Rahmat?",
    answer: "Pembayaran dapat dilakukan secara bulanan, per 6 bulan, atau tahunan di awal masa sewa. Kami menerima transfer antar bank dan e-wallet. Tidak ada biaya tersembunyi; harga sudah mencakup fasilitas standar."
  },
  {
    label: "FASILITAS-KAMAR.FRAME",
    question: "Apa saja fasilitas yang saya dapatkan di dalam kamar?",
    answer: "Setiap kamar dilengkapi dengan kasur springbed premium, bantal, seprai, AC, lemari pakaian luas, meja kerja, kursi ergonomis, serta kamar mandi dalam dengan pemanas air (water heater) dan kloset duduk."
  },
  {
    label: "BIAYA-TAMBAHAN.FRAME",
    question: "Apakah ada biaya tambahan untuk listrik dan internet?",
    answer: "Tidak. Harga sewa bulanan sudah termasuk biaya listrik (dengan batas pemakaian wajar), air bersih 24 jam, dan akses internet Wi-Fi berkecepatan tinggi yang bebas digunakan."
  },
  {
    label: "ATURAN-TAMU.FRAME",
    question: "Apakah tamu atau teman boleh berkunjung ke kos?",
    answer: "Tentu, tamu dapat berkunjung di area komunal (lobby & lounge). Namun, demi kenyamanan dan keamanan bersama, tamu laki-laki dilarang keras masuk dan bermalam di dalam kamar. Selain itu, teman tidak diperkenankan menginap lebih dari 3 hari, kecuali orang tua kandung penghuni kos."
  },
  {
    label: "PEMELIHARAAN.FRAME",
    question: "Bagaimana jika ada kerusakan fasilitas di dalam kamar?",
    answer: "Anda cukup melaporkannya melalui nomor WhatsApp pengelola kami. Tim teknisi (maintenance) akan segera memperbaiki kerusakan maksimal dalam 1x24 jam tanpa biaya tambahan, kecuali kerusakan akibat kelalaian."
  }
];

/* 
  =========================================
  KOMPONEN ITEM FAQ (Gaya Folder Frame)
  =========================================
*/
const FaqItem = ({ item, index, isOpen, toggleOpen }: { item: any, index: number, isOpen: boolean, toggleOpen: () => void }) => {
  return (
    <div className="flex flex-col">
      {/* TAB FOLDER (BAGIAN ATAS) */}
      <div className="flex">
        <div 
          className={`relative z-10 -mb-[1px] flex w-fit items-center gap-2.5 rounded-t-[10px] border px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-[11px] ${
            isOpen
              ? "border-[#1F3D35] bg-[#1F3D35] text-white"
              : "border-[#E5E3DE] border-b-white bg-white text-[#6B716D]"
          }`}
        >
          <Square className={`h-3 w-3 ${isOpen ? "fill-white/20 text-white" : "text-[#C69C6D]"}`} />
          {item.label}
        </div>
      </div>

      {/* KOTAK KONTEN (PERTANYAAN & JAWABAN) */}
      <div 
        className={`relative z-0 overflow-hidden rounded-b-[20px] rounded-tr-[20px] border bg-white px-5 py-6 transition-all duration-500 sm:px-8 sm:py-7 ${
          isOpen
            ? "border-[#1F3D35] shadow-[0_15px_40px_rgba(31,61,53,0.1)]"
            : "border-[#E5E3DE] shadow-sm hover:border-[#1F3D35]/30 hover:shadow-md"
        }`}
      >
        {/* Baris Pertanyaan */}
        <button 
          onClick={toggleOpen}
          className="flex w-full items-center justify-between gap-4 text-left focus:outline-none"
        >
          <div className="flex items-start gap-4 sm:items-center sm:gap-6">
            <span className="mt-0.5 text-[14px] font-black text-[#C69C6D] sm:mt-0 sm:text-[16px]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="text-[16px] font-bold leading-snug text-[#1F3D35] sm:text-[20px]">
              {item.question}
            </h3>
          </div>
          <div className="flex shrink-0 items-center justify-center">
            {isOpen 
              ? <Minus className="h-6 w-6 text-[#1F3D35]" /> 
              : <Plus className="h-6 w-6 text-[#1F3D35]" />
            }
          </div>
        </button>

        {/* Baris Jawaban */}
        <div 
          className={`grid transition-all duration-500 ease-in-out ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="mt-6 flex flex-col gap-3 border-t border-[#E5E3DE] pt-6 sm:mt-8 sm:flex-row sm:gap-8 sm:pt-8">
              <span className="shrink-0 pt-0.5 text-[10px] font-black tracking-widest text-[#6B716D] sm:w-20 sm:text-[11px]">
                ANSWER
              </span>
              <p className="text-[14px] leading-relaxed text-[#6B716D] sm:text-[16px]">
                {item.answer}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};


export default function FAQ() {
  // PERUBAHAN DI SINI: state diubah menjadi 'null' agar semuanya tertutup saat halaman di-refresh
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative overflow-hidden bg-[#F8F7F4] py-24 md:py-32">
      
      {/* Pola Titik Latar Belakang */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#E5E3DE_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>

      <div className="relative z-20 mx-auto max-w-[900px] px-6">
        
        {/* HEADER SECTION (Tanpa efek scroll reveal) */}
        <div className="mb-16 flex flex-col items-center text-center">
          <span className="mb-4 inline-block text-[13px] font-bold tracking-[0.2em] text-[#C69C6D]">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="mb-6 text-[32px] font-extrabold tracking-tight text-[#1F3D35] md:text-[46px]">
            Ada Pertanyaan?
          </h2>
          <p className="max-w-lg text-[15px] leading-relaxed text-[#6B716D]">
            Temukan jawaban cepat untuk pertanyaan yang paling sering diajukan oleh calon penghuni Pondok Rahmat.
          </p>
        </div>

        {/* DAFTAR ACCORDION FAQ (Tanpa efek scroll reveal) */}
        <div className="flex flex-col gap-6 sm:gap-8">
          {faqs.map((item, index) => (
            <FaqItem 
              key={index}
              item={item} 
              index={index} 
              isOpen={openIndex === index} 
              toggleOpen={() => handleToggle(index)} 
            />
          ))}
        </div>

      </div>
    </section>
  );
}