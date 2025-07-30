import { useState } from "react";
import { useTransactionHistory } from "@/hooks/use-transaction-history";
import { TransactionList } from "./TransactionList";

interface TransactionHistoryProps {
  limit?: number;
}

export const TransactionHistory = ({ limit = 50 }: TransactionHistoryProps) => {
  const [selectedChainId, setSelectedChainId] = useState<string | null>(null);

  const {
    transactions,
    allTransactions,
    chainStats,
    isLoading,
    error,
    refreshHistory,
    isConnected,
  } = useTransactionHistory(selectedChainId || undefined, limit);

  if (!isConnected) {
    return (
      <div className="text-center py-8 text-gray-400">
        Connect your wallet to view transaction history
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-400">
        Error loading transaction history: {error}
      </div>
    );
  }

  return (
    <TransactionList
      transactions={transactions}
      allTransactions={allTransactions}
      chainStats={chainStats}
      isLoading={isLoading}
      onRefresh={refreshHistory}
      selectedChainId={selectedChainId || undefined}
      onChainSelect={setSelectedChainId}
    />
  );
};
