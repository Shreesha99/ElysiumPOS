import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

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
  
  // Auto-dismiss after 4 seconds
  setTimeout(() => {
    removeToast(id);
  }, 4000);
};

const removeToast = (id: string) => {
  toasts = toasts.filter(t => t.id !== id);
  toastListeners.forEach(listener => listener(toasts));
};

const ToastIcon = ({ type }: { type: ToastType }) => {
  switch (type) {
    case 'success': 
      return <CheckCircle2 size={18} className="text-emerald-500" />;
    case 'error': 
      return <AlertCircle size={18} className="text-rose-500" />;
    case 'info': 
      return <Info size={18} className="text-indigo-500" />;
  }
};

const ToastItem = ({ t }: { t: Toast }) => {
  const colors = {
    success: 'rgb(16, 185, 129)',
    error: 'rgb(244, 63, 94)',
    info: 'rgb(79, 70, 229)',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      className="relative group pointer-events-auto mb-4"
    >
      {/* SVG Border Progress */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <svg className="w-full h-full overflow-visible">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            rx="20"
            ry="20"
            fill="none"
            stroke={colors[t.type]}
            strokeWidth="2"
            strokeLinecap="round"
            className="opacity-20"
          />
          <motion.rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            rx="20"
            ry="20"
            fill="none"
            stroke={colors[t.type]}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 1 }}
            animate={{ pathLength: 0 }}
            transition={{ duration: 4, ease: 'linear' }}
          />
        </svg>
      </div>

      <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 px-5 py-4 rounded-[20px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] flex items-center gap-4 min-w-[400px] max-w-[600px]">
        
        <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          t.type === 'success' ? 'bg-emerald-500/10' :
          t.type === 'error' ? 'bg-rose-500/10' :
          'bg-indigo-500/10'
        }`}>
          <ToastIcon type={t.type} />
        </div>

        <div className="flex-1 min-w-0 pr-4">
          <h4 className={`text-[9px] font-black uppercase tracking-[0.25em] mb-1 ${
            t.type === 'success' ? 'text-emerald-600' :
            t.type === 'error' ? 'text-rose-600' :
            'text-indigo-600'
          }`}>
            {t.type}
          </h4>
          <p className="text-[13px] font-bold text-zinc-800 dark:text-zinc-100 leading-snug">
            {t.message}
          </p>
        </div>

        <button 
          onClick={() => removeToast(t.id)}
          className="shrink-0 p-2 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all opacity-0 group-hover:opacity-100"
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
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  }, []);

  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[999] flex flex-col items-center pointer-events-none w-full px-6">
      <AnimatePresence mode="popLayout">
        {activeToasts.map((t) => (
          <ToastItem key={t.id} t={t} />
        ))}
      </AnimatePresence>
    </div>
  );
};