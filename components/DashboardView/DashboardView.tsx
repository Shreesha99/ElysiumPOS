import React, { useMemo } from "react";
import { BarChart3, Activity, Sparkles } from "lucide-react";
import { Order, Table, BusinessInsight, MenuItem } from "@/types";
import SectionHeader from "@/components/Components/SectionHeader";

import KpiGrid from "./KpiGrid";
import HourlySalesCard from "./HourlySalesCard";
import MenuPopularityCard from "./MenuPopularityCard";
import FloorStatusCard from "./FloorStatusCard";
import AIStrategyCard from "./AIStrategyCard";

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
    () =>
      orders.filter(
        (o) =>
          o.status === "Pending" ||
          o.status === "Preparing" ||
          o.status === "Served"
      ),
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
        defaultExpanded
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

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-10 space-y-12">
          <KpiGrid
            stats={stats}
            activeOrders={activeOrders}
            takeawayOrders={takeawayOrders}
            orders={orders}
            occupancyRate={occupancyRate}
            occupiedTables={occupiedTables}
            tables={tables}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <HourlySalesCard
              hourlySales={stats.hourlySales}
              maxHourlyValue={maxHourlyValue}
            />
            <MenuPopularityCard menuPopularity={menuPopularity} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pb-10">
            <FloorStatusCard tables={tables} setActiveTab={setActiveTab} />
            <AIStrategyCard insights={insights} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
