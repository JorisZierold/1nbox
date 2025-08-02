import { PendingSwap } from "@/types/swap";

export const mockPendingSwaps: PendingSwap[] = [
  {
    id: "1",
    status: "pending",
    fromToken: {
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      symbol: "AVAX",
      name: "Avalanche",
      decimals: 18,
      logoURI:
        "https://tokens.1inch.io/0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7.png",
      isNative: false,
      hasBalance: true,
      balance: "0.0317",
    },
    toToken: {
      address: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
      logoURI:
        "https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
      isNative: false,
      hasBalance: true,
      balance: "0.5208",
    },
    amount: "1",
    chainId: 8453,
    timestamp: new Date(),
    txHash:
      "0xcd8774ce826a73c550bca2868360b6e64d83ad32acccc6375ea355e22f6a1820",
  },
  {
    id: "2",
    status: "confirmed",
    fromToken: {
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      symbol: "AVAX",
      name: "Avalanche",
      decimals: 18,
      logoURI:
        "https://tokens.1inch.io/0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7.png",
      isNative: false,
      hasBalance: true,
      balance: "0.0317",
    },
    toToken: {
      address: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
      logoURI:
        "https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
      isNative: false,
      hasBalance: true,
      balance: "0.5208",
    },
    amount: "1",
    chainId: 8453,
    timestamp: new Date(),
    txHash:
      "0xcd8774ce826a73c550bca2868360b6e64d83ad32acccc6375ea355e22f6a1820",
  },
  {
    id: "3",
    status: "failed",
    fromToken: {
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      symbol: "AVAX",
      name: "Avalanche",
      decimals: 18,
      logoURI:
        "https://tokens.1inch.io/0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7.png",
      isNative: false,
      hasBalance: true,
      balance: "0.0317",
    },
    toToken: {
      address: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
      logoURI:
        "https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
      isNative: false,
      hasBalance: true,
      balance: "0.5208",
    },
    amount: "1",
    chainId: 8453,
    timestamp: new Date(),
    txHash:
      "0xcd8774ce826a73c550bca2868360b6e64d83ad32acccc6375ea355e22f6a1820",
  },
];
