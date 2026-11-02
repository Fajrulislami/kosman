# UI/UX Design Rules: Frontend (Beranda & Tentang)

Dokumen ini berisi aturan ketat UI/UX untuk halaman publik yang **sudah jadi** (Beranda, Tentang, Fasilitas, Kamar). Tujuannya agar saat ada penambahan fitur atau modifikasi, desainnya tidak menyimpang dari estetika asli yang sudah terbentuk.

## 1. Core Aesthetic (Estetika Utama)
- **Vibe:** Modern Minimalist, Boutique Hotel, Nyaman, Bersih.
- **Kesan:** Tidak kaku, hangat, dan mengundang.

## 2. Struktur Layout (Spacing & Grid)
- **Negative Space (Whitespace):** Wajib menggunakan jarak yang lega antar section. Jangan takut dengan ruang kosong. Minimal padding antar section (Y-axis) adalah `py-20` atau `py-24` untuk desktop, dan `py-16` untuk mobile.
- **Lebar Kontainer:** Gunakan `max-w-7xl` (sekitar 1280px) dipadukan dengan `mx-auto` dan `px-4 sm:px-6 lg:px-8` agar konten tetap rata tengah dan tidak melebar tak terbatas di layar ultrawide.
- **Bento Grid / Asimetris:** Untuk elemen seperti Galeri atau Keunggulan (*Why Us*), hindari grid kotak-kotak monoton. Gunakan layout asimetris (contoh: 1 gambar besar berdampingan dengan 2 gambar kecil) untuk kesan organik dan modern.

## 3. Tipografi (Typography)
- **Font:** Plus Jakarta Sans.
- **Hirarki Sangat Kontras:** 
  - **H1 (Hero):** Harus sangat besar (contoh: `text-5xl md:text-7xl`), tebal (`font-bold`), dengan `tracking-tight` (huruf agak rapat) dan `leading-tight` (jarak baris rapat).
  - **H2 (Section Title):** `text-3xl md:text-5xl font-bold tracking-tight`.
  - **Body Text:** Harus mudah dibaca, warna tidak hitam pekat melainkan abu-abu gelap (`text-gray-600` atau `text-muted`), ukuran `text-base` atau `text-lg`, dengan jarak baris rileks (`leading-relaxed`).

## 4. Warna & Kontras
- **Latar Belakang (Background):** Dominasi warna *Off-white* (Cream/Warm White) seperti `#F8F7F4` untuk memberi kesan *warm*. Gunakan putih bersih `#FFFFFF` hanya pada dalam *card* agar menonjol.
- **Aksen:** Hijau Gelap (*Deep Green*) sebagai warna kredibilitas untuk tombol utama (CTA) dan footer. Sedikit sentuhan emas/krem tua untuk highlight.

## 5. Komponen Card & Gambar
- **Corner Radius:** Elemen melengkung tapi tidak berlebihan. Gunakan `rounded-2xl` atau `rounded-3xl` untuk gambar besar dan *card*.
- **Shadow:** Hindari drop-shadow default yang tebal. Gunakan shadow yang sangat halus dan meluas: `shadow-[0_8px_30px_rgb(0,0,0,0.04)]`.
- **Gambar:** Harus mendominasi porsi visual. Gambar *full-cover* di hero atau *image-led composition* pada kartu kamar sangat direkomendasikan.

