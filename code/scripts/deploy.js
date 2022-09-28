const { ethers } = require("hardhat");

async function main() {
  const dtubeContract = await ethers.getContractFactory("DTube");
  const deployedDtubeContract = await dtubeContract.deploy();
  await deployedDtubeContract.deployed();

  console.log("DTube Contract Address: ", deployedDtubeContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })