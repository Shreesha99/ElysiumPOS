import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PaymentMode } from "@/types";

interface Props {
  value: PaymentMode;
  onChange: (val: PaymentMode) => void;
}

const options: PaymentMode[] = ["Cash", "Card", "UPI", "Razorpay", "Other"];

const PaymentModeDropdown: React.FC<Props> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
      >
        {value}
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute w-full mt-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-xl z-50"
          >
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`w-full px-4 py-3 text-left text-sm transition ${
                  value === option
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-800"
                }`}
              >
                {option}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentModeDropdown;