## 6. Animasi & Interaksi (Micro-interactions)
- **Hover Effects:** Wajib halus. Gunakan `transition-all duration-300 ease-out`. Saat gambar di-hover, beri sedikit efek *zoom-in* pada gambar (`scale-105`) tanpa mengubah ukuran *container*-nya (`overflow-hidden`).
- **Floating & Rotation (Pola Eksisting):** Untuk elemen gambar melayang (seperti di Hero), gunakan rotasi asimetris (misal: `-rotate-6`, `rotate-3`) yang dikombinasikan dengan transisi halus (`duration-500 ease-out`). Saat di-hover, elemen harus kembali tegak lurus (`hover:rotate-0`) dan sedikit membesar (`hover:scale-110`). Efek ini memberi kesan dinamis dan organik.
- **Draggable UI (Kapsul Interaktif):** Manfaatkan pola komponen *custom* seperti `DraggablePill` (yang ada di `Hero.tsx`) untuk elemen-elemen kecil yang mengambang (misal label fitur/fasilitas). Komponen ini murni menggunakan *pointer events* agar pengguna bisa menarik dan menggesernya secara bebas di layar. Ini memberikan elemen kejutan (*delight*) yang amat interaktif ala *High-End UI*.
- **Scroll Reveal (Opsional tapi Disarankan):** Elemen muncul perlahan dari bawah (*fade in up*) saat di-scroll.

## 7. Aturan Pantangan (Strict No-Nos)
- ❌ **JANGAN** gunakan warna mencolok yang tidak ada di palet (merah terang, biru neon).
- ❌ **JANGAN** membuat paragraf terlalu panjang tanpa *line-break*. Maksimal 3-4 baris per paragraf.
- ❌ **JANGAN** memadatkan elemen sehingga terlihat berdesakan.
- ❌ **JANGAN** menggunakan *border* yang tebal dan hitam (gunakan warna *border* yang sangat tipis dan *light*, misal `border-gray-200`).

---

## 8. Struktur Folder Publik (Frontend untuk Pengunjung)

Karena website ini pada akhirnya akan memiliki 2 sisi (Publik & Admin/PMS), struktur folder untuk pengunjung publik (calon penyewa) harus diletakkan murni di *root* `app/` (tidak di dalam folder `admin/`).

Berikut adalah rancangan struktur folder halamannya:

```text
src/
├── app/
│   ├── layout.tsx             -> Layout utama Publik (Berisi Navbar & Footer Publik)
│   ├── page.tsx               -> Beranda (Landing Page Utama)
│   │
│   ├── tentang/
│   │   └── page.tsx           -> Halaman Tentang Kami
│   │
│   ├── kamar/
│   │   ├── page.tsx           -> Halaman Katalog Semua Kamar
│   │   └── [slug]/
│   │       └── page.tsx       -> Halaman Detail Kamar (contoh: /kamar/deluxe)
│   │
│   ├── fasilitas/
│   │   └── page.tsx           -> Halaman Daftar Fasilitas
│   │
│   ├── lokasi/
│   │   └── page.tsx           -> Halaman Informasi Lokasi & Maps
│   │
│   ├── kontak/
│   │   └── page.tsx           -> Halaman Kontak & Form Hubungi Kami
│   │
│   {/* --- Halaman Ekstra Persiapan PMS --- */}
│   ├── aturan/
│   │   └── page.tsx           -> Halaman Aturan Kos & Syarat Ketentuan
│   │
│   ├── faq/
│   │   └── page.tsx           -> Halaman Tanya Jawab Khusus
│   │
│   └── portal/
│       └── login/
│           └── page.tsx       -> Halaman Login untuk Penghuni Lama (Masuk ke Dashboard Penghuni)
│
├── components/
│   ├── layout/                -> Komponen layout publik (Navbar Publik, Footer Publik)
│   ├── home/                  -> Komponen khusus halaman beranda (Hero, About, CTA, dll)
│   ├── rooms/                 -> Komponen khusus fitur kamar publik (RoomCard, RoomDetail)
│   └── shared/                -> (Opsional) Komponen spesifik publik yang di-share antar halaman
```

**Aturan Penting:**
1. Halaman publik **tidak boleh** mengambil data dari folder `components/admin/`. Keduanya harus terisolasi.
2. Semua komponen publik diletakkan di `src/components/` di luar folder `admin/`.

---
*Catatan untuk Agent:* Saat memodifikasi komponen di `src/components/home/` atau `src/app/tentang/`, rujuk dokumen ini agar tidak merusak *taste* desain yang sudah ada.
