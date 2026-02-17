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
  RefreshCcw,
  CookingPot,
} from "lucide-react";
import { AppUser } from "@/services/authService";
import BrandIcon from "@/components/ui/BrandIcon";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  user: AppUser | null;
  onLogout: () => void;
  onSync: () => void;
  isSyncing: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  toggleDarkMode,
  user,
  onLogout,
  onSync,
  isSyncing,
}) => {
  const navSections = [
    {
      title: "Operations",
      defaultOpen: true,
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "pos", label: "Order Hub", icon: HandPlatter },
        { id: "tables", label: "Floor Map", icon: TableIcon },
        { id: "kitchen", label: "Kitchen", icon: CookingPot },
      ],
    },
    {
      title: "Management",
      defaultOpen: false,
      items: [
        { id: "waiters", label: "Staff", icon: UserCheck },
        { id: "inventory", label: "Inventory", icon: Database },
      ],
    },
    {
      title: "Intelligence",
      defaultOpen: false,
      items: [{ id: "insights", label: "AI Strategy", icon: Sparkles }],
    },
    {
      title: "Support",
      defaultOpen: false,
      items: [{ id: "support", label: "Customer Support", icon: CircleHelp }],
    },
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const [openSections, setOpenSections] = React.useState<
    Record<string, boolean>
  >(Object.fromEntries(navSections.map((s) => [s.title, s.defaultOpen])));

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const flatNavItems = navSections.flatMap((section) => section.items);

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-900 z-40 flex flex-col">
        {/* BRAND */}
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

        {/* SCROLLABLE NAV AREA */}
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <nav className="space-y-6">
              {navSections.map((section) => {
                const isOpen = openSections[section.title];

                return (
                  <div key={section.title}>
                    <button
                      onClick={() => toggleSection(section.title)}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-widest text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
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
                                <item.icon size={18} />
                                <span className="text-sm font-semibold">
                                  {item.label}
                                </span>
                              </div>

                              {isActive && (
                                <ChevronRight
                                  size={14}
                                  className="opacity-60"
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-6 border-t border-zinc-200 dark:border-zinc-900 space-y-4 flex-none">
          {/* SYNC */}
          <button
            onClick={onSync}
            disabled={isSyncing}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition ${
              isSyncing
                ? "bg-indigo-100 dark:bg-indigo-900/30 cursor-not-allowed opacity-70"
                : "bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
            }`}
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

          {/* THEME */}
          <div className="flex w-full bg-zinc-100 dark:bg-zinc-900 rounded-xl p-1">
            <button
              onClick={() => darkMode && toggleDarkMode()}
              className={`flex-1 flex items-center justify-center h-9 rounded-lg transition-all duration-200 ${
                !darkMode
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              <Sun size={16} />
            </button>

            <button
              onClick={() => !darkMode && toggleDarkMode()}
              className={`flex-1 flex items-center justify-center h-9 rounded-lg transition-all duration-200 ${
                darkMode
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              <Moon size={16} />
            </button>
          </div>

          {/* USER */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold uppercase">
                {user?.name?.charAt(0)}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold truncate dark:text-white">
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

      {/* MOBILE BOTTOM NAV */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 z-50">
        <div className="h-full max-w-md mx-auto flex items-center justify-around px-4">
          {flatNavItems.slice(0, 4).map((item) => {
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
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* SHEET */}
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 rounded-t-3xl border-t border-zinc-200 dark:border-zinc-800 max-h-[90vh] flex flex-col">
            {/* HANDLE */}
            <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto mt-3 mb-4 shrink-0" />

            {/* 🔥 SCROLLABLE NAV SECTION ONLY */}
            <div className="flex-1 overflow-y-auto px-6 space-y-2">
              {flatNavItems.slice(4).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-sm transition"
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </div>

            {/* 🔥 STICKY BOTTOM SECTION */}
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
              <div className="flex w-full bg-zinc-100 dark:bg-zinc-900 rounded-xl p-1">
                <button
                  onClick={() => darkMode && toggleDarkMode()}
                  className={`flex-1 flex items-center justify-center h-9 rounded-lg transition ${
                    !darkMode
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-zinc-400"
                  }`}
                >
                  <Sun size={16} />
                </button>

                <button
                  onClick={() => !darkMode && toggleDarkMode()}
                  className={`flex-1 flex items-center justify-center h-9 rounded-lg transition ${
                    darkMode
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-zinc-400"
                  }`}
                >
                  <Moon size={16} />
                </button>
              </div>

              {/* USER CARD */}
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

export default Sidebar;
