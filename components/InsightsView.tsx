
import React from 'react';
import { Sparkles } from 'lucide-react';
import { BusinessInsight } from '../types';

interface InsightsViewProps {
  insights: BusinessInsight[];
  fetchAIInsights: () => void;
}

const InsightsView: React.FC<InsightsViewProps> = ({ insights, fetchAIInsights }) => {
  return (
    <div className="p-16 space-y-16 h-full overflow-y-auto">
       <h1 className="text-6xl font-black uppercase tracking-tighter">AI Strategy</h1>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {insights.length > 0 ? insights.map((s, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 p-16 rounded-[5rem] border border-t-[20px] border-indigo-600 shadow-2xl hover:-translate-y-4 transition-all duration-500">
              <h3 className="text-sm font-black uppercase text-zinc-400 mb-10 tracking-[0.2em]">{s.title}</h3>
              <h2 className="text-7xl font-black dark:text-white mb-10 tracking-tighter">{s.value}</h2>
              <p className="text-lg text-zinc-500 leading-relaxed font-medium">{s.description}</p>
            </div>
          )) : (
            <div className="col-span-full h-96 flex flex-col items-center justify-center space-y-10 text-zinc-300">
               <Sparkles size={120} className="opacity-10" />
               <p className="text-2xl font-black uppercase tracking-[0.3em]">AI Engine dormant</p>
               <button onClick={fetchAIInsights} className="bg-indigo-600 text-white px-12 py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-xl">Activate analysis</button>
            </div>
          )}
       </div>
    </div>
  );
};

export default InsightsView;
