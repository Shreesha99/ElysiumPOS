import React, { useState } from "react";
import { Waiter } from "@/types";
import StaffGrid from "@/components/StaffView/StaffGrid";
import AddStaffModal from "@/components/StaffView/AddStaffModal";
import SectionHeader from "@/components/ui/SectionHeader";
import { Plus, Settings2, Users } from "lucide-react";

interface StaffViewProps {
  waiters: Waiter[];
  addWaiter: (name: string, email: string, password: string) => Promise<void>;
  updateWaiter: (id: string, updates: Partial<Waiter>) => void;
  deleteWaiter: (id: string) => void;
}

const StaffView: React.FC<StaffViewProps> = ({
  waiters,
  addWaiter,
  updateWaiter,
  deleteWaiter,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  return (
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <SectionHeader
        icon={<Users size={22} />}
        title="Staff Management"
        subtitle="Manage team members and access control"
        rightContent={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditMode((prev) => !prev)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <Settings2 size={16} />
              {isEditMode ? "Exit Edit" : "Edit Mode"}
            </button>

            <button
              onClick={() => setIsAddFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm transition"
            >
              <Plus size={16} />
              Add Staff
            </button>
          </div>
        }
      />

      <StaffGrid
        waiters={waiters}
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
