import { useState, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { processPortfolioData, type PortfolioData } from "@/lib/portfolio";
import { useTokenMetadata } from "./use-token-metadata";
import { useTokenBalances } from "./use-token-balances";
import { useTokenPrices } from "./use-token-prices";
import { useDebounce } from "../use-debounce";

/**
 * Main portfolio hook - everything components need in one place
 *
 * Features:
 * - Data orchestration (metadata, balances, prices)
 * - Data processing (raw data → portfolio format)
 * - UI state management (filtering, chain selection)
 * - Error handling and loading states
 * - Refresh functionality with cache invalidation
 * - Debounced timestamps to prevent UI jumping
 */
export const usePortfolio = () => {
  const queryClient = useQueryClient();

  const {
    metadataQueries,
    supportedChains,
    isLoading: metadataLoading,
    hasError: metadataError,
  } = useTokenMetadata();

  const {
    balanceQueries,
    chainsWithBalances,
    hasAnyBalanceData,
    isConnected,
    address,
    lastBalanceUpdate,
    isLoading: balancesLoading,
    hasError: balancesError,
  } = useTokenBalances();

  const {
    priceQueries,
    lastPriceUpdate,
    isLoading: pricesLoading,
    hasError: pricesError,
  } = useTokenPrices();

  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] = useState<string | null>(null);

  // Calculate the most recent timestamp from all data sources
  const lastDataUpdate = useMemo(() => {
    const timestamps = [lastBalanceUpdate, lastPriceUpdate].filter(Boolean);
    if (timestamps.length === 0) return null;

    return timestamps.sort((a, b) => b!.getTime() - a!.getTime())[0];
  }, [lastBalanceUpdate, lastPriceUpdate]);

  const debouncedLastDataUpdate = useDebounce(lastDataUpdate, 800);

  const isLoading =
    metadataLoading ||
    hasAnyBalanceData === false ||
    balancesLoading ||
    pricesLoading ||
    isProcessing;

  const error =
    refreshError ||
    processingError ||
    (metadataError ? "Failed to load token metadata" : null) ||
    (balancesError ? "Failed to load wallet balances" : null) ||
    (pricesError ? "Failed to load token prices" : null);

  const isDataReady =
    isConnected &&
    address &&
    hasAnyBalanceData &&
    !balanceQueries.some((q) => q.isLoading && q.fetchStatus !== "idle") &&
    !priceQueries.some((q) => q.isLoading && q.fetchStatus !== "idle");

  useEffect(() => {
    if (!isConnected || !address) {
      setPortfolioData(null);
      setIsProcessing(false);
      return;
    }

    if (!isDataReady) {
      return;
    }

    processData();
  }, [
    isConnected,
    address,
    isDataReady,
    chainsWithBalances.length,
    balanceQueries.map((q) => q.status).join(","),
    debouncedLastDataUpdate?.getTime(),
  ]);

  const processData = async () => {
    try {
      setIsProcessing(true);
      setProcessingError(null);

      // Extract balance data
      const allBalances: Record<string, any> = {};
      balanceQueries.forEach((query, index) => {
        const chain = supportedChains[index];
        const balanceResult = query.data;
        const balanceData = balanceResult?.data;

        if (balanceData && Object.keys(balanceData).length > 0) {
          allBalances[chain.id] = balanceData;
        }
      });

      if (Object.keys(allBalances).length === 0) {
        setPortfolioData(null);
        setIsProcessing(false);
        return;
      }

      // Extract price data
      const allPrices: Record<string, any> = {};
      priceQueries.forEach((query, index) => {
        const chain = chainsWithBalances[index];
        const priceResult = query.data;
        const priceData = priceResult?.data;

        if (priceData && chain) {
          allPrices[chain.id] = priceData;
        }
      });

      // Extract metadata
      const allMetadata: Record<string, any> = {};
      metadataQueries.forEach((query, index) => {
        const chain = supportedChains[index];
        const chainBalance = allBalances[chain.id];

        if (chainBalance && query.data) {
          const allChainMetadata = query.data;

          for (const [tokenAddress, balance] of Object.entries(chainBalance)) {
            if (BigInt(balance as string) > BigInt(0)) {
              const tokenMeta = allChainMetadata[tokenAddress.toLowerCase()];
              allMetadata[`${chain.id}-${tokenAddress}`] = {
                assets: {
                  symbol: tokenMeta?.symbol || "UNKNOWN",
                  name: tokenMeta?.name || "Unknown Token",
                  decimals: tokenMeta?.decimals || 18,
                  logoURI: tokenMeta?.logoURI || null,
                },
              };
            }
          }
        }
      });

      const processedData = await processPortfolioData(
        allBalances,
        allPrices,
        allMetadata,
        supportedChains,
        debouncedLastDataUpdate
      );

      setPortfolioData(processedData);
    } catch (err) {
      console.error("❌ Error processing portfolio data:", err);
      setProcessingError(
        err instanceof Error ? err.message : "Failed to process portfolio data"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredTokens = useMemo(() => {
    if (!portfolioData) return [];

    if (selectedChain) {
      return portfolioData.allTokens.filter(
        (token) => token.chainName === selectedChain
      );
    }

    return portfolioData.topHoldings;
  }, [portfolioData, selectedChain]);

  const availableChains = useMemo(() => {
    if (!portfolioData) return [];

    const chains = new Set(
      portfolioData.allTokens.map((token) => token.chainName)
    );

    return Array.from(chains).sort();
  }, [portfolioData]);

  const refreshData = async () => {
    try {
      setRefreshError(null);

      await queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0];
          return key === "balances" || key === "prices";
        },
      });

      console.log("🔄 Portfolio data refresh initiated");
    } catch (error) {
      console.error("❌ Error refreshing portfolio data:", error);
      setRefreshError("Failed to refresh data - please try again");
    }
  };

  // Timeout safety mechanism to prevent endless loading
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading) {
      timeoutId = setTimeout(() => {
        console.warn("⏰ Portfolio loading timeout reached (30s)");
        setRefreshError("Loading timeout - please try refreshing");
      }, 30000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading]);

  const selectChain = (chainName: string | null) => {
    setSelectedChain(chainName);
  };

  return {
    // Core data
    portfolioData,
    lastDataUpdate: debouncedLastDataUpdate,

    // States
    isLoading,
    error,
    isConnected,
    address,

    // Actions
    refreshData,
    selectChain,

    // UI filtering
    selectedChain,
    filteredTokens,
    availableChains,

    // Debug info
    debug: {
      dataFetching: {
        metadata: metadataLoading,
        balances: balancesLoading,
        prices: pricesLoading,
      },
      errors: {
        metadata: metadataError,
        balances: balancesError,
        prices: pricesError,
        processing: processingError,
        refresh: refreshError,
      },
      processing: {
        active: isProcessing,
        dataReady: isDataReady,
      },
      filtering: {
        selectedChain,
        totalTokens: portfolioData?.allTokens.length || 0,
        filteredCount: filteredTokens.length,
        availableChains: availableChains.length,
      },
      timestamps: {
        lastDataUpdate: debouncedLastDataUpdate?.toISOString(),
        rawLastDataUpdate: lastDataUpdate?.toISOString(),
      },
    },
  };
};
