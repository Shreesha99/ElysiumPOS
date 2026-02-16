import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MonitorOff,
  Plus,
  Layers,
  Box,
  Settings2,
  RotateCcw,
  CheckCircle2,
  Grip,
  Maximize,
  Users,
  Search,
  X,
  XCircle,
  Trash2,
  Undo2Icon,
  Redo2Icon,
  Building,
} from "lucide-react";
import { Table, Floor, Order } from "@/types";
import SectionHeader from "@/components/ui/SectionHeader";
import GlobalProcessingOverlay from "@/components/ui/GlobalProcessingOverlay";

const GRID_SIZE = 40;

interface FloorMapViewProps {
  isProcessingTableAction: boolean;
  isMobile: boolean;
  activeFloors: Floor[];
  activeTables: Table[];
  activeFloorId: string;
  setActiveFloorId: (id: string) => void;
  viewMode: "2d" | "3d";
  setViewMode: (mode: "2d" | "3d") => void;
  isEditMode: boolean;
  enterEditMode: () => void;
  cancelEdit: () => void;
  saveEdit: () => void;
  addNewFloor: () => void;
  deleteFloor: (id: string) => void;
  addNewTable: () => void;
  deleteDraftTable: (id: string) => void;
  selectedTableId: string | null;
  setSelectedTableId: (id: string | null) => void;
  updateDraftTable: (id: string, updates: Partial<Table>) => void;
  updateDraftFloor: (id: string, updates: Partial<Floor>) => void;
  editingFloorId: string | null;
  setEditingFloorId: (id: string | null) => void;
  mapRotation: number;
  setMapRotation: (val: number | ((prev: number) => number)) => void;
  mapPitch: number;
  setMapPitch: (val: number | ((prev: number) => number)) => void;
  orders: Order[];
  clearTableBill: (id: string) => void;
  voidTableOrder: (id: string) => void;
  setActiveTab: (tab: string) => void;
  saveLoading: boolean;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  activeOrderId: string | null;
  setActiveOrderId: (id: string | null) => void;
}

