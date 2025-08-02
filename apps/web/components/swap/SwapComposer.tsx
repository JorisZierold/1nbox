"use client";

import { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Minus, ArrowRightLeft } from "lucide-react";
import { TokenPicker } from "@/components/swap/TokenPicker";
import { AmountInput } from "@/components/swap/AmountInput";
import { ActionBar } from "@/components/swap/ActionBar";
import { useSwapTokens } from "@/hooks/swap/useSwapTokens";
import { useQuote } from "@/hooks/swap/useQuote";
import { useAllowance } from "@/hooks/swap/useAllowance";
import { useApprove } from "@/hooks/swap/useApprove";
import { useQuickSwap } from "@/hooks/swap/useQuickSwap";
import { toUnits } from "@/lib/units";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { PendingSwap } from "@/types/swap";
import { useSwapStore } from "@/hooks/store/swap-store";
import {
  swapFormSchema,
  type SwapFormData,
} from "@/lib/validation/swap-schema";
import { SwapDetails } from "@/components/swap/SwapDetails";
import { SwapFooter } from "@/components/swap/SwapFooter";

export function SwapComposer() {
  const {
    busy,
    isMinimized,
    setBusy,
    addPendingSwap,
    closeComposer,
    minimizeComposer,
  } = useSwapStore();
  const { address: account } = useAppKitAccount();
  const { caipNetworkId } = useAppKitNetwork();

  const chainId = caipNetworkId ? parseInt(caipNetworkId.split(":")[1]) : 1;

  const {
    tokens,
    defaultTokens,
    isLoading: tokensLoading,
  } = useSwapTokens(chainId);
  const { approveExact } = useApprove();
  const { buildAndSendSwap } = useQuickSwap();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<SwapFormData>({
    resolver: zodResolver(swapFormSchema),
    defaultValues: {
      amount: "",
      fromToken: defaultTokens[1],
      toToken: defaultTokens[0],
      slippage: "0.1",
    },
    mode: "onChange",
  });

  const watchedValues = watch();
  const { amount, fromToken, toToken, slippage } = watchedValues;

  // Auto-select default tokens when tokens load
  if (defaultTokens.length >= 2 && !fromToken && !toToken) {
    setValue("fromToken", defaultTokens[1]);
    setValue("toToken", defaultTokens[0]);
  }

  const amountUnits = useMemo(() => {
    if (!fromToken || !amount) return "0";
    return toUnits(amount, fromToken.decimals);
  }, [amount, fromToken]);

  const { quote, isLoading: quoting } = useQuote(
    {
      chainId,
      src: fromToken?.address || "",
      dst: toToken?.address || "",
      amount: amountUnits,
    },
    Boolean(
      account &&
        chainId &&
        fromToken &&
        toToken &&
        Number(amount) > 0 &&
        !tokensLoading
    )
  );

  const {
    allowance,
    refresh: refreshAllowance,
    isLoading: allowanceLoading,
    hasData,
  } = useAllowance(
    chainId,
    fromToken?.address || "",
    account || "",
    Boolean(
      account &&
        account.length === 42 &&
        account.startsWith("0x") &&
        fromToken &&
        fromToken.address
    ),
    amountUnits
  );

  const needsApprove = useMemo(() => {
    console.log("needsApprove", {
      allowance,
      amountUnits,
      fromToken,
      hasData,
      allowanceLoading,
    });
    if (!fromToken || !amountUnits) return false;
    if (!hasData || allowanceLoading) return false; // Don't show approve until we have data
    if (allowance === null) return false; // No data yet
    return allowance < BigInt(amountUnits);
  }, [allowance, amountUnits, fromToken, hasData, allowanceLoading]);

  async function handleApprove() {
    if (!fromToken) return;
    setBusy(true);
    try {
      await approveExact({
        chainId,
        tokenAddress: fromToken.address,
        amount: amountUnits,
      });
      await refreshAllowance();
    } catch (e) {
      console.error("Approve failed:", e);
    } finally {
      setBusy(false);
    }
  }

  const onSubmit = async (data: SwapFormData) => {
    if (!data.fromToken || !data.toToken || !account) return;
    setBusy(true);
    try {
      const finalAmountUnits = toUnits(data.amount, data.fromToken.decimals);

      const { txHash } = await buildAndSendSwap({
        chainId,
        src: data.fromToken.address,
        dst: data.toToken.address,
        amount: finalAmountUnits,
        from: account,
        slippage: data.slippage,
      });

      const pendingSwap: PendingSwap = {
        id: `swap-${Date.now()}`,
        status: "pending",
        txHash,
        fromToken: data.fromToken,
        toToken: data.toToken,
        amount: data.amount,
        chainId,
        timestamp: new Date(),
      };

      addPendingSwap(pendingSwap);
      closeComposer();
    } catch (e) {
      console.error("Swap failed:", e);
    } finally {
      setBusy(false);
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={minimizeComposer} className="rounded-full shadow-lg">
          <ArrowRightLeft className="h-5 w-5 " />
          Swap
        </Button>
      </div>
    );
  }

  return (
    <Card className="bg-card border-border backdrop-blur-sm relative">
      {/* Clean header without branding */}
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <ArrowRightLeft className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Swap</h2>

              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Exchange tokens instantly
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={minimizeComposer}>
              <Minus className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={closeComposer}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {tokensLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            Loading tokens...
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Trading Pair Section */}
            <div className="space-y-4">
              <div className="flex items-stretch gap-4">
                {/* From Token Section */}
                <div className="flex-1 bg-muted/30 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-foreground">
                      You pay
                    </h3>
                    {errors.fromToken && (
                      <p className="text-xs text-destructive">
                        {errors.fromToken.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Controller
                      name="fromToken"
                      control={control}
                      render={({ field }) => (
                        <TokenPicker
                          chainId={chainId}
                          tokens={tokens}
                          value={field.value}
                          onChange={field.onChange}
                          label=""
                          showBalance={true}
                        />
                      )}
                    />
                    <Controller
                      name="amount"
                      control={control}
                      render={({ field }) => (
                        <AmountInput
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          balance={fromToken?.balance}
                          symbol={fromToken?.symbol}
                          error={errors.amount?.message}
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Swap Direction Button */}
                <div className="flex items-center justify-center py-8">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-10 w-10 rounded-full border-2 bg-background hover:bg-muted/50 transition-all duration-200"
                    onClick={() => {
                      if (fromToken && toToken) {
                        setValue("fromToken", toToken);
                        setValue("toToken", fromToken);
                        setValue("amount", "");
                      }
                    }}
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>
                </div>

                {/* To Token Section */}
                <div className="flex-1 bg-muted/30 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-foreground">
                      You receive
                    </h3>
                    {errors.toToken && (
                      <p className="text-xs text-destructive">
                        {errors.toToken.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Controller
                      name="toToken"
                      control={control}
                      render={({ field }) => (
                        <TokenPicker
                          chainId={chainId}
                          tokens={tokens}
                          value={field.value}
                          onChange={field.onChange}
                          label=""
                          showBalance={true}
                        />
                      )}
                    />

                    {/* Quote Results or Skeleton */}
                    <div className="p-3 bg-background/50 rounded-lg">
                      {quoting ? (
                        // Skeleton when loading
                        <div className="animate-pulse">
                          <div className="h-8 bg-muted rounded w-32 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-24"></div>
                        </div>
                      ) : quote ? (
                        // Actual quote results
                        <>
                          <div className="text-2xl font-semibold text-foreground">
                            {quote.dstAmount
                              ? `≈ ${(
                                  Number(quote.dstAmount) /
                                  Math.pow(10, toToken?.decimals || 18)
                                ).toFixed(6)}`
                              : "0.00"}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Expected output
                          </div>
                        </>
                      ) : (
                        // No quote state
                        <>
                          <div className="text-2xl font-semibold text-muted-foreground">
                            0.00
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Expected output
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Swap Details Section */}
            <SwapDetails
              quote={quote}
              fromToken={fromToken}
              toToken={toToken}
              inputAmount={amount}
              slippageControl={control}
              slippageError={errors.slippage?.message}
              isLoading={quoting}
            />

            {/* Action Section */}
            <div className="pt-2">
              <ActionBar
                canApprove={needsApprove}
                onApprove={handleApprove}
                onSwap={() => handleSubmit(onSubmit)()}
                busy={busy || quoting || tokensLoading}
                disabled={!isValid}
              />
            </div>
          </form>
        )}

        <SwapFooter />
      </CardContent>
    </Card>
  );
}
