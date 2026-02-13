
import React from 'react';
import { Search, CheckCircle2, X, Tag, Utensils, ShoppingBag } from 'lucide-react';
import MenuCard from './MenuCard';
import CartPanel from './CartPanel';
import { MenuItem, Category, CartItem, Table, OrderType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

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
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
}

const POSView: React.FC<POSViewProps> = ({
  selectedTable, setSelectedTableId, searchQuery, setSearchQuery, CATEGORIES, activeCategory, setActiveCategory,
  menuItems, addToCart, cart, updateQuantity, removeFromCart, handleCheckout, upsellSuggestions,
  orderType, setOrderType
}) => {
  
  // Fully functional search: search across all items if there's a query, otherwise filter by category
  const filteredItems = menuItems.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          i.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // If searching, show all matches regardless of category to make it "fully functional"
    if (searchQuery.trim() !== '') return matchesSearch;
    
    // Otherwise filter by active category
    return i.category === activeCategory;
  });

  return (
    <div className="flex h-full flex-col lg:flex-row pb-20 lg:pb-0 bg-zinc-50 dark:bg-zinc-950">
      <div className="flex-1 flex flex-col min-w-0 border-r border-zinc-100 dark:border-zinc-900">
        <header className="px-8 py-8 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900 flex flex-col gap-6 sticky top-0 z-20 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div className="flex items-center gap-6">
               <div>
                 <h1 className="text-3xl font-black uppercase tracking-tighter dark:text-white">Order Hub</h1>
                 <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1 flex items-center gap-2">
                   <Tag size={10} className="text-indigo-500" /> Catalog Registry
                 </p>
               </div>

               {/* Order Type Toggle */}
               <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-800 ml-4">
                  <button 
                    onClick={() => setOrderType('Dining')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${orderType === 'Dining' ? 'bg-white dark:bg-zinc-800 text-indigo-600 shadow-sm' : 'text-zinc-400'}`}
                  >
                    <Utensils size={14} /> Dining
                  </button>
                  <button 
                    onClick={() => {
                      setOrderType('Takeaway');
                      setSelectedTableId(null);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${orderType === 'Takeaway' ? 'bg-white dark:bg-zinc-800 text-indigo-600 shadow-sm' : 'text-zinc-400'}`}
                  >
                    <ShoppingBag size={14} /> Takeaway
                  </button>
               </div>
             </div>

             <div className="flex items-center gap-4">
                <AnimatePresence mode="wait">
                  {orderType === 'Dining' && selectedTable ? (
                    <motion.div 
                      key="table-chip"
                      initial={{ scale: 0.9, opacity: 0, x: 20 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      exit={{ scale: 0.9, opacity: 0, x: 20 }}
                      className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-sm"
                    >
                      <CheckCircle2 size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Active Table {selectedTable.number}</span>
                      <button onClick={() => setSelectedTableId(null)} className="ml-1 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                        <X size={14}/>
                      </button>
                    </motion.div>
                  ) : orderType === 'Dining' ? (
                    <motion.div 
                      key="no-table"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 dark:bg-rose-900/10 px-4 py-2.5 rounded-2xl border border-rose-100 dark:border-rose-800/50"
                    >
                      Select table from Floor Map
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="takeaway-chip"
                      initial={{ scale: 0.9, opacity: 0, x: 20 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      exit={{ scale: 0.9, opacity: 0, x: 20 }}
                      className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-sm"
                    >
                      <ShoppingBag size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Takeaway Node</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative">
                  <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900 px-5 py-3 rounded-2xl w-full md:w-72 border border-transparent focus-within:border-indigo-500/50 focus-within:bg-white dark:focus-within:bg-zinc-900 transition-all shadow-inner">
                    <Search size={18} className="text-zinc-400" />
                    <input 
                      placeholder="Global asset search..." 
                      value={searchQuery} 
                      onChange={e => setSearchQuery(e.target.value)} 
                      className="bg-transparent border-none outline-none text-xs font-bold w-full dark:text-white placeholder:text-zinc-400" 
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="text-zinc-400 hover:text-zinc-600">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
             </div>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button 
                key={cat} 
                onClick={() => {
                  setActiveCategory(cat);
                  setSearchQuery(''); // Clear search when switching categories for standard UX
                }} 
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shrink-0 ${
                  activeCategory === cat && searchQuery === ''
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20' 
                    : 'bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-100 dark:border-zinc-800 hover:border-indigo-500/40 hover:text-indigo-600'
                }`}
              >
                {cat}
              </button>
            ))}
            {searchQuery !== '' && (
               <div className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 border border-indigo-200 dark:border-indigo-800 shadow-sm shrink-0">
                  Search results
               </div>
            )}
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto scrollbar-hide">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filteredItems.map(item => (
                <MenuCard key={item.id} item={item} onAddToCart={addToCart} />
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-20 text-zinc-400 opacity-40">
              <div className="p-10 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem] mb-6">
                <Search size={48} />
              </div>
              <p className="text-sm font-black uppercase tracking-widest">No assets matching selection</p>
              <p className="text-[10px] font-bold mt-2 uppercase tracking-widest">Adjust query or switch category</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="w-full lg:w-[420px] shrink-0 h-[60vh] lg:h-full">
        <CartPanel 
          cart={cart} 
          updateQuantity={updateQuantity} 
          removeFromCart={removeFromCart} 
          onCheckout={handleCheckout} 
          upsellSuggestions={upsellSuggestions} 
          fullMenu={menuItems} 
          addToCart={addToCart} 
          tableNumber={selectedTable?.number} 
          orderType={orderType}
        />
      </div>
    </div>
  );
};

export default POSView;
