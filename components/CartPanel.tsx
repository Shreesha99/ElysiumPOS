
import React from 'react';
import { CartItem, MenuItem } from '../types';
import { ShoppingBag, Minus, Plus, CreditCard, Sparkles } from 'lucide-react';

interface CartPanelProps {
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  onCheckout: () => void;
  upsellSuggestions: string[];
  fullMenu: MenuItem[];
  addToCart: (item: MenuItem) => void;
}

const CartPanel: React.FC<CartPanelProps> = ({ 
  cart, 
  updateQuantity, 
  removeFromCart, 
  onCheckout, 
  upsellSuggestions,
  fullMenu,
  addToCart
}) => {
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.12;
  const total = subtotal + tax;

  const suggestedItems = fullMenu.filter(item => upsellSuggestions.includes(item.name));

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl">
      <div className="p-8 flex justify-between items-center border-b border-zinc-100 dark:border-zinc-900">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
            <ShoppingBag size={18} className="text-zinc-600 dark:text-zinc-400" />
          </div>
          <h2 className="font-extrabold text-lg dark:text-white">Order Draft</h2>
        </div>
        <span className="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
          Table 07
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {cart.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-zinc-300 dark:text-zinc-700 space-y-4">
            <ShoppingBag size={48} strokeWidth={1} />
            <p className="text-sm font-medium max-w-[150px] text-center">Ready to start the Elysium experience?</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 group">
                <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-zinc-100 dark:border-zinc-800">
                  <img src={item.image} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100 truncate">{item.name}</p>
                  <p className="text-[12px] text-indigo-600 font-bold">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-xl p-1 gap-1">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-rose-500 hover:bg-white dark:hover:bg-zinc-800 rounded-lg transition-all"
                  ><Minus size={12} strokeWidth={3} /></button>
                  <span className="w-6 text-center text-xs font-black dark:text-white">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-indigo-500 hover:bg-white dark:hover:bg-zinc-800 rounded-lg transition-all"
                  ><Plus size={12} strokeWidth={3} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Gemini AI Powered Upselling */}
        {cart.length > 0 && suggestedItems.length > 0 && (
          <div className="mt-12 bg-indigo-50/50 dark:bg-indigo-500/5 p-5 rounded-[2rem] border border-indigo-100/50 dark:border-indigo-500/10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-indigo-600" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-600/80">
                Precision Pairings
              </h3>
            </div>
            <div className="space-y-3">
              {suggestedItems.map(item => (
                <button 
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="w-full p-3.5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl flex items-center gap-3 text-left hover:border-indigo-400 transition-all group/upsell"
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                    <img src={item.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate group-hover/upsell:text-indigo-600">{item.name}</p>
                    <p className="text-[10px] text-zinc-500 font-bold">${item.price}</p>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                    <Plus size={14} strokeWidth={3} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-zinc-50/50 dark:bg-zinc-900/20 border-t border-zinc-100 dark:border-zinc-800 space-y-6">
        <div className="space-y-3 text-sm font-medium">
          <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
            <span>Subtotal</span>
            <span className="text-zinc-800 dark:text-white font-bold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
            <span>Service & Tax (12%)</span>
            <span className="text-zinc-800 dark:text-white font-bold">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <span className="text-lg font-black dark:text-white uppercase tracking-tighter">Total Due</span>
            <span className="text-3xl font-black text-indigo-600 tracking-tighter">${total.toFixed(2)}</span>
          </div>
        </div>

        <button 
          disabled={cart.length === 0}
          onClick={onCheckout}
          className="group w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-500/20 dark:shadow-none transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
        >
          <CreditCard size={18} className="group-hover:scale-110 transition-transform" />
          Authorize Transaction
        </button>
      </div>
    </div>
  );
};

export default CartPanel;
