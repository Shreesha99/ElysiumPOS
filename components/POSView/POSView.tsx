import React, { useState, useEffect, useMemo } from "react";
import {
  Utensils,
  ShoppingBag,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import SearchBar from "./SearchBar";
import MenuGridSection from "./MenuGridSection";
import CartPanel from "../CartPanel";

import { MenuItem, Category, CartItem, Table, OrderType } from "../../types";
import MenuFiltersBar from "./MenuFiltersBar";
import SectionHeader from "@/components/ui/SectionHeader";

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
  isSubmittingOrder: boolean;
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
  isSubmittingOrder,
}) => {
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [isCartCollapsed, setIsCartCollapsed] = useState(false);

  const [foodFilter, setFoodFilter] = useState<
    "All" | "Veg" | "NonVeg" | "Egg"
  >(() => {
    const saved = localStorage.getItem("foodFilter");
    return (saved as any) || "All";
  });

  const [sortBy, setSortBy] = useState<
    "relevance" | "priceLow" | "priceHigh" | "name"
  >("relevance");

  useEffect(() => {
    localStorage.setItem("foodFilter", foodFilter);
  }, [foodFilter]);

  useEffect(() => {
    document.body.style.overflow = isMobileCartOpen ? "hidden" : "";
  }, [isMobileCartOpen]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const query = searchQuery.trim().toLowerCase();

      // Dietary filter
      if (foodFilter !== "All" && item.foodType !== foodFilter) {
        return false;
      }

      // Always respect category
      if (item.category !== activeCategory) {
        return false;
      }

      // If no search, just category filtering
      if (!query) {
        return true;
      }

      const searchableText = `${item.name} ${item.description}`
        .toLowerCase()
        .replace(/[^\w\s]/g, "");

      const tokens = query.split(/\s+/).filter(Boolean);

      // Advanced AND token matching
      return tokens.every((token) => searchableText.includes(token));
    });
  }, [menuItems, foodFilter, searchQuery, activeCategory]);

  const processedItems = useMemo(() => {
    const items = [...filteredItems];

    if (sortBy === "priceLow") items.sort((a, b) => a.price - b.price);
    if (sortBy === "priceHigh") items.sort((a, b) => b.price - a.price);
    if (sortBy === "name") items.sort((a, b) => a.name.localeCompare(b.name));

    return items;
  }, [filteredItems, sortBy]);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const filterCounts = {
    All: menuItems.length,
    Veg: menuItems.filter((i) => i.foodType === "Veg").length,
    NonVeg: menuItems.filter((i) => i.foodType === "NonVeg").length,
    Egg: menuItems.filter((i) => i.foodType === "Egg").length,
  };

  return (
    <div className="relative flex h-screen w-full bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      {/* MAIN SECTION */}
      <div
        className={`flex-1 flex flex-col min-w-0 border-r border-zinc-200 dark:border-zinc-800 overflow-hidden ${
          isSubmittingOrder ? "pointer-events-none opacity-70" : ""
        }`}
      >
        <SectionHeader
          defaultExpanded={false}
          disabled={isSubmittingOrder}
          icon={<Utensils size={22} />}
          title="Order Management"
          subtitle="Browse menu, create orders, and manage active sessions"
          rightContent={
            <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <button
                disabled={isSubmittingOrder}
                onClick={() => setOrderType("Dining")}
                className={`px-4 py-2 rounded-md text-sm flex items-center gap-2 ${
                  orderType === "Dining"
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                <Utensils size={16} />
                Dine In
              </button>

              <button
                disabled={isSubmittingOrder}
                onClick={() => {
                  setOrderType("Takeaway");
                  setSelectedTableId(null);
                }}
                className={`px-4 py-2 rounded-md text-sm flex items-center gap-2 ${
                  orderType === "Takeaway"
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                <ShoppingBag size={16} />
                Takeaway
              </button>
            </div>
          }
          /* 👇 SEARCH ALWAYS VISIBLE */
          searchContent={
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          }
          /* 👇 COLLAPSIBLE FILTER SECTION */
          bottomContent={
            <>
              {orderType === "Dining" && (
                <div
                  className={`flex items-center justify-between gap-3 px-4 py-2 rounded-lg border text-sm ${
                    selectedTable
                      ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                      : "bg-rose-50 border-rose-200 text-rose-500"
                  }`}
                >
                  <span>
                    {selectedTable
                      ? `Table T-${selectedTable.number}`
                      : "Table not assigned"}
                  </span>

                  {selectedTable && (
                    <button
                      disabled={isSubmittingOrder}
                      onClick={() => setSelectedTableId(null)}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              )}

              <MenuFiltersBar
                CATEGORIES={CATEGORIES}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                foodFilter={foodFilter}
                setFoodFilter={setFoodFilter}
                filterCounts={filterCounts}
                sortBy={sortBy}
                setSortBy={setSortBy}
                resultCount={processedItems.length}
                isSubmittingOrder={isSubmittingOrder}
              />
            </>
          }
        />

        {/* GRID */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-28 lg:pb-6">
          <div className="max-w-[1800px] mx-auto">
            <MenuGridSection
              items={processedItems}
              searchQuery={searchQuery}
              onAddToCart={addToCart}
            />
          </div>
        </div>
      </div>

      {/* DESKTOP CART */}
      <div className="hidden lg:flex h-full">
        <div
          className={`relative h-full transition-all duration-300 ${
            isCartCollapsed ? "w-16" : "w-[380px] xl:w-[440px] 2xl:w-[480px]"
          }`}
        >
          <button
            disabled={isSubmittingOrder}
            onClick={() => setIsCartCollapsed(!isCartCollapsed)}
            className="absolute -left-3 top-6 z-30 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-md rounded-full p-2"
          >
            {isCartCollapsed ? (
              <ChevronLeft size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>

          {isCartCollapsed ? (
            <div className="h-full w-full flex items-center justify-center bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800">
              <ShoppingCart size={22} className="text-zinc-400" />
            </div>
          ) : (
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
              isCheckoutLoading={isSubmittingOrder}
            />
          )}
        </div>
      </div>

      {/* MOBILE BUTTON */}
      <div className="lg:hidden fixed bottom-20 right-6 z-40">
        <motion.button
          disabled={isSubmittingOrder}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMobileCartOpen(true)}
          className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xl relative disabled:bg-zinc-400"
        >
          <ShoppingCart size={24} />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
              {cartItemsCount}
            </span>
          )}
        </motion.button>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileCartOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileCartOpen(false)}
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="fixed bottom-0 left-0 right-0 h-[90%] bg-white dark:bg-zinc-900 rounded-t-2xl z-50 flex flex-col"
            >
              <div className="relative px-6 py-4 border-b">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 h-1.5 w-12 bg-zinc-300 rounded-full" />
                <button
                  onClick={() => setIsMobileCartOpen(false)}
                  className="absolute right-6 top-4"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                <CartPanel
                  cart={cart}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                  onCheckout={() => {
                    handleCheckout();
                    setIsMobileCartOpen(false);
                  }}
                  upsellSuggestions={upsellSuggestions}
                  fullMenu={menuItems}
                  addToCart={addToCart}
                  tableNumber={selectedTable?.number}
                  orderType={orderType}
                  isCheckoutLoading={isSubmittingOrder}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* GLOBAL PROCESSING OVERLAY */}
      {isSubmittingOrder && (
        <div className="absolute inset-0 z-[200] bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm flex items-center justify-center">
          <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 px-6 py-4 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800">
            <Loader2 size={20} className="animate-spin text-indigo-600" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold dark:text-white">
                Finalizing Order
              </span>
              <span className="text-xs text-zinc-400">
                Please wait while we confirm the transaction
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSView;
