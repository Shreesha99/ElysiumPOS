import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";

const InsightsLoadingState: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col items-center justify-center gap-12"
    >
      <div className="relative w-48 h-48 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute w-48 h-48 rounded-full border border-indigo-500/30"
        />

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute w-36 h-36 rounded-full border border-indigo-400/40"
        />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute w-48 h-48"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/50" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" />
        </motion.div>

        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="absolute w-24 h-24 bg-indigo-500/20 blur-2xl rounded-full"
          />
          <BrainCircuit size={42} className="text-indigo-500" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Neural Engine Active
          </p>

          <h3 className="text-lg font-semibold">
            Synthesizing Strategic Signals
          </h3>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Analyzing order velocity, asset demand, floor dynamics and revenue
            deltas.
          </p>
        </div>

        <div className="w-72 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="w-1/2 h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default InsightsLoadingState;
