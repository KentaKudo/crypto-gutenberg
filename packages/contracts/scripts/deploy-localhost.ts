import { ethers, network } from "hardhat";
import { writeFile } from "fs";

import addresses from "../cache/addresses.json";

const updateCacheAddressJSONFile = (
  chainId: number,
  contractAddresses: {
    archive: string;
    botchan: string;
    winnieThePooh: string;
  }
) => {
  const updated: Record<string, any> = { ...addresses };
  updated[chainId.toString()] = contractAddresses;
  writeFile("./cache/addresses.json", JSON.stringify(updated), (err) => {
    if (err) throw err;
  });

  console.log(`./cache/addresses.json is updated`);
};

async function main() {
  const archiveFactory = await ethers.getContractFactory("Archive");
  const archive = await archiveFactory.deploy();

  await archive.deployed();

  console.log(`archive deployed to: ${archive.address}`);

  const Botchan = await ethers.getContractFactory("Botchan");
  const botchan = await Botchan.deploy(archive.address);

  await botchan.deployed();

  console.log(`botchan deployed to: ${botchan.address}`);

  const WinnieThePooh = await ethers.getContractFactory("WinnieThePooh");
  const winnieThePooh = await WinnieThePooh.deploy(archive.address);

  await winnieThePooh.deployed();

  console.log(`winnie-the-pooh deployed to: ${winnieThePooh.address}`);

  if (network.name === "localhost") {
    updateCacheAddressJSONFile(1337, {
      archive: archive.address,
      botchan: botchan.address,
      winnieThePooh: winnieThePooh.address,
    });
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
