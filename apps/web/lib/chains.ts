import { networks } from "./wagmi-config";

export const getChainIcon = (chainName: string): string => {
  const iconMap: Record<string, string> = {
    Ethereum: "/chains/ethereum.svg",
    "Arbitrum One": "/chains/arbitrum.svg",
    Arbitrum: "/chains/arbitrum.svg",
    Polygon: "/chains/polygon.svg",
    Base: "/chains/base.svg",
    Optimism: "/chains/optimism.svg",
    Avalanche: "/chains/avalanche.svg",
    "zkSync Era": "/chains/zksync.svg",
    Solana: "/chains/solana.svg",
    "BNB Smart Chain": "/chains/bnb.svg",
    Gnosis: "/chains/gnosis.svg",
    Linea: "/chains/linea.svg",
    Sonic: "/chains/sonic.svg",
    UniChain: "/chains/unichain.svg",
  };

  return iconMap[chainName] || "/chains/ethereum.svg";
};

export const getExplorerUrl = (chainId: number): string => {
  const network = networks.find((n) => n.id === chainId);

  if (network?.blockExplorers?.default?.url) {
    return network.blockExplorers.default.url;
  }

  // Fallback to etherscan for unknown chains
  return "https://etherscan.io";
};

export const getExplorerName = (chainId: number): string => {
  const network = networks.find((n) => n.id === chainId);

  if (network?.blockExplorers?.default?.name) {
    return network.blockExplorers.default.name;
  }

  return "Explorer";
};
