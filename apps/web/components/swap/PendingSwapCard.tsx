"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Wallet, ArrowRightLeft, X } from "lucide-react";
import { getChainIcon, getChainName, getExplorerUrl } from "@/lib/chains";
import { PendingSwap } from "@/types/swap";
import { TokenIcons } from "./TokenIcons";
import { SwapStatusBadge } from "./SwapStatusBadge";
import { useSwapStore } from "@/hooks/store/swap-store";
import { Button } from "../ui/button";

interface PendingSwapCardProps {
  swap: PendingSwap;
}

export function PendingSwapCard({ swap }: PendingSwapCardProps) {
  const chainName = getChainName(swap.chainId);
  const chainIcon = getChainIcon(chainName);
  const { removePendingSwap } = useSwapStore();

  // TODO: add button to removePendingSwap

  const allowRemoval = swap.status === "confirmed" || swap.status === "failed";

  return (
    <Card className="bg-card border-border backdrop-blur-sm group">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Swap Icon */}
            <div className="p-2 bg-primary/20 rounded-lg">
              <ArrowRightLeft className="h-5 w-5 text-primary" />
            </div>
            <div className="flex items-center gap-1.5 text-sm text-primary">
              <span>{`Swap on ${chainName}`}</span>
              <img
                src={chainIcon}
                alt={chainName}
                className="w-4 h-4 object-contain flex-shrink-0"
                title={chainName}
              />
            </div>

            {/* Vertical line */}
            <div className="bg-primary/20 w-px h-[50px]" />

            {/* Token Icons */}
            <div className="flex-shrink-0">
              <TokenIcons from={swap.fromToken} to={swap.toToken} />
            </div>

            {/* Swap Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-foreground">
                {swap.amount} {swap.fromToken.symbol} → {swap.toToken.symbol}
              </h3>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Wallet className="h-3 w-3" />
                  <span>{swap.timestamp.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="flex items-center gap-3 pl-4">
            {allowRemoval && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => removePendingSwap(swap.id)}
              >
                Hide
              </Button>
            )}
            <SwapStatusBadge status={swap.status} />
            {swap.txHash && getExplorerUrl(swap.chainId) && (
              <a
                href={`${getExplorerUrl(swap.chainId)}/tx/${swap.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-200 hover:bg-muted rounded"
                title="View on explorer"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
