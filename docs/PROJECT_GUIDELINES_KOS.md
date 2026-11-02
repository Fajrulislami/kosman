# Project Guidelines — Landing Page Kos

Dokumen ini menjadi pedoman utama untuk pengembangan website kos menggunakan **Next.js + TypeScript + Tailwind CSS**.

Tujuan dokumen:
- Menjaga desain tetap konsisten.
- Menjaga struktur project mudah dipahami developer lain.
- Memisahkan halaman, komponen, data, dan utility dengan jelas.
- Memudahkan penggantian data dummy ketika informasi dari client sudah tersedia.
- Menghindari struktur dan styling yang dibuat secara sembarangan.

---

# 1. Project Overview

Website merupakan website informasi dan promosi kos/boarding house.

Fokus utama website:

1. Menampilkan informasi kos.
2. Menampilkan tipe dan detail kamar.
3. Menampilkan fasilitas.
4. Menampilkan galeri.
5. Menampilkan lokasi.
6. Memberikan informasi cara menyewa.
7. Menyediakan CTA untuk menghubungi admin.
8. Memberikan pengalaman visual yang nyaman dan profesional.

Teknologi utama:

```text
Next.js
TypeScript
Tailwind CSS
```

Prinsip pengembangan:

```text
Clean
Simple
Reusable
Responsive
Maintainable
Data-driven
```

---

# 2. Design Direction

## Theme

**Modern Minimalist — Warm & Comfortable**

Karakter visual:

- Minimalis
- Bersih
- Modern
- Profesional
- Hangat
- Nyaman
- Tidak terlalu mewah
- Tidak terlalu corporate
- Banyak whitespace
- Foto menjadi elemen visual utama
- Rounded corner secukupnya
- Shadow tipis
- Animasi sederhana

Arah visual website merupakan perpaduan:

```text
Modern Property Website
+
Co-living
+
Boutique Hotel
```

Website harus memberikan kesan:

> nyaman, aman, bersih, modern, dan mudah dipercaya.

---

# 3. Color System

Gunakan warna berikut sebagai warna utama project.

| Token | Hex | Penggunaan |
|---|---|---|
| Background | `#F8F7F4` | Background utama |
| Surface | `#FFFFFF` | Card / navbar |
| Primary | `#1F3D35` | Button / elemen utama |
| Primary Dark | `#162E28` | Hover / dark section |
| Accent | `#C69C6D` | Highlight / dekorasi |
| Text | `#202321` | Judul / teks utama |
| Muted | `#6B716D` | Deskripsi / teks sekunder |
| Border | `#E5E3DE` | Border |

## Proporsi Warna

```text
70%  #F8F7F4
20%  #FFFFFF
8%   #1F3D35
2%   #C69C6D
```

Jangan membuat setiap section memiliki warna berbeda.

Identitas utama harus tetap:

```text
Cream
+
White
+
Deep Green
+
Small Gold Accent
```

---

# 4. Background Rules

Gunakan:

```text
#F8F7F4
```

sebagai background utama.

Gunakan:

```text
#FFFFFF
```

untuk card atau section yang perlu dipisahkan secara visual.

Gunakan:

```text
#1F3D35
```

untuk section penting seperti CTA.

Gunakan:

```text
#162E28
```

untuk footer atau dark section.

Contoh:

```text
Navbar       → #F8F7F4
Hero         → #F8F7F4
Why Us       → #FFFFFF
Rooms        → #F8F7F4
Facilities   → #FFFFFF
CTA          → #1F3D35
Footer       → #162E28
```

---

# 5. Typography

## Font Family

Gunakan:

**Plus Jakarta Sans**

Jangan menggunakan banyak font dalam satu project.

Alternatif apabila diperlukan:

**DM Sans**

Namun font utama tetap:

```text
Plus Jakarta Sans
```

---

## H1

Hero title:

```text
Desktop:
56px
Weight: 700
Line Height: 1.1

Mobile:
36px
Weight: 700
```

Contoh:

> Temukan Tempat Tinggal yang Nyaman untukmu.

---

## H2

Section heading:

