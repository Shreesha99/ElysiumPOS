
import React from 'react';
import { MenuItem, Category } from '../types';

interface InventoryViewProps {
  handleAddDish: (e: React.FormEvent) => void;
  newItem: Partial<MenuItem>;
  setNewItem: (val: Partial<MenuItem>) => void;
  CATEGORIES: Category[];
  menuItems: MenuItem[];
}

const InventoryView: React.FC<InventoryViewProps> = ({
  handleAddDish, newItem, setNewItem, CATEGORIES, menuItems
}) => {
  return (
    <div className="p-16 space-y-16 h-full overflow-y-auto">
       <h1 className="text-6xl font-black uppercase tracking-tighter">Asset Registry</h1>
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="bg-white dark:bg-zinc-900 p-12 rounded-[4.5rem] border border-zinc-100 dark:border-zinc-800 shadow-2xl h-fit sticky top-16">
             <h3 className="text-3xl font-black uppercase mb-12 tracking-tighter">Add New Asset</h3>
             <form onSubmit={handleAddDish} className="space-y-8">
                <input required placeholder="Item name" className="w-full bg-zinc-100 dark:bg-zinc-800 border-none p-8 rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-inner" value={newItem.name || ''} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                <select className="w-full bg-zinc-100 dark:bg-zinc-800 border-none p-8 rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-inner" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value as Category})}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
                <input required type="number" placeholder="Price in ₹" className="w-full bg-zinc-100 dark:bg-zinc-800 border-none p-8 rounded-[2rem] text-xs font-black tracking-widest shadow-inner" value={newItem.price || ''} onChange={e => setNewItem({...newItem, price: Number(e.target.value)})} />
                <button type="submit" className="w-full bg-indigo-600 text-white font-black py-8 rounded-[2rem] text-xs uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all">Register item</button>
             </form>
          </div>
          <div className="lg:col-span-2 space-y-8">
            {menuItems.map(item => (
              <div key={item.id} className="bg-white dark:bg-zinc-900 p-10 rounded-[3.5rem] border border-zinc-100 dark:border-zinc-800 flex items-center justify-between group hover:border-indigo-500 shadow-sm transition-all">
                <div className="flex items-center gap-12">
                  <img src={item.image} className="w-24 h-24 rounded-[2rem] object-cover shadow-lg" alt="" />
                  <div>
                    <h4 className="text-3xl font-black dark:text-white uppercase tracking-tighter">{item.name}</h4>
                    <p className="text-xs font-black text-indigo-500 uppercase tracking-widest mt-2">{item.category}</p>
                  </div>
                </div>
                <span className="font-black text-4xl tracking-tighter">₹{item.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
       </div>
    </div>
  );
};

export default InventoryView;
