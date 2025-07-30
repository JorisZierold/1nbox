import type { ComponentType } from "react";
export type ActionTagType = "risk" | "attention" | "opportunity" | "sponsored";

export interface Action {
  icon: ComponentType<any>;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  impact?: string;
  tag?: string;
  tagType?: ActionTagType;
  walletName: string;
  chainName: string;
  chainColor: string;
  whyItMatters: string;
  educationalTip: string;
  buttonText?: string;
  buttonVariant?: "primary" | "secondary";
  source?: string;
  isPromotional?: boolean;
  link?: string;
}

export interface Category {
  name: string;
  icon: ComponentType<{ className?: string }>;
  count?: number;
  selected?: boolean;
}

export interface Wallet {
  name: string;
  icon: ComponentType<{ className?: string }>;
  address: string;
  selected?: boolean;
}

export interface OneInchTokenMetadata {
  [address: string]: {
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
  };
}

// Add History Types
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

export interface ProcessedTransaction {
  id: string;
  hash: string;
  timestamp: number;
  type: string;
  direction: "in" | "out";
  chainId: number;
  chainName: string;
  amount: string;
  symbol: string;
  formattedAmount: string;
  usdValue?: number;
  fee: string;
  formattedFee: string;
  status: string;
  fromAddress: string;
  toAddress: string;
  protocol?: string;
}
