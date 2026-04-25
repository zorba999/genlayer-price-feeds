'use client';

import { useState, useCallback, useEffect } from 'react';
import { createClient } from 'genlayer-js';
import { testnetBradbury } from 'genlayer-js/chains';

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

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
      throw new Error('MetaMask not found. Please install it.');
    }
    setIsConnecting(true);
    try {
      const accounts = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];

      const client = createClient({
        chain: testnetBradbury,
        account: accounts[0] as `0x${string}`,
        provider: window.ethereum,
      });
      await client.connect('testnetBradbury');
      setAddress(accounts[0]);
      return accounts[0];
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
    connect,
    disconnect,
  };
}
