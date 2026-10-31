"use client";

import { useState } from "react";
import { X, Lock, KeyRound, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentPassword) {
      setError("Kata sandi lama wajib diisi");
      return;
    }

    if (newPassword.length < 8) {
      setError("Kata sandi baru minimal 8 karakter");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok dengan kata sandi baru");
      return;
    }

    if (currentPassword === newPassword) {
      setError("Kata sandi baru harus berbeda dengan kata sandi lama");
      return;
    }

    try {
      setSubmitting(true);
      await apiFetch("/api/auth/change-password?role=tenant", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      setSuccess(true);

      // Sesuai Opsi B: Logout otomatis dan arahkan ke login setelah 1.5 detik
      setTimeout(async () => {
        try {
          await apiFetch("/api/auth/logout?role=tenant", { method: "POST" });
        } catch {
          // Ignore
        }
        localStorage.removeItem("kostara_tenant_token");
        localStorage.removeItem("kostara_token");
        window.location.href = "/login?notice=password_updated";
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memperbarui kata sandi. Silakan periksa kembali.");
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting || success) return;
    setError(null);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#1F3D35]/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-md transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all border border-[#E5E3DE] animate-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-[#E5E3DE] p-6 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F8F7F4] flex items-center justify-center text-[#1F3D35]">
              <KeyRound className="w-5 h-5 text-[#C69C6D]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1F3D35]">Ubah Kata Sandi</h3>
              <p className="text-xs text-[#6B716D] mt-0.5">Amankan akun penghuni Anda</p>
            </div>
          </div>
          
          {!success && (
            <button
              onClick={handleClose}
              disabled={submitting}
              className="rounded-full p-2 text-[#99A09C] hover:bg-[#F8F7F4] hover:text-[#1F3D35] transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Form Body */}
        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="w-8 h-8 animate-in zoom-in-50 duration-300" />
            </div>
            <h4 className="text-lg font-bold text-[#202321]">Kata Sandi Berhasil Diubah!</h4>
            <p className="text-xs text-[#6B716D] leading-relaxed max-w-xs mx-auto">
              Demi keamanan akun, Anda akan dialihkan ke halaman login untuk masuk dengan kata sandi baru.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#1F3D35] pt-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#C69C6D]" />
              <span>Mengalihkan ke halaman login...</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              
              {error && (
                <div className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700 animate-in fade-in duration-200">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              {/* Kata Sandi Lama */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B716D] mb-1.5">
                  Kata Sandi Lama
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#99A09C]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Masukkan kata sandi lama Anda"
                    required
                    className="w-full bg-[#F8F7F4] border border-[#E5E3DE] rounded-2xl pl-10 pr-10 py-3 text-xs font-medium text-[#202321] focus:outline-none focus:border-[#1F3D35] focus:bg-white transition-all placeholder:text-[#99A09C]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#99A09C] hover:text-[#1F3D35] transition-colors cursor-pointer"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Kata Sandi Baru */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B716D] mb-1.5">
                  Kata Sandi Baru (Min. 8 Karakter)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#99A09C]">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 8 karakter unik"
                    required
                    minLength={8}
                    className="w-full bg-[#F8F7F4] border border-[#E5E3DE] rounded-2xl pl-10 pr-10 py-3 text-xs font-medium text-[#202321] focus:outline-none focus:border-[#1F3D35] focus:bg-white transition-all placeholder:text-[#99A09C]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#99A09C] hover:text-[#1F3D35] transition-colors cursor-pointer"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Kata Sandi Baru */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B716D] mb-1.5">
                  Konfirmasi Kata Sandi Baru
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#99A09C]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang kata sandi baru"
                    required
                    minLength={8}
                    className={`w-full bg-[#F8F7F4] border rounded-2xl pl-10 pr-10 py-3 text-xs font-medium text-[#202321] focus:outline-none focus:bg-white transition-all placeholder:text-[#99A09C] ${
                      confirmPassword && confirmPassword !== newPassword
                        ? "border-red-300 focus:border-red-500"
                        : "border-[#E5E3DE] focus:border-[#1F3D35]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#99A09C] hover:text-[#1F3D35] transition-colors cursor-pointer"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="text-[11px] text-red-500 mt-1">Konfirmasi kata sandi belum cocok</p>
                )}
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="p-5 border-t border-[#E5E3DE] bg-[#F8F7F4] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="rounded-xl border border-[#E5E3DE] bg-white px-4 py-2.5 text-xs font-bold text-[#6B716D] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting || (!!confirmPassword && confirmPassword !== newPassword)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F3D35] hover:bg-[#152923] text-white px-5 py-2.5 text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{submitting ? "Memperbarui..." : "Simpan Kata Sandi"}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
