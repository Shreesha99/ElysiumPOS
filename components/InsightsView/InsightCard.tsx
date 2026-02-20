import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { BusinessInsight } from "@/types";
import { getTrendIcon, getImpactColor } from "./insights.utils";

interface Props {
  insight: BusinessInsight;
  index: number;
  onSelect: (insight: BusinessInsight) => void;
}

const InsightCard: React.FC<Props> = ({ insight, index, onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10 transition flex flex-col"
    >
      <div className="flex justify-between items-start mb-4">
        <span
          className={`px-2.5 py-1 rounded-md text-xs font-medium ${getImpactColor(
            insight.impact
          )}`}
        >
          {insight.impact}
        </span>

        {getTrendIcon(insight.trend)}
      </div>

      <h3 className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
        {insight.title}
      </h3>

      <h2 className="text-2xl font-semibold mb-3">{insight.value}</h2>

      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 flex-1">
        {insight.description}
      </p>

      <button
        onClick={() => onSelect(insight)}
        className="flex items-center gap-1 text-indigo-400 text-sm font-medium hover:gap-2 transition"
      >
        View details <ArrowUpRight size={14} />
      </button>
    </motion.div>
  );
};

export default InsightCard;
