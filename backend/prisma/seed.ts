import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Menjalankan seed database Pondok Rahmat (Kostara) dengan pola UPSERT...");

  // 1. Inisialisasi Akun Super Admin dari Environment Variable (Idempotent)
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL || "admin@kostara.id";
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || "adminpassword123";

  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      // Catatan keamanan: Password hash tidak ditimpa agar jika admin telah mengubah
      // password di kemudian hari, password barunya tidak ter-reset secara tidak sengaja.
      name: "Admin Pondok Rahmat",
      role: "ADMIN",
    },
    create: {
      email: adminEmail,
      passwordHash: adminPasswordHash,
      name: "Admin Pondok Rahmat",
      role: "ADMIN",
    },
  });
  console.log(`✅ Super Admin siap: ${adminUser.email}`);

  // 2. Inisialisasi Master Tipe Kamar Standar (Sesuai Kondisi Fisik Asli)
  const standardType = await prisma.roomType.upsert({
    where: { slug: "standar" },
    update: {
      name: "Kamar Standar",
      size: "3 x 4 m",
      facilities: JSON.stringify(["Kasur", "Kamar Mandi Dalam"]),
      images: JSON.stringify([
        "/images/kamar-standar-3.jpg",
        "/images/kamar-standar-1.jpg",
        "/images/kamar-standar-2.jpg",
      ]),
    },
    create: {
      name: "Kamar Standar",
      slug: "standar",
      basePrice: 650000,
      yearlyPrice: 6000000,
      depositPrice: 300000,
      size: "3 x 4 m",
      description:
        "Kamar kos nyaman dan bersih dengan fasilitas kasur dan kamar mandi dalam, cocok untuk mahasiswi dan profesional muda yang mencari hunian praktis dan terjangkau.",
      facilities: JSON.stringify(["Kasur", "Kamar Mandi Dalam"]),
      images: JSON.stringify([
        "/images/kamar-standar-3.jpg",
        "/images/kamar-standar-1.jpg",
        "/images/kamar-standar-2.jpg",
      ]),
    },
  });
  console.log(`✅ Master Tipe Kamar siap: ${standardType.name} (Slug: ${standardType.slug})`);

  console.log("🛡️  Pola UPSERT aktif: Tidak ada data penyewa, transaksi, invoice, atau nomor kamar yang terhapus.");
  console.log("🎉 Seeding database selesai!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
