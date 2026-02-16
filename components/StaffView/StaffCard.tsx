import React, { useEffect, useRef, useState } from "react";
import { Waiter } from "@/types";
import {
  Trash2,
  Clock,
  Calendar,
  Briefcase,
  CheckCircle2,
  User,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

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
  const isOnLeave = waiter.leaveDates?.includes(today) ?? false;
  const [isMutating, setIsMutating] = useState(false);

  const [roleOpen, setRoleOpen] = useState(false);
  const roleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setRoleOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const safeUpdate = async (updates: Partial<Waiter>) => {
    try {
      setIsMutating(true);
      await updateWaiter(waiter.id, updates);
    } finally {
      setIsMutating(false);
    }
  };

  const safeDelete = async () => {
    try {
      setIsMutating(true);
      await deleteWaiter(waiter.id);
    } finally {
      setIsMutating(false);
    }
  };

  const toggleLeave = async () => {
    const currentLeaveDates = waiter.leaveDates ?? [];

    const updated = isOnLeave
      ? currentLeaveDates.filter((d) => d !== today)
      : [...currentLeaveDates, today];

    await safeUpdate({
      leaveDates: updated,
      status: isOnLeave ? "Offline" : "On Leave",
    });
  };

  return (
    <div className="relative group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col p-6">
      {isMutating && (
        <div className="absolute inset-0 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm rounded-2xl flex items-center justify-center z-20">
          <Loader2 size={18} className="animate-spin text-indigo-600" />
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-lg font-semibold dark:text-white">
            {waiter.name}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-indigo-600 dark:text-indigo-400">
            {isEditMode ? (
              <div ref={roleRef} className="relative">
                <button
                  disabled={isMutating}
                  onClick={() => setRoleOpen((p) => !p)}
                  className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400"
                >
                  <Briefcase size={14} />
                  {waiter.role}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${
                      roleOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {roleOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 mt-2 w-48 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-xl overflow-hidden z-50"
                    >
                      {ROLES.map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            safeUpdate({ role: r });
                            setRoleOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm transition ${
                            waiter.role === r
                              ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                              : "hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              waiter.role
            )}
          </div>
        </div>

        {isEditMode && (
          <button
            onClick={safeDelete}
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
              value={waiter.shiftStart ?? "09:00"}
              disabled={isMutating}
              onChange={(e) => safeUpdate({ shiftStart: e.target.value })}
              className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs disabled:opacity-50"
            />
            <span>-</span>
            <input
              type="time"
              value={waiter.shiftEnd ?? "18:00"}
              disabled={isMutating}
              onChange={(e) => safeUpdate({ shiftEnd: e.target.value })}
              className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs disabled:opacity-50"
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
          disabled={isMutating}
          onClick={toggleLeave}
          className={`px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-2 ${
            isOnLeave
              ? "bg-rose-500 text-white"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          }`}
        >
          {isMutating ? (
            <Loader2 size={12} className="animate-spin" />
          ) : isOnLeave ? (
            "On Leave"
          ) : (
            "Mark Leave"
          )}
        </button>
      </div>

      {/* Duty Toggle */}
      <button
        disabled={isEditMode}
        onClick={() =>
          safeUpdate({
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
