/**
 * Membersihkan dan memformat nomor telepon ke standar internasional WhatsApp (hanya digit angka, tanpa +, -, spasi)
 * Standar Indonesia: diawali dengan 62 (contoh: 6281234567890)
 */
export function formatWhatsAppNumber(phone: string): string {
  if (!phone) return "";

  // 1. Hapus seluruh karakter selain angka (menghapus +, -, spasi, kurung, dll)
  let cleaned = phone.replace(/\D/g, "");

  // 2. Jika diawali '0', ganti dengan '62' (misal: 0859... -> 62859...)
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  }
  // 3. Jika pengguna langsung mengetik '8...' tanpa 0 di depan, tambahkan kode negara '62'
  else if (cleaned.startsWith("8")) {
    cleaned = "62" + cleaned;
  }

  return cleaned;
}

/**
 * Menghasilkan link WhatsApp (wa.me) yang valid dan aman dari error 404
 */
export function createWhatsAppLink(phone: string, text: string): string {
  const cleanPhone = formatWhatsAppNumber(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
