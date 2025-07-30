import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink, Copy, Hash, Users } from "lucide-react";
import { ProcessedTransaction } from "@/lib/types";
import { getChainIcon, getExplorerUrl, getExplorerName } from "@/lib/chains";
import { formatRelativeTime } from "@/lib/history";

interface TransactionDetailsProps {
  transaction: ProcessedTransaction | null;
  onClose: () => void;
}

export const TransactionDetails = ({
  transaction,
  onClose,
}: TransactionDetailsProps) => {
  if (!transaction) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(transaction.hash);
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
  };

  const explorerUrl = getExplorerUrl(transaction.chainId);
  const explorerName = getExplorerName(transaction.chainId);

  return (
    <Dialog open={!!transaction} onOpenChange={onClose}>
      <DialogContent className="bg-background border-border max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <img
              src={getChainIcon(transaction.chainName)}
              alt={transaction.chainName}
              className="w-5 h-5 object-contain flex-shrink-0"
            />
            <div className="text-left min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-base font-semibold text-foreground capitalize">
                  {transaction.type} Transaction
                </DialogTitle>
                <Badge
                  variant={
                    transaction.status === "completed" ? "default" : "secondary"
                  }
                  className="text-xs h-5"
                >
                  {transaction.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {transaction.chainName} •{" "}
                {formatRelativeTime(transaction.timestamp)}
                {transaction.protocol && (
                  <>
                    {" "}
                    •{" "}
                    <span className="text-primary">{transaction.protocol}</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Transaction Hash */}
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Hash className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">Hash</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded min-w-0">
              <span className="font-mono text-xs text-foreground flex-1 min-w-0 break-all">
                {transaction.hash}
              </span>
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyHash}
                  className="h-6 w-6"
                  title="Copy"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    window.open(
                      `${explorerUrl}/tx/${transaction.hash}`,
                      "_blank"
                    )
                  }
                  className="h-6 w-6"
                  title="View on explorer"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Amount & Gas Fee */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2 min-w-0">
              <span className="text-xs font-medium text-foreground">
                Amount
              </span>
              <div className="p-2 bg-muted/50 rounded">
                <div className="text-sm font-semibold text-foreground break-words">
                  {transaction.direction === "out" ? "-" : "+"}
                  {transaction.formattedAmount} {transaction.symbol}
                </div>
              </div>
            </div>
            <div className="space-y-2 min-w-0">
              <span className="text-xs font-medium text-foreground">
                Gas Fee
              </span>
              <div className="p-2 bg-muted/50 rounded">
                <div className="text-sm font-semibold text-foreground">
                  {transaction.formattedFee} ETH
                </div>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="space-y-3">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">
                Addresses
              </span>
            </div>

            <div className="space-y-3">
              {/* From Address */}
              <div className="space-y-2">
                <span className="text-xs text-muted-foreground">From</span>
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded min-w-0">
                  <span className="font-mono text-xs text-foreground flex-1 min-w-0 break-all">
                    {transaction.fromAddress}
                  </span>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyAddress(transaction.fromAddress)}
                      className="h-6 w-6"
                      title="Copy"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        window.open(
                          `${explorerUrl}/address/${transaction.fromAddress}`,
                          "_blank"
                        )
                      }
                      className="h-6 w-6"
                      title="View on explorer"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* To Address */}
              <div className="space-y-2">
                <span className="text-xs text-muted-foreground">To</span>
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded min-w-0">
                  <span className="font-mono text-xs text-foreground flex-1 min-w-0 break-all">
                    {transaction.toAddress}
                  </span>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyAddress(transaction.toAddress)}
                      className="h-6 w-6"
                      title="Copy"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        window.open(
                          `${explorerUrl}/address/${transaction.toAddress}`,
                          "_blank"
                        )
                      }
                      className="h-6 w-6"
                      title="View on explorer"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Explorer Link */}
          <Button
            onClick={() =>
              window.open(`${explorerUrl}/tx/${transaction.hash}`, "_blank")
            }
            className="w-full h-8"
            variant="outline"
            size="sm"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            View on {explorerName}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
