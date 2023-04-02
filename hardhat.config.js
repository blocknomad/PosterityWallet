/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const INFURA_GOERLI_URL = process.env.INFURA_GOERLI_URL;

module.exports = {

  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      }
    ]
  },  
  networks: {
    goerli: {
      url: INFURA_GOERLI_URL,
      accounts: [`0x${WALLET_PRIVATE_KEY}`]
    },
  },
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN_API_KEY,
    } 
  },
};
