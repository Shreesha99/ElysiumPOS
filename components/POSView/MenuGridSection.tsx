import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import MenuCard from "../MenuCard";
import { MenuItem } from "../../types";

interface Props {
  items: MenuItem[];
  searchQuery: string;
  onAddToCart: (item: MenuItem) => void;
}

const MenuGridSection: React.FC<Props> = ({
  items,
  searchQuery,
  onAddToCart,
}) => {
  const isSearching = searchQuery.trim() !== "";

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {items.length > 0 ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
          >
            {items.map((item) => (
              <MenuCard key={item.id} item={item} onAddToCart={onAddToCart} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="h-[400px] flex flex-col items-center justify-center text-center px-6"
          >
            <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <Search size={28} className="text-zinc-400" />
            </div>

            {isSearching ? (
              <>
                <p className="text-sm font-semibold mt-6 dark:text-white">
                  No results found for
                </p>
                <p className="text-sm font-medium text-indigo-600 mt-1">
                  "{searchQuery}"
                </p>
                <p className="text-xs text-zinc-400 mt-3 max-w-[260px]">
                  Try a different keyword or adjust your filters.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold mt-6 dark:text-white">
                  No items available
                </p>
                <p className="text-xs text-zinc-400 mt-2">
                  This category currently has no menu items.
                </p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuGridSection;
