'use client';

import { useState, useCallback, useEffect } from 'react';

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;
    const stored = window.ethereum.selectedAddress;
    if (stored) setAddress(stored);

    const handler = (accounts: unknown) => {
      const list = accounts as string[];
      setAddress(list.length > 0 ? list[0] : null);
    };
    window.ethereum.on('accountsChanged', handler);
    return () => window.ethereum?.removeListener('accountsChanged', handler);
  }, []);

  const connect = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('MetaMask not found. Please install it.');
      return;
    }
    setIsConnecting(true);
    setError(null);
    try {
      const accounts = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];
      setAddress(accounts[0]);
      return accounts[0];
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection failed';
      setError(msg);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
  }, []);

  return {
    address,
    isConnecting,
    isConnected: !!address,
    error,
    connect,
    disconnect,
  };
}
