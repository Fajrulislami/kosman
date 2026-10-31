"use client";

import { useState } from "react";
import { Copy, Check, Building2 } from "lucide-react";

interface BankAccount {
  id?: string;
  bankName: string;
  accountNumber: string;
  accountHolder?: string;
  accountName?: string;
  isActive?: boolean;
}

interface BankAccountsCardProps {
  bankAccounts: BankAccount[];
}

export default function BankAccountsCard({ bankAccounts }: BankAccountsCardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (accountNumber: string, id: string) => {
    navigator.clipboard.writeText(accountNumber.replace(/\s/g, ""));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const defaultAccounts: BankAccount[] = [
    { id: "bca", bankName: "BCA", accountNumber: "8271 9028 11", accountHolder: "Pondok Rahmat Management" },
    { id: "mandiri", bankName: "Mandiri", accountNumber: "137 00 2938 123", accountHolder: "Pondok Rahmat Management" },
  ];

  const accountsToRender = bankAccounts.length > 0 ? bankAccounts : defaultAccounts;

  return (
    <div className="bg-white rounded-3xl p-8 border border-[#E5E3DE] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-[#F8F7F4] flex items-center justify-center text-[#1F3D35]">
          <Building2 className="w-5 h-5 text-[#C69C6D]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#202321]">Rekening Pembayaran Resmi</h3>
          <p className="text-xs text-[#6B716D]">Transfer ke salah satu rekening pengelola berikut</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accountsToRender.map((bank, idx) => {
          const accountId = bank.id || `bank-${idx}`;
          const isCopied = copiedId === accountId;

          return (
            <div 
              key={accountId} 
              className="p-5 rounded-2xl bg-[#F8F7F4] border border-[#E5E3DE] relative group hover:border-[#C69C6D] transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B716D]">
                  Bank {bank.bankName}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(bank.accountNumber, accountId)}
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                    isCopied
                      ? "bg-green-100 text-green-800"
                      : "bg-white text-[#1F3D35] hover:bg-[#1F3D35] hover:text-white border border-[#E5E3DE]"
                  }`}
                  title="Salin Nomor Rekening"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-green-700" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-2xl font-black tracking-wider text-[#1F3D35] mb-1 font-mono">
                {bank.accountNumber}
              </p>
              <p className="text-xs text-[#6B716D]">a.n. {bank.accountHolder || bank.accountName || "Pondok Rahmat Management"}</p>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[#6B716D] mt-6 leading-relaxed bg-[#F8F7F4]/60 p-4 rounded-2xl border border-[#E5E3DE]/60">
        💡 <strong>Petunjuk:</strong> Setelah transfer, simpan struk transfer atau tangkapan layar m-Banking Anda, lalu klik tombol <strong>"Upload Bukti Transfer"</strong> di atas. Admin kami akan segera memverifikasi pembayaran Anda.
      </p>
    </div>
  );
}
