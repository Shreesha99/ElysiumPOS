import React from "react";

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: string;
}

const AuthField: React.FC<Props> = ({
  label,
  value,
  onChange,
  type = "text",
  error,
}) => {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 rounded-lg text-sm bg-white dark:bg-zinc-950 dark:text-white border transition outline-none focus:ring-2 focus:ring-indigo-600
        ${
          error
            ? "border-rose-500 focus:ring-rose-500"
            : "border-zinc-200 dark:border-zinc-800"
        }`}
      />

      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  );
};

export default AuthField;
