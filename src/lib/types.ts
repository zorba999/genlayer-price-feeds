export interface PricesMap {
  [symbol: string]: string;
}

export interface LivePriceData {
  usd: number;
  usd_24h_change: number;
}

export interface LivePricesMap {
  [symbol: string]: LivePriceData;
}

export type TxStatus = 'idle' | 'pending' | 'submitted' | 'finalized' | 'error';
