"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function ActionBar({
  canApprove,
  onApprove,
  onSwap,
  busy,
  disabled = false,
}: {
  canApprove: boolean;
  onApprove: () => void;
  onSwap: () => void;
  busy?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-3">
      {canApprove && (
        <Button
          variant="outline"
          disabled={busy || disabled}
          onClick={onApprove}
          className="flex-1"
        >
          {busy ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Approving...
            </>
          ) : (
            "Approve"
          )}
        </Button>
      )}
      <Button
        disabled={busy || canApprove || disabled}
        onClick={onSwap}
        className="flex-1"
      >
        {busy && !canApprove ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Swapping...
          </>
        ) : (
          "Swap"
        )}
      </Button>
    </div>
  );
}
