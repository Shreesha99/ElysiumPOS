import React, { useState, useMemo } from "react";
import { Order, PaymentMode } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, X } from "lucide-react";
import PaymentModeDropdown from "./PaymentModeDropdown";
import { toast } from "./Toaster";
import ReceiptView from "./ReceiptView";

interface Props {
  order: Order;
  onClose: () => void;
  onAddPayment: (amount: number, mode: PaymentMode) => Promise<void>;
}

const PaymentModal: React.FC<Props> = ({ order, onClose, onAddPayment }) => {
  const totalPaid = useMemo(
    () => order.payments.reduce((s, p) => s + p.amount, 0),
    [order.payments]
  );

  const [showReceipt, setShowReceipt] = useState(false);

  const [status, setStatus] = useState<
    "idle" | "processing" | "success" | "failed" | "cancelled"
  >("idle");

  const remaining = order.total - totalPaid;
  const progress = Math.min((totalPaid / order.total) * 100, 100);

  const [amount, setAmount] = useState<number>(remaining);
  const [mode, setMode] = useState<PaymentMode>("Cash");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const options: PaymentMode[] = ["Cash", "Card", "UPI", "Razorpay", "Other"];

  const quickAmounts = [100, 200, 500, remaining].filter(
    (v, i, arr) => v > 0 && arr.indexOf(v) === i
  );

  const handleSubmit = async () => {
    if (amount <= 0 || amount > remaining) return;

    setLoading(true);

    if (mode === "Razorpay") {
      await openRazorpay();
      setLoading(false);
      return;
    }

    try {
      await onAddPayment(amount, mode);
      setStatus("success");
      toast(`₹${amount} received via ${mode}`, "success");

      setTimeout(() => {
        setShowReceipt(true);
      }, 800);
    } catch {
      setStatus("failed");
      toast("Payment failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const openRazorpay = async () => {
    console.log("Opening Razorpay...");
    if (!(window as any).Razorpay) {
      alert("Razorpay SDK not loaded");
      return;
    }
    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    console.log("Create order response:", res);

    const order = await res.json();
    console.log("Order:", order);

    const options: any = {
      key: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "Elysium POS",
      order_id: order.id,

      handler: async function (response: any) {
        setStatus("processing");

        try {
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          const data = await verifyRes.json();

          if (data.success) {
            await onAddPayment(amount, "Razorpay");

            setStatus("success");
            toast(`₹${amount} received successfully`, "success");

            setTimeout(() => {
              setShowReceipt(true);
            }, 800);
          } else {
            setStatus("failed");
            toast("Payment verification failed", "error");
          }
        } catch {
          setStatus("failed");
          toast("Something went wrong", "error");
        }
      },

      modal: {
        ondismiss: function () {
          setStatus("cancelled");
          toast("Payment cancelled", "info");
        },
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="relative w-full sm:max-w-md bg-white dark:bg-zinc-900 rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-6"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
        >
          <X
            size={18}
            className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          />
        </button>

        {showReceipt ? (
          <ReceiptView order={order} amount={amount} onClose={onClose} />
        ) : (
          <>
            {/* Header */}
            <div>
              <h2 className="text-lg font-semibold text-zinc-800 dark:text-white">
                Split Payment
              </h2>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-indigo-600"
                />
              </div>

              <div className="flex justify-between text-sm text-zinc-500 dark:text-zinc-400">
                <span>₹{totalPaid.toFixed(2)} paid</span>
                <span>₹{remaining.toFixed(2)} remaining</span>
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-3">
              <input
                type="number"
                value={amount}
                max={remaining}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full border rounded-xl p-3 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />

              <div className="flex gap-2 flex-wrap">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    onClick={() => setAmount(q)}
                    className="px-3 py-1.5 rounded-lg text-sm bg-zinc-100 dark:bg-zinc-800 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition"
                  >
                    ₹{q}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Mode Dropdown */}
            <PaymentModeDropdown value={mode} onChange={setMode} />

            {/* Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || remaining <= 0}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {status === "processing" && (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Verifying...
                </>
              )}

              {status === "success" && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 size={20} className="text-emerald-500" />
                  Payment Successful
                </motion.div>
              )}

              {status === "failed" && (
                <span className="text-rose-200 font-semibold">
                  Payment Failed
                </span>
              )}

              {status === "cancelled" && "Payment Cancelled"}

              {status === "idle" && "Add Payment"}
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentModal;
