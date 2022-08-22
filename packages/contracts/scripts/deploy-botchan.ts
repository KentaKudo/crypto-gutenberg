import { ethers } from "hardhat";

async function main() {
  const libraryFactory = await ethers.getContractFactory("Library");
  const library = await libraryFactory.deploy();

  await library.deployed();

  console.log(`library deployed to: ${library.address}`);

  const Botchan = await ethers.getContractFactory("Botchan");
  const botchan = await Botchan.deploy(library.address);

  await botchan.deployed();

  console.log(`botchan deployed to: ${botchan.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
