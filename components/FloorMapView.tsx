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
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Table, Floor, Order } from "@/types";
import SectionHeader from "@/components/ui/SectionHeader";
import GlobalProcessingOverlay from "@/components/ui/GlobalProcessingOverlay";
import { toast } from "./ui/Toaster";

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
  addNewTableToFloor: (floorId: string) => string | null;
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
  deletedTableIds: string[];
  setDeletedTableIds: React.Dispatch<React.SetStateAction<string[]>>;
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
  addNewTableToFloor,

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
  deletedTableIds,
  setDeletedTableIds,
}) => {
  const [tableSearch, setTableSearch] = useState("");
  const currentFloor = activeFloors.find((f) => f.id === activeFloorId);
  const selectedTable = activeTables.find((t) => t.id === selectedTableId);
  const activeTableOrder = selectedTable
    ? orders.find(
        (o) =>
          o.tableId === selectedTable.id &&
          o.paymentStatus !== "Paid" &&
          o.status !== "Voided"
      )
    : null;

  // If mobile and in 3D mode, force 2D or show restriction
  const show3DRestriction = isMobile && viewMode === "3d";
  const [isResizingWidth, setIsResizingWidth] = useState(false);
  const [isResizingHeight, setIsResizingHeight] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showEditWarning, setShowEditWarning] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  const deleteTargetTable = activeTables.find((t) => t.id === deleteTargetId);

  const filteredTables = activeTables
    .filter((t) => t.floorId === activeFloorId)
    .filter(
      (t) => tableSearch === "" || t.number.toString().includes(tableSearch)
    );

  React.useEffect(() => {
    if (!showEditWarning) return;

    const timeout = setTimeout(() => {
      setShowEditWarning(false);
    }, 7000);

    return () => clearTimeout(timeout);
  }, [showEditWarning]);

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
        className="table-node"
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
              {/* Delete handle */}
              <div
                className="absolute -bottom-6 -left-6 w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-2xl border-4 border-white z-[70] hover:scale-105 active:scale-95 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteTargetId(table.id);
                }}
              >
                <Trash2 size={20} />
              </div>

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

  const resetCamera = () => {
    setMapRotation((prev) => 0);
    setMapPitch((prev) => 10);
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
              <button
                onClick={() => {
                  setShowEditWarning(true);
                  enterEditMode();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                <Settings2 size={16} />
                Edit Mode
              </button>
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
                  onClick={() => setShowSaveConfirm(true)}
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
            <div className="absolute top-8 right-8 z-30 flex flex-col items-end gap-3">
              <button
                onClick={resetCamera}
                className="p-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl text-zinc-400 hover:text-indigo-600 hover:border-indigo-400 transition"
              >
                <RotateCcw size={20} />
              </button>

              <div className="px-4 py-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg text-xs font-mono text-zinc-600 dark:text-zinc-300 space-y-2 min-w-[200px]">
                {/* ORIENTATION */}
                <div className="flex justify-between gap-6">
                  <span>Rotation</span>
                  <span className="font-semibold text-indigo-600">
                    {((mapRotation % 360) + 360) % 360}°
                  </span>
                </div>

                <div className="flex justify-between gap-6">
                  <span>Pitch</span>
                  <span className="font-semibold text-indigo-600">
                    {mapPitch}°
                  </span>
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-800 my-1" />

                {/* DIMENSIONS */}
                <div className="flex justify-between gap-6">
                  <span>Width</span>
                  <span className="font-semibold text-indigo-600">
                    {currentFloor?.width ?? 0}u
                  </span>
                </div>

                <div className="flex justify-between gap-6">
                  <span>Height</span>
                  <span className="font-semibold text-indigo-600">
                    {currentFloor?.height ?? 0}u
                  </span>
                </div>

                <div className="flex justify-between gap-6 text-zinc-400 text-[11px]">
                  <span>Pixels</span>
                  <span>
                    {(currentFloor?.width ?? 0) * GRID_SIZE} ×{" "}
                    {(currentFloor?.height ?? 0) * GRID_SIZE}
                  </span>
                </div>
              </div>
            </div>

            {isEditMode && currentFloor && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[50]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!currentFloor) return;

                    const newId = addNewTableToFloor(currentFloor.id);
                    if (!newId) return;

                    setSelectedTableId(newId);
                  }}
                  className="w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                >
                  <Plus size={22} />
                </button>
              </div>
            )}

            <motion.div
              className="relative w-full h-full flex items-center justify-center"
              animate={{ rotateX: mapPitch, rotateZ: mapRotation }}
              transition={{ type: "spring", damping: 30, stiffness: 50 }}
              style={{ perspective: "4000px", transformStyle: "preserve-3d" }}
            >
              <div
                className={`relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl 
              
                  `}
                style={{
                  width: `${(currentFloor?.width || 20) * GRID_SIZE}px`,
                  height: `${(currentFloor?.height || 20) * GRID_SIZE}px`,
                  transformStyle: "preserve-3d",
                }}
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
                {isEditMode && currentFloor && (
                  <>
                    {/* RIGHT EDGE RESIZER */}
                    <div
                      className="absolute top-0 right-0 h-full w-12 flex items-center justify-center cursor-e-resize z-[100]"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();

                        setIsResizingWidth(true);

                        const startX = e.clientX;
                        const startWidth = currentFloor.width;
                        const move = (mv: MouseEvent) => {
                          const dx = Math.round(
                            (mv.clientX - startX) / GRID_SIZE
                          );
                          let proposedWidth = Math.max(5, startWidth + dx);

                          // 🔒 Prevent shrinking below any table
                          const maxTableRight = Math.max(
                            ...activeTables
                              .filter((t) => t.floorId === currentFloor.id)
                              .map((t) => t.x + t.width),
                            0
                          );

                          if (proposedWidth < maxTableRight) {
                            proposedWidth = maxTableRight;
                          }

                          updateDraftFloor(currentFloor.id, {
                            width: proposedWidth,
                          });
                        };

                        const up = () => {
                          setIsResizingWidth(false);
                          window.removeEventListener("mousemove", move);
                          window.removeEventListener("mouseup", up);
                        };

                        window.addEventListener("mousemove", move);
                        window.addEventListener("mouseup", up);
                      }}
                    >
                      <div
                        className={`w-10 h-20 flex items-center justify-center rounded-2xl transition-all shadow-xl
      ${
        isResizingWidth
          ? "bg-indigo-600 text-white shadow-2xl scale-95"
          : "bg-white dark:bg-zinc-900 text-indigo-600 border border-zinc-200 dark:border-zinc-700 hover:bg-indigo-50 dark:hover:bg-zinc-800"
      }`}
                        style={{
                          marginRight: "6px", // floating offset
                        }}
                      >
                        <ChevronRight size={22} />
                      </div>
                    </div>

                    {/* BOTTOM EDGE RESIZER */}
                    <div
                      className="absolute bottom-0 left-0 w-full h-12 flex items-center justify-center cursor-s-resize z-[100]"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();

                        setIsResizingHeight(true);

                        const startY = e.clientY;
                        const startHeight = currentFloor.height;

                        const move = (mv: MouseEvent) => {
                          const dy = Math.round(
                            (mv.clientY - startY) / GRID_SIZE
                          );
                          let proposedHeight = Math.max(5, startHeight + dy);

                          const maxTableBottom = Math.max(
                            ...activeTables
                              .filter((t) => t.floorId === currentFloor.id)
                              .map((t) => t.y + t.height),
                            0
                          );

                          if (proposedHeight < maxTableBottom) {
                            proposedHeight = maxTableBottom;
                          }

                          updateDraftFloor(currentFloor.id, {
                            height: proposedHeight,
                          });
                        };

                        const up = () => {
                          setIsResizingHeight(false);
                          window.removeEventListener("mousemove", move);
                          window.removeEventListener("mouseup", up);
                        };

                        window.addEventListener("mousemove", move);
                        window.addEventListener("mouseup", up);
                      }}
                    >
                      <div
                        className={`h-10 w-20 flex items-center justify-center rounded-2xl transition-all shadow-xl
      ${
        isResizingHeight
          ? "bg-indigo-600 text-white shadow-2xl scale-95"
          : "bg-white dark:bg-zinc-900 text-indigo-600 border border-zinc-200 dark:border-zinc-700 hover:bg-indigo-50 dark:hover:bg-zinc-800"
      }`}
                        style={{
                          marginBottom: "6px", // floating offset
                        }}
                      >
                        <ChevronDown size={22} />
                      </div>
                    </div>
                  </>
                )}
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
                  const order = orders.find((o) => o.tableId === table.id);

                  return (
                    <motion.button
                      key={table.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTableId(table.id)}
                      className={`relative aspect-square p-6 rounded-3xl border transition-all flex flex-col items-center justify-center gap-3 relative shadow-lg hover:shadow-xl
 ${
   selectedTableId === table.id
     ? "bg-gradient-to-br from-indigo-600 to-indigo-500 text-white border-indigo-500 shadow-2xl "
     : table.status === "Occupied"
     ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
     : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white shadow-md hover:shadow-xl"
 }`}
                    >
                      {/* ✅ DELETE BUTTON */}
                      {isEditMode && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTargetId(table.id);
                          }}
                          className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition"
                        >
                          <Trash2 size={14} />
                        </div>
                      )}
                      <span className="text-2xl sm:text-4xl font-black uppercase tracking-tighter">
                        T{table.number}
                      </span>
                      <div className="flex items-center gap-1.5 text-[8px] sm:text-[10px] font-black uppercase opacity-60">
                        <Users size={12} /> {table.capacity}
                      </div>
                      {order &&
                        order.paymentStatus !== "Paid" &&
                        order.status !== "Voided" && (
                          <div className="absolute -bottom-2 px-3 py-1 bg-indigo-600 text-white rounded-full text-[8px] font-black shadow-lg">
                            ₹{order.total.toLocaleString()}
                          </div>
                        )}
                    </motion.button>
                  );
                })}
                {isEditMode && currentFloor && (
                  <button
                    onClick={() => {
                      const newId = addNewTableToFloor(currentFloor.id);
                      if (newId) setSelectedTableId(newId);
                    }}
                    className="aspect-square border-4 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 text-zinc-300 hover:text-indigo-500 hover:border-indigo-500 transition-all"
                  >
                    <Plus size={32} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      New Table
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
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTableId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Centered Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-6 max-h-[85vh] overflow-hidden"
            >
              {/* HEADER */}
              <div className="flex items-center justify-between shrink-0">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-zinc-500 mb-1">
                    {isEditMode ? "Floor Config" : "Live Status"}
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
                  className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl text-zinc-400"
                >
                  <X size={22} />
                </button>
              </div>

              {/* BODY */}
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-8">
                {isEditMode ? (
                  <div className="space-y-6">
                    <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex flex-col items-center gap-4 text-center">
                      <Users size={32} className="text-indigo-500" />
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                          Table Capacity
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

                        {activeTableOrder && (
                          <span className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Live
                          </span>
                        )}
                      </div>

                      {activeTableOrder ? (
                        <>
                          <div className="mb-6">
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                              Current Total
                            </p>
                            <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                              ₹{activeTableOrder.total.toLocaleString()}
                            </p>
                          </div>

                          <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
                            {activeTableOrder.items.map((i) => (
                              <div
                                key={`${i.menuItemId}-${i.name}`}
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
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedTable && !isEditMode && activeTableOrder && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-6 inset-x-0 flex justify-center z-[85]"
          >
            <div className="w-full max-w-xl mx-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl px-4 py-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <button
                  disabled={
                    activeTableOrder.orderType === "Dining" &&
                    activeTableOrder.status !== "Served"
                  }
                  onClick={() => clearTableBill(selectedTable.id)}
                  className={`flex-1 min-w-[120px] py-2 rounded-xl text-sm font-medium transition text-white
              ${
                activeTableOrder.orderType === "Dining" &&
                activeTableOrder.status !== "Served"
                  ? "bg-zinc-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }
            `}
                >
                  {activeTableOrder.orderType === "Dining" &&
                  activeTableOrder.status !== "Served"
                    ? "Waiting for Kitchen"
                    : "Collect Payment"}
                </button>

                <button
                  onClick={() => {
                    setActiveOrderId(activeTableOrder.id);
                    setActiveTab("pos");
                  }}
                  className="flex-1 min-w-[120px] py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                >
                  Add Items
                </button>

                <button
                  onClick={() => voidTableOrder(selectedTable.id)}
                  className="flex-1 min-w-[120px] py-2 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition text-sm font-medium"
                >
                  Void Order
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTargetId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteTargetId(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-xl border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold dark:text-white">
                  Delete Table -{" "}
                  {deleteTargetTable ? `T${deleteTargetTable.number}` : ""}
                </h3>
                <button onClick={() => setDeleteTargetId(null)}>
                  <X size={18} />
                </button>
              </div>

              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                This action cannot be undone. Are you sure you want to delete
                this table?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTargetId(null)}
                  className="flex-1 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    try {
                      deleteDraftTable(deleteTargetId);

                      setDeletedTableIds((prev) => [...prev, deleteTargetId]);

                      setDeleteTargetId(null);
                      setSelectedTableId(null);

                      toast("Table marked for deletion", "success");
                    } catch (err) {
                      toast("Failed to delete table", "error");
                    }
                  }}
                  className="flex-1 py-2.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditWarning && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowEditWarning(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-rose-600">
                    Edit Mode Activated
                  </h3>

                  {/* Subtle Countdown Ring */}
                  <div className="relative w-6 h-6">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        strokeWidth="2"
                        className="text-zinc-200 dark:text-zinc-700"
                        stroke="currentColor"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="12"
                        cy="12"
                        r="10"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="text-rose-500"
                        stroke="currentColor"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 10}
                        initial={{ strokeDashoffset: 0 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 10 }}
                        transition={{ duration: 7, ease: "linear" }}
                      />
                    </svg>
                  </div>
                </div>

                <button onClick={() => setShowEditWarning(false)}>
                  <X size={18} />
                </button>
              </div>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                You are entering floor configuration mode. You can move, resize,
                rotate, delete tables and modify structural layout of your
                floors.
                <br />
                <br />
                Changes will only be applied after clicking Save. Proceed
                carefully.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSaveConfirm && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSaveConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-xl border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold dark:text-white">
                  Confirm Save Layout
                </h3>
                <button onClick={() => setShowSaveConfirm(false)}>
                  <X size={18} />
                </button>
              </div>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                This will permanently apply all spatial modifications including
                floor changes, table positions, deletions and structural
                updates.
                <br />
                <br />
                Continue?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSaveConfirm(false)}
                  className="flex-1 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    setShowSaveConfirm(false);
                    await saveEdit();
                  }}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  Confirm & Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <GlobalProcessingOverlay
        isVisible={isProcessingTableAction || saveLoading}
        title={saveLoading ? "Saving Spatial Layout" : "Updating Table Session"}
        subtitle={
          saveLoading
            ? "Please wait while we commit floor and table changes"
            : "Please wait while we update the table status"
        }
      />
    </div>
  );
};

export default FloorMapView;
