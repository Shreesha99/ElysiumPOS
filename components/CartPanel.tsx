import React from 'react';
import { CartItem, MenuItem } from '../types';
import { ShoppingBag, Minus, Plus, CreditCard, Sparkles, LayoutGrid } from 'lucide-react';

interface CartPanelProps {
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  onCheckout: () => void;
  upsellSuggestions: string[];
  fullMenu: MenuItem[];
  addToCart: (item: MenuItem) => void;
  tableNumber?: number;
}

const CartPanel: React.FC<CartPanelProps> = ({ 
  cart, updateQuantity, removeFromCart, onCheckout, upsellSuggestions, fullMenu, addToCart, tableNumber
}) => {
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.12;
  const total = subtotal + tax;

  const suggestedItems = fullMenu.filter(item => upsellSuggestions.includes(item.name));

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 border-l border-zinc-100 dark:border-zinc-800 shadow-2xl relative z-10">
      <div className="p-8 border-b border-zinc-100 dark:border-zinc-900 flex justify-between items-center">
        <div>
           <h2 className="font-extrabold text-xl dark:text-white uppercase tracking-tighter">Order Summary</h2>
           <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Active Session</p>
        </div>
        {tableNumber && (
          <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 px-3 py-1.5 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-2">
            <LayoutGrid size={14} />
            <span className="text-xs font-black uppercase">Table {tableNumber}</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-300 dark:text-zinc-700 space-y-6">
            <div className="p-10 rounded-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
               <ShoppingBag size={48} className="opacity-40" />
            </div>
            <div className="text-center">
               <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2">Cart is empty</p>
               <p className="text-[10px] font-medium max-w-[150px] mx-auto opacity-60">Select items from the menu to begin an order session</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 group animate-in slide-in-from-right-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800">
                  <img src={item.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-indigo-600 transition-colors">{item.name}</p>
                  <p className="text-xs font-extrabold text-indigo-600 mt-0.5">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
                <div className="flex items-center bg-zinc-50 dark:bg-zinc-900 rounded-xl p-1 border border-zinc-100 dark:border-zinc-800 shadow-sm">
                  <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-indigo-600 transition-all"><Minus size={14} /></button>
                  <span className="w-7 text-center text-xs font-black dark:text-white">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-indigo-600 transition-all"><Plus size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {cart.length > 0 && suggestedItems.length > 0 && (
          <div className="mt-12 p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={14} className="text-indigo-500" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">Smart pairings</h3>
            </div>
            <div className="space-y-3">
              {suggestedItems.map(item => (
                <button 
                  key={item.id} onClick={() => addToCart(item)}
                  className="w-full p-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl flex items-center gap-3 text-left hover:border-indigo-500 transition-all shadow-sm"
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                    <img src={item.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 truncate uppercase tracking-tight">{item.name}</p>
                    <p className="text-[10px] text-indigo-600 font-extrabold mt-0.5">₹{item.price.toLocaleString()}</p>
                  </div>
                  <Plus size={12} className="text-indigo-500" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-900 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
            <span>Net Subtotal</span>
            <span className="text-zinc-900 dark:text-white">₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
            <span>Service tax (12%)</span>
            <span className="text-zinc-900 dark:text-white">₹{tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-end pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-4">
            <span className="text-[10px] font-black dark:text-white uppercase tracking-[0.3em]">Grand total</span>
            <span className="text-3xl font-black text-zinc-950 dark:text-white tracking-tighter">₹{total.toLocaleString()}</span>
          </div>
        </div>

        <button 
          disabled={cart.length === 0} onClick={onCheckout}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4.5 rounded-xl shadow-xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[10px] disabled:opacity-30 active:scale-95"
        >
          <CreditCard size={18} />
          {tableNumber ? 'Send to table' : 'Complete payment'}
        </button>
      </div>
    </div>
  );
};

export default CartPanel;