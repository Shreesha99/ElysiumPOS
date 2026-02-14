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
      className="group bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative aspect-[16/10] sm:aspect-video lg:aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
        />
        
        {/* Floating Price */}
        <div className="absolute top-2.5 right-2.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-lg border border-zinc-100/50 dark:border-zinc-800/50">
          <span className="text-zinc-950 dark:text-white font-black text-[10px] sm:text-xs tracking-tight">₹{item.price.toLocaleString()}</span>
        </div>

        {/* Status Chip */}
        {item.stock < 10 && (
          <div className="absolute top-2.5 left-2.5 bg-rose-500/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[7px] font-black text-white uppercase tracking-widest shadow-lg flex items-center gap-1 border border-white/10">
            <Zap size={8} fill="currentColor" /> Limited
          </div>
        )}
      </div>

      <div className="p-3.5 sm:p-5 flex flex-col flex-1 gap-3 sm:gap-4">
        <div className="min-h-0">
          <h3 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 leading-tight group-hover:text-indigo-600 transition-colors truncate">
            {item.name}
          </h3>
          <p className="text-[9px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 font-medium leading-relaxed mt-1 sm:mt-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
            {item.description}
          </p>
        </div>

        <div className="mt-auto">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
            className="w-full py-2.5 sm:py-3.5 bg-zinc-50 dark:bg-zinc-800 group-hover:bg-indigo-600 text-zinc-500 dark:text-zinc-400 group-hover:text-white rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.97] border border-transparent shadow-sm group-hover:shadow-indigo-500/20"
          >
            <Plus size={14} className="group-hover:rotate-90 transition-transform" /> 
            <span className="truncate">Add to order</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;