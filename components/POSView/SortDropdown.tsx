import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  sortBy: "relevance" | "priceLow" | "priceHigh" | "name";
  setSortBy: (val: Props["sortBy"]) => void;
  count: number;
}

const options = [
  { label: "Relevance", value: "relevance" },
  { label: "Price: Low to High", value: "priceLow" },
  { label: "Price: High to Low", value: "priceHigh" },
  { label: "Name A to Z", value: "name" },
];

const SortDropdown: React.FC<Props> = ({ sortBy, setSortBy, count }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === sortBy);

  return (
    <div className="mb-6 flex items-center justify-between">
      {/* Result Count */}
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {count} {count === 1 ? "item" : "items"} found
      </p>

      {/* Dropdown */}
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
        >
          Sort: {selected?.label}
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
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-xl overflow-hidden z-50"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value as any);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm transition ${
                    sortBy === option.value
                      ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SortDropdown;
