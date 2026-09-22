"use client";

import { MoreVertical, Edit, Trash2 } from "lucide-react";

const rooms = [
  { id: 1, number: "101", type: "Standar", price: "Rp 1.500.000", status: "Terisi", tenant: "Ahmad Rizki" },
  { id: 2, number: "102", type: "Premium", price: "Rp 2.000.000", status: "Terisi", tenant: "Budi Santoso" },
  { id: 3, number: "103", type: "Standar", price: "Rp 1.500.000", status: "Kosong", tenant: "-" },
  { id: 4, number: "105", type: "VIP", price: "Rp 3.000.000", status: "Perbaikan", tenant: "-" },
  { id: 5, number: "201", type: "Premium", price: "Rp 2.000.000", status: "Terisi", tenant: "Citra Kirana" },
  { id: 6, number: "202", type: "Premium", price: "Rp 2.000.000", status: "Terisi", tenant: "Dewi Lestari" },
  { id: 7, number: "203", type: "Standar", price: "Rp 1.500.000", status: "Kosong", tenant: "-" },
  { id: 8, number: "205", type: "VIP", price: "Rp 3.000.000", status: "Terisi", tenant: "Eko Prasetyo" },
];

export default function RoomTable() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#E5E3DE]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#E5E3DE] text-left text-sm">
          <thead className="bg-[#F8F7F4]">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 font-semibold text-[#1F3D35] sm:pl-6">
                No. Kamar
              </th>
              <th scope="col" className="px-3 py-3.5 font-semibold text-[#1F3D35]">
                Tipe
              </th>
              <th scope="col" className="px-3 py-3.5 font-semibold text-[#1F3D35]">
                Harga/Bulan
              </th>
              <th scope="col" className="px-3 py-3.5 font-semibold text-[#1F3D35]">
                Penghuni Saat Ini
              </th>
              <th scope="col" className="px-3 py-3.5 font-semibold text-[#1F3D35]">
                Status
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Aksi</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E3DE] bg-white">
            {rooms.map((room) => (
              <tr key={room.id} className="transition-colors hover:bg-[#F8F7F4]/50">
                <td className="whitespace-nowrap py-4 pl-4 pr-3 font-bold text-[#1F3D35] sm:pl-6">
                  {room.number}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-[#6B716D]">
                  {room.type}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-[#6B716D]">
                  {room.price}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-[#1F3D35]">
                  {room.tenant}
                </td>
                <td className="whitespace-nowrap px-3 py-4">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      room.status === "Terisi"
                        ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                        : room.status === "Kosong"
                        ? "bg-green-50 text-green-700 ring-green-600/20"
                        : "bg-amber-50 text-amber-700 ring-amber-600/20"
                    }`}
                  >
                    {room.status}
                  </span>
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <button className="text-[#99A09C] transition-colors hover:text-[#1F3D35]">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-[#E5E3DE] bg-white px-4 py-3 sm:px-6">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-[#6B716D]">
              Menampilkan <span className="font-medium text-[#1F3D35]">1</span> sampai <span className="font-medium text-[#1F3D35]">8</span> dari <span className="font-medium text-[#1F3D35]">30</span> kamar
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-[#99A09C] ring-1 ring-inset ring-[#E5E3DE] hover:bg-[#F8F7F4] focus:z-20 focus:outline-offset-0">
                <span className="sr-only">Previous</span>
                &larr;
              </button>
              <button className="relative z-10 inline-flex items-center bg-[#1F3D35] px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F3D35]">
                1
              </button>
              <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-[#1F3D35] ring-1 ring-inset ring-[#E5E3DE] hover:bg-[#F8F7F4] focus:z-20 focus:outline-offset-0">
                2
              </button>
              <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-[#1F3D35] ring-1 ring-inset ring-[#E5E3DE] hover:bg-[#F8F7F4] focus:z-20 focus:outline-offset-0">
                3
              </button>
              <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-[#99A09C] ring-1 ring-inset ring-[#E5E3DE] hover:bg-[#F8F7F4] focus:z-20 focus:outline-offset-0">
                <span className="sr-only">Next</span>
                &rarr;
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
