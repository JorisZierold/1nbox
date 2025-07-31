import { QueryClient } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

// Query key factories
export const queryKeys = {
  balances: (chainId: string, address: string) =>
    ["balances", chainId, address] as const,
  prices: (chainId: string, tokens: string[]) =>
    ["prices", chainId, tokens.sort()] as const,
  metadata: (chainId: string) => ["metadata", chainId] as const,
  history: (address: string, chainId: string, limit: number) =>
    ["history", address, chainId, limit] as const,
};

// Cache time constants
export const STALE_TIME = {
  BALANCES: 60 * 1000, // 60 seconds
  PRICES: 10 * 60 * 1000, // 10 minutes
  METADATA: 24 * 60 * 60 * 1000, // 24 hours
  HISTORY: 5 * 60 * 1000, // 5 minutes
} as const;

// QueryClient configuration
export const queryClientConfig = {
  defaultOptions: {
    queries: {
      // Set gcTime to 25 hours (higher than our 24h metadata cache)
      gcTime: 5 * 60 * 1000, // 5 minutes (reasonable for most data)
      // Enable stale-while-revalidate for better UX
      staleTime: 0, // Individual queries will override this
      // Retry failed requests
      retry: (failureCount: number, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) return false;
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
    },
  },
};

// Persister configuration
export const persisterConfig = {
  storage: typeof window !== "undefined" ? window.localStorage : undefined,
  key: "1nbox-query-cache",
  throttleTime: 1000, // Only persist changes every 1 second
};

// Persistence options
export const persistOptions = {
  // Cache for 24 hours (same as metadata)
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
  // Cache busting - increment this to invalidate all cached data
  buster: "v1.0.0",
  // Only persist successful queries
  dehydrateOptions: {
    shouldDehydrateQuery: (query: any) => {
      // Only cache queries that have data and no errors
      return query.state.status === "success" && query.state.data !== undefined;
    },
  },
};

// Create QueryClient instance
export const createQueryClient = () => new QueryClient(queryClientConfig);

// Create persister instance
export const createPersister = () =>
  createAsyncStoragePersister(persisterConfig);

// Persistence event handlers
export const persistenceHandlers = {
  onSuccess: () => {
    console.log("💾 Query cache restored from localStorage");
  },
  onError: () => {
    console.warn("⚠️ Failed to restore query cache");
  },
};
