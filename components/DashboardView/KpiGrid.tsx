import React from "react";
import { TrendingUp, ShoppingBag, BarChart3, Users } from "lucide-react";
import { Order, Table } from "@/types";

interface Props {
  stats: any;
  activeOrders: Order[];
  takeawayOrders: Order[];
  orders: Order[];
  occupancyRate: number;
  occupiedTables: number;
  tables: Table[];
}

const KpiGrid: React.FC<Props> = ({
  stats,
  activeOrders,
  takeawayOrders,
  orders,
  occupancyRate,
  occupiedTables,
  tables,
}) => {
  const kpis = [
    {
      label: "Settled Revenue",
      value: `₹${stats.totalRevenue?.toLocaleString() || 0}`,
      icon: TrendingUp,
      color: "text-emerald-500",
      trend: `${stats.revenueGrowth || 0}%`,
    },
    {
      label: "Active Orders",
      value: activeOrders.length.toString(),
      icon: ShoppingBag,
      color: "text-amber-500",
      trend: activeOrders.length > 0 ? "Live" : "Idle",
    },
    {
      label: "Takeaway Orders",
      value: takeawayOrders.length.toString(),
      icon: ShoppingBag,
      color: "text-indigo-500",
      trend:
        orders.length > 0
          ? `${Math.round((takeawayOrders.length / orders.length) * 100)}%`
          : "0%",
    },
    {
      label: "Avg Order Value",
      value: `₹${stats.avgOrderValue?.toFixed(0) || 0}`,
      icon: BarChart3,
      color: "text-indigo-500",
      trend: `${stats.aovGrowth || 0}%`,
    },
    {
      label: "Floor Occupancy",
      value: `${occupancyRate.toFixed(1)}%`,
      icon: Users,
      color: "text-rose-500",
      trend: `${occupiedTables}/${tables.length}`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {kpis.map((s, i) => (
        <div
          key={i}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <s.icon size={22} className={s.color} />
            <span className={`text-xs font-medium ${s.color}`}>{s.trend}</span>
          </div>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">{s.label}</p>

          <h2 className="text-2xl font-semibold mt-1 dark:text-white">
            {s.value}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default KpiGrid;
