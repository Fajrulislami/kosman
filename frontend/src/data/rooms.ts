export type RoomStatus = "AVAILABLE" | "FULL" | "MAINTENANCE" | "RESERVED";

export interface Room {
  id: string;
  slug: string;
  name: string;
  price: number;
  deposit?: number;
  size?: string;
  status: RoomStatus;
  images: string[];
  facilities: string[];
  description: string;
  rules?: string[];
  totalUnits?: number;
  availableUnits?: number;
  isAvailable?: boolean;
  availableRoomNumbers?: string[];
}

export const rooms: Room[] = [
  {
    id: "standar-pondok-rahmat",
    slug: "standar",
    name: "Kamar Standar",
    price: 650000,
    deposit: 300000,
    size: "3 x 4 m",
    status: "AVAILABLE",
    isAvailable: true,
    totalUnits: 1,
    availableUnits: 1,
    images: [
      "/images/kamar-standar-3.jpg",
      "/images/kamar-standar-1.jpg",
      "/images/kamar-standar-2.jpg",
    ],
    facilities: [
      "Kasur",
      "Kamar Mandi Dalam",
    ],
    description: "Kamar kos nyaman dan bersih dengan fasilitas kasur dan kamar mandi dalam, cocok untuk mahasiswi dan profesional muda yang mencari hunian praktis dan terjangkau di Samata.",
    rules: [
      "Khusus mahasiswi & putri muslimah",
      "Dilarang membawa tamu lawan jenis masuk ke area kamar",
      "Menjaga ketenangan, kebersihan, dan kenyamanan bersama",
      "Pembayaran sewa tepat waktu setiap awal periode",
    ],
  },
];

export const getRoomBySlug = (slug: string): Room | undefined => {
  return rooms.find((room) => room.slug === slug);
};
