const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

module.exports = {
  networks: {
    development: {
      host: process.env.BLOCKCHAIN_HOST || "localhost",
      port: process.env.BLOCKCHAIN_PORT || 8545,
      network_id: "*",
    },
    ropsten: {
      provider: () => new HDWalletProvider(process.env.ROPSTEN_MNENOMIC_PHRASE, process.env.ROPSTEN_PROVIDER),
      gasPrice: 10000000000,
      network_id: 3,
    },
    goerli: {
      provider: () => new HDWalletProvider(process.env.GOERLI_MNENOMIC_PHRASE, process.env.GOERLI_PROVIDER),
      gasPrice: 10000000000,
      network_id: 5,
    },
    mainnet: {
      provider: () => new HDWalletProvider(process.env.MAINNET_MNENOMIC_PHRASE, process.env.MAINNET_PROVIDER),
      gasPrice: 10000000000,
      network_id: 1,
    },
    mumbai: {
      provider: () => new HDWalletProvider(process.env.MUMBAI_MNEMONIC_PHRASE, process.env.MUMBAI_PROVIDER),
      gasPrice: 1000000000,
      network_id: 80001,
    },
  },
  plugins: ["solidity-coverage", "verify-on-etherscan"],
  compilers: {
    solc: {
      version: "0.8.8",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
