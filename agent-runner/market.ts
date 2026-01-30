import { connection, wallet, ROGUECLAW_MINT } from "./wallet";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export interface MarketData {
  price: number | null;
  priceChange24h: number | null;
  volume24h: number | null;
  marketCap: number | null;
  holders: number | null;
  walletSOL: number;
  trend: "bullish" | "bearish" | "neutral";
}

async function fetchJupiterPrice(): Promise<{ price: number; change24h: number } | null> {
  if (!ROGUECLAW_MINT) return null;
  try {
    const res = await fetch(
      `https://price.jup.ag/v6/price?ids=${ROGUECLAW_MINT.toString()}`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const info = data?.data?.[ROGUECLAW_MINT.toString()];
    if (!info) return null;
    return {
      price: info.price ?? 0,
      change24h: info.priceChange24h ?? 0,
    };
  } catch {
    return null;
  }
}

async function fetchDexscreener(): Promise<{ volume24h: number; marketCap: number; holders: number } | null> {
  if (!ROGUECLAW_MINT) return null;
  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${ROGUECLAW_MINT.toString()}`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const pair = data?.pairs?.[0];
    if (!pair) return null;
    return {
      volume24h: pair.volume?.h24 ?? 0,
      marketCap: pair.marketCap ?? 0,
      holders: pair.info?.holders ?? 0,
    };
  } catch {
    return null;
  }
}

function determineTrend(change24h: number | null, volume24h: number | null): MarketData["trend"] {
  if (change24h === null) return "neutral";
  if (change24h > 5) return "bullish";
  if (change24h < -5) return "bearish";
  return "neutral";
}

export async function fetchMarketData(): Promise<MarketData> {
  const [jupiterData, dexData, lamports] = await Promise.allSettled([
    fetchJupiterPrice(),
    fetchDexscreener(),
    connection.getBalance(wallet.publicKey),
  ]);

  const price = jupiterData.status === "fulfilled" ? jupiterData.value?.price ?? null : null;
  const change24h = jupiterData.status === "fulfilled" ? jupiterData.value?.change24h ?? null : null;
  const dex = dexData.status === "fulfilled" ? dexData.value : null;
  const walletSOL = lamports.status === "fulfilled"
    ? lamports.value / LAMPORTS_PER_SOL
    : 0;

  return {
    price,
    priceChange24h: change24h,
    volume24h: dex?.volume24h ?? null,
    marketCap: dex?.marketCap ?? null,
    holders: dex?.holders ?? null,
    walletSOL,
    trend: determineTrend(change24h, dex?.volume24h ?? null),
  };
}

export function formatMarketContext(data: MarketData): string {
  return `
Current market snapshot for $ROGUECLAW:
- Price: ${data.price !== null ? `$${data.price.toFixed(8)}` : "not yet available"}
- 24h change: ${data.priceChange24h !== null ? `${data.priceChange24h > 0 ? "+" : ""}${data.priceChange24h.toFixed(2)}%` : "unknown"}
- 24h volume: ${data.volume24h !== null ? `$${data.volume24h.toLocaleString()}` : "unknown"}
- Market cap: ${data.marketCap !== null ? `$${data.marketCap.toLocaleString()}` : "unknown"}
- Holders: ${data.holders !== null ? data.holders.toLocaleString() : "unknown"}
- Agent wallet balance: ${data.walletSOL.toFixed(4)} SOL
- Market trend: ${data.trend}
`.trim();
}
