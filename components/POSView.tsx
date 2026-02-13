
import React from 'react';
import { Search, CheckCircle2, XCircle } from 'lucide-react';
import MenuCard from './MenuCard';
import CartPanel from './CartPanel';
import { MenuItem, Category, CartItem, Table } from '../types';

interface POSViewProps {
  selectedTable: Table | undefined;
  setSelectedTableId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  CATEGORIES: Category[];
  activeCategory: Category;
  setActiveCategory: (cat: Category) => void;
  menuItems: MenuItem[];
  addToCart: (item: MenuItem) => void;
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  handleCheckout: () => void;
  upsellSuggestions: string[];
}

const POSView: React.FC<POSViewProps> = ({
  selectedTable, setSelectedTableId, searchQuery, setSearchQuery, CATEGORIES, activeCategory, setActiveCategory,
  menuItems, addToCart, cart, updateQuantity, removeFromCart, handleCheckout, upsellSuggestions
}) => {
  return (
    <div className="flex h-full flex-col lg:flex-row pb-20 lg:pb-0">
      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-12 py-12 border-b border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 flex flex-col gap-10 sticky top-0 z-20">
          <div className="flex items-center justify-between">
             <h1 className="text-5xl font-black uppercase tracking-tighter">Menu Terminal</h1>
             <div className="flex items-center gap-8">
                {selectedTable && (
                  <div className="bg-indigo-600 text-white px-8 py-3.5 rounded-[2rem] flex items-center gap-4 shadow-xl">
                    <CheckCircle2 size={24} />
                    <span className="text-xs font-black uppercase tracking-widest">Table {selectedTable.number}</span>
                    <button onClick={() => setSelectedTableId(null)} className="ml-2 opacity-60 hover:opacity-100"><XCircle size={20}/></button>
                  </div>
                )}
                <div className="hidden md:flex items-center gap-6 bg-zinc-100 dark:bg-zinc-900 px-10 py-5 rounded-[2rem] w-96 border border-zinc-200 dark:border-zinc-800 focus-within:border-indigo-500">
                  <Search size={24} className="text-zinc-400" />
                  <input placeholder="Search items..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-xs font-black uppercase tracking-widest w-full dark:text-white" />
                </div>
             </div>
          </div>
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-12 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all border-2 ${activeCategory === cat ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-100 dark:border-zinc-800 hover:border-indigo-500/40'}`}>{cat}</button>
            ))}
          </div>
        </header>
        <div className="flex-1 p-12 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {menuItems.filter(i => i.category === activeCategory && i.name.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
              <MenuCard key={item.id} item={item} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      </div>
      <div className="w-full lg:w-[480px] shrink-0">
        <CartPanel 
          cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} onCheckout={handleCheckout} 
          upsellSuggestions={upsellSuggestions} fullMenu={menuItems} addToCart={addToCart} tableNumber={selectedTable?.number} 
        />
      </div>
    </div>
  );
};

export default POSView;
