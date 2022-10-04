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

// https://goerli.etherscan.io/address/0x9F4aba259F3d188401eD777b7Ec806EaB2ad0C73
// https://goerli.etherscan.io/address/0x245ABE971741E730850Ec8B3E054Cd83b8cA717f
// V0P1 https://goerli.etherscan.io/address/0xb7CC15bf4Ae2cE8C4E4935bEEf4bf2dA4D2ea0F1