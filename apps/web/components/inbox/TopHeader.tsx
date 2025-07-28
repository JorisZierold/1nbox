import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function TopHeader() {
  return (
    <div className="flex items-center justify-end h-16 px-6 ">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span>Last updated: 2 min ago</span>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/** 
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-gray-900/50 border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all duration-200"
        >
          <Dot className="h-6 w-6 text-green-400 -ml-2" />
          Ethereum
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-gray-900/50 border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all duration-200"
        >
          0x7a...3f9b
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
        */}
    </div>
  );
}
