import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastCounter = 0;
let toastListeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

export const toast = (message: string, type: ToastType = "info") => {
  const id = `toast-${toastCounter++}`;
  toasts = [...toasts, { id, message, type }];
  toastListeners.forEach((listener) => listener(toasts));

  setTimeout(() => {
    removeToast(id);
  }, 4000);
};

const removeToast = (id: string) => {
  toasts = toasts.filter((t) => t.id !== id);
  toastListeners.forEach((listener) => listener(toasts));
};

const ToastIcon = ({ type }: { type: ToastType }) => {
  switch (type) {
    case "success":
      return <CheckCircle2 size={18} className="text-emerald-500" />;
    case "error":
      return <AlertCircle size={18} className="text-rose-500" />;
    case "info":
      return <Info size={18} className="text-indigo-500" />;
  }
};

const ToastItem = ({ t }: { t: Toast }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="pointer-events-auto"
    >
      <div
        className="
          bg-white dark:bg-zinc-900
          border border-zinc-200 dark:border-zinc-800
          shadow-xl
          rounded-xl
          px-4 py-3
          flex items-start gap-3
          min-w-[280px]
          max-w-[420px]
        "
      >
        <div className="mt-0.5">
          <ToastIcon type={t.type} />
        </div>

        <div className="flex-1 text-sm font-medium text-zinc-800 dark:text-zinc-100">
          {t.message}
        </div>

        <button
          onClick={() => removeToast(t.id)}
          className="
            p-1 rounded-md
            text-zinc-400
            hover:text-zinc-700
            dark:hover:text-white
            transition
          "
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export const Toaster: React.FC = () => {
  const [activeToasts, setActiveToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => setActiveToasts([...newToasts]);
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <div
      className="
        fixed
        bottom-6
        left-1/2
        -translate-x-1/2
        z-[999]
        flex flex-col gap-3
        pointer-events-none
        px-4
      "
    >
      <AnimatePresence>
        {activeToasts.map((t) => (
          <ToastItem key={t.id} t={t} />
        ))}
      </AnimatePresence>
    </div>
  );
};
