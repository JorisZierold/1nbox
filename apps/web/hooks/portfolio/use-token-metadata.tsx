import { useQueries } from "@tanstack/react-query";
import apiService from "@/lib/api";
import { networks } from "@/lib/wagmi-config";
import { queryKeys, STALE_TIME } from "@/lib/query-config";

const SUPPORTED_CHAINS = networks.map((network) => ({
  id: network.name === "Solana" ? "501" : network.id.toString(),
  name: network.name,
}));

/**
 * Hook for fetching and caching token metadata across all chains
 * Uses 24-hour cache since metadata rarely changes
 */
export const useTokenMetadata = () => {
  const metadataQueries = useQueries({
    queries: SUPPORTED_CHAINS.map((chain) => ({
      queryKey: queryKeys.metadata(chain.id),
      queryFn: () => apiService.getTokenMetadata(chain.id),
      staleTime: STALE_TIME.METADATA,
      retry: 2,
    })),
  });

  const isLoading = metadataQueries.some((q) => q.isLoading);
  const hasError = metadataQueries.some((q) => q.isError);

  return {
    metadataQueries,
    isLoading,
    hasError,
    supportedChains: SUPPORTED_CHAINS,
  };
};
