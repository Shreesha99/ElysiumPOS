import React from "react";
import { ChevronRight, Sun, Moon, LogOut, RefreshCcw } from "lucide-react";
import { AppUser } from "@/services/authService";
import BrandIcon from "@/components/Components/BrandIcon";
import { navSections } from "./SidebarSections";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  user: AppUser | null;
  onLogout: () => void;
  onSync: () => void;
  isSyncing: boolean;
  openSections: Record<string, boolean>;
  toggleSection: (title: string) => void;
}

const SidebarDesktop: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  darkMode,
  toggleDarkMode,
  user,
  onLogout,
  onSync,
  isSyncing,
  openSections,
  toggleSection,
}) => {
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-900 z-40 flex flex-col">
      <div className="px-6 py-8 flex items-center gap-4 flex-none">
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

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {navSections.map((section) => {
          const isOpen = openSections[section.title];

          return (
            <div key={section.title} className="mb-6">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-widest text-zinc-400"
              >
                {section.title}
                <ChevronRight
                  size={14}
                  className={`transition-transform ${
                    isOpen ? "rotate-90" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="mt-2 space-y-1">
                  {section.items.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${
                          isActive
                            ? "bg-indigo-600 text-white"
                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={18} />
                          <span className="text-sm font-semibold">
                            {item.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="px-6 py-6 border-t border-zinc-200 dark:border-zinc-900 space-y-4 flex-none">
        <button
          onClick={onSync}
          disabled={isSyncing}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20"
        >
          {isSyncing ? (
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <RefreshCcw size={16} className="text-indigo-600" />
          )}
          <span className="text-sm font-semibold text-indigo-600">
            {isSyncing ? "Synchronizing..." : "Secure Cloud Sync"}
          </span>
        </button>

        <div className="flex w-full bg-zinc-100 dark:bg-zinc-900 rounded-xl p-1">
          <button
            onClick={() => !darkMode && toggleDarkMode()}
            className={`flex-1 h-9 rounded-lg ${
              !darkMode ? "bg-indigo-600 text-white" : "text-zinc-400"
            }`}
          >
            <Sun size={16} />
          </button>

          <button
            onClick={() => darkMode && toggleDarkMode()}
            className={`flex-1 h-9 rounded-lg ${
              darkMode ? "bg-indigo-600 text-white" : "text-zinc-400"
            }`}
          >
            <Moon size={16} />
          </button>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold uppercase">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold dark:text-white">
                {user?.name}
              </p>
              <p className="text-[10px] tracking-wider text-zinc-400 uppercase">
                Operator
              </p>
            </div>
          </div>
          <LogOut size={16} className="text-zinc-400" />
        </button>
      </div>
    </aside>
  );
};

export default SidebarDesktop;
