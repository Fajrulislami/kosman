"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DashboardOverview } from "@/types/admin";

interface RevenueChartProps {
  chartData?: DashboardOverview["chartData"];
}

const defaultData = [
  { month: "Jan", pendapatan: 0, fullAmount: 0 },
  { month: "Feb", pendapatan: 0, fullAmount: 0 },
  { month: "Mar", pendapatan: 0, fullAmount: 0 },
  { month: "Apr", pendapatan: 0, fullAmount: 0 },
  { month: "Mei", pendapatan: 0, fullAmount: 0 },
  { month: "Jun", pendapatan: 0, fullAmount: 0 },
];

const formatIDR = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function RevenueChart({ chartData }: RevenueChartProps) {
  const data = chartData && chartData.length > 0 ? chartData : defaultData;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#E5E3DE]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#1F3D35]">Tren Pendapatan (6 Bulan Terakhir)</h2>
          <p className="text-xs text-[#6B716D]">Akumulasi pembayaran sewa yang telah terverifikasi lunas</p>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1F3D35" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1F3D35" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E3DE" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B716D", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B716D", fontSize: 12 }}
              tickFormatter={(value) => `Rp ${value}Jt`}
              dx={-10}
            />
            <Tooltip
              contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              formatter={(value: any, name: any, item: any) => [
                formatIDR(item.payload.fullAmount ?? (Number(value) * 1000000)),
                "Pendapatan Lunas",
              ]}
              labelStyle={{ color: "#1F3D35", fontWeight: "bold", marginBottom: "4px" }}
            />
            <Area
              type="monotone"
              dataKey="pendapatan"
              stroke="#1F3D35"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTotal)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
