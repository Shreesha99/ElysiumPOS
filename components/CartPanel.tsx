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
    <div className="flex flex-col h-full min-h-0 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800">
      {/* HEADER */}
      <div className="px-6 py-6 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold dark:text-white">
              Active Order
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {orderType === "Dining"
                ? tableNumber
                  ? `Table T-${tableNumber}`
                  : "No table selected"
                : "Takeaway session"}
            </p>
          </div>

          <LayoutGrid size={18} className="text-zinc-400" />
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 min-h-0">
        <AnimatePresence>
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400 dark:text-zinc-600">
              <ShoppingBag size={40} />
              <p className="mt-4 text-sm font-medium">No items added yet</p>
              <p className="text-xs mt-1">
                Select items from the catalog to begin
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700"
              >
                <img
                  src={item.image}
                  className="w-14 h-14 rounded-md object-cover"
                />

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm dark:text-white truncate">
                    {item.name}
                  </p>
                  <p className="text-sm text-indigo-600 font-semibold mt-1">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 hover:text-rose-500 transition"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="text-sm font-semibold w-5 text-center">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 hover:text-indigo-600 transition"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-zinc-400 hover:text-rose-500 transition"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {/* UPSELL */}
        {cart.length > 0 && suggestedItems.length > 0 && (
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-indigo-500" />
              <p className="text-sm font-semibold dark:text-white">
                Recommended Add-Ons
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {suggestedItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="px-3 py-1.5 text-xs rounded-md bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="px-6 py-6 border-t border-zinc-200 dark:border-zinc-800 shrink-0 space-y-4 bg-white dark:bg-zinc-900">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
            <span>Tax (12%)</span>
            <span>₹{tax.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-lg font-semibold dark:text-white pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <span>Total</span>
            <span className="text-indigo-600">₹{total.toLocaleString()}</span>
          </div>
        </div>

        <button
          disabled={
            cart.length === 0 || (orderType === "Dining" && !tableNumber)
          }
          onClick={onCheckout}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-lg font-medium transition disabled:bg-zinc-300 disabled:cursor-not-allowed"
        >
          {orderType === "Dining"
            ? tableNumber
              ? `Submit Order for Table T-${tableNumber}`
              : "Select Table to Proceed"
            : "Confirm Takeaway Order"}
        </button>
      </div>
    </div>
  );
};

export default CartPanel;
