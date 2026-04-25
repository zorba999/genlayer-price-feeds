import { createClient } from 'genlayer-js';
import { testnetBradbury } from 'genlayer-js/chains';

const TX_HASH = process.argv[2] || '0xf0c42f60dd4a95dabd67dd18800be7031cf9180b7fdd86c88ca6eba12bbd5908';
const INTERVAL = 8000;

async function watch() {
  const client = createClient({ chain: testnetBradbury });
  console.log(`\n👁  Watching: ${TX_HASH}\n`);

  let lastStatus = '';
  while (true) {
    try {
      const tx = await client.getTransaction({ hash: TX_HASH });
      const s = JSON.parse(
        JSON.stringify(tx, (_, v) => (typeof v === 'bigint' ? v.toString() : v))
      );
      const statusName = s?.statusName || String(s?.status);
      const resultName = s?.resultName || '';

      if (statusName !== lastStatus) {
        const ts = new Date().toLocaleTimeString();
        console.log(`[${ts}] Status: ${statusName}  |  Result: ${resultName}`);
        lastStatus = statusName;
      }

      if (statusName === 'FINALIZED' || statusName === 'ACCEPTED' || resultName === 'AGREE') {
        console.log(`\n✅ Contract LIVE at: ${s?.recipient}`);
        console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${s?.recipient}\n`);
        process.exit(0);
      }

      if (statusName === 'CANCELED' || statusName === 'REJECTED') {
        console.log(`\n❌ Transaction ${statusName}`);
        process.exit(1);
      }
    } catch (err) {
      console.error('Poll error:', err.message);
    }
    await new Promise(r => setTimeout(r, INTERVAL));
  }
}

watch();
