"use client";

import { useTheme } from "next-themes";
import Image from "next/image";

export function SwapFooter() {
  const { theme, resolvedTheme } = useTheme();

  const getLogo = () => {
    if (resolvedTheme === "light" || theme === "rose") {
      return "/1inch_bw_black.svg";
    }

    return "/1inch_bw_white.svg";
  };

  return (
    <div className="pt-2 border-t border-border/20">
      <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
        <span>Powered by</span>
        <a href="https://1inch.io" target="_blank" rel="noopener noreferrer">
          <div className="flex items-center gap-2">
            <Image src={getLogo()} alt="1inch" width={120} height={60} />
          </div>
        </a>
      </div>
    </div>
  );
}
