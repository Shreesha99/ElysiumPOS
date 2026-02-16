import React from "react";
import { MenuItem } from "@/types";
import InventoryCard from "@/components/InventoryView/InventoryCard";
import { AnimatePresence } from "framer-motion";

interface Props {
  items: MenuItem[];
  openEditForm: (item: MenuItem) => void;
  handleDeleteDish: (id: string) => void;
  handleUpdateDish: (id: string, updates: Partial<MenuItem>) => void;
}

const InventoryGrid: React.FC<Props> = ({
  items,
  openEditForm,
  handleDeleteDish,
  handleUpdateDish,
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-10 no-scrollbar pb-40 lg:pb-10">
      <div className="max-w-[1600px] mx-auto">
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            {items.map((item) => (
              <InventoryCard
                key={item.id}
                item={item}
                openEditForm={openEditForm}
                handleDeleteDish={handleDeleteDish}
                handleUpdateDish={handleUpdateDish}
              />
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InventoryGrid;
