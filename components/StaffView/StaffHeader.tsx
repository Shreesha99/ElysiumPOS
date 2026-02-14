import React from "react";
import { Settings2, UserPlus, ArrowLeft } from "lucide-react";

interface Props {
  isEditMode: boolean;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  openAddForm: () => void;
}

const StaffHeader: React.FC<Props> = ({
  isEditMode,
  setIsEditMode,
  openAddForm,
}) => {
  return (
    <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-40">
      <div className="max-w-[1600px] mx-auto px-6 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold dark:text-white">
            Staff Directory
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage roles, schedules and availability
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isEditMode ? (
            <button
              onClick={() => setIsEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <Settings2 size={16} />
              Edit Mode
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEditMode(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-sm transition"
              >
                <ArrowLeft size={16} />
                Exit
              </button>

              <button
                onClick={openAddForm}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition"
              >
                <UserPlus size={16} />
                Add Staff
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default StaffHeader;
