import React from "react";
import { Mail, Phone, Send, CheckCircle2 } from "lucide-react";

interface Props {
  message: string;
  setMessage: (val: string) => void;
  submitted: boolean;
  setSubmitted: (val: boolean) => void;
  textareaHeight?: string;
}

const ContactPanel: React.FC<Props> = ({
  message,
  setMessage,
  submitted,
  setSubmitted,
  textareaHeight = "h-28",
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold dark:text-white">Submit a Message</h2>

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
              className={`w-full ${textareaHeight} bg-zinc-100 dark:bg-zinc-800 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500`}
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
  );
};

export default ContactPanel;
