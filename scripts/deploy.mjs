import { createClient, createAccount } from 'genlayer-js';
import { testnetBradbury } from 'genlayer-js/chains';
import { TransactionStatus } from 'genlayer-js/types';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) {
  console.error('❌  PRIVATE_KEY env variable is required.');
  process.exit(1);
}

const contractCode = readFileSync(
  join(__dirname, '../contract/price_feed.py'),
  'utf-8'
);

async function deploy() {
  const account = createAccount(PRIVATE_KEY);
  console.log(`\n📍 Deploying from: ${account.address}`);
  console.log(`🌐 Network: Bradbury Testnet\n`);

  const client = createClient({
    chain: testnetBradbury,
    account,
  });

  console.log('📤 Sending deploy transaction...');
  const deployHash = await client.deployContract({
    account,
    code: contractCode,
    args: [],
    value: BigInt(0),
  });

  console.log(`🔗 Tx hash: ${deployHash}`);
  console.log('⏳ Waiting for finalization (may take 1-2 min)...');

  const receipt = await client.waitForTransactionReceipt({
    hash: deployHash,
    status: TransactionStatus.ACCEPTED,
    retries: 60,
    interval: 5000,
  });

  const contractAddress =
    receipt?.consensus_data?.leader_receipt?.contract_address ||
    receipt?.data?.contract_address ||
    receipt?.contract_address ||
    'Check explorer with tx hash above';

  console.log('\n✅ Contract deployed successfully!');
  console.log(`📋 Contract address: ${contractAddress}`);
  console.log(`\nAdd this to your .env.local:`);
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}\n`);
}

deploy().catch((err) => {
  console.error('❌ Deploy failed:', err.message || err);
  process.exit(1);
});
