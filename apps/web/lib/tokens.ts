import { Token } from "@/types/tokens";

// Sample tokens (add more as needed)
export const TOKENS_BY_CHAIN: Record<number, Token[]> = {
  8453: [
    // Base
    {
      address: "0x4200000000000000000000000000000000000006", // WETH
      symbol: "WETH",
      name: "Wrapped Ether",
      decimals: 18,
      isNative: false,
    },
    {
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
      isNative: false,
    },
  ],
  137: [
    // Polygon
    {
      address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", // WETH
      symbol: "WETH",
      name: "Wrapped Ether",
      decimals: 18,
      isNative: false,
    },
    {
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC.e
      symbol: "USDC.e",
      name: "USD Coin (bridged)",
      decimals: 6,
      isNative: false,
    },
  ],
  43114: [
    // Avalanche
    {
      address: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB", // WETH.e
      symbol: "WETH.e",
      name: "Wrapped Ether",
      decimals: 18,
      isNative: false,
    },
    {
      address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", // USDC
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
      isNative: false,
    },
  ],
};

export function findToken(chainId: number, address: string) {
  return TOKENS_BY_CHAIN[chainId]?.find(
    (t) => t.address.toLowerCase() === address.toLowerCase()
  );
}
