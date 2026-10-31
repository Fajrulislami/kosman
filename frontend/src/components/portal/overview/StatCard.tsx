import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  href?: string;
  badge?: {
    text: string;
    variant?: "green" | "amber" | "red" | "neutral";
  };
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export default function StatCard({ title, value, subtitle, icon: Icon, href, badge, trend }: StatCardProps) {
  const badgeClasses = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-600 border-red-200",
    neutral: "bg-[#F8F7F4] text-[#6B716D] border-[#E5E3DE]",
  };

  const content = (
    <div className="bg-white rounded-3xl p-5 border border-[#E5E3DE] shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.07)] hover:border-[#C69C6D]/40 group h-full flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B716D] truncate">{title}</h3>
            {badge && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeClasses[badge.variant || "neutral"]}`}>
                {badge.text}
              </span>
            )}
          </div>
          <p className="text-xl sm:text-2xl font-black text-[#202321] mt-1.5 tracking-tight truncate group-hover:text-[#1F3D35] transition-colors">
            {value}
          </p>
          
          {subtitle && (
            <p className="text-xs text-[#6B716D] mt-1 truncate">{subtitle}</p>
          )}

          {trend && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className={`text-xs font-semibold ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                {trend.value}
              </span>
            </div>
          )}
        </div>
        <div className="w-10 h-10 shrink-0 bg-[#F8F7F4] rounded-2xl flex items-center justify-center text-[#1F3D35] group-hover:bg-[#1F3D35] group-hover:text-white transition-all shadow-sm">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block cursor-pointer">
        {content}
      </Link>
    );
  }

  return content;
}
