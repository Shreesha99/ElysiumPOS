import React from "react";
import { Waiter } from "@/types";
import StaffCard from "@/components/StaffView/StaffCard";

interface Props {
  waiters: Waiter[];
  isEditMode: boolean;
  updateWaiter: (id: string, updates: Partial<Waiter>) => void;
  deleteWaiter: (id: string) => void;
}

const StaffGrid: React.FC<Props> = ({
  waiters,
  isEditMode,
  updateWaiter,
  deleteWaiter,
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {waiters.map((w) => (
          <StaffCard
            key={w.id}
            waiter={w}
            isEditMode={isEditMode}
            updateWaiter={updateWaiter}
            deleteWaiter={deleteWaiter}
          />
        ))}
      </div>
    </div>
  );
};

export default StaffGrid;
