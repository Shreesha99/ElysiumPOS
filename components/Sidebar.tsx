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
  CircleHelp,
} from "lucide-react";
import { AppUser } from "../services/authService";
import BrandIcon from "./BrandIcon";

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
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-900 z-40 flex-col">
        {/* BRAND */}
        <div className="px-6 py-8 flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center">
            <BrandIcon />
          </div>

          <div className="leading-tight">
            <h1 className="text-lg font-bold tracking-tight dark:text-white uppercase">
              Elysium <span className="text-indigo-600">POSS</span>
            </h1>
            <p className="text-[10px] font-semibold tracking-widest text-zinc-400 uppercase">
              Premium Intelligence
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-indigo-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className="shrink-0" />
                  <span className="text-sm font-semibold">{item.label}</span>
                </div>

                {isActive && <ChevronRight size={14} className="opacity-60" />}
              </button>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="px-6 py-6 border-t border-zinc-200 dark:border-zinc-900 space-y-4">
          {/* THEME */}
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {darkMode ? "Light Theme" : "Dark Theme"}
          </button>

          {/* USER CARD */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 font-bold text-sm uppercase">
              {user?.name?.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold dark:text-white truncate">
                {user?.name}
              </p>
              <p className="text-[10px] tracking-wider text-zinc-400 uppercase">
                Operator
              </p>
            </div>

            <button
              onClick={onLogout}
              className="p-2 text-zinc-400 hover:text-rose-500 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 z-50">
        <div className="h-full max-w-md mx-auto flex items-center justify-around px-4">
          {navItems.slice(0, 4).map((item) => {
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center gap-1 w-16 transition ${
                  isActive ? "text-indigo-600" : "text-zinc-400"
                }`}
              >
                <item.icon size={20} />
                <span className="text-[9px] font-medium uppercase text-center leading-tight">
                  {item.label}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center gap-1 w-16 text-zinc-400"
          >
            <MoreHorizontal size={20} />
            <span className="text-[9px] font-medium uppercase leading-tight">
              More
            </span>
          </button>
        </div>
      </div>

      {/* MOBILE SHEET */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 rounded-t-3xl p-6 space-y-6 border-t border-zinc-200 dark:border-zinc-800">
            <div className="space-y-2">
              {navItems.slice(4).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-sm"
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="border-t border-zinc-200 dark:border-zinc-800" />

            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-sm"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              {darkMode ? "Light Theme" : "Dark Theme"}
            </button>

            <div className="flex items-center gap-3 p-4 bg-zinc-100 dark:bg-zinc-900 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                {user?.name?.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium dark:text-white">
                  {user?.name}
                </p>
                <p className="text-xs text-zinc-400 uppercase">Operator</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-sm"
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
