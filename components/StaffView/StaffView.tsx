import React, { useState, useMemo } from "react";
import { Waiter } from "@/types";
import StaffGrid from "@/components/StaffView/StaffGrid";
import AddStaffModal from "@/components/StaffView/AddStaffModal";
import SectionHeader from "@/components/ui/SectionHeader";
import SearchBar from "@/components/POSView/SearchBar";
import { Plus, Settings2, Users } from "lucide-react";

interface StaffViewProps {
  waiters: Waiter[];
  addWaiter: (name: string, email: string, password: string) => Promise<void>;
  updateWaiter: (id: string, updates: Partial<Waiter>) => Promise<void>;
  deleteWaiter: (id: string) => Promise<void>;
}

const StaffView: React.FC<StaffViewProps> = ({
  waiters,
  addWaiter,
  updateWaiter,
  deleteWaiter,
}) => {
  const [search, setSearch] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const filteredStaff = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return waiters;

    return waiters.filter((w) =>
      `${w.name} ${w.role}`.toLowerCase().includes(q)
    );
  }, [waiters, search]);

  return (
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 relative font-sans">
      <SectionHeader
        defaultExpanded={false}
        icon={<Users size={22} />}
        title="Staff Management"
        subtitle="Manage team members and roles"
        rightContent={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditMode((p) => !p)}
              className="flex items-center gap-2 px-4 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <Settings2 size={16} />
              {isEditMode ? "Exit Edit" : "Edit Mode"}
            </button>

            <button
              onClick={() => setIsAddFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-sm"
            >
              <Plus size={16} />
              Add Staff
            </button>
          </div>
        }
        searchContent={<SearchBar value={search} onChange={setSearch} />}
      />

      <StaffGrid
        waiters={filteredStaff}
        isEditMode={isEditMode}
        updateWaiter={updateWaiter}
        deleteWaiter={deleteWaiter}
      />

      <AddStaffModal
        isOpen={isAddFormOpen}
        setIsOpen={setIsAddFormOpen}
        addWaiter={addWaiter}
      />
    </div>
  );
};

export default StaffView;
