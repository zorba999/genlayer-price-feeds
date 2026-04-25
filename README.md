# GenLayer Price Feeds

Decentralized crypto price feeds powered by **GenLayer Intelligent Contracts** on the Bradbury Testnet. No oracles, no intermediaries — prices are fetched directly from CoinGecko by the contract and stored on-chain.

## Supported Tokens

BTC · ETH · SOL · BNB · AVAX · LINK · UNI

## Architecture

```
CoinGecko API
     ↓
GenLayer Intelligent Contract (Python)   ← validators reach consensus on prices
     ↓ stored on-chain
Next.js Frontend (genlayer-js SDK)       ← reads on-chain + shows live comparison
     ↓ deployed on
Vercel
```

## Getting Started

### 1. Deploy the Contract

1. Open [GenLayer Studio](https://studio.genlayer.com/)
2. Connect your wallet to **Bradbury Testnet**
3. Create a new contract and paste the contents of `contract/price_feed.py`
4. Deploy it — copy the contract address

### 2. Set Up the Frontend

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Add your contract address to .env.local
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...your-address...

# Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 3. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) and add `NEXT_PUBLIC_CONTRACT_ADDRESS` in the project environment variables.

## Contract Methods

| Method | Type | Description |
|--------|------|-------------|
| `get_all_prices()` | view | Returns all cached prices as JSON |
| `get_price(symbol)` | view | Returns cached price for one token |
| `get_supported_tokens()` | view | Returns list of supported symbols |
| `refresh_price(symbol)` | write | Fetches fresh price for one token |
| `refresh_all_prices()` | write | Fetches fresh prices for all tokens |

## How It Works

The Intelligent Contract uses `gl.nondet.web.request` to call the CoinGecko API. Multiple GenLayer validators independently fetch the price and reach **Optimistic Democratic Consensus** — they agree if prices are within a 2% tolerance of each other, accounting for real-time market fluctuations.

## Tech Stack

- **Contract**: Python + GenLayer SDK (`py-genlayer`)
- **Frontend**: Next.js 14, TailwindCSS, Lucide React
- **Blockchain SDK**: `genlayer-js`
- **Price Source**: CoinGecko Free API
- **Network**: GenLayer Bradbury Testnet
