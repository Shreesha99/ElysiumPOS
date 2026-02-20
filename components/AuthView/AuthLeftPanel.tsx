import React from "react";
import BrandIcon from "@/components/Components/BrandIcon";
import { BarChart3, Activity, Sparkles } from "lucide-react";

const AuthLeftPanel = () => {
  return (
    <div className="hidden md:flex md:w-1/2 items-center justify-center p-20 relative z-10">
      <div className="max-w-md space-y-12">
        <div className="space-y-6">
          <BrandIcon size={60} />
          <h2 className="text-4xl font-semibold dark:text-white">
            Elysium POS
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Real time operational intelligence platform for modern restaurants.
          </p>
        </div>

        <Feature
          icon={<BarChart3 size={18} />}
          title="Revenue Intelligence"
          desc="Live performance tracking and analytics."
        />
        <Feature
          icon={<Activity size={18} />}
          title="Operational Visibility"
          desc="Monitor orders, kitchen and floor sessions."
        />
        <Feature
          icon={<Sparkles size={18} />}
          title="AI Strategy Engine"
          desc="Adaptive insights tailored for operators."
        />
      </div>
    </div>
  );
};

const Feature = ({ icon, title, desc }: any) => (
  <div className="flex gap-4">
    <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-indigo-600 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h4 className="text-sm font-semibold dark:text-white">{title}</h4>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{desc}</p>
    </div>
  </div>
);

export default AuthLeftPanel;
