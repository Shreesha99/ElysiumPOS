
import React, { useState, useMemo } from 'react';
import { MenuItem, Category } from '../types';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Package, 
  X, 
  ImageIcon,
  AlertCircle,
  TrendingUp,
  Minus,
  DollarSign,
  BarChart2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InventoryViewProps {
  handleAddDish: (dish: MenuItem) => void;
  handleUpdateDish: (id: string, updates: Partial<MenuItem>) => void;
  handleDeleteDish: (id: string) => void;
  CATEGORIES: Category[];
  menuItems: MenuItem[];
}

const InventoryView: React.FC<InventoryViewProps> = ({
  handleAddDish, handleUpdateDish, handleDeleteDish, CATEGORIES, menuItems
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Local Form State
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formStock, setFormStock] = useState<number>(20);
  const [formCategory, setFormCategory] = useState<Category>(CATEGORIES[0]);
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600');

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                            item.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [menuItems, search, activeCategory]);

  const stats = useMemo(() => {
    const totalValue = menuItems.reduce((acc, item) => acc + (item.price * item.stock), 0);
    const lowStockCount = menuItems.filter(i => i.stock < 10).length;
    return { totalValue, lowStockCount, totalItems: menuItems.length };
  }, [menuItems]);

  const resetForm = () => {
    setFormName('');
    setFormDesc('');
    setFormPrice(0);
    setFormStock(20);
    setFormCategory(CATEGORIES[0]);
    setFormImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600');
    setEditingItem(null);
  };

  const openAddForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditForm = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormDesc(item.description);
    setFormPrice(item.price);
    setFormStock(item.stock);
    setFormCategory(item.category);
    setFormImage(item.image);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      handleUpdateDish(editingItem.id, {
        name: formName,
        description: formDesc,
        price: formPrice,
        stock: formStock,
        category: formCategory,
        image: formImage
      });
    } else {
      handleAddDish({
        id: `m-${Date.now()}`,
        name: formName,
        description: formDesc,
        price: formPrice,
        stock: formStock,
        category: formCategory,
        image: formImage
      });
    }
    setIsFormOpen(false);
    resetForm();
  };

  return (
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden relative font-sans">
      {/* Premium Header */}
      <header className="px-6 py-6 sm:px-10 sm:py-8 border-b border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 sticky top-0 z-40 shrink-0 shadow-sm">
        <div className="max-w-[1600px] mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter dark:text-white">Asset Registry</h1>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Unified catalog of enterprise food & beverage nodes.</p>
            </div>
            
            <div className="flex items-center gap-4">
               {/* Quick Stats Chips */}
               <div className="hidden lg:flex items-center gap-6 mr-6 border-r border-zinc-100 dark:border-zinc-900 pr-10">
                  <div>
                    <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest mb-0.5">Inventory Value</p>
                    <p className="text-lg font-black dark:text-white leading-none">₹{stats.totalValue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest mb-0.5">Active SKUs</p>
                    <p className="text-lg font-black dark:text-white leading-none">{stats.totalItems}</p>
                  </div>
                  {stats.lowStockCount > 0 && (
                    <div>
                      <p className="text-[9px] font-black uppercase text-rose-500 tracking-widest mb-0.5 flex items-center gap-1"><AlertCircle size={10}/> Alerts</p>
                      <p className="text-lg font-black text-rose-500 leading-none">{stats.lowStockCount} Critical</p>
                    </div>
                  )}
               </div>

              <button 
                onClick={openAddForm}
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Plus size={16} /> New Asset
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                placeholder="Search registry by identifier or metadata..."
                className="w-full pl-12 pr-4 py-4 bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl text-[11px] font-bold tracking-widest outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white placeholder:text-zinc-400 shadow-inner"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {['All', ...CATEGORIES].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat as Category | 'All')}
                  className={`px-5 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${
                    activeCategory === cat 
                      ? 'bg-zinc-900 text-white dark:bg-indigo-600 border-transparent shadow-lg' 
                      : 'bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-100 dark:border-zinc-800 hover:border-indigo-500/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Registry Grid */}
      <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-10 no-scrollbar pb-40 lg:pb-10">
        <div className="max-w-[1600px] mx-auto">
          <AnimatePresence mode="popLayout">
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                {filteredItems.map(item => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] hover:border-indigo-500/50 transition-all duration-500 flex flex-col group relative"
                  >
                    <div className="relative aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                      <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 bg-white/95 dark:bg-zinc-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl border border-white/20">
                        {item.category}
                      </div>
                      
                      {/* Action Overlays */}
                      <div className="absolute top-4 right-4 flex gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
                        <button 
                          onClick={() => openEditForm(item)}
                          className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-600 hover:text-indigo-600 shadow-xl border border-zinc-100 dark:border-zinc-700 transition-all hover:scale-110"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteDish(item.id)}
                          className="w-10 h-10 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white shadow-xl border border-rose-100 dark:border-rose-900/50 transition-all hover:scale-110"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {item.stock < 10 && (
                        <div className="absolute bottom-4 left-4 bg-rose-500 text-white px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 animate-pulse shadow-lg">
                          <AlertCircle size={10} /> Critical Level: {item.stock}
                        </div>
                      )}
                    </div>

                    <div className="p-8 space-y-4 flex-1 flex flex-col">
                      <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0">
                          <h3 className="text-xl font-black uppercase tracking-tighter leading-none dark:text-white truncate group-hover:text-indigo-600 transition-colors">{item.name}</h3>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Ref: {item.id.toUpperCase()}</p>
                        </div>
                        <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 leading-none">₹{item.price.toLocaleString()}</span>
                      </div>
                      
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-bold leading-relaxed line-clamp-2 uppercase tracking-wide opacity-80 group-hover:opacity-100 transition-opacity">
                        {item.description}
                      </p>

                      <div className="pt-6 border-t border-zinc-50 dark:border-zinc-800 mt-auto">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-400">
                            <BarChart2 size={12} className="text-indigo-500" /> Stock Dynamics
                          </div>
                          <span className={`text-xs font-black ${item.stock < 10 ? 'text-rose-500' : 'text-zinc-900 dark:text-white'}`}>
                            {item.stock} Units Available
                          </span>
                        </div>
                        
                        {/* Rapid Adjust Stock Controls */}
                        <div className="flex items-center gap-2">
                           <button 
                             onClick={() => handleUpdateDish(item.id, { stock: Math.max(0, item.stock - 1) })}
                             className="flex-1 py-3.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-2xl flex items-center justify-center transition-all active:scale-90"
                           >
                             <Minus size={14} />
                           </button>
                           <div className="px-4 text-[10px] font-black uppercase tracking-widest text-zinc-300">Adjust</div>
                           <button 
                             onClick={() => handleUpdateDish(item.id, { stock: item.stock + 1 })}
                             className="flex-1 py-3.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 rounded-2xl flex items-center justify-center transition-all active:scale-90"
                           >
                             <Plus size={14} />
                           </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-32 flex flex-col items-center justify-center text-zinc-300 space-y-6">
                <div className="p-12 rounded-[3rem] bg-zinc-50 dark:bg-zinc-900/50 border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                  <Package size={64} className="opacity-10" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-black uppercase tracking-[0.3em]">No Assets Detected</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Registry node currently dormant.</p>
                </div>
                <button onClick={openAddForm} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Onboard First Asset</button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Responsive Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 bg-zinc-950/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-[800px] bg-white dark:bg-zinc-900 p-8 sm:p-12 lg:p-16 rounded-[3rem] sm:rounded-[4rem] shadow-2xl z-[70] border border-zinc-100 dark:border-zinc-800 max-h-[92vh] overflow-y-auto no-scrollbar"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="space-y-1">
                  <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter dark:text-white">
                    {editingItem ? 'Edit Asset Node' : 'Register Asset'}
                  </h3>
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Enterprise Registry v3.2_Alpha</p>
                </div>
                <button onClick={() => setIsFormOpen(false)} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-3xl transition-colors text-zinc-400"><X/></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Media Section */}
                  <div className="space-y-6">
                    <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-800 rounded-[2.5rem] overflow-hidden border border-dashed border-zinc-200 dark:border-zinc-700 flex items-center justify-center group/preview">
                       <img src={formImage} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover/preview:scale-110" alt="" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity" />
                       <div className="relative z-10 p-6 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl text-center group-hover/preview:scale-105 transition-transform">
                          <ImageIcon size={24} className="mx-auto text-indigo-500 mb-2" />
                          <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Spatial Preview</p>
                       </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Asset Imagery (Direct URL)</label>
                      <input 
                        required placeholder="https://image-cloud.com/asset-node-402.jpg" 
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-6 rounded-2xl text-[10px] font-black tracking-widest shadow-inner outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white" 
                        value={formImage} onChange={e => setFormImage(e.target.value)} 
                      />
                    </div>
                  </div>

                  {/* Primary Config Section */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Identifier (Name)</label>
                      <input 
                        required autoFocus placeholder="e.g., Truffle Gnocchi" 
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-6 rounded-2xl text-[12px] font-black tracking-widest shadow-inner outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white" 
                        value={formName} onChange={e => setFormName(e.target.value)} 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Unit Value (₹)</label>
                        <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                          <input 
                            type="number" required placeholder="0" 
                            className="w-full pl-10 pr-6 py-6 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl text-[12px] font-black tracking-widest shadow-inner outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white" 
                            value={formPrice || ''} onChange={e => setFormPrice(Number(e.target.value))} 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Stock Quota</label>
                        <div className="relative">
                          <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                          <input 
                            type="number" required placeholder="20" 
                            className="w-full pl-10 pr-6 py-6 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl text-[12px] font-black tracking-widest shadow-inner outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white" 
                            value={formStock || ''} onChange={e => setFormStock(Number(e.target.value))} 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Category Logic</label>
                      <select 
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-6 rounded-2xl text-[12px] font-black uppercase tracking-widest shadow-inner outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white cursor-pointer"
                        value={formCategory} onChange={e => setFormCategory(e.target.value as Category)}
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Asset Metadata Description</label>
                  <textarea 
                    rows={4} required placeholder="Describe the flavor profile and ingredients for the AI upselling engine..." 
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-8 rounded-[2rem] text-[12px] font-bold tracking-widest shadow-inner outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white resize-none" 
                    value={formDesc} onChange={e => setFormDesc(e.target.value)} 
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-6">
                  <button 
                    type="button" 
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 py-6 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                  >
                    Discard Changes
                  </button>
                  <button 
                    type="submit" 
                    className="flex-[2] bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-black py-6 rounded-[2rem] text-[10px] uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all hover:bg-indigo-600 dark:hover:bg-indigo-50 hover:text-white dark:hover:text-indigo-600 shadow-indigo-500/10"
                  >
                    {editingItem ? 'Commit Registry Updates' : 'Authorize Asset Node'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InventoryView;
