import React from "react";
import { MoreHorizontal, RefreshCcw, Sun, Moon, LogOut } from "lucide-react";
import { AppUser } from "@/services/authService";
import { navSections } from "./SidebarSections";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  toggleDarkMode: (value: boolean) => void;
  user: AppUser | null;
  onLogout: () => void;
  onSync: () => void;
  isSyncing: boolean;

  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarMobile: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  darkMode,
  toggleDarkMode,
  user,
  onLogout,
  onSync,
  isSyncing,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const flatNavItems = navSections.flatMap((section) => section.items);

  return (
    <>
      {/* BOTTOM NAV */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 z-50">
        <div className="h-full max-w-md mx-auto flex items-center justify-around px-4">
          {flatNavItems.slice(0, 4).map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center gap-1 w-16 transition ${
                  isActive ? "text-indigo-600" : "text-zinc-400"
                }`}
              >
                <Icon size={20} />
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
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* SHEET */}
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 rounded-t-3xl border-t border-zinc-200 dark:border-zinc-800 max-h-[90vh] flex flex-col">
            {/* HANDLE */}
            <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto mt-3 mb-4 shrink-0" />

            {/* SCROLLABLE NAV SECTION */}
            <div className="flex-1 overflow-y-auto px-6 space-y-2">
              {flatNavItems.slice(4).map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-sm transition"
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* STICKY BOTTOM SECTION */}
            <div className="px-6 py-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4 shrink-0">
              {/* SYNC */}
              <button
                onClick={() => {
                  onSync();
                  setMobileMenuOpen(false);
                }}
                disabled={isSyncing}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isSyncing
                    ? "bg-indigo-100 dark:bg-indigo-900/30 cursor-not-allowed opacity-70"
                    : "bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                }`}
              >
                {isSyncing ? (
                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <RefreshCcw size={18} className="text-indigo-600" />
                )}

                <span className="text-sm font-semibold text-indigo-600">
                  {isSyncing ? "Synchronizing..." : "Secure Cloud Sync"}
                </span>
              </button>

              {/* THEME */}
              <div className="flex w-full bg-zinc-100 dark:bg-zinc-900 rounded-xl p-1 relative">
                {/* Sliding Indicator */}
                <div
                  className={`absolute top-1 bottom-1 w-1/2 rounded-lg bg-indigo-600 transition-all duration-300 ${
                    darkMode ? "translate-x-full" : "translate-x-0"
                  }`}
                />

                {/* Light */}
                <button
                  onClick={() => toggleDarkMode(false)}
                  className={`relative flex-1 flex items-center justify-center h-10 z-10 transition ${
                    !darkMode
                      ? "text-white"
                      : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  <Sun size={16} />
                </button>

                {/* Dark */}
                <button
                  onClick={() => toggleDarkMode(true)}
                  className={`relative flex-1 flex items-center justify-center h-10 z-10 transition ${
                    darkMode ? "text-white" : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  <Moon size={16} />
                </button>
              </div>

              {/* USER CARD */}
              <div className="flex items-center gap-3 p-4 bg-zinc-100 dark:bg-zinc-900 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                  {user?.name?.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-zinc-400 uppercase">Operator</p>
                </div>
              </div>

              {/* LOGOUT */}
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-sm transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarMobile;
