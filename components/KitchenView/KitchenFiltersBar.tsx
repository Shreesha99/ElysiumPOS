import React from "react";

interface Props {
  station: string;
  setStation: (s: string) => void;
  status: string;
  setStatus: (s: string) => void;
  urgency: string;
  setUrgency: (u: string) => void;
  resultCount: number;
}

const stations = ["All", "Grill", "Fry", "Drinks", "Dessert", "General"];
const statuses = ["All", "Queued", "Preparing", "Ready"];
const urgencyLevels = ["All", "10+", "15+"];

const KitchenFiltersBar: React.FC<Props> = ({
  station,
  setStation,
  status,
  setStatus,
  urgency,
  setUrgency,
  resultCount,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* 🔹 STATION TABS (Inventory category style) */}
      <div className="flex flex-wrap gap-2">
        {stations.map((s) => (
          <button
            key={s}
            onClick={() => setStation(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
              ${
                station === s
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* 🔹 STATUS + URGENCY ROW (Inventory pill style) */}
      <div className="flex flex-wrap items-center gap-3">
        {/* STATUS */}
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition border
              ${
                status === s
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
          >
            {s}
          </button>
        ))}

        {/* URGENCY */}
        {urgencyLevels.map((u) => (
          <button
            key={u}
            onClick={() => setUrgency(u)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition border
              ${
                urgency === u
                  ? "bg-rose-600 text-white border-rose-600"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
          >
            {u}
          </button>
        ))}

        {/* RESULT COUNT */}
        <div className="ml-auto text-sm text-zinc-500 dark:text-zinc-400">
          {resultCount} tickets found
        </div>
      </div>
    </div>
  );
};

export default KitchenFiltersBar;
