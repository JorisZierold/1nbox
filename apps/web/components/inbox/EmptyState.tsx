import { SearchX } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-center py-16 px-6 bg-gray-900/50 rounded-lg border border-gray-800/50 backdrop-blur-sm">
      <div className="mx-auto bg-gray-800/50 rounded-full h-16 w-16 flex items-center justify-center border border-gray-700/50">
        <SearchX className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">
        No Actions Found
      </h3>
      <p className="mt-1 text-sm text-gray-400">
        There are no actions that match your current filters. Try selecting a
        different wallet or chain.
      </p>
    </div>
  );
}
