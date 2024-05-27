// const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const hre = require("hardhat");

async function main() {
  const Paypal = await hre.ethers.getContractFactory("Paypal");
  const paypal = await Paypal.deploy();
  // await paypal.deployed();
  await paypal.waitForDeployment()
  
  console.log("Paypal deployed to:", await paypal.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

