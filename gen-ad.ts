const ethers = require('ethers');
function main() {
  const a = ethers.Wallet.createRandom();
  console.log(a.getAddress(), ' ', a.privateKey);
}
main();
