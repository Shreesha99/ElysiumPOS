import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  BrainCircuit, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  RefreshCcw,
  ShieldCheck,
  Cpu,
  BarChart4,
  ArrowUpRight,
  Loader2,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { BusinessInsight } from '../types';

interface InsightsViewProps {
  insights: BusinessInsight[];
  fetchAIInsights: () => void;
  isLoading?: boolean;
  error?: string | null;
}

const InsightsView: React.FC<InsightsViewProps> = ({ insights, fetchAIInsights, isLoading, error }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp size={16} className="text-emerald-500" />;
      case 'down': return <TrendingDown size={16} className="text-rose-500" />;
      default: return <Minus size={16} className="text-zinc-400" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-indigo-600 text-white';
      case 'Medium': return 'bg-amber-500 text-white';
      case 'Low': return 'bg-zinc-500 text-white';
      default: return 'bg-zinc-200 text-zinc-600';
    }
  };

  // Logic to determine which screen to show
  const hasInsights = insights.length > 0;
  
  return (
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden font-sans">
      {/* Premium Strategy Header */}
      <header className="px-6 py-6 sm:px-12 sm:py-10 border-b border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 sticky top-0 z-40 shrink-0">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600">
                <BrainCircuit size={24} />
              </div>
              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter dark:text-white truncate">AI Strategy Hub</h1>
            </div>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] pl-1 truncate">Unified Neural Intelligence & Analytics</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Status Indicators */}
            <div className="hidden sm:flex flex-col items-end mr-4">
              <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Core Status</p>
              <p className={`text-xs font-black flex items-center gap-2 ${error ? 'text-rose-500' : hasInsights ? 'text-emerald-500' : 'text-zinc-400'}`}>
                {error ? <AlertTriangle size={14} /> : hasInsights ? <ShieldCheck size={14} /> : <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" />} 
                {error ? 'Interrupted' : hasInsights ? 'Synchronized' : 'Ready to Analyze'}
              </p>
            </div>
            
            {/* Context-Aware Header Button: Only shows when insights are already present and there's no error */}
            {hasInsights && !error && (
              <button 
                onClick={fetchAIInsights} 
                disabled={isLoading}
                className={`flex items-center gap-3 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-600 dark:hover:bg-indigo-50 hover:text-white dark:hover:text-indigo-600'}`}
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />}
                Refresh Analysis
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Insights Canvas */}
      <div className="flex-1 overflow-y-auto px-6 sm:px-12 py-10 no-scrollbar pb-32 lg:pb-12">
        <div className="max-w-[1600px] mx-auto h-full">
          <AnimatePresence mode="wait">
            {isLoading ? (
              /* Loading State */
              <motion.div 
                key="loader"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full min-h-[500px] flex flex-col items-center justify-center space-y-12"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="w-40 h-40 border-t-4 border-indigo-600 rounded-full opacity-20"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-indigo-600">
                      <Cpu size={48} />
                    </motion.div>
                  </div>
                </div>
                <div className="text-center space-y-4 max-w-md">
                   <h3 className="text-xl font-black uppercase tracking-widest animate-pulse">Synthesizing telemetry...</h3>
                   <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed">The neural engine is processing your business node data.</p>
                </div>
              </motion.div>
            ) : error === "QUOTA_REACHED" ? (
              /* Quota/Rate Limit Error */
              <motion.div 
                key="quota"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="h-full min-h-[500px] flex flex-col items-center justify-center space-y-10"
              >
                <div className="p-16 rounded-[4rem] bg-rose-50 dark:bg-rose-900/10 border-2 border-dashed border-rose-200 dark:border-rose-900/50">
                  <Lock size={80} className="text-rose-500 opacity-20" />
                </div>
                <div className="text-center space-y-4 max-w-lg mx-auto px-6">
                   <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">Rate Limit Exhausted</h2>
                   <p className="text-xs font-bold uppercase tracking-widest leading-relaxed text-zinc-500">
                     Your API key has reached its volume limit for the current cycle. 
                     Please wait a few moments or upgrade your project quota.
                   </p>
                </div>
                <button onClick={fetchAIInsights} className="bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Retry Sync</button>
              </motion.div>
            ) : error === "KEY_MISSING" ? (
              /* Missing Key Error */
              <motion.div 
                key="key_missing"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-full min-h-[500px] flex flex-col items-center justify-center space-y-10"
              >
                <div className="p-16 rounded-[4rem] bg-amber-50 dark:bg-amber-900/10 border-2 border-dashed border-amber-200 dark:border-amber-800">
                  <AlertTriangle size={80} className="text-amber-500 opacity-20" />
                </div>
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-black uppercase tracking-tighter">API Context Missing</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 max-w-sm mx-auto leading-relaxed">
                    The strategy hub cannot detect your Gemini API key in the environment. 
                    Ensure API_KEY is correctly set in your .env or platform variables.
                  </p>
                </div>
                <button onClick={fetchAIInsights} className="bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Re-validate Environment</button>
              </motion.div>
            ) : hasInsights ? (
              /* Success: Grid of Insights */
              <motion.div 
                key="grid"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-12"
              >
                {insights.map((s, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                    className="bg-white dark:bg-zinc-900 p-10 rounded-[4rem] border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-500 group relative flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-8">
                       <div className="flex flex-col gap-2">
                          <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest w-fit ${getImpactColor(s.impact)}`}>{s.impact} Impact</span>
                          <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">{s.category} Logic</span>
                       </div>
                       <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl group-hover:scale-110 group-hover:bg-indigo-600 transition-all">{getTrendIcon(s.trend)}</div>
                    </div>
                    <h3 className="text-sm font-black uppercase text-zinc-400 mb-2 tracking-[0.1em]">{s.title}</h3>
                    <h2 className="text-4xl font-black dark:text-white mb-6 tracking-tighter leading-tight">{s.value}</h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-bold uppercase tracking-wide opacity-80 mb-8 flex-1">{s.description}</p>
                    <div className="pt-6 border-t border-zinc-50 dark:border-zinc-800 mt-auto">
                       <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600 hover:gap-3 transition-all">Execute Strategy <ArrowUpRight size={14} /></button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              /* Dormant State: Initial Action Button */
              <motion.div 
                key="dormant"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-full min-h-[500px] flex flex-col items-center justify-center space-y-10 text-zinc-300"
              >
                 <div className="p-16 rounded-[4rem] bg-zinc-50 dark:bg-zinc-900/50 border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                    <Sparkles size={80} className="opacity-10" />
                 </div>
                 <div className="text-center space-y-2 px-6">
                    <p className="text-2xl font-black uppercase tracking-[0.3em]">Strategy Core Ready</p>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-40">Telemetry streams from your business node are ready for synthesis.</p>
                 </div>
                 <button 
                  onClick={fetchAIInsights} 
                  className="bg-indigo-600 text-white px-12 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-indigo-700 transition-all active:scale-95"
                 >
                   Initiate Strategy Analysis
                 </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Futuristic Status Footer */}
      <footer className="hidden lg:flex px-12 py-4 border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 justify-between items-center text-[8px] font-black uppercase tracking-[0.3em] text-zinc-400">
         <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Zap size={10} className="text-indigo-500" /> Neural Processing: Active</span>
            <span className="flex items-center gap-1.5"><BarChart4 size={10} className="text-indigo-500" /> Logic Node: Gemini-3-Flash</span>
            <span className="flex items-center gap-1.5"><Cpu size={10} className="text-indigo-500" /> Environment: Synchronized</span>
         </div>
         <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${error ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : hasInsights ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-zinc-300'}`} />
            Analysis Engine: {error ? 'Interrupted' : hasInsights ? 'Online' : 'Dormant'}
         </div>
      </footer>
    </div>
  );
};

export default InsightsView;