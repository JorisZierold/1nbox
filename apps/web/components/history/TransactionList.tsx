import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  History,
  RefreshCw,
  Filter,
  ChevronRight,
  CheckCheck,
  AlertCircle,
} from "lucide-react";
import { ProcessedTransaction } from "@/types";
import { TransactionItem } from "./TransactionItem";
import { TransactionDetails } from "./TransactionDetails";
import { getChainIcon } from "@/lib/chains";
import { TransactionSkeleton } from "./TransactionSkeleton";
import { useTransactionAlerts } from "@/hooks/history";

interface ChainStats {
  chainId: string;
  chainName: string;
  transactionCount: number;
  percentage: number;
}

interface TransactionListProps {
  transactions: ProcessedTransaction[];
  allTransactions: ProcessedTransaction[];
  chainStats: ChainStats[];
  isLoading: boolean;
  error?: string | null;
  onRefresh: () => void;
  selectedChainId?: string;
  onChainSelect?: (chainId: string | null) => void;
  lastUpdated?: Date | null;
}

export const TransactionList = ({
  transactions,
  allTransactions,
  chainStats,
  isLoading,
  error,
  onRefresh,
  selectedChainId,
  onChainSelect,
  lastUpdated,
}: TransactionListProps) => {
  const [selectedTransaction, setSelectedTransaction] =
    useState<ProcessedTransaction | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  // Add transaction alerts hook
  const {
    unseenCount,
    isTransactionUnseen,
    markTransactionAsSeen,
    markAllAsSeen,
  } = useTransactionAlerts(allTransactions);

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType === "all") return true;
    if (filterType === "in") return tx.direction === "in";
    if (filterType === "out") return tx.direction === "out";
    return tx.type.toLowerCase() === filterType.toLowerCase();
  });

  const uniqueTypes = Array.from(new Set(allTransactions.map((tx) => tx.type)))
    .map((type) => ({
      type,
      count: transactions.filter((tx) => tx.type === type).length,
    }))
    .sort((a, b) => b.count - a.count)
    .map((item) => item.type);

  const handleChainClick = (chainId: string) => {
    if (selectedChainId === chainId) {
      onChainSelect?.(null);
    } else {
      onChainSelect?.(chainId);
    }
  };

  // Enhanced transaction click handler
  const handleTransactionClick = async (transaction: ProcessedTransaction) => {
    if (isTransactionUnseen(transaction.id)) {
      await markTransactionAsSeen(transaction);
    }
    setSelectedTransaction(transaction);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <History className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Transaction History
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    {allTransactions.length} transactions across{" "}
                    {chainStats.length} chains
                  </p>
                  {/* Add unseen count badge */}
                  {unseenCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="text-primary border border-primary/50"
                    >
                      {unseenCount} new
                    </Badge>
                  )}
                  {/* Add error indicator */}
                  {error && (
                    <Badge variant="destructive" className="text-xs">
                      Error - data may be stale
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              {/* Button container */}
              <div className="flex flex-col gap-2 items-end">
                <div className="flex items-center gap-2">
                  {/* Last updated timestamp - only show if available */}
                  {lastUpdated && (
                    <span className="text-xs text-muted-foreground">
                      Last updated:{" "}
                      {lastUpdated.toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  )}
                  {/* Refresh button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
                    onClick={onRefresh}
                    disabled={isLoading}
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                    />
                  </Button>
                </div>

                {/* Mark all as seen button - appears under refresh */}
                {unseenCount > 0 && (
                  <Button
                    onClick={markAllAsSeen}
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs whitespace-nowrap"
                  >
                    <CheckCheck className="h-3 w-3 mr-1" />
                    Mark all as seen
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Add error banner below header */}
        {error && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <div>
                  <p className="text-sm font-medium text-destructive">
                    Failed to refresh transaction history
                  </p>
                  <p className="text-xs text-destructive/80">
                    {error}. Showing previously loaded data.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
                className="text-destructive border-destructive/50 hover:bg-destructive/10"
              >
                <RefreshCw
                  className={`h-3 w-3 mr-1 ${isLoading ? "animate-spin" : ""}`}
                />
                Retry
              </Button>
            </div>
          </div>
        )}

        <CardContent className="space-y-6">
          {/* Chain Distribution */}
          {chainStats.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Chain Distribution
              </h3>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {chainStats.map((chain) => (
                  <div
                    key={chain.chainId}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors cursor-pointer group flex-shrink-0 min-w-fit select-none ${
                      selectedChainId === chain.chainId
                        ? "bg-primary/20 border-primary/50"
                        : "bg-muted border-border hover:border-muted-foreground/50"
                    }`}
                    onClick={() => handleChainClick(chain.chainId)}
                  >
                    {/* Chain icon */}
                    <img
                      src={getChainIcon(chain.chainName)}
                      alt={chain.chainName}
                      className="w-4 h-4 object-contain flex-shrink-0"
                      title={chain.chainName}
                    />
                    <span
                      className={`text-sm font-medium whitespace-nowrap ${
                        selectedChainId === chain.chainId
                          ? "text-primary"
                          : "text-foreground group-hover:text-muted-foreground"
                      }`}
                    >
                      {chain.chainName}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {chain.transactionCount}
                    </span>
                    <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-foreground flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Filter Info */}
          {selectedChainId && (
            <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <img
                src={getChainIcon(
                  chainStats.find((c) => c.chainId === selectedChainId)
                    ?.chainName || ""
                )}
                alt=""
                className="w-4 h-4 object-contain"
              />
              <span className="text-sm text-primary">
                Showing transactions from{" "}
                {
                  chainStats.find((c) => c.chainId === selectedChainId)
                    ?.chainName
                }
              </span>
              <button
                onClick={() => onChainSelect?.(null)}
                className="text-xs text-primary hover:text-primary/80 ml-auto"
              >
                View All Chains
              </button>
            </div>
          )}

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterType("all")}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                filterType === "all"
                  ? "bg-primary/20 text-primary border border-primary/50"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              All {transactions.length}
            </Button>
            {uniqueTypes.map((type) => (
              <Button
                variant="ghost"
                size="sm"
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                  filterType === type
                    ? "bg-primary/20 text-primary border border-primary/50"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {type} {transactions.filter((tx) => tx.type === type).length}
              </Button>
            ))}
          </div>

          {/* Transaction List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {isLoading && allTransactions.length === 0 ? (
              <>
                <TransactionSkeleton />
                <TransactionSkeleton />
              </>
            ) : filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onClick={handleTransactionClick}
                  isUnseen={isTransactionUnseen(transaction.id)}
                />
              ))
            ) : allTransactions.length === 0 ? (
              // Only show "no transactions" if we truly have no data
              <div className="text-center py-8">
                <div className="text-muted-foreground">
                  {error ? (
                    <div className="space-y-3">
                      <p>Failed to load transaction history</p>
                      <Button
                        variant="outline"
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="gap-2"
                      >
                        <RefreshCw
                          className={`h-4 w-4 ${
                            isLoading ? "animate-spin" : ""
                          }`}
                        />
                        {isLoading ? "Retrying..." : "Retry"}
                      </Button>
                    </div>
                  ) : (
                    "No transactions found"
                  )}
                </div>
              </div>
            ) : (
              // Show "no transactions match filter" when we have data but filters don't match
              <div className="text-center py-8 text-muted-foreground">
                No transactions match the current filter
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details Modal */}
      <TransactionDetails
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
};
