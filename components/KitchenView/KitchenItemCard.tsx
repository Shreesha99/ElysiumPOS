import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import { KitchenTicket } from "@/components/KitchenView/hooks/useKitchenTickets";

interface Props {
  ticket: KitchenTicket;
  updateItemStatus: (
    orderId: string,
    name: string,
    status: "Preparing" | "Ready" | "Served"
  ) => void;
}

const KitchenItemCard: React.FC<Props> = ({ ticket, updateItemStatus }) => {
  const [elapsed, setElapsed] = useState(0);
  const nextStatus =
    ticket.status === "Queued"
      ? "Preparing"
      : ticket.status === "Preparing"
      ? "Ready"
      : "Served";

  const handleAdvance = () => {
    updateItemStatus(ticket.orderId, ticket.menuItemId, nextStatus);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Date.now() - ticket.createdAt.toDate().getTime();
      setElapsed(Math.floor(diff / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [ticket.createdAt]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  const urgent = minutes >= 15;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.96 }}
      onClick={handleAdvance}
      className={`cursor-pointer select-none relative rounded-2xl p-4
      border shadow-sm transition

        bg-white dark:bg-zinc-900
        ${
          urgent
            ? "border-rose-400 dark:border-rose-500"
            : "border-zinc-200 dark:border-zinc-800"
        }`}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl
    ${
      ticket.status === "Queued"
        ? "bg-zinc-400"
        : ticket.status === "Preparing"
        ? "bg-amber-500"
        : "bg-emerald-500"
    }`}
      />

      <div className="flex justify-between mb-2">
        <div className="font-semibold text-zinc-900 dark:text-white">
          {ticket.quantity} × {ticket.name}
        </div>

        <div
          className={`flex items-center gap-1 text-xs font-mono
          ${urgent ? "text-rose-500" : "text-zinc-500 dark:text-zinc-400"}`}
        >
          <Clock size={14} />
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
      </div>

      <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
        {ticket.tableRef}
      </div>

      <div
        className={`mt-2 text-[10px] uppercase tracking-widest font-semibold
    ${
      ticket.status === "Queued"
        ? "text-zinc-500"
        : ticket.status === "Preparing"
        ? "text-amber-600"
        : "text-emerald-600"
    }`}
      >
        Tap to {nextStatus.toLowerCase()}
      </div>
    </motion.div>
  );
};

export default KitchenItemCard;
