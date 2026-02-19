import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Order } from "@/types";
import ReceiptView from "./ReceiptView";

interface Props {
  order: Order;
  onClose: () => void;
}

const ReceiptModal: React.FC<Props> = ({ order, onClose }) => {
  const lastPayment =
    order.payments[order.payments.length - 1]?.amount || order.total;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <X size={18} />
        </button>

        <ReceiptView order={order} amount={lastPayment} onClose={onClose} />
      </motion.div>
    </div>
  );
};

export default ReceiptModal;
