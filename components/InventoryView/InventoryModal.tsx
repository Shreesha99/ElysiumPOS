import React, { useState, useEffect } from "react";
import { MenuItem, Category, FoodType } from "@/types";
import { X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingItem: MenuItem | null;
  setEditingItem: React.Dispatch<React.SetStateAction<MenuItem | null>>;
  handleAddDish: (dish: Omit<MenuItem, "id">) => Promise<void>;
  handleUpdateDish: (id: string, updates: Partial<MenuItem>) => Promise<void>;
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formStock, setFormStock] = useState<number>(20);
  const [formCategory, setFormCategory] = useState<Category>(CATEGORIES[0]);
  const [formImage, setFormImage] = useState(
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600"
  );
  const [formFoodType, setFormFoodType] = useState<FoodType>("Veg");

  useEffect(() => {
    if (editingItem) {
      setFormName(editingItem.name);
      setFormDesc(editingItem.description);
      setFormPrice(editingItem.price);
      setFormStock(editingItem.stock);
      setFormCategory(editingItem.category);
      setFormImage(editingItem.image);
      setFormFoodType(editingItem.foodType);
    } else {
      resetForm();
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
    setFormFoodType("Veg");
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      if (editingItem) {
        await handleUpdateDish(editingItem.id, {
          name: formName,
          description: formDesc,
          price: formPrice,
          stock: formStock,
          category: formCategory,
          image: formImage,
          foodType: formFoodType,
        });
      } else {
        await handleAddDish({
          name: formName,
          description: formDesc,
          price: formPrice,
          stock: formStock,
          category: formCategory,
          image: formImage,
          foodType: formFoodType,
        });
      }

      setIsOpen(false);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !isSubmitting && setIsOpen(false)}
          />

          {/* Center Wrapper */}
          <div className="absolute inset-0 flex sm:items-center sm:justify-center">
            <motion.div
              initial={{ scale: 0.97, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.97, opacity: 0, y: 12 }}
              transition={{ duration: 0.25 }}
              className="
                w-full
                h-full
                sm:h-auto
                sm:max-h-[90vh]
                sm:max-w-5xl
                bg-white dark:bg-zinc-900
                sm:rounded-3xl
                border border-zinc-200 dark:border-zinc-800
                shadow-2xl
                flex flex-col
                overflow-hidden
              "
            >
              {/* HEADER */}
              <div className="flex justify-between items-center px-6 sm:px-10 py-5 border-b border-zinc-200 dark:border-zinc-800">
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold dark:text-white">
                    {editingItem ? "Edit Asset" : "Create New Asset"}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Configure inventory details
                  </p>
                </div>

                <button
                  disabled={isSubmitting}
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col flex-1 min-h-0"
              >
                {/* SCROLL BODY */}
                <div
                  className={`
                    flex-1
                    min-h-0
                    overflow-y-auto
                    px-6 sm:px-10
                    py-6
                    ${isSubmitting ? "opacity-70 pointer-events-none" : ""}
                  `}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* LEFT */}
                    <div className="space-y-6">
                      <div className="h-52 sm:h-64 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
                        <img
                          src={formImage}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wide">
                          Image URL
                        </label>
                        <input
                          required
                          value={formImage}
                          onChange={(e) => setFormImage(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                        />
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wide">
                          Name
                        </label>
                        <input
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wide">
                            Price (₹)
                          </label>
                          <input
                            type="number"
                            required
                            value={formPrice}
                            onChange={(e) =>
                              setFormPrice(Number(e.target.value))
                            }
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white appearance-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wide">
                            Stock
                          </label>
                          <input
                            type="number"
                            required
                            value={formStock}
                            onChange={(e) =>
                              setFormStock(Number(e.target.value))
                            }
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white appearance-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wide">
                          Category
                        </label>
                        <select
                          value={formCategory}
                          onChange={(e) =>
                            setFormCategory(e.target.value as Category)
                          }
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wide">
                          Food Type
                        </label>
                        <select
                          value={formFoodType}
                          onChange={(e) =>
                            setFormFoodType(e.target.value as FoodType)
                          }
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                        >
                          <option value="Veg">Veg</option>
                          <option value="NonVeg">Non Veg</option>
                          <option value="Egg">Egg</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wide">
                          Description
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={formDesc}
                          onChange={(e) => setFormDesc(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="border-t border-zinc-200 dark:border-zinc-800 px-6 sm:px-10 py-5 bg-white dark:bg-zinc-900 flex justify-end gap-4">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-md flex items-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting && (
                      <Loader2 size={16} className="animate-spin" />
                    )}
                    {editingItem ? "Save Changes" : "Create Asset"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default InventoryModal;
