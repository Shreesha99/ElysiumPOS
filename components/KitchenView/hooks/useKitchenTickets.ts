import { useMemo } from "react";
import { Order } from "@/types";

export interface KitchenTicket {
  orderId: string;
  menuItemId: string; // ADD THIS
  tableRef: string;
  name: string;
  quantity: number;
  status: "Queued" | "Preparing" | "Ready";
  station: string;
  createdAt: any;
  startedAt?: any;
}

export const useKitchenTickets = (orders: Order[], stationFilter: string) => {
  return useMemo(() => {
    const activeOrders = orders.filter(
      (o) =>
        o.status === "Pending" ||
        o.status === "Preparing" ||
        o.status === "Served"
    );

    const tickets: KitchenTicket[] = [];

    activeOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.status === "Served") return;

        if (stationFilter !== "All" && item.station !== stationFilter) return;

        tickets.push({
          orderId: order.id,
          menuItemId: item.menuItemId,
          tableRef:
            order.orderType === "Dining" ? `T${order.tableId}` : "Takeaway",
          name: item.name,
          quantity: item.quantity,
          status: item.status,
          station: item.station,
          createdAt: order.createdAt,
          startedAt: item.startedAt,
        });
      });
    });

    return tickets.sort(
      (a, b) => a.createdAt.toMillis() - b.createdAt.toMillis()
    );
  }, [orders, stationFilter]);
};
