import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { useAppKitAccount } from "@reown/appkit/react";
import apiService from "@/lib/api";
import { queryKeys, STALE_TIME } from "@/lib/query-config";
import { networks } from "@/lib/wagmi-config";

export const useTransactionData = (limit = 50) => {
  const { isConnected, address } = useAppKitAccount();

  const supportedChains = useMemo(
    () =>
      networks.map((network) => ({
        id: network.id.toString(),
        name: network.name,
      })),
    []
  );

  const transactionQueries = useQueries({
    queries: supportedChains.map((chain) => ({
      queryKey: queryKeys.history(address!, chain.id, limit),
      queryFn: async () => {
        const data = await apiService.getTransactionHistory(
          address!,
          chain.id,
          limit
        );
        return {
          data: data.items,
          chainId: chain.id,
          chainName: chain.name,
          timestamp: new Date().toISOString(),
        };
      },
      staleTime: STALE_TIME.HISTORY, // 5 minutes
      enabled: isConnected && !!address,
      retry: 1,
    })),
  });

  // Chains that have transaction data
  const chainsWithTransactions = useMemo(() => {
    return supportedChains.filter((chain, index) => {
      const result = transactionQueries[index]?.data;
      return result?.data && result.data.length > 0;
    });
  }, [transactionQueries.map((q) => q.data).join(","), supportedChains]);

  const isLoading = transactionQueries.some(
    (q) => (q.isLoading && q.fetchStatus !== "idle") || q.isFetching
  );

  const hasError = transactionQueries.some((q) => q.isError);

  const hasAnyTransactionData = transactionQueries.some(
    (query) => query.data?.data && query.data.data.length > 0
  );

  // Get the most recent timestamp from transaction queries
  const lastTransactionUpdate = useMemo(() => {
    const timestamps = transactionQueries
      .filter((query) => query.data?.timestamp)
      .map((query) => new Date(query.data!.timestamp))
      .sort((a, b) => b.getTime() - a.getTime());

    return timestamps.length > 0 ? timestamps[0] : null;
  }, [transactionQueries.map((q) => q.data?.timestamp).join(",")]);

  return {
    transactionQueries,
    supportedChains,
    chainsWithTransactions,
    isLoading,
    hasError,
    hasAnyTransactionData,
    isConnected,
    address,
    lastTransactionUpdate,
  };
};
