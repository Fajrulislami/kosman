import RoomStats from "@/components/admin/kamar/RoomStats";
import RoomFilters from "@/components/admin/kamar/RoomFilters";
import RoomTable from "@/components/admin/kamar/RoomTable";

export const metadata = {
  title: "Manajemen Kamar - Admin Dashboard",
  description: "Kelola status, tipe, dan harga kamar kos",
};

export default function ManajemenKamarPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-[#1F3D35]">
          Manajemen Kamar
        </h1>
        <p className="text-sm text-[#6B716D]">
          Pantau status ketersediaan, perbarui informasi harga, dan kelola unit fisik kamar kos.
        </p>
      </div>

      <RoomStats />
      
      <div className="flex flex-col gap-4">
        <RoomFilters />
        <RoomTable />
      </div>
    </div>
  );
}
