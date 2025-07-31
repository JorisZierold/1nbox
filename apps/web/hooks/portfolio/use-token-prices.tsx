import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import apiService from "@/lib/api";
import { useTokenBalances } from "./use-token-balances";
import { useTokenMetadata } from "./use-token-metadata";
import { queryKeys, STALE_TIME } from "@/lib/query-config";

/**
 * Hook for fetching token prices for chains with balances
 * Uses 1-minute cache for moderately changing price data
 */
export const useTokenPrices = () => {
  const { balanceQueries, chainsWithBalances } = useTokenBalances();
  const { supportedChains } = useTokenMetadata();

  const priceQueries = useQueries({
    queries: chainsWithBalances.map((chain) => {
      const chainIndex = supportedChains.findIndex((c) => c.id === chain.id);
      const balanceQuery = balanceQueries[chainIndex];
      const balanceResult = balanceQuery?.data;
      const balanceData = balanceResult?.data;
      const tokenAddresses = balanceData ? Object.keys(balanceData) : [];

      return {
        queryKey: queryKeys.prices(chain.id, tokenAddresses),
        queryFn: async () => {
          const data = await apiService.getTokenPrices(
            chain.id,
            tokenAddresses
          );
          return {
            data,
            timestamp: new Date().toISOString(),
          };
        },
        staleTime: STALE_TIME.PRICES,
        // Only fetch prices if we have tokens AND the balance query is not loading
        enabled:
          tokenAddresses.length > 0 &&
          !balanceQuery?.isLoading &&
          balanceQuery?.isSuccess,
        retry: 1,
      };
    }),
  });

  const isLoading = priceQueries.some(
    (q) => q.isLoading && q.fetchStatus !== "idle"
  );

  const hasError = priceQueries.some((q) => q.isError);

  // Get the most recent timestamp from price queries
  const lastPriceUpdate = useMemo(() => {
    const timestamps = priceQueries
      .filter((query) => query.data?.timestamp)
      .map((query) => new Date(query.data!.timestamp))
      .sort((a, b) => b.getTime() - a.getTime());

    return timestamps.length > 0 ? timestamps[0] : null;
  }, [priceQueries.map((q) => q.data?.timestamp).join(",")]);

  return {
    priceQueries,
    isLoading,
    hasError,
    lastPriceUpdate,
  };
};
