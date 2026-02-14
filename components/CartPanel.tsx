import React from 'react';
import { CartItem, MenuItem, OrderType } from '../types';
import { ShoppingBag, Minus, Plus, Sparkles, LayoutGrid, X, Utensils } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CartPanelProps {
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  onCheckout: () => void;
  upsellSuggestions: string[];
  fullMenu: MenuItem[];
  addToCart: (item: MenuItem) => void;
  tableNumber?: number;
  orderType: OrderType;
}

const CartPanel: React.FC<CartPanelProps> = ({ 
  cart, updateQuantity, removeFromCart, onCheckout, upsellSuggestions, fullMenu, addToCart, tableNumber, orderType
}) => {
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.12;
  const total = subtotal + tax;

  const suggestedItems = fullMenu.filter(item => upsellSuggestions.includes(item.name));

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 border-l border-zinc-100 dark:border-zinc-800 lg:shadow-2xl relative z-10 overflow-hidden">
      
      {/* Pinned Header */}
      <div className="px-5 py-4 sm:px-8 sm:py-6 border-b border-zinc-100 dark:border-zinc-900 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/20 shrink-0">
        <div className="min-w-0 pr-4">
           <h2 className="font-extrabold text-sm sm:text-lg dark:text-white uppercase tracking-tighter truncate">Current Session</h2>
           <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[7px] sm:text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${orderType === 'Dining' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30'}`}>
                {orderType}
              </span>
              {tableNumber && orderType === 'Dining' && (
                <span className="text-[7px] sm:text-[9px] font-black text-zinc-400 uppercase tracking-[0.1em] truncate">T-{tableNumber}</span>
              )}
           </div>
        </div>
        {tableNumber && orderType === 'Dining' && (
          <div className="bg-indigo-600 text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-500/10 shrink-0">
            <LayoutGrid size={12} />
            <span className="text-[9px] sm:text-[10px] font-black uppercase">Table {tableNumber}</span>
          </div>
        )}
      </div>

      {/* Flexible Center: Order List & Upsells */}
      <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-8 no-scrollbar min-h-0">
        <AnimatePresence mode="popLayout">
          {cart.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="h-full min-h-[300px] flex flex-col items-center justify-center text-zinc-300 dark:text-zinc-800 space-y-4"
            >
              <div className="p-8 rounded-full bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-zinc-200 dark:border-zinc-800">
                <ShoppingBag size={40} className="opacity-10" />
              </div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Registry dormant</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <motion.div 
                  key={item.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 sm:gap-4 bg-zinc-50 dark:bg-zinc-900/40 p-2.5 sm:p-3 rounded-2xl border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all group shadow-sm"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden shrink-0 bg-zinc-200 dark:bg-zinc-800 relative">
                    <img src={item.image} className="w-full h-full object-cover" alt="" />
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="absolute inset-0 bg-rose-500/90 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] sm:text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{item.name}</p>
                    <p className="text-[9px] sm:text-[10px] font-black text-indigo-600 mt-0.5 tracking-tight">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center bg-white dark:bg-zinc-800 rounded-xl p-0.5 border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-zinc-400 hover:text-rose-500 transition-colors"><Minus size={10} /></button>
                    <span className="w-5 sm:w-6 text-center text-[9px] sm:text-[10px] font-black dark:text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-zinc-400 hover:text-indigo-600 transition-colors"><Plus size={10} /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Dynamic Upsell Component */}
        {cart.length > 0 && suggestedItems.length > 0 && (
          <div className="pt-6 border-t border-zinc-100 dark:border-zinc-900">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={12} className="text-indigo-500" />
              <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600">Smart Pairings</h3>
            </div>
            <div className="space-y-3">
              {suggestedItems.map(item => (
                <button 
                  key={item.id} onClick={() => addToCart(item)}
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 rounded-2xl flex items-center gap-4 hover:border-indigo-500/50 transition-all group text-left"
                >
                  <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 shadow-sm">
                    <img src={item.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 truncate">{item.name}</p>
                    <p className="text-[10px] text-indigo-600 font-black mt-0.5">₹{item.price.toLocaleString()}</p>
                  </div>
                  <Plus size={12} className="text-zinc-300 group-hover:text-indigo-600 mr-1" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pinned Footer: Summary & Action */}
      <div className="px-6 py-6 sm:px-8 bg-zinc-50 dark:bg-zinc-900/60 border-t border-zinc-100 dark:border-zinc-900 space-y-4 shrink-0 shadow-[0_-20px_40px_rgba(0,0,0,0.02)]">
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <span>Subtotal</span>
            <span className="text-zinc-900 dark:text-white font-black">₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <span>Tax (GST 12%)</span>
            <span className="text-zinc-900 dark:text-white font-black">₹{tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-end pt-3 border-t border-zinc-100 dark:border-zinc-800 mt-2">
            <span className="text-[10px] font-black dark:text-white uppercase tracking-[0.2em]">Total Value</span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter leading-none">₹{total.toLocaleString()}</span>
          </div>
        </div>

        <button 
          disabled={cart.length === 0 || (orderType === 'Dining' && !tableNumber)} 
          onClick={onCheckout}
          className={`w-full font-black py-4.5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase tracking-[0.3em] text-[10px] active:scale-[0.98] ${
            cart.length === 0 || (orderType === 'Dining' && !tableNumber)
              ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed shadow-none' 
              : 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-indigo-600 dark:hover:bg-indigo-50 hover:text-white dark:hover:text-indigo-600 shadow-indigo-500/10'
          }`}
        >
          {orderType === 'Dining' ? (
             <>
               <Utensils size={16} />
               <span className="truncate">{tableNumber ? `Submit Order (T-${tableNumber})` : 'Select Table'}</span>
             </>
          ) : (
            <>
              <ShoppingBag size={16} />
              Confirm Takeaway
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CartPanel;