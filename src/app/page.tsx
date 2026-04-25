'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import PriceGrid from '@/components/PriceGrid';
import ContractSetup from '@/components/ContractSetup';
import TransactionStatus from '@/components/TransactionStatus';
import { useWallet } from '@/hooks/useWallet';
import { usePrices } from '@/hooks/usePrices';

export default function Home() {
  const [contractAddress, setContractAddress] = useState('');
  const [hasMetaMask, setHasMetaMask] = useState(true);

  useEffect(() => {
    const env = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    if (env && env !== '0x') setContractAddress(env);
    setHasMetaMask(!!window.ethereum);
  }, []);

  const { address, isConnecting, error: walletError, connect, disconnect } = useWallet();

  const {
    onchainPrices,
    livePrices,
    loadingOnchain,
    txStatus,
    txHash,
    txError,
    fetchOnchainPrices,
    refreshAll,
    refreshSingle,
    resetTxStatus,
  } = usePrices(contractAddress);

  const handleRefreshAll = () => {
    if (address) refreshAll(address);
  };

  const handleRefreshSingle = (symbol: string) => {
    if (address) refreshSingle(address, symbol);
  };

  return (
    <main className="min-h-screen bg-[#080b14]">
      <Header
        walletAddress={address}
        isConnecting={isConnecting}
        walletError={walletError}
        hasMetaMask={hasMetaMask}
        onConnect={connect}
        onDisconnect={disconnect}
      />

      {!hasMetaMask && (
        <div className="bg-orange-500/10 border-b border-orange-500/20 px-4 py-2 text-center text-sm text-orange-400">
          MetaMask ma kaynch — ftah had page f Chrome/Firefox lli 3ndu MetaMask bach tqder t-refresh prices ·{' '}
          <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-300">Install MetaMask</a>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-5">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Bradbury Testnet
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            On-Chain{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Price Feeds
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Crypto prices fetched from CoinGecko and stored on-chain via{' '}
            <span className="text-white font-medium">GenLayer Intelligent Contracts</span>.
            No oracles. No intermediaries.
          </p>
        </div>

        <ContractSetup
          contractAddress={contractAddress}
          loading={loadingOnchain}
          onAddressChange={setContractAddress}
          onRefresh={fetchOnchainPrices}
        />

        <PriceGrid
          onchainPrices={onchainPrices}
          livePrices={livePrices}
          loadingOnchain={loadingOnchain}
          walletConnected={!!address}
          contractAddress={contractAddress}
          txStatus={txStatus}
          onRefreshAll={handleRefreshAll}
          onRefreshSingle={handleRefreshSingle}
        />
      </div>

      <TransactionStatus
        status={txStatus}
        txHash={txHash}
        txError={txError}
        onClose={resetTxStatus}
      />
    </main>
  );
}