const FloorMapView: React.FC<FloorMapViewProps> = ({
  isMobile,
  activeFloors,
  activeTables,
  activeFloorId,
  setActiveFloorId,
  viewMode,
  setViewMode,
  isEditMode,
  enterEditMode,
  cancelEdit,
  saveEdit,
  addNewFloor,
  deleteFloor,
  addNewTable,
  deleteDraftTable,
  selectedTableId,
  setSelectedTableId,
  updateDraftTable,
  updateDraftFloor,
  editingFloorId,
  setEditingFloorId,
  mapRotation,
  setMapRotation,
  mapPitch,
  setMapPitch,
  orders,
  clearTableBill,
  voidTableOrder,
  setActiveTab,
  saveLoading,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  activeOrderId,
  setActiveOrderId,
  isProcessingTableAction,
}) => {
  const [tableSearch, setTableSearch] = useState("");
  const currentFloor = activeFloors.find((f) => f.id === activeFloorId);
  const selectedTable = activeTables.find((t) => t.id === selectedTableId);

  // If mobile and in 3D mode, force 2D or show restriction
  const show3DRestriction = isMobile && viewMode === "3d";

  const filteredTables = activeTables
    .filter((t) => t.floorId === activeFloorId)
    .filter(
      (t) => tableSearch === "" || t.number.toString().includes(tableSearch)
    );

  const renderTableNode = (table: Table) => {
    const isSelected = selectedTableId === table.id;
    const legs = [
      { x: 10, y: 10 },
      { x: 90, y: 10 },
      { x: 10, y: 90 },
      { x: 90, y: 90 },
    ];
    if (table.width > 5) legs.push({ x: 50, y: 10 }, { x: 50, y: 90 });
    if (table.height > 5) legs.push({ x: 10, y: 50 }, { x: 90, y: 50 });

    return (
      <div
        key={table.id}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedTableId(table.id);
        }}
        style={{
          position: "absolute",
          left: `${table.x * GRID_SIZE}px`,
          top: `${table.y * GRID_SIZE}px`,
          width: `${table.width * GRID_SIZE}px`,
          height: `${table.height * GRID_SIZE}px`,
          transformStyle: "preserve-3d",
          zIndex: isSelected ? 50 : 10,
        }}
      >
        <div
          className={`absolute inset-0 rounded-3xl border shadow-xl transition-all duration-300 flex flex-col items-center justify-center
          ${
            isSelected
              ? "ring-4 ring-indigo-500/40 border-indigo-500 bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-2xl"
              : table.status === "Occupied"
              ? "bg-gradient-to-br from-indigo-500 to-indigo-600 border-indigo-500 text-white shadow-xl"
              : "bg-white border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700"
          }`}
          style={{
            transform: `translateZ(40px) rotate(${table.rotation || 0}deg)`,
          }}
        >
          <span className="text-xl font-black uppercase tracking-tighter">
            T{table.number}
          </span>
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
                  const startX = e.clientX,
                    startY = e.clientY,
                    startTableX = table.x,
                    startTableY = table.y;
                  const move = (mv: MouseEvent) => {
                    if (!currentFloor) return;
                    const dx = Math.round((mv.clientX - startX) / GRID_SIZE),
                      dy = Math.round((mv.clientY - startY) / GRID_SIZE);
                    updateDraftTable(table.id, {
                      x: Math.max(
                        0,
                        Math.min(
                          startTableX + dx,
                          currentFloor.width - table.width
                        )
                      ),
                      y: Math.max(
                        0,
                        Math.min(
                          startTableY + dy,
                          currentFloor.height - table.height
                        )
                      ),
                    });
                  };
                  const up = () => {
                    window.removeEventListener("mousemove", move);
                    window.removeEventListener("mouseup", up);
                  };
                  window.addEventListener("mousemove", move);
                  window.addEventListener("mouseup", up);
                }}
              >
                <Grip size={20} />
              </div>

              {/* Rotation handle - Restore spatial rotation functionality */}
              <div
                className="absolute -top-6 -right-6 w-12 h-12 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-indigo-600 cursor-pointer shadow-2xl border-4 border-indigo-600 z-[60] hover:bg-indigo-600 hover:text-white transition-all active:scale-90"
                onClick={(e) => {
                  e.stopPropagation();
                  updateDraftTable(table.id, {
                    rotation: ((table.rotation || 0) + 45) % 360,
                  });
                }}
              >
                <RotateCcw size={20} />
              </div>

              <div
                className="absolute -bottom-6 -right-6 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white cursor-se-resize shadow-2xl border-4 border-white z-[60]"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  const startX = e.clientX,
                    startY = e.clientY,
                    startW = table.width,
                    startH = table.height;
                  const move = (mv: MouseEvent) => {
                    if (!currentFloor) return;
                    const dw = Math.round((mv.clientX - startX) / GRID_SIZE),
                      dh = Math.round((mv.clientY - startY) / GRID_SIZE);
                    const newW = Math.max(
                      2,
                      Math.min(startW + dw, currentFloor.width - table.x)
                    );
                    const newH = Math.max(
                      2,
                      Math.min(startH + dh, currentFloor.height - table.y)
                    );
                    updateDraftTable(table.id, {
                      width: newW,
                      height: newH,
                      capacity: Math.max(2, Math.floor((newW * newH) / 1.5)),
                    });
                  };
                  const up = () => {
                    window.removeEventListener("mousemove", move);
                    window.removeEventListener("mouseup", up);
                  };
                  window.addEventListener("mousemove", move);
                  window.addEventListener("mouseup", up);
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
              transform: "translateZ(-40px) translateX(-50%) translateY(-50%)",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 relative overflow-hidden">
      <SectionHeader
        icon={<Building size={22} />}
        title="Floor Map"
        defaultExpanded={true}
        subtitle="Spatial layout and table configuration"
        rightContent={
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg border border-zinc-300 dark:border-zinc-700">
              <button
                onClick={() => setViewMode("2d")}
                className={`px-3 py-2 rounded-md text-sm transition ${
                  viewMode === "2d"
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <Layers size={16} />
              </button>

              <button
                onClick={() => setViewMode("3d")}
                className={`px-3 py-2 rounded-md text-sm transition ${
                  viewMode === "3d"
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <Box size={16} />
              </button>
            </div>

            {!isEditMode ? (
              !isMobile && (
                <button
                  onClick={enterEditMode}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  <Settings2 size={16} />
                  Edit Mode
                </button>
              )
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onUndo}
                    disabled={!canUndo}
                    className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 disabled:opacity-40"
                  >
                    <Undo2Icon size={16} />
                  </button>

                  <button
                    onClick={onRedo}
                    disabled={!canRedo}
                    className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 disabled:opacity-40"
                  >
                    <Redo2Icon size={16} />
                  </button>
                </div>

                <button
                  onClick={cancelEdit}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-sm transition"
                >
                  Discard
                </button>

                <button
                  onClick={saveEdit}
                  disabled={saveLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
                    saveLoading
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } text-white`}
                >
                  {saveLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      Save
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        }
        bottomContent={
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {activeFloors.map((f) => (
              <div
                key={f.id}
                className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg border transition ${
                  activeFloorId === f.id
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-transparent"
                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {editingFloorId === f.id ? (
                  <input
                    autoFocus
                    value={f.name}
                    onChange={(e) =>
                      updateDraftFloor(f.id, { name: e.target.value })
                    }
                    onBlur={() => setEditingFloorId(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setEditingFloorId(null);
                    }}
                    className="bg-transparent outline-none text-sm font-medium w-24"
                  />
                ) : (
                  <button
                    onClick={() => setActiveFloorId(f.id)}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {f.name}
                  </button>
                )}

                {isEditMode && (
                  <>
                    {editingFloorId === f.id ? (
                      <button
                        onClick={() => setEditingFloorId(null)}
                        className="p-1 text-emerald-600 hover:scale-110 transition"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditingFloorId(f.id)}
                        className="p-1 opacity-60 hover:opacity-100 transition"
                      >
                        <Settings2 size={14} />
                      </button>
                    )}

                    <button
                      onClick={() => deleteFloor(f.id)}
                      className="p-1 text-rose-500 opacity-70 hover:opacity-100 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            ))}

            {isEditMode && (
              <button
                onClick={addNewFloor}
                className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition shrink-0"
              >
                <Plus size={16} />
              </button>
            )}
          </div>
        }
      />

      {/* Main Viewport */}
      <div className="flex-1 relative overflow-hidden">
        {show3DRestriction ? (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-950 text-center space-y-6">
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/10 rounded-[2rem] flex items-center justify-center text-rose-500">
              <MonitorOff size={40} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">
              3D restricted
            </h2>
            <p className="text-zinc-500 max-w-sm text-xs font-bold leading-relaxed uppercase tracking-wide">
              Spatial 3D projection requires desktop-grade viewports. Use 2D
              mode for mobile floor management.
            </p>
            <button
              onClick={() => setViewMode("2d")}
              className="px-10 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl"
            >
              Return to 2D
            </button>
          </div>
        ) : viewMode === "3d" ? (
          /* Desktop 3D View */
          <div className="w-full h-full flex items-center justify-center p-8 lg:p-12 relative">
            <div className="absolute top-8 left-8 z-30 flex flex-col gap-3">
              <button
                onClick={() => setMapRotation((r) => r - 15)}
                className="p-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl text-zinc-400 hover:text-indigo-600"
              >
                <RotateCcw size={20} />
              </button>
              <button
                onClick={() => setMapRotation((r) => r + 15)}
                className="p-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl text-zinc-400 hover:text-indigo-600 rotate-180"
              >
                <RotateCcw size={20} />
              </button>
              {/* Pitch Up */}
              <button
                onClick={() => setMapPitch((p) => Math.min(p + 5, 80))}
                className="p-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl text-zinc-400 hover:text-indigo-600"
              >
                ▲
              </button>

              {/* Pitch Down */}
              <button
                onClick={() => setMapPitch((p) => Math.max(p - 5, 10))}
                className="p-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl text-zinc-400 hover:text-indigo-600"
              >
                ▼
              </button>
            </div>
            <motion.div
              className="relative w-full h-full flex items-center justify-center"
              animate={{ rotateX: mapPitch, rotateZ: mapRotation }}
              transition={{ type: "spring", damping: 30, stiffness: 50 }}
              style={{ perspective: "4000px", transformStyle: "preserve-3d" }}
            >
              <div
                className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl"
                style={{
                  width: `${(currentFloor?.width || 20) * GRID_SIZE}px`,
                  height: `${(currentFloor?.height || 20) * GRID_SIZE}px`,
                  transformStyle: "preserve-3d",
                }}
                onClick={() => setSelectedTableId(null)}
              >
                <div
                  className="absolute inset-0 grid opacity-[0.04] pointer-events-none"
                  style={{
                    gridTemplateColumns: `repeat(${
                      currentFloor?.width || 20
                    }, 1fr)`,
                    gridTemplateRows: `repeat(${
                      currentFloor?.height || 20
                    }, 1fr)`,
                  }}
                >
                  {Array.from({
                    length:
                      (currentFloor?.width || 20) *
                      (currentFloor?.height || 20),
                  }).map((_, i) => (
                    <div key={i} className="border-[0.5px] border-zinc-400" />
                  ))}
                </div>
                {activeTables
                  .filter((t) => t.floorId === activeFloorId)
                  .map((t) => renderTableNode(t))}
              </div>
            </motion.div>
          </div>
        ) : (
          /* Responsive 2D List/Grid View */
          <div className="w-full h-full p-4 sm:p-8 lg:p-12 overflow-y-auto no-scrollbar flex flex-col items-center">
            <div className="w-full max-w-7xl space-y-6">
              <div className="relative max-w-md mx-auto sm:mx-0">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={16}
                />
                <input
                  placeholder="Search table number..."
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
                {filteredTables.map((table) => {
                  const order = orders.find(
                    (o) => o.tableId === table.id && o.status !== "Paid"
                  );
                  return (
                    <motion.button
                      key={table.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTableId(table.id)}
                      className={`aspect-square p-6 rounded-3xl border transition-all flex flex-col items-center justify-center gap-3 relative shadow-lg hover:shadow-xl
 ${
   selectedTableId === table.id
     ? "bg-gradient-to-br from-indigo-600 to-indigo-500 text-white border-indigo-500 shadow-2xl "
     : table.status === "Occupied"
     ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
     : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white shadow-md hover:shadow-xl"
 }`}
                    >
                      <span className="text-2xl sm:text-4xl font-black uppercase tracking-tighter">
                        T{table.number}
                      </span>
                      <div className="flex items-center gap-1.5 text-[8px] sm:text-[10px] font-black uppercase opacity-60">
                        <Users size={12} /> {table.capacity}
                      </div>
                      {order && (
                        <div className="absolute -bottom-2 px-3 py-1 bg-indigo-600 text-white rounded-full text-[8px] font-black shadow-lg">
                          ₹{order.total.toLocaleString()}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
                {isEditMode && (
                  <button
                    onClick={addNewTable}
                    className="aspect-square border-4 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 text-zinc-300 hover:text-indigo-500 hover:border-indigo-500 transition-all"
                  >
                    <Plus size={32} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      New Node
                    </span>
                  </button>
                )}
              </div>
              {filteredTables.length === 0 && (
                <div className="py-20 flex flex-col items-center text-zinc-300">
                  <Search size={48} className="opacity-20 mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                    Zero tables detected
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Table Detail Drawer / Panel */}
      <AnimatePresence>
        {selectedTable && (
          <>
            {/* Mobile Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTableId(null)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
            />

            <motion.div
              initial={isMobile ? { y: "100%" } : { x: 100, opacity: 0 }}
              animate={isMobile ? { y: 0 } : { x: 0, opacity: 1 }}
              exit={isMobile ? { y: "100%" } : { x: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed lg:absolute right-0 bottom-0 lg:right-8 lg:top-8 lg:bottom-8 w-full lg:w-[420px] bg-white dark:bg-zinc-950 border-t lg:border border-zinc-200 dark:border-zinc-800
              lg:rounded-2xl rounded-t-2xl p-6 shadow-xl z-[70] flex flex-col gap-6 max-h-[90vh] lg:max-h-none`}
            >
              <div className="flex items-center justify-between shrink-0">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-zinc-500 mb-1">
                    {isEditMode ? "Node Config" : "Live Status"}
                  </p>
                  <div className="flex items-center gap-3">
                    {isEditMode ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xl sm:text-2xl font-black">
                          T-
                        </span>
                        <input
                          type="number"
                          className="w-24 bg-zinc-100 dark:bg-zinc-900 border-none p-2 rounded-xl text-xl sm:text-2xl font-black uppercase tracking-tighter outline-none focus:ring-2 focus:ring-indigo-500"
                          value={selectedTable.number}
                          onChange={(e) =>
                            updateDraftTable(selectedTable.id, {
                              number: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    ) : (
                      <h3 className="text-xl sm:text-2xl font-semibold tracking-tight truncate">
                        Table T{selectedTable.number}
                      </h3>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTableId(null)}
                  className="p-2 sm:p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl text-zinc-400"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar space-y-8">
                {isEditMode ? (
                  <div className="space-y-6">
                    <div className="p-6 sm:p-8 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 flex flex-col items-center gap-4 text-center">
                      <Users size={32} className="text-indigo-500" />
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                          Node Capacity
                        </p>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() =>
                              updateDraftTable(selectedTable.id, {
                                capacity: Math.max(
                                  1,
                                  selectedTable.capacity - 1
                                ),
                              })
                            }
                            className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700 font-bold"
                          >
                            -
                          </button>
                          <span className="text-3xl font-black dark:text-white">
                            {selectedTable.capacity}
                          </span>
                          <button
                            onClick={() =>
                              updateDraftTable(selectedTable.id, {
                                capacity: selectedTable.capacity + 1,
                              })
                            }
                            className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700 font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                        Spatial Logic
                      </p>
                      <p className="text-xs font-medium text-zinc-500 leading-relaxed uppercase tracking-widest opacity-60">
                        Position and dimensions are locked in 2D. Switch to 3D
                        spatial editor for full geometry override.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* SESSION SUMMARY CARD */}
                    <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                            Active Session
                          </p>
                          <h4 className="text-lg font-semibold dark:text-white">
                            Table T{selectedTable.number}
                          </h4>
                        </div>

                        {selectedTable.status === "Occupied" && (
                          <span className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Live
                          </span>
                        )}
                      </div>

                      {(() => {
                        const activeTableOrder = orders.find(
                          (o) =>
                            o.tableId === selectedTable.id &&
                            o.status !== "Paid"
                        );

                        return activeTableOrder ? (
                          <>
                            {/* TOTAL */}
                            <div className="mb-6">
                              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                Current Total
                              </p>
                              <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                                ₹{activeTableOrder.total.toLocaleString()}
                              </p>
                            </div>

                            {/* ITEM LIST */}
                            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                              {activeTableOrder.items.map((i) => (
                                <div
                                  key={i.id}
                                  className="flex justify-between text-sm"
                                >
                                  <span className="text-zinc-600 dark:text-zinc-400">
                                    {i.quantity} × {i.name}
                                  </span>
                                  <span className="font-medium dark:text-white">
                                    ₹{(i.price * i.quantity).toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12 text-zinc-400 dark:text-zinc-600">
                            <XCircle size={36} />
                            <p className="mt-4 text-sm">
                              No active order for this table
                            </p>
                          </div>
                        );
                      })()}
                    </div>

                    {/* ACTIONS */}
                    <div className="space-y-4 pt-2">
                      {selectedTable.status === "Occupied" ? (
                        <>
                          <button
                            onClick={() => clearTableBill(selectedTable.id)}
                            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
                          >
                            Settle Bill
                          </button>

                          <button
                            onClick={() => {
                              const activeOrder = orders.find(
                                (o) =>
                                  o.tableId === selectedTable.id &&
                                  o.status !== "Paid"
                              );

                              if (!activeOrder) return;

                              setActiveOrderId(activeOrder.id);
                              setActiveTab("pos");
                            }}
                            className="w-full py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-white font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                          >
                            Add Items
                          </button>

                          <button
                            onClick={() => voidTableOrder(selectedTable.id)}
                            className="w-full py-3 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition font-medium"
                          >
                            Void Order
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveTab("pos");
                            setSelectedTableId(selectedTable.id);
                          }}
                          className="w-full py-4 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold hover:bg-indigo-600 dark:hover:bg-indigo-100 transition shadow-md hover:shadow-lg"
                        >
                          Start Order
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {isEditMode && (
                <button
                  onClick={() => deleteDraftTable(selectedTable.id)}
                  className="shrink-0 w-full py-4 bg-rose-50 dark:bg-rose-900/10 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-100 dark:border-rose-900/50"
                >
                  Purge Node
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <GlobalProcessingOverlay
        isVisible={isProcessingTableAction}
        title="Updating Table Session"
        subtitle="Please wait while we update the table status"
      />
    </div>
  );
};

export default FloorMapView;
