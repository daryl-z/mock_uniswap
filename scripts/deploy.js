// scripts/deploy.js
async function main() {
  // 获取当前账户（部署者）
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 部署 MockERC20 合约
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const mockERC20 = await MockERC20.deploy(ethers.parseUnits("1000000", 18)); // 初始发行 1000000 MERC20
  console.log("MockERC20 deployed to:", mockERC20.address);

  // 部署 MOCK_USDC 合约
  const MOCK_USDC = await ethers.getContractFactory("MOCK_USDC");
  const mockUSDC = await MOCK_USDC.deploy(ethers.parseUnits("1000000", 6)); // 初始发行 1000000 MOCK_USDC
  console.log("MOCK_USDC deployed to:", mockUSDC.address);

  // 部署 UniswapV2Pair 合约
  const UniswapV2Pair = await ethers.getContractFactory("UniswapV2Pair");
  const uniswapV2Pair = await UniswapV2Pair.deploy(
    mockERC20.address,
    mockUSDC.address
  );
  console.log("UniswapV2Pair deployed to:", uniswapV2Pair.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
