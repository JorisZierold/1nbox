import { NextResponse } from "next/server";
import { oneInchGET } from "@/lib/oneinch";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const chainId = Number(searchParams.get("chainId"));
    const tokenAddress = searchParams.get("tokenAddress")!;
    const amount = searchParams.get("amount")!;

    // Validate required parameters
    if (!chainId || !tokenAddress || !amount) {
      return NextResponse.json(
        { error: "Missing required parameters: chainId, tokenAddress, amount" },
        { status: 400 }
      );
    }

    const data = await oneInchGET(chainId, "/approve/transaction", {
      tokenAddress,
      amount,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching approve transaction:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch approve transaction",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
