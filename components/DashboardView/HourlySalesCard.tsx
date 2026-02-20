import React from "react";
import { motion } from "framer-motion";

interface Props {
  hourlySales: any[];
  maxHourlyValue: number;
}

const HourlySalesCard: React.FC<Props> = ({ hourlySales, maxHourlyValue }) => {
  return (
    <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 sm:p-8 shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-semibold dark:text-white">Hourly Sales</h3>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex items-end gap-4 min-w-max min-h-[180px] sm:min-h-[220px] px-2">
          {hourlySales?.map((h: any, i: number) => (
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
  );
};

export default HourlySalesCard;
