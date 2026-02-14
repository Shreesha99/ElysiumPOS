import React from "react";
import { Category } from "@/types";
import { Plus, Search, AlertCircle } from "lucide-react";

interface Props {
  stats: {
    totalValue: number;
    totalItems: number;
    lowStockCount: number;
  };
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  activeCategory: Category | "All";
  setActiveCategory: React.Dispatch<React.SetStateAction<Category | "All">>;
  CATEGORIES: Category[];
  openAddForm: () => void;
}

const InventoryHeader: React.FC<Props> = ({
  stats,
  search,
  setSearch,
  activeCategory,
  setActiveCategory,
  CATEGORIES,
  openAddForm,
}) => {
  return (
    <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-40">
      <div className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
        {/* Top Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Title Section */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight dark:text-white">
              Asset Registry
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Manage and monitor inventory assets
            </p>
          </div>

          {/* Stats + CTA */}
          <div className="flex items-center gap-6 flex-wrap">
            {/* Stats */}
            <div className="hidden md:flex items-center gap-8 text-sm">
              <div>
                <p className="text-zinc-500">Inventory Value</p>
                <p className="font-semibold dark:text-white">
                  ₹{stats.totalValue.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-zinc-500">Active Items</p>
                <p className="font-semibold dark:text-white">
                  {stats.totalItems}
                </p>
              </div>

              {stats.lowStockCount > 0 && (
                <div className="flex items-center gap-2 text-rose-500">
                  <AlertCircle size={16} />
                  <span className="font-semibold">
                    {stats.lowStockCount} low stock
                  </span>
                </div>
              )}
            </div>

            {/* Add Button */}
            <button
              onClick={openAddForm}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
            >
              <Plus size={16} />
              New Asset
            </button>
          </div>
        </div>

        {/* Search + Categories */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {["All", ...CATEGORIES].map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as Category | "All")}
                  className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition ${
                    active
                      ? "bg-indigo-600 text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default InventoryHeader;
