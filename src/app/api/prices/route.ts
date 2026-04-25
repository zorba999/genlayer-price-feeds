import { NextResponse } from 'next/server';

const CG_IDS = 'bitcoin,ethereum,solana,binancecoin,avalanche-2,chainlink,uniswap';

const SYMBOL_MAP: Record<string, string> = {
  BTC:  'bitcoin',
  ETH:  'ethereum',
  SOL:  'solana',
  BNB:  'binancecoin',
  AVAX: 'avalanche-2',
  LINK: 'chainlink',
  UNI:  'uniswap',
};

export async function GET() {
  try {
    const apiKey = process.env.COINGECKO_API_KEY;
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (apiKey) headers['x-cg-demo-api-key'] = apiKey;

    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${CG_IDS}&vs_currencies=usd&include_24hr_change=true`;
    const res = await fetch(url, { headers, next: { revalidate: 60 } });

    if (!res.ok) {
      return NextResponse.json({ error: 'CoinGecko unavailable' }, { status: 502 });
    }

    const raw = await res.json();
    const normalized: Record<string, { usd: number; usd_24h_change: number }> = {};

    for (const [sym, cgId] of Object.entries(SYMBOL_MAP)) {
      if (raw[cgId]) normalized[sym] = raw[cgId];
    }

    return NextResponse.json(normalized);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
