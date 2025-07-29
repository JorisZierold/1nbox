import { AlertTriangle, Coins, Zap } from "lucide-react";

export interface ChainBalance {
  name: string;
  percentage: number;
  value: number;
  anomalies: ("gas_low" | "dust" | "concentration")[];
}

export interface TopHolding {
  symbol: string;
  value: number;
  percentage: number;
  chainId: string;
  chainName: string;
}

export interface TokenHolding {
  symbol: string;
  value: number;
  percentage: number;
  chainId: string;
  chainName: string;
  balance: string;
  price: number;
  decimals: number;
}

export interface PortfolioData {
  totalValue: number;
  walletCount: number;
  chainCount: number;
  chainBalances: ChainBalance[];
  topHoldings: TopHolding[];
  allTokens: TokenHolding[];
  lastUpdated: string;
}

interface SupportedChain {
  id: string;
  name: string;
}

export const processPortfolioData = async (
  balances: Record<string, any>,
  prices: Record<string, any>,
  metadata: Record<string, any>,
  supportedChains: SupportedChain[]
): Promise<PortfolioData> => {
  const chainBalances: ChainBalance[] = [];
  const allHoldings: TopHolding[] = [];
  const allTokens: TokenHolding[] = [];
  let totalValue = 0;

  // Process each chain
  for (const chain of supportedChains) {
    const chainBalance = balances[chain.id];
    if (!chainBalance || Object.keys(chainBalance).length === 0) continue;

    const chainPrices = prices[chain.id] || {};
    let chainValue = 0;
    const chainHoldings: TopHolding[] = [];

    // Process tokens on this chain
    for (const [tokenAddress, balance] of Object.entries(chainBalance)) {
      try {
        const price = Number(chainPrices[tokenAddress]) || 0;
        const metadataKey = `${chain.id}-${tokenAddress}`;
        const tokenMetadata = metadata[metadataKey];

        // Format balance
        const decimals = tokenMetadata?.assets?.decimals || 18;
        const displayBalance = formatTokenBalance(balance as string, decimals);
        const value = displayBalance * price;

        if (value > 0) {
          const symbol = tokenMetadata?.assets?.symbol || "UNKNOWN";
          chainValue += value;

          chainHoldings.push({
            symbol,
            value,
            percentage: 0, // Will be calculated later
            chainId: chain.id,
            chainName: chain.name,
          });

          // Add to allTokens array
          allTokens.push({
            symbol,
            value,
            percentage: 0, // Will be calculated later
            chainId: chain.id,
            chainName: chain.name,
            balance: balance as string,
            price,
            decimals,
          });
        }
      } catch (error) {
        console.warn(
          `Failed to process token ${tokenAddress} on chain ${chain.id}:`,
          error
        );
      }
    }

    if (chainValue > 0) {
      // Calculate anomalies
      const anomalies: ("gas_low" | "dust" | "concentration")[] = [];

      // Check for low gas (native token balance) - use the first token as native
      const tokenAddresses = Object.keys(chainBalance);
      if (tokenAddresses.length > 0) {
        const nativeTokenAddress = tokenAddresses[0]; // Assume first token is native
        const nativeToken = chainBalance[nativeTokenAddress];
        if (nativeToken) {
          const metadataKey = `${chain.id}-${nativeTokenAddress}`;
          const nativeMetadata = metadata[metadataKey];
          const nativeDecimals = nativeMetadata?.assets?.decimals || 18;
          const nativeBalance = formatTokenBalance(nativeToken, nativeDecimals);
          const nativePrice = Number(chainPrices[nativeTokenAddress]) || 0;
          const nativeValue = nativeBalance * nativePrice;

          if (nativeValue < 50) {
            // Less than $50 in native token
            anomalies.push("gas_low");
          }
        }
      }

      // Check for dust (small holdings)
      const smallHoldings = chainHoldings.filter((h) => h.value < 10); // Less than $10
      if (smallHoldings.length > 2) {
        anomalies.push("dust");
      }

      // Check for concentration (single asset > 80%)
      if (chainHoldings.length > 0) {
        const maxHolding = Math.max(...chainHoldings.map((h) => h.value));
        if (maxHolding / chainValue > 0.8) {
          anomalies.push("concentration");
        }
      }

      chainBalances.push({
        name: chain.name,
        percentage: 0, // Will be calculated later
        value: chainValue,
        anomalies,
      });

      // Add chain holdings to global holdings
      allHoldings.push(...chainHoldings);
    }
  }

  // Calculate total value and percentages
  totalValue = chainBalances.reduce((sum, chain) => sum + chain.value, 0);

  // Update chain percentages
  chainBalances.forEach((chain) => {
    chain.percentage =
      totalValue > 0 ? Math.round((chain.value / totalValue) * 100) : 0;
  });

  // Calculate top holdings
  const sortedHoldings = allHoldings
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map((holding) => ({
      ...holding,
      percentage:
        totalValue > 0 ? Math.round((holding.value / totalValue) * 100) : 0,
    }));

  // Sort chains by value
  chainBalances.sort((a, b) => b.value - a.value);

  // Calculate percentages for all tokens
  allTokens.forEach((token) => {
    token.percentage =
      totalValue > 0 ? Math.round((token.value / totalValue) * 100) : 0;
  });

  // Sort all tokens by value
  allTokens.sort((a, b) => b.value - a.value);

  return {
    totalValue,
    walletCount: 1, // For now, single wallet
    chainCount: chainBalances.length,
    chainBalances,
    topHoldings: sortedHoldings,
    allTokens,
    lastUpdated: new Date().toLocaleTimeString(),
  };
};

export const getAnomalyIcon = (anomaly: string) => {
  switch (anomaly) {
    case "gas_low":
      return <Zap className="h-3 w-3" />;
    case "dust":
      return <Coins className="h-3 w-3" />;
    case "concentration":
      return <AlertTriangle className="h-3 w-3" />;
    default:
      return null;
  }
};

export const getAnomalyColor = (anomaly: string) => {
  switch (anomaly) {
    case "gas_low":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "dust":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "concentration":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

export function formatTokenBalance(balance: string, decimals: number): number {
  const balanceBN = BigInt(balance);
  const divisor = BigInt(10 ** decimals);
  const wholePart = balanceBN / divisor;
  const fractionalPart = balanceBN % divisor;

  // Convert to number with proper decimal places
  const fractionalString = fractionalPart.toString().padStart(decimals, "0");
  const wholeString = wholePart.toString();

  return parseFloat(`${wholeString}.${fractionalString}`);
}

export const formatCurrency = (value: number, currency: string = "USD") => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: value >= 1000000 ? 1 : value >= 1000 ? 1 : 0,
  });

  if (value >= 1000000) {
    return (
      formatter.format(value / 1000000).replace(/[^\d.,\s$€£¥]+/g, "") + "M"
    );
  } else if (value >= 1000) {
    return formatter.format(value / 1000).replace(/[^\d.,\s$€£¥]+/g, "") + "k";
  }
  return formatter.format(value);
};
