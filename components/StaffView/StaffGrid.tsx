import React from "react";
import { Waiter } from "@/types";
import StaffCard from "@/components/StaffView/StaffCard";
import EmptyState from "../ui/EmptyState";
import { Users } from "lucide-react";

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
    <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-10 no-scrollbar pb-40 lg:pb-10">
      <div className="max-w-[1600px] mx-auto">
        {waiters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
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
        ) : (
          <EmptyState
            icon={Users}
            title="No staff members found"
            description="Add your first team member to get started."
          />
        )}
      </div>
    </div>
  );
};

export default StaffGrid;
