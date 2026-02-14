import React, { useState } from "react";
import {
  Search,
  CheckCircle2,
  X,
  Tag,
  Utensils,
  ShoppingBag,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import MenuCard from "./MenuCard";
import CartPanel from "./CartPanel";
import { MenuItem, Category, CartItem, Table, OrderType } from "../types";
import { motion, AnimatePresence } from "framer-motion";

interface POSViewProps {
  selectedTable: Table | undefined;
  setSelectedTableId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  CATEGORIES: Category[];
  activeCategory: Category;
  setActiveCategory: (cat: Category) => void;
  menuItems: MenuItem[];
  addToCart: (item: MenuItem) => void;
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  handleCheckout: () => void;
  upsellSuggestions: string[];
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
}

const POSView: React.FC<POSViewProps> = ({
  selectedTable,
  setSelectedTableId,
  searchQuery,
  setSearchQuery,
  CATEGORIES,
  activeCategory,
  setActiveCategory,
  menuItems,
  addToCart,
  cart,
  updateQuantity,
  removeFromCart,
  handleCheckout,
  upsellSuggestions,
  orderType,
  setOrderType,
}) => {
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [isCartCollapsed, setIsCartCollapsed] = useState(false);

  const filteredItems = menuItems.filter((i) => {
    const matchesSearch =
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (searchQuery.trim() !== "") return matchesSearch;
    return i.category === activeCategory;
  });

  React.useEffect(() => {
    if (isMobileCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileCartOpen]);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex w-full h-[100dvh] flex-col lg:flex-row bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* HEADER */}
        <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-40 shrink-0">
          <div className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
            {/* TIER 1 */}
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold dark:text-white">
                  Order Hub
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Browse catalog and manage live orders
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <button
                    onClick={() => setOrderType("Dining")}
                    className={`px-4 py-2 rounded-md text-sm transition ${
                      orderType === "Dining"
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                        : "text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    Dining
                  </button>

                  <button
                    onClick={() => {
                      setOrderType("Takeaway");
                      setSelectedTableId(null);
                    }}
                    className={`px-4 py-2 rounded-md text-sm transition ${
                      orderType === "Takeaway"
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                        : "text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    Takeaway
                  </button>
                </div>
              </div>
            </div>

            {/* TIER 2 */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* TABLE STATUS */}
              {orderType === "Dining" && (
                <div
                  className={`flex items-center justify-between gap-3 px-4 py-2 rounded-lg border text-sm min-w-[220px] ${
                    selectedTable
                      ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800 text-emerald-600"
                      : "bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800 text-rose-500"
                  }`}
                >
                  <span>
                    {selectedTable
                      ? `Table T-${selectedTable.number}`
                      : "No table selected"}
                  </span>

                  {selectedTable && (
                    <button onClick={() => setSelectedTableId(null)}>
                      <X size={14} />
                    </button>
                  )}
                </div>
              )}

              {/* SEARCH */}
              <div className="flex-1">
                <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800 px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 focus-within:ring-2 focus-within:ring-indigo-500 transition">
                  <Search size={16} className="text-zinc-400" />
                  <input
                    placeholder="Search menu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent outline-none w-full text-sm dark:text-white"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")}>
                      <X size={16} className="text-zinc-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* CATEGORY */}
            <div className="w-full overflow-x-auto">
              <div className="flex gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setSearchQuery("");
                    }}
                    className={`px-4 py-2 rounded-lg text-sm border transition whitespace-nowrap ${
                      activeCategory === cat && searchQuery === ""
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-transparent"
                        : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* GRID */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="w-full lg:max-w-[1800px] lg:mx-auto">
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {filteredItems.map((item) => (
                  <MenuCard key={item.id} item={item} onAddToCart={addToCart} />
                ))}
              </div>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center text-zinc-300 dark:text-zinc-800">
                <Search size={48} />
                <p className="text-xs font-black uppercase tracking-[0.2em] mt-4">
                  Zero results found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DESKTOP CART */}
      <div
        className={`hidden lg:flex relative transition-all duration-300 ease-in-out ${
          isCartCollapsed ? "w-16" : "w-[380px] xl:w-[440px] 2xl:w-[480px]"
        }`}
      >
        <div className="relative flex-1 flex">
          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCartCollapsed(!isCartCollapsed)}
            className="absolute -left-3 top-6 z-30 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-md rounded-full p-2 hover:scale-105 transition-all"
          >
            {isCartCollapsed ? (
              <ChevronLeft size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>

          {/* Collapsed Rail */}
          {isCartCollapsed && (
            <div className="w-full h-full flex items-center justify-center bg-white dark:bg-zinc-950 border-l border-zinc-100 dark:border-zinc-800">
              <ShoppingCart size={22} className="text-zinc-400" />
            </div>
          )}

          {/* Expanded Panel */}
          {!isCartCollapsed && (
            <div className="w-full h-full">
              <CartPanel
                cart={cart}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                onCheckout={handleCheckout}
                upsellSuggestions={upsellSuggestions}
                fullMenu={menuItems}
                addToCart={addToCart}
                tableNumber={selectedTable?.number}
                orderType={orderType}
              />
            </div>
          )}
        </div>
      </div>

      {/* MOBILE CART BUTTON */}
      <div className="lg:hidden fixed bottom-[88px] right-6 z-40">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMobileCartOpen(true)}
          className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl relative"
        >
          <ShoppingCart size={24} />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">
              {cartItemsCount}
            </span>
          )}
        </motion.button>
      </div>

      {/* MOBILE DRAWER */}
      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileCartOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-[100]"
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Overlay */}
            <motion.div
              className="absolute inset-0 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileCartOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="absolute inset-0 bg-white dark:bg-zinc-950 flex flex-col"
            >
              {/* Mobile Sheet Header */}
              <div className="lg:hidden shrink-0 pt-3 pb-2 border-b border-zinc-100 dark:border-zinc-800 relative">
                <div className="h-1.5 w-12 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto mb-3" />

                <button
                  onClick={() => setIsMobileCartOpen(false)}
                  className="absolute right-4 top-3 p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800"
                >
                  <X size={18} />
                </button>
              </div>

              <CartPanel
                cart={cart}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                onCheckout={() => {
                  handleCheckout();
                  if (cart.length > 0) setIsMobileCartOpen(false);
                }}
                upsellSuggestions={upsellSuggestions}
                fullMenu={menuItems}
                addToCart={addToCart}
                tableNumber={selectedTable?.number}
                orderType={orderType}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default POSView;
