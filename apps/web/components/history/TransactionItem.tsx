import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Copy } from "lucide-react";
import { ProcessedTransaction } from "@/lib/types";
import { getChainIcon, getExplorerUrl } from "@/lib/chains";
import { getTransactionTypeIcon, formatRelativeTime } from "@/lib/history";

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
          ? "bg-primary/5 border-primary/50 hover:border-primary"
          : "bg-muted/40 border-border hover:border-muted-foreground/50"
      }`}
      onClick={() => onClick?.(transaction)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-2 h-2 ${
              isUnseen ? "bg-info" : "bg-transparent"
            } rounded-full flex-shrink-0`}
          />

          {/* Transaction type icon */}
          <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full">
            <span className="text-sm">
              {getTransactionTypeIcon(transaction.type)}
            </span>
          </div>

          {/* Transaction details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-medium capitalize text-foreground`}
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

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
              className={`text-sm font-medium ${
                transaction.direction === "out"
                  ? "text-destructive"
                  : "text-success"
              }`}
            >
              {transaction.direction === "out" ? "-" : "+"}
              {transaction.formattedAmount} {transaction.symbol}
            </div>
            <div className="text-xs text-muted-foreground">
              Fee: {transaction.formattedFee} ETH
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopyHash}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              title="Copy transaction hash"
            >
              <Copy className="h-3 w-3" />
            </button>
            <button
              onClick={handleViewOnExplorer}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
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