```text
Desktop:
40px
Weight: 700
Line Height: 1.2

Mobile:
30px
Weight: 700
```

---

## H3

Card heading:

```text
20px
Weight: 600
Line Height: 1.3
```

---

## Body

```text
16px
Weight: 400
Line Height: 1.7
Color: #6B716D
```

Minimum body text:

```text
15–16px
```

---

## Small Text

```text
14px
Weight: 400–500
Color: #6B716D
```

Digunakan untuk metadata, label, status, dan informasi tambahan.

---

# 6. Spacing System

Gunakan sistem spacing berbasis kelipatan 8px.

```text
8px
16px
24px
32px
48px
64px
80px
96px
120px
```

Hindari spacing acak seperti:

```text
73px
91px
117px
```

## Section Spacing

Desktop:

```text
96–120px
```

Mobile:

```text
64–80px
```

---

# 7. Container

Gunakan:

```text
max-width: 1200px
padding-inline: 24px
```

Semua section utama harus menggunakan container yang konsisten.

Jangan membuat setiap section memiliki lebar maksimal yang berbeda tanpa alasan.

---

# 8. Border Radius

Gunakan radius berikut:

| Element | Radius |
|---|---:|
| Button | 10px |
| Card | 16px |
| Image | 16–20px |
| Large Image | 24px |

Hindari penggunaan radius ekstrem pada semua elemen.

---

# 9. Button

## Primary Button

```text
Background: #1F3D35
Text: #FFFFFF
Font: Plus Jakarta Sans
Size: 14px
Weight: 600
Padding: 14px 22px
Radius: 10px
```

Hover:

```text
#162E28
```

Contoh label:

```text
Lihat Kamar
Hubungi Kami
Tanya Ketersediaan
```

## Secondary Button

```text
Background: transparent
Border: 1px solid #1F3D35
Text: #1F3D35
Weight: 600
Radius: 10px
```

---

# 10. Card

Default card:

```text
Background: #FFFFFF
Border: 1px solid #E5E3DE
Radius: 16px
Padding: 24px
```

Shadow harus ringan:

```text
0 8px 30px rgba(0,0,0,0.04)
```

Jangan menggunakan shadow berat.

---

# 11. Image Rules

Foto adalah elemen penting pada website kos.

Gunakan:
- Foto natural.
- Lighting terang.
- Ruangan terlihat bersih.
- Saturasi tidak berlebihan.
- Aspect ratio 4:3 atau 3:2.
- Radius 16–24px.
- Foto harus memiliki kualitas yang cukup baik.

Kategori gambar:

```text
Hero
Rooms
Facilities
Gallery
Location
```

Jangan memasukkan gambar sembarangan ke folder `public/images`.

Gunakan subfolder berdasarkan fungsi.

---

# 12. Icon

Gunakan:

**Lucide Icons**

Ukuran umum:

```text
20px
24px
```

Jangan menggunakan emoji sebagai icon untuk desain final.

---

# 13. Animation

Animasi harus sederhana.

Scroll reveal:

```text
opacity: 0 → 1
translateY(20px → 0)
duration: 300–500ms
```

Button hover dapat menggunakan:
- Perubahan warna.
- Sedikit translate.
- Transition ringan.

Hindari:
- Bouncing.
- Spinning.
- Parallax berlebihan.
- Animasi semua elemen sekaligus.

---

# 14. Website Pages

Jangan menjadikan setiap section sebagai halaman.

## Halaman utama

```text
/
```

Landing page berisi:

```text
Navbar
Hero
Why Us
About
Featured Rooms
Facilities Preview
Gallery Preview
Location Preview
Testimonials
FAQ
CTA
Footer
```

## Halaman kamar

```text
/kamar
```

Menampilkan semua tipe kamar.

## Detail kamar

```text
/kamar/[slug]
```

Contoh:

```text
/kamar/standard
/kamar/deluxe
/kamar/premium
```

## Fasilitas

```text
/fasilitas
```

## Lokasi

```text
/lokasi
```

## Tentang

```text
/tentang
```

## Kontak

```text
/kontak
```

---

