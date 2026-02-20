import {
  LayoutDashboard,
  HandPlatter,
  Table as TableIcon,
  Database,
  Sparkles,
  UserCheck,
  CircleHelp,
  CookingPot,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface NavSection {
  title: string;
  defaultOpen: boolean;
  items: NavItem[];
}

export const navSections: NavSection[] = [
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
