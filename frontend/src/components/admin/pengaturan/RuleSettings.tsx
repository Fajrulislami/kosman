"use client";

import { ShieldAlert, Info } from "lucide-react";

interface RuleSettingsProps {
  data: { text: string };
  onChange: (text: string) => void;
}

export default function RuleSettings({ data, onChange }: RuleSettingsProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-black text-[#1F3D35]">Tata Tertib & Kebijakan</h2>
        <p className="mt-1 text-sm font-medium text-[#6B716D]">
          Aturan umum yang harus ditaati oleh seluruh penghuni Kos Pondok Rahmat.
        </p>
      </div>

      <div className="rounded-[2rem] bg-white p-6 sm:p-8 shadow-[0_2px_15px_rgb(0,0,0,0.04)] border border-[#E5E3DE]">
        
        <div className="mb-6 flex items-start space-x-3 rounded-2xl bg-[#F8F7F4] p-4 text-[#1F3D35]">
          <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#C69C6D]" />
          <p className="text-sm font-medium leading-relaxed">
            Gunakan tanda <code className="rounded bg-white px-1.5 py-0.5 font-bold">-</code> di awal baris untuk membuat daftar aturan (bullet points). Penghuni akan melihat aturan ini di aplikasi/portal mereka.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-[#1F3D35]">Teks Aturan Kos</label>
          <div className="relative">
            <ShieldAlert className="absolute left-4 top-4 h-5 w-5 text-[#99A09C]" />
            <textarea 
              rows={12}
              value={data.text || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="- Dilarang membawa peliharaan..."
              className="w-full rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-3.5 pl-12 pr-4 text-sm font-medium text-[#1F3D35] outline-none transition-all focus:border-[#C69C6D] focus:bg-white resize-none leading-relaxed"
            ></textarea>
          </div>
        </div>

      </div>
    </div>
  );
}
