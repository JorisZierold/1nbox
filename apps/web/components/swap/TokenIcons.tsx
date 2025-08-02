import { SwapToken } from "@/types/swap";
import Image from "next/image";

interface TokenIconsProps {
  from: SwapToken;
  to: SwapToken;
}

export function TokenIcons({ from, to }: TokenIconsProps) {
  const fromLogo = from.logoURI || "";
  const toLogo = to.logoURI || "";

  return (
    <div className="flex items-center -space-x-2">
      <div className="w-8 h-8 rounded-full bg-muted border-2 border-border flex items-center justify-center text-xs font-semibold overflow-hidden">
        {fromLogo ? (
          <Image
            src={fromLogo}
            alt={from.symbol}
            width={24}
            height={24}
            className="rounded-full"
          />
        ) : (
          <span className="text-muted-foreground">
            {from.symbol.slice(0, 2)}
          </span>
        )}
      </div>
      <div className="w-8 h-8 rounded-full bg-muted border-2 border-border flex items-center justify-center text-xs font-semibold overflow-hidden">
        {toLogo ? (
          <Image
            src={toLogo}
            alt={to.symbol}
            width={24}
            height={24}
            className="rounded-full"
          />
        ) : (
          <span className="text-muted-foreground">{to.symbol.slice(0, 2)}</span>
        )}
      </div>
    </div>
  );
}
