import { formatTokenBalance } from "./portfolio";
import { ProcessedTransaction } from "../types";
import { getChainName } from "./chains";
import { HistoryItem } from "./oneinch/types/history";

const NATIVE_TOKEN_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export const formatTransactionAmount = (
  amount: string,
  decimals: number = 18
): string => {
  try {
    const balance = formatTokenBalance(amount, decimals);

    if (balance >= 1000000) {
      return `${(balance / 1000000).toFixed(2)}M`;
    } else if (balance >= 1000) {
      return `${(balance / 1000).toFixed(2)}K`;
    } else if (balance >= 1) {
      return balance.toFixed(4);
    } else {
      return balance.toFixed(6);
    }
  } catch (error) {
    console.error("Error formatting amount:", error);
    return "0";
  }
};

export const processTransactionHistory = (
  historyItems: HistoryItem[]
): ProcessedTransaction[] => {
  return historyItems.map((item) => {
    const { details } = item;
    const primaryTokenAction = details.tokenActions[0];

    // Determine symbol and amount
    let symbol = "ETH";
    let amount = "0";
    let formattedAmount = "0";

    if (primaryTokenAction) {
      // For native token, use chain native symbol
      if (primaryTokenAction.address.toLowerCase() === NATIVE_TOKEN_ADDRESS) {
        const chainName = getChainName(details.chainId);
        symbol =
          chainName === "Ethereum"
            ? "ETH"
            : chainName === "Polygon"
            ? "MATIC"
            : chainName === "BNB Smart Chain"
            ? "BNB"
            : chainName === "Avalanche"
            ? "AVAX"
            : "ETH";
      } else {
        // For ERC20 tokens, we'd need metadata - for now use address
        symbol = "TOKEN";
      }

      amount = primaryTokenAction.amount;
      formattedAmount = formatTransactionAmount(amount);
    }

    // Format fee
    const formattedFee = formatTransactionAmount(details.feeInSmallestNative);

    // Fix direction based on transaction type
    let direction: "in" | "out" = item.direction;

    // Override direction based on transaction type to ensure consistency
    if (details.type.toLowerCase() === "receive") {
      direction = "in";
    } else if (details.type.toLowerCase() === "send") {
      direction = "out";
    }

    // Normalize transaction types to avoid duplicates
    let normalizedType = details.type;
    switch (details.type.toLowerCase()) {
      case "sent":
      case "send":
        normalizedType = "Send";
        break;
      case "received":
      case "receive":
        normalizedType = "Receive";
        break;
      case "limitorderfill":
        normalizedType = "LimitOrderFill";
        break;
      case "approve":
        normalizedType = "Approve";
        break;
      default:
        // Capitalize first letter for consistency
        normalizedType =
          details.type.charAt(0).toUpperCase() +
          details.type.slice(1).toLowerCase();
    }

    return {
      id: item.id,
      hash: details.txHash,
      timestamp: item.timeMs,
      type: normalizedType,
      direction,
      chainId: details.chainId,
      chainName: getChainName(details.chainId),
      amount,
      symbol,
      formattedAmount,
      fee: details.feeInSmallestNative,
      formattedFee,
      status: details.status,
      fromAddress: details.fromAddress,
      toAddress: details.toAddress,
      protocol: details.meta?.protocol,
    };
  });
};

export const getTransactionTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "send":
      return "↗️";
    case "receive":
      return "↙️";
    case "swap":
      return "🔄";
    case "createsafe":
      return "🛡️";
    case "limitorderfill":
    case "SwapExactInput":
    case "SwapExactOutput":
    case "SwapExactInputSingle":
    case "SwapExactOutputSingle":
    case "SwapExactInputSingle":
      return "📊";

    case "approve":
    case "revoke":
      return "🔄";
    case "transfer":
      return "↗️";
    case "transferfrom":
      return "↙️";
    case "transferto":
      return "↙️";
    case "unknown":
    default:
      return "❓";
  }
};

export const getTransactionTypeColor = (type: string, direction: string) => {
  if (direction === "out") {
    return "text-red-400";
  } else if (direction === "in") {
    return "text-green-400";
  }
  return "text-gray-400";
};

export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;

  if (diff < minute) {
    return "Just now";
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes}m ago`;
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours}h ago`;
  } else if (diff < week) {
    const days = Math.floor(diff / day);
    return `${days}d ago`;
  } else {
    return new Date(timestamp).toLocaleDateString();
  }
};
