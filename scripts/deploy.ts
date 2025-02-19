import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const mockERC20 = await MockERC20.deploy(
    ethers.utils.parseUnits("1000000", 18)
  );
  console.log("MockERC20 deployed to:", mockERC20.address);

  const MOCK_USDC = await ethers.getContractFactory("MOCK_USDC");
  const mockUSDC = await MOCK_USDC.deploy(
    ethers.utils.parseUnits("1000000", 6)
  );
  console.log("MOCK_USDC deployed to:", mockUSDC.address);

  const UniswapV2Pair = await ethers.getContractFactory("UniswapV2Pair");
  const uniswapV2Pair = await UniswapV2Pair.deploy(
    mockERC20.address,
    mockUSDC.address
  );
  console.log("UniswapV2Pair deployed to:", uniswapV2Pair.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
