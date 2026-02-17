import React, { useState, useMemo } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import SearchBar from "@/components/POSView/SearchBar";
import { ChefHat } from "lucide-react";
import { useKitchenTickets } from "@/components/KitchenView/hooks/useKitchenTickets";
import KitchenColumn from "./KitchenColumn";
import KitchenFiltersBar from "./KitchenFiltersBar";
import { Order } from "@/types";

interface Props {
  orders: Order[];
  updateItemStatus: any;
}

const KitchenView: React.FC<Props> = ({ orders, updateItemStatus }) => {
  const [search, setSearch] = useState("");
  const [station, setStation] = useState("All");
  const [status, setStatus] = useState("All");
  const [urgency, setUrgency] = useState("All");

  const tickets = useKitchenTickets(orders, station);

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      if (station !== "All" && t.station !== station) return false;
      if (status !== "All" && t.status !== status) return false;

      const minutes = (Date.now() - t.createdAt.toDate().getTime()) / 60000;

      if (urgency === "10+" && minutes < 10) return false;
      if (urgency === "15+" && minutes < 15) return false;

      if (
        search &&
        !`${t.tableRef} ${t.name}`.toLowerCase().includes(search.toLowerCase())
      )
        return false;

      return true;
    });
  }, [tickets, station, status, urgency, search]);

  const queued = filtered.filter((t) => t.status === "Queued");
  const preparing = filtered.filter((t) => t.status === "Preparing");
  const ready = filtered.filter((t) => t.status === "Ready");

  return (
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
      <SectionHeader
        defaultExpanded={false}
        icon={<ChefHat size={22} />}
        title="Kitchen Board"
        subtitle="Live preparation flow and execution control"
        searchContent={<SearchBar value={search} onChange={setSearch} />}
        bottomContent={
          <KitchenFiltersBar
            station={station}
            setStation={setStation}
            status={status}
            setStatus={setStatus}
            urgency={urgency}
            setUrgency={setUrgency}
            resultCount={filtered.length}
          />
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-6 md:grid-cols-3">
          <KitchenColumn
            title="Queued"
            tickets={queued}
            updateItemStatus={updateItemStatus}
          />
          <KitchenColumn
            title="Preparing"
            tickets={preparing}
            updateItemStatus={updateItemStatus}
          />
          <KitchenColumn
            title="Ready"
            tickets={ready}
            updateItemStatus={updateItemStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default KitchenView;
