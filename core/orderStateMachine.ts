import { Order } from "@/types";

export const allowedTransitions: Record<Order["status"], Order["status"][]> = {
  Pending: ["Preparing", "Voided"],
  Preparing: ["Served", "Voided"],
  Served: ["Paid"],
  Paid: [],
  Voided: [],
};

export function canTransition(
  from: Order["status"],
  to: Order["status"]
): boolean {
  return allowedTransitions[from].includes(to);
}
