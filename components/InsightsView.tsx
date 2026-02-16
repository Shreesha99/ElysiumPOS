import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCcw,
  Loader2,
  ArrowUpRight,
  X,
} from "lucide-react";
import { BusinessInsight } from "@/types";
import SectionHeader from "@/components/ui/SectionHeader";
import { toast } from "@/components/ui/Toaster";

interface InsightsViewProps {
  insights: BusinessInsight[];
  fetchAIInsights: () => void;
  isLoading?: boolean;
  error?: string | null;
}

const translateError = (errorMessage: string) => {
  switch (errorMessage) {
    case "QUOTA_EXHAUSTED":
      return "Neural engine rate limit reached. Please wait before retrying.";

    case "API_KEY_MISSING":
      return "AI engine is not configured. Please verify system credentials.";

    default:
      return "Unexpected system anomaly detected. Please try again.";
  }
};

const InsightsView: React.FC<InsightsViewProps> = ({
  insights,
  fetchAIInsights,
  isLoading,
  error,
}) => {
  const [selectedInsight, setSelectedInsight] =
    useState<BusinessInsight | null>(null);

  const hasInsights = insights.length > 0;
  const isDormant = !hasInsights && !isLoading && !error;

  const [cooldown, setCooldown] = useState(false);

  useEffect(() => {
    if (error?.includes("429")) {
      setCooldown(true);
      setTimeout(() => setCooldown(false), 5000);
    }
  }, [error]);

  React.useEffect(() => {
    if (error) {
      toast(translateError(error), "error");
    }
  }, [error]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return (
          <TrendingUp
            size={18}
            className="text-emerald-500 dark:text-emerald-400"
          />
        );
      case "down":
        return (
          <TrendingDown
            size={18}
            className="text-rose-500 dark:text-rose-400"
          />
        );
      default:
        return <Minus size={18} className="text-zinc-500 dark:text-zinc-400" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30";
      case "Medium":
        return "bg-amber-500/20 text-amber-300 border border-amber-500/30";
      case "Low":
        return "bg-zinc-500/20 text-zinc-300 border border-zinc-500/30";
      default:
        return "bg-zinc-200 text-zinc-600";
    }
  };

  return (
    <div className="relative h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white overflow-hidden font-sans">
      {/* 🌌 Animated Gradient Background */}
      <div className="absolute inset-0 -z-20">
        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-30 dark:opacity-20"
          style={{
            background:
              "radial-gradient(circle at 20% 30%, #6366f1 0%, transparent 40%), radial-gradient(circle at 80% 70%, #06b6d4 0%, transparent 40%)",
            backgroundSize: "200% 200%",
          }}
        />
      </div>

      {/* Subtle Neural Grid */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.04] dark:opacity-[0.03] 
bg-[radial-gradient(#000000_1px,transparent_1px)] 
dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] 
[background-size:20px_20px]"
      />

      <SectionHeader
        icon={<BrainCircuit size={20} />}
        title="AI Strategy Hub"
        subtitle="Predictive neural synthesis engine"
        rightContent={
          insights.length > 0 && (
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-10">
        <div className="max-w-[1400px] mx-auto min-h-[500px]">
          <AnimatePresence mode="wait">
            {/* AI Loading State */}
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center gap-12"
              >
                {/* Rotating Neural Core */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                  {/* Outer rotating ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute w-48 h-48 rounded-full border border-indigo-500/30"
                  />

                  {/* Inner counter rotation */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute w-36 h-36 rounded-full border border-indigo-400/40"
                  />

                  {/* Orbiting particles */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute w-48 h-48"
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/50" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" />
                  </motion.div>

                  {/* Core */}
                  <div className="relative flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                      className="absolute w-24 h-24 bg-indigo-500/20 blur-2xl rounded-full"
                    />
                    <BrainCircuit size={42} className="text-indigo-500" />
                  </div>
                </div>

                {/* Loading Text */}
                <div className="flex flex-col items-center gap-6 text-center max-w-md">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                      Neural Engine Active
                    </p>

                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                      Synthesizing Strategic Signals
                    </h3>

                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Analyzing order velocity, asset demand, floor dynamics and
                      revenue deltas.
                    </p>
                  </motion.div>

                  <div className="w-72 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{
                        duration: 1.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-1/2 h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Grid */}
            {hasInsights && !isLoading && !error && (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {insights.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10 transition flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-medium ${getImpactColor(
                          s.impact
                        )}`}
                      >
                        {s.impact}
                      </span>

                      {getTrendIcon(s.trend)}
                    </div>

                    <h3 className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                      {s.title}
                    </h3>

                    <h2 className="text-2xl font-semibold mb-3">{s.value}</h2>

                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 flex-1">
                      {s.description}
                    </p>

                    <button
                      onClick={() => setSelectedInsight(s)}
                      className="flex items-center gap-1 text-indigo-400 text-sm font-medium hover:gap-2 transition"
                    >
                      View details <ArrowUpRight size={14} />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Dormant */}
            {isDormant && (
              <motion.div
                key="dormant"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center gap-6 text-center"
              >
                <BrainCircuit
                  size={48}
                  className="text-indigo-400 opacity-40"
                />
                <button
                  onClick={fetchAIInsights}
                  className="
    bg-indigo-600 text-white
    hover:bg-indigo-700
    dark:bg-indigo-500 dark:hover:bg-indigo-600
    px-6 py-2.5
    rounded-lg
    text-sm font-medium
    transition-all
    shadow-md dark:shadow-indigo-500/10
  "
                >
                  Initiate Neural Analysis
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Details Panel remains unchanged from previous version */}
      <AnimatePresence>
        {selectedInsight && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInsight(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="fixed right-0 top-0 h-full w-full sm:w-[520px] bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 z-50 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                    Strategic Insight Analysis
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    AI Generated Intelligence Layer
                  </p>
                </div>

                <button
                  onClick={() => setSelectedInsight(null)}
                  className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10">
                {/* Overview */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-medium ${getImpactColor(
                        selectedInsight.impact
                      )}`}
                    >
                      {selectedInsight.impact} Impact
                    </span>

                    {getTrendIcon(selectedInsight.trend)}
                  </div>

                  <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                    {selectedInsight.title}
                  </h3>

                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                    {selectedInsight.value}
                  </div>
                </section>

                {/* Strategic Interpretation */}
                <section className="space-y-3">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Interpretation
                  </h4>

                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                    {selectedInsight.description}
                  </p>
                </section>

                {/* Risk / Opportunity */}
                <section className="space-y-3">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Risk / Opportunity Assessment
                  </h4>

                  <div className="bg-zinc-100 dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {selectedInsight.trend === "up"
                      ? "Upward trend indicates positive momentum. Strategic reinforcement recommended to sustain growth."
                      : selectedInsight.trend === "down"
                      ? "Downward signal detected. Intervention required to prevent performance degradation."
                      : "Stable signal detected. Optimization opportunity exists for marginal gains."}
                  </div>
                </section>

                {/* AI Recommendations */}
                <section className="space-y-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    AI Recommended Actions
                  </h4>

                  <ul className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
                    <li className="flex gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500" />
                      Adjust operational focus toward high impact segments.
                    </li>
                    <li className="flex gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500" />
                      Monitor related performance indicators for volatility.
                    </li>
                    <li className="flex gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500" />
                      Deploy corrective or amplification strategy based on
                      signal direction.
                    </li>
                  </ul>
                </section>

                {/* Data Signals */}
                <section className="space-y-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Telemetry Signals
                  </h4>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-3 border border-zinc-200 dark:border-zinc-800">
                      <div className="text-zinc-500 dark:text-zinc-400">
                        Category
                      </div>
                      <div className="font-medium text-zinc-900 dark:text-white">
                        {selectedInsight.category}
                      </div>
                    </div>

                    <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-3 border border-zinc-200 dark:border-zinc-800">
                      <div className="text-zinc-500 dark:text-zinc-400">
                        Trend
                      </div>
                      <div className="font-medium text-zinc-900 dark:text-white">
                        {selectedInsight.trend}
                      </div>
                    </div>

                    <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-3 border border-zinc-200 dark:border-zinc-800">
                      <div className="text-zinc-500 dark:text-zinc-400">
                        Impact Level
                      </div>
                      <div className="font-medium text-zinc-900 dark:text-white">
                        {selectedInsight.impact}
                      </div>
                    </div>

                    <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-3 border border-zinc-200 dark:border-zinc-800">
                      <div className="text-zinc-500 dark:text-zinc-400">
                        Confidence
                      </div>
                      <div className="font-medium text-zinc-900 dark:text-white">
                        High
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InsightsView;
