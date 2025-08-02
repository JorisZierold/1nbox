import { Badge } from "../ui/badge";
import { Check, Loader2, X } from "lucide-react";
import { PendingSwap } from "@/types/swap";

interface StatusPillProps {
  status: PendingSwap["status"];
}

export function SwapStatusBadge({ status }: StatusPillProps) {
  const statusConfig = {
    pending: {
      label: "Pending",
      icon: <Loader2 className="h-3 w-3 animate-spin" />,
      className: "bg-transparent text-primary border-primary font-medium",
    },
    confirmed: {
      label: "Confirmed",
      icon: <Check className="h-3 w-3" />,
      className:
        "bg-primary text-primary-foreground border-primary font-medium",
    },
    failed: {
      label: "Failed",
      icon: <X className="h-3 w-3" />,
      className:
        "bg-transparent text-muted-foreground border-muted-foreground font-medium hover:bg-transparent",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge className={config.className}>
      <div className="flex items-center gap-1.5">
        {config.icon}
        {config.label}
      </div>
    </Badge>
  );
}
