import React, { useState } from "react";
import {
  Search,
  MessageSquare,
  Mail,
  Phone,
  HelpCircle,
  Send,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

const SupportView: React.FC = () => {
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const faqs = [
    {
      question: "How do I refund an order?",
      answer: "Go to Orders > Select order > Click refund.",
    },
    {
      question: "How to reset staff password?",
      answer: "Admin panel > Staff > Reset credentials.",
    },
    {
      question: "Why is my table locked?",
      answer: "Another operator might be handling it.",
    },
  ];

  const filteredFaqs = faqs.filter((f) =>
    f.question.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Operator", // you can replace with logged-in user
          email: "operator@elysiumpos.com",
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send");
      }

      setSubmitted(true);
      setMessage("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full h-[100dvh] flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      {/* HEADER */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold dark:text-white">
              Customer Support
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Get help, manage tickets, and access documentation
            </p>
          </div>

          <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800 px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 focus-within:ring-2 focus-within:ring-indigo-500 transition">
            <Search size={16} className="text-zinc-400" />
            <input
              placeholder="Search help articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none w-full text-sm dark:text-white"
            />
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-3 gap-8">
          {/* FAQ PANEL */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">
              Frequently Asked
            </h2>

            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.01 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <HelpCircle size={18} className="text-indigo-600" />
                  <h3 className="font-semibold dark:text-white">
                    {faq.question}
                  </h3>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CONTACT PANEL */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">
              Contact Us
            </h2>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-5 shadow-sm">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <CheckCircle2 size={36} className="text-emerald-500" />
                  <p className="text-sm mt-4 dark:text-white">
                    Message sent successfully
                  </p>
                </div>
              ) : (
                <>
                  <textarea
                    placeholder="Describe your issue..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-28 bg-zinc-100 dark:bg-zinc-800 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />

                  {error && <p className="text-xs text-rose-500">{error}</p>}

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send size={16} />
                    {loading ? "Sending..." : "Submit Ticket"}
                  </button>
                </>
              )}
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-indigo-600" />
                hello@the-elysium-project.in
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-indigo-600" />
                +91 9606 239 247
              </div>

              {/* <div className="flex items-center gap-3 text-sm">
                <MessageSquare size={16} className="text-indigo-600" />
                Live chat available 9AM to 9PM
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportView;
