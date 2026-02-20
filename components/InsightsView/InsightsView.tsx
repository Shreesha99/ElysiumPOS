import React, { useEffect, useState } from "react";
import { BrainCircuit, RefreshCcw, Loader2 } from "lucide-react";
import { BusinessInsight } from "@/types";
import SectionHeader from "@/components/Components/SectionHeader";
import { toast } from "@/components/Components/Toaster";

import InsightsLoadingState from "./InsightsLoadingState";
import InsightCard from "./InsightCard";
import InsightDetailsDrawer from "./InsightDetailsDrawer";
import { translateError } from "./insights.utils";

interface InsightsViewProps {
  insights: BusinessInsight[];
  fetchAIInsights: () => void;
  isLoading?: boolean;
  error?: string | null;
}

const InsightsView: React.FC<InsightsViewProps> = ({
  insights,
  fetchAIInsights,
  isLoading,
  error,
}) => {
  const [selectedInsight, setSelectedInsight] =
    useState<BusinessInsight | null>(null);

  const [cooldown, setCooldown] = useState(false);

  const hasInsights = insights.length > 0;
  const isDormant = !hasInsights && !isLoading && !error;

  useEffect(() => {
    if (error?.includes("429")) {
      setCooldown(true);
      setTimeout(() => setCooldown(false), 5000);
    }
  }, [error]);

  useEffect(() => {
    if (error) {
      toast(translateError(error), "error");
    }
  }, [error]);

  return (
    <div className="relative h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      <SectionHeader
        icon={<BrainCircuit size={20} />}
        title="AI Strategy Hub"
        subtitle="Predictive neural synthesis engine"
        rightContent={
          hasInsights && (
            <button
              onClick={fetchAIInsights}
              disabled={isLoading || cooldown}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <RefreshCcw size={16} />
              )}
              Refresh
            </button>
          )
        }
      />

      <div className="flex-1 overflow-y-auto px-8 py-10">
        <div className="max-w-[1400px] mx-auto min-h-[500px]">
          {isLoading && <InsightsLoadingState />}

          {hasInsights && !isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {insights.map((s, i) => (
                <InsightCard
                  key={i}
                  insight={s}
                  index={i}
                  onSelect={setSelectedInsight}
                />
              ))}
            </div>
          )}

          {isDormant && (
            <div className="h-full flex flex-col items-center justify-center gap-6 text-center">
              <BrainCircuit size={48} className="text-indigo-400 opacity-40" />
              <button
                onClick={fetchAIInsights}
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-all shadow-md"
              >
                Initiate Neural Analysis
              </button>
            </div>
          )}
        </div>
      </div>

      <InsightDetailsDrawer
        insight={selectedInsight}
        onClose={() => setSelectedInsight(null)}
      />
    </div>
  );
};

export default InsightsView;
