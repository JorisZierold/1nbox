"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useSwapStore } from "@/hooks/store/swap-store";
import { Plus, ArrowRightLeft, GitBranch, TrendingUp } from "lucide-react";

export function ActionLauncher() {
  const [open, setOpen] = useState(false);
  const openComposer = useSwapStore((state) => state.openComposer);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="w-full justify-start gap-3 h-auto py-3 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <div className="flex items-center justify-center gap-2 w-full">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Action</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start" side="right">
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-auto py-2"
            onClick={() => {
              openComposer();
              setOpen(false);
            }}
          >
            <div className="w-6 h-6 rounded bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <ArrowRightLeft className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">Quick Swap</div>
              <div className="text-xs text-muted-foreground">
                Exchange tokens instantly
              </div>
            </div>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-auto py-2 opacity-60"
            disabled
          >
            <div className="w-6 h-6 rounded bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <GitBranch className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium flex items-center gap-2">
                Bridge Assets
                <Badge variant="secondary" className="text-xs">
                  Soon
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Move between chains
              </div>
            </div>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-auto py-2 opacity-60"
            disabled
          >
            <div className="w-6 h-6 rounded bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium flex items-center gap-2">
                Loan Shifter
                <Badge variant="secondary" className="text-xs">
                  Soon
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Shift your position between protocols
              </div>
            </div>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
