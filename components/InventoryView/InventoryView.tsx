import React, { useState, useMemo } from "react";
import { MenuItem, Category } from "@/types";
import { Package, Plus } from "lucide-react";

import SectionHeader from "@/components/ui/SectionHeader";
import SearchBar from "@/components/POSView/SearchBar";
import MenuFiltersBar from "@/components/POSView/MenuFiltersBar";
import InventoryGrid from "@/components/InventoryView/InventoryGrid";
import InventoryModal from "@/components/InventoryView/InventoryModal";

interface InventoryViewProps {
  handleAddDish: (dish: Omit<MenuItem, "id">) => Promise<void>;
  handleUpdateDish: (id: string, updates: Partial<MenuItem>) => Promise<void>;
  handleDeleteDish: (id: string) => Promise<void>;
  CATEGORIES: Category[];
  menuItems: MenuItem[];
}

const InventoryView: React.FC<InventoryViewProps> = ({
  handleAddDish,
  handleUpdateDish,
  handleDeleteDish,
  CATEGORIES,
  menuItems,
}) => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "Starters">(
    "Starters"
  );

  const [foodFilter, setFoodFilter] = useState<
    "All" | "Veg" | "NonVeg" | "Egg"
  >("All");

  const [sortBy, setSortBy] = useState<
    "relevance" | "priceLow" | "priceHigh" | "name"
  >("relevance");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  /* ----------------------- FILTER LOGIC (POS STYLE) ----------------------- */

  const filteredItems = useMemo(() => {
    const items = menuItems.filter((item) => {
      const query = search.trim().toLowerCase();

      if (foodFilter !== "All" && item.foodType !== foodFilter) {
        return false;
      }

      if (activeCategory !== "Starters" && item.category !== activeCategory) {
        return false;
      }

      if (!query) return true;

      const searchableText = `${item.name} ${item.description}`
        .toLowerCase()
        .replace(/[^\w\s]/g, "");

      const tokens = query.split(/\s+/).filter(Boolean);

      return tokens.every((token) => searchableText.includes(token));
    });

    if (sortBy === "priceLow") items.sort((a, b) => a.price - b.price);

    if (sortBy === "priceHigh") items.sort((a, b) => b.price - a.price);

    if (sortBy === "name") items.sort((a, b) => a.name.localeCompare(b.name));

    return items;
  }, [menuItems, search, activeCategory, foodFilter, sortBy]);

  /* ----------------------------- STATS ----------------------------- */

  const stats = useMemo(() => {
    const totalValue = menuItems.reduce(
      (acc, item) => acc + item.price * item.stock,
      0
    );

    const lowStockCount = menuItems.filter((i) => i.stock < 10).length;

    return {
      totalValue,
      lowStockCount,
      totalItems: menuItems.length,
    };
  }, [menuItems]);

  /* ------------------------ FILTER COUNTS ------------------------ */

  const filterCounts = {
    All: menuItems.length,
    Veg: menuItems.filter((i) => i.foodType === "Veg").length,
    NonVeg: menuItems.filter((i) => i.foodType === "NonVeg").length,
    Egg: menuItems.filter((i) => i.foodType === "Egg").length,
  };

  return (
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 relative font-sans">
      <SectionHeader
        defaultExpanded={false}
        icon={<Package size={22} />}
        title="Inventory Management"
        subtitle="Track stock levels, update dishes, and manage pricing"
        rightContent={
          <button
            onClick={() => {
              setEditingItem(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-sm"
          >
            <Plus size={16} />
            Add Dish
          </button>
        }
        /* 👇 SEARCH ALWAYS VISIBLE */
        searchContent={<SearchBar value={search} onChange={setSearch} />}
        /* 👇 COLLAPSIBLE SECTION */
        bottomContent={
          <>
            {/* STATS ROW */}
            <div className="hidden md:grid md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                <p className="text-xs text-zinc-500">Total Items</p>
                <p className="text-xl font-semibold dark:text-white">
                  {stats.totalItems}
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                <p className="text-xs text-zinc-500">Low Stock</p>
                <p className="text-xl font-semibold text-rose-500">
                  {stats.lowStockCount}
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                <p className="text-xs text-zinc-500">Total Value</p>
                <p className="text-xl font-semibold text-emerald-600">
                  ₹{stats.totalValue.toLocaleString()}
                </p>
              </div>
            </div>

            {/* FILTER BAR */}
            <MenuFiltersBar
              CATEGORIES={CATEGORIES}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              searchQuery={search}
              setSearchQuery={setSearch}
              foodFilter={foodFilter}
              setFoodFilter={setFoodFilter}
              filterCounts={filterCounts}
              sortBy={sortBy}
              setSortBy={setSortBy}
              resultCount={filteredItems.length}
              isSubmittingOrder={false}
            />
          </>
        }
      />

      {/* GRID */}
      <InventoryGrid
        items={filteredItems}
        searchQuery={search}
        activeCategory={activeCategory}
        foodFilter={foodFilter}
        openEditForm={(item) => {
          setEditingItem(item);
          setIsFormOpen(true);
        }}
        handleDeleteDish={handleDeleteDish}
        handleUpdateDish={handleUpdateDish}
      />

      {/* MODAL */}
      <InventoryModal
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        handleAddDish={handleAddDish}
        handleUpdateDish={handleUpdateDish}
        CATEGORIES={CATEGORIES}
      />
    </div>
  );
};

export default InventoryView;
