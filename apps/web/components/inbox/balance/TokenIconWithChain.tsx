import { TokenHolding, TopHolding } from "@/lib/portfolio";
import { getChainIcon } from "@/lib/chains";
import Image from "next/image";

interface TokenIconWithChainProps {
  token: TokenHolding | TopHolding;
  size?: "sm" | "md" | "lg";
  showChainIcon?: boolean;
}

export const TokenIconWithChain = ({
  token,
  size = "md",
  showChainIcon = true,
}: TokenIconWithChainProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const chainSizeClasses = {
    sm: "w-4 h-4",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const logoURI = "logoURI" in token ? token.logoURI : undefined;

  return (
    <div className="relative">
      <div
        className={`${sizeClasses[size]} rounded-full ${
          logoURI
            ? "overflow-hidden"
            : "bg-muted border-2 border-border flex items-center justify-center text-xs font-semibold"
        }`}
      >
        {logoURI ? (
          <Image
            src={logoURI}
            alt={token.symbol}
            width={size === "lg" ? 40 : size === "md" ? 32 : 24}
            height={size === "lg" ? 40 : size === "md" ? 32 : 24}
            className="rounded-full w-full h-full object-cover"
          />
        ) : (
          <span className="text-muted-foreground">
            {token.symbol.slice(0, 2)}
          </span>
        )}
      </div>

      {showChainIcon && (
        <div
          className={`absolute -bottom-0.5 -right-0.5 ${chainSizeClasses[size]} rounded-full bg-background border border-border overflow-hidden`}
        >
          <img
            src={getChainIcon(token.chainName)}
            alt={token.chainName}
            className="w-full h-full object-contain"
            title={token.chainName}
          />
        </div>
      )}
    </div>
  );
};
