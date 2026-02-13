
import React from 'react';
import { CartItem, MenuItem, OrderType } from '../types';
import { ShoppingBag, Minus, Plus, CreditCard, Sparkles, LayoutGrid, X, Utensils } from 'lucide-react';
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
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 border-l border-zinc-100 dark:border-zinc-800 shadow-2xl relative z-10">
      <div className="p-6 border-b border-zinc-100 dark:border-zinc-900 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/20">
        <div>
           <h2 className="font-extrabold text-lg dark:text-white uppercase tracking-tighter">Live Session</h2>
           <div className="flex items-center gap-2 mt-1">
              <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${orderType === 'Dining' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30'}`}>
                {orderType}
              </span>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                {orderType === 'Dining' ? (tableNumber ? `Table ${tableNumber}` : 'Assigning Table...') : 'Direct Dispatch'}
              </p>
           </div>
        </div>
        {tableNumber && orderType === 'Dining' && (
          <div className="bg-indigo-600 text-white px-3 py-1 rounded-lg flex items-center gap-2 shadow-lg shadow-indigo-500/20">
            <LayoutGrid size={12} />
            <span className="text-[10px] font-black uppercase">T-{tableNumber}</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        <AnimatePresence mode="popLayout">
          {cart.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-zinc-300 dark:text-zinc-700 space-y-6 py-20"
            >
              <div className="p-8 rounded-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 border-dashed">
                 <ShoppingBag size={40} className="opacity-20" />
              </div>
              <div className="text-center">
                 <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2 text-zinc-400">Node Empty</p>
                 <p className="text-[10px] font-medium max-w-[180px] mx-auto opacity-60">Populate order items to begin registration</p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <motion.div 
                  key={item.id} 
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-4 group bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-2xl border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800 relative">
                    <img src={item.image} className="w-full h-full object-cover" alt="" />
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="absolute inset-0 bg-rose-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{item.name}</p>
                    <p className="text-[10px] font-extrabold text-indigo-600 mt-0.5">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center bg-white dark:bg-zinc-800 rounded-lg p-1 shadow-sm border border-zinc-100 dark:border-zinc-700">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-rose-500 transition-all"><Minus size={12} /></button>
                    <span className="w-6 text-center text-[10px] font-black dark:text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-indigo-600 transition-all"><Plus size={12} /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {cart.length > 0 && suggestedItems.length > 0 && (
          <div className="mt-8 p-5 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/30">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={12} className="text-indigo-500" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">Dynamic Pairings</h3>
            </div>
            <div className="space-y-2">
              {suggestedItems.map(item => (
                <button 
                  key={item.id} onClick={() => addToCart(item)}
                  className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl flex items-center gap-3 text-left hover:border-indigo-500 transition-all shadow-sm group"
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                    <img src={item.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 truncate">{item.name}</p>
                    <p className="text-[10px] text-indigo-600 font-extrabold mt-0.5">₹{item.price.toLocaleString()}</p>
                  </div>
                  <Plus size={12} className="text-zinc-300 group-hover:text-indigo-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-zinc-50 dark:bg-zinc-900/40 border-t border-zinc-100 dark:border-zinc-900 space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <span>Net Value</span>
            <span className="text-zinc-900 dark:text-white font-black">₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <span>GST (12%)</span>
            <span className="text-zinc-900 dark:text-white font-black">₹{tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-end pt-3 border-t border-zinc-100 dark:border-zinc-800 mt-3">
            <span className="text-[10px] font-black dark:text-white uppercase tracking-[0.2em]">Net Payable</span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">₹{total.toLocaleString()}</span>
          </div>
        </div>

        <button 
          disabled={cart.length === 0 || (orderType === 'Dining' && !tableNumber)} 
          onClick={onCheckout}
          className={`w-full font-black py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[11px] active:scale-[0.98] ${
            cart.length === 0 || (orderType === 'Dining' && !tableNumber)
              ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed border border-transparent' 
              : 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-indigo-600 dark:hover:bg-indigo-50 hover:text-white dark:hover:text-indigo-600'
          }`}
        >
          {orderType === 'Dining' ? (
             <>
               <Utensils size={16} />
               {tableNumber ? `Push to Kitchen (T-${tableNumber})` : 'Select Table First'}
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
