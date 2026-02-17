import React from "react";
import { OrderItem } from "@/types";

interface Props {
  orderId: string;
  item: OrderItem;
  now: number;
  updateItemStatus: (
    orderId: string,
    menuItemId: string,
    status: "Preparing" | "Ready" | "Served"
  ) => void;
}

const KitchenItemRow: React.FC<Props> = ({
  orderId,
  item,
  now,
  updateItemStatus,
}) => {
  let itemElapsed: string | null = null;

  if (item.startedAt) {
    const diff = now - item.startedAt.toDate().getTime();
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    itemElapsed = `${String(mins).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  }

  const statusStyle =
    item.status === "Preparing"
      ? "text-amber-600 dark:text-amber-400"
      : item.status === "Ready"
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-zinc-500 dark:text-zinc-400";

  return (
    <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50 px-4 py-3 rounded-xl">
      <div className="flex flex-col">
        <div className="font-semibold">
          {item.quantity} × {item.name}
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className={`uppercase tracking-wide ${statusStyle}`}>
            {item.status}
          </span>

          {itemElapsed && (
            <span className="font-mono text-zinc-400">{itemElapsed}</span>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {item.status === "Queued" && (
          <button
            onClick={() =>
              updateItemStatus(orderId, item.menuItemId, "Preparing")
            }
            className="px-3 py-1 text-xs rounded-md bg-amber-600 text-white hover:bg-amber-700 transition"
          >
            Start
          </button>
        )}

        {item.status === "Preparing" && (
          <button
            onClick={() => updateItemStatus(orderId, item.menuItemId, "Ready")}
            className="px-3 py-1 text-xs rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition"
          >
            Ready
          </button>
        )}

        {item.status === "Ready" && (
          <button
            onClick={() => updateItemStatus(orderId, item.menuItemId, "Served")}
            className="px-3 py-1 text-xs rounded-md bg-zinc-800 text-white dark:bg-white dark:text-zinc-900"
          >
            Serve
          </button>
        )}
      </div>
    </div>
  );
};

export default KitchenItemRow;
