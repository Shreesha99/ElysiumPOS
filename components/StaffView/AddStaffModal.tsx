import React, { useState } from "react";
import { Waiter } from "@/types";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addWaiter: (waiter: Waiter) => void;
}

const AddStaffModal: React.FC<Props> = ({ isOpen, setIsOpen, addWaiter }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addWaiter({
      id: `w-${Date.now()}`,
      name,
      role: "Server",
      status: "Offline",
      assignedTables: [],
      shiftStart: "09:00",
      shiftEnd: "17:00",
      leaveDates: [],
    });

    setIsOpen(false);
    setName("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-xl border border-zinc-200 dark:border-zinc-800"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold dark:text-white">
                Add Staff
              </h3>
              <button onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                placeholder="Full name"
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 dark:text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Create Staff
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddStaffModal;
