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
    { label: "All", type: "All" },
    { label: "Veg", type: "Veg" },
    { label: "NonVeg", type: "NonVeg" },
    { label: "Egg", type: "Egg" },
  ];

  const DietaryIcon = ({ type }: { type: string }) => {
    if (type === "Veg") {
      return (
        <div className="w-4 h-4 border-2 border-emerald-600 flex items-center justify-center">
          <div className="w-2 h-2 bg-emerald-600 rounded-full" />
        </div>
      );
    }

    if (type === "NonVeg") {
      return (
        <div className="w-4 h-4 border-2 border-rose-600 flex items-center justify-center">
          <div className="w-2 h-2 bg-rose-600 rounded-full" />
        </div>
      );
    }

    if (type === "Egg") {
      return (
        <div className="w-4 h-4 border-2 border-amber-500 flex items-center justify-center">
          <div className="w-2 h-2 bg-amber-500 rounded-full" />
        </div>
      );
    }

    return (
      <div className="w-4 h-4 border-2 border-zinc-400 flex items-center justify-center">
        <div className="w-2 h-2 bg-zinc-400 rounded-full" />
      </div>
    );
  };

  return (
    <div className="sticky top-[148px] z-30 bg-white dark:bg-zinc-900 py-4 border-b border-zinc-100 dark:border-zinc-800">
      <div className="flex items-center gap-3 overflow-x-auto">
        {types.map((item) => {
          const isActive = foodFilter === item.type;

          return (
            <motion.button
              key={item.type}
              layout
              whileTap={{ scale: 0.95 }}
              onClick={() => setFoodFilter(item.type as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                isActive
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-transparent hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              <DietaryIcon type={item.type} />

              {item.label}

              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-white/20" : "bg-zinc-200 dark:bg-zinc-700"
                }`}
              >
                {filterCounts[item.type]}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default DietaryFilterRow;
