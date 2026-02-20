import React, { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Auth from "./components/AuthView/Auth";
import { Toaster, toast } from "./components/Components/Toaster";
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
import DashboardView from "./components/DashboardView/DashboardView";
import FloorMapView from "./components/FloorMapView";
import POSView from "./components/POSView/POSView";
import StaffView from "./components/StaffView/StaffView";
import InventoryView from "./components/InventoryView/InventoryView";
import InsightsView from "./components/InsightsView/InsightsView";
import SupportView from "./components/SupportView/SupportView";
import KitchenView from "./components/KitchenView/KitchenView";
import PaymentModal from "./components/Components/PaymentModal";

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

  const [paymentOrderId, setPaymentOrderId] = useState<string | null>(null);

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

  const [mapRotation, setMapRotation] = useState(0);
  const [mapPitch, setMapPitch] = useState(10);
  const [deletedTableIds, setDeletedTableIds] = useState<string[]>([]);

  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [insightError, setInsightError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [upsellSuggestions, setUpsellSuggestions] = useState<string[]>([]);

  const [liveTraffic, setLiveTraffic] = useState(
    Math.floor(Math.random() * 50) + 20
  );

  const [isSyncing, setIsSyncing] = useState(false);

  const handleFullSync = async () => {
    if (isEditMode) {
      toast(
        "The 3D spatial editor is active. Save your changes or exit edit mode before synchronizing. Sync will reset the layout session.",
        "error"
      );
      return;
    }

    try {
      setIsSyncing(true);
      toast("Secure cloud synchronization started", "info");

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

      toast("All systems synchronized successfully", "success");
    } catch (err) {
      toast("Synchronization failed", "error");
    } finally {
      setIsSyncing(false);
    }
  };

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
    if (order.paymentStatus === "Paid" || order.status === "Voided") {
      setActiveOrderId(null);
      setCart([]);
      return;
    }

    const restoredCart: CartItem[] = order.items.map((item) => {
      const fullMenuItem = menuItems.find((mi) => mi.id === item.menuItemId);

      return {
        ...(fullMenuItem ?? {
          id: item.menuItemId,
          name: item.name,
          description: "",
          price: item.price,
          category: "Starters",
          image: "",
          stock: 0,
          foodType: "Veg",
        }),
        quantity: item.quantity,
      };
    });

    setCart(restoredCart);
    setSelectedTableId(order.tableId || null);
    setOrderType(order.orderType);
  }, [activeOrderId, orders, menuItems]);

  useEffect(() => {
    if (!selectedTableId) {
      setActiveOrderId(null);
      return;
    }

    const activeOrder = orders.find(
      (o) =>
        o.tableId === selectedTableId &&
        o.paymentStatus !== "Paid" &&
        o.status !== "Voided"
    );

    if (activeOrder) {
      setActiveOrderId(activeOrder.id);
    } else {
      setActiveOrderId(null);
      setCart([]);
    }
  }, [selectedTableId, orders]);

  useEffect(() => {
    if (!user) return;

    const unsubStaff = staffService.subscribe(setWaiters);

    const unsubTables = tableService.subscribe((data) => {
      if (!isEditMode && !isSavingLayout) {
        setTables(data);
      }
    });

    const unsubFloors = floorService.subscribe((data) => {
      if (!isEditMode && !isSavingLayout) {
        setFloors(data);
      }
    });

    const unsubMenu = menuService.subscribe(setMenuItems);

    const unsubOrders = orderService.subscribe((data) => {
      setOrders(data);
    });

    return () => {
      unsubStaff();
      unsubTables();
      unsubFloors();
      unsubMenu();
      unsubOrders();
    };
  }, [user, isEditMode, isSubmittingOrder]);

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
        o.paymentStatus === "Paid" &&
        (o.orderType === "Dining" || o.orderType === "Takeaway")
    );

    const totalRevenue = settledOrders.reduce((acc, o) => acc + o.total, 0);

    const pendingOrdersCount = orders.filter(
      (o) =>
        o.status === "Pending" ||
        o.status === "Preparing" ||
        o.status === "Served"
    ).length;
    const avgOrderValue =
      settledOrders.length > 0 ? totalRevenue / settledOrders.length : 0;
    const occupiedTables = tables.filter((t) => t.status === "Occupied").length;
    const occupancyRate = (occupiedTables / (tables.length || 1)) * 100;
    const hourlyMap: Record<string, number> = {};

    orders
      .filter((o) => o.paymentStatus === "Paid")

      .forEach((order) => {
        const hour =
          order.createdAt.toDate().getHours().toString().padStart(2, "0") +
          ":00";

        hourlyMap[hour] = (hourlyMap[hour] || 0) + order.total;
      });

    const hourlySales = Object.entries(hourlyMap).map(([hour, value]) => ({
      hour,
      value,
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
    const floorCopy = JSON.parse(JSON.stringify(floors));
    const tableCopy = JSON.parse(JSON.stringify(tables));

    setDraftFloors(floorCopy);
    setDraftTables(tableCopy);

    setHistory([{ floors: floorCopy, tables: tableCopy }]);
    setHistoryIndex(0);

    // 🔥 Ensure active floor exists
    if (floorCopy.length > 0) {
      setActiveFloorId(floorCopy[0].id);
    }

    setIsEditMode(true);
    toast("Spatial editor active", "info");
  };

  const cancelEdit = () => {
    setDeletedTableIds([]);

    setIsEditMode(false);
    setSelectedTableId(null);
    setEditingFloorId(null);
    toast("Changes discarded", "info");
  };

  const saveEdit = async () => {
    try {
      setIsSavingLayout(true);
      for (const id of deletedTableIds) {
        await tableService.delete(id);
      }

      for (const table of draftTables.filter(
        (t) => !deletedTableIds.includes(t.id)
      )) {
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

      // Realtime listeners will update tables and floors automatically
      setDeletedTableIds([]);

      // 🔥 Sync live state to draft BEFORE exiting edit mode
      setTables(draftTables.filter((t) => !deletedTableIds.includes(t.id)));
      setFloors(draftFloors);

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

      const orderItems = cart.map((item) => ({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        status: "Queued" as const,
        station: "General" as const,
      }));

      const orderPayload: Omit<Order, "id" | "createdAt" | "updatedAt"> = {
        tableId: orderType === "Dining" ? selectedTableId : null,
        floorId: selectedTable ? selectedTable.floorId : null,
        status: "Pending",
        paymentStatus: "Unpaid",
        payments: [],
        orderType,
        items: orderItems,
        total,
        waiterId: user?.id ?? undefined,
      };

      if (activeOrderId) {
        const existingOrder = orders.find((o) => o.id === activeOrderId);

        if (!existingOrder) return;

        {
          const mergedItems = [...existingOrder.items];

          orderPayload.items.forEach((newItem) => {
            const existing = mergedItems.find(
              (i) => i.menuItemId === newItem.menuItemId
            );

            if (existing) {
              existing.quantity += newItem.quantity;
            } else {
              mergedItems.push(newItem);
            }
          });

          const newSubtotal = mergedItems.reduce(
            (acc, mi) => acc + mi.price * mi.quantity,
            0
          );
          const newTax = newSubtotal * 0.12;
          const newTotal = newSubtotal + newTax;
          await orderService.update(activeOrderId, {
            items: mergedItems,
            total: newTotal,
            status: "Pending", // 🔥 FORCE BACK TO PENDING
          });
        }
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

      // Realtime listeners will update orders and tables automatically

      setCart([]);

      // For takeaway reset session completely
      if (orderType === "Takeaway") {
        setActiveOrderId(null);
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
      (o) =>
        o.tableId === tableId &&
        o.status !== "Voided" &&
        o.paymentStatus !== "Paid"
    );

    if (!orderToPay) return;

    if (orderToPay.orderType === "Dining" && orderToPay.status !== "Served") {
      toast("Kitchen has not completed this order", "error");
      return;
    }

    try {
      setIsProcessingTableAction(true);

      await orderService.addPayment(orderToPay.id, {
        amount: orderToPay.total,
        mode: "Cash",
        collectedBy: user?.id,
      });

      await tableService.update(tableId, {
        status: "Available",
        currentOrderId: null,
      });

      setActiveOrderId(null);
      setSelectedTableId(null);
      setCart([]);

      toast("Bill settled successfully", "success");
    } catch (err) {
      toast("Failed to settle bill", "error");
    } finally {
      setIsProcessingTableAction(false);
    }
  };

  const voidTableOrder = async (tableId: string) => {
    const orderToVoid = orders.find(
      (o) =>
        o.tableId === tableId &&
        (o.status === "Pending" ||
          o.status === "Preparing" ||
          o.status === "Served")
    );

    if (!orderToVoid) return;

    try {
      setIsProcessingTableAction(true);

      await orderService.void(orderToVoid.id, user?.id ?? "system");

      await tableService.update(tableId, {
        status: "Available",
        currentOrderId: null,
      });

      // Realtime listeners will update orders and tables automatically

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

  const addNewTableToFloor = (floorId: string): string | null => {
    if (!isEditMode) return null;

    const floor = draftFloors.find((f) => f.id === floorId);
    if (!floor) return null;

    const tablesOnFloor = draftTables.filter((t) => t.floorId === floorId);

    const nextNumber =
      tablesOnFloor.length > 0
        ? Math.max(...tablesOnFloor.map((t) => t.number)) + 1
        : 1;

    const newId = `temp-${Date.now()}`;

    const newTable: Table = {
      id: newId,
      number: nextNumber,
      capacity: 4,
      status: "Available",
      x: Math.floor(floor.width / 2) - 1,
      y: Math.floor(floor.height / 2) - 1,
      width: 3,
      height: 3,
      rotation: 0,
      floorId: floorId,
    };

    const updatedTables = [...draftTables, newTable];

    setDraftTables(updatedTables);
    pushToHistory(draftFloors, updatedTables);

    return newId;
  };

  const addNewTable = (): string | null => {
    if (!isEditMode) return null;

    let floorIdToUse =
      activeFloorId || (draftFloors.length > 0 ? draftFloors[0].id : "");

    let updatedFloors = [...draftFloors];

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

    if (!floorIdToUse && updatedFloors.length > 0) {
      floorIdToUse = updatedFloors[0].id;
      setActiveFloorId(floorIdToUse);
    }

    if (!floorIdToUse) return null;

    const tablesOnFloor = draftTables.filter((t) => t.floorId === floorIdToUse);

    const nextNumber =
      tablesOnFloor.length > 0
        ? Math.max(...tablesOnFloor.map((t) => t.number)) + 1
        : 1;

    const newId = `temp-${Date.now()}`;

    const newTable: Table = {
      id: newId,
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

    return newId;
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
    toast(`${dish.name} registered`, "success");
  };

  const handleUpdateDish = async (id: string, updates: Partial<MenuItem>) => {
    await menuService.update(id, updates);
    toast("Asset updated", "success");
  };

  const handleDeleteDish = async (id: string) => {
    await menuService.delete(id);
    toast("Asset removed from registry", "info");
  };

  const addWaiter = async (name: string, email: string, password: string) => {
    await staffService.create(name, email, password);
    toast(`Staff ${name} added`, "success");
  };

  const updateWaiter = async (id: string, updates: Partial<Waiter>) => {
    await staffService.update(id, updates);
  };

  const deleteWaiter = async (id: string) => {
    await staffService.delete(id);
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
            deletedTableIds={deletedTableIds}
            setDeletedTableIds={setDeletedTableIds}
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
            addNewTableToFloor={addNewTableToFloor}
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
            clearTableBill={(tableId) => {
              const order = orders.find(
                (o) =>
                  o.tableId === tableId &&
                  o.status !== "Voided" &&
                  o.paymentStatus !== "Paid"
              );

              if (!order) return;

              setPaymentOrderId(order.id);
            }}
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
      case "kitchen":
        return (
          <KitchenView
            orders={orders}
            updateItemStatus={orderService.updateItemStatus}
          />
        );
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
        onSync={handleFullSync}
        isSyncing={isSyncing}
      />

      <main className="flex-1 lg:ml-72 transition-all relative min-w-0 h-screen overflow-hidden">
        {renderContent()}
      </main>
      {paymentOrderId && (
        <PaymentModal
          order={orders.find((o) => o.id === paymentOrderId)!}
          onClose={() => setPaymentOrderId(null)}
          onAddPayment={async (amount, mode) => {
            const order = orders.find((o) => o.id === paymentOrderId);
            if (!order) return;

            await orderService.addPayment(order.id, {
              amount,
              mode,
              collectedBy: user?.id,
            });

            // If this payment completes the order
            const totalPaid =
              order.payments.reduce((s, p) => s + p.amount, 0) + amount;

            if (totalPaid >= order.total && order.tableId) {
              await tableService.update(order.tableId, {
                status: "Available",
                currentOrderId: null,
              });

              setSelectedTableId(null);
              setActiveOrderId(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default App;
