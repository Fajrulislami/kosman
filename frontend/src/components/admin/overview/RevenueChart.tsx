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

const data = [
  { name: "Jan", total: 28000000 },
  { name: "Feb", total: 30000000 },
  { name: "Mar", total: 29000000 },
  { name: "Apr", total: 31500000 },
  { name: "Mei", total: 32000000 },
  { name: "Jun", total: 34000000 },
  { name: "Jul", total: 32500000 },
];

const formatIDR = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function RevenueChart() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#E5E3DE]">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#1F3D35]">Tren Pendapatan</h2>
        <select className="rounded-lg border-0 bg-[#F8F7F4] py-1.5 pl-3 pr-8 text-sm font-medium text-[#6B716D] focus:ring-2 focus:ring-[#C69C6D]">
          <option>Tahun Ini</option>
          <option>Tahun Lalu</option>
        </select>
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
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B716D", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B716D", fontSize: 12 }}
              tickFormatter={(value) => `Rp ${value / 1000000}Jt`}
              dx={-10}
            />
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              formatter={(value: any) => [formatIDR(value as number), "Pendapatan"]}
              labelStyle={{ color: "#1F3D35", fontWeight: "bold", marginBottom: "4px" }}
            />
            <Area
              type="monotone"
              dataKey="total"
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
