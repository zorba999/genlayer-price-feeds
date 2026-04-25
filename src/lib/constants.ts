export const TOKEN_INFO: Record<string, { name: string; color: string }> = {
  BTC:  { name: 'Bitcoin',    color: '#f7931a' },
  ETH:  { name: 'Ethereum',   color: '#627eea' },
  SOL:  { name: 'Solana',     color: '#9945ff' },
  BNB:  { name: 'BNB',        color: '#f3ba2f' },
  AVAX: { name: 'Avalanche',  color: '#e84142' },
  LINK: { name: 'Chainlink',  color: '#2a5ada' },
  UNI:  { name: 'Uniswap',    color: '#ff007a' },
};

export const SUPPORTED_TOKENS = Object.keys(TOKEN_INFO);

export const BRADBURY_EXPLORER = 'https://explorer.testnet-bradbury.genlayer.com';
