import { createClient } from 'genlayer-js';
import { testnetBradbury } from 'genlayer-js/chains';

const TX_HASH = process.argv[2] || '0xf0c42f60dd4a95dabd67dd18800be7031cf9180b7fdd86c88ca6eba12bbd5908';

async function getAddress() {
  const client = createClient({ chain: testnetBradbury });
  console.log(`\n🔍 Reading receipt for: ${TX_HASH}\n`);

  const tx = await client.getTransaction({ hash: TX_HASH });
  const serializable = JSON.parse(
    JSON.stringify(tx, (_, v) => (typeof v === 'bigint' ? v.toString() : v))
  );
  console.log('📋 Transaction status:', serializable?.status ?? serializable?.result);

  const addr =
    serializable?.consensus_data?.leader_receipt?.contract_address ||
    serializable?.data?.contract_address ||
    serializable?.contract_address ||
    serializable?.to;

  console.log('Status name:', serializable?.statusName);
  console.log('Result name:', serializable?.resultName);
  console.log('Recipient:', serializable?.recipient);

  const addrFromRecipient = serializable?.recipient && serializable.recipient !== '0x0000000000000000000000000000000000000000'
    ? serializable.recipient : null;

  const contractAddr =
    addr ||
    addrFromRecipient ||
    serializable?.txDataDecoded?.contract_address ||
    serializable?.txExecutionResult?.contract_address;

  if (contractAddr) {
    console.log(`\n✅ Contract address: ${contractAddr}`);
    console.log(`\nAdd to .env.local:\nNEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddr}\n`);
  } else {
    console.log('\n⏳ Not finalized yet. Relevant fields:');
    console.log('txDataDecoded:', JSON.stringify(serializable?.txDataDecoded, null, 2));
    console.log('txExecutionResult:', JSON.stringify(serializable?.txExecutionResult, null, 2));
  }
}

getAddress().catch(console.error);
