import React from "react";
import { CartItem, MenuItem, OrderType } from "../types";
import {
  ShoppingBag,
  Minus,
  Plus,
  Sparkles,
  X,
  Loader2,
  ShoppingCart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CartPanelProps {
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => Promise<void> | void;
  removeFromCart: (id: string) => Promise<void> | void;
  onCheckout: () => Promise<void> | void;
  upsellSuggestions: string[];
  fullMenu: MenuItem[];
  addToCart: (item: MenuItem) => Promise<void> | void;
  tableNumber?: number;
  orderType: OrderType;
  isCheckoutLoading?: boolean;
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
  isCheckoutLoading = false,
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

  const [qtyLoadingId, setQtyLoadingId] = React.useState<string | null>(null);
  const [removeLoadingId, setRemoveLoadingId] = React.useState<string | null>(
    null
  );
  const [upsellLoadingId, setUpsellLoadingId] = React.useState<string | null>(
    null
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800">
      {/* HEADER */}
      <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        <div className="flex items-center gap-2">
          <ShoppingCart size={18} className="text-indigo-600" />
          <h2 className="text-lg font-semibold dark:text-white">
            Current Order
          </h2>
        </div>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {orderType === "Dining"
            ? tableNumber
              ? `Table T-${tableNumber}`
              : "Table not assigned"
            : "Takeaway order"}
        </p>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 min-h-0">
        {cart.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400">
            <ShoppingBag size={40} />
            <p className="mt-4 text-sm font-semibold">Cart is empty</p>
            <p className="text-xs mt-1 text-zinc-400">Add items to begin</p>
          </div>
        )}

        <AnimatePresence>
          {cart.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700"
            >
              <img
                src={item.image}
                className="w-14 h-14 rounded-md object-cover"
              />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate dark:text-white">
                  {item.name}
                </p>
                <p className="text-sm font-semibold text-indigo-600 mt-1">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>

              {/* QTY CONTROLS */}
              <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1">
                <button
                  disabled={qtyLoadingId === item.id}
                  onClick={async () => {
                    setQtyLoadingId(item.id);
                    await updateQuantity(item.id, -1);
                    setQtyLoadingId(null);
                  }}
                  className="p-1 hover:text-rose-500 transition disabled:opacity-50"
                >
                  {qtyLoadingId === item.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Minus size={14} />
                  )}
                </button>

                <span className="w-6 text-center text-sm font-semibold">
                  {item.quantity}
                </span>

                <button
                  disabled={qtyLoadingId === item.id}
                  onClick={async () => {
                    setQtyLoadingId(item.id);
                    await updateQuantity(item.id, 1);
                    setQtyLoadingId(null);
                  }}
                  className="p-1 hover:text-indigo-600 transition disabled:opacity-50"
                >
                  {qtyLoadingId === item.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Plus size={14} />
                  )}
                </button>
              </div>

              {/* REMOVE */}
              <button
                disabled={removeLoadingId === item.id}
                onClick={async () => {
                  setRemoveLoadingId(item.id);
                  await removeFromCart(item.id);
                  setRemoveLoadingId(null);
                }}
                className="p-2 text-zinc-400 hover:text-rose-500 transition disabled:opacity-50"
              >
                {removeLoadingId === item.id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <X size={16} />
                )}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* UPSELL */}
        {cart.length > 0 && suggestedItems.length > 0 && (
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-indigo-500" />
              <p className="text-sm font-semibold dark:text-white">
                Smart Recommendations
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {suggestedItems.map((item) => (
                <button
                  key={item.id}
                  disabled={upsellLoadingId === item.id}
                  onClick={async () => {
                    setUpsellLoadingId(item.id);
                    await addToCart(item);
                    setUpsellLoadingId(null);
                  }}
                  className="px-3 py-1.5 text-xs rounded-md bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition disabled:opacity-50"
                >
                  {upsellLoadingId === item.id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    item.name
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="px-6 py-5 border-t border-zinc-200 dark:border-zinc-800 shrink-0 space-y-4 bg-white dark:bg-zinc-900">
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹{tax.toLocaleString()}</span>
          </div>

          <div className="flex justify-between font-semibold pt-2 border-t">
            <span>Total</span>
            <span className="text-indigo-600">₹{total.toLocaleString()}</span>
          </div>
        </div>

        <button
          disabled={
            isCheckoutLoading ||
            cart.length === 0 ||
            (orderType === "Dining" && !tableNumber)
          }
          onClick={onCheckout}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition disabled:bg-zinc-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isCheckoutLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Processing...
            </>
          ) : orderType === "Dining" ? (
            tableNumber ? (
              `Submit Order · T-${tableNumber}`
            ) : (
              "Assign Table"
            )
          ) : (
            "Place Takeaway Order"
          )}
        </button>
      </div>
    </div>
  );
};

export default CartPanel;
