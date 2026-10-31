"use client";

import { X, ShieldAlert, CheckCircle2, FileText } from "lucide-react";

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  rulesText?: string;
  propertyName?: string;
}

export default function RulesModal({
  isOpen,
  onClose,
  rulesText = "",
  propertyName = "Pondok Rahmat",
}: RulesModalProps) {
  if (!isOpen) return null;

  // Split lines and clean up bullets
  const lines = rulesText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const defaultRules = [
    "Menjaga ketertiban, keamanan, dan kebersihan lingkungan kos bersama.",
    "Menghormati jam istirahat / jam tenang bersama (pukul 22.00 - 06.00).",
    "Dilarang merokok di dalam kamar atau area bebas rokok.",
    "Matikan lampu, AC, dan kran air saat meninggalkan kamar demi keselamatan bersama.",
    "Tamu lawan jenis dilarang menginap di dalam kamar demi kenyamanan seluruh penghuni.",
    "Pembayaran sewa dilakukan tepat waktu sesuai tanggal jatuh tempo tagihan.",
    "Segera laporkan kerusakan fasilitas kos melalui fitur Lapor Kendala di portal.",
  ];

  const rulesToDisplay = lines.length > 0 ? lines : defaultRules;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div 
        className="relative w-full max-w-lg rounded-[2rem] bg-white p-6 sm:p-8 shadow-2xl border border-[#E5E3DE] animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E5E3DE] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F7F4] text-[#C69C6D] border border-[#E5E3DE]">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1F3D35]">Tata Tertib & Kebijakan</h3>
              <p className="text-xs text-[#6B716D] mt-0.5">
                Aturan resmi penghuni {propertyName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[#99A09C] hover:bg-[#F8F7F4] hover:text-[#1F3D35] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="overflow-y-auto space-y-3 pr-1 py-1">
          {rulesToDisplay.map((rule, idx) => {
            // Strip leading "-", "*", or number
            const cleanText = rule.replace(/^[-*•]\s*/, "").replace(/^\d+[\.\)]\s*/, "");

            return (
              <div 
                key={idx}
                className="flex items-start gap-3 rounded-2xl bg-[#F8F7F4] p-3.5 border border-[#E5E3DE]/60 text-xs sm:text-sm text-[#1F3D35] leading-relaxed"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1F3D35] text-[10px] font-bold text-white mt-0.5">
                  {idx + 1}
                </div>
                <span className="font-medium">{cleanText}</span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#E5E3DE] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#1F3D35] px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#162E28] transition-all shadow-md"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
