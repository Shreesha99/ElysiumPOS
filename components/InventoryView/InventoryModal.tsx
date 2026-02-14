import React, { useState, useEffect } from "react";
import { MenuItem, Category } from "@/types";
import { X, ImageIcon, DollarSign, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingItem: MenuItem | null;
  setEditingItem: React.Dispatch<React.SetStateAction<MenuItem | null>>;
  handleAddDish: (dish: MenuItem) => void;
  handleUpdateDish: (id: string, updates: Partial<MenuItem>) => void;
  CATEGORIES: Category[];
}

const InventoryModal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  editingItem,
  setEditingItem,
  handleAddDish,
  handleUpdateDish,
  CATEGORIES,
}) => {
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formStock, setFormStock] = useState<number>(20);
  const [formCategory, setFormCategory] = useState<Category>(CATEGORIES[0]);
  const [formImage, setFormImage] = useState(
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600"
  );

  useEffect(() => {
    if (editingItem) {
      setFormName(editingItem.name);
      setFormDesc(editingItem.description);
      setFormPrice(editingItem.price);
      setFormStock(editingItem.stock);
      setFormCategory(editingItem.category);
      setFormImage(editingItem.image);
    }
  }, [editingItem]);

  const resetForm = () => {
    setFormName("");
    setFormDesc("");
    setFormPrice(0);
    setFormStock(20);
    setFormCategory(CATEGORIES[0]);
    setFormImage(
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600"
    );
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      handleUpdateDish(editingItem.id, {
        name: formName,
        description: formDesc,
        price: formPrice,
        stock: formStock,
        category: formCategory,
        image: formImage,
      });
    } else {
      handleAddDish({
        id: `m-${Date.now()}`,
        name: formName,
        description: formDesc,
        price: formPrice,
        stock: formStock,
        category: formCategory,
        image: formImage,
      });
    }

    setIsOpen(false);
    resetForm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-5xl h-[80vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl z-[70] border border-zinc-200 dark:border-zinc-800 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-10 py-6 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h3 className="text-2xl font-semibold dark:text-white">
                  {editingItem ? "Edit Asset" : "New Asset"}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Configure registry details
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-zinc-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 grid grid-cols-2 gap-10 px-10 py-8"
            >
              {/* Left Column – Image */}
              <div className="flex flex-col gap-6">
                <div className="relative h-[260px] rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={formImage}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-500">
                    Image URL
                  </label>
                  <input
                    required
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="mt-2 w-full px-4 py-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
              </div>

              {/* Right Column – Inputs */}
              <div className="flex flex-col justify-between">
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-semibold text-zinc-500">
                      Name
                    </label>
                    <input
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="mt-2 w-full px-4 py-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-zinc-500">
                        Price
                      </label>
                      <input
                        type="number"
                        required
                        value={formPrice}
                        onChange={(e) => setFormPrice(Number(e.target.value))}
                        className="mt-2 w-full px-4 py-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-zinc-500">
                        Stock
                      </label>
                      <input
                        type="number"
                        required
                        value={formStock}
                        onChange={(e) => setFormStock(Number(e.target.value))}
                        className="mt-2 w-full px-4 py-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-500">
                      Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) =>
                        setFormCategory(e.target.value as Category)
                      }
                      className="mt-2 w-full px-4 py-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-500">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      className="mt-2 w-full px-4 py-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-md"
                  >
                    {editingItem ? "Save Changes" : "Create Asset"}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default InventoryModal;
