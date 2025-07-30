import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Copy } from "lucide-react";
import { ProcessedTransaction } from "@/lib/types";
import { getChainIcon, getExplorerUrl } from "@/lib/chains";
import {
  getTransactionTypeIcon,
  getTransactionTypeColor,
  formatRelativeTime,
} from "@/lib/history";

interface TransactionItemProps {
  transaction: ProcessedTransaction;
  onClick?: (transaction: ProcessedTransaction) => void;
  isUnseen?: boolean;
}

export const TransactionItem = ({
  transaction,
  onClick,
  isUnseen = false,
}: TransactionItemProps) => {
  const handleCopyHash = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(transaction.hash);
  };

  const handleViewOnExplorer = (e: React.MouseEvent) => {
    e.stopPropagation();
    const explorerUrl = getExplorerUrl(transaction.chainId);
    window.open(`${explorerUrl}/tx/${transaction.hash}`, "_blank");
  };

  return (
    <Card
      className={`p-3 transition-colors cursor-pointer ${
        isUnseen
          ? "bg-blue-500/5 border-blue-500/50 hover:border-blue-400/50" // Gmail-like unseen styling
          : "bg-gray-800/30 border-gray-700/50 hover:border-gray-600/50"
      }`}
      onClick={() => onClick?.(transaction)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isUnseen && (
            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
          )}

          {/* Transaction type icon */}
          <div className="flex items-center justify-center w-8 h-8 bg-gray-700/50 rounded-full">
            <span className="text-sm">
              {getTransactionTypeIcon(transaction.type)}
            </span>
          </div>

          {/* Transaction details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-medium capitalize ${
                  isUnseen ? "text-white" : "text-white"
                }`}
              >
                {transaction.type}
              </span>

              {/* Chain icon */}
              <img
                src={getChainIcon(transaction.chainName)}
                alt={transaction.chainName}
                className="w-4 h-4 object-contain"
                title={transaction.chainName}
              />

              {/* Protocol badge */}
              {transaction.protocol && (
                <Badge variant="secondary" className="text-xs">
                  {transaction.protocol}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{formatRelativeTime(transaction.timestamp)}</span>
              <span>•</span>
              <span className="font-mono truncate max-w-[100px]">
                {transaction.hash.slice(0, 8)}...
              </span>
            </div>
          </div>
        </div>

        {/* Amount and actions */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div
              className={`text-sm font-medium ${getTransactionTypeColor(
                transaction.type,
                transaction.direction
              )}`}
            >
              {transaction.direction === "out" ? "-" : "+"}
              {transaction.formattedAmount} {transaction.symbol}
            </div>
            <div className="text-xs text-gray-500">
              Fee: {transaction.formattedFee} ETH
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopyHash}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              title="Copy transaction hash"
            >
              <Copy className="h-3 w-3" />
            </button>
            <button
              onClick={handleViewOnExplorer}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              title="View on explorer"
            >
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};
