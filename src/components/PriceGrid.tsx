'use client';

import { RefreshCw } from 'lucide-react';
import PriceCard from './PriceCard';
import { SUPPORTED_TOKENS } from '@/lib/constants';
import type { PricesMap, LivePricesMap, TxStatus } from '@/lib/types';

interface PriceGridProps {
  onchainPrices: PricesMap;
  livePrices: LivePricesMap;
  loadingOnchain: boolean;
  walletConnected: boolean;
  contractAddress: string;
  txStatus: TxStatus;
  onRefreshAll: () => void;
  onRefreshSingle: (symbol: string) => void;
}

export default function PriceGrid({
  onchainPrices,
  livePrices,
  loadingOnchain,
  walletConnected,
  contractAddress,
  txStatus,
  onRefreshAll,
  onRefreshSingle,
}: PriceGridProps) {
  const contractSet = !!contractAddress && contractAddress.length > 10;
  const isTxPending = txStatus === 'pending' || txStatus === 'submitted';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-semibold text-lg">Crypto Prices</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {Object.keys(onchainPrices).length} / {SUPPORTED_TOKENS.length} tokens cached on-chain
          </p>
        </div>
        <button
          onClick={onRefreshAll}
          disabled={!walletConnected || !contractSet || isTxPending}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isTxPending ? 'animate-spin' : ''}`} />
          {isTxPending ? 'Refreshing…' : 'Refresh All'}
        </button>
      </div>

      {loadingOnchain && Object.keys(onchainPrices).length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {SUPPORTED_TOKENS.map((sym) => (
            <div
              key={sym}
              className="bg-[#0d1117] border border-slate-800 rounded-xl p-5 h-44 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {SUPPORTED_TOKENS.map((sym) => (
            <PriceCard
              key={sym}
              symbol={sym}
              onchainPrice={onchainPrices[sym]}
              liveData={livePrices[sym]}
              walletConnected={walletConnected}
              contractSet={contractSet}
              isTxPending={isTxPending}
              onRefresh={onRefreshSingle}
            />
          ))}
        </div>
      )}

      {!contractSet && (
        <div className="mt-6 text-center py-12 bg-[#0d1117] border border-slate-800 rounded-xl">
          <p className="text-slate-500 text-sm">
            Enter your contract address above to view on-chain prices.
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Deploy <code className="text-indigo-400">contract/price_feed.py</code> via GenLayer Studio first.
          </p>
        </div>
      )}
    </div>
  );
}
