// Price API response types
export interface TokenPrice {
  address: string;
  symbol: string;
  price: string;
  priceUSD: string;
  marketCap?: string;
  volume24h?: string;
  change24h?: string;
  lastUpdated: string;
}

export interface PriceResponse {
  [tokenAddress: string]: TokenPrice;
}

export interface PriceRequest {
  params: {
    tokens: string[];
    currency: string;
  };
}
