const cron = require('node-cron');
import ethers, { Contract } from 'ethers';
import dotenv from 'dotenv';
const abi = require('./abi.json');
import base32 from 'base32.js';
import { HmacSHA1 } from 'crypto-js';
dotenv.config();
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC, 137);
const signer = new ethers.Wallet(process.env.PV!, provider);
const SecurusContract = new ethers.Contract(
  '0x5dDBd4D534D29e1642E2f2a786d8e08771f5f9e2',
  abi,
  signer
);
cron.schedule(`*/30 * * * * *`, async () => {
  const code = HmacSHA1(
    String(genCode(process.env.USER_SEED!)),
    process.env.SEED!
  ).toString();
  const tx = await SecurusContract.changeOTP(code);
  console.log(tx);
});
function genCode(seed: string) {
  // console.log("called");
  const time = Date.now();
  // console.log("time----", time);

  const message = Math.floor(time / 30000);
  let decoder = new base32.Encoder({ type: 'crockford', lc: true });
  // console.log("seed", seed);
  const hash = HmacSHA1(message.toString(), decoder.write(seed).finalize());

  const code = hash.words[0] & 0x7fffffff;
  // const ec = AES.encrypt(
  //   seed,
  //   process.env.NEXT_PUBLIC_ENCRYPTION_KEY!
  // ).toString();
  // console.log("client: ", time, " ", hash.toString(), " ", code % 1000000);
  return code % 1000000;
}
