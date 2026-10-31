"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { X, UploadCloud, Image as ImageIcon, Trash2, Loader2, AlertTriangle, CheckCircle2, Link as LinkIcon } from "lucide-react";
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
    { bankName: "BCA", accountNumber: "8271 9028 11", accountHolder: "Kostara Property Management" },
    { bankName: "Mandiri", accountNumber: "137 00 2938 123", accountHolder: "Kostara Property Management" },
  ];

  const accountsToRender = bankAccounts.length > 0 ? bankAccounts : defaultAccounts;

  const [paymentMethod, setPaymentMethod] = useState<"MANUAL_TRANSFER" | "QRIS">("MANUAL_TRANSFER");
  const [selectedChannel, setSelectedChannel] = useState<string>("bank-0");
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
      setModalError(useUrlMode ? "Mohon masukkan tautan gambar bukti transfer" : "Silakan pilih foto bukti transfer dari perangkat Anda");
      return;
    }

    try {
      setSubmittingPayment(true);
      setModalError(null);

      await apiFetch(`/api/portal/invoices/${selectedInvoice.id}/pay`, {
        method: "POST",
        body: JSON.stringify({
          proofImageUrl: finalProof,
          method: paymentMethod,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1F3D35]/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all border border-[#E5E3DE]">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-[#E5E3DE] p-6 bg-white">
          <div>
            <h3 className="text-xl font-bold text-[#1F3D35]">Konfirmasi Pembayaran</h3>
            <p className="text-xs text-[#6B716D] mt-0.5">
              {selectedInvoice.invoiceNumber} • Rp {selectedInvoice.amount.toLocaleString("id-ID")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#99A09C] hover:bg-[#F8F7F4] hover:text-[#1F3D35] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            
            {modalError && (
              <div className="flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700">
                <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
                <span>{modalError}</span>
              </div>
            )}

            {/* Peringatan jika ini pengunggahan ulang setelah ditolak */}
            {selectedInvoice.payment?.status === "REJECTED" && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <span className="font-bold">Pengunggahan Ulang:</span> Foto yang Anda kirim akan menggantikan bukti pembayaran yang sebelumnya ditolak oleh pengelola.
                </div>
              </div>
            )}

            {/* Pilih Metode Pembayaran */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B716D] mb-2">
                Metode Pembayaran Tujuan
              </label>
              <select
                value={selectedChannel}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedChannel(val);
                  if (val === "QRIS") {
                    setPaymentMethod("QRIS");
                  } else {
                    setPaymentMethod("MANUAL_TRANSFER");
                  }
                }}
                className="w-full rounded-2xl border border-[#E5E3DE] bg-[#F8F7F4] p-3.5 text-sm font-semibold text-[#1F3D35] outline-none focus:border-[#1F3D35] focus:bg-white transition-all"
              >
                {accountsToRender.map((acc, idx) => (
                  <option key={acc.id || idx} value={`bank-${idx}`}>
                    Transfer Bank {acc.bankName} ({acc.accountNumber} a.n. {acc.accountHolder || acc.accountName || "Pondok Rahmat Management"})
                  </option>
                ))}
                <option value="QRIS">QRIS / E-Wallet (GoPay, OVO, DANA, ShopeePay)</option>
              </select>
            </div>

            {/* Bagian Upload Bukti Transfer */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B716D]">
                  Bukti Transfer / Struk <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setUseUrlMode(!useUrlMode);
                    setModalError(null);
                  }}
                  className="text-xs font-semibold text-[#C69C6D] hover:text-[#1F3D35] transition-colors"
                >
                  {useUrlMode ? "Upload dari Galeri / Device" : "Gunakan Tautan / URL"}
                </button>
              </div>

              {useUrlMode ? (
                /* Mode URL Alternatif */
                <div>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99A09C]">
                      <LinkIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://i.imgur.com/... atau tautan gambar bukti transfer"
                      className="w-full rounded-2xl border border-[#E5E3DE] bg-[#F8F7F4] pl-10 pr-4 py-3 text-sm font-medium text-[#1F3D35] outline-none focus:border-[#1F3D35] focus:bg-white transition-all placeholder:text-[#99A09C]"
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-[#99A09C]">
                    Masukkan tautan gambar struk pembayaran yang dapat diakses secara publik.
                  </p>
                </div>
              ) : (
                /* Mode Upload File dari Device */
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
                        <div className="py-6">
                          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#1F3D35] mb-2" />
                          <p className="text-xs font-bold text-[#1F3D35]">Memproses & Mengompres Gambar...</p>
                        </div>
                      ) : (
                        <div className="py-3">
                          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-[#E5E3DE] flex items-center justify-center text-[#1F3D35] mx-auto mb-3">
                            <UploadCloud className="w-6 h-6 text-[#C69C6D]" />
                          </div>
                          <p className="text-sm font-bold text-[#202321]">
                            Pilih foto dari Galeri / Komputer
                          </p>
                          <p className="text-xs text-[#6B716D] mt-1">
                            atau seret dan lepas gambar ke sini
                          </p>
                          <span className="inline-block mt-3 text-[10px] font-semibold text-[#99A09C] bg-white px-2.5 py-1 rounded-full border border-[#E5E3DE]">
                            JPG, PNG, WEBP (Maks 10MB)
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Preview Gambar yang Dipilih */
                    <div className="relative rounded-2xl border border-[#E5E3DE] bg-[#F8F7F4] p-3 overflow-hidden">
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-[#E5E3DE] shrink-0">
                          <img
                            src={proofImage}
                            alt="Bukti Transfer Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 text-green-700">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <p className="text-xs font-bold truncate">Foto Siap Dikirim</p>
                          </div>
                          <p className="text-xs font-medium text-[#202321] truncate mt-0.5">{fileName || "struk-transfer.jpg"}</p>
                          <p className="text-[10px] text-[#99A09C] mt-0.5">{fileSize}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 text-xs font-bold text-[#1F3D35] hover:bg-white rounded-lg transition-colors"
                            title="Ganti Foto"
                          >
                            Ganti
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

            {/* Info Nominal */}
            <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              Pastikan nominal transfer tepat <strong className="font-bold text-[#1F3D35]">Rp {selectedInvoice.amount.toLocaleString("id-ID")}</strong> agar verifikasi pembayaran dapat diproses secara otomatis oleh tim pengelola.
            </div>

          </div>

          {/* Footer Aksi */}
          <div className="flex items-center justify-end gap-3 border-t border-[#E5E3DE] bg-[#F8F7F4] p-5">
            <button
              type="button"
              onClick={onClose}
              disabled={submittingPayment}
              className="rounded-xl border border-[#E5E3DE] bg-white px-5 py-2.5 text-sm font-semibold text-[#6B716D] hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submittingPayment || isCompressing}
              className="flex items-center gap-2 rounded-xl bg-[#1F3D35] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#152923] disabled:opacity-50 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {submittingPayment && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{submittingPayment ? "Mengirim..." : "Kirim Bukti Pembayaran"}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
