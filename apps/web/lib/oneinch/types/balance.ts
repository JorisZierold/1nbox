// Balance API response types
export interface TokenBalance {
  address: string;
  chainId: number;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  balance: string;
  balanceUSD?: string;
  price?: string;
}

export interface BalanceResponse {
  [tokenAddress: string]: TokenBalance;
}

export interface ChainBalances {
  chainId: number;
  chainName: string;
  tokens: TokenBalance[];
  totalUSD: string;
}
