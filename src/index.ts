const cron = require('node-cron');
// import { ethers } from 'ethers';
const ethers = require('ethers');
const dotenv = require('dotenv');
const abi = require('./abi.json');
const base32 = require('base32.js');
const cryptojs = require('crypto-js');
const { HmacSHA1 } = cryptojs;
dotenv.config();
const provider = new ethers.providers.JsonRpcProvider(
  'https://polygon-mumbai.g.alchemy.com/v2/-XiAniAE0vW5WjcliOiC1D_0muNwiYSr',
  80001
);
const signer = new ethers.Wallet(process.env.PV!, provider);
const SecurusContract = new ethers.Contract(
  '0x24A87513B3B4C6f7290010c741222e3Ae8F764b0',
  abi,
  signer
);
console.log('Contract Address:', SecurusContract.address);
cron.schedule(`*/30 * * * * *`, async () => {
  console.log('running a task every 30 seconds');
  const code = HmacSHA1(
    String(genCode(process.env.USER_SEED!)),
    process.env.SEED!
  ).toString();
  console.log('code', code);
  const tx = await SecurusContract.changeOTP(code);
  console.log(tx.hash);
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
