import React from "react";
import { motion } from "framer-motion";

interface Props {
  foodFilter: "All" | "Veg" | "NonVeg" | "Egg";
  setFoodFilter: (val: any) => void;
  filterCounts: Record<string, number>;
}

const DietaryFilterRow: React.FC<Props> = ({
  foodFilter,
  setFoodFilter,
  filterCounts,
}) => {
  const types = [
    { label: "All", dot: "bg-zinc-400" },
    { label: "Veg", dot: "bg-emerald-500" },
    { label: "NonVeg", dot: "bg-rose-500" },
    { label: "Egg", dot: "bg-amber-500" },
  ];

  return (
    <div className="sticky top-[148px] z-30 bg-white dark:bg-zinc-900 py-4 border-b border-zinc-100 dark:border-zinc-800">
      <div className="flex items-center gap-3 overflow-x-auto">
        {types.map((type) => {
          const isActive = foodFilter === type.label;

          return (
            <motion.button
              key={type.label}
              layout
              whileTap={{ scale: 0.95 }}
              onClick={() => setFoodFilter(type.label)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                isActive
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-transparent hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${type.dot}`} />
              {type.label}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-white/20" : "bg-zinc-200 dark:bg-zinc-700"
                }`}
              >
                {filterCounts[type.label]}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default DietaryFilterRow;
