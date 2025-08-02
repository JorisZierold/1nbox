"use client";

import { ChevronRight } from "lucide-react";
import { getChainIcon, getChainName } from "@/lib/chains";
import { useAppKitNetwork } from "@reown/appkit/react";
import { useTokenMetadata } from "@/hooks/portfolio/use-token-metadata";
import { usePortfolio } from "@/hooks/portfolio";
import { networks } from "@/lib/wagmi-config";

interface ChainOption {
  chainId: string;
  chainName: string;
  tokenCount: number;
  isSelected: boolean;
}

interface SwapChainSelectorProps {
  onChainSelect: (chainId: number) => void;
  isLoading?: boolean;
}

export function SwapChainSelector({
  onChainSelect,
  isLoading,
}: SwapChainSelectorProps) {
  const { caipNetworkId, switchNetwork } = useAppKitNetwork();
  const currentChainId = caipNetworkId
    ? parseInt(caipNetworkId.split(":")[1])
    : 1;

  const { supportedChains, metadataQueries } = useTokenMetadata();
  const { portfolioData } = usePortfolio();

  // Build chain options with portfolio-based ordering
  const chainOptions: ChainOption[] = (() => {
    const chainOptionsMap = new Map<string, ChainOption>();

    // First, create all supported chain options
    supportedChains.forEach((chain, index) => {
      const chainId = parseInt(chain.id);
      const chainName = getChainName(chainId);
      const metadataQuery = metadataQueries[index];
      const tokenCount = metadataQuery?.data
        ? Object.keys(metadataQuery.data).length
        : 0;

      chainOptionsMap.set(chain.id, {
        chainId: chain.id,
        chainName,
        tokenCount,
        isSelected: chainId === currentChainId,
      });
    });

    // If we have portfolio data, order by balance (same as BalancesCard)
    if (portfolioData?.chainBalances) {
      const orderedChains: ChainOption[] = [];

      // Add chains with balances first (in balance order)
      portfolioData.chainBalances.forEach((chainBalance) => {
        const chainOption = Array.from(chainOptionsMap.values()).find(
          (option) => option.chainName === chainBalance.name
        );
        if (chainOption) {
          orderedChains.push(chainOption);
          chainOptionsMap.delete(chainOption.chainId);
        }
      });

      // Add remaining chains (those without balances)
      orderedChains.push(...Array.from(chainOptionsMap.values()));

      return orderedChains;
    }

    // Fallback to original order if no portfolio data
    return Array.from(chainOptionsMap.values());
  })();

  const handleChainClick = async (chainId: string) => {
    const numericChainId = parseInt(chainId);

    if (numericChainId === currentChainId) return;

    try {
      // Find the correct network object from wagmi config
      const targetNetwork = networks.find(
        (network) => network.id === numericChainId
      );

      if (!targetNetwork) {
        console.error("Network not found:", numericChainId);
        return;
      }

      // Switch wallet network using the actual network object
      switchNetwork(targetNetwork);

      // Notify parent component
      onChainSelect(numericChainId);
    } catch (error) {
      console.error("Failed to switch network:", error);
    }
  };

  if (chainOptions.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Select Network
      </h3>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {chainOptions.map((chain) => (
          <div
            key={chain.chainId}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors cursor-pointer group flex-shrink-0 min-w-fit select-none ${
              chain.isSelected
                ? "bg-primary/20 border-primary/50"
                : "bg-muted border-border hover:border-muted-foreground/50"
            } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
            onClick={() => handleChainClick(chain.chainId)}
          >
            {/* Chain icon */}
            <img
              src={getChainIcon(chain.chainName)}
              alt={chain.chainName}
              className="w-4 h-4 object-contain flex-shrink-0"
              title={chain.chainName}
            />
            <span
              className={`text-sm font-medium whitespace-nowrap ${
                chain.isSelected
                  ? "text-primary"
                  : "text-foreground group-hover:text-muted-foreground"
              }`}
            >
              {chain.chainName}
            </span>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {chain.tokenCount} tokens
            </span>
            <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-foreground flex-shrink-0" />
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
          <span>Switching network...</span>
        </div>
      )}
    </div>
  );
}
