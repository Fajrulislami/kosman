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
    id: "cmufa0wro0001zlt813nay564",
    slug: "standar",
    name: "Kamar Standar",
    price: 1500000,
    deposit: 500000,
    size: "3 x 4 m",
    status: "AVAILABLE",
    isAvailable: true,
    totalUnits: 2,
    availableUnits: 1,
    images: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800",
    ],
    facilities: [
      "Kasur Springbed",
      "Lemari Pakaian",
      "Meja Belajar",
      "WiFi High Speed",
      "Kamar Mandi Dalam"
    ],
    description: "Kamar nyaman dengan fasilitas lengkap, cocok untuk mahasiswa dan profesional muda.",
    rules: [
      "Dilarang membawa tamu lawan jenis menginap tanpa izin",
      "Menjaga ketenangan dan kebersihan bersama",
      "Pembayaran sewa tepat waktu setiap awal periode"
    ]
  },
  {
    id: "cmufa0wrr0002zlt8lozavaq6",
    slug: "premium",
    name: "Kamar Premium",
    price: 2000000,
    deposit: 500000,
    size: "4 x 4 m",
    status: "AVAILABLE",
    isAvailable: true,
    totalUnits: 3,
    availableUnits: 3,
    images: [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800",
    ],
    facilities: [
      "Kasur Queen Size",
      "AC Inverter",
      "Water Heater",
      "Smart TV",
      "Lemari 3 Pintu",
      "WiFi"
    ],
    description: "Kamar luas dengan pendingin ruangan (AC), water heater, dan pencahayaan maksimal.",
    rules: [
      "Dilarang membawa tamu lawan jenis menginap tanpa izin",
      "Menjaga ketenangan dan kebersihan bersama",
      "Pembayaran sewa tepat waktu setiap awal periode"
    ]
  },
  {
    id: "cmufa0wrt0003zlt8ssvlm6i9",
    slug: "vip",
    name: "Kamar VIP",
    price: 3000000,
    deposit: 1000000,
    size: "5 x 4 m",
    status: "FULL",
    isAvailable: false,
    totalUnits: 1,
    availableUnits: 0,
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
    ],
    facilities: [
      "King Bed",
      "Balkon Pribadi",
      "Kulkas Mini",
      "Microwave",
      "AC & Water Heater",
      "Sofa & Meja"
    ],
    description: "Kamar eksklusif tipe studio dengan mini kitchen, balkon pribadi, dan pembersihan berkala.",
    rules: [
      "Dilarang membawa tamu lawan jenis menginap tanpa izin",
      "Menjaga ketenangan dan kebersihan bersama",
      "Pembayaran sewa tepat waktu setiap awal periode"
    ]
  }
];

export const getRoomBySlug = (slug: string): Room | undefined => {
  return rooms.find((room) => room.slug === slug);
};