# 15. Recommended Folder Structure

Gunakan struktur berikut:

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   │
│   ├── kamar/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   ├── fasilitas/
│   │   └── page.tsx
│   │
│   ├── lokasi/
│   │   └── page.tsx
│   │
│   ├── tentang/
│   │   └── page.tsx
│   │
│   └── kontak/
│       └── page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   │
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── WhyUs.tsx
│   │   ├── About.tsx
│   │   ├── FeaturedRooms.tsx
│   │   ├── FacilitiesPreview.tsx
│   │   ├── GalleryPreview.tsx
│   │   ├── LocationPreview.tsx
│   │   ├── Testimonials.tsx
│   │   ├── FAQ.tsx
│   │   └── CTA.tsx
│   │
│   ├── rooms/
│   │   ├── RoomCard.tsx
│   │   ├── RoomGrid.tsx
│   │   └── RoomDetail.tsx
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── Badge.tsx
│       ├── SectionHeading.tsx
│       └── Container.tsx
│
├── data/
│   ├── rooms.ts
│   ├── facilities.ts
│   ├── testimonials.ts
│   └── site.ts
│
├── lib/
│   └── utils.ts
│
├── types/
│   └── index.ts
│
└── public/
    ├── images/
    │   ├── hero/
    │   ├── rooms/
    │   ├── facilities/
    │   └── gallery/
    │
    └── icons/
```

---

# 16. Folder Responsibility

## `app/`

Berisi halaman dan routing.

Contoh:

```text
app/page.tsx
→ Homepage

app/kamar/page.tsx
→ Daftar kamar

app/kamar/[slug]/page.tsx
→ Detail kamar
```

Jangan meletakkan komponen UI umum di sini.

---

## `components/`

Berisi komponen UI yang digunakan oleh halaman.

### `components/layout/`

Komponen global:

```text
Navbar
Footer
```

### `components/home/`

Komponen khusus homepage:

```text
Hero
WhyUs
About
FeaturedRooms
FacilitiesPreview
GalleryPreview
LocationPreview
Testimonials
FAQ
CTA
```

### `components/rooms/`

Komponen yang berkaitan dengan kamar:

```text
RoomCard
RoomGrid
RoomDetail
```

### `components/ui/`

Komponen UI reusable yang tidak terikat dengan halaman tertentu:

```text
Button
Badge
SectionHeading
Container
```

---

# 17. Data Management

Jangan hard-code data bisnis langsung di dalam component jika data tersebut kemungkinan berubah.

Hindari:

```tsx
<h3>Deluxe Room</h3>
<p>Rp1.200.000 / bulan</p>
```

Gunakan data:

```ts
const rooms = [
  {
    name: "Deluxe Room",
    price: "Rp1.200.000",
    image: "/images/rooms/deluxe.jpg",
  },
];
```

Kemudian:

```tsx
<RoomCard room={room} />
```

Tujuan:

> Data dapat diganti tanpa perlu mengubah struktur UI.

---

# 18. Data Files

## `data/site.ts`

Berisi informasi umum website:

```ts
export const site = {
  name: "Kostara",
  description: "Hunian nyaman untuk hidup lebih produktif.",
  phone: "+62XXXXXXXXXX",
  whatsapp: "+62XXXXXXXXXX",
  address: "Alamat sementara",
};
```

## `data/rooms.ts`

Berisi data kamar:

```ts
export const rooms = [
  {
    slug: "standard",
    name: "Standard Room",
    price: "Rp800.000",
    image: "/images/rooms/standard.jpg",
    facilities: [
      "Kasur",
      "Lemari",
      "Meja",
      "WiFi",
    ],
  },
];
```

## `data/facilities.ts`

Berisi data fasilitas.

## `data/testimonials.ts`

Berisi testimonial.

---

# 19. Placeholder Data

Sebelum informasi client tersedia, gunakan placeholder.

Contoh:

```text
[NAMA KOS]
[ALAMAT KOS]
[HARGA KAMAR]
[NOMOR WHATSAPP]
[FOTO KAMAR]
[FASILITAS]
[GOOGLE MAPS]
[INSTAGRAM]
```

Jangan menganggap data dummy sebagai informasi resmi client.

Ketika data client tersedia, cukup mengganti data di folder:

```text
data/
```

dan asset di:

```text
public/images/
```

---

# 20. Component Rules

Component harus memiliki tanggung jawab yang jelas.

Contoh:

```text
RoomCard
→ hanya menangani tampilan satu kamar.

