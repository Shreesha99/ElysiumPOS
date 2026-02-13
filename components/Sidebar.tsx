
import React from 'react';
import { 
  LayoutDashboard, 
  HandPlatter, 
  Table as TableIcon, 
  Package, 
  Sparkles, 
  Sun, 
  Moon,
  LogOut 
} from 'lucide-react';
import { User } from '../services/authService';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  user: User | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, darkMode, toggleDarkMode, user, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pos', label: 'Elysium Terminal', icon: HandPlatter },
    { id: 'tables', label: 'Tables', icon: TableIcon },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'insights', label: 'AI Intelligence', icon: Sparkles },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 lg:w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 z-40 transition-all duration-300">
      <div className="flex flex-col h-full">
        {/* Brand */}
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none shrink-0">
            <span className="text-white font-black text-xl">E</span>
          </div>
          <div className="hidden lg:block overflow-hidden">
             <h1 className="font-extrabold text-xl tracking-tight dark:text-white">Elysium<span className="text-indigo-600">POS</span></h1>
             <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Enterprise v3.4</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 mt-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-3.5 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 font-semibold'
                  : 'text-zinc-500 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900/50 hover:text-indigo-600'
              }`}
            >
              <item.icon size={22} className="shrink-0" />
              <span className="hidden lg:block text-[14px]">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-4 p-3.5 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all"
          >
            {darkMode ? <Sun size={22} /> : <Moon size={22} />}
            <span className="hidden lg:block text-sm font-medium">{darkMode ? 'Appearance: Light' : 'Appearance: Dark'}</span>
          </button>
          
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl flex items-center gap-3 border border-zinc-100 dark:border-zinc-800">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
              {user?.name.charAt(0)}
            </div>
            <div className="hidden lg:block flex-1 overflow-hidden">
              <p className="text-xs font-bold dark:text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Manager</p>
            </div>
            <button 
              onClick={onLogout}
              className="hidden lg:block p-1.5 text-zinc-400 hover:text-rose-500 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
