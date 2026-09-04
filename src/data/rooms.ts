export type RoomStatus = "AVAILABLE" | "FULL" | "MAINTENANCE";

export interface Room {
  id: string;
  slug: string;
  name: string;
  price: number;
  status: RoomStatus;
  images: string[];
  facilities: string[];
  description: string;
  rules?: string[];
}

export const rooms: Room[] = [
  {
    id: "r1",
    slug: "standar",
    name: "Kamar Standar",
    price: 1500000,
    status: "AVAILABLE",
    images: [
      "/images/rooms/standar-1.jpg",
      "/images/rooms/standar-2.jpg",
      "/images/rooms/standar-3.jpg",
    ],
    facilities: ["Kasur Single", "Kamar Mandi Dalam", "Meja Belajar", "Lemari", "Kipas Angin"],
    description: "Kamar standar yang nyaman dan terjangkau, cocok untuk mahasiswa atau pekerja yang menginginkan privasi dengan fasilitas dasar yang lengkap.",
    rules: ["Dilarang merokok di dalam kamar", "Tamu tidak diperkenankan menginap"]
  },
  {
    id: "r2",
    slug: "deluxe",
    name: "Kamar Deluxe",
    price: 2200000,
    status: "AVAILABLE",
    images: [
      "/images/rooms/deluxe-1.jpg",
      "/images/rooms/deluxe-2.jpg",
      "/images/rooms/deluxe-3.jpg",
    ],
    facilities: ["Kasur Queen Size", "Kamar Mandi Dalam (Air Panas)", "Meja Belajar Eksekutif", "Lemari Besar", "AC", "Smart TV"],
    description: "Nikmati kenyamanan ekstra dengan ruang yang lebih luas dan fasilitas premium. Sangat cocok untuk Anda yang menginginkan kualitas istirahat terbaik setelah seharian beraktivitas.",
  },
  {
    id: "r3",
    slug: "premium-suite",
    name: "Premium Suite",
    price: 3500000,
    status: "FULL",
    images: [
      "/images/rooms/premium-1.jpg",
      "/images/rooms/premium-2.jpg",
      "/images/rooms/premium-3.jpg",
    ],
    facilities: ["Kasur King Size", "Kamar Mandi Dalam (Air Panas & Bathtub)", "AC", "Smart TV 43 inch", "Kulkas Mini", "Balkon Pribadi", "Layanan Bersih Kamar 2x/Minggu"],
    description: "Tipe kamar eksklusif dengan fasilitas layaknya apartemen studio. Hadir dengan balkon pribadi dan layanan pembersihan rutin untuk menjamin kenyamanan absolut Anda.",
    rules: ["Dilarang membawa hewan peliharaan"]
  }
];

export const getRoomBySlug = (slug: string): Room | undefined => {
  return rooms.find(room => room.slug === slug);
};
