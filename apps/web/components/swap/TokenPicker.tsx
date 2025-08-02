"use client";

import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SwapToken } from "@/types/swap";

export function TokenPicker({
  chainId,
  tokens,
  value,
  onChange,
  label,
  showBalance = false,
}: {
  chainId: number;
  tokens: SwapToken[];
  value?: SwapToken;
  onChange: (t: SwapToken) => void;
  label: string;
  showBalance?: boolean;
}) {
  const handleValueChange = (address: string) => {
    const token = tokens.find((x) => x.address === address);
    if (token) onChange(token);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Select value={value?.address || ""} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select token">
            {value && (
              <div className="flex items-center gap-2">
                {value.logoURI && (
                  <Image
                    src={value.logoURI}
                    alt={value.symbol}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                )}
                <span className="font-medium">{value.symbol}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {tokens.length === 0 ? (
            <SelectItem value="no-tokens" disabled>
              <span className="text-muted-foreground">No tokens available</span>
            </SelectItem>
          ) : (
            tokens.map((token) => (
              <SelectItem key={token.address} value={token.address}>
                <div className="flex items-center gap-2 w-full">
                  {token.logoURI ? (
                    <Image
                      src={token.logoURI}
                      alt={token.symbol}
                      width={20}
                      height={20}
                      className="rounded-full flex-shrink-0"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground flex-shrink-0">
                      {token.symbol.slice(0, 2)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{token.symbol}</span>
                    </div>
                    {showBalance && token.balance && (
                      <div className="text-xs text-muted-foreground">
                        Balance: {token.balance}
                      </div>
                    )}
                  </div>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
