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

// Processed transaction types for UI consumption
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
  fee: string;
  formattedFee: string;
  status: string;
  fromAddress: string;
  toAddress: string;
  protocol?: string;
}

export interface ChainStats {
  chainId: number;
  chainName: string;
  count: number;
  totalTransactions: number;
}
