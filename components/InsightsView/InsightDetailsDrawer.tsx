import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { BusinessInsight } from "@/types";
import { getTrendIcon, getImpactColor } from "./insights.utils";

interface Props {
  insight: BusinessInsight | null;
  onClose: () => void;
}

const InsightDetailsDrawer: React.FC<Props> = ({ insight, onClose }) => {
  return (
    <AnimatePresence>
      {insight && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[520px] bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 z-50 shadow-2xl flex flex-col"
          >
            <div className="px-8 py-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">
                  Strategic Insight Analysis
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  AI Generated Intelligence Layer
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10">
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-medium ${getImpactColor(
                      insight.impact
                    )}`}
                  >
                    {insight.impact} Impact
                  </span>

                  {getTrendIcon(insight.trend)}
                </div>

                <h3 className="text-2xl font-semibold">{insight.title}</h3>

                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {insight.value}
                </div>
              </section>

              <section className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Interpretation
                </h4>

                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {insight.description}
                </p>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InsightDetailsDrawer;
