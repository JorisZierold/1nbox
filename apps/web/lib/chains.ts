import { networks } from "./wagmi-config";

export const getChainIcon = (chainName: string): string => {
  const iconMap: Record<string, string> = {
    ethereum: "/chains/ethereum.svg",
    "arbitrum one": "/chains/arbitrum.svg",
    arbitrum: "/chains/arbitrum.svg",
    polygon: "/chains/polygon.svg",
    base: "/chains/base.svg",
    optimism: "/chains/optimism.svg",
    "op mainnet": "/chains/optimism.svg",
    avalanche: "/chains/avalanche.svg",
    "zksync era": "/chains/zksync.svg",
    solana: "/chains/solana.svg",
    "bnb smart chain": "/chains/bnb.svg",
    gnosis: "/chains/gnosis.svg",
    linea: "/chains/linea.svg",
    sonic: "/chains/sonic.svg",
    unichain: "/chains/unichain.svg",
  };

  return iconMap[chainName.toLowerCase()] || "/chains/ethereum.svg";
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
