import React from "react";
import { Table } from "@/types";

interface Props {
  tables: Table[];
  setActiveTab: (tab: string) => void;
}

const FloorStatusCard: React.FC<Props> = ({ tables, setActiveTab }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 sm:p-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold dark:text-white">
          Active Floor Sessions
        </h3>
        <button
          onClick={() => setActiveTab("tables")}
          className="text-sm text-indigo-600 hover:underline"
        >
          View Map
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {tables.map((t) => (
          <div
            key={t.id}
            className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition ${
              t.status === "Occupied"
                ? "bg-indigo-600 text-white"
                : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
            }`}
          >
            T{t.number}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloorStatusCard;
