import React from "react";
import { motion } from "framer-motion";
import { Database } from "lucide-react";

interface Props {
  menuPopularity: {
    name: string;
    percentage: number;
  }[];
}

const MenuPopularityCard: React.FC<Props> = ({ menuPopularity }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 sm:p-8 shadow-sm flex flex-col">
      <h3 className="text-lg font-semibold dark:text-white mb-6">
        Asset Popularity
      </h3>

      <div className="flex-1 space-y-6">
        {menuPopularity.length > 0 ? (
          menuPopularity.map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-sm text-zinc-500 dark:text-zinc-400">
                <span>{item.name}</span>
                <span className="text-indigo-600 font-medium">
                  {item.percentage}%
                </span>
              </div>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                className="h-2 bg-indigo-600 rounded-full"
              />
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-zinc-400">
            <Database size={36} />
            <p className="text-sm">No asset activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPopularityCard;
