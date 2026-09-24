import { CheckCircle2, AlertTriangle, Clock, Info } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "payment",
    content: "Budi Santoso (Kamar 102) telah membayar tagihan bulan Juli.",
    time: "2 jam yang lalu",
    icon: CheckCircle2,
    iconColor: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    id: 2,
    type: "complaint",
    content: "Komplain baru: AC Kamar 205 kurang dingin.",
    time: "5 jam yang lalu",
    icon: AlertTriangle,
    iconColor: "text-amber-500",
    bgColor: "bg-amber-50",
  },
  {
    id: 3,
    type: "system",
    content: "Sistem berhasil mengirimkan invoice otomatis ke 24 penghuni.",
    time: "Kemarin",
    icon: Info,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    id: 4,
    type: "pending",
    content: "Siti Aminah (Kamar 105) terlambat membayar tagihan 3 hari.",
    time: "Kemarin",
    icon: Clock,
    iconColor: "text-[#E54D2E]",
    bgColor: "bg-[#FCECE9]",
  },
];

export default function RecentActivity() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#E5E3DE]">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#1F3D35]">Aktivitas Terbaru</h2>
        <button className="text-sm font-semibold text-[#C69C6D] hover:text-[#A88258]">
          Lihat Semua
        </button>
      </div>

      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {activities.map((activity, activityIdx) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {activityIdx !== activities.length - 1 ? (
                  <span
                    className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-[#E5E3DE]"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ring-8 ring-white ${activity.bgColor}`}
                    >
                      <activity.icon className={`h-5 w-5 ${activity.iconColor}`} aria-hidden="true" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 py-1.5">
                    <div className="text-sm text-[#6B716D]">
                      <span className="font-medium text-[#1F3D35]">
                        {activity.content}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-[#99A09C]">
                      {activity.time}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
