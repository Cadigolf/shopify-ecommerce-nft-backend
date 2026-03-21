require('dotenv').config();
const bs58 = require('bs58').default;
const { Keypair } = require('@solana/web3.js');
const key = process.env.SOLANA_WALLET_PRIVATEKEY;
if (!key) { console.log('SOLANA_WALLET_PRIVATEKEY not found in .env'); process.exit(1); }
const kp = Keypair.fromSecretKey(bs58.decode(key));
console.log('Public key:', kp.publicKey.toString());
