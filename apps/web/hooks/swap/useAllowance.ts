"use client";
import type { AllowanceResponse } from "@/types/swap";
import { useQuery } from "@tanstack/react-query";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useAllowance(
  chainId: number,
  token: string,
  wallet: string,
  enabled: boolean,
  requestedAmount?: string
) {
  const qs = new URLSearchParams({
    chainId: String(chainId),
    tokenAddress: token,
    walletAddress: wallet,
  }).toString();

  const { data, error, isLoading, refetch } = useQuery<AllowanceResponse>({
    queryKey: ["allowance", qs],
    queryFn: () => fetcher(`/api/oneinch/approve/allowance?${qs}`),
    enabled,
    refetchOnWindowFocus: false,

    // Poll every 5 seconds if user needs approval for their swap amount
    refetchInterval: (query): number | false => {
      const data = query.state.data;
      if (!requestedAmount || !data?.allowance) return false;

      const allowance: bigint = BigInt(data.allowance);
      const needed: bigint = BigInt(requestedAmount || "0");
      const needsApproval: boolean = allowance < needed;

      return needsApproval ? 5000 : false;
    },
  });

  return {
    allowance: data?.allowance ? BigInt(data.allowance) : null,
    isLoading,
    error,
    refresh: refetch,
    hasData: !!data,
  };
}
