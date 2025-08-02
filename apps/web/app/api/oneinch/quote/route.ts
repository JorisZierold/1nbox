import { NextResponse } from "next/server";
import { oneInchGET } from "@/lib/oneinch";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const chainId = Number(searchParams.get("chainId"));
    const src = searchParams.get("src")!;
    const dst = searchParams.get("dst")!;
    const amount = searchParams.get("amount")!;
    const gasPrice = searchParams.get("gasPrice") || undefined;

    // Log the request for debugging
    console.log(
      `Quote request: chainId=${chainId}, src=${src}, dst=${dst}, amount=${amount}`
    );

    const data = await oneInchGET(chainId, "/quote", {
      src,
      dst,
      amount,
      includeTokensInfo: true,
      includeGas: true,
      ...(gasPrice ? { gasPrice } : {}),
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Quote API error:", error);
    return NextResponse.json(
      {
        error: "Failed to get quote",
        details: String(error),
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
