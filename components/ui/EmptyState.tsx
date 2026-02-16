import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  compact?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  compact = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full flex flex-col items-center justify-center text-center ${
        compact ? "py-16" : "py-24"
      }`}
    >
      <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6">
        <Icon size={28} className="text-zinc-400" />
      </div>

      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
        {title}
      </p>

      {description && (
        <p className="text-xs text-zinc-400 mt-3 max-w-xs">{description}</p>
      )}
    </motion.div>
  );
};

export default EmptyState;
