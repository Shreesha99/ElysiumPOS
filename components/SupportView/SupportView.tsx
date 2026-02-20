import React, { useState } from "react";
import { Search, LifeBuoy } from "lucide-react";
import SectionHeader from "@/components/Components/SectionHeader";

import FAQAccordion from "./FAQAccordion";
import ContactPanel from "./ContactPanel";
import { FAQS } from "./faqData";

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
      <SectionHeader
        icon={<LifeBuoy size={20} />}
        title="Customer Support"
        subtitle="Help articles, troubleshooting, and contact support"
        searchContent={
          <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 focus-within:ring-2 focus-within:ring-indigo-500">
            <Search size={18} className="text-zinc-400" />
            <input
              placeholder="Search help articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none w-full text-sm dark:text-white"
            />
          </div>
        }
      />

      <div className="flex-1 overflow-hidden">
        {/* MOBILE */}
        <div className="flex flex-col h-full lg:hidden">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            <FAQAccordion
              faqs={filteredFaqs}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              className="space-y-4"
            />
          </div>

          <div className="px-6 pt-6 pb-24 space-y-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
            <ContactPanel
              message={message}
              setMessage={setMessage}
              submitted={submitted}
              setSubmitted={setSubmitted}
              textareaHeight="h-24"
            />
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8 h-full px-6 py-8">
          <div className="lg:col-span-2 overflow-y-auto pr-4 space-y-4">
            <FAQAccordion
              faqs={filteredFaqs}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              className="space-y-4"
            />
          </div>

          <ContactPanel
            message={message}
            setMessage={setMessage}
            submitted={submitted}
            setSubmitted={setSubmitted}
          />
        </div>
      </div>
    </div>
  );
};

export default SupportView;
