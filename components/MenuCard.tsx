import React from "react";
import { Plus, Zap } from "lucide-react";
import { MenuItem } from "@/types";

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

const DietaryIcon = ({ type }: { type: string }) => {
  if (type === "Veg") {
    return (
      <div className="w-4 h-4 border-2 border-emerald-600 flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="w-2 h-2 bg-emerald-600 rounded-full" />
      </div>
    );
  }

  if (type === "NonVeg") {
    return (
      <div className="w-4 h-4 border-2 border-rose-600 flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="w-2 h-2 bg-rose-600 rounded-full" />
      </div>
    );
  }

  if (type === "Egg") {
    return (
      <div className="w-4 h-4 border-2 border-amber-500 flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="w-2 h-2 bg-amber-500 rounded-full" />
      </div>
    );
  }

  return null;
};

const MenuCard: React.FC<MenuCardProps> = ({ item, onAddToCart }) => {
  const isLowStock = item.stock < 10;
  const isOutOfStock = item.stock === 0;

  return (
    <div className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
      {/* Image */}
      <div className="relative aspect-[16/10] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* FSSAI Dietary Indicator */}
        <div className="absolute top-3 left-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm p-1.5 rounded-md shadow-sm border border-zinc-200 dark:border-zinc-700">
          <DietaryIcon type={item.foodType} />
        </div>

        {/* Price */}
        <div className="absolute top-3 right-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 px-3 py-1 rounded-lg text-sm font-semibold text-zinc-900 dark:text-white shadow-sm">
          ₹{item.price.toLocaleString()}
        </div>

        {/* Low Stock Badge */}
        {isLowStock && !isOutOfStock && (
          <div className="absolute bottom-3 left-3 bg-rose-500 text-white text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1">
            <Zap size={12} />
            Limited
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
            {item.name}
          </h3>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
              {item.category}
            </span>
          </div>

          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Metadata */}
        <div className="mt-4 text-xs">
          {isOutOfStock ? (
            <span className="text-rose-500 font-medium">Out of stock</span>
          ) : (
            <span className="text-zinc-400">{item.stock} available</span>
          )}
        </div>

        {/* Button */}
        <div className="mt-4">
          <button
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
            className={`w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition ${
              isOutOfStock
                ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
            }`}
          >
            <Plus size={16} />
            Add to Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
