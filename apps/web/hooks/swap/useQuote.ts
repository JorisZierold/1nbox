"use client";
import { QuoteResponse } from "@/types/swap";
import { useQuery } from "@tanstack/react-query";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useQuote(
  args: {
    chainId: number;
    src: string;
    dst: string;
    amount: string;
    gasPrice?: string;
  },
  enabled: boolean
) {
  const qs = new URLSearchParams({
    chainId: String(args.chainId),
    src: args.src,
    dst: args.dst,
    amount: args.amount || "0",
    ...(args.gasPrice ? { gasPrice: args.gasPrice } : {}),
  }).toString();

  const { data, error, isLoading } = useQuery<QuoteResponse>({
    queryKey: ["quote", qs],
    queryFn: () => fetcher(`/api/oneinch/quote?${qs}`),
    enabled,
    refetchOnWindowFocus: false,
  });

  return { quote: data, isLoading, error };
}
