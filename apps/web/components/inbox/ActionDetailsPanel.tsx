import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { WalletIcon, Info, Lightbulb } from "lucide-react";
import type { Action } from "@/lib/types";

interface ActionDetailsPanelProps {
  selectedAction: Action | null;
  onClose: () => void;
}

export function ActionDetailsPanel({
  selectedAction,
  onClose,
}: ActionDetailsPanelProps) {
  return (
    <Sheet open={!!selectedAction} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] bg-black border-l border-gray-800/50 p-0">
        <SheetHeader className="p-6 border-b border-gray-800/50">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-full ${
                selectedAction ? selectedAction.iconBg : ""
              }`}
            >
              {selectedAction && selectedAction.icon && (
                <selectedAction.icon
                  className={`h-6 w-6 ${selectedAction.iconColor}`}
                />
              )}
            </div>
            <div>
              <SheetTitle className="text-xl font-bold text-white">
                {selectedAction ? selectedAction.title : ""}
              </SheetTitle>
              <SheetDescription className="text-gray-400">
                {selectedAction ? selectedAction.description : ""}
              </SheetDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-3">
            <Badge
              variant="outline"
              className="flex items-center gap-2 bg-gray-900/50 border-gray-700 text-gray-300"
            >
              <WalletIcon className="h-4 w-4 text-gray-400" />
              {selectedAction ? "selectedAction.walletName" : "no wallet"}
            </Badge>
          </div>
        </SheetHeader>
        <div className="p-6 space-y-6 text-sm">
          {selectedAction && selectedAction.impact && (
            <div>
              <h4 className="font-semibold text-white mb-2">Impact</h4>
              <p className="text-gray-400">{selectedAction.impact}</p>
            </div>
          )}
          <div className="bg-blue-600/10 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-300 mb-1">
                  Why this matters
                </h4>
                <p className="text-blue-200">
                  {selectedAction ? selectedAction.whyItMatters : ""}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-green-600/10 border-l-4 border-green-500 p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-300 mb-1">Pro Tip</h4>
                <p className="text-green-200">
                  {selectedAction ? selectedAction.educationalTip : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
        <SheetFooter className="p-6 border-t border-gray-800/50 bg-gray-900/50">
          <SheetClose asChild>
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:text-white"
            >
              Cancel
            </Button>
          </SheetClose>
          {selectedAction && selectedAction.buttonText && (
            <Button
              className={
                selectedAction.buttonVariant === "primary"
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25"
                  : "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25"
              }
            >
              {selectedAction.buttonText === "Review"
                ? "Confirm Action"
                : selectedAction.buttonText}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
