import React from "react";
import { MenuItem } from "@/types";
import {
  Edit3,
  Trash2,
  AlertCircle,
  Minus,
  Plus,
  BarChart2,
} from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  item: MenuItem;
  openEditForm: (item: MenuItem) => void;
  handleDeleteDish: (id: string) => void;
  handleUpdateDish: (id: string, updates: Partial<MenuItem>) => void;
}

const InventoryCard: React.FC<Props> = ({
  item,
  openEditForm,
  handleDeleteDish,
  handleUpdateDish,
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Image Section */}
      <div className="relative h-44 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-white/90 dark:bg-zinc-950/90 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wide shadow">
          {item.category}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => openEditForm(item)}
            className="p-2 rounded-lg bg-white dark:bg-zinc-800 shadow hover:text-indigo-600 transition"
          >
            <Edit3 size={16} />
          </button>

          <button
            onClick={() => handleDeleteDish(item.id)}
            className="p-2 rounded-lg bg-white dark:bg-zinc-800 shadow text-rose-500 hover:bg-rose-500 hover:text-white transition"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Low Stock Warning */}
        {item.stock < 10 && (
          <div className="absolute bottom-3 left-3 bg-rose-500 text-white px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1 shadow">
            <AlertCircle size={14} />
            Low Stock
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Title & Price */}
        <div className="flex justify-between items-start mb-3">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold dark:text-white truncate">
              {item.name}
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Ref: {item.id.toUpperCase()}
            </p>
          </div>

          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            ₹{item.price.toLocaleString()}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-6">
          {item.description}
        </p>

        {/* Stock Section */}
        <div className="mt-auto border-t border-zinc-200 dark:border-zinc-800 pt-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
              <BarChart2 size={14} className="text-indigo-500" />
              Stock
            </div>

            <span
              className={`text-sm font-semibold ${
                item.stock < 10
                  ? "text-rose-500"
                  : "text-zinc-800 dark:text-white"
              }`}
            >
              {item.stock} units
            </span>
          </div>

          {/* Stock Controls */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1">
            <button
              onClick={() =>
                handleUpdateDish(item.id, {
                  stock: Math.max(0, item.stock - 1),
                })
              }
              className="flex-1 py-2 rounded-lg hover:bg-rose-500 hover:text-white transition flex items-center justify-center"
            >
              <Minus size={14} />
            </button>

            <div className="px-4 text-xs font-semibold text-zinc-500">
              Adjust
            </div>

            <button
              onClick={() =>
                handleUpdateDish(item.id, {
                  stock: item.stock + 1,
                })
              }
              className="flex-1 py-2 rounded-lg hover:bg-indigo-600 hover:text-white transition flex items-center justify-center"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InventoryCard;
