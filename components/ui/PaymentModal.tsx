import React, { useState } from "react";
import { Order, PaymentMode } from "@/types";
import { motion } from "framer-motion";

interface Props {
  order: Order;
  onClose: () => void;
  onAddPayment: (amount: number, mode: PaymentMode) => Promise<void>;
}

const PaymentModal: React.FC<Props> = ({ order, onClose, onAddPayment }) => {
  const totalPaid = order.payments.reduce((s, p) => s + p.amount, 0);
  const remaining = order.total - totalPaid;

  const [amount, setAmount] = useState<number>(remaining);
  const [mode, setMode] = useState<PaymentMode>("Cash");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (amount <= 0 || amount > remaining) return;

    try {
      setLoading(true);
      await onAddPayment(amount, mode);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-xl border border-zinc-200 dark:border-zinc-800 space-y-6"
      >
        <h2 className="text-lg font-semibold">Split Payment</h2>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Total</span>
            <span>₹{order.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Paid</span>
            <span>₹{totalPaid.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-indigo-600">
            <span>Remaining</span>
            <span>₹{remaining.toFixed(2)}</span>
          </div>
        </div>

        <input
          type="number"
          value={amount}
          max={remaining}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full border rounded-lg p-2"
        />

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as PaymentMode)}
          className="w-full border rounded-lg p-2"
        >
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="UPI">UPI</option>
          <option value="Online">Online</option>
          <option value="Other">Other</option>
        </select>

        <button
          onClick={handleSubmit}
          disabled={loading || remaining <= 0}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
        >
          Add Payment
        </button>
      </motion.div>
    </div>
  );
};

export default PaymentModal;
