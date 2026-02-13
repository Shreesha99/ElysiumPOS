
import React from 'react';
import { MenuItem } from '../types';
import { Plus } from 'lucide-react';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, onAddToCart }) => {
  return (
    <div 
      onClick={() => onAddToCart(item)}
      className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-500"
    >
      <div className="aspect-[5/4] relative overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white/20">
          <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">${item.price.toFixed(2)}</span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
           <button className="bg-white text-zinc-900 w-full py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2">
             <Plus size={14} strokeWidth={3} /> ADD TO ORDER
           </button>
        </div>

        {item.stock < 10 && (
          <div className="absolute top-3 left-3 bg-rose-500 px-2.5 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-tighter">
            LOW STOCK: {item.stock}
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-[15px] text-zinc-800 dark:text-zinc-100 leading-tight group-hover:text-indigo-600 transition-colors">{item.name}</h3>
        <p className="text-[12px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-2 font-medium">{item.description}</p>
      </div>
    </div>
  );
};

export default MenuCard;
