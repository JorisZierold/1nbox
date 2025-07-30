import { useState, useEffect } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import apiService from "@/lib/api";
import { ProcessedTransaction } from "@/lib/types";
import { processTransactionHistory } from "@/lib/history";
import { networks } from "@/lib/wagmi-config";

interface ChainStats {
  chainId: string;
  chainName: string;
  transactionCount: number;
  percentage: number;
}

export const useTransactionHistory = (
  selectedChainId?: string,
  limit?: number
) => {
  const { isConnected, address } = useAppKitAccount();
  const [allTransactions, setAllTransactions] = useState<
    ProcessedTransaction[]
  >([]);
  const [chainStats, setChainStats] = useState<ChainStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get supported chains from wagmi config
  const supportedChains = networks.map((network) => ({
    id: network.id.toString(),
    name: network.name,
  }));

  const fetchHistoryForAllChains = async () => {
    if (!isConnected || !address) {
      setAllTransactions([]);
      setChainStats([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const allTransactionsData: ProcessedTransaction[] = [];
      const chainTransactionCounts: Record<string, number> = {};

      // Fetch history for each supported chain
      const chainPromises = supportedChains.map(async (chain) => {
        try {
          const historyData = await apiService.getTransactionHistory(
            address,
            chain.id,
            limit || 50
          );

          const processedTransactions = processTransactionHistory(
            historyData.items
          );
          allTransactionsData.push(...processedTransactions);
          chainTransactionCounts[chain.id] = processedTransactions.length;

          console.log(
            `Fetched ${processedTransactions.length} transactions for ${chain.name}`
          );
        } catch (error) {
          console.warn(
            `Failed to fetch history for chain ${chain.name}:`,
            error
          );
          chainTransactionCounts[chain.id] = 0;
        }
      });

      await Promise.all(chainPromises);

      // Sort transactions by timestamp (newest first)
      allTransactionsData.sort((a, b) => b.timestamp - a.timestamp);

      setAllTransactions(allTransactionsData);

      // Calculate chain statistics
      const totalTransactions = allTransactionsData.length;
      const chainStatsData: ChainStats[] = supportedChains
        .map((chain) => ({
          chainId: chain.id,
          chainName: chain.name,
          transactionCount: chainTransactionCounts[chain.id] || 0,
          percentage:
            totalTransactions > 0
              ? Math.round(
                  ((chainTransactionCounts[chain.id] || 0) /
                    totalTransactions) *
                    100
                )
              : 0,
        }))
        .filter((stats) => stats.transactionCount > 0) // Only show chains with transactions
        .sort((a, b) => b.transactionCount - a.transactionCount); // Sort by transaction count

      setChainStats(chainStatsData);
    } catch (err: any) {
      console.error("Failed to fetch transaction history:", err);
      setError(err.message);
      setAllTransactions([]);
      setChainStats([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshHistory = async () => {
    await fetchHistoryForAllChains();
  };

  // Filter transactions by selected chain
  const filteredTransactions = selectedChainId
    ? allTransactions.filter((tx) => tx.chainId.toString() === selectedChainId)
    : allTransactions;

  useEffect(() => {
    fetchHistoryForAllChains();
  }, [isConnected, address]);

  return {
    transactions: filteredTransactions,
    allTransactions,
    chainStats,
    isLoading,
    error,
    refreshHistory,
    isConnected,
  };
};
