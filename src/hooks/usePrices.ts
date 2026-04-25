'use client';

import { useState, useCallback, useEffect } from 'react';
import { createClient } from 'genlayer-js';
import { testnetBradbury } from 'genlayer-js/chains';
import { TransactionStatus } from 'genlayer-js/types';
import type { CalldataEncodable } from 'genlayer-js/types';
import type { PricesMap, LivePricesMap, TxStatus } from '@/lib/types';

export function usePrices(contractAddress: string) {
  const [onchainPrices, setOnchainPrices] = useState<PricesMap>({});
  const [livePrices, setLivePrices] = useState<LivePricesMap>({});
  const [loadingOnchain, setLoadingOnchain] = useState(false);
  const [txStatus, setTxStatus] = useState<TxStatus>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  const fetchLivePrices = useCallback(async () => {
    try {
      const res = await fetch('/api/prices');
      if (res.ok) setLivePrices(await res.json());
    } catch {
      // silently fail — live prices are optional
    }
  }, []);

  const fetchOnchainPrices = useCallback(async () => {
    if (!contractAddress || contractAddress.length < 10) return;
    setLoadingOnchain(true);
    try {
      const client = createClient({ chain: testnetBradbury });
      const result = await client.readContract({
        address: contractAddress as `0x${string}`,
        functionName: 'get_all_prices',
        args: [],
      });
      setOnchainPrices(JSON.parse(result as string));
    } catch {
      setOnchainPrices({});
    } finally {
      setLoadingOnchain(false);
    }
  }, [contractAddress]);

  useEffect(() => {
    fetchLivePrices();
    const interval = setInterval(fetchLivePrices, 60_000);
    return () => clearInterval(interval);
  }, [fetchLivePrices]);

  useEffect(() => {
    fetchOnchainPrices();
  }, [fetchOnchainPrices]);

  const sendTx = useCallback(
    async (walletAddress: string, fnName: string, args: CalldataEncodable[]) => {
      if (!contractAddress || !walletAddress) return;
      if (typeof window === 'undefined' || !window.ethereum) return;

      setTxStatus('pending');
      setTxHash(null);
      setTxError(null);

      try {
        const writeClient = createClient({
          chain: testnetBradbury,
          account: walletAddress as `0x${string}`,
          provider: window.ethereum,
        });

        const hash = (await writeClient.writeContract({
          address: contractAddress as `0x${string}`,
          functionName: fnName,
          args,
          value: BigInt(0),
        })) as `0x${string}`;

        setTxHash(hash);
        setTxStatus('submitted');

        const readClient = createClient({ chain: testnetBradbury });
        await readClient.waitForTransactionReceipt({
          hash: hash as unknown as `0x${string}` & { length: 66 },
          status: TransactionStatus.FINALIZED,
        });

        setTxStatus('finalized');
        await fetchOnchainPrices();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Transaction failed';
        setTxError(msg);
        setTxStatus('error');
      }
    },
    [contractAddress, fetchOnchainPrices],
  );

  const refreshAll = useCallback(
    (walletAddress: string) => sendTx(walletAddress, 'refresh_all_prices', [] as CalldataEncodable[]),
    [sendTx],
  );

  const refreshSingle = useCallback(
    (walletAddress: string, symbol: string) =>
      sendTx(walletAddress, 'refresh_price', [symbol] as CalldataEncodable[]),
    [sendTx],
  );

  const resetTxStatus = useCallback(() => {
    setTxStatus('idle');
    setTxHash(null);
    setTxError(null);
  }, []);

  return {
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
  };
}
