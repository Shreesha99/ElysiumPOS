import React from "react";
import KitchenItemCard from "./KitchenItemCard";
import { KitchenTicket } from "@/components/KitchenView/hooks/useKitchenTickets";

interface Props {
  title: string;
  tickets: KitchenTicket[];
  updateItemStatus: any;
}

const KitchenColumn: React.FC<Props> = ({
  title,
  tickets,
  updateItemStatus,
}) => {
  return (
    <div className="flex flex-col gap-4 bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl p-4">
      <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
        {title} ({tickets.length})
      </h3>

      <div className="flex flex-col gap-4">
        {tickets.map((t, i) => (
          <KitchenItemCard
            key={`${t.orderId}-${i}`}
            ticket={t}
            updateItemStatus={updateItemStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default KitchenColumn;
