"use client";

import { Hex } from "viem";
import { useSendTransaction, useAccount } from "wagmi";
import { useCallback } from "react";

export const useQuickSwap = () => {
  const { sendTransactionAsync } = useSendTransaction();
  const { address } = useAccount();

  const buildAndSendSwap = useCallback(
    async (params: {
      chainId: number;
      src: string;
      dst: string;
      amount: string; // integer units
      from: string;
      slippage?: string;
      gasPrice?: string;
    }) => {
      if (!address) {
        throw new Error("Wallet not connected");
      }

      const qs = new URLSearchParams({
        chainId: String(params.chainId),
        src: params.src,
        dst: params.dst,
        amount: params.amount,
        from: params.from,
        origin: params.from,
        slippage: params.slippage ?? "1",
        allowPartialFill: "false",
        ...(params.gasPrice ? { gasPrice: params.gasPrice } : {}),
      }).toString();

      const res = await fetch(`/api/oneinch/swap?${qs}`).then((r) => r.json());

      const txHash = await sendTransactionAsync({
        to: res.tx.to as Hex,
        data: res.tx.data as Hex,
        value: BigInt(res.tx.value || 0),
      });

      return { txHash, built: res };
    },
    [sendTransactionAsync, address]
  );

  return {
    buildAndSendSwap,
    isConnected: !!address,
  };
};
