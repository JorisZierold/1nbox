import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const { searchParams } = new URL(request.url);
    const chainId = searchParams.get("chainId") || "1";
    const limit = searchParams.get("limit") || "100";

    console.log(`Fetching history for ${address} on chain ${chainId}`);
    console.log(`API Key present: ${!!process.env.ONEINCH_API_KEY}`);

    const url = `https://api.1inch.dev/history/v2.0/history/${address}/events?limit=${limit}&chainId=${chainId}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.ONEINCH_API_KEY}`,
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 300, // Cache for 5 minutes
      },
    });

    console.log(`History API response status: ${response.status}`);

    if (!response.ok) {
      if (response.status === 404) {
        console.log("No history found for address");
        return NextResponse.json({ items: [], cache_counter: 0 });
      }

      const errorText = await response.text();
      console.error("History API error:", errorText);
      throw new Error(`History API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Fetched ${data.items?.length || 0} history items`);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("History fetch error:", error);

    return NextResponse.json(
      { error: "Failed to fetch transaction history" },
      { status: 500 }
    );
  }
}
