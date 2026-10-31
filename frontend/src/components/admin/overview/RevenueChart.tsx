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

// Formatter sumbu Y adaptif: Rp 0, Rp 500 Rb, Rp 1,5 Jt, Rp 10 Jt
const formatYAxis = (value: number) => {
  if (value === 0) return "Rp 0";
  if (value >= 1) {
    const formatted = Number(value.toFixed(1)).toString().replace(".", ",");
    return `Rp ${formatted} Jt`;
  }
  const thousands = Math.round(value * 1000);
  return `Rp ${thousands} Rb`;
};

export default function RevenueChart({ chartData }: RevenueChartProps) {
  const data = chartData && chartData.length > 0 ? chartData : defaultData;
  const totalPeriod = data.reduce((acc, curr) => acc + (curr.fullAmount || 0), 0);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#E5E3DE]">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#1F3D35]">Tren Pendapatan (6 Bulan Terakhir)</h2>
          <p className="text-xs text-[#6B716D]">Akumulasi pembayaran sewa yang telah terverifikasi lunas</p>
        </div>

        <div className="flex items-center gap-2 bg-[#F8F7F4] border border-[#E5E3DE] px-3.5 py-1.5 rounded-xl self-start sm:self-auto shadow-2xs">
          <span className="text-[11px] font-semibold text-[#6B716D]">Total 6 Bulan:</span>
          <span className="text-xs font-black text-[#1F3D35]">{formatIDR(totalPeriod)}</span>
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
              tick={{ fill: "#6B716D", fontSize: 11 }}
              tickFormatter={formatYAxis}
              dx={-8}
            />
            <Tooltip
              contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              formatter={(value: any, name: any, item: any) => [
                formatIDR(item?.payload?.fullAmount ?? (Number(value || 0) * 1000000)),
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
