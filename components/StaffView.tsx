
import React from 'react';
import { Waiter } from '../types';

interface StaffViewProps {
  waiters: Waiter[];
}

const StaffView: React.FC<StaffViewProps> = ({ waiters }) => {
  return (
    <div className="p-16 space-y-16 h-full overflow-y-auto">
       <h1 className="text-6xl font-black uppercase tracking-tighter">Staff Directory</h1>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {waiters.map(w => (
            <div key={w.id} className="bg-white dark:bg-zinc-900 p-16 rounded-[4.5rem] border border-zinc-100 dark:border-zinc-800 flex items-center gap-12 shadow-sm group hover:border-indigo-500 transition-all">
               <div className="w-28 h-28 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center text-white font-black text-5xl uppercase shadow-xl group-hover:scale-110 transition-transform">{w.name.charAt(0)}</div>
               <div><h3 className="text-3xl font-black dark:text-white tracking-tighter">{w.name}</h3><p className="text-xs font-black uppercase text-indigo-500 tracking-widest mt-3">{w.status}</p></div>
            </div>
          ))}
       </div>
    </div>
  );
};

export default StaffView;
