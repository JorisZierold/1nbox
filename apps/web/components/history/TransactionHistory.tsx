import { useState } from "react";
import { useTransactionHistory } from "@/hooks/history";
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
    lastTransactionUpdate,
  } = useTransactionHistory(selectedChainId || undefined, limit);

  if (!isConnected) {
    return (
      <div className="text-center py-8 text-gray-400">
        Connect your wallet to view transaction history
      </div>
    );
  }

  return (
    <TransactionList
      transactions={transactions}
      allTransactions={allTransactions}
      chainStats={chainStats}
      isLoading={isLoading}
      error={error} // Pass error to TransactionList
      onRefresh={refreshHistory}
      selectedChainId={selectedChainId || undefined}
      onChainSelect={setSelectedChainId}
      lastUpdated={lastTransactionUpdate}
    />
  );
};
