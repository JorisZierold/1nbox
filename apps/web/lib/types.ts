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
