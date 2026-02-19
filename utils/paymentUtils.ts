import { Order } from "@/types";

export function calculatePaymentStatus(order: Order) {
  const paid = order.payments?.reduce((sum, p) => sum + p.amount, 0) ?? 0;

  if (paid === 0) return "Unpaid";
  if (paid < order.total) return "PartiallyPaid";
  return "Paid";
}
