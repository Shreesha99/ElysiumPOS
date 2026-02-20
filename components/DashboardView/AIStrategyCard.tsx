import React from "react";
import { Sparkles, Zap } from "lucide-react";
import { BusinessInsight } from "@/types";

interface Props {
  insights: BusinessInsight[];
}

const AIStrategyCard: React.FC<Props> = ({ insights }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 sm:p-8 shadow-sm flex flex-col">
      <h3 className="text-lg font-semibold dark:text-white mb-6">
        AI Strategy Feed
      </h3>

      <div className="space-y-4 flex-1 overflow-y-auto">
        {insights.length > 0 ? (
          insights.map((s, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-600/10 text-indigo-600 flex items-center justify-center shrink-0">
                <Zap size={18} />
              </div>
              <div>
                <p className="text-xs text-zinc-400 uppercase tracking-wide">
                  {s.title}
                </p>
                <h4 className="text-sm font-semibold dark:text-white mt-1">
                  {s.value}
                </h4>
                <p className="text-sm text-zinc-500 mt-1">{s.description}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-zinc-400">
            <Sparkles size={40} className="animate-pulse" />
            <p className="text-sm max-w-[240px]">
              Neural insights are generating.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIStrategyCard;
