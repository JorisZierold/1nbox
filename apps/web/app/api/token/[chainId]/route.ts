import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chainId: string }> }
) {
  try {
    const { chainId } = await params;

    const response = await fetch(
      `https://api.1inch.dev/token/v1.2/${chainId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ONEINCH_API_KEY}`,
          "Content-Type": "application/json",
        },
        next: {
          revalidate: 3600 * 24, // Cache for 1 day (token metadata rarely changes)
          tags: [`token-${chainId}`], // Tag for cache invalidation
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch token metadata: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Token metadata API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch token metadata" },
      { status: 500 }
    );
  }
}
