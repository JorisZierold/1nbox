import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, ChevronRight, Wallet } from "lucide-react";
import { usePortfolio } from "@/hooks/portfolio";
import { getChainIcon } from "@/lib/chains";
import {
  ChainBalance,
  TopHolding,
  TokenHolding,
  formatCurrency,
} from "@/lib/portfolio";
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
    error,
  } = usePortfolio();
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  // Don't show anything if not connected
  if (!isConnected) {
    return null;
  }

  // Show loading skeleton while loading
  if (isLoading) {
    return <BalancesCardSkeleton />;
  }

  // Show empty state if no portfolio data (but connected)
  if (!portfolioData) {
    return (
      <Card className="bg-card border-border backdrop-blur-sm">
        <CardContent className="py-8">
          <div className="text-center">
            <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Balances Found
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {error
                ? `Error loading balances: ${error}`
                : "No tokens found in your connected wallets."}
            </p>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Refreshing..." : "Retry"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {formatCurrency(portfolioData.totalValue)}
              </h2>
              <p className="text-sm text-muted-foreground">
                across {portfolioData.walletCount} wallet
                {portfolioData.walletCount !== 1 ? "s" : ""} •{" "}
                {portfolioData.chainCount} chain
                {portfolioData.chainCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Last updated: {portfolioData.lastUpdated}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
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
          <h3 className="text-sm font-medium text-foreground mb-3">
            Chain Distribution
          </h3>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {portfolioData.chainBalances.map(
              (chain: ChainBalance, index: number) => (
                <div
                  key={chain.name}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors cursor-pointer group flex-shrink-0 min-w-fit select-none ${
                    selectedChain === chain.name
                      ? "bg-primary/20 border-primary/50"
                      : "bg-muted/50 border-border hover:border-muted-foreground/50"
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
                        ? "text-primary"
                        : "text-foreground group-hover:text-foreground"
                    }`}
                  >
                    {chain.name}
                  </span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {chain.percentage}%
                  </span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-foreground flex-shrink-0" />
                </div>
              )
            )}
          </div>
        </div>

        {/* Top Holdings / Filtered Tokens */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
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
                  className="text-xs text-primary hover:text-primary/80 ml-auto"
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
                    <span className="text-sm font-medium text-foreground">
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
                    <span className="text-xs text-muted-foreground">
                      {holding.percentage}%
                    </span>
                  </div>
                  <span className="text-sm text-foreground">
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
