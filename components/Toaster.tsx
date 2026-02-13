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
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-3 pointer-events-none w-full max-w-md px-4">
      <AnimatePresence>
        {activeToasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={`w-full px-8 py-5 rounded-2xl shadow-2xl text-base font-semibold border flex items-center gap-4 ${
              t.type === 'success' ? 'bg-emerald-600 text-white border-emerald-500' :
              t.type === 'error' ? 'bg-rose-600 text-white border-rose-500' :
              'bg-zinc-900 text-white border-zinc-800'
            }`}
          >
            {t.type === 'success' && <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />}
            {t.type === 'error' && <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />}
            {t.type === 'info' && <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />}
            <span className="flex-1">{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};