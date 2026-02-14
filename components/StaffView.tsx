import React, { useState } from 'react';
import { Waiter, StaffStatus } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Trash2, 
  Settings2, 
  X, 
  Clock, 
  Calendar, 
  Briefcase, 
  CheckCircle2, 
  User,
  ArrowLeft
} from 'lucide-react';

interface StaffViewProps {
  waiters: Waiter[];
  addWaiter: (waiter: Waiter) => void;
  updateWaiter: (id: string, updates: Partial<Waiter>) => void;
  deleteWaiter: (id: string) => void;
}

const ROLES = ['Head Server', 'Captain', 'Server', 'Junior Server', 'Host', 'Mixologist', 'Chef de Partie'];

const StaffView: React.FC<StaffViewProps> = ({ waiters, addWaiter, updateWaiter, deleteWaiter }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  // Form State for Adding
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState(ROLES[0]);
  const [newShiftStart, setNewShiftStart] = useState('09:00');
  const [newShiftEnd, setNewShiftEnd] = useState('17:00');

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    
    const newStaff: Waiter = {
      id: `w-${Date.now()}`,
      name: newName,
      role: newRole,
      status: 'Offline',
      assignedTables: [],
      shiftStart: newShiftStart,
      shiftEnd: newShiftEnd,
      leaveDates: []
    };
    
    addWaiter(newStaff);
    setIsAddFormOpen(false);
    setNewName('');
  };

  const handleToggleLeave = (waiter: Waiter) => {
    const today = new Date().toISOString().split('T')[0];
    const isCurrentlyOnLeave = waiter.leaveDates.includes(today);
    
    let newLeaveDates = [...waiter.leaveDates];
    if (isCurrentlyOnLeave) {
      newLeaveDates = newLeaveDates.filter(d => d !== today);
    } else {
      newLeaveDates.push(today);
    }
    
    updateWaiter(waiter.id, { 
      leaveDates: newLeaveDates,
      status: isCurrentlyOnLeave ? 'Offline' : 'On Leave'
    });
  };

  return (
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden font-sans">
      {/* Header Layer */}
      <header className="px-8 py-8 sm:px-12 sm:py-10 border-b border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 sticky top-0 z-40 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter dark:text-white flex items-center gap-4">
              Staff Directory
              {isEditMode && <span className="bg-rose-600 text-white text-[10px] px-3 py-1 rounded-full animate-pulse">Configuration Mode</span>}
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Manage personnel, roles, and shift logistics.</p>
          </div>

          <div className="flex items-center gap-3">
            {!isEditMode ? (
              <button 
                onClick={() => setIsEditMode(true)}
                className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-500 transition-all shadow-sm"
              >
                <Settings2 size={16}/> Modify Fleet
              </button>
            ) : (
              <button 
                onClick={() => setIsEditMode(false)}
                className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all"
              >
                <ArrowLeft size={16}/> Exit Editor
              </button>
            )}
            {isEditMode && (
              <button 
                onClick={() => setIsAddFormOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all"
              >
                <UserPlus size={16}/> New Hire
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-8 sm:px-12 py-10 no-scrollbar pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {waiters.map(waiter => (
              <motion.div 
                key={waiter.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`bg-white dark:bg-zinc-900 p-8 rounded-[3.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all group relative ${isEditMode ? 'hover:border-rose-500/50' : 'hover:border-indigo-500'}`}
              >
                {/* Delete Button - Only in Edit Mode */}
                {isEditMode && (
                  <button 
                    onClick={() => deleteWaiter(waiter.id)}
                    className="absolute top-6 right-6 w-10 h-10 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-full flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                <div className="flex items-start gap-8 mb-8">
                  <div className="w-24 h-24 rounded-[2rem] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white font-black text-4xl uppercase shadow-inner shrink-0 group-hover:scale-105 transition-transform duration-500 overflow-hidden relative">
                    <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                    {waiter.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                       <h3 className="text-2xl font-black dark:text-white tracking-tighter truncate leading-tight">{waiter.name}</h3>
                       {waiter.status === 'Active' && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase text-indigo-500 tracking-widest">
                       <Briefcase size={10} /> {waiter.role}
                    </div>
                    <div className={`mt-3 inline-flex px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] border ${
                      waiter.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800/50' :
                      waiter.status === 'On Leave' ? 'bg-rose-50 text-rose-500 border-rose-100 dark:bg-rose-900/10 dark:border-rose-800/50' :
                      'bg-zinc-50 text-zinc-400 border-zinc-100 dark:bg-zinc-800 dark:border-zinc-700'
                    }`}>
                      {waiter.status}
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-4 pt-6 border-t border-zinc-50 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-zinc-400"><Clock size={12}/></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Schedule</span>
                     </div>
                     {isEditMode ? (
                       <div className="flex items-center gap-2">
                          <input 
                            type="time" 
                            className="text-[10px] font-black bg-zinc-100 dark:bg-zinc-800 p-1 rounded border-none outline-none dark:text-white"
                            value={waiter.shiftStart}
                            onChange={(e) => updateWaiter(waiter.id, { shiftStart: e.target.value })}
                          />
                          <span className="text-[10px]">-</span>
                          <input 
                            type="time" 
                            className="text-[10px] font-black bg-zinc-100 dark:bg-zinc-800 p-1 rounded border-none outline-none dark:text-white"
                            value={waiter.shiftEnd}
                            onChange={(e) => updateWaiter(waiter.id, { shiftEnd: e.target.value })}
                          />
                       </div>
                     ) : (
                       <span className="text-[10px] font-black dark:text-zinc-200">{waiter.shiftStart} — {waiter.shiftEnd}</span>
                     )}
                  </div>

                  {isEditMode && (
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-zinc-400"><Settings2 size={12}/></div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Position</span>
                       </div>
                       <select 
                         className="text-[10px] font-black bg-zinc-100 dark:bg-zinc-800 p-1 rounded border-none outline-none dark:text-white cursor-pointer"
                         value={waiter.role}
                         onChange={(e) => updateWaiter(waiter.id, { role: e.target.value })}
                       >
                         {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                       </select>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-zinc-400"><Calendar size={12}/></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Availability</span>
                     </div>
                     <button 
                       onClick={() => handleToggleLeave(waiter)}
                       className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${
                         waiter.status === 'On Leave' 
                           ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' 
                           : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-indigo-600'
                       }`}
                     >
                        {waiter.status === 'On Leave' ? 'Leave Active' : 'Mark On Leave'}
                     </button>
                  </div>
                </div>

                <div className="mt-8">
                  <button 
                    disabled={isEditMode}
                    onClick={() => updateWaiter(waiter.id, { status: waiter.status === 'Active' ? 'Offline' : 'Active' })}
                    className={`w-full py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 ${
                      waiter.status === 'Active' 
                        ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' 
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-indigo-600 border border-transparent hover:border-indigo-500/30'
                    }`}
                  >
                    {waiter.status === 'Active' ? <CheckCircle2 size={14}/> : <User size={14}/>}
                    {waiter.status === 'Active' ? 'On Duty' : 'Go On Duty'}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Staff Modal - Refactored for perfect centering */}
      <AnimatePresence>
        {isAddFormOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsAddFormOpen(false)}
              className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-[500px] bg-white dark:bg-zinc-900 p-8 sm:p-14 rounded-[3rem] sm:rounded-[4rem] shadow-2xl z-[70] border border-zinc-100 dark:border-zinc-800"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter dark:text-white">New Hire Node</h3>
                <button onClick={() => setIsAddFormOpen(false)} className="p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-2xl transition-colors"><X/></button>
              </div>

              <form onSubmit={handleAddStaff} className="space-y-6 sm:space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Legal Name</label>
                  <input 
                    required autoFocus placeholder="Enter full name" 
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-5 sm:p-6 rounded-[1.5rem] text-xs font-black tracking-widest shadow-inner outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white" 
                    value={newName} onChange={e => setNewName(e.target.value)} 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Organization Role</label>
                  <select 
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-5 sm:p-6 rounded-[1.5rem] text-xs font-black uppercase tracking-widest shadow-inner outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
                    value={newRole} onChange={e => setNewRole(e.target.value)}
                  >
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Shift Start</label>
                    <input 
                      type="time"
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-5 sm:p-6 rounded-[1.5rem] text-xs font-black tracking-widest shadow-inner outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white" 
                      value={newShiftStart} onChange={e => setNewShiftStart(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Shift End</label>
                    <input 
                      type="time"
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-5 sm:p-6 rounded-[1.5rem] text-xs font-black tracking-widest shadow-inner outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white" 
                      value={newShiftEnd} onChange={e => setNewShiftEnd(e.target.value)} 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-black py-5 sm:py-6 rounded-[2rem] text-[10px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all mt-4 hover:bg-indigo-600 dark:hover:bg-indigo-50 hover:text-white dark:hover:text-indigo-600"
                >
                  Onboard personnel
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaffView;