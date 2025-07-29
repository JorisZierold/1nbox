import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet } from "lucide-react";

export const BalancesCardSkeleton = () => {
  return (
    <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Wallet className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <Skeleton className="h-6 w-20 bg-gray-700" />
              <Skeleton className="h-4 w-32 mt-1 bg-gray-700" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-24 bg-gray-700" />
            <Skeleton className="h-8 w-8 rounded bg-gray-700" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Chain Distribution Skeleton */}
        <div>
          <Skeleton className="h-4 w-32 mb-3 bg-gray-700" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-lg bg-gray-700" />
            ))}
          </div>
        </div>

        {/* Top Holdings Skeleton */}
        <div>
          <Skeleton className="h-4 w-24 mb-3 bg-gray-700" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-16 bg-gray-700" />
                  <Skeleton className="h-3 w-8 bg-gray-700" />
                </div>
                <Skeleton className="h-4 w-12 bg-gray-700" />
              </div>
            ))}
          </div>
        </div>

        {/* Actions Skeleton */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Skeleton className="h-8 w-24 rounded bg-gray-700" />
          <Skeleton className="h-8 w-28 rounded bg-gray-700" />
        </div>
      </CardContent>
    </Card>
  );
};
