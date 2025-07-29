import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, ChevronRight, Wallet } from "lucide-react";
import { useBalances } from "@/hooks/use-balances";
import { getChainIcon } from "@/lib/chains";
import { ChainBalance, TopHolding, TokenHolding, formatCurrency } from "@/lib/portfolio";
import { BalanceActions } from "./BalanceActions";
import { BalancesCardSkeleton } from "./BalancesCardSkeleton";

export const BalancesCard = () => {
  const {
    portfolioData,
    refreshData,
    isConnected,
    isLoading,
    selectedChain,
    selectChain,
    filteredTokens,
  } = useBalances();
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (isLoading) {
    return <BalancesCardSkeleton />;
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  const handleChainClick = (chainName: string) => {
    if (selectedChain === chainName) {
      selectChain(null);
    } else {
      selectChain(chainName);
    }
  };

  if (!isConnected || !portfolioData) {
    return null;
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Wallet className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {formatCurrency(portfolioData.totalValue)}
              </h2>
              <p className="text-sm text-gray-400">
                across {portfolioData.walletCount} wallet
                {portfolioData.walletCount !== 1 ? "s" : ""} •{" "}
                {portfolioData.chainCount} chain
                {portfolioData.chainCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              Last updated: {portfolioData.lastUpdated}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800/50"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Chain Distribution */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3">
            Chain Distribution
          </h3>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {portfolioData.chainBalances.map(
              (chain: ChainBalance, index: number) => (
                <div
                  key={chain.name}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors cursor-pointer group flex-shrink-0 min-w-fit select-none ${
                    selectedChain === chain.name
                      ? "bg-blue-500/20 border-blue-500/50"
                      : "bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50"
                  }`}
                  onClick={() => handleChainClick(chain.name)}
                >
                  {/* Chain icon */}
                  <img
                    src={getChainIcon(chain.name)}
                    alt={chain.name}
                    className="w-4 h-4 object-contain flex-shrink-0"
                    title={chain.name}
                  />
                  <span
                    className={`text-sm font-medium whitespace-nowrap ${
                      selectedChain === chain.name
                        ? "text-blue-300"
                        : "text-white group-hover:text-gray-200"
                    }`}
                  >
                    {chain.name}
                  </span>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {chain.percentage}%
                  </span>
                  <ChevronRight className="h-3 w-3 text-gray-500 group-hover:text-gray-400 flex-shrink-0" />
                </div>
              )
            )}
          </div>
        </div>

        {/* Top Holdings / Filtered Tokens */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
            {selectedChain ? (
              <>
                <img
                  src={getChainIcon(selectedChain)}
                  alt={selectedChain}
                  className="w-4 h-4 object-contain"
                />
                {selectedChain} Tokens
                <button
                  onClick={() => selectChain(null)}
                  className="text-xs text-blue-400 hover:text-blue-300 ml-auto"
                >
                  View All
                </button>
              </>
            ) : (
              "Top Holdings"
            )}
          </h3>
          <div className="space-y-2">
            {filteredTokens.map(
              (holding: TokenHolding | TopHolding, index: number) => (
                <div
                  key={`${holding.symbol}-${holding.chainId}-${index}`}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">
                      {holding.symbol}
                    </span>
                    {/* Only show chain icon if viewing all holdings */}
                    {!selectedChain && (
                      <img
                        src={getChainIcon(holding.chainName)}
                        alt={holding.chainName}
                        className="w-3 h-3 object-contain flex-shrink-0"
                        title={holding.chainName}
                      />
                    )}
                    <span className="text-xs text-gray-400">
                      {holding.percentage}%
                    </span>
                  </div>
                  <span className="text-sm text-gray-300">
                    {formatCurrency(holding.value)}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        <BalanceActions portfolioData={portfolioData} />
      </CardContent>
    </Card>
  );
};
