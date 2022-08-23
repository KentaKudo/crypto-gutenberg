import { ethers, network } from "hardhat";
import { writeFile } from "fs";

import addresses from "../cache/addresses.json";

const updateCacheAddressJSONFile = (
  chainId: number,
  contractAddresses: {
    library: string;
    botchan: string;
  }
) => {
  const updated: Record<string, any> = { ...addresses };
  updated[chainId.toString()] = contractAddresses;
  writeFile("./cache/addresses.json", JSON.stringify(updated), (err) => {
    throw err;
  });

  console.log(`./cache/addresses.json is updated`);
};

async function main() {
  const libraryFactory = await ethers.getContractFactory("Library");
  const library = await libraryFactory.deploy();

  await library.deployed();

  console.log(`library deployed to: ${library.address}`);

  const Botchan = await ethers.getContractFactory("Botchan");
  const botchan = await Botchan.deploy(library.address);

  await botchan.deployed();

  console.log(`botchan deployed to: ${botchan.address}`);

  const chainId = network.config.chainId;
  if (chainId) {
    updateCacheAddressJSONFile(chainId, {
      library: library.address,
      botchan: botchan.address,
    });
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
