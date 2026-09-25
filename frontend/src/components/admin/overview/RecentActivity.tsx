"use client";

import { CheckCircle2, AlertTriangle, Info, Clock } from "lucide-react";
import { DashboardOverview } from "@/types/admin";

interface RecentActivityProps {
  recentActivities?: DashboardOverview["recentActivities"];
}

export default function RecentActivity({ recentActivities }: RecentActivityProps) {
  const payments = recentActivities?.payments || [];
  const complaints = recentActivities?.complaints || [];

  const combinedActivities = [
    ...payments.map((p: any) => ({
      id: `pay-${p.id}`,
      type: "payment",
      content: `${p.invoice?.lease?.tenant?.fullName || "Penghuni"} (Kamar ${p.invoice?.lease?.room?.roomNumber || "-"}) membayar Rp ${p.amount?.toLocaleString("id-ID")}`,
      time: p.createdAt ? p.createdAt.split("T")[0] : "-",
      icon: CheckCircle2,
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
    })),
    ...complaints.map((c: any) => ({
      id: `comp-${c.id}`,
      type: "complaint",
      content: `Komplain Kamar ${c.room?.roomNumber || "-"}: ${c.title}`,
      time: c.createdAt ? c.createdAt.split("T")[0] : "-",
      icon: AlertTriangle,
      iconColor: "text-amber-500",
      bgColor: "bg-amber-50",
    })),
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#E5E3DE]">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#1F3D35]">Aktivitas Terbaru</h2>
        <span className="text-xs font-semibold text-[#6B716D]">Real-time Event</span>
      </div>

      <div className="flow-root">
        {combinedActivities.length === 0 ? (
          <div className="py-8 text-center text-sm text-[#99A09C]">
            <Clock className="mx-auto h-8 w-8 mb-2 opacity-40" />
            <p>Belum ada aktivitas transaksi atau komplain baru</p>
          </div>
        ) : (
          <ul role="list" className="-mb-8">
            {combinedActivities.slice(0, 5).map((activity, activityIdx) => (
              <li key={activity.id}>
                <div className="relative pb-6">
                  {activityIdx !== Math.min(combinedActivities.length - 1, 4) ? (
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
                    <div className="min-w-0 flex-1 py-1">
                      <div className="text-sm text-[#6B716D]">
                        <span className="font-semibold text-[#1F3D35]">
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
        )}
      </div>
    </div>
  );
}
