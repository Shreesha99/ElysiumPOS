import React from "react";
import { CartItem, MenuItem, OrderType } from "../types";
import {
  ShoppingBag,
  Minus,
  Plus,
  Sparkles,
  LayoutGrid,
  X,
  Utensils,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CartPanelProps {
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  onCheckout: () => void;
  upsellSuggestions: string[];
  fullMenu: MenuItem[];
  addToCart: (item: MenuItem) => void;
  tableNumber?: number;
  orderType: OrderType;
}

const CartPanel: React.FC<CartPanelProps> = ({
  cart,
  updateQuantity,
  removeFromCart,
  onCheckout,
  upsellSuggestions,
  fullMenu,
  addToCart,
  tableNumber,
  orderType,
}) => {
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.12;
  const total = subtotal + tax;
  const suggestedItems = fullMenu.filter((item) =>
    upsellSuggestions.includes(item.name)
  );

  return (
    <div className="flex flex-col h-full min-h-0 bg-white dark:bg-zinc-950 border-l border-zinc-100 dark:border-zinc-800">
      {/* HEADER */}
      <div className="px-6 py-6 border-b border-zinc-100 dark:border-zinc-900 shrink-0">
        <h2 className="font-extrabold text-lg dark:text-white uppercase tracking-tight">
          Current Session
        </h2>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-[env(safe-area-inset-bottom)] space-y-6 min-h-0">
        <AnimatePresence>
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400">
              <ShoppingBag size={40} />
              <p className="mt-4 text-xs font-black uppercase tracking-widest">
                Registry dormant
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl"
              >
                <img
                  src={item.image}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-bold text-sm dark:text-white">
                    {item.name}
                  </p>
                  <p className="text-indigo-600 font-black text-sm">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, -1)}>
                    <Minus size={14} />
                  </button>
                  <span className="font-black">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>
                    <Plus size={14} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER */}
      <div className="px-6 py-6 border-t border-zinc-100 dark:border-zinc-900 shrink-0 space-y-4">
        <div className="flex justify-between font-bold">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Tax</span>
          <span>₹{tax.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-lg font-black text-indigo-600">
          <span>Total</span>
          <span>₹{total.toLocaleString()}</span>
        </div>

        <button
          disabled={
            cart.length === 0 || (orderType === "Dining" && !tableNumber)
          }
          onClick={onCheckout}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black uppercase tracking-widest disabled:bg-zinc-300"
        >
          {orderType === "Dining"
            ? tableNumber
              ? `Submit Order (T-${tableNumber})`
              : "Select Table"
            : "Confirm Takeaway"}
        </button>
      </div>
    </div>
  );
};

export default CartPanel;
