import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import MenuCard from "@/components/MenuCard";
import { MenuItem } from "@/types";
import EmptyState from "../ui/EmptyState";

interface Props {
  items: MenuItem[];
  searchQuery: string;
  activeCategory: string;
  foodFilter: "All" | "Veg" | "NonVeg" | "Egg";
  onAddToCart: (item: MenuItem) => void;
}

const MenuGridSection: React.FC<Props> = ({
  items,
  searchQuery,
  activeCategory = "Menu",
  foodFilter = "All",
  onAddToCart,
}) => {
  const trimmedQuery = searchQuery.trim();
  const isSearching = trimmedQuery !== "";

  let emptyTitle = "";
  const safeCategory = activeCategory ?? "this category";
  const safeFoodFilter = foodFilter ?? "All";
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
    <div className="w-full">
      <AnimatePresence mode="wait">
        {items.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
          >
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                >
                  <MenuCard item={item} onAddToCart={onAddToCart} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <EmptyState
            icon={Search}
            title={emptyTitle}
            description={
              !isSearching
                ? "Adjust filters or register new assets."
                : undefined
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuGridSection;
