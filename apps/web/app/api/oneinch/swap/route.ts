import { NextResponse } from "next/server";
import { oneInchGET } from "@/lib/oneinch";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const chainId = Number(searchParams.get("chainId"));
    const params = Object.fromEntries(searchParams.entries());

    // Build the API params object, only including gasPrice if it's valid
    const apiParams: Record<string, any> = {
      src: params.src,
      dst: params.dst,
      amount: params.amount,
      from: params.from,
      origin: params.origin ?? params.from,
      slippage: params.slippage ?? "1",
      allowPartialFill: params.allowPartialFill ?? "false",
    };

    // Only add gasPrice if it's provided and valid
    if (params.gasPrice && params.gasPrice !== "undefined") {
      apiParams.gasPrice = params.gasPrice;
    }

    console.log(`Swap request: chainId=${chainId}`, apiParams);

    // Required by API: src, dst, amount, from, origin, slippage
    const data = await oneInchGET(chainId, "/swap", apiParams);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Swap API error:", error);
    return NextResponse.json(
      {
        error: "Failed to build swap",
        details: String(error),
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
