"use client";

import { DoorClosed, CheckCircle2, DoorOpen, Wrench } from "lucide-react";

const roomStats = [
  { name: "Total Kamar", value: "30", icon: DoorClosed, color: "text-[#1F3D35] bg-[#F8F7F4]" },
  { name: "Terisi", value: "24", icon: CheckCircle2, color: "text-blue-600 bg-blue-50" },
  { name: "Kosong", value: "4", icon: DoorOpen, color: "text-green-600 bg-green-50" },
  { name: "Perbaikan", value: "2", icon: Wrench, color: "text-amber-600 bg-amber-50" },
];

export default function RoomStats() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {roomStats.map((stat) => (
        <div
          key={stat.name}
          className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#E5E3DE]"
        >
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
            <stat.icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#6B716D]">{stat.name}</p>
            <p className="text-2xl font-bold text-[#1F3D35]">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
