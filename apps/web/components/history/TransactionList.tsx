import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, RefreshCw, Filter, ChevronRight } from "lucide-react";
import { ProcessedTransaction } from "@/lib/types";
import { TransactionItem } from "./TransactionItem";
import { TransactionDetails } from "./TransactionDetails";
import { getChainIcon } from "@/lib/chains";
import { TransactionSkeleton } from "./TransactionSkeleton";

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
  onRefresh: () => void;
  selectedChainId?: string;
  onChainSelect?: (chainId: string | null) => void;
}

export const TransactionList = ({
  transactions,
  allTransactions,
  chainStats,
  isLoading,
  onRefresh,
  selectedChainId,
  onChainSelect,
}: TransactionListProps) => {
  const [selectedTransaction, setSelectedTransaction] =
    useState<ProcessedTransaction | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType === "all") return true;
    if (filterType === "in") return tx.direction === "in";
    if (filterType === "out") return tx.direction === "out";
    return tx.type.toLowerCase() === filterType.toLowerCase();
  });

  const uniqueTypes = Array.from(new Set(allTransactions.map((tx) => tx.type)));

  const handleChainClick = (chainId: string) => {
    if (selectedChainId === chainId) {
      onChainSelect?.(null);
    } else {
      onChainSelect?.(chainId);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <History className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Transaction History
                </h3>
                <p className="text-sm text-gray-400">
                  {allTransactions.length} transactions across{" "}
                  {chainStats.length} chains
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800/50"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Chain Distribution */}
          {chainStats.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-3">
                Chain Distribution
              </h3>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {chainStats.map((chain) => (
                  <div
                    key={chain.chainId}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors cursor-pointer group flex-shrink-0 min-w-fit select-none ${
                      selectedChainId === chain.chainId
                        ? "bg-purple-500/20 border-purple-500/50"
                        : "bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50"
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
                          ? "text-purple-300"
                          : "text-white group-hover:text-gray-200"
                      }`}
                    >
                      {chain.chainName}
                    </span>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {chain.transactionCount}
                    </span>
                    <ChevronRight className="h-3 w-3 text-gray-500 group-hover:text-gray-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Filter Info */}
          {selectedChainId && (
            <div className="flex items-center gap-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <img
                src={getChainIcon(
                  chainStats.find((c) => c.chainId === selectedChainId)
                    ?.chainName || ""
                )}
                alt=""
                className="w-4 h-4 object-contain"
              />
              <span className="text-sm text-purple-300">
                Showing transactions from{" "}
                {
                  chainStats.find((c) => c.chainId === selectedChainId)
                    ?.chainName
                }
              </span>
              <button
                onClick={() => onChainSelect?.(null)}
                className="text-xs text-purple-400 hover:text-purple-300 ml-auto"
              >
                View All Chains
              </button>
            </div>
          )}

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                filterType === "all"
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/50"
                  : "bg-gray-800/50 text-gray-400 hover:text-white"
              }`}
            >
              All ({transactions.length})
            </button>
            <button
              onClick={() => setFilterType("in")}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                filterType === "in"
                  ? "bg-green-500/20 text-green-300 border border-green-500/50"
                  : "bg-gray-800/50 text-gray-400 hover:text-white"
              }`}
            >
              Received (
              {transactions.filter((tx) => tx.direction === "in").length})
            </button>
            <button
              onClick={() => setFilterType("out")}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                filterType === "out"
                  ? "bg-red-500/20 text-red-300 border border-red-500/50"
                  : "bg-gray-800/50 text-gray-400 hover:text-white"
              }`}
            >
              Sent ({transactions.filter((tx) => tx.direction === "out").length}
              )
            </button>
            {uniqueTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                  filterType === type
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/50"
                    : "bg-gray-800/50 text-gray-400 hover:text-white"
                }`}
              >
                {type} ({transactions.filter((tx) => tx.type === type).length})
              </button>
            ))}
          </div>

          {/* Transaction List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {isLoading ? (
              <>
                <TransactionSkeleton />
                <TransactionSkeleton />
              </>
            ) : filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onClick={setSelectedTransaction}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                No transactions found
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
