import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { ReactNode } from "react";

/* ---------------- ERROR TRANSLATION ---------------- */

export const translateError = (errorMessage?: string | null): string => {
  if (!errorMessage) return "";

  switch (errorMessage) {
    case "QUOTA_EXHAUSTED":
      return "Neural engine rate limit reached. Please wait before retrying.";

    case "API_KEY_MISSING":
      return "AI engine is not configured. Please verify system credentials.";

    default:
      return "Unexpected system anomaly detected. Please try again.";
  }
};

/* ---------------- TREND ICON ---------------- */

export type InsightTrend = "up" | "down" | "neutral" | string;

export const getTrendIcon = (trend: InsightTrend): ReactNode => {
  if (trend === "up") {
    return (
      <TrendingUp
        size={18}
        className="text-emerald-500 dark:text-emerald-400"
      />
    );
  }

  if (trend === "down") {
    return (
      <TrendingDown size={18} className="text-rose-500 dark:text-rose-400" />
    );
  }

  return <Minus size={18} className="text-zinc-500 dark:text-zinc-400" />;
};

/* ---------------- IMPACT COLOR ---------------- */

export type InsightImpact = "High" | "Medium" | "Low" | string;

export const getImpactColor = (impact: InsightImpact): string => {
  if (impact === "High") {
    return "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30";
  }

  if (impact === "Medium") {
    return "bg-amber-500/20 text-amber-300 border border-amber-500/30";
  }

  if (impact === "Low") {
    return "bg-zinc-500/20 text-zinc-300 border border-zinc-500/30";
  }

  return "bg-zinc-200 text-zinc-600";
};
