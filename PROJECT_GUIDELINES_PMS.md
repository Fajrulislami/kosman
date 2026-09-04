# Project Guidelines — Property Management System (PMS) Kos

Dokumen ini menjadi pedoman utama untuk pengembangan fitur **Admin Dashboard & Property Management System (PMS)** dari website kos. Fitur ini merupakan fase lanjutan (backend & operasional) dari Landing Page utama.

Tujuan dokumen:
- Menentukan fitur-fitur wajib yang dibutuhkan untuk mengelola kos.
- Menjaga konsistensi desain UI/UX antara halaman Landing Page publik dan Admin Dashboard (menggunakan estetika "Apple-like UI", bersih, dan modern).
- Memberikan peta jalan arsitektur untuk pengembangan fitur operasional bisnis kos.

---

## 1. Visi & Konsep UI/UX (Admin Dashboard)

Meskipun ini adalah halaman Admin (Back-Office), desain harus tetap berpegang pada prinsip estetika Landing Page: **Modern, Bersih, dan Premium**.

### Estetika "Apple-like UI"
Untuk memberikan kesan premium dan mudah digunakan (tidak terlihat kaku seperti software akuntansi lama), terapkan prinsip UI berikut pada Dashboard:

- **Borders & Corner Radius:** Gunakan radius yang lembut dan konsisten (misal: `rounded-2xl` atau `rounded-3xl` pada panel utama, `rounded-xl` pada card/box).
- **Shadows:** Gunakan bayangan yang sangat lembut dan menyebar luas (*diffused shadows*), bukan bayangan yang keras. Contoh: `box-shadow: 0 10px 40px -10px rgba(0,0,0,0.08)`.
- **Glassmorphism (Secukupnya):** Gunakan efek blur (backdrop-filter) pada navbar atas atau sidebar jika diperlukan untuk memberikan kesan kedalaman layar.
- **Whitespace:** Berikan jarak yang luas antar elemen agar admin tidak merasa "sesak" saat melihat data.
- **Warna Background:** Gunakan warna background off-white yang hangat (seperti `#F5F5F7` khas Apple) sebagai latar belakang utama dashboard, dan putih murni `#FFFFFF` untuk *card box* yang berisi data.
- **Typography:** Tetap gunakan **Plus Jakarta Sans**, dengan bobot *Semibold* (600) untuk judul dan *Regular* (400) dengan warna keabu-abuan (muted) untuk data sekunder.

---

## 2. Arsitektur & Teknologi (Tech Stack)

Untuk mendukung fungsionalitas PMS, tumpukan teknologi (Tech Stack) dari Landing Page (Next.js + Tailwind) akan diperluas dengan:

1. **Database:** PostgreSQL (via Vercel Postgres atau Supabase).
2. **ORM:** Prisma (untuk manajemen skema database yang aman dengan TypeScript).
3. **Authentication:** NextAuth.js (Auth.js) - Login khusus Admin.
4. **State Management:** Zustand (jika diperlukan untuk form yang kompleks).
5. **UI Components:** Shadcn UI (sangat direkomendasikan untuk membangun tabel data, modal, form input, dan dropdown secara cepat dengan tampilan yang sudah bersih).

---

## 3. Daftar Fitur Utama (PMS Features)

Berikut adalah modul-modul yang wajib ada pada sistem PMS ini:

### A. Dashboard Analytics (Ringkasan Bisnis)
- **Metrik Utama:** Total pendapatan bulan ini, jumlah kamar terisi, jumlah kamar kosong.
- **Notifikasi/Alert:** Tagihan yang belum dibayar, kontrak sewa yang akan habis, atau komplain fasilitas baru.

### B. Manajemen Kamar (Room Management)
- **CRUD Kamar:** Menambah kamar baru, mengedit harga, dan memperbarui foto kamar.
- **Status Ketersediaan:** Mengubah status kamar (Tersedia, Terisi, Sedang Diperbaiki).
- **Manajemen Fasilitas:** Centang fasilitas apa saja yang tersedia di setiap kamar.

### C. Manajemen Penyewa (Tenant Management)
- **Data Penyewa:** Nama, foto KTP, kontak darurat, pekerjaan/kampus, tanggal masuk.
- **Alokasi Kamar:** Menempatkan penyewa ke kamar tertentu.
- **Riwayat Sewa:** Menyimpan data penyewa lama yang sudah keluar.

### D. Keuangan & Tagihan (Billing & Payments)
- **Tagihan Otomatis (Invoicing):** Sistem otomatis mencatat tagihan setiap awal bulan berdasarkan harga kamar penyewa.
- **Pencatatan Pembayaran:** Admin bisa mencatat jika penyewa sudah bayar (transfer manual atau cash).
- *(Masa Depan)* **Payment Gateway:** Integrasi dengan Midtrans/Xendit agar penyewa bisa bayar langsung via virtual account dan tagihan otomatis lunas.

### E. Manajemen Pemeliharaan (Maintenance)
- Pencatatan keluhan (misal: AC bocor, lampu mati).
- Status perbaikan (Pending, Sedang Dikerjakan, Selesai).

---

## 4. Struktur Routing (URL) untuk PMS

Gunakan pola URL di bawah `/admin` agar terpisah dengan aman dari halaman Landing Page publik.

```text
/admin/login           -> Halaman Login Admin
/admin/dashboard       -> Halaman Ringkasan/Analitik
/admin/rooms           -> Tabel Daftar Kamar
/admin/rooms/add       -> Form Tambah Kamar
/admin/tenants         -> Tabel Daftar Penghuni Kos
/admin/tenants/[id]    -> Detail Penghuni (KTP, Riwayat Tagihan)
/admin/billing         -> Daftar Tagihan Bulan Ini
/admin/maintenance     -> Daftar Komplain & Perbaikan
```

---

## 5. Panduan Desain Card Box Khusus Admin (Apple-like)

Ketika membuat *Card* di dashboard (misalnya *Card* untuk menampilkan informasi kamar atau ringkasan pendapatan), gunakan panduan kelas Tailwind berikut agar terasa premium:

```tsx
// Contoh Apple-style UI Card Box
<div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
  <h3 className="text-sm font-medium text-gray-500 mb-1">Pendapatan Bulan Ini</h3>
  <p className="text-3xl font-bold text-gray-900">Rp 15.000.000</p>
</div>
```

**Kunci dari Card ini:**
1. Menggunakan `rounded-2xl` (membulat halus).
2. `border-gray-100` (garis tepi sangat tipis dan samar).
3. `shadow-[0_8px_30px_rgb(0,0,0,0.04)]` (bayangan sangat lembut, nyaris tidak terlihat namun memberikan efek mengambang).
4. Tipografi yang kontras (label abu-abu kecil, angka hitam besar & tebal).