RoomGrid
→ menangani layout beberapa RoomCard.

FeaturedRooms
→ section homepage yang menampilkan kamar unggulan.
```

Jangan membuat satu component menangani terlalu banyak hal.

Hindari component seperti:

```text
Everything.tsx
HomeContent.tsx
MainPage.tsx
```

yang berisi seluruh website.

---

# 21. Naming Convention

Gunakan **PascalCase** untuk component:

```text
Navbar.tsx
RoomCard.tsx
SectionHeading.tsx
```

Gunakan **camelCase** untuk variable/function:

```text
roomData
getRoomBySlug
handleSubmit
```

Gunakan **kebab-case** untuk URL:

```text
/kamar
/kamar/deluxe
/tentang
```

Gunakan **kebab-case** untuk asset file:

```text
hero-main.jpg
room-deluxe.jpg
shared-kitchen.jpg
```

---

# 22. Tailwind CSS Rules

Gunakan Tailwind sebagai sistem styling utama.

Hindari membuat CSS manual jika styling dapat dilakukan dengan Tailwind.

Contoh yang baik:

```tsx
<div className="rounded-2xl border border-border bg-white p-6">
```

Jangan terlalu sering menggunakan arbitrary value:

```tsx
bg-[#1F3D35]
```

jika warna tersebut sudah tersedia sebagai design token.

---

# 23. Design Tokens

Warna desain sebaiknya didefinisikan sebagai token Tailwind.

Contoh konsep:

```text
background
surface
primary
primary-dark
accent
text
muted
border
```

Sehingga component dapat menggunakan:

```text
bg-background
bg-surface
bg-primary
bg-primary-dark
text-text
text-muted
border-border
```

Tujuan:

> Jika warna brand berubah, developer cukup mengubah token tanpa mencari warna di seluruh project.

---

# 24. Responsive Rules

Website harus mobile-first.

Prioritas:

```text
Mobile
↓
Tablet
↓
Desktop
```

Breakpoints umum:

```text
sm
md
lg
xl
```

Jangan hanya membuat desktop lalu memaksakan responsive setelah selesai.

Contoh:

```tsx
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
```

---

# 25. Homepage Component Structure

`app/page.tsx` sebaiknya tetap sederhana.

Contoh struktur:

```tsx
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhyUs />
        <About />
        <FeaturedRooms />
        <FacilitiesPreview />
        <GalleryPreview />
        <LocationPreview />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
```

Jangan menulis seluruh markup section langsung di `page.tsx`.

---

# 26. Section Heading Pattern

Gunakan pola:

```text
SMALL LABEL

H2 TITLE

SHORT DESCRIPTION
```

Contoh:

```text
PILIHAN KAMAR

Temukan Kamar yang Sesuai

Pilih tipe kamar yang dirancang untuk memberikan
kenyamanan dalam aktivitas sehari-hari.
```

Component reusable:

```text
SectionHeading.tsx
```

---

# 27. Image Directory Rules

Gunakan:

```text
public/images/
├── hero/
├── rooms/
├── facilities/
└── gallery/
```

Contoh:

```text
public/images/hero/hero-main.jpg
public/images/rooms/standard.jpg
public/images/rooms/deluxe.jpg
public/images/facilities/parking.jpg
public/images/gallery/front-building.jpg
```

Jangan mencampur semua gambar dalam satu folder.

---

# 28. Accessibility

Setiap gambar harus memiliki `alt` yang relevan.

Contoh:

```tsx
<Image
  src="/images/rooms/deluxe.jpg"
  alt="Interior Deluxe Room"
/>
```

Button harus memiliki label yang jelas.

Jangan menggunakan:

```text
Click here
```

jika label yang lebih spesifik tersedia.

Gunakan:

```text
Lihat Detail Kamar
Hubungi Admin
Lihat Lokasi
```

---

# 29. SEO Basic

Setiap halaman harus memiliki:

```text
Title
Description
```

Contoh homepage:

```text
Title:
Kostara — Hunian Nyaman dan Strategis

Description:
Temukan kos nyaman dengan fasilitas lengkap dan lokasi strategis.
```

Halaman kamar harus memiliki metadata yang relevan dengan kamar tersebut.

---

# 30. Performance

Prioritas:

- Gunakan `next/image`.
- Optimalkan ukuran gambar.
- Hindari gambar berukuran sangat besar.
- Gunakan font secara efisien.
- Jangan menambahkan library hanya untuk kebutuhan kecil.
- Gunakan Client Component hanya jika diperlukan.

Default:

```text
Server Component
```

Gunakan:

```text
"use client"
```

hanya ketika component membutuhkan interaksi client-side.

---

# 31. Development Principles

Setiap developer yang mengerjakan project harus mengikuti prinsip:

### 1. Jangan membuat ulang component yang sudah tersedia.

Cari terlebih dahulu:

```text
components/ui/
components/layout/
```

### 2. Jangan hard-code data bisnis di component.

Gunakan:

```text
data/
```

### 3. Jangan membuat warna baru tanpa alasan.

Gunakan design tokens.

### 4. Jangan membuat halaman untuk setiap section.

Section homepage tetap berada di:

```text
components/home/
```

### 5. Jangan membuat component terlalu besar.

Pecah component jika tanggung jawabnya sudah terlalu banyak.

### 6. Jangan mengubah design system tanpa alasan.

Jika ada kebutuhan baru, pertimbangkan apakah perubahan tersebut memang menjadi bagian dari design system.

---

# 32. Landing Page Information Architecture

Homepage:

```text
Navbar
↓
Hero
↓
Why Us
↓
About
↓
Featured Rooms
↓
Facilities Preview
↓
Gallery Preview
↓
Location Preview
↓
Testimonials
↓
FAQ
↓
CTA
↓
Footer
```

Tujuan alur:

```text
Kenali kos
↓
Lihat keunggulan
↓
Lihat kamar
↓
Lihat fasilitas
↓
Lihat kondisi tempat
↓
Lihat lokasi
↓
Bangun kepercayaan
↓
Jawab keraguan
↓
Hubungi admin
```

---

# 33. Final Design Reference

```text
THEME
Modern Minimalist — Warm & Comfortable

FONT
Plus Jakarta Sans

BACKGROUND
#F8F7F4

SURFACE
#FFFFFF

PRIMARY
#1F3D35

PRIMARY DARK
#162E28

ACCENT
#C69C6D

TEXT
#202321

MUTED
#6B716D

BORDER
#E5E3DE

H1
56px / 700 / 1.1

H2
40px / 700 / 1.2

H3
20px / 600 / 1.3

BODY
16px / 400 / 1.7

SMALL
14px / 400–500

BUTTON
14px / 600

BUTTON RADIUS
10px

CARD RADIUS
16px

IMAGE RADIUS
16–24px

CONTAINER
1200px

SECTION SPACING
96–120px desktop
64–80px mobile

ICON
Lucide Icons

CSS
Tailwind CSS

FRAMEWORK
Next.js

LANGUAGE
TypeScript
```

---

# 34. Rule of Thumb

Jika developer bingung harus menaruh sesuatu di mana, gunakan aturan sederhana:

```text
Apakah ini halaman?
→ app/

Apakah ini component UI?
→ components/

Apakah ini khusus homepage?
→ components/home/

Apakah ini khusus kamar?
→ components/rooms/

Apakah ini component reusable?
→ components/ui/

Apakah ini data/content?
→ data/

Apakah ini utility/function?
→ lib/

Apakah ini TypeScript type?
→ types/

Apakah ini gambar/static asset?
→ public/
```

Dengan aturan tersebut, developer baru dapat memahami project tanpa harus membaca seluruh source code terlebih dahulu.
