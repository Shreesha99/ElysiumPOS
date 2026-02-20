export interface FAQ {
  category: string;
  question: string;
  answer: string;
}

export const FAQS: FAQ[] = [
  {
    category: "Orders",
    question: "How do I refund an order?",
    answer:
      "Go to Orders → Select the order → Click Refund → Confirm. Inventory will auto adjust.",
  },
  {
    category: "Orders",
    question: "How do I split a bill?",
    answer:
      "Open active order → Click Split → Choose items or divide equally → Confirm.",
  },
  {
    category: "Orders",
    question: "Can I merge two tables?",
    answer:
      "Yes. Open one table → Click Merge → Select another table → Confirm.",
  },
  {
    category: "Orders",
    question: "How do I void a payment?",
    answer:
      "Go to Transactions → Select payment → Click Void if within gateway allowed time.",
  },
  {
    category: "Orders",
    question: "Why is order not printing?",
    answer:
      "Check printer connection, network status, and assigned printer in settings.",
  },
  {
    category: "Tables",
    question: "Why is my table locked?",
    answer:
      "Another operator has it open. Ask them to close or transfer control.",
  },
  {
    category: "Tables",
    question: "How do I transfer a table?",
    answer: "Open the table → Click Transfer → Choose new table → Confirm.",
  },
  {
    category: "Tables",
    question: "Can I reopen a closed table?",
    answer: "Yes. Go to Orders History → Select ticket → Click Reopen.",
  },
  {
    category: "Inventory",
    question: "How does stock deduction work?",
    answer:
      "Stock deducts automatically based on recipe mapping per menu item.",
  },
  {
    category: "Inventory",
    question: "Why is stock negative?",
    answer:
      "Recipe configuration may be incorrect or manual stock updates were skipped.",
  },
  {
    category: "Inventory",
    question: "Can I bulk import inventory?",
    answer: "Yes. Go to Inventory → Import CSV → Upload formatted file.",
  },
  {
    category: "Staff",
    question: "How do I reset staff password?",
    answer: "Admin Panel → Staff → Select member → Reset Credentials.",
  },
  {
    category: "Staff",
    question: "Can I assign different permissions?",
    answer:
      "Yes. Roles like Manager, Cashier, Waiter can be customized under Settings.",
  },
  {
    category: "Payments",
    question: "How do I enable UPI or Card?",
    answer: "Settings → Payments → Enable required methods → Save.",
  },
  {
    category: "Payments",
    question: "Why did payment fail?",
    answer: "Check internet, gateway logs, or try alternative payment method.",
  },
  {
    category: "Reports",
    question: "How do I export daily sales?",
    answer: "Insights → Select date → Click Export → Choose PDF or CSV.",
  },
  {
    category: "Reports",
    question: "Can I view hourly breakdown?",
    answer: "Yes. Insights dashboard includes hourly analytics view.",
  },
  {
    category: "System",
    question: "Is my data backed up?",
    answer:
      "Yes. All data is stored securely in the cloud with automatic backups.",
  },
  {
    category: "System",
    question: "Can I use POS offline?",
    answer:
      "Limited offline mode is available. Sync occurs when connection restores.",
  },
];
