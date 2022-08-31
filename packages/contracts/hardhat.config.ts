import { HardhatUserConfig } from "hardhat/config";
import dotenv from "dotenv";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.16",
  networks: {
    hardhat: {
      chainId: 1337,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "GBP",
    coinmarketcap: process.env.COIN_MARKET_CAP_API_KEY,
  },
};

export default config;
