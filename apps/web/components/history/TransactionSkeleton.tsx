import { Skeleton } from "../ui/skeleton";

export const TransactionSkeleton = () => (
  <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
    {/* Icon skeleton */}
    <Skeleton className="w-8 h-8 rounded-full" />

    <div className="flex-1 space-y-2">
      {/* Title and amount row */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Details row */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  </div>
);
