'use client';

import { Wallet, Zap } from 'lucide-react';

interface HeaderProps {
  walletAddress: string | null;
  isConnecting: boolean;
  walletError: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export default function Header({
  walletAddress,
  isConnecting,
  walletError,
  onConnect,
  onDisconnect,
}: HeaderProps) {
  const hasMetaMask = typeof window !== 'undefined' && !!window.ethereum;
  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`
    : null;

  return (
    <header className="border-b border-slate-800 bg-[#080b14]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-white text-sm">GenLayer</span>
            <span className="text-slate-400 text-sm"> / Price Feeds</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 border border-slate-800 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Bradbury Testnet
          </span>

          {walletAddress ? (
            <button
              onClick={onDisconnect}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm px-4 py-2 rounded-lg transition-colors"
            >
              <Wallet className="w-4 h-4" />
              {shortAddress}
            </button>
          ) : hasMetaMask ? (
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition-colors"
            >
              <Wallet className="w-4 h-4" />
              {isConnecting ? 'Connecting…' : 'Connect Wallet'}
            </button>
          ) : (
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-400 text-sm px-4 py-2 rounded-lg transition-colors"
            >
              <Wallet className="w-4 h-4" />
              Install MetaMask
            </a>
          )}
          {walletError && (
            <span className="text-xs text-red-400 max-w-xs truncate">{walletError}</span>
          )}
        </div>
      </div>
    </header>
  );
}
