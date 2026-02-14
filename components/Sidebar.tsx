import React from "react";
import {
  LayoutDashboard,
  HandPlatter,
  Table as TableIcon,
  Database,
  Sparkles,
  Sun,
  Moon,
  LogOut,
  ChevronRight,
  UserCheck,
  MoreHorizontal,
  HelpingHand,
  LifeBuoy,
  CircleHelp,
} from "lucide-react";
import { AppUser } from "../services/authService";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  user: AppUser | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  toggleDarkMode,
  user,
  onLogout,
}) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "pos", label: "Order Hub", icon: HandPlatter },
    { id: "tables", label: "Floor Map", icon: TableIcon },
    { id: "waiters", label: "Staff", icon: UserCheck },
    { id: "inventory", label: "Assets", icon: Database },
    { id: "insights", label: "AI Strategy", icon: Sparkles },
    { id: "support", label: "Customer Support", icon: CircleHelp },
  ];
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <>
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 bg-white dark:bg-zinc-950 border-r border-zinc-100 dark:border-zinc-900 z-40 flex-col shadow-sm">
        <div className="p-8 flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="text-white font-extrabold text-2xl">E</span>
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight dark:text-white uppercase">
              Elysium <span className="text-indigo-600">POS</span>
            </h1>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
              Premium Intelligence
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all group ${
                activeTab === item.id
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/20"
                  : "text-zinc-500 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900/50 hover:text-indigo-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  size={20}
                  className={
                    activeTab === item.id
                      ? ""
                      : "group-hover:scale-110 transition-transform"
                  }
                />
                <span className="text-sm font-bold">{item.label}</span>
              </div>
              {activeTab === item.id && (
                <ChevronRight size={14} className="opacity-50" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-zinc-100 dark:border-zinc-900 space-y-4">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-sm font-bold"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {darkMode ? "Light Theme" : "Dark Theme"}
          </button>

          <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex items-center gap-3 border border-zinc-100 dark:border-zinc-800">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 font-extrabold text-xs uppercase">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden text-left">
              <p className="text-sm font-bold dark:text-white truncate">
                {user?.name}
              </p>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                Operator
              </p>
            </div>
            <button
              onClick={onLogout}
              title="Logout"
              className="p-2 text-zinc-400 hover:text-rose-500 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE NAV */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 z-50">
        <div className="h-full max-w-md mx-auto flex items-center justify-around px-4">
          {navItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 w-14 transition-all ${
                activeTab === item.id ? "text-indigo-600" : "text-zinc-400"
              }`}
            >
              <item.icon size={20} />
              <span className="text-[8px] font-medium uppercase text-center leading-tight">
                {item.label}
              </span>
            </button>
          ))}

          {/* MORE BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center gap-1 w-14 text-zinc-400"
          >
            <MoreHorizontal size={20} />
            <span className="text-[8px] font-medium uppercase text-center leading-tight">
              More
            </span>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 rounded-t-3xl p-6 space-y-6 border-t border-zinc-200 dark:border-zinc-800">
            {/* Remaining Nav Items */}
            <div className="space-y-3">
              {navItems.slice(4).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-sm"
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-200 dark:border-zinc-800" />

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-sm"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              {darkMode ? "Light Theme" : "Dark Theme"}
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3 p-3 bg-zinc-100 dark:bg-zinc-900 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                {user?.name?.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium dark:text-white">
                  {user?.name}
                </p>
                <p className="text-xs text-zinc-400">Operator</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-sm"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
