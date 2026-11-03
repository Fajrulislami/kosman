"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import {
  X,
  UploadCloud,
  Trash2,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Link as LinkIcon,
  Copy,
  Check,
  Building2,
  QrCode,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { PortalInvoiceItem } from "@/types/portal";

interface BankAccountItem {
  id?: string;
  bankName: string;
  accountNumber: string;
  accountHolder?: string;
  accountName?: string;
  isActive?: boolean;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedInvoice: PortalInvoiceItem | null;
  onSuccess: () => Promise<void>;
  bankAccounts?: BankAccountItem[];
}

// Kompres gambar otomatis agar hemat bandwidth & penyimpanan tanpa mengurangi keterbacaan struk
function compressImage(file: File, maxDimension = 1200, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

export default function PaymentModal({
  isOpen,
  onClose,
  selectedInvoice,
  onSuccess,
  bankAccounts = [],
}: PaymentModalProps) {
  const defaultAccounts: BankAccountItem[] = [
    { id: "bca", bankName: "BCA", accountNumber: "8271 9028 11", accountHolder: "Pondok Rahmat Management" },
    { id: "mandiri", bankName: "Mandiri", accountNumber: "137 00 2938 123", accountHolder: "Pondok Rahmat Management" },
  ];

  const accountsToRender = bankAccounts.length > 0 ? bankAccounts : defaultAccounts;

  // State Pilihan Metode (Tab: Bank Index atau 'QRIS')
  const [selectedMethodType, setSelectedMethodType] = useState<"BANK" | "QRIS">("BANK");
  const [selectedBankIndex, setSelectedBankIndex] = useState<number>(0);

  // State Copy feedback
  const [copiedField, setCopiedField] = useState<"account" | "amount" | null>(null);

  // State Gambar / Struk
  const [proofImage, setProofImage] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [useUrlMode, setUseUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !selectedInvoice) return null;

  const currentBank = accountsToRender[selectedBankIndex] || accountsToRender[0];

  const handleCopy = (text: string, field: "account" | "amount") => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2500);
    } catch {
      // fallback
    }
  };

  const handleProcessFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setModalError("File yang dipilih harus berupa gambar (JPG, PNG, atau WEBP)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setModalError("Ukuran file gambar maksimal 10MB");
      return;
    }

    try {
      setIsCompressing(true);
      setModalError(null);
      setFileName(file.name);
      setFileSize((file.size / 1024).toFixed(1) + " KB");

      const compressedDataUrl = await compressImage(file);
      setProofImage(compressedDataUrl);
    } catch {
      setModalError("Gagal memproses gambar. Silakan coba file lain.");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleRemoveImage = () => {
    setProofImage("");
    setFileName("");
    setFileSize("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalProof = useUrlMode ? urlInput.trim() : proofImage;

    if (!finalProof) {
      setModalError(
        useUrlMode
          ? "Mohon masukkan tautan gambar bukti transfer"
          : "Silakan pilih foto bukti transfer dari perangkat Anda"
      );
      return;
    }

    try {
      setSubmittingPayment(true);
      setModalError(null);

      await apiFetch(`/api/portal/invoices/${selectedInvoice.id}/pay`, {
        method: "POST",
        body: JSON.stringify({
          proofImageUrl: finalProof,
          method: selectedMethodType === "QRIS" ? "QRIS" : "MANUAL_TRANSFER",
        }),
      });

      await onSuccess();
      onClose();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Gagal mengirim bukti pembayaran");
    } finally {
      setSubmittingPayment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1F3D35]/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all border border-[#E5E3DE] flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-[#E5E3DE] p-5 sm:p-6 bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-[#1F3D35]/10 px-2 py-0.5 text-[10px] font-extrabold text-[#1F3D35] uppercase tracking-wider">
                Pembayaran Sewa
              </span>
              <span className="text-xs font-semibold text-[#6B716D]">
                Kamar {selectedInvoice.room}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#1F3D35] mt-1">
              Konfirmasi & Kirim Bukti Transfer
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#99A09C] hover:bg-[#F8F7F4] hover:text-[#1F3D35] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-5 sm:p-6 space-y-6">
            {modalError && (
              <div className="flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700 animate-in fade-in">
                <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
                <span>{modalError}</span>
              </div>
            )}

            {/* Peringatan jika ini pengunggahan ulang setelah bukti sebelumnya ditolak */}
            {selectedInvoice.payment?.status === "REJECTED" && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-amber-300 bg-amber-50 p-3.5 text-xs text-amber-900">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <span className="font-bold">Pengunggahan Ulang:</span> Bukti transfer sebelumnya ditolak oleh pengelola. Silakan pastikan transfer sudah berhasil dan unggah struk yang jelas.
                </div>
              </div>
            )}

            {/* KARTU NOMINAL TAGIHAN DENGAN TOMBOL SALIN */}
            <div className="rounded-2xl border border-[#C69C6D]/30 bg-gradient-to-br from-[#F8F7F4] to-white p-4 sm:p-5 shadow-xs relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B716D]">
                    Nominal Transfer Tepat
                  </span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#1F3D35] mt-0.5 tracking-tight">
                    Rp {selectedInvoice.amount.toLocaleString("id-ID")}
                  </p>
                  <p className="text-[11px] text-[#99A09C] mt-0.5">
                    Invoice: <strong className="font-semibold text-[#1F3D35]">{selectedInvoice.invoiceNumber}</strong> • {selectedInvoice.month}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(selectedInvoice.amount.toString(), "amount")}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer ${
                    copiedField === "amount"
                      ? "bg-emerald-600 text-white"
                      : "bg-white text-[#1F3D35] border border-[#E5E3DE] hover:bg-[#1F3D35] hover:text-white"
                  }`}
                >
                  {copiedField === "amount" ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Nominal Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Salin Nominal</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* LANGKAH 1: PILIH REKENING / METODE TUJUAN */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1F3D35] flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1F3D35] text-[10px] text-white">
                    1
                  </span>
                  <span>Pilih Rekening / Metode Pembayaran Tujuan</span>
                </label>
              </div>

              {/* Selector Tabs (Kartu Bank & QRIS) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {accountsToRender.map((bank, idx) => {
                  const isSelected = selectedMethodType === "BANK" && selectedBankIndex === idx;
                  return (
                    <button
                      key={bank.id || idx}
                      type="button"
                      onClick={() => {
                        setSelectedMethodType("BANK");
                        setSelectedBankIndex(idx);
                      }}
                      className={`flex flex-col items-start p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#1F3D35] bg-[#1F3D35]/5 ring-2 ring-[#1F3D35]/20 shadow-xs"
                          : "border-[#E5E3DE] bg-[#F8F7F4]/50 hover:bg-[#F8F7F4] hover:border-[#C69C6D]"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-xs font-bold text-[#1F3D35]">
                          Bank {bank.bankName}
                        </span>
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-[#1F3D35]" />
                        )}
                      </div>
                      <span className="text-[10px] text-[#6B716D] truncate max-w-full font-mono">
                        {bank.accountNumber}
                      </span>
                    </button>
                  );
                })}

                {/* Tab QRIS */}
                <button
                  type="button"
                  onClick={() => setSelectedMethodType("QRIS")}
                  className={`flex flex-col items-start p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedMethodType === "QRIS"
                      ? "border-[#1F3D35] bg-[#1F3D35]/5 ring-2 ring-[#1F3D35]/20 shadow-xs"
                      : "border-[#E5E3DE] bg-[#F8F7F4]/50 hover:bg-[#F8F7F4] hover:border-[#C69C6D]"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xs font-bold text-[#1F3D35] flex items-center gap-1">
                      <QrCode className="h-3.5 w-3.5 text-[#C69C6D]" />
                      <span>QRIS</span>
                    </span>
                    {selectedMethodType === "QRIS" && (
                      <div className="w-2 h-2 rounded-full bg-[#1F3D35]" />
                    )}
                  </div>
                  <span className="text-[10px] text-[#6B716D] truncate max-w-full">
                    E-Wallet & m-Banking
                  </span>
                </button>
              </div>

              {/* Detail Kontainer Metode Terpilih */}
              {selectedMethodType === "BANK" ? (
                /* Detail Rekening Bank Terpilih */
                <div className="rounded-2xl border border-[#E5E3DE] bg-[#F8F7F4] p-4.5 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B716D]">
                        Nomor Rekening Bank {currentBank.bankName}
                      </span>
                      <p className="text-xl sm:text-2xl font-black text-[#1F3D35] font-mono tracking-wider mt-0.5">
                        {currentBank.accountNumber}
                      </p>
                      <p className="text-xs text-[#6B716D] mt-1">
                        Atas Nama: <strong className="text-[#1F3D35]">{currentBank.accountHolder || currentBank.accountName || "Pondok Rahmat Management"}</strong>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(currentBank.accountNumber.replace(/\s/g, ""), "account")}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0 ${
                        copiedField === "account"
                          ? "bg-emerald-600 text-white"
                          : "bg-white text-[#1F3D35] border border-[#E5E3DE] hover:bg-[#1F3D35] hover:text-white"
                      }`}
                    >
                      {copiedField === "account" ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>No. Rekening Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Salin No. Rek</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Detail QRIS Terpilih */
                <div className="rounded-2xl border border-[#E5E3DE] bg-[#F8F7F4] p-4.5 text-center transition-all">
                  <div className="mx-auto flex h-40 w-40 flex-col items-center justify-center rounded-2xl bg-white p-3 border border-[#E5E3DE] shadow-xs">
                    {/* Visual QR Code Placeholder Rapi */}
                    <QrCode className="h-28 w-28 text-[#1F3D35]" />
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#1F3D35] mt-1">
                      QRIS NASIONAL
                    </span>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs font-bold text-[#1F3D35]">
                      Pondok Rahmat Property Management
                    </p>
                    <p className="text-[11px] text-[#6B716D] mt-0.5 max-w-sm mx-auto leading-relaxed">
                      Scan menggunakan aplikasi perbankan (BCA, Mandiri, BRI, BNI) atau dompet digital (GoPay, OVO, DANA, ShopeePay).
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* LANGKAH 2: UNGGAH BUKTI TRANSFER */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1F3D35] flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1F3D35] text-[10px] text-white">
                    2
                  </span>
                  <span>Unggah Struk / Bukti Transfer <span className="text-red-500">*</span></span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setUseUrlMode(!useUrlMode);
                    setModalError(null);
                  }}
                  className="text-xs font-semibold text-[#C69C6D] hover:text-[#1F3D35] transition-colors cursor-pointer"
                >
                  {useUrlMode ? "Upload dari Perangkat" : "Gunakan Tautan / URL"}
                </button>
              </div>

              {useUrlMode ? (
                /* Mode URL / Link */
                <div>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99A09C]">
                      <LinkIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://... tautan gambar struk pembayaran Anda"
                      className="w-full rounded-2xl border border-[#E5E3DE] bg-[#F8F7F4] pl-10 pr-4 py-3 text-sm font-medium text-[#1F3D35] outline-none focus:border-[#1F3D35] focus:bg-white transition-all placeholder:text-[#99A09C]"
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-[#99A09C]">
                    Masukkan tautan gambar struk pembayaran yang dapat diakses secara publik.
                  </p>
                </div>
              ) : (
                /* Mode Upload File dari Galeri / Kamera */
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                  />

                  {!proofImage ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all ${
                        isDragging
                          ? "border-[#1F3D35] bg-[#1F3D35]/5 scale-[0.99]"
                          : "border-[#E5E3DE] hover:border-[#C69C6D] bg-[#F8F7F4]/60 hover:bg-[#F8F7F4]"
                      }`}
                    >
                      {isCompressing ? (
                        <div className="py-4">
                          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#1F3D35] mb-2" />
                          <p className="text-xs font-bold text-[#1F3D35]">
                            Mengoptimalkan Gambar Struk...
                          </p>
                        </div>
                      ) : (
                        <div className="py-2">
                          <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-[#E5E3DE] flex items-center justify-center text-[#1F3D35] mx-auto mb-2.5">
                            <UploadCloud className="w-6 h-6 text-[#C69C6D]" />
                          </div>
                          <p className="text-sm font-bold text-[#202321]">
                            Pilih foto bukti dari Galeri / Kamera
                          </p>
                          <p className="text-xs text-[#6B716D] mt-0.5">
                            atau seret & letakkan file gambar di area ini
                          </p>
                          <span className="inline-block mt-2.5 text-[10px] font-semibold text-[#99A09C] bg-white px-2.5 py-0.5 rounded-full border border-[#E5E3DE]">
                            JPG, PNG, WEBP (Otomatis Dikompres)
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Preview Gambar Siap Kirim */
                    <div className="relative rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3 overflow-hidden">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white border border-[#E5E3DE] shrink-0">
                          <img
                            src={proofImage}
                            alt="Bukti Transfer Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 text-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                            <p className="text-xs font-bold truncate">Struk Berhasil Dimuat</p>
                          </div>
                          <p className="text-xs font-medium text-[#202321] truncate mt-0.5">
                            {fileName || "bukti-transfer.jpg"}
                          </p>
                          <p className="text-[10px] text-[#6B716D] mt-0.5">{fileSize}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-1.5 text-xs font-bold text-[#1F3D35] hover:bg-white rounded-lg transition-colors cursor-pointer"
                            title="Ganti Foto"
                          >
                            Ganti
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="p-1.5 text-red-600 hover:bg-red-100/50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Foto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer Aksi */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E5E3DE] bg-[#F8F7F4] p-5 shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-[#6B716D]">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Verifikasi resmi oleh pengelola Pondok Rahmat</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={submittingPayment}
                className="flex-1 sm:flex-initial rounded-xl border border-[#E5E3DE] bg-white px-5 py-2.5 text-xs font-bold text-[#6B716D] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submittingPayment || isCompressing}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl bg-[#1F3D35] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#152923] disabled:opacity-50 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                {submittingPayment && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>{submittingPayment ? "Mengirim Bukti..." : "Kirim Bukti Pembayaran"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
