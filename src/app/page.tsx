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

  useEffect(() => {
    const env = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    if (env && env !== '0x') setContractAddress(env);
  }, []);

  const { address, isConnecting, connect, disconnect } = useWallet();

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
        onConnect={connect}
        onDisconnect={disconnect}
      />

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
