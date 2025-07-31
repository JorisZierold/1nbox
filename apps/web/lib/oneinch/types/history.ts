// Transaction history API response types
export interface TokenAction {
  chainId: string;
  address: string;
  standard: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  direction: "In" | "Out";
}

export interface TransactionDetails {
  txHash: string;
  chainId: number;
  blockNumber: number;
  blockTimeSec: number;
  status: string;
  type: string;
  tokenActions: TokenAction[];
  fromAddress: string;
  toAddress: string;
  nonce: number;
  orderInBlock: number;
  feeInSmallestNative: string;
  meta?: {
    protocol?: string;
    safeAddress?: string;
  };
}

export interface HistoryItem {
  timeMs: number;
  address: string;
  type: number;
  rating: string;
  direction: "in" | "out";
  details: TransactionDetails;
  id: string;
  eventOrderInTransaction: number;
}

export interface HistoryResponse {
  items: HistoryItem[];
  cache_counter: number;
}
