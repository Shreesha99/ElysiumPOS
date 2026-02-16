import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  BarChart3,
  Activity,
  Sparkles,
  Database,
  Zap,
} from "lucide-react";
import { Order, Table, BusinessInsight, MenuItem } from "../types";
import SectionHeader from "./ui/SectionHeader";

interface DashboardViewProps {
  stats: any;
  liveTraffic: number;
  insights: BusinessInsight[];
  fetchAIInsights: () => void;
  tables: Table[];
  orders: Order[];
  menuItems: MenuItem[];
  setActiveTab: (tab: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  liveTraffic,
  insights,
  fetchAIInsights,
  tables,
  orders,
  menuItems,
  setActiveTab,
}) => {
  /* ---------------- DERIVED METRICS ---------------- */

  const activeOrders = useMemo(
    () => orders.filter((o) => o.status !== "Paid"),
    [orders]
  );

  const takeawayOrders = useMemo(
    () => orders.filter((o) => o.orderType === "Takeaway"),
    [orders]
  );

  const diningOrders = useMemo(
    () => orders.filter((o) => o.orderType === "Dining"),
    [orders]
  );

  const occupiedTables = useMemo(
    () => tables.filter((t) => t.status === "Occupied").length,
    [tables]
  );

  const occupancyRate =
    tables.length > 0 ? (occupiedTables / tables.length) * 100 : 0;

  const maxHourlyValue = useMemo(() => {
    if (!stats.hourlySales || stats.hourlySales.length === 0) return 1;
    return Math.max(...stats.hourlySales.map((h: any) => h.value), 1);
  }, [stats.hourlySales]);

  /* ----------- REAL MENU POPULARITY (NO RANDOM) ----------- */

  const menuPopularity = useMemo(() => {
    const countMap: Record<string, number> = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        countMap[item.name] = (countMap[item.name] || 0) + item.quantity;
      });
    });

    const max = Math.max(...Object.values(countMap), 1);

    return menuItems
      .map((item) => ({
        name: item.name,
        percentage: Math.round(((countMap[item.name] || 0) / max) * 100),
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 4);
  }, [orders, menuItems]);

  return (
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      <SectionHeader
        icon={<BarChart3 size={22} />}
        title="Overview"
        defaultExpanded={true}
        subtitle="Real time operational analytics and floor performance"
        rightContent={
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="text-right">
              <p className="text-xs text-zinc-400 uppercase tracking-wide">
                Live Orders
              </p>
              <p className="text-lg font-semibold text-emerald-500 flex items-center gap-2 justify-end">
                <Activity size={16} />
                {activeOrders.length} Active
              </p>
            </div>

            <button
              onClick={fetchAIInsights}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition flex items-center gap-2"
            >
              <Sparkles size={16} />
              Refresh Strategy
            </button>
          </div>
        }
        sticky
      />

      {/* BODY SCROLL AREA */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-10 space-y-12">
          {/* KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
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
                    ? `${Math.round(
                        (takeawayOrders.length / orders.length) * 100
                      )}%`
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
            ].map((s, i) => (
              <div
                key={i}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <s.icon size={22} className={s.color} />
                  <span className={`text-xs font-medium ${s.color}`}>
                    {s.trend}
                  </span>
                </div>

                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {s.label}
                </p>

                <h2 className="text-2xl font-semibold mt-1 dark:text-white">
                  {s.value}
                </h2>
              </div>
            ))}
          </div>

          {/* SALES + POPULARITY */}
          <div className="grid grid grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-5 sm:p-8 gap-6 sm:gap-5 sm:p-8 gap-5 sm:p-8">
            {/* HOURLY SALES */}
            <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 sm:p-8 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-semibold dark:text-white">
                  Hourly Sales
                </h3>
              </div>

              <div className="flex-1 overflow-x-auto">
                <div className="flex items-end gap-4 min-w-max min-h-[180px] sm:min-h-[220px] px-2">
                  {stats.hourlySales?.map((h: any, i: number) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-2 w-14 shrink-0"
                    >
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{
                          height: `${(h.value / maxHourlyValue) * 100}%`,
                        }}
                        className="w-8 bg-indigo-500 rounded-t-md"
                      />
                      <span className="text-xs text-zinc-400 truncate w-full text-center">
                        {h.hour}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ASSET POPULARITY */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 sm:p-8 shadow-sm flex flex-col">
              <h3 className="text-lg font-semibold dark:text-white mb-6">
                Asset Popularity
              </h3>

              <div className="flex-1 space-y-6">
                {menuPopularity.length > 0 ? (
                  menuPopularity.map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm text-zinc-500 dark:text-zinc-400">
                        <span>{item.name}</span>
                        <span className="text-indigo-600 font-medium">
                          {item.percentage}%
                        </span>
                      </div>

                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        className="h-2 bg-indigo-600 rounded-full"
                      />
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-zinc-400">
                    <Database size={36} />
                    <p className="text-sm">No asset activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* FLOOR + AI */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:p-8 pb-10">
            {/* FLOOR STATUS */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 sm:p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold dark:text-white">
                  Active Floor Sessions
                </h3>
                <button
                  onClick={() => setActiveTab("tables")}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  View Map
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {tables.map((t) => (
                  <div
                    key={t.id}
                    className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition ${
                      t.status === "Occupied"
                        ? "bg-indigo-600 text-white"
                        : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    T{t.number}
                  </div>
                ))}
              </div>
            </div>

            {/* AI STRATEGY */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 sm:p-8 shadow-sm flex flex-col">
              <h3 className="text-lg font-semibold dark:text-white mb-6">
                AI Strategy Feed
              </h3>

              <div
                className="space-y-4 flex-1 overflow-y-auto flex-1 overflow-y-auto
"
              >
                {insights.length > 0 ? (
                  insights.map((s, i) => (
                    <div
                      key={i}
                      className="flex gap-4 p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                    >
                      <div className="w-10 h-10 rounded-lg bg-indigo-600/10 text-indigo-600 flex items-center justify-center shrink-0">
                        <Zap size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400 uppercase tracking-wide">
                          {s.title}
                        </p>
                        <h4 className="text-sm font-semibold dark:text-white mt-1">
                          {s.value}
                        </h4>
                        <p className="text-sm text-zinc-500 mt-1">
                          {s.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-zinc-400">
                    <Sparkles size={40} className="animate-pulse" />
                    <p className="text-sm max-w-[240px]">
                      Neural insights are generating.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
