
import React, { useState } from 'react';
import { Search, CheckCircle2, X, Tag, Utensils, ShoppingBag, ShoppingCart } from 'lucide-react';
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
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  
  const filteredItems = menuItems.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          i.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (searchQuery.trim() !== '') return matchesSearch;
    return i.category === activeCategory;
  });

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex h-full flex-col lg:flex-row bg-zinc-50 dark:bg-zinc-950 overflow-hidden relative">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-zinc-100 dark:border-zinc-900 overflow-hidden h-full">
        <header className="px-4 sm:px-6 md:px-8 py-3 sm:py-5 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900 sticky top-0 z-30 shadow-sm shrink-0">
          <div className="max-w-[1600px] mx-auto space-y-3 sm:space-y-4">
            
            {/* Tier 1: Identity & Toggles */}
            <div className="flex items-center justify-between gap-3 sm:gap-4 overflow-hidden">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <h1 className="text-lg sm:text-xl md:text-2xl font-black uppercase tracking-tighter dark:text-white truncate">Order Hub</h1>
                <span className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900 text-[8px] font-black text-zinc-400 uppercase tracking-widest rounded-md border border-zinc-200 dark:border-zinc-800 shrink-0">
                  <Tag size={10} className="text-indigo-500" /> Catalog
                </span>
              </div>

              <div className="flex bg-zinc-100 dark:bg-zinc-900 p-0.5 sm:p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 shrink-0">
                <button 
                  onClick={() => setOrderType('Dining')}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${orderType === 'Dining' ? 'bg-white dark:bg-zinc-800 text-indigo-600 shadow-sm' : 'text-zinc-400'}`}
                >
                  <Utensils size={12} /> <span className="hidden xs:inline">Dining</span>
                </button>
                <button 
                  onClick={() => { setOrderType('Takeaway'); setSelectedTableId(null); }}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${orderType === 'Takeaway' ? 'bg-white dark:bg-zinc-800 text-indigo-600 shadow-sm' : 'text-zinc-400'}`}
                >
                  <ShoppingBag size={12} /> <span className="hidden xs:inline">Takeaway</span>
                </button>
              </div>
            </div>

            {/* Tier 2: Table Chip & Search Bar (Dynamic wrap on tablet) */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <AnimatePresence mode="wait">
                {orderType === 'Dining' && (
                  <motion.div 
                    key={selectedTable ? 'table' : 'no-table'}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                    className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest min-w-[140px] md:min-w-[160px] ${
                      selectedTable 
                        ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/50 text-emerald-600' 
                        : 'bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-800/50 text-rose-500'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {selectedTable ? <CheckCircle2 size={12} /> : <Utensils size={12} />}
                      <span className="truncate">{selectedTable ? `Node: T-${selectedTable.number}` : 'Select Floor Node'}</span>
                    </div>
                    {selectedTable && (
                      <button onClick={() => setSelectedTableId(null)} className="hover:bg-emerald-100 dark:hover:bg-emerald-800 rounded-md p-0.5 transition-colors">
                        <X size={12}/>
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex-1 relative group min-w-0">
                <div className="flex items-center gap-2.5 bg-zinc-100 dark:bg-zinc-900 px-3.5 py-2.5 rounded-xl sm:rounded-2xl border border-transparent group-focus-within:border-indigo-500/50 group-focus-within:bg-white dark:group-focus-within:bg-zinc-800 transition-all shadow-inner">
                  <Search size={14} className="text-zinc-400 shrink-0 group-focus-within:text-indigo-500" />
                  <input 
                    placeholder="Search catalog assets..." 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)} 
                    className="bg-transparent border-none outline-none text-[11px] font-bold w-full dark:text-white placeholder:text-zinc-400" 
                  />
                  {searchQuery && <button onClick={() => setSearchQuery('')} className="text-zinc-400 hover:text-rose-500 shrink-0"><X size={14} /></button>}
                </div>
              </div>
            </div>

            {/* Tier 3: Category Scroller */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
               <div className="flex gap-2">
                 {CATEGORIES.map(cat => (
                   <button 
                     key={cat} 
                     onClick={() => { setActiveCategory(cat); setSearchQuery(''); }} 
                     className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border shrink-0 ${
                       activeCategory === cat && searchQuery === ''
                         ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' 
                         : 'bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-100 dark:border-zinc-800 hover:border-indigo-500/40'
                     }`}
                   >
                     {cat}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </header>

        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-5 pb-32 lg:pb-8 scroll-smooth no-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {filteredItems.map(item => (
                  <MenuCard key={item.id} item={item} onAddToCart={addToCart} />
                ))}
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-zinc-300 dark:text-zinc-800 opacity-50">
                <Search size={48} className="mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Zero results found</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Desktop Side Panel */}
      <div className="hidden lg:block w-[360px] xl:w-[420px] 2xl:w-[460px] shrink-0 h-full">
        <CartPanel 
          cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} 
          onCheckout={handleCheckout} upsellSuggestions={upsellSuggestions} 
          fullMenu={menuItems} addToCart={addToCart} 
          tableNumber={selectedTable?.number} orderType={orderType}
        />
      </div>

      {/* Mobile Cart Floating Action */}
      <div className="lg:hidden fixed bottom-24 right-5 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setIsMobileCartOpen(true)}
          className="w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl relative"
        >
          <ShoppingCart size={22} />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-950">
              {cartItemsCount}
            </span>
          )}
        </motion.button>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileCartOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="lg:hidden fixed inset-x-0 bottom-0 top-[10%] bg-white dark:bg-zinc-950 z-[70] rounded-t-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="h-1.5 w-12 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto my-4 shrink-0" />
              <div className="absolute top-5 right-6 z-[80]">
                <button onClick={() => setIsMobileCartOpen(false)} className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-500"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-hidden">
                <CartPanel 
                  cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} 
                  onCheckout={() => { handleCheckout(); if (cart.length > 0) setIsMobileCartOpen(false); }} 
                  upsellSuggestions={upsellSuggestions} fullMenu={menuItems} 
                  addToCart={addToCart} tableNumber={selectedTable?.number} orderType={orderType}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default POSView;
