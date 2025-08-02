"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SlippageSelector } from "./SlippageSelector";
import type { QuoteResponse } from "@/types/swap";
import type { SwapToken } from "@/types/swap";

interface SwapDetailsProps {
  quote?: QuoteResponse;
  fromToken?: SwapToken | null;
  toToken?: SwapToken | null;
  inputAmount?: string;
  slippageControl: any;
  slippageError?: string;
  isLoading?: boolean;
}

export function SwapDetails({
  quote,
  fromToken,
  toToken,
  inputAmount,
  slippageControl,
  slippageError,
  isLoading,
}: SwapDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const exchangeRate = (() => {
    if (!quote || !fromToken || !toToken || !quote.dstAmount || !inputAmount)
      return null;

    try {
      const fromValue = Number(inputAmount);
      const toValue = Number(quote.dstAmount) / Math.pow(10, toToken.decimals);

      if (fromValue === 0 || isNaN(fromValue) || isNaN(toValue)) return null;

      const rate = toValue / fromValue;
      return isNaN(rate) ? null : rate.toFixed(6);
    } catch (error) {
      console.warn("Error calculating exchange rate:", error);
      return null;
    }
  })();

  const minimumReceived = (() => {
    if (!quote || !toToken || !quote.dstAmount) return null;

    try {
      // Get current slippage value from the control
      const currentSlippage =
        slippageControl._formState?.values?.slippage || "0.1";
      const outputAmount =
        Number(quote.dstAmount) / Math.pow(10, toToken.decimals);
      const slippageDecimal = Number(currentSlippage) / 100;
      const minReceived = outputAmount * (1 - slippageDecimal);

      return isNaN(minReceived) ? null : minReceived.toFixed(6);
    } catch (error) {
      console.warn("Error calculating minimum received:", error);
      return null;
    }
  })();

  console.log(quote);

  if (!quote && !isLoading) return null;

  return (
    <div className="bg-muted/20 rounded-xl overflow-hidden">
      {/* Always Visible Summary */}
      <div className="p-3">
        <div className="mt-2">
          <div className="flex justify-between text-xs gap-2">
            <div className="flex gap-2">
              <span className="text-muted-foreground">Exchange rate</span>
              <span className="font-medium">
                {isLoading ? (
                  <div className="animate-pulse h-3 bg-muted rounded w-20"></div>
                ) : exchangeRate && fromToken && toToken ? (
                  `1 ${fromToken.symbol} = ${exchangeRate} ${toToken.symbol}`
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 px-1 hover:bg-muted/50"
            >
              <span className="text-xs text-muted-foreground mr-1">
                {isExpanded ? "Hide" : "Details"}
              </span>
              {isExpanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Collapsible Details */}
      {isExpanded && (
        <div className="border-t border-border/50 p-3 space-y-3 animate-in slide-in-from-top-2 duration-200">
          {/* Slippage Tolerance */}
          <SlippageSelector control={slippageControl} error={slippageError} />

          {/* Other Details */}
          {quote && (
            <div className="space-y-2">
              {minimumReceived && toToken && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    Minimum received
                  </span>
                  <span className="font-medium">
                    {minimumReceived} {toToken.symbol}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Price impact</span>
                <span className="font-medium text-green-600">&lt; 0.01%</span>
              </div>

              {quote.gas && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Gas estimate</span>
                  <span className="font-medium">
                    ~{Number(quote.gas).toLocaleString()}
                  </span>
                </div>
              )}

              {quote?.protocols && (
                <div className="mt-2 p-2 bg-background/50 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">
                    Route
                  </div>
                  <div className="text-xs">
                    {/* TODO: Parse and display actual routing protocols */}
                    {/* TODO: Assuming RouteVisualization component exists elsewhere */}
                    {/* TODO: <RouteVisualization protocols={quote.protocols} fromToken={fromToken} toToken={toToken} /> */}
                    <span className="font-medium">{fromToken?.symbol}</span>
                    <div className="flex-1 h-px bg-border"></div>
                    <span className="text-xs text-muted-foreground">1inch</span>
                    <div className="flex-1 h-px bg-border"></div>
                    <span className="font-medium">{toToken?.symbol}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-2">
              <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="ml-2 text-xs text-muted-foreground">
                Fetching best route...
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
