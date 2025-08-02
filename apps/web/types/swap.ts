export type QuoteResponse = {
  srcToken?: any;
  dstToken?: any;
  fromAmount: string;
  dstAmount: string;
  gas?: string;
  protocols?: any;
};

export type OneInchTx = {
  to: `0x${string}`;
  data: `0x${string}`;
  value: string | number | bigint;
  gas?: string;
  gasPrice?: string;
  from?: `0x${string}`;
};

export type SwapBuildResponse = {
  from?: string;
  to: `0x${string}`;
  data: `0x${string}`;
  value: string;
  gas?: string;
  gasPrice?: string;
  dstAmount?: string;
};

export type AllowanceResponse = { allowance: string };
export type ApproveTxResponse = {
  to: `0x${string}`;
  data: `0x${string}`;
  value: string;
};

export type Token = {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  isNative?: boolean; // if you later support native sells
};

export interface SwapToken extends Token {
  logoURI?: string;
  hasBalance?: boolean;
  balance?: string;
}

export interface PendingSwap {
  id: string;
  status: "pending" | "confirmed" | "failed";
  txHash?: string;
  fromToken: SwapToken;
  toToken: SwapToken;
  amount: string;
  chainId: number;
  timestamp: Date;
}
