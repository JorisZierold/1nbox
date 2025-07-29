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
