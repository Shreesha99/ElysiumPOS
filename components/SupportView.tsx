import React, { useState } from "react";
import {
  Search,
  Mail,
  Phone,
  Send,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQ {
  category: string;
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  // ORDERS
  {
    category: "Orders",
    question: "How do I refund an order?",
    answer:
      "Go to Orders → Select the order → Click Refund → Confirm. Inventory will auto adjust.",
  },
  {
    category: "Orders",
    question: "How do I split a bill?",
    answer:
      "Open active order → Click Split → Choose items or divide equally → Confirm.",
  },
  {
    category: "Orders",
    question: "Can I merge two tables?",
    answer:
      "Yes. Open one table → Click Merge → Select another table → Confirm.",
  },
  {
    category: "Orders",
    question: "How do I void a payment?",
    answer:
      "Go to Transactions → Select payment → Click Void if within gateway allowed time.",
  },
  {
    category: "Orders",
    question: "Why is order not printing?",
    answer:
      "Check printer connection, network status, and assigned printer in settings.",
  },

  // TABLES
  {
    category: "Tables",
    question: "Why is my table locked?",
    answer:
      "Another operator has it open. Ask them to close or transfer control.",
  },
  {
    category: "Tables",
    question: "How do I transfer a table?",
    answer: "Open the table → Click Transfer → Choose new table → Confirm.",
  },
  {
    category: "Tables",
    question: "Can I reopen a closed table?",
    answer: "Yes. Go to Orders History → Select ticket → Click Reopen.",
  },

  // INVENTORY
  {
    category: "Inventory",
    question: "How does stock deduction work?",
    answer:
      "Stock deducts automatically based on recipe mapping per menu item.",
  },
  {
    category: "Inventory",
    question: "Why is stock negative?",
    answer:
      "Recipe configuration may be incorrect or manual stock updates were skipped.",
  },
  {
    category: "Inventory",
    question: "Can I bulk import inventory?",
    answer: "Yes. Go to Inventory → Import CSV → Upload formatted file.",
  },

  // STAFF
  {
    category: "Staff",
    question: "How do I reset staff password?",
    answer: "Admin Panel → Staff → Select member → Reset Credentials.",
  },
  {
    category: "Staff",
    question: "Can I assign different permissions?",
    answer:
      "Yes. Roles like Manager, Cashier, Waiter can be customized under Settings.",
  },

  // PAYMENTS
  {
    category: "Payments",
    question: "How do I enable UPI or Card?",
    answer: "Settings → Payments → Enable required methods → Save.",
  },
  {
    category: "Payments",
    question: "Why did payment fail?",
    answer: "Check internet, gateway logs, or try alternative payment method.",
  },

  // REPORTS
  {
    category: "Reports",
    question: "How do I export daily sales?",
    answer: "Insights → Select date → Click Export → Choose PDF or CSV.",
  },
  {
    category: "Reports",
    question: "Can I view hourly breakdown?",
    answer: "Yes. Insights dashboard includes hourly analytics view.",
  },

  // SYSTEM
  {
    category: "System",
    question: "Is my data backed up?",
    answer:
      "Yes. All data is stored securely in the cloud with automatic backups.",
  },
  {
    category: "System",
    question: "Can I use POS offline?",
    answer:
      "Limited offline mode is available. Sync occurs when connection restores.",
  },
];

const SupportView: React.FC = () => {
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* HEADER */}
      <div className="shrink-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-6">
        <div className="max-w-[1400px] mx-auto space-y-6">
          <h1 className="text-3xl font-semibold dark:text-white">
            Customer Support
          </h1>

          <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 focus-within:ring-2 focus-within:ring-indigo-500">
            <Search size={18} className="text-zinc-400" />
            <input
              placeholder="Search help articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none w-full text-sm dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 relative overflow-hidden">
        {/* MOBILE */}
        <div className="flex flex-col h-full lg:hidden">
          {/* FAQ SCROLLABLE AREA */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {filteredFaqs.map((faq, index) => {
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
                      <p className="font-medium dark:text-white">
                        {faq.question}
                      </p>
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

          {/* CONTACT CARDS */}
          <div className="px-6 pt-6 pb-24 space-y-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
              <h2 className="font-semibold dark:text-white">
                Submit a Message
              </h2>

              {submitted ? (
                <div className="flex flex-col items-center text-center py-6">
                  <CheckCircle2 size={36} className="text-emerald-500" />
                  <p className="mt-4 text-sm dark:text-white">
                    Message submitted successfully
                  </p>
                </div>
              ) : (
                <>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your issue..."
                    className="w-full h-24 bg-zinc-100 dark:bg-zinc-800 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 mt-4"
                  />

                  <button
                    onClick={() => {
                      if (message.trim()) {
                        setSubmitted(true);
                        setMessage("");
                      }
                    }}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2 mt-3"
                  >
                    <Send size={16} />
                    Submit Message
                  </button>
                </>
              )}
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
              <h2 className="font-semibold dark:text-white mb-4">
                Direct Contact
              </h2>

              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-indigo-600" />
                hello@the-elysium-project.in
              </div>

              <div className="flex items-center gap-3 text-sm mt-3">
                <Phone size={16} className="text-indigo-600" />
                +91 9606 239 247
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8 h-full px-6 py-8">
          {/* FAQ */}
          <div className="lg:col-span-2 overflow-y-auto pr-4 space-y-4">
            {filteredFaqs.map((faq, index) => {
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
                      <p className="font-medium dark:text-white">
                        {faq.question}
                      </p>
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

          {/* CONTACT */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold dark:text-white">
                Submit a Message
              </h2>

              {submitted ? (
                <div className="flex flex-col items-center text-center py-6">
                  <CheckCircle2 size={36} className="text-emerald-500" />
                  <p className="mt-4 text-sm dark:text-white">
                    Message submitted successfully
                  </p>
                </div>
              ) : (
                <>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your issue..."
                    className="w-full h-28 bg-zinc-100 dark:bg-zinc-800 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  <button
                    onClick={() => {
                      if (message.trim()) {
                        setSubmitted(true);
                        setMessage("");
                      }
                    }}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                  >
                    <Send size={16} />
                    Submit Message
                  </button>
                </>
              )}
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold dark:text-white">Direct Contact</h2>

              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-indigo-600" />
                hello@the-elysium-project.in
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-indigo-600" />
                +91 9606 239 247
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportView;
