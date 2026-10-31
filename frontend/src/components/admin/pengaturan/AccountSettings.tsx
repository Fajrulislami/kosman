"use client";

import { useState, useEffect } from "react";
import { User, Mail, Lock, KeyRound, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function AccountSettings() {
  // Profile state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch initial admin profile
  useEffect(() => {
    const fetchMe = async () => {
      try {
        setLoadingProfile(true);
        const res = await apiFetch<{ authenticated: boolean; user: { name: string; email: string } }>("/api/auth/me");
        if (res && res.user) {
          setName(res.user.name || "");
          setEmail(res.user.email || "");
        }
      } catch (err: any) {
        setProfileMessage({
          type: "error",
          text: err.message || "Gagal memuat profil admin",
        });
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchMe();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);

    if (!name.trim()) {
      setProfileMessage({ type: "error", text: "Nama lengkap tidak boleh kosong" });
      return;
    }

    try {
      setSavingProfile(true);
      const res = await apiFetch<{ success: boolean; message: string; user: any }>("/api/auth/profile", {
        method: "PUT",
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });

      setProfileMessage({
        type: "success",
        text: res.message || "Profil admin berhasil diperbarui",
      });

      // Update local storage user and dispatch live sync event
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("kostara_user_updated", {
            detail: { name: name.trim(), email: email.trim() },
          })
        );
        const stored = localStorage.getItem("kostara_user");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            parsed.name = name.trim();
            parsed.email = email.trim();
            localStorage.setItem("kostara_user", JSON.stringify(parsed));
          } catch {
            // Ignore
          }
        }
      }
    } catch (err: any) {
      setProfileMessage({
        type: "error",
        text: err.message || "Gagal memperbarui profil admin",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (!currentPassword) {
      setPasswordMessage({ type: "error", text: "Kata sandi lama wajib diisi" });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage({ type: "error", text: "Kata sandi baru minimal 8 karakter" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Konfirmasi kata sandi tidak cocok" });
      return;
    }

    try {
      setSavingPassword(true);
      const res = await apiFetch<{ success: boolean; message: string }>("/api/auth/change-password", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      setPasswordMessage({
        type: "success",
        text: res.message || "Kata sandi berhasil diperbarui",
      });

      // Reset password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordMessage({
        type: "error",
        text: err.message || "Gagal mengubah kata sandi",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-black text-[#1F3D35]">Keamanan & Akun Admin</h2>
        <p className="mt-1 text-sm font-medium text-[#6B716D]">
          Ubah informasi identitas admin dan perbarui kata sandi untuk keamanan akses sistem.
        </p>
      </div>

      {/* Bagian 1: Data Profil Admin */}
      <form onSubmit={handleSaveProfile} className="rounded-[2rem] bg-white p-6 sm:p-8 shadow-[0_2px_15px_rgb(0,0,0,0.04)] border border-[#E5E3DE] space-y-6">
        <div className="flex items-center justify-between border-b border-[#E5E3DE] pb-4">
          <div>
            <h3 className="text-base font-bold text-[#1F3D35]">Data Akun Administrator</h3>
            <p className="text-xs text-[#6B716D] mt-0.5">Nama dan alamat email yang digunakan untuk login.</p>
          </div>
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
            Peran: Admin
          </span>
        </div>

        {profileMessage && (
          <div
            className={`flex items-center gap-2.5 rounded-xl p-3.5 text-sm font-semibold ${
              profileMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {profileMessage.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            )}
            <span>{profileMessage.text}</span>
          </div>
        )}

        {loadingProfile ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-[#C69C6D]" />
            <span className="ml-2 text-sm text-[#6B716D]">Memuat data akun...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Nama Lengkap */}
            <div>
              <label className="mb-2 block text-sm font-bold text-[#1F3D35]">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Administrator"
                  className="w-full rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-3 pl-12 pr-4 text-sm font-bold text-[#1F3D35] outline-none transition-all focus:border-[#C69C6D] focus:bg-white"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-bold text-[#1F3D35]">Email Login</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kos.com"
                  className="w-full rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-3 pl-12 pr-4 text-sm font-bold text-[#1F3D35] outline-none transition-all focus:border-[#C69C6D] focus:bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="flex items-center gap-2 rounded-xl bg-[#1F3D35] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#152923] active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                {savingProfile ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>Simpan Perubahan Profil</span>
                )}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Bagian 2: Ganti Kata Sandi */}
      <form onSubmit={handleChangePassword} className="rounded-[2rem] bg-white p-6 sm:p-8 shadow-[0_2px_15px_rgb(0,0,0,0.04)] border border-[#E5E3DE] space-y-6">
        <div className="border-b border-[#E5E3DE] pb-4">
          <h3 className="text-base font-bold text-[#1F3D35]">Ganti Kata Sandi</h3>
          <p className="text-xs text-[#6B716D] mt-0.5">
            Gunakan kombinasi minimal 8 karakter untuk menjaga keamanan akses akun.
          </p>
        </div>

        {passwordMessage && (
          <div
            className={`flex items-center gap-2.5 rounded-xl p-3.5 text-sm font-semibold ${
              passwordMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {passwordMessage.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            )}
            <span>{passwordMessage.text}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Password Lama */}
          <div>
            <label className="mb-2 block text-sm font-bold text-[#1F3D35]">Kata Sandi Saat Ini</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
              <input
                type={showCurrent ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan kata sandi lama Anda"
                className="w-full rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-3 pl-12 pr-12 text-sm font-bold text-[#1F3D35] outline-none transition-all focus:border-[#C69C6D] focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#99A09C] hover:text-[#1F3D35]"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Password Baru & Konfirmasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-[#1F3D35]">Kata Sandi Baru</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
                <input
                  type={showNew ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-3 pl-12 pr-12 text-sm font-bold text-[#1F3D35] outline-none transition-all focus:border-[#C69C6D] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#99A09C] hover:text-[#1F3D35]"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#1F3D35]">Ulangi Kata Sandi Baru</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#99A09C]" />
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="w-full rounded-2xl border-2 border-[#E5E3DE] bg-[#F8F7F4] py-3 pl-12 pr-12 text-sm font-bold text-[#1F3D35] outline-none transition-all focus:border-[#C69C6D] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#99A09C] hover:text-[#1F3D35]"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingPassword}
              className="flex items-center gap-2 rounded-xl bg-[#C69C6D] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#b08759] active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              {savingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <span>Perbarui Kata Sandi</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
