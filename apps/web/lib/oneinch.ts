// server-side fetcher for 1inch API

const BASE = "https://api.1inch.dev/swap/v6.1";

function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean>
) {
  const url = new URL(path);
  if (params) {
    Object.entries(params).forEach(([k, v]) =>
      url.searchParams.set(k, String(v))
    );
  }
  return url.toString();
}

export async function oneInchGET(
  chainId: number,
  endpointPath: string,
  params?: Record<string, any>
) {
  const key = process.env.ONEINCH_API_KEY!;
  if (!key) throw new Error("Missing ONEINCH_API_KEY");

  const url = buildUrl(`${BASE}/${chainId}${endpointPath}`, params);

  const res = await fetch(url, {
    headers: { Accept: "application/json", Authorization: `Bearer ${key}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`1inch ${endpointPath} failed: ${res.status} ${body}`);
  }
  return res.json();
}
