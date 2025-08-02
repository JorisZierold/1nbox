"use client";

import { fmt } from "@/lib/formats";
import { fromUnits } from "@/lib/units";
import type { QuoteResponse } from "@/types/swap";
import { Token } from "@/types/tokens";

export function QuoteSummary({
  quote,
  src,
  dst,
}: {
  quote?: QuoteResponse;
  src?: Token;
  dst?: Token;
}) {
  if (!quote || !src || !dst) return null;
  const out = fromUnits(quote.dstAmount, dst.decimals);
  return (
    <div className="rounded border p-3 text-sm">
      <div>
        Expected out:{" "}
        <b>
          {fmt.num(Number(out))} {dst.symbol}
        </b>
      </div>
      {quote.gas && (
        <div className="text-gray-500">Route gas (rough): {quote.gas}</div>
      )}
    </div>
  );
}
