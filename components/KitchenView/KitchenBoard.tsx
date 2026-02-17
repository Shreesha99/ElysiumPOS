import React, { useMemo } from "react";
import { Order } from "@/types";
import KitchenOrderCard from "./KitchenOrderCard";

interface Props {
  orders: Order[];
  search: string;
  now: number;
  updateItemStatus: (
    orderId: string,
    menuItemId: string,
    status: "Preparing" | "Ready" | "Served"
  ) => void;
}

const KitchenBoard: React.FC<Props> = ({
  orders,
  search,
  now,
  updateItemStatus,
}) => {
  const activeOrders = useMemo(() => {
    const filtered = orders.filter(
      (o) =>
        o.status === "Pending" ||
        o.status === "Preparing" ||
        o.status === "Served"
    );

    const q = search.trim().toLowerCase();

    const searched = q
      ? filtered.filter((o) =>
          `${o.tableId ?? "takeaway"}`.toLowerCase().includes(q)
        )
      : filtered;

    return searched.sort(
      (a, b) => a.createdAt.toMillis() - b.createdAt.toMillis()
    );
  }, [orders, search]);

  if (activeOrders.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-400 text-sm uppercase tracking-widest">
        No active kitchen orders
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {activeOrders.map((order) => (
        <KitchenOrderCard
          key={order.id}
          order={order}
          now={now}
          updateItemStatus={updateItemStatus}
        />
      ))}
    </div>
  );
};

export default KitchenBoard;
