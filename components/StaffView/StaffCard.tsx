import React from "react";
import { Waiter } from "@/types";
import {
  Trash2,
  Clock,
  Calendar,
  Briefcase,
  CheckCircle2,
  User,
} from "lucide-react";

interface Props {
  waiter: Waiter;
  isEditMode: boolean;
  updateWaiter: (id: string, updates: Partial<Waiter>) => void;
  deleteWaiter: (id: string) => void;
}

const ROLES = [
  "Head Server",
  "Captain",
  "Server",
  "Junior Server",
  "Host",
  "Mixologist",
  "Chef de Partie",
];

const StaffCard: React.FC<Props> = ({
  waiter,
  isEditMode,
  updateWaiter,
  deleteWaiter,
}) => {
  const today = new Date().toISOString().split("T")[0];
  const isOnLeave = waiter.leaveDates.includes(today);

  const toggleLeave = () => {
    let updated = [...waiter.leaveDates];
    if (isOnLeave) {
      updated = updated.filter((d) => d !== today);
    } else {
      updated.push(today);
    }

    updateWaiter(waiter.id, {
      leaveDates: updated,
      status: isOnLeave ? "Offline" : "On Leave",
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 transition hover:shadow-md">
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-lg font-semibold dark:text-white">
            {waiter.name}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-indigo-600 dark:text-indigo-400">
            <Briefcase size={14} />
            {isEditMode ? (
              <select
                value={waiter.role}
                onChange={(e) =>
                  updateWaiter(waiter.id, { role: e.target.value })
                }
                className="bg-transparent border-none outline-none"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            ) : (
              waiter.role
            )}
          </div>
        </div>

        {isEditMode && (
          <button
            onClick={() => deleteWaiter(waiter.id)}
            className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Shift */}
      <div className="flex items-center justify-between mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <Clock size={14} />
          Schedule
        </div>

        {isEditMode ? (
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={waiter.shiftStart}
              onChange={(e) =>
                updateWaiter(waiter.id, { shiftStart: e.target.value })
              }
              className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs"
            />
            <span>-</span>
            <input
              type="time"
              value={waiter.shiftEnd}
              onChange={(e) =>
                updateWaiter(waiter.id, { shiftEnd: e.target.value })
              }
              className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs"
            />
          </div>
        ) : (
          <span>
            {waiter.shiftStart} – {waiter.shiftEnd}
          </span>
        )}
      </div>

      {/* Leave */}
      <div className="flex items-center justify-between mb-6 text-sm">
        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
          <Calendar size={14} />
          Availability
        </div>

        <button
          onClick={toggleLeave}
          className={`px-3 py-1.5 rounded-lg text-xs transition ${
            isOnLeave
              ? "bg-rose-500 text-white"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          }`}
        >
          {isOnLeave ? "On Leave" : "Mark Leave"}
        </button>
      </div>

      {/* Duty Toggle */}
      <button
        disabled={isEditMode}
        onClick={() =>
          updateWaiter(waiter.id, {
            status: waiter.status === "Active" ? "Offline" : "Active",
          })
        }
        className={`w-full py-2.5 rounded-lg text-sm transition ${
          waiter.status === "Active"
            ? "bg-emerald-500 text-white"
            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
        }`}
      >
        {waiter.status === "Active" ? (
          <span className="flex items-center justify-center gap-2">
            <CheckCircle2 size={14} />
            On Duty
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <User size={14} />
            Go On Duty
          </span>
        )}
      </button>
    </div>
  );
};

export default StaffCard;
