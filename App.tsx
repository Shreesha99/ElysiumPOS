import React, { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "./components/Sidebar";
import Auth from "./components/Auth";
import { Toaster, toast } from "./components/Toaster";
import {
  MenuItem,
  Category,
  BusinessInsight,
  Table,
  Waiter,
  Order,
  Floor,
  CartItem,
  OrderType,
} from "./types";
import { CATEGORIES } from "./constants";
import { geminiService } from "./services/geminiService";
import { authService, AppUser } from "./services/authService";
import { staffService } from "./services/staffService";
import { tableService } from "./services/tableService";
import { floorService } from "./services/floorService";
import { menuService } from "./services/menuService";
import { orderService } from "./services/orderService";

// View Components
import DashboardView from "./components/DashboardView";
import FloorMapView from "./components/FloorMapView";
import POSView from "./components/POSView/POSView";
import StaffView from "./components/StaffView/StaffView";
import InventoryView from "./components/InventoryView/InventoryView";
import InsightsView from "./components/InsightsView";
import SupportView from "./components/SupportView";

const App: React.FC = () => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("elysium_active_tab") || "pos";
  });

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("elysium_theme") === "dark"
  );
  const [activeCategory, setActiveCategory] = useState<Category>("Starters");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const [draftTables, setDraftTables] = useState<Table[]>([]);
  const [draftFloors, setDraftFloors] = useState<Floor[]>([]);
  const [editingFloorId, setEditingFloorId] = useState<string | null>(null);
  const [isSavingLayout, setIsSavingLayout] = useState(false);

  // ======================
  // Spatial Editor History
  // ======================
  interface LayoutSnapshot {
    floors: Floor[];
    tables: Table[];
  }

  const [history, setHistory] = useState<LayoutSnapshot[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isProcessingTableAction, setIsProcessingTableAction] = useState(false);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [activeFloorId, setActiveFloorId] = useState<string>("");

  const [orderType, setOrderType] = useState<OrderType>("Dining");

  const [mapRotation, setMapRotation] = useState(-20);
  const [mapPitch, setMapPitch] = useState(45);

  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [insightError, setInsightError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [upsellSuggestions, setUpsellSuggestions] = useState<string[]>([]);

  const [liveTraffic, setLiveTraffic] = useState(
    Math.floor(Math.random() * 50) + 20
  );

  useEffect(() => {
    const unsubscribe = authService.subscribe((u) => {
      setUser(u);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!activeOrderId) return;

    const order = orders.find((o) => o.id === activeOrderId);
    if (!order) return;

    setCart(order.items);
    setSelectedTableId(order.tableId || null);
    setOrderType(order.orderType);
  }, [activeOrderId, orders]);

  useEffect(() => {
    if (!user) return;

    const loadRestaurantData = async () => {
      const [staff, tables, floors, menu, orders] = await Promise.all([
        staffService.getAll(),
        tableService.getAll(),
        floorService.getAll(),
        menuService.getAll(),
        orderService.getAll(),
      ]);

      setWaiters(staff);
      setTables(tables);
      setFloors(floors);
      setMenuItems(menu);
      setOrders(orders);
    };

    loadRestaurantData();
  }, [user]);
  useEffect(() => {
    localStorage.setItem("elysium_active_tab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (floors.length > 0 && !activeFloorId) {
      setActiveFloorId(floors[0].id);
    }
  }, [floors]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setMenuItems([]);
    setFloors([]);
    setTables([]);
    setWaiters([]);
    setOrders([]);
    setCart([]);
    setSelectedTableId(null);
    setInsights([]);
    setInsightError(null);
    toast("User session terminated", "info");
  };

  const activeTables = isEditMode ? draftTables : tables;
  const activeFloors = isEditMode ? draftFloors : floors;

  const selectedTable = useMemo(
    () => activeTables.find((t) => t.id === selectedTableId),
    [activeTables, selectedTableId]
  );

  const stats = useMemo(() => {
    const settledOrders = orders.filter(
      (o) =>
        o.status === "Paid" &&
        (o.orderType === "Dining" || o.orderType === "Takeaway")
    );
    const totalRevenue = settledOrders.reduce((acc, o) => acc + o.total, 0);

    const pendingOrdersCount = orders.filter((o) => o.status !== "Paid").length;
    const avgOrderValue =
      settledOrders.length > 0 ? totalRevenue / settledOrders.length : 0;
    const occupiedTables = tables.filter((t) => t.status === "Occupied").length;
    const occupancyRate = (occupiedTables / (tables.length || 1)) * 100;
    const hourlySales = Array.from({ length: 12 }, (_, i) => ({
      hour: `${i + 9}:00`,
      value: Math.floor(Math.random() * 5000) + 1000,
    }));
    return {
      totalRevenue,
      pendingOrdersCount,
      avgOrderValue,
      occupiedTables,
      occupancyRate,
      hourlySales,
    };
  }, [orders, tables]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile && viewMode === "3d") setViewMode("2d");
    };
    window.addEventListener("resize", handleResize);
    const interval = setInterval(() => {
      setLiveTraffic((prev) =>
        Math.max(10, prev + (Math.random() > 0.5 ? 2 : -2))
      );
    }, 5000);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, [viewMode]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("elysium_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Upselling suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (cart.length > 0 && menuItems.length > 0) {
        const suggestions = await geminiService.getUpsellSuggestions(
          cart,
          menuItems
        );
        setUpsellSuggestions(suggestions);
      } else {
        setUpsellSuggestions([]);
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [cart, menuItems]);

  const fetchAIInsights = useCallback(async () => {
    setIsLoadingInsights(true);
    setInsightError(null);
    try {
      const data = await geminiService.getBusinessInsights({
        revenue: stats.totalRevenue,
        occupancy: stats.occupancyRate.toFixed(1),
        staff: waiters.length,
        menuItems: menuItems.length,
        pendingOrders: stats.pendingOrdersCount,
      });
      setInsights(data);
    } catch (err: any) {
      if (err.message === "API_KEY_MISSING") setInsightError("KEY_MISSING");
      else if (err.message === "QUOTA_EXHAUSTED")
        setInsightError("QUOTA_REACHED");
      else setInsightError("GENERAL_ERROR");
    } finally {
      setIsLoadingInsights(false);
    }
  }, [
    stats.totalRevenue,
    stats.occupancyRate,
    stats.pendingOrdersCount,
    waiters.length,
    menuItems.length,
  ]);

  const pushToHistory = (floors: Floor[], tables: Table[]) => {
    setHistory((prev) => {
      const trimmed = prev.slice(0, historyIndex + 1);

      const snapshot: LayoutSnapshot = {
        floors: JSON.parse(JSON.stringify(floors)),
        tables: JSON.parse(JSON.stringify(tables)),
      };

      const newHistory = [...trimmed, snapshot];
      setHistoryIndex(newHistory.length - 1);

      return newHistory;
    });
  };

  const enterEditMode = () => {
    // if (viewMode !== "3d") setViewMode("3d");

    const floorCopy = JSON.parse(JSON.stringify(floors));
    const tableCopy = JSON.parse(JSON.stringify(tables));

    setDraftFloors(floorCopy);
    setDraftTables(tableCopy);

    setHistory([{ floors: floorCopy, tables: tableCopy }]);
    setHistoryIndex(0);

    setIsEditMode(true);
    toast("Spatial editor active", "info");
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setSelectedTableId(null);
    setEditingFloorId(null);
    toast("Changes discarded", "info");
  };

  const saveEdit = async () => {
    try {
      setIsSavingLayout(true);

      for (const table of draftTables) {
        if (table.id.startsWith("temp-")) {
          await tableService.create({
            number: table.number,
            capacity: table.capacity,
            status: table.status,
            x: table.x,
            y: table.y,
            width: table.width,
            height: table.height,
            rotation: table.rotation || 0,
            floorId: table.floorId,
          });
        } else {
          await tableService.update(table.id, table);
        }
      }
      // Delete removed floors
      const removedFloors = floors.filter(
        (f) => !draftFloors.some((df) => df.id === f.id)
      );

      for (const floor of removedFloors) {
        await floorService.delete(floor.id);

        const floorTables = tables.filter((t) => t.floorId === floor.id);
        for (const table of floorTables) {
          await tableService.delete(table.id);
        }
      }

      for (const floor of draftFloors) {
        if (floor.id.startsWith("temp-")) {
          await floorService.create({
            name: floor.name,
            width: floor.width,
            height: floor.height,
          });
        } else {
          await floorService.update(floor.id, floor);
        }
      }

      const updatedTables = await tableService.getAll();
      const updatedFloors = await floorService.getAll();

      setTables(updatedTables);
      setFloors(updatedFloors);

      setIsEditMode(false);
      toast("Spatial map saved", "success");
    } catch (err) {
      toast("Save failed", "error");
    } finally {
      setIsSavingLayout(false);
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing)
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      return [...prev, { ...item, quantity: 1 }];
    });
    toast(`${item.name} added`, "success");
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      setIsSubmittingOrder(true);

      if (orderType === "Dining" && !selectedTableId) {
        toast("Please select a table for Dining orders", "error");
        return;
      }

      const subtotal = cart.reduce(
        (acc, mi) => acc + mi.price * mi.quantity,
        0
      );
      const tax = subtotal * 0.12;
      const total = subtotal + tax;

      const orderPayload: Omit<Order, "id"> = {
        orderType,
        items: [...cart],
        status: orderType === "Takeaway" ? "Paid" : "Pending",
        timestamp: new Date().toISOString(),
        subtotal,
        tax,
        total,
        ...(orderType === "Dining" && selectedTableId
          ? { tableId: selectedTableId }
          : {}),
      };

      if (activeOrderId) {
        // UPDATE EXISTING ORDER
        await orderService.update(activeOrderId, orderPayload);
      } else {
        // CREATE NEW ORDER
        const docRef = await orderService.create(orderPayload);

        if (orderType === "Dining" && selectedTableId) {
          await tableService.update(selectedTableId, {
            status: "Occupied",
            currentOrderId: docRef.id,
          });
        }

        setActiveOrderId(docRef.id);
      }

      const updatedOrders = await orderService.getAll();
      const updatedTables = await tableService.getAll();

      setOrders(updatedOrders);
      setTables(updatedTables);

      if (orderType === "Takeaway") {
        // Takeaway ends immediately
        setCart([]);
        setActiveOrderId(null);
      } else {
        // Dining order stays active
        setCart(orderPayload.items);
      }

      toast("Order saved successfully", "success");
    } catch (error) {
      console.error(error);
      toast("Order failed", "error");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const clearTableBill = async (tableId: string) => {
    const orderToPay = orders.find(
      (o) => o.tableId === tableId && o.status !== "Paid"
    );

    if (!orderToPay) return;

    try {
      setIsProcessingTableAction(true);

      await orderService.update(orderToPay.id, { status: "Paid" });

      await tableService.update(tableId, {
        status: "Available",
        currentOrderId: null,
      });

      const updatedOrders = await orderService.getAll();
      const updatedTables = await tableService.getAll();

      setOrders(updatedOrders);
      setTables(updatedTables);

      toast("Bill settled successfully", "success");
    } catch (err) {
      toast("Failed to settle bill", "error");
    } finally {
      setIsProcessingTableAction(false);
    }
  };

  const voidTableOrder = async (tableId: string) => {
    const orderToVoid = orders.find(
      (o) => o.tableId === tableId && o.status !== "Paid"
    );

    if (!orderToVoid) return;

    try {
      setIsProcessingTableAction(true);

      await orderService.delete(orderToVoid.id);

      await tableService.update(tableId, {
        status: "Available",
        currentOrderId: null,
      });

      const updatedOrders = await orderService.getAll();
      const updatedTables = await tableService.getAll();

      setOrders(updatedOrders);
      setTables(updatedTables);

      toast("Session cancelled", "info");
    } catch (err) {
      toast("Failed to cancel session", "error");
    } finally {
      setIsProcessingTableAction(false);
    }
  };

  const updateDraftTable = (id: string, updates: Partial<Table>) => {
    if (!isEditMode) return;

    const updatedTables = draftTables.map((t) =>
      t.id === id ? { ...t, ...updates } : t
    );

    setDraftTables(updatedTables);
    pushToHistory(draftFloors, updatedTables);
  };

  const updateDraftFloor = (id: string, updates: Partial<Floor>) => {
    if (!isEditMode) return;

    const updatedFloors = draftFloors.map((f) =>
      f.id === id ? { ...f, ...updates } : f
    );

    setDraftFloors(updatedFloors);
    pushToHistory(updatedFloors, draftTables);
  };

  const addNewFloor = () => {
    if (!isEditMode) return;

    const newFloor: Floor = {
      id: `temp-${Date.now()}`,
      name: `Floor ${draftFloors.length + 1}`,
      width: 20,
      height: 20,
    };

    const updatedFloors = [...draftFloors, newFloor];

    setDraftFloors(updatedFloors);
    setActiveFloorId(newFloor.id);

    pushToHistory(updatedFloors, draftTables);
  };

  const deleteFloor = (id: string) => {
    if (!isEditMode) return;

    const updatedFloors = draftFloors.filter((f) => f.id !== id);
    const updatedTables = draftTables.filter((t) => t.floorId !== id);

    setDraftFloors(updatedFloors);
    setDraftTables(updatedTables);

    pushToHistory(updatedFloors, updatedTables);

    toast("Floor removed from layout", "info");
  };

  const addNewTable = () => {
    if (!isEditMode) return;

    let floorIdToUse = activeFloorId;
    let updatedFloors = [...draftFloors];

    // 1️⃣ If no floors exist at all → auto create one
    if (updatedFloors.length === 0) {
      const newFloor: Floor = {
        id: `temp-${Date.now()}`,
        name: "Main Floor",
        width: 20,
        height: 20,
      };

      updatedFloors = [...updatedFloors, newFloor];
      setDraftFloors(updatedFloors);
      setActiveFloorId(newFloor.id);

      floorIdToUse = newFloor.id;
    }

    // 2️⃣ If floors exist but none selected → select first
    if (!floorIdToUse && updatedFloors.length > 0) {
      floorIdToUse = updatedFloors[0].id;
      setActiveFloorId(floorIdToUse);
    }

    if (!floorIdToUse) return;

    // 3️⃣ Generate number per floor
    const tablesOnFloor = draftTables.filter((t) => t.floorId === floorIdToUse);

    const nextNumber =
      tablesOnFloor.length > 0
        ? Math.max(...tablesOnFloor.map((t) => t.number)) + 1
        : 1;

    const newTable: Table = {
      id: `temp-${Date.now()}`,
      number: nextNumber,
      capacity: 4,
      status: "Available",
      x: 2,
      y: 2,
      width: 3,
      height: 3,
      rotation: 0,
      floorId: floorIdToUse,
    };

    const updatedTables = [...draftTables, newTable];

    setDraftTables(updatedTables);
    pushToHistory(updatedFloors, updatedTables);
  };

  const deleteDraftTable = (id: string) => {
    if (!isEditMode) return;

    const updatedTables = draftTables.filter((t) => t.id !== id);

    setDraftTables(updatedTables);
    pushToHistory(draftFloors, updatedTables);
  };

  const handleUndo = () => {
    if (historyIndex <= 0) return;

    const newIndex = historyIndex - 1;
    const snapshot = history[newIndex];

    setDraftFloors(snapshot.floors);
    setDraftTables(snapshot.tables);
    setHistoryIndex(newIndex);
  };

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;

    const newIndex = historyIndex + 1;
    const snapshot = history[newIndex];

    setDraftFloors(snapshot.floors);
    setDraftTables(snapshot.tables);
    setHistoryIndex(newIndex);
  };

  const handleAddDish = async (dish: MenuItem) => {
    await menuService.create(dish);
    const updated = await menuService.getAll();
    setMenuItems(updated);

    toast(`${dish.name} registered`, "success");
  };

  const handleUpdateDish = async (id: string, updates: Partial<MenuItem>) => {
    await menuService.update(id, updates);
    const updated = await menuService.getAll();
    setMenuItems(updated);

    toast("Asset updated", "success");
  };

  const handleDeleteDish = async (id: string) => {
    await menuService.delete(id);
    const updated = await menuService.getAll();
    setMenuItems(updated);

    toast("Asset removed from registry", "info");
  };

  const addWaiter = async (name: string, email: string, password: string) => {
    await staffService.create(name, email, password);

    const updated = await staffService.getAll();
    setWaiters(updated);

    toast(`Staff ${name} added`, "success");
  };

  const updateWaiter = async (id: string, updates: Partial<Waiter>) => {
    await staffService.update(id, updates);
    const updated = await staffService.getAll();
    setWaiters(updated);
  };

  const deleteWaiter = async (id: string) => {
    await staffService.delete(id);
    const updated = await staffService.getAll();
    setWaiters(updated);

    toast("Staff member removed", "info");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardView
            stats={stats}
            liveTraffic={liveTraffic}
            insights={insights}
            fetchAIInsights={fetchAIInsights}
            tables={tables}
            orders={orders}
            menuItems={menuItems}
            setActiveTab={setActiveTab}
          />
        );
      case "tables":
        return (
          <FloorMapView
            activeOrderId={activeOrderId}
            setActiveOrderId={setActiveOrderId}
            isMobile={isMobile}
            activeFloors={activeFloors}
            activeTables={activeTables}
            activeFloorId={activeFloorId}
            setActiveFloorId={setActiveFloorId}
            viewMode={viewMode}
            setViewMode={setViewMode}
            isEditMode={isEditMode}
            enterEditMode={enterEditMode}
            cancelEdit={cancelEdit}
            saveEdit={saveEdit}
            saveLoading={isSavingLayout}
            addNewFloor={addNewFloor}
            deleteFloor={deleteFloor}
            addNewTable={addNewTable}
            deleteDraftTable={deleteDraftTable}
            selectedTableId={selectedTableId}
            setSelectedTableId={setSelectedTableId}
            updateDraftTable={updateDraftTable}
            updateDraftFloor={updateDraftFloor}
            editingFloorId={editingFloorId}
            setEditingFloorId={setEditingFloorId}
            mapRotation={mapRotation}
            setMapRotation={setMapRotation}
            mapPitch={mapPitch}
            setMapPitch={setMapPitch}
            orders={orders}
            clearTableBill={clearTableBill}
            voidTableOrder={voidTableOrder}
            setActiveTab={setActiveTab}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            isProcessingTableAction={isProcessingTableAction}
          />
        );
      case "pos":
        return (
          <POSView
            selectedTable={selectedTable}
            setSelectedTableId={setSelectedTableId}
            activeOrderId={activeOrderId}
            setActiveOrderId={setActiveOrderId}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            CATEGORIES={CATEGORIES}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            menuItems={menuItems}
            addToCart={addToCart}
            cart={cart}
            updateQuantity={(id, d) =>
              setCart((prev) =>
                prev
                  .map((i) =>
                    i.id === id
                      ? { ...i, quantity: Math.max(0, i.quantity + d) }
                      : i
                  )
                  .filter((i) => i.quantity > 0)
              )
            }
            removeFromCart={(id) =>
              setCart((prev) => prev.filter((i) => i.id !== id))
            }
            handleCheckout={handleCheckout}
            upsellSuggestions={upsellSuggestions}
            orderType={orderType}
            setOrderType={setOrderType}
            isSubmittingOrder={isSubmittingOrder}
          />
        );
      case "waiters":
        return (
          <StaffView
            waiters={waiters}
            addWaiter={addWaiter}
            updateWaiter={updateWaiter}
            deleteWaiter={deleteWaiter}
          />
        );
      case "inventory":
        return (
          <InventoryView
            handleAddDish={handleAddDish}
            handleUpdateDish={handleUpdateDish}
            handleDeleteDish={handleDeleteDish}
            CATEGORIES={CATEGORIES}
            menuItems={menuItems}
          />
        );
      case "insights":
        return (
          <InsightsView
            insights={insights}
            fetchAIInsights={fetchAIInsights}
            isLoading={isLoadingInsights}
            error={insightError}
          />
        );
      case "support":
        return <SupportView />;
      default:
        return (
          <div className="p-10 text-zinc-500 uppercase tracking-widest text-xs font-bold">
            Node selection required.
          </div>
        );
    }
  };

  // 1️⃣ Wait for Firebase to restore session FIRST
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-600 blur-[180px] rounded-full animate-pulse" />
        </div>

        {/* Loader Content */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Spinning Ring */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-zinc-200 dark:border-zinc-800"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          </div>

          {/* Brand Text */}
          <div className="text-center">
            <h2 className="text-xl font-black tracking-widest uppercase text-zinc-900 dark:text-white">
              Elysium POS
            </h2>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400 mt-2">
              Restoring Session
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2️⃣ After loading finished, decide auth vs app
  if (!user) {
    return (
      <div className="flex min-h-[100dvh] w-full bg-zinc-50 dark:bg-zinc-950 text-foreground font-sans">
        <Toaster />
        <Auth onAuthSuccess={(u) => setUser(u)} />
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] w-full bg-zinc-50 dark:bg-zinc-950 text-foreground font-sans selection:bg-indigo-500/30">
      <Toaster />
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        user={user}
        onLogout={handleLogout}
      />
      <main className="flex-1 lg:ml-72 transition-all relative min-w-0 h-screen overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
