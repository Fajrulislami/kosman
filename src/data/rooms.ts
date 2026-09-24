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
    price: 650000,
    status: "AVAILABLE",
    images: [
      "/images/rooms/standar-1.jpg",
      "/images/rooms/standar-2.jpg",
      "/images/rooms/standar-3.jpg",
    ],
    facilities: ["Kasur", "Kamar Mandi Dalam"],
    description: "Kamar standar yang nyaman dan terjangkau khusus untuk putri. Fasilitas lengkap untuk menunjang aktivitas Anda.",
    rules: ["Dilarang membawa tamu laki-laki", "Menjaga kebersihan bersama"]
  }
];

export const getRoomBySlug = (slug: string): Room | undefined => {
  return rooms.find(room => room.slug === slug);
};
