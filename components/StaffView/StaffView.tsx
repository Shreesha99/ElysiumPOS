import React, { useState } from "react";
import { Waiter } from "@/types";
import StaffHeader from "./StaffHeader";
import StaffGrid from "./StaffGrid";
import AddStaffModal from "./AddStaffModal";

interface StaffViewProps {
  waiters: Waiter[];
  addWaiter: (waiter: Waiter) => void;
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
      <StaffHeader
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        openAddForm={() => setIsAddFormOpen(true)}
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
