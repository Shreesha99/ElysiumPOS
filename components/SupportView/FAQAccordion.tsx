import React from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQ } from "./faqData";

interface Props {
  faqs: FAQ[];
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
  className?: string;
}

const FAQAccordion: React.FC<Props> = ({
  faqs,
  activeIndex,
  setActiveIndex,
  className = "",
}) => {
  return (
    <div className={className}>
      {faqs.map((faq, index) => {
        const isOpen = activeIndex === index;

        return (
          <div
            key={index}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl"
          >
            <button
              onClick={() => setActiveIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between px-6 py-5"
            >
              <div className="text-left">
                <p className="text-xs uppercase tracking-widest text-indigo-500 mb-1">
                  {faq.category}
                </p>
                <p className="font-medium dark:text-white">{faq.question}</p>
              </div>

              <ChevronDown
                size={18}
                className={`transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="px-6 pb-6 text-sm text-zinc-600 dark:text-zinc-400"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default FAQAccordion;
