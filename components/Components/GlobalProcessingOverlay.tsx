import React from "react";
import { Loader2 } from "lucide-react";

interface GlobalProcessingOverlayProps {
  isVisible: boolean;
  title?: string;
  subtitle?: string;
}

const GlobalProcessingOverlay: React.FC<GlobalProcessingOverlayProps> = ({
  isVisible,
  title = "Processing",
  subtitle = "Please wait while we complete the action",
}) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-[200] bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm flex items-center justify-center">
      <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 px-6 py-4 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800">
        <Loader2 size={20} className="animate-spin text-indigo-600" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold dark:text-white">{title}</span>
          <span className="text-xs text-zinc-400">{subtitle}</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalProcessingOverlay;
