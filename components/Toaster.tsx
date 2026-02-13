
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastCounter = 0;
let toastListeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

export const toast = (message: string, type: ToastType = 'info') => {
  const id = `toast-${toastCounter++}`;
  toasts = [...toasts, { id, message, type }];
  toastListeners.forEach(listener => listener(toasts));
  setTimeout(() => {
    toasts = toasts.filter(t => t.id !== id);
    toastListeners.forEach(listener => listener(toasts));
  }, 3000);
};

export const Toaster: React.FC = () => {
  const [activeToasts, setActiveToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => setActiveToasts(newToasts);
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  }, []);

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
      <AnimatePresence>
        {activeToasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className={`px-4 py-2 rounded-full shadow-lg text-sm font-medium border backdrop-blur-md flex items-center gap-2 ${
              t.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
              t.type === 'error' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' :
              'bg-indigo-500/10 text-indigo-600 border-indigo-500/20'
            }`}
          >
            {t.type === 'success' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
            {t.type === 'error' && <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
            {t.type === 'info' && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
