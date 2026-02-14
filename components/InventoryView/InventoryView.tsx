import React, { useState, useMemo } from "react";
import { MenuItem, Category } from "../../types";
import InventoryHeader from "./InventoryHeader";
import InventoryGrid from "./InventoryGrid";
import InventoryModal from "./InventoryModal";

interface InventoryViewProps {
  handleAddDish: (dish: MenuItem) => void;
  handleUpdateDish: (id: string, updates: Partial<MenuItem>) => void;
  handleDeleteDish: (id: string) => void;
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
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [menuItems, search, activeCategory]);

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

  return (
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 relative font-sans">
      <InventoryHeader
        stats={stats}
        search={search}
        setSearch={setSearch}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        CATEGORIES={CATEGORIES}
        openAddForm={() => setIsFormOpen(true)}
      />

      <InventoryGrid
        items={filteredItems}
        openEditForm={(item) => {
          setEditingItem(item);
          setIsFormOpen(true);
        }}
        handleDeleteDish={handleDeleteDish}
        handleUpdateDish={handleUpdateDish}
      />

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
