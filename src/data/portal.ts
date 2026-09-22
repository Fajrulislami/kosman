// src/data/portal.ts

export const tenantProfile = {
  id: "T-001",
  name: "Budi Santoso",
  email: "budi.santoso@example.com",
  phone: "081234567890",
  room: "Kamar Standard - 101",
  joinDate: "2024-01-15",
  emergencyContact: {
    name: "Andi Santoso",
    relation: "Saudara",
    phone: "081987654321",
  },
};

export const billingHistory = [
  {
    id: "INV-2024-08",
    month: "Agustus 2024",
    amount: 1500000,
    status: "Lunas",
    dueDate: "2024-08-05",
    paidDate: "2024-08-03",
  },
  {
    id: "INV-2024-09",
    month: "September 2024",
    amount: 1500000,
    status: "Belum Lunas",
    dueDate: "2024-09-05",
    paidDate: null,
  },
];

export const maintenanceRequests = [
  {
    id: "REQ-001",
    date: "2024-08-10",
    issue: "AC Kurang Dingin",
    status: "Selesai",
    description: "AC di kamar 101 terasa kurang dingin sejak 2 hari yang lalu.",
  },
  {
    id: "REQ-002",
    date: "2024-09-02",
    issue: "Lampu Kamar Mandi Mati",
    status: "Diproses",
    description: "Lampu utama di kamar mandi tiba-tiba mati.",
  },
];
