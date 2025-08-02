"use client";

import { useMemo } from "react";
import { useTokenMetadata } from "@/hooks/portfolio/use-token-metadata";
import { useTokenBalances } from "@/hooks/portfolio/use-token-balances";
import { fromUnits } from "@/lib/units";
import { SwapToken } from "@/types/swap";

export const useSwapTokens = (chainId: number) => {
  const {
    metadataQueries,
    isLoading: metadataLoading,
    supportedChains,
  } = useTokenMetadata();
  const { balanceQueries, isConnected } = useTokenBalances();

  const tokens = useMemo(() => {
    // Find the index for this chain
    const chainIndex = supportedChains.findIndex(
      (chain) => parseInt(chain.id) === chainId
    );

    if (chainIndex === -1) return [];

    const metadataQuery = metadataQueries[chainIndex];
    if (!metadataQuery?.data) return [];

    // Get balance query for same chain index
    const balanceQuery = isConnected ? balanceQueries[chainIndex] : null;

    // Handle potential API inconsistency
    let actualBalanceData: Record<string, any> = {};

    if (balanceQuery?.data) {
      // If data is wrapped in { data: ..., timestamp: ... }
      if (balanceQuery.data.data) {
        actualBalanceData = balanceQuery.data.data;
      }
      // If data is direct Record<string, string>
      else if (typeof balanceQuery.data === "object") {
        actualBalanceData = balanceQuery.data;
      }
    }

    // Convert 1inch metadata to our Token format
    const swapTokens: SwapToken[] = Object.entries(metadataQuery.data).map(
      ([address, metadata]) => {
        const tokenBalance = actualBalanceData[address];

        // Fix: Check if balance is actually > 0, not just truthy
        const hasBalance =
          tokenBalance && Number(tokenBalance.balance || tokenBalance) > 0;

        // Format balance for display with high precision to avoid rounding errors
        let formattedBalance: string | undefined;
        if (hasBalance) {
          try {
            // Handle both TokenBalance object and direct string value
            const rawBalance =
              typeof tokenBalance === "string"
                ? tokenBalance
                : tokenBalance.balance;
            if (rawBalance && rawBalance !== "0") {
              const balanceNumber = fromUnits(rawBalance, metadata.decimals);
              const balance = parseFloat(balanceNumber);

              // Use high precision
              // TODO revisit this part, as it caused rounding issue in the past
              if (balance < 0.001) {
                formattedBalance = balance.toFixed(18).replace(/\.?0+$/, ""); // Remove trailing zeros
              } else {
                formattedBalance = balance.toFixed(18).replace(/\.?0+$/, ""); // Remove trailing zeros
              }
            }
          } catch (e) {
            console.warn(`Error formatting balance for ${metadata.symbol}:`, e);
            formattedBalance = undefined;
          }
        }

        return {
          address,
          symbol: metadata.symbol,
          name: metadata.name,
          decimals: metadata.decimals,
          logoURI: metadata.logoURI,
          isNative: false,
          hasBalance,
          balance: formattedBalance,
        };
      }
    );

    // Sort: tokens with balance first, then by symbol
    return swapTokens.sort((a, b) => {
      if (a.hasBalance && !b.hasBalance) return -1;
      if (!a.hasBalance && b.hasBalance) return 1;
      return a.symbol.localeCompare(b.symbol);
    });
  }, [
    chainId,
    isConnected,
    metadataQueries.map((q) => q.data).join(","), // Stable dependency
    balanceQueries.map((q) => q.data?.timestamp).join(","), // Stable dependency
  ]);

  // Get popular tokens for defaults (WETH, USDC, USDT, etc.)
  const defaultTokens = useMemo(() => {
    const popularSymbols = ["WETH", "USDC", "USDT", "ETH", "WBTC"];
    return tokens
      .filter((token) =>
        popularSymbols.some((symbol) =>
          token.symbol.toUpperCase().includes(symbol)
        )
      )
      .slice(0, 2); // Take first 2 popular tokens
  }, [tokens]);

  return {
    tokens,
    defaultTokens,
    isLoading: metadataLoading,
    hasTokens: tokens.length > 0,
  };
};
