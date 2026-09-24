import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Mulai seeding database SQLite lokal Kostara...");

  // 1. Bersihkan data lama
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.lease.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.room.deleteMany();
  await prisma.roomType.deleteMany();
  await prisma.user.deleteMany();

  // 2. Buat Akun Super Admin
  const adminPasswordHash = await bcrypt.hash("adminpassword123", 10);
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@kostara.id",
      passwordHash: adminPasswordHash,
      name: "Admin Kostara",
      role: "ADMIN",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    },
  });
  console.log(`✅ Super Admin dibuat: ${adminUser.email} (Password: adminpassword123)`);

  // 3. Buat Tipe Kamar
  const standardType = await prisma.roomType.create({
    data: {
      name: "Kamar Standar",
      slug: "standar",
      basePrice: 1500000,
      depositPrice: 500000,
      size: "3 x 4 m",
      description: "Kamar nyaman dengan fasilitas lengkap, cocok untuk mahasiswa dan profesional muda.",
      facilities: JSON.stringify(["Kasur Springbed", "Lemari Pakaian", "Meja Belajar", "WiFi High Speed", "Kamar Mandi Dalam"]),
      images: JSON.stringify(["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800"]),
    },
  });

  const premiumType = await prisma.roomType.create({
    data: {
      name: "Kamar Premium",
      slug: "premium",
      basePrice: 2000000,
      depositPrice: 500000,
      size: "4 x 4 m",
      description: "Kamar luas dengan pendingin ruangan (AC), water heater, dan pencahayaan maksimal.",
      facilities: JSON.stringify(["Kasur Queen Size", "AC Inverter", "Water Heater", "Smart TV", "Lemari 3 Pintu", "WiFi"]),
      images: JSON.stringify(["https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800"]),
    },
  });

  const vipType = await prisma.roomType.create({
    data: {
      name: "Kamar VIP",
      slug: "vip",
      basePrice: 3000000,
      depositPrice: 1000000,
      size: "5 x 4 m",
      description: "Kamar eksklusif tipe studio dengan mini kitchen, balkon pribadi, dan pembersihan berkala.",
      facilities: JSON.stringify(["King Bed", "Balkon Pribadi", "Kulkas Mini", "Microwave", "AC & Water Heater", "Sofa & Meja"]),
      images: JSON.stringify(["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"]),
    },
  });

  console.log("✅ Tipe kamar (Standar, Premium, VIP) berhasil dibuat.");

  // 4. Buat Unit Kamar Fisik
  const room101 = await prisma.room.create({
    data: { roomNumber: "101", floor: 1, roomTypeId: standardType.id, status: "OCCUPIED" },
  });
  await prisma.room.create({
    data: { roomNumber: "102", floor: 1, roomTypeId: premiumType.id, status: "AVAILABLE" },
  });
  await prisma.room.create({
    data: { roomNumber: "103", floor: 1, roomTypeId: standardType.id, status: "AVAILABLE" },
  });
  await prisma.room.create({
    data: { roomNumber: "105", floor: 1, roomTypeId: vipType.id, status: "MAINTENANCE", notes: "Perbaikan wastafel" },
  });
  await prisma.room.create({
    data: { roomNumber: "201", floor: 2, roomTypeId: premiumType.id, status: "AVAILABLE" },
  });
  await prisma.room.create({
    data: { roomNumber: "202", floor: 2, roomTypeId: premiumType.id, status: "AVAILABLE" },
  });

  console.log("✅ Unit kamar (101, 102, 103, 105, 201, 202) berhasil dibuat.");

  // 5. Buat Akun Penyewa untuk Kamar 101 (Budi Santoso)
  const tenantPasswordHash = await bcrypt.hash("tenantpassword123", 10);
  const tenantUser = await prisma.user.create({
    data: {
      email: "budi.santoso@example.com",
      passwordHash: tenantPasswordHash,
      name: "Budi Santoso",
      role: "TENANT",
    },
  });

  const tenant = await prisma.tenant.create({
    data: {
      userId: tenantUser.id,
      fullName: "Budi Santoso",
      nik: "7371012345670001",
      phone: "081234567890",
      emergencyName: "Andi Santoso",
      emergencyPhone: "081987654321",
      emergencyRelation: "Saudara",
      occupation: "Software Engineer",
    },
  });

  // 6. Kontrak Sewa Kamar 101
  const lease = await prisma.lease.create({
    data: {
      tenantId: tenant.id,
      roomId: room101.id,
      startDate: new Date("2024-01-15"),
      endDate: new Date("2025-01-15"),
      rentAmount: 1500000,
      depositAmount: 500000,
      status: "ACTIVE",
    },
  });

  // 7. Tagihan & Riwayat Pembayaran
  await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2024-08",
      leaseId: lease.id,
      amount: 1500000,
      dueDate: new Date("2024-08-05"),
      periodMonth: 8,
      periodYear: 2024,
      status: "PAID",
      payments: {
        create: {
          amount: 1500000,
          paidAt: new Date("2024-08-03"),
          verifiedAt: new Date("2024-08-03"),
          verifiedBy: "Admin Kostara",
          status: "VERIFIED",
        },
      },
    },
  });

  await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2024-09",
      leaseId: lease.id,
      amount: 1500000,
      dueDate: new Date("2024-09-05"),
      periodMonth: 9,
      periodYear: 2024,
      status: "PENDING",
    },
  });

  // 8. Komplain / Keluhan Fasilitas
  await prisma.complaint.create({
    data: {
      ticketNumber: "REQ-001",
      tenantId: tenant.id,
      roomId: room101.id,
      category: "AC",
      title: "AC Kurang Dingin",
      description: "AC di kamar 101 terasa kurang dingin sejak 2 hari yang lalu.",
      priority: "MEDIUM",
      status: "RESOLVED",
      resolvedAt: new Date("2024-08-12"),
      resolutionNote: "Freon telah diisi ulang dan filter dibersihkan oleh teknisi.",
    },
  });

  await prisma.complaint.create({
    data: {
      ticketNumber: "REQ-002",
      tenantId: tenant.id,
      roomId: room101.id,
      category: "ELECTRICITY",
      title: "Lampu Kamar Mandi Mati",
      description: "Lampu utama di kamar mandi tiba-tiba mati.",
      priority: "HIGH",
      status: "IN_PROGRESS",
    },
  });

  console.log("🎉 Seeding database SQLite lokal selesai dengan sukses!");
}

main()
  .catch((e) => {
    console.error("Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
