import React from "react";
import { Search, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

const SearchBar: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800 px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 focus-within:ring-2 focus-within:ring-indigo-500 transition">
      <Search size={16} className="text-zinc-400" />
      <input
        placeholder="Search dishes, categories, or descriptions"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent outline-none w-full text-sm dark:text-white"
      />
      {value && (
        <button onClick={() => onChange("")}>
          <X size={16} className="text-zinc-400" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
