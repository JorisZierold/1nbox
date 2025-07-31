import { useState, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ProcessedTransaction } from "@/types";
import { processTransactionHistory } from "@/lib/history";
import { useTransactionData } from "./use-transaction-data";
import { useDebounce } from "../use-debounce";

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
  const queryClient = useQueryClient();

  const {
    transactionQueries,
    supportedChains,
    chainsWithTransactions,
    hasAnyTransactionData,
    isConnected,
    address,
    lastTransactionUpdate,
    isLoading: dataLoading,
    hasError: dataError,
  } = useTransactionData(limit);

  const [allTransactions, setAllTransactions] = useState<
    ProcessedTransaction[]
  >([]);
  const [chainStats, setChainStats] = useState<ChainStats[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  const debouncedLastUpdate = useDebounce(lastTransactionUpdate, 800);

  const isLoading =
    dataLoading || hasAnyTransactionData === false || isProcessing;

  const error =
    refreshError ||
    processingError ||
    (dataError ? "Failed to load transaction data" : null);

  const isDataReady =
    isConnected &&
    address &&
    hasAnyTransactionData &&
    !transactionQueries.some((q) => q.isLoading && q.fetchStatus !== "idle");

  useEffect(() => {
    if (!isConnected || !address) {
      setAllTransactions([]);
      setChainStats([]);
      setIsProcessing(false);
      return;
    }

    if (!isDataReady) {
      return;
    }

    processTransactionData();
  }, [
    isConnected,
    address,
    isDataReady,
    chainsWithTransactions.length,
    transactionQueries.map((q) => q.status).join(","),
    debouncedLastUpdate?.getTime(),
  ]);

  const processTransactionData = async () => {
    try {
      setIsProcessing(true);
      setProcessingError(null);

      const allTransactionsData: ProcessedTransaction[] = [];
      const chainTransactionCounts: Record<string, number> = {};

      // Process transaction data from queries
      transactionQueries.forEach((query, index) => {
        const chain = supportedChains[index];
        const transactionResult = query.data;
        const rawTransactions = transactionResult?.data;

        if (rawTransactions && rawTransactions.length > 0) {
          const processedTransactions =
            processTransactionHistory(rawTransactions);
          allTransactionsData.push(...processedTransactions);
          chainTransactionCounts[chain.id] = processedTransactions.length;

          console.log(
            `Processed ${processedTransactions.length} transactions for ${chain.name}`
          );
        } else {
          chainTransactionCounts[chain.id] = 0;
        }
      });

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
        .filter((stats) => stats.transactionCount > 0)
        .sort((a, b) => b.transactionCount - a.transactionCount);

      setChainStats(chainStatsData);
    } catch (err) {
      console.error("❌ Error processing transaction data:", err);
      setProcessingError(
        err instanceof Error
          ? err.message
          : "Failed to process transaction data"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter transactions by selected chain
  const filteredTransactions = useMemo(() => {
    if (!selectedChainId) return allTransactions;
    return allTransactions.filter(
      (tx) => tx.chainId.toString() === selectedChainId
    );
  }, [allTransactions, selectedChainId]);

  const refreshHistory = async () => {
    try {
      setRefreshError(null);

      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "history",
      });

      console.log("🔄 Transaction history refresh initiated");
    } catch (error) {
      console.error("❌ Error refreshing transaction history:", error);
      setRefreshError("Failed to refresh transaction history");
    }
  };

  // Timeout safety mechanism
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading) {
      timeoutId = setTimeout(() => {
        console.warn("⏰ Transaction loading timeout reached (30s)");
        setRefreshError("Loading timeout - please try refreshing");
      }, 30000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading]);

  return {
    // Core data
    transactions: filteredTransactions,
    allTransactions,
    chainStats,
    lastTransactionUpdate: debouncedLastUpdate,

    // States
    isLoading,
    error,
    isConnected,

    // Actions
    refreshHistory,

    // Debug info
    debug: {
      dataFetching: {
        loading: dataLoading,
        error: dataError,
      },
      processing: {
        active: isProcessing,
        error: processingError,
        dataReady: isDataReady,
      },
      stats: {
        totalTransactions: allTransactions.length,
        filteredTransactions: filteredTransactions.length,
        chainsWithData: chainsWithTransactions.length,
      },
      timestamps: {
        lastUpdate: debouncedLastUpdate?.toISOString(),
        rawLastUpdate: lastTransactionUpdate?.toISOString(),
      },
    },
  };
};
