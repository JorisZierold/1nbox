import { NextResponse } from "next/server";
import { oneInchGET } from "@/lib/oneinch";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const chainId = Number(searchParams.get("chainId"));
    const tokenAddress = searchParams.get("tokenAddress")!;
    const walletAddress = searchParams.get("walletAddress")!;

    // Validate required parameters
    if (!chainId || !tokenAddress || !walletAddress) {
      return NextResponse.json(
        {
          error: "Missing required parameters",
          chainId: chainId || "missing",
          tokenAddress: tokenAddress || "missing",
          walletAddress: walletAddress || "missing",
        },
        { status: 400 }
      );
    }

    // Validate wallet address format (basic check)
    if (!walletAddress.startsWith("0x") || walletAddress.length !== 42) {
      return NextResponse.json(
        {
          error: "Invalid wallet address format",
          walletAddress,
        },
        { status: 400 }
      );
    }

    // Log for debugging
    console.log(
      `Allowance request: chainId=${chainId}, token=${tokenAddress}, wallet=${walletAddress}`
    );

    const data = await oneInchGET(chainId, "/approve/allowance", {
      tokenAddress,
      walletAddress,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Allowance API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch allowance", details: String(error) },
      { status: 500 }
    );
  }
}
