import React from "react";
import { Order } from "@/types";
import { motion } from "framer-motion";

interface Props {
  order: Order;
  now: number;
  updateItemStatus: (
    orderId: string,
    menuItemId: string,
    status: "Preparing" | "Ready" | "Served"
  ) => void;
}

const KitchenOrderCard: React.FC<Props> = ({
  order,
  now,
  updateItemStatus,
}) => {
  const diff = now - order.createdAt.toDate().getTime();
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  const urgent = minutes >= 15;
  const warning = minutes >= 8 && minutes < 15;

  const getTimerStyle = () => {
    if (urgent) return "bg-rose-600 text-white";
    if (warning) return "bg-amber-500 text-black";
    return "bg-emerald-600 text-white";
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="rounded-3xl overflow-hidden shadow-xl border border-zinc-800 bg-zinc-900 text-white flex flex-col"
    >
      {/* HEADER */}
      <div className="p-6 flex justify-between items-center border-b border-zinc-800">
        <div>
          <div className="text-3xl font-black tracking-tight">
            {order.orderType === "Dining" ? `T${order.tableId}` : "TAKEAWAY"}
          </div>
          <div className="text-xs uppercase tracking-widest text-zinc-400 mt-1">
            {order.items.length} Items
          </div>
        </div>

        <div
          className={`px-4 py-2 rounded-2xl text-xl font-mono font-bold ${getTimerStyle()}`}
        >
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
      </div>

      {/* ITEMS */}
      <div className="p-6 space-y-4 flex-1">
        {order.items.map((item) => {
          const badgeColor =
            item.status === "Queued"
              ? "bg-zinc-700"
              : item.status === "Preparing"
              ? "bg-amber-500 text-black"
              : item.status === "Ready"
              ? "bg-emerald-600"
              : "bg-indigo-600";

          return (
            <div
              key={item.menuItemId}
              className="flex items-center justify-between"
            >
              <div className="text-lg font-semibold">
                {item.quantity} × {item.name}
              </div>

              <div
                className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider ${badgeColor}`}
              >
                {item.status}
              </div>
            </div>
          );
        })}
      </div>

      {/* ACTION ZONE */}
      <div className="p-6 border-t border-zinc-800 grid gap-3">
        {order.items.some((i) => i.status === "Queued") && (
          <button
            onClick={() =>
              order.items
                .filter((i) => i.status === "Queued")
                .forEach((i) =>
                  updateItemStatus(order.id, i.menuItemId, "Preparing")
                )
            }
            className="w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-widest"
          >
            Start Items
          </button>
        )}

        {order.items.some((i) => i.status === "Preparing") && (
          <button
            onClick={() =>
              order.items
                .filter((i) => i.status === "Preparing")
                .forEach((i) =>
                  updateItemStatus(order.id, i.menuItemId, "Ready")
                )
            }
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-widest"
          >
            Mark Ready
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default KitchenOrderCard;
