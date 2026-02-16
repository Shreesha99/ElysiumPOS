import React from "react";
import SortDropdown from "@/components/POSView/SortDropdown";
import { Category } from "@/types";

interface Props {
  CATEGORIES: Category[];
  activeCategory: Category;
  setActiveCategory: (cat: Category) => void;

  sortBy: "name" | "valueHigh" | "valueLow";
  setSortBy: (val: "name" | "valueHigh" | "valueLow") => void;

  resultCount: number;
}

const InventoryFiltersBar: React.FC<Props> = ({
  CATEGORIES,
  activeCategory,
  setActiveCategory,
  sortBy,
  setSortBy,
  resultCount,
}) => {
  return (
    <div className="space-y-4">
      {/* CATEGORY — EXACT SAME BUTTON STYLE */}
      <div className="flex gap-2 overflow-x-auto">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm border whitespace-nowrap ${
              activeCategory === cat
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* SORT — reuse same dropdown */}
      <SortDropdown
        sortBy={sortBy as any}
        setSortBy={setSortBy as any}
        count={resultCount}
      />
    </div>
  );
};

export default InventoryFiltersBar;
