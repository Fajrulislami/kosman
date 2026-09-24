import { 
  Wifi, 
  CarFront, 
  Coffee, 
  Dumbbell, 
  ShieldCheck, 
  WashingMachine, 
  UtensilsCrossed, 
  Wind 
} from "lucide-react";

export const facilities = [
  {
    id: "cctv",
    title: "Keamanan 24 Jam & CCTV",
    description: "Keamanan ekstra dengan pengawasan CCTV di area publik dan penjagaan yang siaga untuk keamanan penghuni.",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=2064&auto=format&fit=crop",
    icon: ShieldCheck,
  },
  {
    id: "wifi",
    title: "High-Speed WiFi",
    description: "Koneksi internet tanpa batas dengan kecepatan tinggi di seluruh area kos untuk mendukung aktivitas belajar dan hiburan.",
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=2070&auto=format&fit=crop",
    icon: Wifi,
  },
  {
    id: "kitchen",
    title: "Dapur Umum",
    description: "Dapur bersih yang dapat digunakan bersama, dilengkapi dengan fasilitas memasak dasar.",
    image: "https://images.unsplash.com/photo-1556910103-1c02745a872f?q=80&w=2070&auto=format&fit=crop",
    icon: UtensilsCrossed,
  },
  {
    id: "laundry",
    title: "Jemuran Umum",
    description: "Area jemuran yang luas dan terkena sinar matahari langsung untuk mengeringkan pakaian dengan cepat.",
    image: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=2070&auto=format&fit=crop",
    icon: WashingMachine,
  }
];
