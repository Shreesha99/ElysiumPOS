
import React from 'react';
import { MenuItem } from '../types';
import { Plus, Zap } from 'lucide-react';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, onAddToCart }) => {
  return (
    <div 
      className="group bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-500/50 transition-all duration-300 flex flex-col h-full"
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-white/20">
          <span className="text-zinc-900 dark:text-white font-extrabold text-sm">₹{item.price.toLocaleString()}</span>
        </div>

        {item.stock < 10 && (
          <div className="absolute top-3 left-3 bg-rose-500 px-2 py-1 rounded-lg text-[8px] font-bold text-white uppercase tracking-widest shadow-lg flex items-center gap-1">
            <Zap size={8} fill="currentColor" /> Low Stock
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 leading-tight group-hover:text-indigo-600 transition-colors mb-2">{item.name}</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 font-medium leading-relaxed mb-4">
          {item.description}
        </p>
        <div className="mt-auto">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
            className="w-full py-3 bg-zinc-50 dark:bg-zinc-800 group-hover:bg-indigo-600 text-zinc-900 dark:text-white group-hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Plus size={14} /> Add to Terminal
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
