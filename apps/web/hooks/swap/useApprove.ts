"use client";
import { Hex } from "viem";
import { useSendTransaction, useAccount } from "wagmi";
import { useCallback } from "react";

export const useApprove = () => {
  const { sendTransaction } = useSendTransaction();
  const { address } = useAccount();

  const approveExact = useCallback(
    async (params: {
      chainId: number;
      tokenAddress: string;
      amount: string;
    }) => {
      if (!address) {
        throw new Error("Wallet not connected");
      }

      const qs = new URLSearchParams({
        chainId: String(params.chainId),
        tokenAddress: params.tokenAddress,
        amount: params.amount,
      }).toString();

      const res = await fetch(`/api/oneinch/approve/transaction?${qs}`).then(
        (r) => r.json()
      );

      const txHash = sendTransaction({
        to: res.to as Hex,
        data: res.data as Hex,
        value: BigInt(res.value || 0),
      });

      return txHash;
    },
    [sendTransaction, address]
  );

  return {
    approveExact,
    isConnected: !!address,
  };
};
