import React from "react";
import { navSections } from "./SidebarSections";
import SidebarDesktop from "./SidebarDesktop";
import SidebarMobile from "./SidebarMobile";
import { AppUser } from "@/services/authService";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  toggleDarkMode: (value: boolean) => void;
  user: AppUser | null;
  onLogout: () => void;
  onSync: () => void;
  isSyncing: boolean;
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const [openSections, setOpenSections] = React.useState<
    Record<string, boolean>
  >(Object.fromEntries(navSections.map((s) => [s.title, s.defaultOpen])));

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <>
      <SidebarDesktop
        {...props}
        openSections={openSections}
        toggleSection={toggleSection}
      />

      <SidebarMobile
        {...props}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
    </>
  );
};

export default Sidebar;
