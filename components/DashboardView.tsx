
import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  BarChart3, 
  Activity, 
  Sparkles, 
  Database,
  Zap 
} from 'lucide-react';
import { Order, Table, BusinessInsight, MenuItem } from '../types';

interface DashboardViewProps {
  stats: any;
  liveTraffic: number;
  insights: BusinessInsight[];
  fetchAIInsights: () => void;
  tables: Table[];
  orders: Order[];
  menuItems: MenuItem[];
  setActiveTab: (tab: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ 
  stats, liveTraffic, insights, fetchAIInsights, tables, orders, menuItems, setActiveTab 
}) => {
  return (
    <div className="p-10 lg:p-14 space-y-12 h-full overflow-y-auto bg-zinc-50 dark:bg-zinc-950 scrollbar-hide">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
            Overview 
            <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-black">Real-time sync</span>
          </h1>
          <p className="text-zinc-500 text-sm font-semibold mt-1">Manage your enterprise nodes and session data.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex flex-col items-end mr-4">
            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Network traffic</p>
            <p className="text-lg font-black text-emerald-500 flex items-center gap-2"><Activity size={16}/> {liveTraffic} requests/m</p>
          </div>
          <button onClick={fetchAIInsights} className="flex-1 md:flex-none bg-indigo-600 text-white px-8 py-4 rounded-3xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/30 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
            <Sparkles size={16}/> Refresh strategy
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Settled revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500', trend: '+12.5%' },
          { label: 'Active orders', value: orders.filter(o => o.status !== 'Paid').length.toString(), icon: ShoppingBag, color: 'text-amber-500', trend: 'Live' },
          { label: 'Avg order value', value: `₹${stats.avgOrderValue.toFixed(0)}`, icon: BarChart3, color: 'text-indigo-500', trend: '+5.2%' },
          { label: 'Floor occupancy', value: `${stats.occupancyRate.toFixed(1)}%`, icon: Users, color: 'text-rose-500', trend: `${stats.occupiedTables}/${tables.length}` },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-[3.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all hover:-translate-y-2 group">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 ${s.color} group-hover:scale-110 transition-transform`}>
                <s.icon size={28} />
              </div>
              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${s.color} bg-current/10 tracking-widest`}>{s.trend}</span>
            </div>
            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">{s.label}</p>
            <h2 className="text-4xl font-black mt-1 dark:text-white tracking-tighter">{s.value}</h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-12 rounded-[4rem] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-lg font-black uppercase tracking-tight">Hourly Sales Projection</h3>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-[10px] font-black uppercase text-zinc-400">Projected trend</span>
            </div>
          </div>
          <div className="flex-1 flex items-end justify-between gap-2 min-h-[250px] pt-4">
            {stats.hourlySales.map((h: any, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="relative w-full flex items-end justify-center">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(h.value / 6000) * 100}%` }}
                    className="w-full max-w-[40px] bg-zinc-100 dark:bg-zinc-800 group-hover:bg-indigo-600 rounded-t-xl transition-all duration-500 cursor-pointer relative"
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹{h.value}</div>
                  </motion.div>
                </div>
                <span className="text-[10px] font-black uppercase text-zinc-400 tracking-tighter whitespace-nowrap">{h.hour}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-12 rounded-[4rem] border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col">
          <h3 className="text-lg font-black uppercase tracking-tight mb-8">Asset Popularity</h3>
          <div className="flex-1 space-y-8">
            {menuItems.slice(0, 4).map((item, i) => {
              const width = Math.floor(Math.random() * 60) + 40;
              return (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    <span>{item.name}</span>
                    <span className="text-indigo-600">{width}%</span>
                  </div>
                  <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      className="h-full bg-indigo-600 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
            {menuItems.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                <Database className="mx-auto" size={40}/>
                <p className="text-xs font-bold uppercase tracking-widest">No assets found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-10">
        <div className="bg-white dark:bg-zinc-900 p-12 rounded-[4rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-lg font-black uppercase tracking-tight">Active Floor Sessions</h3>
            <button onClick={() => setActiveTab('tables')} className="text-xs font-black uppercase text-indigo-600 hover:underline">View map</button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
            {tables.map(t => (
              <div key={t.id} title={`Table ${t.number} - ${t.status}`} className={`aspect-square rounded-2xl flex items-center justify-center text-[10px] font-black transition-all ${t.status === 'Occupied' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}>
                T{t.number}
              </div>
            ))}
            {tables.length === 0 && (
              <div className="col-span-full py-10 text-center text-zinc-400 font-bold uppercase text-[10px] tracking-widest border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[2rem]">
                No tables configured in floor nodes.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-12 rounded-[4rem] border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col">
          <h3 className="text-lg font-black uppercase tracking-tight mb-8">AI Strategy Feed</h3>
          <div className="space-y-6 flex-1 overflow-y-auto scrollbar-hide max-h-[300px]">
            {insights.length > 0 ? insights.map((s, i) => (
              <div key={i} className="flex gap-6 p-6 rounded-[2rem] bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 hover:border-indigo-500/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center shrink-0">
                  <Zap size={20}/>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">{s.title}</p>
                  <h4 className="text-sm font-black dark:text-white mb-2">{s.value}</h4>
                  <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">{s.description}</p>
                </div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30 py-10">
                <Sparkles size={48} className="animate-pulse" />
                <p className="text-xs font-bold uppercase tracking-widest max-w-[200px] mx-auto">Neural insights are generating. Press refresh strategy to sync.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
