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
    id: "lounge",
    title: "Communal Lounge",
    description: "Area komunal luas dengan sofa premium, TV pintar, dan desain interior hangat. Cocok untuk bersantai atau bersosialisasi dengan penghuni lain setelah seharian beraktivitas.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
    icon: Coffee,
  },
  {
    id: "kitchen",
    title: "Dapur Modern Bersama",
    description: "Dapur luas yang dilengkapi kompor induksi, kulkas besar, microwave, dan perlengkapan memasak lengkap. Didesain agar Anda dapat memasak dengan nyaman seperti di rumah sendiri.",
    image: "https://images.unsplash.com/photo-1556910103-1c02745a872f?q=80&w=2070&auto=format&fit=crop",
    icon: UtensilsCrossed,
  },
  {
    id: "wifi",
    title: "High-Speed WiFi",
    description: "Koneksi internet tanpa batas dengan kecepatan tinggi di seluruh area gedung. Mendukung kelancaran WFH, streaming 4K, maupun gaming tanpa hambatan.",
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=2070&auto=format&fit=crop",
    icon: Wifi,
  },
  {
    id: "security",
    title: "Keamanan 24 Jam & CCTV",
    description: "Keamanan ekstra dengan pengawasan CCTV di setiap sudut koridor dan area publik, akses smart-lock (RFID/Sidik Jari), serta penjaga keamanan yang siaga 24 jam.",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=2064&auto=format&fit=crop",
    icon: ShieldCheck,
  },
  {
    id: "gym",
    title: "Mini Gym",
    description: "Fasilitas kebugaran yang dilengkapi treadmill, dumbbell, dan matras yoga. Tetap bugar tanpa perlu berlangganan gym di luar.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
    icon: Dumbbell,
  },
  {
    id: "parking",
    title: "Area Parkir Luas",
    description: "Parkiran tertutup yang aman untuk mobil dan motor penghuni, dilengkapi atap pelindung agar kendaraan Anda terhindar dari panas dan hujan.",
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=2070&auto=format&fit=crop",
    icon: CarFront,
  }
];
