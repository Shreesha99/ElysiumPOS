
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import MenuCard from './components/MenuCard';
import CartPanel from './components/CartPanel';
import Auth from './components/Auth';
import { Toaster, toast } from './components/Toaster';
import { MenuItem, CartItem, Category, BusinessInsight } from './types';
import { MENU_ITEMS, CATEGORIES, TABLES } from './constants';
import { geminiService } from './services/geminiService';
import { authService, User } from './services/authService';
// Added missing Sparkles import to fix "Cannot find name 'Sparkles'" errors
import { Search, Filter, TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [activeTab, setActiveTab] = useState('pos');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('elysium_theme') === 'dark';
  });
  const [activeCategory, setActiveCategory] = useState<Category>('Starters');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [upsellSuggestions, setUpsellSuggestions] = useState<string[]>([]);
  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('elysium_theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('elysium_theme', 'light');
    }
  }, [darkMode]);

  // Auth Callbacks
  const handleAuthSuccess = (u: User) => setUser(u);
  const handleLogout = () => {
    authService.logout();
    setUser(null);
    toast("Logged out successfully", "info");
  };

  // Cart Management
  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(i => i.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  // AI Upselling Logic
  useEffect(() => {
    const fetchUpsells = async () => {
      if (cart.length > 0) {
        const suggestions = await geminiService.getUpsellSuggestions(cart, MENU_ITEMS);
        setUpsellSuggestions(suggestions);
      } else {
        setUpsellSuggestions([]);
      }
    };
    const timeout = setTimeout(fetchUpsells, 1200);
    return () => clearTimeout(timeout);
  }, [cart]);

  // AI Business Insights Logic
  const fetchInsights = useCallback(async () => {
    setIsLoadingInsights(true);
    const mockSales = {
      revenue: 8420,
      orders: 112,
      topItem: 'Truffle Mushroom Arancini',
      wasteLevel: 'low',
      staffEfficiency: 96,
      customerSatisfaction: 4.8
    };
    const data = await geminiService.getBusinessInsights(mockSales);
    setInsights(data);
    setIsLoadingInsights(false);
  }, []);

  useEffect(() => {
    if (activeTab === 'insights' && insights.length === 0) {
      fetchInsights();
    }
  }, [activeTab, insights.length, fetchInsights]);

  if (!user) {
    return (
      <>
        <Toaster />
        <Auth onAuthSuccess={handleAuthSuccess} />
      </>
    );
  }

  const filteredMenu = MENU_ITEMS.filter(item => 
    item.category === activeCategory && 
    (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 space-y-10">
            <header>
              <h1 className="text-4xl font-black tracking-tighter dark:text-white">Performance Hub</h1>
              <p className="text-zinc-500 font-medium mt-1">Elysium real-time analytics engine.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: '$24,510', trend: 'up', color: 'indigo' },
                { label: 'Active Tables', value: '14/32', trend: 'neutral', color: 'zinc' },
                { label: 'Order Velocity', value: '2.4m', trend: 'up', color: 'indigo' },
                { label: 'Daily Margin', value: '22.4%', trend: 'down', color: 'rose' },
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm group hover:border-indigo-200 transition-all">
                  <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <h2 className="text-3xl font-black dark:text-white tracking-tighter">{stat.value}</h2>
                    {stat.trend === 'up' && <TrendingUp size={20} className="text-indigo-500" />}
                    {stat.trend === 'down' && <TrendingDown size={20} className="text-rose-500" />}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-white dark:bg-zinc-900 p-10 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 h-[450px] flex flex-col">
                  <h3 className="text-xl font-black mb-8 dark:text-white tracking-tight">Revenue Stream</h3>
                  <div className="flex-1 flex items-end justify-between gap-4">
                    {[30, 60, 40, 80, 50, 95, 70, 85].map((h, i) => (
                      <div key={i} className="flex-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl relative group cursor-pointer" style={{ height: `${h}%` }}>
                        <div 
                          className="absolute bottom-0 w-full bg-indigo-600 rounded-2xl transition-all duration-700 group-hover:bg-indigo-400" 
                          style={{ height: '0%' }}
                          // Fixed ref to return void explicitly to resolve type error on line 162
                          ref={(el) => { if (el) el.style.height = `${h}%`; }}
                        />
                      </div>
                    ))}
                  </div>
               </div>
               <div className="bg-zinc-950 p-10 rounded-[2.5rem] border border-zinc-800 shadow-2xl overflow-hidden relative group">
                  <div className="relative z-10 flex flex-col h-full">
                    <h3 className="text-xl font-black mb-4 text-white tracking-tight">Operational Insights</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed mb-8">Elysium's AI detected a surge in cocktail orders. Recommendation: Mobilize bar back to Station 2.</p>
                    <div className="mt-auto grid grid-cols-2 gap-4">
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Kitchen Load</p>
                           <p className="text-2xl font-black text-white">Heavy</p>
                        </div>
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                           <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Table Turn</p>
                           <p className="text-2xl font-black text-white">42m</p>
                        </div>
                    </div>
                  </div>
                  <Sparkles size={120} className="absolute -bottom-10 -right-10 text-white opacity-5 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
               </div>
            </div>
          </motion.div>
        );

      case 'insights':
        return (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-10 space-y-10">
             <header className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-black tracking-tighter dark:text-white flex items-center gap-4">
                  AI Intelligence Core
                </h1>
                <p className="text-zinc-500 font-medium mt-1">Deep learning driven restaurant strategy.</p>
              </div>
              <button 
                onClick={fetchInsights}
                disabled={isLoadingInsights}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black shadow-2xl shadow-indigo-500/30 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {isLoadingInsights ? 'Analyzing...' : <><Sparkles size={20} /> Generate Intelligence</>}
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {insights.map((insight, i) => (
                  <div key={i} className="bg-white dark:bg-zinc-900 p-10 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-indigo-500/5 relative overflow-hidden">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border ${
                       insight.trend === 'up' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 
                       'bg-rose-50 border-rose-100 text-rose-600'
                     }`}>
                       {insight.trend === 'up' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                     </div>
                     <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3">{insight.title}</p>
                     <h2 className="text-4xl font-black mb-6 tracking-tighter dark:text-white">{insight.value}</h2>
                     <p className="text-zinc-600 dark:text-zinc-400 text-[14px] leading-loose">{insight.description}</p>
                  </div>
               ))}
            </div>

            <div className="p-12 bg-indigo-600 rounded-[3rem] text-white flex items-center gap-12 shadow-2xl shadow-indigo-500/40">
               <div className="flex-1">
                  <h3 className="text-3xl font-black tracking-tighter mb-6 italic">"Optimizing dessert menu placement for Table Group B increased high-margin sales by 18% in simulated peak hours."</h3>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full border-2 border-white/50 flex items-center justify-center font-black">E</div>
                     <p className="text-indigo-200 font-bold tracking-widest uppercase text-xs">Elysium Neural Core Recommendation</p>
                  </div>
               </div>
               <div className="hidden lg:block w-48 h-48 bg-white/10 rounded-[2rem] flex items-center justify-center backdrop-blur-3xl">
                  <Sparkles size={80} strokeWidth={1} />
               </div>
            </div>
          </motion.div>
        );

      case 'tables':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10">
            <h1 className="text-4xl font-black tracking-tighter dark:text-white mb-10">Dining Floor</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {TABLES.map(table => (
                <div key={table.id} className="relative group">
                  <div className={`aspect-square rounded-[2.5rem] border-4 flex flex-col items-center justify-center transition-all ${
                    table.status === 'Available' ? 'bg-white border-zinc-100 hover:border-indigo-500 dark:bg-zinc-900 dark:border-zinc-800' :
                    table.status === 'Occupied' ? 'bg-indigo-600 border-indigo-600 text-white' :
                    'bg-zinc-100 border-zinc-200 opacity-50 dark:bg-zinc-800 dark:border-zinc-700'
                  }`}>
                    <span className="text-4xl font-black tracking-tighter">{table.number}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest mt-2">{table.capacity} Seats</span>
                  </div>
                  <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{table.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'pos':
      default:
        return (
          <div className="flex h-full">
            <div className="flex-1 flex flex-col min-w-0">
              <header className="px-10 py-8 border-b border-zinc-100 dark:border-zinc-900 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-2xl flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4 bg-zinc-100 dark:bg-zinc-900 px-6 py-3 rounded-2xl w-full max-w-md">
                   <Search size={20} className="text-zinc-400" />
                   <input 
                     placeholder="Search dishes..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="bg-transparent border-none outline-none text-sm font-medium w-full dark:text-white"
                   />
                </div>
                <div className="flex gap-4">
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-6 py-3 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all ${
                        activeCategory === cat ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30' : 'bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800 hover:border-indigo-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </header>

              <div className="flex-1 p-10 overflow-y-auto">
                <AnimatePresence mode="popLayout">
                  <motion.div 
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  >
                    {filteredMenu.map(item => (
                      <MenuCard key={item.id} item={item} onAddToCart={addToCart} />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="w-80 lg:w-[400px] hidden md:block">
              <CartPanel 
                cart={cart}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                onCheckout={() => {
                   toast("Payment Authorization Successful", "success");
                   setCart([]);
                }}
                upsellSuggestions={upsellSuggestions}
                fullMenu={MENU_ITEMS}
                addToCart={addToCart}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Toaster />
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        user={user}
        onLogout={handleLogout}
      />
      <main className="flex-1 ml-20 lg:ml-72 transition-all h-screen overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
