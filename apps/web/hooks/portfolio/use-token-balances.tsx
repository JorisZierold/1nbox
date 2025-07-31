import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { useAppKitAccount } from "@reown/appkit/react";
import apiService from "@/lib/api";
import { useTokenMetadata } from "./use-token-metadata";
import { queryKeys, STALE_TIME } from "@/lib/query-config";

/**
 * Hook for fetching wallet balances across all chains
 * Uses 60-second cache for frequently changing balance data
 */
export const useTokenBalances = () => {
  const { isConnected, address } = useAppKitAccount();
  const { supportedChains } = useTokenMetadata();

  const balanceQueries = useQueries({
    queries: supportedChains.map((chain) => ({
      queryKey: queryKeys.balances(chain.id, address!),
      queryFn: async () => {
        const data = await apiService.getWalletBalances(chain.id, address!);
        return {
          data,
          timestamp: new Date().toISOString(),
        };
      },
      staleTime: STALE_TIME.BALANCES,
      enabled: isConnected && !!address,
      retry: 1,
    })),
  });

  // Determine chains with balances
  const chainsWithBalances = useMemo(() => {
    return supportedChains.filter((chain, index) => {
      const balanceResult = balanceQueries[index]?.data;
      const balanceData = balanceResult?.data;
      return balanceData && Object.keys(balanceData).length > 0;
    });
  }, [balanceQueries.map((q) => q.data).join(","), supportedChains]);

  const isLoading = balanceQueries.some(
    (q) => q.isLoading && q.fetchStatus !== "idle"
  );

  const hasError = balanceQueries.some((q) => q.isError);

  const hasAnyBalanceData = balanceQueries.some(
    (query) => query.data?.data && Object.keys(query.data.data).length > 0
  );

  // Get the most recent timestamp from balance queries
  const lastBalanceUpdate = useMemo(() => {
    const timestamps = balanceQueries
      .filter((query) => query.data?.timestamp)
      .map((query) => new Date(query.data!.timestamp))
      .sort((a, b) => b.getTime() - a.getTime());

    return timestamps.length > 0 ? timestamps[0] : null;
  }, [balanceQueries.map((q) => q.data?.timestamp).join(",")]);

  return {
    balanceQueries,
    chainsWithBalances,
    isLoading,
    hasError,
    hasAnyBalanceData,
    isConnected,
    address,
    lastBalanceUpdate,
  };
};
