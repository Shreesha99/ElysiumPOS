import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Auth from './components/Auth';
import { Toaster, toast } from './components/Toaster';
import { MenuItem, Category, BusinessInsight, Table, Waiter, Order, Floor, CartItem, OrderType } from './types';
import { INITIAL_MENU_ITEMS, CATEGORIES, INITIAL_TABLES, INITIAL_WAITERS, INITIAL_FLOORS } from './constants';
import { geminiService } from './services/geminiService';
import { authService, User } from './services/authService';

// View Components
import DashboardView from './components/DashboardView';
import FloorMapView from './components/FloorMapView';
import POSView from './components/POSView';
import StaffView from './components/StaffView';
import InventoryView from './components/InventoryView';
import InsightsView from './components/InsightsView';

const safeGetItem = (key: string, defaultValue: string) => {
  try {
    return localStorage.getItem(key) || defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const safeSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {}
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [activeTab, setActiveTab] = useState('pos');
  const [darkMode, setDarkMode] = useState(() => safeGetItem('elysium_theme', 'light') === 'dark');
  const [activeCategory, setActiveCategory] = useState<Category>('Starters');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => JSON.parse(safeGetItem('elysium_menu', JSON.stringify(INITIAL_MENU_ITEMS))));
  const [floors, setFloors] = useState<Floor[]>(() => JSON.parse(safeGetItem('elysium_floors', JSON.stringify(INITIAL_FLOORS))));
  const [tables, setTables] = useState<Table[]>(() => JSON.parse(safeGetItem('elysium_tables', JSON.stringify(INITIAL_TABLES))));
  const [waiters, setWaiters] = useState<Waiter[]>(() => JSON.parse(safeGetItem('elysium_waiters', JSON.stringify(INITIAL_WAITERS))));
  const [orders, setOrders] = useState<Order[]>(() => JSON.parse(safeGetItem('elysium_orders', '[]')));

  const [isEditMode, setIsEditMode] = useState(false);
  const [draftTables, setDraftTables] = useState<Table[]>([]);
  const [draftFloors, setDraftFloors] = useState<Floor[]>([]);
  const [editingFloorId, setEditingFloorId] = useState<string | null>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [activeFloorId, setActiveFloorId] = useState<string>(() => floors[0]?.id || 'f1');
  const [orderType, setOrderType] = useState<OrderType>('Dining');

  const [mapRotation, setMapRotation] = useState(-20);
  const [mapPitch, setMapPitch] = useState(45);

  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({ category: 'Mains', price: 0 });
  const [upsellSuggestions, setUpsellSuggestions] = useState<string[]>([]);

  const [liveTraffic, setLiveTraffic] = useState(Math.floor(Math.random() * 50) + 20);

  const activeTables = isEditMode ? draftTables : tables;
  const activeFloors = isEditMode ? draftFloors : floors;
  
  const selectedTable = useMemo(() => activeTables.find(t => t.id === selectedTableId), [activeTables, selectedTableId]);
  
  const stats = useMemo(() => {
    const totalRevenue = orders.filter(o => o.status === 'Paid').reduce((acc, o) => acc + o.total, 0);
    const pendingRevenue = orders.filter(o => o.status !== 'Paid').reduce((acc, o) => acc + o.total, 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    const occupiedTables = tables.filter(t => t.status === 'Occupied').length;
    const occupancyRate = (occupiedTables / tables.length) * 100 || 0;
    const hourlySales = Array.from({ length: 12 }, (_, i) => ({
      hour: `${i + 9}:00`,
      value: Math.floor(Math.random() * 5000) + 1000
    }));
    return { totalRevenue, pendingRevenue, avgOrderValue, occupiedTables, occupancyRate, hourlySales };
  }, [orders, tables]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile && viewMode === '3d') setViewMode('2d');
    };
    window.addEventListener('resize', handleResize);
    const interval = setInterval(() => {
      setLiveTraffic(prev => Math.max(10, prev + (Math.random() > 0.5 ? 2 : -2)));
    }, 5000);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, [viewMode]);

  useEffect(() => {
    safeSetItem('elysium_menu', JSON.stringify(menuItems));
    safeSetItem('elysium_floors', JSON.stringify(floors));
    safeSetItem('elysium_tables', JSON.stringify(tables));
    safeSetItem('elysium_waiters', JSON.stringify(waiters));
    safeSetItem('elysium_orders', JSON.stringify(orders));
  }, [menuItems, floors, tables, waiters, orders]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    safeSetItem('elysium_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Handle upselling logic when cart changes
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (cart.length > 0) {
        const suggestions = await geminiService.getUpsellSuggestions(cart, menuItems);
        setUpsellSuggestions(suggestions);
      } else {
        setUpsellSuggestions([]);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [cart, menuItems]);

  const fetchAIInsights = useCallback(async () => {
    setIsLoadingInsights(true);
    try {
      const data = await geminiService.getBusinessInsights({ revenue: stats.totalRevenue, occupancy: stats.occupancyRate, staff: waiters.length, menuItems: menuItems.length });
      setInsights(data);
    } catch (err) {
      toast("AI strategy node error", "error");
    } finally {
      setIsLoadingInsights(false);
    }
  }, [stats.totalRevenue, stats.occupancyRate, waiters.length, menuItems.length]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  const enterEditMode = () => {
    if (viewMode !== '3d') setViewMode('3d');
    setDraftTables([...tables]);
    setDraftFloors([...floors]);
    setIsEditMode(true);
    toast("Spatial editor active", "info");
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setSelectedTableId(null);
    setEditingFloorId(null);
    toast("Changes discarded", "info");
  };

  const saveEdit = () => {
    setTables([...draftTables]);
    setFloors([...draftFloors]);
    setIsEditMode(false);
    setSelectedTableId(null);
    setEditingFloorId(null);
    toast("Spatial map saved", "success");
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
    toast(`${item.name} added`, "success");
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    if (orderType === 'Dining' && !selectedTableId) {
        toast("Please select a table for Dining orders", "error");
        return;
    }

    const subtotal = cart.reduce((acc, mi) => acc + (mi.price * mi.quantity), 0);
    const tax = subtotal * 0.12;
    const total = subtotal + tax;

    if (orderType === 'Dining' && selectedTableId) {
      const activeTableOrder = orders.find(o => o.tableId === selectedTableId && o.status !== 'Paid');
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
        toast(`Order added to Table ${selectedTable?.number}`, "success");
      } else {
        const newOrder: Order = {
          id: `ord-${Date.now()}`,
          tableId: selectedTableId,
          orderType: 'Dining',
          items: [...cart],
          status: 'Pending',
          timestamp: new Date().toISOString(),
          subtotal,
          tax,
          total
        };
        setOrders(prev => [...prev, newOrder]);
        setTables(prev => prev.map(t => t.id === selectedTableId ? { ...t, status: 'Occupied', currentOrderId: newOrder.id } : t));
        toast(`Table ${selectedTable?.number} session started`, "success");
      }
    } else {
        // Takeaway
        const newOrder: Order = {
          id: `tkw-${Date.now()}`,
          orderType: 'Takeaway',
          items: [...cart],
          status: 'Pending',
          timestamp: new Date().toISOString(),
          subtotal,
          tax,
          total
        };
        setOrders(prev => [...prev, newOrder]);
        toast("Takeaway order placed successfully", "success");
    }
    setCart([]);
  };

  const clearTableBill = (tableId: string) => {
    const orderToPay = orders.find(o => o.tableId === tableId && o.status !== 'Paid');
    if (orderToPay) setOrders(prev => prev.map(o => o.id === orderToPay.id ? { ...o, status: 'Paid' } : o));
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status: 'Available', currentOrderId: undefined } : t));
    toast("Bill settled successfully", "success");
  };

  const voidTableOrder = (tableId: string) => {
    const orderToVoid = orders.find(o => o.tableId === tableId && o.status !== 'Paid');
    if (orderToVoid) setOrders(prev => prev.filter(o => o.id !== orderToVoid.id));
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status: 'Available', currentOrderId: undefined } : t));
    toast("Session cancelled", "info");
  };

  const updateDraftTable = (id: string, updates: Partial<Table>) => {
    setDraftTables(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const updateDraftFloor = (id: string, updates: Partial<Floor>) => {
    setDraftFloors(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const addNewFloor = () => {
    const newId = `f-${Date.now()}`;
    const newFloor: Floor = { id: newId, name: `Floor ${draftFloors.length + 1}`, width: 20, height: 20 };
    setDraftFloors(prev => [...prev, newFloor]);
    setActiveFloorId(newId);
    setEditingFloorId(newId);
    toast("New floor node added", "success");
  };

  const deleteFloor = (id: string) => {
    if (draftFloors.length <= 1) {
      toast("At least one floor is required", "error");
      return;
    }
    const updatedFloors = draftFloors.filter(f => f.id !== id);
    setDraftFloors(updatedFloors);
    setDraftTables(prev => prev.filter(t => t.floorId !== id));
    if (activeFloorId === id) setActiveFloorId(updatedFloors[0].id);
    toast("Floor node removed", "info");
  };

  const addNewTable = () => {
    if (!activeFloors.find(f => f.id === activeFloorId)) return;
    const newId = `t-${Date.now()}`;
    const newTable: Table = {
      id: newId, number: draftTables.length + 1, capacity: 4, status: 'Available',
      x: 2, y: 2, width: 3, height: 3, rotation: 0, floorId: activeFloorId
    };
    setDraftTables(prev => [...prev, newTable]);
    setSelectedTableId(newId);
  };

  const deleteDraftTable = (id: string) => {
    setDraftTables(prev => prev.filter(t => t.id !== id));
    setSelectedTableId(null);
  };

  const handleAddDish = (dish: MenuItem) => {
    setMenuItems(prev => [...prev, dish]);
    toast(`${dish.name} registered`, "success");
  };

  const handleUpdateDish = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    toast("Asset updated", "success");
  };

  const handleDeleteDish = (id: string) => {
    setMenuItems(prev => prev.filter(m => m.id !== id));
    toast("Asset removed from registry", "info");
  };

  // Staff Management Handlers
  const addWaiter = (waiter: Waiter) => {
    setWaiters(prev => [...prev, waiter]);
    toast(`Staff ${waiter.name} added`, "success");
  };

  const updateWaiter = (id: string, updates: Partial<Waiter>) => {
    setWaiters(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const deleteWaiter = (id: string) => {
    setWaiters(prev => prev.filter(w => w.id !== id));
    toast("Staff member removed", "info");
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            stats={stats} liveTraffic={liveTraffic} insights={insights} 
            fetchAIInsights={fetchAIInsights} tables={tables} orders={orders} 
            menuItems={menuItems} setActiveTab={setActiveTab}
          />
        );
      case 'tables':
        return (
          <FloorMapView 
            isMobile={isMobile} activeFloors={activeFloors} activeTables={activeTables} 
            activeFloorId={activeFloorId} setActiveFloorId={setActiveFloorId} 
            viewMode={viewMode} setViewMode={setViewMode} isEditMode={isEditMode} 
            enterEditMode={enterEditMode} cancelEdit={cancelEdit} saveEdit={saveEdit} 
            addNewFloor={addNewFloor} deleteFloor={deleteFloor} addNewTable={addNewTable} 
            deleteDraftTable={deleteDraftTable} selectedTableId={selectedTableId} 
            setSelectedTableId={setSelectedTableId} updateDraftTable={updateDraftTable} 
            updateDraftFloor={updateDraftFloor} editingFloorId={editingFloorId} 
            setEditingFloorId={setEditingFloorId} mapRotation={mapRotation} 
            setMapRotation={setMapRotation} mapPitch={mapPitch} setMapPitch={setMapPitch} 
            orders={orders} clearTableBill={clearTableBill} voidTableOrder={voidTableOrder} 
            setActiveTab={setActiveTab}
          />
        );
      case 'pos':
        return (
          <POSView 
            selectedTable={selectedTable} setSelectedTableId={setSelectedTableId} 
            searchQuery={searchQuery} setSearchQuery={setSearchQuery} CATEGORIES={CATEGORIES} 
            activeCategory={activeCategory} setActiveCategory={setActiveCategory} 
            menuItems={menuItems} addToCart={addToCart} cart={cart} 
            updateQuantity={(id, d) => setCart(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(0, i.quantity + d)} : i).filter(i => i.quantity > 0))} 
            removeFromCart={(id) => setCart(prev => prev.filter(i => i.id !== id))} 
            handleCheckout={handleCheckout} upsellSuggestions={upsellSuggestions}
            orderType={orderType} setOrderType={setOrderType}
          />
        );
      case 'waiters':
        return (
          <StaffView 
            waiters={waiters} 
            addWaiter={addWaiter} 
            updateWaiter={updateWaiter} 
            deleteWaiter={deleteWaiter} 
          />
        );
      case 'inventory':
        return (
          <InventoryView 
            handleAddDish={handleAddDish} 
            handleUpdateDish={handleUpdateDish}
            handleDeleteDish={handleDeleteDish}
            CATEGORIES={CATEGORIES} 
            menuItems={menuItems}
          />
        );
      case 'insights':
        return <InsightsView insights={insights} fetchAIInsights={fetchAIInsights} isLoading={isLoadingInsights} />;
      default:
        return <div className="p-10 text-zinc-500 uppercase tracking-widest text-xs font-bold">Node selection required.</div>;
    }
  };

  if (!user) {
    return (
      <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 text-foreground overflow-hidden font-sans">
        <Toaster />
        <Auth onAuthSuccess={setUser} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 text-foreground overflow-hidden font-sans selection:bg-indigo-500/30">
      <Toaster />
      <Sidebar 
        activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} 
        toggleDarkMode={() => setDarkMode(!darkMode)} user={user} onLogout={handleLogout} 
      />
      <main className="flex-1 lg:ml-72 transition-all h-full relative">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;