import React from "react";
import DietaryFilterRow from "@/components/POSView/DietaryFilterRow";
import SortDropdown from "@/components/POSView/SortDropdown";
import { Category } from "@/types";

interface Props {
  CATEGORIES: Category[];
  activeCategory: Category;
  setActiveCategory: (cat: Category) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;

  foodFilter: "All" | "Veg" | "NonVeg" | "Egg";
  setFoodFilter: (val: "All" | "Veg" | "NonVeg" | "Egg") => void;
  filterCounts: {
    All: number;
    Veg: number;
    NonVeg: number;
    Egg: number;
  };

  sortBy: "relevance" | "priceLow" | "priceHigh" | "name";
  setSortBy: (val: "relevance" | "priceLow" | "priceHigh" | "name") => void;
  resultCount: number;

  isSubmittingOrder: boolean;
}

const MenuFiltersBar: React.FC<Props> = ({
  CATEGORIES,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  foodFilter,
  setFoodFilter,
  filterCounts,
  sortBy,
  setSortBy,
  resultCount,
  isSubmittingOrder,
}) => {
  return (
    <div className="space-y-4">
      {/* CATEGORY */}
      <div className="flex gap-2 overflow-x-auto">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            disabled={isSubmittingOrder}
            onClick={() => {
              setActiveCategory(cat);
              setSearchQuery("");
            }}
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

      {/* DIETARY */}
      <DietaryFilterRow
        foodFilter={foodFilter}
        setFoodFilter={setFoodFilter}
        filterCounts={filterCounts}
      />

      {/* SORT */}
      <SortDropdown sortBy={sortBy} setSortBy={setSortBy} count={resultCount} />
    </div>
  );
};

export default MenuFiltersBar;
