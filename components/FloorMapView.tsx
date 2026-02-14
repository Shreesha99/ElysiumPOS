import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  XCircle
} from 'lucide-react';
import { Table, Floor, Order } from '../types';

const GRID_SIZE = 40;

interface FloorMapViewProps {
  isMobile: boolean;
  activeFloors: Floor[];
  activeTables: Table[];
  activeFloorId: string;
  setActiveFloorId: (id: string) => void;
  viewMode: '2d' | '3d';
  setViewMode: (mode: '2d' | '3d') => void;
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
}

const FloorMapView: React.FC<FloorMapViewProps> = ({
  isMobile, activeFloors, activeTables, activeFloorId, setActiveFloorId, viewMode, setViewMode,
  isEditMode, enterEditMode, cancelEdit, saveEdit, addNewFloor, deleteFloor, addNewTable, deleteDraftTable,
  selectedTableId, setSelectedTableId, updateDraftTable, updateDraftFloor, editingFloorId, setEditingFloorId,
  mapRotation, setMapRotation, mapPitch, setMapPitch, orders, clearTableBill, voidTableOrder, setActiveTab
}) => {
  const [tableSearch, setTableSearch] = useState('');
  const currentFloor = activeFloors.find(f => f.id === activeFloorId);
  const selectedTable = activeTables.find(t => t.id === selectedTableId);

  // If mobile and in 3D mode, force 2D or show restriction
  const show3DRestriction = isMobile && viewMode === '3d';

  const filteredTables = activeTables
    .filter(t => t.floorId === activeFloorId)
    .filter(t => tableSearch === '' || t.number.toString().includes(tableSearch));

  const renderTableNode = (table: Table) => {
    const isSelected = selectedTableId === table.id;
    const legs = [{ x: 10, y: 10 }, { x: 90, y: 10 }, { x: 10, y: 90 }, { x: 90, y: 90 }];
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
            <span className="text-xl font-black uppercase tracking-tighter">T{table.number}</span>
            <div className="flex items-center gap-1 opacity-60 text-[10px] font-black uppercase mt-1">
               <Users size={10} /> {table.capacity}
            </div>
            {isEditMode && isSelected && (
              <>
                 <div 
                   className="absolute -top-6 -left-6 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white cursor-move shadow-2xl border-4 border-white z-[60]"
                   onMouseDown={(e) => {
                     e.stopPropagation(); e.preventDefault();
                     const startX = e.clientX, startY = e.clientY, startTableX = table.x, startTableY = table.y;
                     const move = (mv: MouseEvent) => {
                        if (!currentFloor) return;
                        const dx = Math.round((mv.clientX - startX) / GRID_SIZE), dy = Math.round((mv.clientY - startY) / GRID_SIZE);
                        updateDraftTable(table.id, { 
                          x: Math.max(0, Math.min(startTableX + dx, currentFloor.width - table.width)),
                          y: Math.max(0, Math.min(startTableY + dy, currentFloor.height - table.height))
                        });
                     };
                     const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
                     window.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
                   }}
                 >
                    <Grip size={20} />
                 </div>
                 
                 {/* Rotation handle - Restore spatial rotation functionality */}
                 <div 
                   className="absolute -top-6 -right-6 w-12 h-12 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-indigo-600 cursor-pointer shadow-2xl border-4 border-indigo-600 z-[60] hover:bg-indigo-600 hover:text-white transition-all active:scale-90"
                   onClick={(e) => {
                     e.stopPropagation();
                     updateDraftTable(table.id, { rotation: ((table.rotation || 0) + 45) % 360 });
                   }}
                 >
                    <RotateCcw size={20} />
                 </div>

                 <div 
                   className="absolute -bottom-6 -right-6 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white cursor-se-resize shadow-2xl border-4 border-white z-[60]"
                   onMouseDown={(e) => {
                     e.stopPropagation(); e.preventDefault();
                     const startX = e.clientX, startY = e.clientY, startW = table.width, startH = table.height;
                     const move = (mv: MouseEvent) => {
                       if (!currentFloor) return;
                       const dw = Math.round((mv.clientX - startX) / GRID_SIZE), dh = Math.round((mv.clientY - startY) / GRID_SIZE);
                       const newW = Math.max(2, Math.min(startW + dw, currentFloor.width - table.x));
                       const newH = Math.max(2, Math.min(startH + dh, currentFloor.height - table.y));
                       updateDraftTable(table.id, { width: newW, height: newH, capacity: Math.max(2, Math.floor((newW * newH) / 1.5)) });
                     };
                     const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
                     window.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
                   }}
                 >
                    <Maximize size={20} />
                 </div>
              </>
            )}
         </div>
         {legs.map((pos, idx) => (
           <div key={idx} className="absolute w-3 h-3 bg-zinc-400 dark:bg-zinc-700 rounded-full shadow-inner" style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translateZ(-40px) translateX(-50%) translateY(-50%)' }} />
         ))}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden">
      {/* Header - Scaled for Mobile */}
      <header className="px-4 py-4 sm:px-8 sm:py-6 border-b border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 sticky top-0 z-40 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-black uppercase tracking-tighter truncate">
              Floor Map {isEditMode && <span className="ml-2 text-[10px] bg-rose-600 text-white px-3 py-1 rounded-full animate-pulse">Edit</span>}
            </h1>
            
            {/* View Toggle */}
            <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <button onClick={() => setViewMode('2d')} className={`p-1.5 rounded-lg transition-all ${viewMode === '2d' ? 'bg-white dark:bg-zinc-800 text-indigo-600 shadow-sm' : 'text-zinc-400'}`}><Layers size={18} /></button>
              <button onClick={() => setViewMode('3d')} className={`p-1.5 rounded-lg transition-all ${viewMode === '3d' ? 'bg-white dark:bg-zinc-800 text-indigo-600 shadow-sm' : 'text-zinc-400'}`}><Box size={18} /></button>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <div className="flex gap-1 shrink-0">
              {activeFloors.map(f => (
                <div key={f.id} className="relative flex items-center">
                  {editingFloorId === f.id ? (
                    <input 
                      autoFocus
                      className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white dark:bg-zinc-900 border-2 border-indigo-500 outline-none w-32 shadow-lg"
                      value={f.name}
                      onChange={(e) => updateDraftFloor(f.id, { name: e.target.value })}
                      onBlur={() => setEditingFloorId(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingFloorId(null)}
                    />
                  ) : (
                    <button 
                      onClick={() => { 
                        setActiveFloorId(f.id); 
                        if (isEditMode && activeFloorId === f.id) setEditingFloorId(f.id); 
                      }} 
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeFloorId === f.id ? 'bg-zinc-900 text-white dark:bg-indigo-600 border-transparent shadow-md' : 'bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-100 dark:border-zinc-800'}`}
                    >
                      {f.name}
                    </button>
                  )}
                </div>
              ))}
            </div>
            {isEditMode && (
              <button onClick={addNewFloor} className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 border border-indigo-100 dark:border-indigo-800 shrink-0"><Plus size={16} /></button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isEditMode && viewMode === '3d' && !isMobile && (
              <button onClick={enterEditMode} className="hidden lg:flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-500 transition-all"><Settings2 size={16}/> Modify</button>
            )}
            {isEditMode && (
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={cancelEdit} className="flex-1 sm:flex-none px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest">Discard</button>
                <button onClick={saveEdit} className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Save</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Viewport */}
      <div className="flex-1 relative overflow-hidden">
        {show3DRestriction ? (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-950 text-center space-y-6">
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/10 rounded-[2rem] flex items-center justify-center text-rose-500">
               <MonitorOff size={40} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">3D restricted</h2>
            <p className="text-zinc-500 max-w-sm text-xs font-bold leading-relaxed uppercase tracking-wide">Spatial 3D projection requires desktop-grade viewports. Use 2D mode for mobile floor management.</p>
            <button onClick={() => setViewMode('2d')} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">Return to 2D</button>
          </div>
        ) : viewMode === '3d' ? (
          /* Desktop 3D View */
          <div className="w-full h-full flex items-center justify-center p-8 lg:p-12 relative">
             <div className="absolute top-8 left-8 z-30 flex flex-col gap-3">
               <button onClick={() => setMapRotation(r => r - 15)} className="p-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl text-zinc-400 hover:text-indigo-600"><RotateCcw size={20} /></button>
               <button onClick={() => setMapRotation(r => r + 15)} className="p-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl text-zinc-400 hover:text-indigo-600 rotate-180"><RotateCcw size={20} /></button>
             </div>
             <motion.div className="relative w-full h-full flex items-center justify-center" animate={{ rotateX: mapPitch, rotateZ: mapRotation }} transition={{ type: 'spring', damping: 30, stiffness: 50 }} style={{ perspective: '4000px', transformStyle: 'preserve-3d' }}>
               <div className="relative bg-white dark:bg-zinc-900 border-[8px] border-zinc-100 dark:border-zinc-800 shadow-2xl" style={{ width: `${(currentFloor?.width || 20) * GRID_SIZE}px`, height: `${(currentFloor?.height || 20) * GRID_SIZE}px`, transformStyle: 'preserve-3d' }} onClick={() => setSelectedTableId(null)}>
                  <div className="absolute inset-0 grid opacity-[0.04] pointer-events-none" style={{ gridTemplateColumns: `repeat(${currentFloor?.width || 20}, 1fr)`, gridTemplateRows: `repeat(${currentFloor?.height || 20}, 1fr)` }}>
                     {Array.from({ length: (currentFloor?.width || 20) * (currentFloor?.height || 20) }).map((_, i) => <div key={i} className="border-[0.5px] border-zinc-400" />)}
                  </div>
                  {activeTables.filter(t => t.floorId === activeFloorId).map(t => renderTableNode(t))}
               </div>
             </motion.div>
          </div>
        ) : (
          /* Responsive 2D List/Grid View */
          <div className="w-full h-full p-4 sm:p-8 lg:p-12 overflow-y-auto no-scrollbar flex flex-col items-center">
             <div className="w-full max-w-7xl space-y-6">
                <div className="relative max-w-md mx-auto sm:mx-0">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                  <input 
                    placeholder="Search table number..." 
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
                  {filteredTables.map(table => {
                     const order = orders.find(o => o.tableId === table.id && o.status !== 'Paid');
                     return (
                       <motion.button 
                         key={table.id} 
                         whileHover={{ scale: 1.02 }} 
                         whileTap={{ scale: 0.98 }} 
                         onClick={() => setSelectedTableId(table.id)} 
                         className={`aspect-square p-4 sm:p-6 rounded-[2.5rem] border-2 transition-all flex flex-col items-center justify-center gap-2 relative group ${
                           selectedTableId === table.id 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' 
                            : table.status === 'Occupied' 
                              ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                              : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-white shadow-sm hover:border-indigo-500/50'
                         }`}
                       >
                          <span className="text-2xl sm:text-4xl font-black uppercase tracking-tighter">T{table.number}</span>
                          <div className="flex items-center gap-1.5 text-[8px] sm:text-[10px] font-black uppercase opacity-60">
                            <Users size={12} /> {table.capacity}
                          </div>
                          {order && (
                            <div className="absolute -bottom-2 px-3 py-1 bg-indigo-600 text-white rounded-full text-[8px] font-black shadow-lg">₹{order.total.toLocaleString()}</div>
                          )}
                       </motion.button>
                     );
                  })}
                  {isEditMode && (
                    <button onClick={addNewTable} className="aspect-square border-4 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 text-zinc-300 hover:text-indigo-500 hover:border-indigo-500 transition-all">
                       <Plus size={32} />
                       <span className="text-[10px] font-black uppercase tracking-widest">New Node</span>
                    </button>
                  )}
                </div>
                {filteredTables.length === 0 && (
                  <div className="py-20 flex flex-col items-center text-zinc-300">
                    <Search size={48} className="opacity-20 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Zero tables detected</p>
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
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedTableId(null)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
            />
            
            <motion.div 
              initial={isMobile ? { y: '100%' } : { x: 100, opacity: 0 }} 
              animate={isMobile ? { y: 0 } : { x: 0, opacity: 1 }} 
              exit={isMobile ? { y: '100%' } : { x: 100, opacity: 0 }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed lg:absolute right-0 bottom-0 lg:right-8 lg:top-8 lg:bottom-8 w-full lg:w-[400px] bg-white dark:bg-zinc-950 border-t lg:border border-zinc-100 dark:border-zinc-900 lg:rounded-[3rem] rounded-t-[2.5rem] p-6 sm:p-12 shadow-2xl z-[70] flex flex-col gap-8 max-h-[90vh] lg:max-h-none`}
            >
              <div className="h-1.5 w-12 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto mb-4 lg:hidden shrink-0" />
              
              <div className="flex items-center justify-between shrink-0">
                 <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">{isEditMode ? 'Node Config' : 'Live Status'}</p>
                    <div className="flex items-center gap-3">
                      {isEditMode ? (
                        <div className="flex items-center gap-2">
                           <span className="text-xl sm:text-2xl font-black">T-</span>
                           <input 
                             type="number"
                             className="w-24 bg-zinc-100 dark:bg-zinc-900 border-none p-2 rounded-xl text-xl sm:text-2xl font-black uppercase tracking-tighter outline-none focus:ring-2 focus:ring-indigo-500"
                             value={selectedTable.number}
                             onChange={(e) => updateDraftTable(selectedTable.id, { number: parseInt(e.target.value) || 0 })}
                           />
                        </div>
                      ) : (
                        <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter truncate">Table T{selectedTable.number}</h3>
                      )}
                    </div>
                 </div>
                 <button onClick={() => setSelectedTableId(null)} className="p-2 sm:p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl text-zinc-400"><X size={24}/></button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar space-y-8">
                {isEditMode ? (
                  <div className="space-y-6">
                     <div className="p-6 sm:p-8 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 flex flex-col items-center gap-4 text-center">
                        <Users size={32} className="text-indigo-500" />
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Node Capacity</p>
                          <div className="flex items-center gap-4">
                            <button onClick={() => updateDraftTable(selectedTable.id, { capacity: Math.max(1, selectedTable.capacity - 1) })} className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700 font-bold">-</button>
                            <span className="text-3xl font-black dark:text-white">{selectedTable.capacity}</span>
                            <button onClick={() => updateDraftTable(selectedTable.id, { capacity: selectedTable.capacity + 1 })} className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700 font-bold">+</button>
                          </div>
                        </div>
                     </div>
                     <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Spatial Logic</p>
                        <p className="text-xs font-medium text-zinc-500 leading-relaxed uppercase tracking-widest opacity-60">Position and dimensions are locked in 2D. Switch to 3D spatial editor for full geometry override.</p>
                     </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                     <div className="p-6 sm:p-10 bg-indigo-50 dark:bg-indigo-900/10 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-800/50 shadow-inner">
                        <div className="flex justify-between items-center mb-6">
                           <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Active Ledger</p>
                           {selectedTable.status === 'Occupied' && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                        </div>
                        {(() => {
                          const activeTableOrder = orders.find(o => o.tableId === selectedTable.id && o.status !== 'Paid');
                          return activeTableOrder ? (
                            <div className="space-y-6">
                               <p className="text-4xl sm:text-5xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter leading-none">₹{activeTableOrder.total.toLocaleString()}</p>
                               <div className="space-y-2 max-h-[150px] overflow-y-auto no-scrollbar">
                                  {activeTableOrder.items.map(i => (
                                    <div key={i.id} className="flex justify-between text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
                                      <span>{i.quantity}x {i.name}</span>
                                      <span className="font-black text-zinc-900 dark:text-white">₹{i.price * i.quantity}</span>
                                    </div>
                                  ))}
                               </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center py-4 opacity-40">
                              <XCircle size={32} className="mb-2" />
                              <p className="text-[10px] font-black uppercase tracking-widest">No active session</p>
                            </div>
                          )
                        })()}
                     </div>

                     <div className="space-y-3">
                        {selectedTable.status === 'Occupied' ? (
                          <>
                             <button onClick={() => clearTableBill(selectedTable.id)} className="w-full py-4.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-700 transition-all active:scale-95">Settle Ledger</button>
                             <button onClick={() => { setActiveTab('pos'); setSelectedTableId(selectedTable.id); }} className="w-full py-4.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">Append Items</button>
                             <button onClick={() => voidTableOrder(selectedTable.id)} className="w-full py-4.5 bg-rose-50 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-600 hover:text-white transition-all">Void Session</button>
                          </>
                        ) : (
                          <button onClick={() => { setActiveTab('pos'); setSelectedTableId(selectedTable.id); }} className="w-full py-6 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-600 dark:hover:bg-indigo-50 hover:text-white dark:hover:text-indigo-600 transition-all">Start Session</button>
                        )}
                     </div>
                  </div>
                )}
              </div>
              
              {isEditMode && (
                <button onClick={() => deleteDraftTable(selectedTable.id)} className="shrink-0 w-full py-4 bg-rose-50 dark:bg-rose-900/10 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-100 dark:border-rose-900/50">Purge Node</button>
              )}
            </motion.div>
           </>
         )}
      </AnimatePresence>
    </div>
  );
};

export default FloorMapView;