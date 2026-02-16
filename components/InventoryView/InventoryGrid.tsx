import React from "react";
import { MenuItem } from "@/types";
import InventoryCard from "@/components/InventoryView/InventoryCard";
import { AnimatePresence } from "framer-motion";
import EmptyState from "@/components/ui/EmptyState";
import { Search } from "lucide-react";

interface Props {
  items: MenuItem[];
  searchQuery: string;
  activeCategory: string;
  foodFilter: "All" | "Veg" | "NonVeg" | "Egg";
  openEditForm: (item: MenuItem) => void;
  handleDeleteDish: (id: string) => void;
  handleUpdateDish: (id: string, updates: Partial<MenuItem>) => void;
}

const InventoryGrid: React.FC<Props> = ({
  items,
  searchQuery,
  activeCategory,
  foodFilter,
  openEditForm,
  handleDeleteDish,
  handleUpdateDish,
}) => {
  const trimmedQuery = searchQuery.trim();
  const isSearching = trimmedQuery !== "";

  const safeCategory = activeCategory ?? "Inventory";
  const safeFoodFilter = foodFilter ?? "All";

  let emptyTitle = "";

  if (isSearching && safeFoodFilter !== "All") {
    emptyTitle = `No ${safeFoodFilter} results for "${trimmedQuery}" in ${safeCategory}`;
  } else if (isSearching) {
    emptyTitle = `No results for "${trimmedQuery}"`;
  } else if (safeFoodFilter !== "All") {
    emptyTitle = `No ${safeFoodFilter} items in ${safeCategory}`;
  } else {
    emptyTitle = `No items in ${safeCategory}`;
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-10 no-scrollbar pb-40 lg:pb-10">
      <div className="max-w-[1600px] mx-auto">
        {items.length > 0 ? (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
              {items.map((item) => (
                <InventoryCard
                  key={item.id}
                  item={item}
                  openEditForm={openEditForm}
                  handleDeleteDish={handleDeleteDish}
                  handleUpdateDish={handleUpdateDish}
                />
              ))}
            </div>
          </AnimatePresence>
        ) : (
          <EmptyState
            icon={Search}
            title={emptyTitle}
            description={
              !isSearching
                ? "Adjust filters or register a new dish."
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
};

export default InventoryGrid;
