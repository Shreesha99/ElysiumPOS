import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SectionHeaderProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
  searchContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  sticky?: boolean;
  maxWidth?: string;
  disabled?: boolean;
  defaultExpanded?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  title,
  subtitle,
  rightContent,
  searchContent,
  bottomContent,
  sticky = true,
  maxWidth = "1600px",
  disabled = false,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded ?? false);

  useEffect(() => {
    if (defaultExpanded !== undefined) return;

    const checkScreen = () => {
      if (window.innerWidth >= 1024) {
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
      }
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, [defaultExpanded]);

  return (
    <header
      className={`
        bg-white dark:bg-zinc-900
        border-b border-zinc-200 dark:border-zinc-800
        ${sticky ? "sticky top-0 z-40" : ""}
        shrink-0
        ${disabled ? "pointer-events-none opacity-70" : ""}
      `}
    >
      <div
        className="w-full px-4 sm:px-6 py-4 sm:py-6 space-y-4"
        style={{ maxWidth }}
      >
        {/* TOP ROW */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 shrink-0">
                {icon}
              </div>
            )}

            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold dark:text-white">
                {title}
              </h1>

              {subtitle && (
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {rightContent}

            {bottomContent && defaultExpanded !== true && (
              <button
                onClick={() => setIsExpanded((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                <span>{isExpanded ? "Hide Filters" : "Filters"}</span>

                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}
          </div>
        </div>

        {/* SEARCH ALWAYS VISIBLE */}
        {searchContent && <div>{searchContent}</div>}

        {/* COLLAPSIBLE CONTENT */}
        <AnimatePresence initial={false}>
          {bottomContent && isExpanded && (
            <motion.div
              key="content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-visible"
            >
              <div className="pt-4 space-y-4">{bottomContent}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default SectionHeader;
