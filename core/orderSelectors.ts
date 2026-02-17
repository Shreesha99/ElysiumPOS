import { Order } from "@/types";

export function isOrderActive(order: Order) {
  return (
    order.status === "Pending" ||
    order.status === "Preparing" ||
    order.status === "Served"
  );
}

export function isOrderEditable(order: Order) {
  return order.status === "Pending";
}

export function canSetPaid(order: Order) {
  return order.status === "Served";
}

export function canVoid(order: Order) {
  return order.status === "Pending" || order.status === "Preparing";
}
