import { useState, useEffect, useMemo } from "react";
import { processPortfolioData, type PortfolioData } from "@/lib/portfolio";
import { useTokenMetadata } from "./use-token-metadata";
import { useTokenBalances } from "./use-token-balances";
import { useTokenPrices } from "./use-token-prices";
import { useDebounce } from "../use-debounce";

/**
 * Hook for processing raw balance, price, and metadata into portfolio format
 * Handles the complex data transformation and aggregation
 */
export const useTokenPortfolio = () => {
  const { metadataQueries, supportedChains } = useTokenMetadata();
  const {
    balanceQueries,
    chainsWithBalances,
    hasAnyBalanceData,
    isConnected,
    address,
    lastBalanceUpdate,
  } = useTokenBalances();
  const { priceQueries, lastPriceUpdate } = useTokenPrices();

  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);

  // Calculate the most recent timestamp from all data sources
  const lastDataUpdate = useMemo(() => {
    const timestamps = [lastBalanceUpdate, lastPriceUpdate].filter(Boolean);
    if (timestamps.length === 0) return null;

    return timestamps.sort((a, b) => b!.getTime() - a!.getTime())[0];
  }, [lastBalanceUpdate, lastPriceUpdate]);

  // Debounced version of lastDataUpdate to prevent UI jumping
  // 800ms provides good balance between stability and responsiveness
  const debouncedLastDataUpdate = useDebounce(lastDataUpdate, 800);

  // Check if all required data is ready for processing
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
    debouncedLastDataUpdate?.getTime(), // Use debounced timestamp to prevent excessive re-processing
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

      // Extract metadata and process tokens
      const allMetadata: Record<string, any> = {};
      metadataQueries.forEach((query, index) => {
        const chain = supportedChains[index];
        const chainBalance = allBalances[chain.id];

        if (chainBalance && query.data) {
          const allChainMetadata = query.data;

          // Process each token in this chain
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

      // Process portfolio data using the debounced timestamp for stable UI
      const processedData = await processPortfolioData(
        allBalances,
        allPrices,
        allMetadata,
        supportedChains,
        debouncedLastDataUpdate
      );

      setPortfolioData(processedData);
    } catch (err) {
      console.error("Error processing portfolio data:", err);
      setProcessingError(
        err instanceof Error ? err.message : "Failed to process portfolio data"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    portfolioData,
    isProcessing,
    processingError,
    processData,
    lastDataUpdate: debouncedLastDataUpdate, // Return debounced version for stable UI
    rawLastDataUpdate: lastDataUpdate, // Keep raw version for debugging
  };
};
