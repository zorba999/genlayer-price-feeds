'use client';

import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { TOKEN_INFO } from '@/lib/constants';
import type { LivePriceData } from '@/lib/types';

interface PriceCardProps {
  symbol: string;
  onchainPrice: string | undefined;
  liveData: LivePriceData | undefined;
  walletConnected: boolean;
  contractSet: boolean;
  isTxPending: boolean;
  onRefresh: (symbol: string) => void;
}

export default function PriceCard({
  symbol,
  onchainPrice,
  liveData,
  walletConnected,
  contractSet,
  isTxPending,
  onRefresh,
}: PriceCardProps) {
  const info = TOKEN_INFO[symbol];
  const change = liveData?.usd_24h_change ?? null;
  const isUp = change !== null && change >= 0;

  const formatPrice = (p: string | number) => {
    const n = typeof p === 'string' ? parseFloat(p) : p;
    if (isNaN(n)) return '—';
    return n >= 1
      ? n.toLocaleString('en-US', { maximumFractionDigits: 2 })
      : n.toFixed(6);
  };

  return (
    <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-5 flex flex-col gap-4 hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ backgroundColor: `${info.color}20`, border: `1px solid ${info.color}40` }}
          >
            <span style={{ color: info.color }}>{symbol.slice(0, 1)}</span>
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{symbol}</p>
            <p className="text-slate-500 text-xs">{info.name}</p>
          </div>
        </div>

        {change !== null && (
          <div
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
              isUp
                ? 'bg-emerald-400/10 text-emerald-400'
                : 'bg-red-400/10 text-red-400'
            }`}
          >
            {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(change).toFixed(2)}%
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-slate-500">On-chain</span>
          <span className="text-lg font-bold text-white font-mono">
            {onchainPrice ? `$${formatPrice(onchainPrice)}` : '—'}
          </span>
        </div>
        {liveData && (
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-600">Live</span>
            <span className="text-sm text-slate-400 font-mono">
              ${formatPrice(liveData.usd)}
            </span>
          </div>
        )}
      </div>

      <button
        onClick={() => onRefresh(symbol)}
        disabled={!walletConnected || !contractSet || isTxPending}
        className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 text-xs py-2 rounded-lg transition-colors"
      >
        <RefreshCw className={`w-3 h-3 ${isTxPending ? 'animate-spin' : ''}`} />
        {!walletConnected ? 'Connect wallet to refresh' : 'Refresh price'}
      </button>
    </div>
  );
}
