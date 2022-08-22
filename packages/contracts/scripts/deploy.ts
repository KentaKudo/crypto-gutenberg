import { ethers } from "hardhat";

async function main() {
  const libraryFactory = await ethers.getContractFactory("Library");
  const library = await libraryFactory.deploy();

  await library.deployed();

  console.log(`library deployed to: ${library.address}`);

  const tokenFactory = await ethers.getContractFactory("Token");
  const token = await tokenFactory.deploy(library.address);

  await token.deployed();

  console.log(`token deployed to: ${token.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
