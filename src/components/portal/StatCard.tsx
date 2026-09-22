import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export default function StatCard({ title, value, subtitle, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E5E3DE] shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-[#6B716D] mb-1">{title}</h3>
          <p className="text-3xl font-bold text-[#202321]">{value}</p>
          
          {subtitle && (
            <p className="text-sm text-[#6B716D] mt-2">{subtitle}</p>
          )}

          {trend && (
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-sm font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                {trend.value}
              </span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-[#F8F7F4] rounded-xl flex items-center justify-center text-[#1F3D35]">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
