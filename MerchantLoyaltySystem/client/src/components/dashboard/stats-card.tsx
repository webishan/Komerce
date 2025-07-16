import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative";
  icon: LucideIcon;
  iconColor: string;
  loading?: boolean;
}

export default function StatsCard({
  title,
  value,
  change,
  changeType = "positive",
  icon: Icon,
  iconColor,
  loading = false,
}: StatsCardProps) {
  if (loading) {
    return (
      <div className="stats-card hover-scale p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="stats-card hover-scale p-6 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 flex items-center ${
              changeType === "positive" ? "text-komarce-emerald" : "text-red-500"
            }`}>
              {changeType === "positive" ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {change}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColor}`}>
          <Icon className="text-white w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
