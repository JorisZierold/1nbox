// Token metadata API response types
export interface TokenMetadata {
  chainId: number;
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
  providers: string[];
  eip2612: boolean;
  isFoT: boolean;
  tags: string[];
}

export interface OneInchTokenMetadata {
  [address: string]: TokenMetadata;
}
