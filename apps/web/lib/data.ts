import type { Action, Category } from "./types";
import {
  Layers,
  Shield,
  Zap,
  PieChart,
  History,
  Rabbit,
  Tag,
} from "lucide-react";

export const categories: Category[] = [
  { name: "All Actions", icon: Layers, count: 8, selected: true },
  { name: "Security", icon: Shield, count: 3 },
  { name: "Utility", icon: Zap, count: 2 },
  { name: "Allocation", icon: PieChart, count: 3 },
  { name: "History", icon: History },
];

export const securityActions: Action[] = [
  {
    icon: () => null,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    title: "DeFiProtocolX",
    description: "3 unlimited approvals • Inactive 8 months",
    impact: "High risk exposure to wallet funds.",
    tag: "High Risk",
    tagType: "risk",
    walletName: "Main Wallet",
    chainName: "Ethereum",
    chainColor: "text-gray-600",
    whyItMatters:
      "Unlimited approvals allow a protocol to move all of your tokens of a specific type. If the protocol is compromised, your funds could be stolen.",
    educationalTip:
      "Regularly review and revoke old or unused token approvals to minimize your wallet's attack surface. Use tools like Revoke.cash via 1nbox.",
  },
  {
    icon: () => null,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    title: "UniswapV2 Pairs",
    description: "4 stale approvals • Last used 6+ months",
    impact: "Potential asset loss from old contracts.",
    tag: "Attention",
    tagType: "attention",
    walletName: "Hardware Wallet",
    chainName: "Ethereum",
    chainColor: "text-gray-600",
    whyItMatters:
      "Stale approvals are permissions granted to protocols you no longer use. These can become security liabilities if the protocol's code is exploited later.",
    educationalTip:
      "It's a good habit to revoke approvals for any DeFi application you haven't interacted with in over 90 days.",
  },
];

export const utilityActions: Action[] = [
  {
    icon: () => null,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    title: "Top up gas balance",
    description: "Your ETH balance is below 0.01 ETH for future transactions",
    impact: "Prevents failed transactions.",
    tag: "Attention",
    tagType: "attention",
    buttonText: "Top Up",
    buttonVariant: "primary",
    walletName: "Main Wallet",
    chainName: "Ethereum",
    chainColor: "text-gray-600",
    whyItMatters:
      "A low gas balance means you won't be able to pay for transaction fees on the Ethereum network, causing important actions (like revoking permissions) to fail.",
    educationalTip:
      "Consider using a secondary wallet or a service that provides gasless transactions for certain actions to manage your gas fees effectively.",
  },
  {
    icon: () => null,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Claim protocol rewards",
    description: "~$120 in ARB tokens available from Arbitrum airdrop",
    impact: "Claim value: ~$120",
    source: "Expires in 14 days",
    tag: "Opportunity",
    tagType: "opportunity",
    buttonText: "Claim",
    buttonVariant: "primary",
    walletName: "Main Wallet",
    chainName: "Arbitrum",
    chainColor: "text-blue-600",
    whyItMatters:
      "Airdrops are free tokens distributed to users. They often have an expiration date, and unclaimed tokens are lost forever.",
    educationalTip:
      "Always verify airdrop claims through official sources. Scammers often create fake airdrop sites to steal your private keys.",
  },
];

export const allocationActions: Action[] = [
  {
    icon: () => null,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Rebalance portfolio",
    description: "ETH allocation is 15% above your target allocation",
    impact: "Aligns with your investment strategy.",
    tag: "Opportunity",
    tagType: "opportunity",
    buttonText: "Review",
    buttonVariant: "secondary",
    walletName: "Hardware Wallet",
    chainName: "Ethereum",
    chainColor: "text-gray-600",
    whyItMatters:
      "Rebalancing ensures your portfolio doesn't become over-exposed to a single asset's volatility, helping you stick to your risk tolerance and long-term goals.",
    educationalTip:
      "Set a rebalancing threshold (e.g., when an asset deviates by more than 5% from its target) to avoid frequent, costly trades.",
  },
  {
    icon: () => null,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    title: "Higher yield opportunity",
    description: "Move 10,000 USDC to earn +2.3% APY on Aave",
    impact: "Earn an extra ~$230 per year.",
    tag: "Opportunity",
    tagType: "opportunity",
    buttonText: "Review",
    buttonVariant: "secondary",
    walletName: "Main Wallet",
    chainName: "Polygon",
    chainColor: "text-purple-600",
    whyItMatters:
      "Capital efficiency is key in DeFi. Moving assets to higher-yield protocols (of similar risk) maximizes your potential returns.",
    educationalTip:
      "APYs can be variable. Look at the protocol's historical yield and understand the risks (e.g., smart contract risk, impermanent loss) before chasing the highest number.",
  },
  {
    icon: Tag,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Limit order opportunity",
    description: "Set limit order to buy ETH at $2,565 (10% below current)",
    impact: "Potential to buy ETH at a discount.",
    buttonText: "Review",
    buttonVariant: "secondary",
    walletName: "Hardware Wallet",
    chainName: "Arbitrum",
    chainColor: "text-blue-600",
    whyItMatters:
      "Limit orders allow you to buy or sell an asset at a specific price without constantly monitoring the market, automating your trading strategy.",
    educationalTip:
      "Ensure your limit order has a reasonable expiration time. A 'Good Till Cancelled' (GTC) order will remain active until you manually cancel it.",
  },
];

export const promotionalAction: Action = {
  icon: () => null,
  iconBg: "bg-blue-100",
  iconColor: "text-blue-600",
  title: "1inch Network",
  description: "Discover the beauty of all liquidity in a single place.",
  tag: "Sponsored",
  tagType: "sponsored",
  buttonText: "Explore",
  buttonVariant: "primary",
  isPromotional: true,
  link: "https://1inch.io",
  walletName: "",
  chainName: "",
  chainColor: "",
  whyItMatters: "",
  educationalTip: "",
};

export const allActions = [
  ...securityActions,
  ...utilityActions,
  ...allocationActions,
];
