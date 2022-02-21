const EvmOps = artifacts.require("EvmOps");

module.exports = function (deployer, networks, accounts) {
  console.log(`accounts: ` + accounts[0].toLowerCase())
  console.log(`networks: ` + networks)
  deployer.deploy(EvmOps, {from: accounts[0].toLowerCase()});
};
