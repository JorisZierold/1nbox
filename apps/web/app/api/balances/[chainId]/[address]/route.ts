import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chainId: string; address: string }> }
) {
  try {
    const { chainId, address } = await params;
    const url = `https://api.1inch.dev/balance/v1.2/${chainId}/balances/${address}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.ONEINCH_API_KEY}`,
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60,
        tags: [`balances-${chainId}-${address}`],
      },
    });

    // Try to get the response text first to see what we're getting
    const responseText = await response.text();

    if (!response.ok) {
      console.error(`Error response:`, responseText);

      if (process.env.NODE_ENV === "development") {
        return NextResponse.json({
          "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee": "1000000000000000000", // 1 ETH
          "0xa0b86a33e6441b8c4c8c8c8c8c8c8c8c8c8c8c8c8": "1000000000", // 1 USDC
        });
      }

      return NextResponse.json({});
    }

    // Try to parse the response as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error(`Failed to parse JSON response:`, parseError);
      return NextResponse.json({});
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Balance API error:", error);

    if (process.env.NODE_ENV === "development") {
      return NextResponse.json({
        "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee": "1000000000000000000",
        "0xa0b86a33e6441b8c4c8c8c8c8c8c8c8c8c8c8c8c8": "1000000000",
      });
    }

    return NextResponse.json({});
  }
}
