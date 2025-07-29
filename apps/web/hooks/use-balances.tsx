import { useState, useEffect } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import apiService from "@/lib/api";
import { networks } from "@/lib/wagmi-config";
import { processPortfolioData, type PortfolioData } from "@/lib/portfolio";

const SUPPORTED_CHAINS = networks.map((network) => ({
  id: network.name === "Solana" ? "501" : network.id.toString(),
  name: network.name,
}));

export const useBalances = () => {
  const { isConnected, address } = useAppKitAccount();
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] = useState<string | null>(null);

  const fetchPortfolioData = async () => {
    if (!isConnected || !address) {
      setPortfolioData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const allBalances: Record<string, any> = {};
      const allPrices: Record<string, any> = {};
      const allMetadata: Record<string, any> = {};

      // Fetch balances for all chains first
      for (const chain of SUPPORTED_CHAINS) {
        try {
          const balances = await apiService.getWalletBalances(
            chain.id,
            address
          );
          // Check if balances exist and have content
          if (
            balances &&
            typeof balances === "object" &&
            Object.keys(balances).length > 0
          ) {
            allBalances[chain.id] = balances;
            console.log(
              `Found balances for chain ${chain.id}:`,
              Object.keys(balances).length,
              "tokens"
            );
          } else {
            console.log(`No balances found for chain ${chain.id}`);
          }
        } catch (error) {
          console.warn(
            `Failed to fetch balances for chain ${chain.id}:`,
            error
          );
        }
      }

      // Only process chains that have balances
      const chainsWithBalances = Object.keys(allBalances);
      console.log(
        `Processing ${chainsWithBalances.length} chains with balances:`,
        chainsWithBalances
      );

      if (chainsWithBalances.length === 0) {
        console.log("No balances found on any chain");
        setPortfolioData(null);
        setIsLoading(false);
        return;
      }

      // Fetch prices for all chains
      for (const chain of SUPPORTED_CHAINS) {
        const chainBalance = allBalances[chain.id];
        if (chainBalance && Object.keys(chainBalance).length > 0) {
          try {
            const tokenAddresses = Object.keys(chainBalance);
            const prices = await apiService.getTokenPrices(
              chain.id,
              tokenAddresses
            );
            allPrices[chain.id] = prices;
          } catch (error) {
            console.warn(
              `Failed to fetch prices for chain ${chain.id}:`,
              error
            );
          }
        }
      }

      // Fetch metadata for all chains (one call per chain)
      for (const chain of SUPPORTED_CHAINS) {
        const chainBalance = allBalances[chain.id];
        if (chainBalance && Object.keys(chainBalance).length > 0) {
          try {
            const allChainMetadata = await apiService.getTokenMetadata(
              chain.id
            );

            // Process each token in this chain
            for (const [tokenAddress, balance] of Object.entries(
              chainBalance
            )) {
              if (BigInt(balance as string) > BigInt(0)) {
                // Always use lowercase for lookup
                const tokenMeta = allChainMetadata[tokenAddress.toLowerCase()];
                if (tokenMeta) {
                  allMetadata[`${chain.id}-${tokenAddress}`] = {
                    assets: {
                      symbol: tokenMeta.symbol || "UNKNOWN",
                      name: tokenMeta.name || "Unknown Token",
                      decimals: tokenMeta.decimals || 18,
                      logoURI: tokenMeta.logoURI || null,
                    },
                  };
                } else {
                  allMetadata[`${chain.id}-${tokenAddress}`] = {
                    assets: {
                      symbol: "UNKNOWN",
                      name: "Unknown Token",
                      decimals: 18,
                      logoURI: null,
                    },
                  };
                }
              }
            }
          } catch (error) {
            console.warn(
              `Failed to fetch metadata for chain ${chain.id}:`,
              error
            );
            // Set default metadata for all tokens in this chain
            for (const [tokenAddress, balance] of Object.entries(
              chainBalance
            )) {
              if (BigInt(balance as string) > BigInt(0)) {
                allMetadata[`${chain.id}-${tokenAddress}`] = {
                  assets: {
                    symbol: "UNKNOWN",
                    name: "Unknown Token",
                    decimals: 18,
                    logoURI: null,
                  },
                };
              }
            }
          }
        }
      }

      // Process portfolio data
      if (Object.keys(allBalances).length > 0) {
        const processedData = await processPortfolioData(
          allBalances,
          allPrices,
          allMetadata,
          SUPPORTED_CHAINS
        );
        setPortfolioData(processedData);
      } else {
        setPortfolioData(null);
      }
    } catch (err) {
      console.error("Error fetching portfolio data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch portfolio data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Add function to filter tokens by chain
  const getFilteredTokens = () => {
    if (!portfolioData) return [];

    if (selectedChain) {
      return portfolioData.allTokens.filter(
        (token) => token.chainName === selectedChain
      );
    }

    return portfolioData.topHoldings;
  };

  // Add function to set selected chain
  const selectChain = (chainName: string | null) => {
    setSelectedChain(chainName);
  };

  const refreshData = async () => {
    await fetchPortfolioData();
  };

  useEffect(() => {
    fetchPortfolioData();
  }, [isConnected, address]);

  return {
    portfolioData,
    isLoading,
    error,
    refreshData,
    isConnected,
    selectedChain,
    selectChain,
    filteredTokens: getFilteredTokens(),
  };
};
