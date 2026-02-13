import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Sidebar from './components/Sidebar';
import MenuCard from './components/MenuCard';
import CartPanel from './components/CartPanel';
import Auth from './components/Auth';
import { Toaster, toast } from './components/Toaster';
import { MenuItem, CartItem, Category, BusinessInsight, Table, Waiter, Order, Floor } from './types';
import { INITIAL_MENU_ITEMS, CATEGORIES, INITIAL_TABLES, INITIAL_WAITERS, INITIAL_FLOORS } from './constants';
import { geminiService } from './services/geminiService';
import { authService, User } from './services/authService';
import { 
  Search, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Users, 
  LayoutGrid,
  CheckCircle2,
  XCircle,
  MonitorOff,
  Settings2,
  Save,
  RotateCcw,
  Maximize,
  Navigation,
  Move,
  Zap,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Grip,
  Box,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GRID_SIZE = 40;

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [activeTab, setActiveTab] = useState('pos');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('elysium_theme') === 'dark');
  const [activeCategory, setActiveCategory] = useState<Category>('Starters');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');
  
  // CORE PERSISTENT STATE
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => JSON.parse(localStorage.getItem('elysium_menu') || JSON.stringify(INITIAL_MENU_ITEMS)));
  const [floors, setFloors] = useState<Floor[]>(() => JSON.parse(localStorage.getItem('elysium_floors') || JSON.stringify(INITIAL_FLOORS)));
  const [tables, setTables] = useState<Table[]>(() => JSON.parse(localStorage.getItem('elysium_tables') || JSON.stringify(INITIAL_TABLES)));
  const [waiters, setWaiters] = useState<Waiter[]>(() => JSON.parse(localStorage.getItem('elysium_waiters') || JSON.stringify(INITIAL_WAITERS)));
  const [orders, setOrders] = useState<Order[]>(() => JSON.parse(localStorage.getItem('elysium_orders') || '[]'));

  // EDIT MODE (DRAFT) STATE
  const [isEditMode, setIsEditMode] = useState(false);
  const [draftTables, setDraftTables] = useState<Table[]>([]);
  const [draftFloors, setDraftFloors] = useState<Floor[]>([]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [activeFloorId, setActiveFloorId] = useState<string>(() => floors[0]?.id || 'f1');

  // VIEW SETTINGS
  const [mapRotation, setMapRotation] = useState(-20);
  const [mapPitch, setMapPitch] = useState(45);

  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({ category: 'Mains', price: 0 });
  const [upsellSuggestions, setUpsellSuggestions] = useState<string[]>([]);

  const activeTables = isEditMode ? draftTables : tables;
  const activeFloors = isEditMode ? draftFloors : floors;
  
  const selectedTable = useMemo(() => activeTables.find(t => t.id === selectedTableId), [activeTables, selectedTableId]);
  const activeTableOrder = useMemo(() => orders.find(o => o.tableId === selectedTableId && o.status !== 'Paid'), [orders, selectedTableId]);
  const currentFloor = useMemo(() => activeFloors.find(f => f.id === activeFloorId), [activeFloors, activeFloorId]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('elysium_menu', JSON.stringify(menuItems));
    localStorage.setItem('elysium_floors', JSON.stringify(floors));
    localStorage.setItem('elysium_tables', JSON.stringify(tables));
    localStorage.setItem('elysium_waiters', JSON.stringify(waiters));
    localStorage.setItem('elysium_orders', JSON.stringify(orders));
  }, [menuItems, floors, tables, waiters, orders]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('elysium_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const fetchUpsells = async () => {
      if (cart.length > 0) {
        try {
          const suggestions = await geminiService.getUpsellSuggestions(cart, menuItems);
          setUpsellSuggestions(suggestions);
        } catch (e) {
          console.error("AI recommendation fetch failed", e);
        }
      } else {
        setUpsellSuggestions([]);
      }
    };
    const timer = setTimeout(fetchUpsells, 1200);
    return () => clearTimeout(timer);
  }, [cart, menuItems]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  const enterEditMode = () => {
    if (viewMode !== '3d') {
      setViewMode('3d');
    }
    setDraftTables([...tables]);
    setDraftFloors([...floors]);
    setIsEditMode(true);
    toast("Spatial Environment Editor Active", "info");
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setSelectedTableId(null);
    toast("Changes Discarded", "info");
  };

  const saveEdit = () => {
    setTables([...draftTables]);
    setFloors([...draftFloors]);
    setIsEditMode(false);
    setSelectedTableId(null);
    toast("Spatial Map Persisted", "success");
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
    toast(`Added ${item.name}`, "success");
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (selectedTableId) {
      if (activeTableOrder) {
        const updatedOrders = orders.map(o => {
          if (o.id === activeTableOrder.id) {
            const mergedItems = [...o.items];
            cart.forEach(newItem => {
              const existing = mergedItems.find(mi => mi.id === newItem.id);
              if (existing) existing.quantity += newItem.quantity;
              else mergedItems.push(newItem);
            });
            const subtotal = mergedItems.reduce((acc, mi) => acc + (mi.price * mi.quantity), 0);
            const tax = subtotal * 0.12;
            return { ...o, items: mergedItems, subtotal, tax, total: subtotal + tax };
          }
          return o;
        });
        setOrders(updatedOrders);
        toast(`Order updated for T${selectedTable?.number}`, "success");
      } else {
        const subtotal = cart.reduce((acc, mi) => acc + (mi.price * mi.quantity), 0);
        const tax = subtotal * 0.12;
        const newOrder: Order = {
          id: `ord-${Date.now()}`,
          tableId: selectedTableId,
          items: [...cart],
          status: 'In Preparation',
          timestamp: new Date().toISOString(),
          subtotal,
          tax,
          total: subtotal + tax
        };
        setOrders(prev => [...prev, newOrder]);
        setTables(prev => prev.map(t => t.id === selectedTableId ? { ...t, status: 'Occupied', currentOrderId: newOrder.id } : t));
        toast(`Terminal Session: T${selectedTable?.number}`, "success");
      }
    }
    setCart([]);
  };

  const clearTableBill = (tableId: string) => {
    const orderToPay = orders.find(o => o.tableId === tableId && o.status !== 'Paid');
    if (orderToPay) setOrders(prev => prev.map(o => o.id === orderToPay.id ? { ...o, status: 'Paid' } : o));
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status: 'Available', currentOrderId: undefined } : t));
    toast("Bill Settled", "success");
  };

  const voidTableOrder = (tableId: string) => {
    const orderToVoid = orders.find(o => o.tableId === tableId && o.status !== 'Paid');
    if (orderToVoid) setOrders(prev => prev.filter(o => o.id !== orderToVoid.id));
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status: 'Available', currentOrderId: undefined } : t));
    toast("Session Terminated", "info");
  };

  const updateDraftTable = (id: string, updates: Partial<Table>) => {
    setDraftTables(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const updateDraftFloor = (id: string, updates: Partial<Floor>) => {
    setDraftFloors(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const addNewTable = () => {
    if (!currentFloor) return;
    const newId = `t-${Date.now()}`;
    const newTable: Table = {
      id: newId,
      number: draftTables.length + 1,
      capacity: 4,
      status: 'Available',
      x: 2,
      y: 2,
      width: 3,
      height: 3,
      rotation: 0,
      floorId: activeFloorId
    };
    setDraftTables(prev => [...prev, newTable]);
    setSelectedTableId(newId);
  };

  const deleteDraftTable = (id: string) => {
    setDraftTables(prev => prev.filter(t => t.id !== id));
    setSelectedTableId(null);
  };

  const fetchAIInsights = useCallback(async () => {
    setIsLoadingInsights(true);
    try {
      const data = await geminiService.getBusinessInsights({ revenue: 48250, occupancy: 82, staff: 12, menuItems: menuItems.length });
      setInsights(data);
    } catch (err) {
      toast("AI core error", "error");
    } finally {
      setIsLoadingInsights(false);
    }
  }, [menuItems.length]);

  const handleAddDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;
    const item: MenuItem = {
      id: `m-${Date.now()}`,
      name: newItem.name,
      description: "Asset registered to local registry.",
      price: newItem.price,
      category: (newItem.category as Category) || 'Mains',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
      stock: 20
    };
    setMenuItems(prev => [...prev, item]);
    setNewItem({ category: 'Mains', price: 0 });
    toast("Asset Registry Updated", "success");
  };

  const renderTableNode = (table: Table) => {
    const isSelected = selectedTableId === table.id;
    const legs = [];
    legs.push({ x: 10, y: 10 }, { x: 90, y: 10 }, { x: 10, y: 90 }, { x: 90, y: 90 });
    if (table.width > 5) legs.push({ x: 50, y: 10 }, { x: 50, y: 90 });
    if (table.height > 5) legs.push({ x: 10, y: 50 }, { x: 90, y: 50 });

    return (
      <div 
        key={table.id}
        onClick={(e) => { e.stopPropagation(); setSelectedTableId(table.id); }}
        style={{ 
          position: 'absolute',
          left: `${table.x * GRID_SIZE}px`, 
          top: `${table.y * GRID_SIZE}px`, 
          width: `${table.width * GRID_SIZE}px`, 
          height: `${table.height * GRID_SIZE}px`,
          transformStyle: 'preserve-3d',
          zIndex: isSelected ? 50 : 10
        }}
      >
         <div 
           className={`absolute inset-0 rounded-2xl border-[3px] shadow-2xl transition-all duration-300 flex flex-col items-center justify-center ${
             isSelected ? 'ring-8 ring-indigo-500 ring-offset-8 dark:ring-offset-zinc-950 border-indigo-500' : 
             table.status === 'Occupied' ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-white border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700'
           }`}
           style={{ transform: `translateZ(40px) rotate(${table.rotation || 0}deg)` }}
         >
            <span className="text-xl font-black italic uppercase">T{table.number}</span>
            <div className="flex items-center gap-1 opacity-60 text-[10px] font-black uppercase mt-1">
               <Users size={10} /> {table.capacity}
            </div>
            {isEditMode && isSelected && (
              <>
                 <div 
                   className="absolute -top-6 -left-6 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white cursor-move shadow-2xl border-4 border-white z-[60]"
                   onMouseDown={(e) => {
                     e.stopPropagation();
                     e.preventDefault();
                     const startX = e.clientX;
                     const startY = e.clientY;
                     const startTableX = table.x;
                     const startTableY = table.y;
                     const handleMouseMove = (mv: MouseEvent) => {
                        if (!currentFloor) return;
                        const dx = Math.round((mv.clientX - startX) / GRID_SIZE);
                        const dy = Math.round((mv.clientY - startY) / GRID_SIZE);
                        const newX = Math.max(0, Math.min(startTableX + dx, currentFloor.width - table.width));
                        const newY = Math.max(0, Math.min(startTableY + dy, currentFloor.height - table.height));
                        updateDraftTable(table.id, { x: newX, y: newY });
                     };
                     const handleMouseUp = () => {
                       window.removeEventListener('mousemove', handleMouseMove);
                       window.removeEventListener('mouseup', handleMouseUp);
                     };
                     window.addEventListener('mousemove', handleMouseMove);
                     window.addEventListener('mouseup', handleMouseUp);
                   }}
                 >
                    <Grip size={20} />
                 </div>
                 <div 
                   className="absolute -top-16 left-1/2 -translate-x-1/2 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white cursor-pointer shadow-xl border-2 border-white z-[60]"
                   onMouseDown={(e) => {
                     e.stopPropagation();
                     e.preventDefault();
                     const startX = e.clientX;
                     const startRot = table.rotation || 0;
                     const handleMouseMove = (mv: MouseEvent) => {
                       const delta = (mv.clientX - startX);
                       updateDraftTable(table.id, { rotation: (startRot + delta) % 360 });
                     };
                     const handleMouseUp = () => {
                       window.removeEventListener('mousemove', handleMouseMove);
                       window.removeEventListener('mouseup', handleMouseUp);
                     };
                     window.addEventListener('mousemove', handleMouseMove);
                     window.addEventListener('mouseup', handleMouseUp);
                   }}
                 >
                    <RotateCcw size={16} />
                 </div>
                 <div 
                   className="absolute -bottom-6 -right-6 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white cursor-se-resize shadow-2xl border-4 border-white z-[60]"
                   onMouseDown={(e) => {
                     e.stopPropagation();
                     e.preventDefault();
                     const startX = e.clientX;
                     const startY = e.clientY;
                     const startW = table.width;
                     const startH = table.height;
                     const handleMouseMove = (mv: MouseEvent) => {
                       if (!currentFloor) return;
                       const dw = Math.round((mv.clientX - startX) / GRID_SIZE);
                       const dh = Math.round((mv.clientY - startY) / GRID_SIZE);
                       const newW = Math.max(2, Math.min(startW + dw, currentFloor.width - table.x));
                       const newH = Math.max(2, Math.min(startH + dh, currentFloor.height - table.y));
                       
                       const newCapacity = Math.max(2, Math.floor((newW * newH) / 1.5));
                       updateDraftTable(table.id, { width: newW, height: newH, capacity: newCapacity });
                     };
                     const handleMouseUp = () => {
                       window.removeEventListener('mousemove', handleMouseMove);
                       window.removeEventListener('mouseup', handleMouseUp);
                     };
                     window.addEventListener('mousemove', handleMouseMove);
                     window.addEventListener('mouseup', handleMouseUp);
                   }}
                 >
                    <Maximize size={20} />
                 </div>
              </>
            )}
         </div>
         {legs.map((pos, idx) => (
           <div 
             key={idx}
             className="absolute w-3 h-3 bg-zinc-400 dark:bg-zinc-700 rounded-full shadow-inner"
             style={{ 
               left: `${pos.x}%`, 
               top: `${pos.y}%`,
               transform: 'translateZ(-40px) translateX(-50%) translateY(-50%)' 
             }} 
           />
         ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="p-10 space-y-12 h-full overflow-y-auto">
             <header className="flex justify-between items-center">
                <h1 className="text-4xl font-black italic uppercase tracking-tighter">Terminal Analytics</h1>
                <button onClick={fetchAIInsights} className="bg-indigo-600 text-white px-10 py-4 rounded-3xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/30 active:scale-95 transition-all">Update Strategy Core</button>
             </header>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                  { label: 'Settled Revenue', value: '₹48,250', icon: TrendingUp, color: 'text-emerald-500' },
                  { label: 'Occupancy Rate', value: '82%', icon: LayoutGrid, color: 'text-amber-500' },
                  { label: 'Active Operators', value: '12 Node', icon: Users, color: 'text-indigo-500' },
                ].map((s, i) => (
                  <div key={i} className="bg-white dark:bg-zinc-900 p-12 rounded-[4rem] border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all hover:border-indigo-500/50 hover:-translate-y-2">
                    <s.icon className={`mb-8 ${s.color}`} size={44} />
                    <p className="text-xs font-black uppercase text-zinc-400 tracking-widest">{s.label}</p>
                    <h2 className="text-5xl font-black mt-2 dark:text-white tracking-tighter">{s.value}</h2>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'tables':
        if (isMobile) return (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-8">
            <MonitorOff size={80} className="text-rose-500 opacity-20" />
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Spatial Restricted</h2>
            <p className="text-zinc-500 max-w-sm font-medium leading-relaxed">The High-Fidelity Spatial Environment Editor requires a wide-viewport node. Switch to a Desktop Terminal to manage floor nodes.</p>
          </div>
        );

        return (
          <div className="h-full flex flex-col p-8 gap-8 overflow-hidden bg-zinc-50 dark:bg-zinc-950 relative">
            <header className="flex items-center justify-between shrink-0">
               <div className="flex items-center gap-10">
                  <h1 className="text-4xl font-black italic uppercase tracking-tighter flex items-center gap-6">
                    Floor Map {isEditMode && <span className="bg-rose-600 text-white text-xs px-4 py-1.5 rounded-full uppercase font-black tracking-widest shadow-xl shadow-rose-500/20 animate-pulse">Live Editor</span>}
                  </h1>
                  <div className="flex gap-2 p-2 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    {activeFloors.map(f => (
                      <button 
                        key={f.id} onClick={() => setActiveFloorId(f.id)}
                        className={`px-8 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                          activeFloorId === f.id ? 'bg-zinc-900 text-white dark:bg-indigo-600' : 'text-zinc-500 hover:bg-zinc-50'
                        }`}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-1 p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    <button 
                      onClick={() => { if (!isEditMode) setViewMode('2d'); }}
                      className={`p-2 rounded-xl transition-all ${viewMode === '2d' ? 'bg-white dark:bg-zinc-800 text-indigo-600 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                      title="2D Standard View"
                    >
                      <Layers size={20} />
                    </button>
                    <button 
                      onClick={() => setViewMode('3d')}
                      className={`p-2 rounded-xl transition-all ${viewMode === '3d' ? 'bg-white dark:bg-zinc-800 text-indigo-600 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                      title="3D Spatial View"
                    >
                      <Box size={20} />
                    </button>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <AnimatePresence>
                    {isEditMode ? (
                      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="flex gap-3">
                         <button onClick={addNewTable} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 px-8 py-4 rounded-3xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-zinc-50 active:scale-95"><Plus size={18}/> Add Node</button>
                         <button onClick={cancelEdit} className="bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-8 py-4 rounded-3xl text-xs font-black uppercase tracking-widest active:scale-95">Discard</button>
                         <button onClick={saveEdit} className="bg-indigo-600 text-white px-12 py-4 rounded-3xl text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-indigo-500/30 active:scale-95"><Save size={20}/> Deploy</button>
                      </motion.div>
                    ) : (
                      viewMode === '3d' && (
                        <button onClick={enterEditMode} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 px-12 py-5 rounded-3xl text-xs font-black uppercase tracking-widest flex items-center gap-4 shadow-sm hover:border-indigo-500 transition-colors"><Settings2 size={20}/> Environmental Control</button>
                      )
                    )}
                  </AnimatePresence>
               </div>
            </header>

            <div className="flex-1 relative bg-white dark:bg-zinc-900 rounded-[5rem] border-[12px] border-zinc-100 dark:border-zinc-800 shadow-2xl overflow-hidden flex items-center justify-center">
               {viewMode === '3d' ? (
                 <>
                   <div className="absolute top-10 left-10 z-30 flex flex-col gap-4">
                      <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl p-4 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-2xl flex flex-col items-center gap-4">
                         <button onClick={() => setMapRotation(r => r - 15)} className="p-4 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-indigo-600 transition-all"><RotateCcw size={24} /></button>
                         <div className="w-12 h-[2px] bg-zinc-100 dark:bg-zinc-800" />
                         <button onClick={() => setMapRotation(r => r + 15)} className="p-4 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-indigo-600 transition-all rotate-180"><RotateCcw size={24} /></button>
                      </div>
                   </div>
                   <div className="absolute top-10 right-10 z-30">
                      <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl p-4 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-2xl flex flex-col items-center gap-4">
                         <button onClick={() => setMapPitch(p => Math.min(80, p + 5))} className="p-4 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-indigo-600 transition-all"><Navigation size={24}/></button>
                         <div className="w-12 h-[2px] bg-zinc-100 dark:bg-zinc-800" />
                         <button onClick={() => setMapPitch(p => Math.max(10, p - 5))} className="p-4 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-indigo-600 transition-all rotate-180"><Navigation size={24}/></button>
                      </div>
                   </div>

                   <motion.div 
                     className="relative w-full h-full flex items-center justify-center" 
                     animate={{ rotateX: mapPitch, rotateZ: mapRotation }}
                     transition={{ type: 'spring', damping: 30, stiffness: 50 }}
                     style={{ perspective: '4000px', transformStyle: 'preserve-3d' }}
                   >
                      <div 
                        className="relative bg-zinc-50/50 dark:bg-zinc-950/20 border-[6px] border-zinc-200 shadow-2xl"
                        style={{ 
                          width: `${(currentFloor?.width || 20) * GRID_SIZE}px`, 
                          height: `${(currentFloor?.height || 20) * GRID_SIZE}px`,
                          transformStyle: 'preserve-3d'
                        }}
                        onClick={() => setSelectedTableId(null)}
                      >
                         <div className="absolute inset-0 grid opacity-[0.06] pointer-events-none" style={{ 
                           gridTemplateColumns: `repeat(${currentFloor?.width || 20}, 1fr)`,
                           gridTemplateRows: `repeat(${currentFloor?.height || 20}, 1fr)` 
                         }}>
                            {Array.from({ length: (currentFloor?.width || 20) * (currentFloor?.height || 20) }).map((_, i) => <div key={i} className="border-[0.5px] border-zinc-400" />)}
                         </div>
                         {activeTables.filter(t => t.floorId === activeFloorId).map(t => renderTableNode(t))}

                         {isEditMode && (
                            <>
                               <div 
                                 className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 w-20 h-12 cursor-ns-resize bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl z-[70] border-4 border-white"
                                 onMouseDown={(e) => {
                                   e.stopPropagation();
                                   e.preventDefault();
                                   const startY = e.clientY;
                                   const startH = currentFloor?.height || 20;
                                   
                                   const minRequiredH = draftTables
                                     .filter(t => t.floorId === activeFloorId)
                                     .reduce((max, t) => Math.max(max, t.y + t.height), 10);

                                   const handleMouseMove = (mv: MouseEvent) => {
                                     const dy = Math.round((mv.clientY - startY) / GRID_SIZE);
                                     if (currentFloor) {
                                       updateDraftFloor(currentFloor.id, { height: Math.max(minRequiredH, startH + dy) });
                                     }
                                   };
                                   const handleMouseUp = () => {
                                     window.removeEventListener('mousemove', handleMouseMove);
                                     window.removeEventListener('mouseup', handleMouseUp);
                                   };
                                   window.addEventListener('mousemove', handleMouseMove);
                                   window.addEventListener('mouseup', handleMouseUp);
                                 }}
                               >
                                  <ChevronDown size={32} />
                               </div>
                               <div 
                                 className="absolute right-[-24px] top-1/2 -translate-y-1/2 w-12 h-20 cursor-ew-resize bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl z-[70] border-4 border-white"
                                 onMouseDown={(e) => {
                                   e.stopPropagation();
                                   e.preventDefault();
                                   const startX = e.clientX;
                                   const startW = currentFloor?.width || 20;

                                   const minRequiredW = draftTables
                                     .filter(t => t.floorId === activeFloorId)
                                     .reduce((max, t) => Math.max(max, t.x + t.width), 10);

                                   const handleMouseMove = (mv: MouseEvent) => {
                                     const dx = Math.round((mv.clientX - startX) / GRID_SIZE);
                                     if (currentFloor) {
                                       updateDraftFloor(currentFloor.id, { width: Math.max(minRequiredW, startW + dx) });
                                     }
                                   };
                                   const handleMouseUp = () => {
                                     window.removeEventListener('mousemove', handleMouseMove);
                                     window.removeEventListener('mouseup', handleMouseUp);
                                   };
                                   window.addEventListener('mousemove', handleMouseMove);
                                   window.addEventListener('mouseup', handleMouseUp);
                                 }}
                               >
                                  <ChevronRight size={32} />
                               </div>
                            </>
                         )}
                      </div>
                   </motion.div>
                 </>
               ) : (
                 <div className="w-full h-full p-20 overflow-y-auto bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 w-full max-w-7xl">
                       {activeTables.filter(t => t.floorId === activeFloorId).map(table => {
                          const order = orders.find(o => o.tableId === table.id && o.status !== 'Paid');
                          return (
                            <motion.button
                              key={table.id}
                              whileHover={{ scale: 1.05, y: -5 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedTableId(table.id)}
                              className={`aspect-square p-8 rounded-[3rem] border-2 transition-all flex flex-col items-center justify-center gap-3 relative group ${
                                selectedTableId === table.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xl shadow-indigo-600/30' :
                                table.status === 'Occupied' ? 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-600' :
                                'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                              }`}
                            >
                               <span className="text-4xl font-black italic uppercase tracking-tighter">T{table.number}</span>
                               <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-60">
                                  <Users size={12} /> {table.capacity}
                               </div>
                               {order && (
                                 <div className="absolute -bottom-2 px-4 py-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-black italic shadow-lg">
                                    ₹{order.total.toLocaleString()}
                                 </div>
                               )}
                               {table.status === 'Occupied' && (
                                 <div className="absolute top-4 right-4 w-3 h-3 bg-indigo-500 rounded-full animate-pulse" />
                               )}
                            </motion.button>
                          );
                       })}
                    </div>
                 </div>
               )}
            </div>

            {/* MOVED OUTSIDE MAP CONTAINER TO PREVENT CLIPPING */}
            <AnimatePresence>
               {selectedTable && (
                 <motion.div 
                   initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }}
                   className={`absolute right-12 top-[120px] bottom-[120px] w-[400px] backdrop-blur-3xl border rounded-[4rem] p-16 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.6)] z-[200] flex flex-col gap-12 ${isEditMode ? 'bg-zinc-950/95 border-zinc-800 text-white' : 'bg-white/95 dark:bg-zinc-900/95 border-zinc-100 dark:border-zinc-800'}`}
                 >
                    <div className="flex items-center justify-between shrink-0">
                       <div>
                          <p className="text-xs font-black uppercase text-zinc-500 tracking-widest mb-1">{isEditMode ? 'Environmental Node' : 'Active Terminal'}</p>
                          <h3 className="text-4xl font-black italic uppercase tracking-tighter">Table T{selectedTable.number}</h3>
                       </div>
                       <button onClick={() => setSelectedTableId(null)} className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-all text-zinc-400 hover:text-rose-500">
                          <XCircle size={32}/>
                       </button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-12 scrollbar-hide">
                      {isEditMode ? (
                        <div className="space-y-8 animate-in fade-in zoom-in-95">
                           <p className="text-sm font-bold text-zinc-400 leading-relaxed italic border-l-4 border-indigo-600 pl-4">Use the on-canvas handles to reposition, orient, or scale this node within the floor borders.</p>
                           <div className="p-10 bg-zinc-800/50 rounded-[3rem] border border-white/5 flex flex-col items-center justify-center gap-4 text-center">
                             <Users size={32} className="text-indigo-400" />
                             <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Calculated Seat Node</span>
                             <span className="text-4xl font-black text-white">{selectedTable.capacity} CAP</span>
                           </div>
                        </div>
                      ) : (
                        <div className="space-y-12 animate-in fade-in slide-in-from-right-8">
                           <div className="p-10 bg-zinc-50 dark:bg-zinc-800/50 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-inner">
                              <p className="text-xs font-black uppercase text-zinc-400 tracking-widest mb-4">Terminal Session</p>
                              {activeTableOrder ? (
                                <div>
                                   <p className="text-5xl font-black dark:text-white tracking-tighter">₹{activeTableOrder.total.toLocaleString()}</p>
                                   <p className="text-xs font-bold text-indigo-500 mt-4 flex items-center gap-3"><Zap size={16} fill="currentColor"/> Neural Dispatch Active</p>
                                   <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-700 space-y-3">
                                      {activeTableOrder.items.map(i => (
                                        <div key={i.id} className="flex justify-between text-[11px] font-black uppercase tracking-widest opacity-60">
                                          <span>{i.quantity}x {i.name}</span>
                                          <span>₹{i.price * i.quantity}</span>
                                        </div>
                                      ))}
                                   </div>
                                </div>
                              ) : <p className="text-base font-bold text-zinc-500 italic uppercase tracking-widest opacity-50">Empty Node Terminal</p>}
                           </div>
                           
                           <div className="space-y-4">
                              {selectedTable.status === 'Occupied' ? (
                                <>
                                   <button onClick={() => clearTableBill(selectedTable.id)} className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/40 hover:bg-indigo-700 transition-all active:scale-95">Complete Settle</button>
                                   <button onClick={() => { setActiveTab('pos'); setSelectedTableId(selectedTable.id); }} className="w-full py-5 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-100 dark:border-zinc-700 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] hover:border-indigo-500 transition-all">Add Items</button>
                                   <button onClick={() => voidTableOrder(selectedTable.id)} className="w-full py-4.5 bg-rose-500/10 text-rose-500 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] hover:bg-rose-600 hover:text-white transition-all active:scale-95">Terminate Session</button>
                                </>
                              ) : (
                                <button onClick={() => { setActiveTab('pos'); setSelectedTableId(selectedTable.id); }} className="w-full py-6 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl">Activate Node</button>
                              )}
                              <button onClick={() => setSelectedTableId(null)} className="w-full py-4 text-zinc-400 text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">Close Overlay</button>
                           </div>
                        </div>
                      )}
                    </div>

                    {isEditMode && (
                      <button onClick={() => deleteDraftTable(selectedTable.id)} className="shrink-0 w-full py-5 bg-rose-500/10 text-rose-500 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">Delete Spatial Node</button>
                    )}
                 </motion.div>
               )}
            </AnimatePresence>
          </div>
        );

      case 'pos':
        return (
          <div className="flex h-full flex-col lg:flex-row pb-20 lg:pb-0">
            <div className="flex-1 flex flex-col min-w-0">
              <header className="px-12 py-12 border-b border-zinc-100 dark:border-zinc-900 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl flex flex-col gap-10 sticky top-0 z-20">
                <div className="flex items-center justify-between">
                   <h1 className="text-5xl font-black italic uppercase tracking-tighter">Live Dispatch</h1>
                   <div className="flex items-center gap-8">
                      {selectedTable && (
                        <div className="bg-indigo-600 text-white px-8 py-3.5 rounded-[2rem] flex items-center gap-4 shadow-2xl shadow-indigo-500/40 animate-in fade-in slide-in-from-right-8">
                          <CheckCircle2 size={24} />
                          <span className="text-xs font-black uppercase tracking-widest italic">T{selectedTable.number} SYNCED</span>
                          <button onClick={() => setSelectedTableId(null)} className="ml-2 opacity-60 hover:opacity-100"><XCircle size={20}/></button>
                        </div>
                      )}
                      <div className="hidden md:flex items-center gap-6 bg-zinc-100 dark:bg-zinc-900 px-10 py-5 rounded-[2rem] w-96 border border-zinc-200 dark:border-zinc-800 transition-all focus-within:border-indigo-500">
                        <Search size={24} className="text-zinc-400" />
                        <input placeholder="SEARCH_ASSET..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-xs font-black uppercase tracking-widest w-full dark:text-white" />
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-12 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all border-2 ${activeCategory === cat ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xl shadow-indigo-500/30' : 'bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-100 dark:border-zinc-800 hover:border-indigo-500/40'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </header>
              <div className="flex-1 p-12 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                  {(menuItems.filter(i => i.category === activeCategory && i.name.toLowerCase().includes(searchQuery.toLowerCase()))).map(item => (
                    <MenuCard key={item.id} item={item} onAddToCart={addToCart} />
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full lg:w-[480px] shrink-0">
              <CartPanel 
                cart={cart} updateQuantity={(id, d) => setCart(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(0, i.quantity + d)} : i).filter(i => i.quantity > 0))} 
                removeFromCart={(id) => setCart(prev => prev.filter(i => i.id !== id))}
                onCheckout={handleCheckout}
                upsellSuggestions={upsellSuggestions}
                fullMenu={menuItems} addToCart={addToCart}
                tableNumber={selectedTable?.number}
              />
            </div>
          </div>
        );

      case 'waiters':
        return (
          <div className="p-16 space-y-16 h-full overflow-y-auto">
             <h1 className="text-6xl font-black italic uppercase tracking-tighter">Operator Registry</h1>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {waiters.map(w => (
                  <div key={w.id} className="bg-white dark:bg-zinc-900 p-16 rounded-[4.5rem] border border-zinc-100 dark:border-zinc-800 flex items-center gap-12 shadow-sm group hover:border-indigo-500/50 transition-all">
                     <div className="w-28 h-28 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center text-white font-black text-5xl uppercase shadow-2xl shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                        {w.name.charAt(0)}
                     </div>
                     <div>
                        <h3 className="text-3xl font-black dark:text-white tracking-tighter">{w.name}</h3>
                        <p className="text-xs font-black uppercase text-indigo-500 tracking-widest mt-3">{w.status} Node</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'inventory':
        return (
          <div className="p-16 space-y-16 h-full overflow-y-auto">
             <h1 className="text-6xl font-black italic uppercase tracking-tighter">System Assets</h1>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                <div className="bg-white dark:bg-zinc-900 p-12 rounded-[4.5rem] border border-zinc-100 dark:border-zinc-800 shadow-2xl h-fit sticky top-16">
                   <h3 className="text-3xl font-black uppercase mb-12 tracking-tighter">Asset Deployment</h3>
                   <form onSubmit={handleAddDish} className="space-y-8">
                      <input required placeholder="NODE_LABEL" className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-8 rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-inner" value={newItem.name || ''} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                      <select className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-8 rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-inner" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value as Category})}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <input required type="number" placeholder="BASE_PRICE_INR" className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-8 rounded-[2rem] text-xs font-black tracking-widest shadow-inner" value={newItem.price || ''} onChange={e => setNewItem({...newItem, price: Number(e.target.value)})} />
                      <button type="submit" className="w-full bg-indigo-600 text-white font-black py-8 rounded-[2rem] text-xs uppercase tracking-[0.3em] shadow-2xl shadow-indigo-500/40 active:scale-95 transition-all">Register Asset</button>
                   </form>
                </div>
                <div className="lg:col-span-2 space-y-8">
                   {menuItems.map(item => (
                     <div key={item.id} className="bg-white dark:bg-zinc-900 p-10 rounded-[3.5rem] border border-zinc-100 dark:border-zinc-800 flex items-center justify-between group hover:border-indigo-500/50 transition-all shadow-sm">
                        <div className="flex items-center gap-12">
                           <img src={item.image} className="w-24 h-24 rounded-[2rem] object-cover shadow-lg group-hover:scale-110 transition-transform" />
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

      case 'insights':
        return (
          <div className="p-16 space-y-16 h-full overflow-y-auto">
             <h1 className="text-6xl font-black italic uppercase tracking-tighter">Neural Strategy</h1>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {insights.length > 0 ? insights.map((s, i) => (
                  <div key={i} className="bg-white dark:bg-zinc-900 p-16 rounded-[5rem] border border-t-[20px] border-indigo-600 shadow-2xl hover:-translate-y-4 transition-transform duration-500">
                    <h3 className="text-sm font-black uppercase text-zinc-400 mb-10 tracking-[0.2em]">{s.title}</h3>
                    <h2 className="text-7xl font-black dark:text-white mb-10 tracking-tighter">{s.value}</h2>
                    <p className="text-lg text-zinc-500 leading-relaxed font-medium">{s.description}</p>
                  </div>
                )) : (
                  <div className="col-span-full h-96 flex flex-col items-center justify-center space-y-10 text-zinc-300">
                     <Sparkles size={120} className="opacity-10 animate-pulse" />
                     <p className="text-2xl font-black uppercase tracking-[0.3em] italic">Neural Engine Cold</p>
                     <button onClick={fetchAIInsights} className="bg-indigo-600 text-white px-12 py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/30">Force Sync</button>
                  </div>
                )}
             </div>
          </div>
        );

      default:
        return <div>Interface Node Error.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 text-foreground overflow-hidden font-sans selection:bg-indigo-500/30">
      <Toaster />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} user={user} onLogout={handleLogout} />
      <main className="flex-1 lg:ml-72 transition-all h-full relative">
        {user ? renderContent() : <Auth onAuthSuccess={setUser} />}
      </main>
    </div>
  );
};

export default App;